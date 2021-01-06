<template>
  <section :id="`${resultType}-section`" :class="'bg-'+resultType">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2 v-if="resultType !== 'matched'" class="text-capitalize">
            {{ resultType }} Results
          </h2>
          <h2 v-else class="text-capitalize">
            Results ({{ resultType }} Results)
            <sup><a
              :href="$helpUrls.results"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-file-earmark-text /></a></sup>
            <sup><b-button
              size="sm"
              variant="transparent"
              @click="$emit('load-video', 'results')"
              title="Watch a quick demo of the tool"
              class="text-dark p-0 pb-1"
              data-toggle="tooltip"
            ><b-icon-play-fill font-scale="2.25" /></b-button></sup>
            <sup><a
              href="#"
              title=""
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              bg
            ><b-icon-image /></a></sup>
          </h2>
          <hr class="bg-light">
          <p>
            {{ description }}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card-group v-if="results.length > 0" deck>
            <result-column
              v-for="result in sortedResults"
              :class="'bg-'+resultType"
              :key="result.category_id"
              :result="result"
              :category="result.category"
              @result-data-view="setResultView"
            />
          </b-card-group>
          <div v-else>
            No Results
          </div>
          <result-view
            v-if="selectedResult"
            :key="resultType"
            :source="selectedResult"
            :filters="filters"
            :resultType="resultType"
            @modal-closed="clear"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import ResultColumn from './ResultColumn.vue'
import ResultView from './ResultView.vue'

export default {
  name: 'Results',
  components: {
    ResultColumn,
    ResultView,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    resultType: {
      type: String,
      required: true,
    },
    resultTypes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedResult: false,
      results: [],
      resultsCount: 0,
      descriptionText: {
        matched: 'The number of data records directly returned from the applied filter(s).',
        related: 'The first-degree concept connections identified from the results subset.',
        contextual: 'The second-degree concept connections identified from the results subset.',
      },
    }
  },
  computed: {
    sortedResults() {
      return _.orderBy(this.results, ['category'])
    },
    description() {
      return this.descriptionText[this.resultType]
    }
  },
  watch: {
    filters: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getAllResults()
        }
      },
      deep: true,
    },
    resultsCount(val) {
      this.$emit('resultsCount', val)
    },
    results(val) {
      this.$emit('resultsUpdated', this.sortedResults, this.resultType)
    },
  },
  mounted() {
    this.getAllResults()
  },
  methods: {
    setResultView(source, category) {
      this.selectedResult = source
      this.$set(this.selectedResult, 'category', category)
    },
    clear() {
      this.selectedResult = false
    },
    getAllResults() {
      let postObject = {
        type: this.resultType
      }
      postObject = Object.assign(postObject, this.filters)
      axios.post(`${this.$apiUrl}/query/results`, postObject).then((data) => {
        this.results = data.data
        if (this.resultType === 'matched') {
          this.resultsCount = 0
          this.results.forEach((result) => {
            this.resultsCount += result.total
          })
        }
      })
    }
  },
}
</script>

<style>
.results-container .card {
  background-color: inherit;
  border: 0;
}

.result-type-container {
  padding: 80px 0px;
  border-bottom: 1px solid gray;

  background-color: rgba(0, 0, 0, 0.4)
}

.result-type-title {
  text-transform: capitalize;
}

</style>
