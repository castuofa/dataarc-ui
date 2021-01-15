<template>
  <section
    id="map-section"
    class="bg-light"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Spatial Filter
            <sup><a
              href="http://www.data-arc.org/space/"
              title="Learn about location in dataARC"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-info-circle-fill /></a></sup>
            <sup><a
              :href="$helpUrls.spatial"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-file-earmark-text /></a></sup>
            <sup><b-button
              size="sm"
              variant="transparent"
              @click="$emit('load-video', 'spatial')"
              title="Watch a quick demo of the tool"
              class="text-dark p-0 pb-1"
              data-toggle="tooltip"
            ><b-icon-play-fill font-scale="2.25" /></b-button></sup>
          </h2>
          <hr class="primary">
          <p>
            Explore the map to view data availability by geographic area.  Use the Box Select or Lasso Select buttons to create a spatial filter.<br>
            The filter is applied immediately after the area is defined.
          </p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-archaeological" />
          <mark class="typetip" title="Archaeological sources include excavated artifactual and faunal data">Archaeological</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-textual" />
          <mark class="typetip" title="Textual sources include Icelandic sagas and historical documents, geolocated to places and place names">Textual</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-environmental" />
          <mark class="typetip" title="Environmental sources include volcanic, climatological, and other paleoenvironmental samples">Environmental</mark> Sources
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card
            no-body
            class="shadow"
          >
            <b-aspect aspect="16:9">
              <plotly
                :filtered-features="features"
                :filters="filters"
                @filtered="addToFilter"
                @removed="emitRemove"
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
import Plotly from './map-components/Plotly.vue'

const featuresCountQuery = gql`
  query {
    countFeatures
  }
`

export default {
  name: 'MapContainer',
  components: {
    Plotly,
  },
  props: {
    filters: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      limit: 100,
      start: 0,
      features: false,
      featuresCount: 0,
      getPromises: [],
      step: 5000,
    }
  },
  watch: {
    filters() {
      this.loadFeatures()
    },
  },
  mounted() {
    this.$apollo
    .query({
      query: featuresCountQuery,
    })
    .then(({ data }) => {
      this.featuresCount = data.countFeatures
      this.loadFeatures()
    })
  },
  methods: {
    loadFeatures() {
      if (Object.keys(this.filters).length < 1) {
        this.features = false
        return
      }
      let postObject = {
        type: 'matched'
      }
      postObject = Object.assign(postObject, this.filters)
      window.axios.post(
        `${this.$apiUrl}/query/features`,
        postObject,
      ).then(({ data }) => {
        this.features = data.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
      })
    },
    addToFilter(payload, label) {
      this.$emit('input', payload)
      this.$emit('region-label', label)
    },
    emitRemove() {
      this.$emit('removed', 'polygon')
    }
  },
}
</script>

<style></style>
