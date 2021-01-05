<template>
  <section
    id="concept-section"
    class="bg-white"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Concept Filter
            <sup><a
              href="http://www.data-arc.org/conceptmapping/"
              title="Learn about concepts in dataARC"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-info-circle-fill /></a></sup>
            <sup><a
              :href="$helpUrls.conceptual"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-file-earmark-text /></a></sup>
            <sup><b-button
              size="sm"
              variant="transparent"
              @click="$emit('load-video', 'Results_111320.mp4')"
              title="Watch a quick demo of the tool"
              class="text-dark p-0 pb-1"
              data-toggle="tooltip"
            ><b-icon-play-fill font-scale="2.25" /></b-button></sup>
          </h2>
          <hr class="primary">
          <p>
            The concepts map is a visual representation of all dataARC concepts and their connectedness to one another.<br>
            Select a concept from the drop down menu and use the green Add Concept to Filter button to filter. Repeat to filter by multiple concepts.
          </p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-star-fill variant="success" />
          <mark class="typetip" title="The concept selected in the graph">Selected</mark> Concept
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill variant="success" />
          <mark class="typetip">Matched</mark> Concepts
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-triangle-fill variant="warning" />
          <mark class="typetip" title="The concepts directly related (first-degree) to the selected concept">Related</mark> Concepts
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill variant="primary" />
          <mark class="typetip" title="The concepts loosely related (second-degree) to the selected concept">Contextual</mark> Concepts
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card
            no-body
            class="shadow"
            style="min-height:600px;"
          >
            <b-aspect aspect="16:9">
              <network
                :topicmap="conceptMap"
                @concept-filter="handleConceptFilter"
                :filteredIds="filteredIds"
                :filters="filters"
                :sample-concept="sampleConcept"
              />
            </b-aspect>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import gql from 'graphql-tag'
import Network from './concept-components/Cytoscape.vue'

const conceptMapQuery = gql`
  query {
    conceptMaps(where: { active: true }) {
      name
      nodes
      edges
    }
  }
`

export default {
  components: {
    Network,
  },
  props: {
    filterCount: {
      type: [Number, Boolean],
      default: false,
    },
    filters: {
      type: [Object, Boolean],
      default: false,
    },
    sampleConcept: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      selectedNode: {},
      nodes: [],
      conceptMap: {},
      links: [],
      nodeTextBoolean: false,
      filteredIds: [],
    }
  },
  watch: {
    filterCount(newValue, oldValue) {
      if (!newValue || newValue === 0) {
        this.filteredIds = []
        return
      }
      this.getFilterNodes()
    },
  },
  mounted() {
    this.getNodes()
  },
  methods: {
    handleConceptFilter(concept, action) {
      if (action === 'remove') {
        let index = _.indexOf(this.filters.concept, concept)
        this.$emit('removed', 'concept', index)
      }
      else {
        let filter = []
        if (this.filters.concept) {
          filter = this.filters.concept.filter((node) => {
            return node === concept.id
          })
        }
        if (filter.length === 0) {
          this.$emit('filtered', 'concept', concept)
        }
      }
    },
    getNodes() {
      this.$apollo
      .query({
        query: conceptMapQuery,
      })
      .then(({ data }) => {
        this.conceptMap = data.conceptMaps[0]
        this.nodes = data.conceptMaps[0].nodes
        this.links = data.conceptMaps[0].edges
      })
    },
    getFilterNodes() {
      const url = `${this.$apiUrl}/query/concepts`
      // Required in reverse order
      // const types = ['contextual', 'related', 'matched']
      const postObject = { ...this.filters }
      if (Object.keys(postObject).length < 1) return

      // let requests = []
      postObject.type = 'matched'

      axios.post(url, postObject)
      .then(({ data }) => {
        this.filteredIds = data
      })

      // for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
      //   const typeValue = types[typeIndex]
      //   postObject.type = typeValue

      //   requests.push(
      //     axios.post(url, postObject)
      //     .then(({ data }) => {
      //       return data
      //     })
      //   )
      // }

      // Promise.all(requests).then((data) => {
      //   this.filteredIds = data
      // })
    },
    nodeSelected({ node }) {
      // console.log(node)
    },
    linkSelected({ link }) {
      // console.log(link)
    },
    test(search) {
      // console.log(search)
    },
    addNodeToFilter(node) {
      this.$emit('filtered', 'concept', node)
    },
  },
}
</script>

<style>
</style>
