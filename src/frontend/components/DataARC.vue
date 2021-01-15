<template>
  <div>
    <div class="sticky-top">
      <b-col>
        <search-dialog
          id="search-dialog"
          :results-count="resultsCount"
          :filter-count="filterCount"
          :results="results"
          :filters="compiledFilters"
          :concept-filters="conceptFilters"
          :keyword-filters="keywordFilters"
          @removed="removeFilter"
        />
      </b-col>
    </div>
    <timeline-section
      id="temporal-section"
      v-model="temporalFilters"
      :filters="compiledFilters"
      :triggers="filterCount"
      :sample-range="sampleRange"
      @load-video="setPath"
    />
    <map-section
      id="spatial-section"
      v-model="spatialFilter"
      :filters="compiledFilters"
      @load-video="setPath"
      @removed="removeFilter"
    />
    <concept-section
      id="concept-section"
      :filters="compiledFilters"
      :filter-count="filterCount"
      :sample-concept="sampleConcept"
      @filtered="processFilter"
      @removed="removeFilter"
      @load-video="setPath"
    />
    <keyword-section
      id="keyword-section"
      ref="keyword"
      v-model="keywordFilters"
    />
    <filter-section
      id="filter-section"
      :filters="filters"
      :filter-count="filterCount"
      :concept-filters="conceptFilters"
      @removed="removeFilter"
      @filters-loaded="loadFilters"
      @login="$emit('login')"
    />
    <result-section
      id="result-section"
      :filters="compiledFilters"
      @resultsCount="setCount"
      @resultsUpdated="setResults"
      @load-video="setPath"
    />
    <why-section
      id="why-section"
      :filters="filters"
    />
    <video-modal v-if="path" :path="path" @video-closed="resetPath"/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import KeywordSection from './KeywordContainer.vue'
import TimelineSection from './TimelineContainer.vue'
import MapSection from './MapContainer.vue'
import ConceptSection from './ConceptContainer.vue'
import FilterSection from './FilterContainer.vue'
import ResultSection from './ResultContainer.vue'
import WhySection from './WhyContainer.vue'
import SearchDialog from './result-components/SearchDialog.vue'
import VideoModal from './modal-components/VideoModal.vue'

const conceptsQuery = gql`
  query concepts($id: ID!) {
    concepts(where: { id: $id }) {
      id
      title
    }
  }
`

export default {
  name: 'DataARC',
  props: {
    sampleFilter: {
      type: String,
      required: true
    },
    savedSearch: {
      type: [Object, Boolean],
      required: true
    },
  },
  components: {
    KeywordSection,
    TimelineSection,
    MapSection,
    ConceptSection,
    FilterSection,
    ResultSection,
    WhySection,
    SearchDialog,
    VideoModal,
  },
  data() {
    return {
      filters: {},
      totalFilters: 0,
      keywordFilters: [],
      temporalFilters: [],
      results: {},
      resultsCount: 0,
      conceptFilters: [],
      spatialFilter: false,
      references: {
        keywords: this.keywordFilters,
        temporal: this.temporalFilters,
        concept: this.conceptFilters,
        spatial: this.spatialFilter,
      },
      sampleFilters: {
        temporal: [
          {
            begin: 1000,
            end: 2000,
          },
        ],
        polygon: [
          [-26.592264978338108,68.59665393385154],
          [-10.219481129760624,68.59665393385154],
          [-10.219481129760624,61.14073882263878],
          [-26.592264978338108,61.14073882263878],
        ],
        concept: {
          id: '5f430a76836c1e48136b4fd2',
          label: 'humans',
        }
      },
      sampleConcept: '',
      sampleRange: null,
      path: null,
    }
  },
  computed: {
    compiledFilters() {
      return this.collectFilters()
    },
    filterCount() {
      return [
        this.keywordFilters.length,
        this.temporalFilters.length,
        this.conceptFilters.length,
        this.spatialFilter ? 1 : 0,
      ].reduce((a, b) => a + b, 0)
    },
    searchHash() {
      return (this.$route.hash && this.$route.hash.startsWith('#searchId'))
    },
    filtersChanged() {
      return Object.keys(this.compiledFilters).length > Object.keys(this.savedSearch.filters).length
    }
  },
  watch: {
    savedSearch(val) {
      if (val) {
        this.loadSavedSearch()
      }
    },
    sampleFilter(val) {
      if (val) {
        if (val !== 'concept') {
          this[val === 'polygon' ? 'spatialFilter' : `${val}Filters`] = this.sampleFilters[val]
          if (val === 'temporal') {
            [this.sampleRange] = this.sampleFilters[val]
          }
        }
        else {
          let exists = []
          if (this.filters && this.filters.concept) {
            exists = this.filters.concept.filter((filter) => {
              return (filter === this.sampleFilters.concept.id)
            })
          }
          if (exists.length === 0) {
            this.sampleConcept = this.sampleFilters[val].id
            this.processFilter(val, this.sampleFilters[val])
          }
        }
      }
    },
    sampleConcept(val) {
      if (val) {
        setTimeout(() => this.sampleConcept = '', 1000)
      }
    },
    sampleRange(val) {
      if (val) {
        setTimeout(() => this.sampleRange = null, 1000)
      }
    },
    keywordFilters(newVal, oldVal) {
      if (newVal.length > 0) {
        this.processFilter('keyword', newVal)
      } else if (this.filters.keyword && newVal.length !== this.filters.keyword.length) {
        this.removeFilter('keyword', -1)
      }
    },
    temporalFilters(newVal, oldVal) {
      if (this.temporalFilters && this.temporalFilters.length > 0) {
        this.processFilter('temporal', this.temporalFilters)
      } else if (this.filters.temporal && newVal.length !== this.filters.temporal.length) {
        this.removeFilter('temporal', -1)
      }
    },
    spatialFilter(newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        this.processFilter('polygon', newVal)
      } else {
        this.removeFilter('polygon', -1)
      }
    },
  },
  mounted() {
    if (Object.keys(this.savedSearch).length) {
      this.loadSavedSearch()
    }
  },
  methods: {
    loadSavedSearch() {
      this.keywordFilters = []
      this.$refs.keyword.removeFilters()
      this.temporalFilters = []
      this.conceptFilters = []
      this.spatialFilter = false
      this.filters = {}
      this.loadFilters(this.savedSearch.filters)
    },
    loadFilters(newFilters) {
      const keys = Object.keys(newFilters)

      keys.forEach((key, index) => {
        if (key === 'keyword') {
          this.$refs.keyword.loadFilters(newFilters[key])
        } else if (key === 'temporal') {
          this.temporalFilters = newFilters[key]
        } else {
          this.processFilter(key, newFilters[key])
        }
      })
    },
    processFilter(type, filter) {
      if (type === 'concept') {
        this.$set(this.conceptFilters, this.conceptFilters.length, filter)
        if (!this.filters[type]) {
          this.$set(this.filters, type, [])
        }
        if (filter.id) {
          this.$set(this.filters[type], this.filters[type].length, filter.id)
        }
        else {
          this.conceptFilters = []
          for (let i = 0; i < filter.length; i++) {
            this.getConcept(filter[i])
          }
        }
      }
      else {
        this.$set(this.filters, type, filter)
        // If using search Hash & filters change, remove hash
        if (this.searchHash && this.filtersChanged) {
          this.$router.push('/')
        }
      }
    },
    removeFilter(type, index) {
      // If using search Hash, remove hash immediately
      if (this.searchHash) {
        this.$router.push('/')
      }
      if (type === 'polygon') {
        if (this.spatialFilter) {
          this.spatialFilter = false
        }
        this.$delete(this.filters, type)
        return
      }
      if (type === 'concept') {
        this.filters[type].splice(index, 1)
        this.conceptFilters.splice(index, 1)
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
        return
      }
      if ((type === 'keyword' || type === 'temporal') && index > -1) {
        const references = {
          keyword: this.keywordFilters,
          temporal: this.temporalFilters,
        }
        references[type].splice(index, 1)
        this.filters[type] = references[type]
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
        return
      }
      if (this.filters[type] && this.filters[type].length > 0) {
        this.filters[type].splice(index, 1)
        if (this.filters[type].length === 0) {
          this.$delete(this.filters, type)
        }
      }
      else {
        this.$delete(this.filters, type)
      }
    },
    collectFilters() {
      const filters = { ...this.filters }

      if ('keyword' in filters && filters.keyword.length > 0) {
        filters.keyword = filters.keyword.join(' ')
      }

      return filters
    },
    setCount(val) {
      this.resultsCount = val
    },
    setResults(val, type) {
      this.$set(this.results, type, val)
    },
    setPath(val) {
      this.path = this.$demoVids[val]
    },
    resetPath(val) {
      this.path = null
    },
    getConcept(id) {
      this.$apollo.query({
        query: conceptsQuery,
        variables: {
          id,
        },
      })
      .then(({ data }) => {
        const concept = { id, label: data.concepts[0].title }
        this.$set(this.conceptFilters, this.conceptFilters.length, concept)
        this.$set(this.filters.concept, this.filters.concept.length, id)
      })
    },
  },
}
</script>

<style></style>
