<template>
  <section
    id="timeline-section"
    class="bg-white"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Temporal Filter
            <sup><a
              href="http://www.data-arc.org/time/"
              title="Learn about time in dataARC"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-info-circle-fill /></a></sup>
            <sup><a
              :href="$helpUrls.temporal"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
            ><b-icon-file-earmark-text /></a></sup>
            <sup><b-button
              size="sm"
              variant="transparent"
              @click="$emit('load-video', 'temporal')"
              title="Watch a quick demo of the tool"
              class="text-dark p-0 pb-1"
              data-toggle="tooltip"
            ><b-icon-play-fill font-scale="2.25" /></b-button></sup>
          </h2>
          <hr class="primary">
          <p>
            Use the timeline graph below to explore data richness by time period. Below the timeline,<br>
            specify the parameters and select Add Temporal Filter button to apply filter.
          </p>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-archaeological" />
          <mark
            class="typetip"
            title="Archaeological sources include excavated artifactual and faunal data"
          >Archaeological</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-textual" />
          <mark
            class="typetip"
            title="Textual sources include Icelandic sagas and historical documents, geolocated to places and place names"
          >Textual</mark> Sources
        </b-col>
        <b-col
          align-self="center"
          md="auto"
        >
          <b-icon-circle-fill class="text-environmental" />
          <mark
            class="typetip"
            title="Environmental sources include volcanic, climatological, and other paleoenvironmental samples"
          >Environmental</mark> Sources
        </b-col>
      </b-row>
      <b-row>
        <b-col
          ref="timelineContainer"
          class="mt-3 mb-3 text-center"
        >
          <timeline
            :triggers="triggers"
            :filters="filters"
            :width="timelineWidth" v-model="currentSelectedRange" :sample-rect="sampleRect"
          />
        </b-col>
      </b-row>
    </b-container>
    <b-row class="justify-content-center">
      <b-col
        sm="4"
        class="shadow"
      >
        <b-card>
          <p>Select a pre-defined time period from the list or set a custom begin and end date below.</p>
          <form>
            <div class="form-row">
              <div class="col mb-3">
                <label for="timeline-period">Time Period</label>
                <select
                  id="timeline-period"
                  class="custom-select mr-sm-2"
                  @change="setTimelineFilterPeriod"
                  v-model="selectedFilterIndex"
                >
                  <option
                    v-for="(coverage, index) in temporalCoverages"
                    :key="index"
                    :value="index"
                  >
                    {{ coverage.title }}
                  </option>
                  <option value="Selected Range">
                    Selected Range
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="col mb-3">
                <label for="timeline-startdate">Begin Date *</label>
                <input
                  id="timeline-begindate"
                  type="text"
                  class="form-control"
                  placeholder="begin"
                  v-model="selectedFilter.begin"
                >
              </div>
              <div class="col mb-3">
                <label for="timeline-enddate">End Date *</label>
                <input
                  id="timeline-enddate"
                  type="text"
                  class="form-control"
                  placeholder="end"
                  v-model="selectedFilter.end"
                >
              </div>
            </div>
          </form>
          <p class="text-muted small">
            * A negative number is used to represent B.C.E. dates. E.g. -1000 = 1000 B.C.E.
          </p>
          <b-row align-h="center">
            <b-button
              type="button"
              class="btn btn-success"
              :disabled="checkDuplicateTemporal()"
              @click="applyFilter"
            >
              + Add Temporal Filter
            </b-button>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <br>
  </section>
</template>

<script>
import Timeline from './timeline-components/Timeline.vue'
export default {
  name: 'TimelineContainer',
  components: {
    Timeline,
  },
  props: {
    filters: {
      type: [Object, Boolean],
      default: false,
    },
    triggers: {
      type: [Number, Boolean],
      default: false,
    },
    sampleRange: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      timelineFilter: [],
      selectedFilterIndex: null,
      selectedFilter: {
        begin: null,
        end: null
      },
      timelineWidth: 1160,
      temporalCoverages: [],
      timelineSelected: null,
      currentSelectedRange: null,
      sampleRect: -1,
    }
  },
  watch: {
    currentSelectedRange(val) {
      if (val) {
        this.selectedFilterIndex = 'Selected Range'
        Object.assign(this.selectedFilter, val)
        if (this.sampleRange) {
          this.setSampleFilter()
        }
      }
    },
    selectedFilterIndex(val) {
      if (val === 'Selected Range' && this.selectedFilter !== this.currentSelectedRange) {
        Object.assign(this.selectedFilter, this.currentSelectedRange)
      }
    },
    sampleRange(val) {
      if (val) {
        this.currentSelectedRange = val
        this.sampleRect = 8
        setTimeout(() => this.sampleRect = -1, 1000)
      }
    },
  },
  mounted() {
    this.timelineWidth = this.$refs.timelineContainer.clientWidth
    this.getTemporalCoverages()
  },
  methods: {
    checkDuplicateTemporal() {
      let exists = []
      if (!this.selectedFilter || this.selectedFilter.end === null || this.selectedFilter.begin === null) {
        return true
      }
      if (this.filters && this.filters.temporal) {
        exists = this.filters.temporal.filter((filter) => {
          return (filter.end === this.selectedFilter.end) && (filter.begin === this.selectedFilter.begin)
        })
      }
      if (exists.length === 0) {
        return false
      }
      return true
    },
    setTimelineFilterPeriod() {
      if (this.selectedFilterIndex !== 'Selected Range') {
        const time = this.temporalCoverages[this.selectedFilterIndex]
        this.selectedFilter.begin = time.begin
        this.selectedFilter.end = time.end
      }
    },
    setSampleFilter() {
      this.timelineFilter = []
      this.timelineFilter.push({ ...this.selectedFilter })
      this.emitFilter()
    },
    applyFilter(evt) {
      this.timelineFilter.push({ ...this.selectedFilter })
      this.emitFilter()
    },
    emitFilter() {
      this.$emit('input', this.timelineFilter)
    },
    getTemporalCoverages() {
      return axios.get(`${this.$apiUrl}/temporal-coverages`)
        .then(({data}) => {
          this.temporalCoverages = data
        })
    }
  },
}
</script>

<style>

</style>
