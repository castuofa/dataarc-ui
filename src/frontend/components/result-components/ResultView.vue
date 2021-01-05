<template>
  <b-modal
    :visible="show"
    class="modal-dialog"
    :id="`results-details-${resultType}`"
    header-bg-variant="dark"
    header-text-variant="light"
    :hide-footer="true"
    size="xl"
    @hide="resetModal"
  >
    <template class="modal-title" #modal-title>
      {{ `${resultType} Results: ${source.category}` }}
    </template>
    <template #default>
      <b-tabs>
        <b-tab :title="source.dataset" class="nav-item nav-link active" data-toggle="tab" href="#dataset-content" role="tab">
          <b-row>
            <b-col sm="4" class="source-table">
              <div id="results-details-table_wrapper" class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer">
                <b-container fluid>
                  <b-col>
                    <b-row class="justify-content-between">
                      <div class="badge badge-light text-dark d-flex justify-content-start">
                        <div class="dataTables_info" id="results-details-table_info" role="status" aria-live="polite">
                          {{ getStart }} - {{ getNext }} of {{ rows }}
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <b-input-group>
                          <b-input v-model="featuresFilter" placeholder="Filter..."></b-input>
                        </b-input-group>
                      </div>
                    </b-row>
                    <b-table responsive @filtered="updatePagination" :busy="featuresLoading" :fields="featuresFields" :filter="featuresFilter" :per-page="10" :current-page="currentFeaturesPage" id="results-details-table" head-variant="light" table-variant="light" role="grid" dataTable striped bordered hover small :items="features">
                      <template v-slot:table-busy>
                        <div class="text-center my-2">
                          <b-spinner class="align-middle"></b-spinner>
                          <strong>Loading...</strong>
                        </div>
                      </template>
                      <template #table-colgroup="scope">
                        <col
                          v-for="field in scope.fields"
                          :key="field.key"
                          :style="{ width: field.key === 'view' || field.key === 'date' ? '80px' : '180px',  }"
                        >
                      </template>
                      <template v-slot:cell(view)="row" class="view">
                        <b-button variant="light" v-text="'View'" @click="feature = row.item"></b-button>
                      </template>
                    </b-table>
                    <b-row>
                      <div class="d-flex justify-content-end">
                        <b-pagination
                          size="sm"
                          v-model="currentFeaturesPage"
                          :total-rows="rows"
                          :per-page="10"
                          :limit="4"
                          first-number
                          last-number
                        />
                      </div>
                    </b-row>
                  </b-col>
                </b-container>
              </div>
            </b-col>
            <b-col sm="8" class="source-details">
              <!-- <div class="chartjs-size-monitor" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;">
                <div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
                  <div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0">
                  </div>
                </div>
                <div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
                  <div style="position:absolute;width:200%;height:200%;left:0; top:0">
                  </div>
                </div>
              </div> -->
              <b-col sm="12" v-if="feature.properties">
                <div class="text-center">
                  <h3>{{feature.title}}</h3>
                </div>
                <br>
                <b-row class="justify-content-center">
                  <b-col sm="8">
                    <div class="text-center">
                      <h4>Details</h4>
                    </div>
                    <b-jumbotron
                      border-variant="secondary"
                      bg-variant="light"
                      style="height:350px;overflow-y:auto;overflow-x:auto"
                    >
                      <div
                        v-if="currentDataset.details_layout"
                        v-html="
                          pug.render(currentDataset.details_layout, feature.properties)
                        "
                        lang="pug"
                      />
                      <div
                        v-else
                      >
                        No Details layout found for <strong>{{ currentDataset.title }}</strong>
                      </div>
                    </b-jumbotron>
                  </b-col>
                </b-row>
                <b-row class="justify-content-center">
                  <b-col sm="8">
                    <div class="text-center">
                      <h4>Summary</h4>
                    </div>
                    <b-jumbotron
                      border-variant="secondary"
                      bg-variant="light"
                      style="height:200px;overflow-y:auto;overflow-x:auto"
                    >
                      <div
                        v-if="currentDataset.summary_layout"
                        v-html="
                          pug.render(currentDataset.summary_layout, feature.properties)
                        "
                        lang="pug"
                      />
                      <div
                        v-else
                      >
                        No Summary layout found for <strong>{{ currentDataset.title }}</strong>
                      </div>
                    </b-jumbotron>
                  </b-col>
                </b-row>
              </b-col>
              <!-- <chart :feature="feature"></chart> -->
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Metadata" class="nav-item nav-link" data-toggle="tab" href="#metadata-content" role="tab">
          <b-row>
            <b-col sm="8">
              <b-row class="justify-content-between">
                <div class="badge badge-light text-dark d-flex justify-content-start">
                  <div class="dataTables_info" id="results-details-table_info" role="status" aria-live="polite">
                    {{ getFieldsStart }} - {{ getFieldsNext }} of {{ getCount }}
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <b-input-group>
                    <b-input v-model="fieldsFilter" placeholder="Filter..."></b-input>
                  </b-input-group>
                </div>
              </b-row>
              <b-table responsive @filtered="updateFieldsPagination" :busy="fieldsLoading" :fields="fieldsFields" :filter="fieldsFilter" :per-page="10" :current-page="currentFieldsPage" id="field-metadata-table" head-variant="light" table-variant="light" role="grid" dataTable striped bordered hover small :items="datasetFields">
                <template v-slot:table-busy>
                  <div class="text-center my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template v-slot:cell(description)="row">
                  <div class="text-wrap" style="width: 200px; max-width: 400px;" v-if="row.item.description">
                    {{ row.item.description }}
                  </div>
                </template>
              </b-table>
              <b-row>
                <div class="d-flex justify-content-end">
                  <b-pagination
                    size="sm"
                    v-model="currentFieldsPage"
                    :total-rows="filteredFieldsCount > 0 ? filteredFieldsCount : datasetFieldsCount"
                    :per-page="10"
                    :limit="4"
                    first-number
                    last-number
                  />
                </div>
              </b-row>
            </b-col>
            <b-col sm="4">
              <b-col sm="12">
                <b-container>
                  <b-row v-if="currentDataset.description">
                    <strong>Description: </strong>
                    {{ currentDataset.description }}
                    <br>
                    <br>
                  </b-row>
                  <b-row v-if="currentDataset.citation">
                    <strong>Citation: </strong>
                    {{ currentDataset.citation }}
                    <br>
                    <br>
                  </b-row>
                  <b-row v-if="currentDataset.url">
                    <strong>Url: </strong>
                    <a :href="currentDataset.url">{{ currentDataset.url }}</a>
                  </b-row>
                  <br>
                  <b-row v-if="currentDataset.metadata">
                    <b-button :href="$sourceUrls.metadata+currentDataset.metadata">View Metadata</b-button>
                  </b-row>
                </b-container>
              </b-col>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </template>
  </b-modal>

</template>

<script>
import gql from 'graphql-tag'
import Chart from './ResultChart.vue'

const datasetQuery = gql`
  query datasets($id: ID!) {
    datasets(where: { id: $id }) {
      id
      title
      description
      citation
      url
      metadata
      summary_layout
      details_layout
      features_count
    }
  }
`
const fieldQuery = gql`
  query datasetFields($id: ID!) {
    datasetFields(where: { dataset: $id }) {
      id
      type
      title
      source
      description
      citation
      url
    }
  }
`
const featuresQuery = gql`
  query features($id: ID!, $start: Int!, $limit: Int!, $ids: [ID!]) {
    features(where: { dataset: $id, _id_in: $ids }, start: $start, limit: $limit) {
      id
      title
      begin
      end
      properties
    }
  }
`
const featuresQueryAll = gql`
  query features($id: ID!, $start: Int!, $limit: Int!) {
    features(where: { dataset: $id }, start: $start, limit: $limit) {
      id
      title
      begin
      end
      properties
    }
  }
`
const featuresCountQuery = gql`
  query countFeatures($dataset: ID!) {
    countFeatures(where: { dataset: $dataset })
  }
`
export default {
  name: 'ResultView',
  components: {
    Chart
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    source: {
      type: Object,
      required: true,
    },
    resultType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pug: require('pug'),
      featuresLoading: true,
      fieldsLoading: true,
      featuresFilter: '',
      fieldsFilter: '',
      feature: {},
      features: [],
      datasetFields: [],
      featuresCount: 0,
      filteredFieldsCount: 0,
      ids: [],
      currentDataset: {},
      skip: false,
      currentFeaturesPage: 1,
      currentFieldsPage: 1,
      start: 0,
      limit: 100,
      rows: 10,
      show: false,
      featuresFields: [
        { key: 'view', sortable: false },
        { key: 'begin', sortable: true },
        { key: 'end', sortable: true },
        { key: 'title', sortable: true },
      ],
      fieldsFields: [
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'citation', sortable: true },
        { key: 'url', sortable: true },
      ],
    }
  },
  computed: {
    getStart() {
      return this.firstPage ? 1 : ((this.currentFeaturesPage - 1) * 10) + 1
    },
    getNext() {
      return this.getStart + 9 > this.rows ? this.rows : this.nextVal
    },
    nextVal() {
      return this.firstPage ? 10 : (this.currentFeaturesPage * 10)
    },
    firstPage() {
      return this.currentFeaturesPage === 1
    },
    getFieldsStart() {
      return this.firstFieldsPage ? 1 : ((this.currentFieldsPage - 1) * 10) + 1
    },
    getFieldsNext() {
      return this.getFieldsStart + 9 > this.getCount ? this.getCount : this.nextFieldsVal
    },
    getCount() {
      return this.filteredFieldsCount > 0 ? this.filteredFieldsCount : this.datasetFieldsCount
    },
    nextFieldsVal() {
      return this.firstFieldsPage ? 10 : (this.currentFieldsPage * 10)
    },
    firstFieldsPage() {
      return this.currentFieldsPage === 1
    },
    datasetFieldsCount() {
      return this.datasetFields && this.datasetFields.length > 0 ? this.datasetFields.length : 0
    },
    currentDatasetId() {
      return this.source.dataset_id
    },
    sourceTotal() {
      return this.source.total
    },
  },
  watch: {
    source(newVal) {
      this.rows = newVal.total
      this.features = []
      this.datasetFields = []
      this.ids = []
      this.skip = false
      this.feature = {}
    },
    currentFeaturesPage(val) {
      if (val > 1 && this.features.length < this.rows) {
        this.featuresLoading = this.loadingState(this.features.length)
      }
      else {
        this.featuresLoading = false
      }
    },
    currentFieldsPage(val) {
      if (val > 1 && this.datasetFieldsCount < this.getCount) {
        this.fieldsLoading = this.loadingFieldsState(this.datasetFieldsCount)
      }
      else {
        this.fieldsLoading = false
      }
    },
    features(val) {
      if (val.length > 10 && this.currentFeaturesPage === 1) {
        this.featuresLoading = false
      }
      if (this.featuresLoading) {
        this.featuresLoading = this.loadingState(val.length)
      }
    },
    datasetFields(val) {
      if (val.length > 10 && this.currentFieldsPage === 1) {
        this.fieldsLoading = false
      }
      if (this.fieldsLoading) {
        this.fieldsLoading = this.loadingFieldsState(val.length)
      }
    },
  },
  updated() {
    this.show = true
  },
  mounted() {
    this.show = true
    this.rows = this.sourceTotal
    this.getFeaturesCount()
    this.getDataset()
    this.getFields()
  },
  methods: {
    getFeaturesCount() {
      let count = this.sourceTotal
      this.$apollo
      .query({
        query: featuresCountQuery,
        variables: {
          dataset: this.currentDatasetId,
        },
      })
      .then(({ data }) => {
        this.featuresCount = data.countFeatures
        if (data && data.countFeatures === count) {
          this.getAllFeatures()
        }
        else {
          this.getFeatureIds()
        }
      })
    },
    getDataset() {
      this.currentDataset = {}
      this.$apollo.query({
        query: datasetQuery,
        variables: {
          id: this.currentDatasetId,
        },
      }).then(({ data }) => {
        [this.currentDataset] = data.datasets
      })
    },
    getFields() {
      this.datasetFields = []
      this.$apollo.query({
        query: fieldQuery,
        variables: {
          id: this.currentDatasetId,
        },
      }).then(({ data }) => {
        this.datasetFields = data.datasetFields
      })
    },
    getFeatureIds() {
      this.ids = []
      let postObject = {
        type: this.resultType
      }
      postObject = Object.assign(postObject, this.filters)
      window.axios.post(
        `${this.$apiUrl}/query/features`,
        postObject,
      ).then(({ data }) => {
        this.ids = data.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        if (this.ids) {
          this.getFilteredFeatures()
        }
      })
    },
    getAllFeatures() {
      this.$apollo.query({
        query: featuresQueryAll,
        variables: {
          id: this.currentDatasetId,
          start: this.start,
          limit: this.limit,
        },
      }).then(({ data }) => {
        this.features = [...this.features, ...data.features]
        if (this.features.length < this.rows && this.start < this.featuresCount) {
          this.start += 100
          if (!this.skip) {
            this.getAllFeatures()
          }
        }
      })
    },
    getFilteredFeatures() {
      this.$apollo.query({
        query: featuresQuery,
        variables: {
          id: this.currentDatasetId,
          start: this.start,
          limit: this.limit,
          ids: this.ids,
        },
      }).then(({ data }) => {
        this.features = [...this.features, ...data.features]
        if (this.features.length < this.rows && this.start < this.featuresCount) {
          this.start += 100
          if (!this.skip) {
            this.getFilteredFeatures()
          }
        }
      })
    },
    updatePagination(array, val) {
      this.currentFeaturesPage = 1
      this.rows = val
    },
    updateFieldsPagination(array, val) {
      this.currentFieldsPage = 1
      this.filteredFieldsCount = val
    },
    loadingState(length) {
      if (length === 0 && this.rows === 0) {
        return false
      }
      return ((this.currentFeaturesPage * 10) - 9) > length
    },
    loadingFieldsState(length) {
      if (length === 0 && this.datasetFieldsCount === 0) {
        return false
      }
      return ((this.currentFieldsPage * 10) - 9) > length
    },
    resetModal(event) {
      event.preventDefault()
      this.skip = true
      this.start = 0
      this.show = false
      this.rows = 10
      this.filteredFieldsCount = 0
      this.currentFeaturesPage = 1
      this.currentFieldsPage = 1
      this.featuresLoading = true
      this.fieldsLoading = true
      this.$emit('modal-closed')
    },
  },
}
</script>

<style>

.modal-header {
}

.modal-title {
	line-height: inherit;
	text-transform: capitalize;
}

.modal-body {
	margin-top: 10px;
	padding: 0;
}

.source-details {
	overflow: auto;
}

.dataTables_wrapper {
	padding: 0;
}
.dataTables_wrapper .badge {
	background: none;
	font-weight: normal;
}
</style>
