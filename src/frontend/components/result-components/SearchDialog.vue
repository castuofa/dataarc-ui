<template>
  <div>
    <b-row align-h="end">
      <b-button-group class="float-right border-0 bg-dark">
        <b-button
          href="#result-section"
          variant="dark"
        >
          Results
          <b-badge variant="danger">
            {{ resultsCount }}
          </b-badge>
        </b-button>
        <b-button
          href="#filter-section"
          variant="dark"
        >
          Filters
          <b-badge variant="success">
            {{ filterCount }}
          </b-badge>
        </b-button>
        <b-button variant="dark" v-b-toggle.dialog>
          <span class="when-open">
            <b-icon-chevron-double-up></b-icon-chevron-double-up>
          </span>
          <span class="when-closed">
            <b-icon-chevron-double-down></b-icon-chevron-double-down>
          </span>
        </b-button>
      </b-button-group>
    </b-row>
    <b-row align-h="end" class="float-right">
      <b-collapse visible id="dialog">
        <b-card v-if="results" bg-variant="dark" style="width:28rem;max-width:30rem;" class="mb-2" no-body text-variant="white">
          <b-card-body style="padding:.7rem;">
            <b-card-title>
              <h3>Filters</h3>
            </b-card-title>
            <b-card-group deck style="margin:0px;">
              <b-card no-body bg-variant="transparent" style="margin:2px;">
                <b-card-header header-bg-variant="secondary" style="padding:0rem">
                  <div class="text-center no-wrap" >
                    <small>Spatial</small>
                  </div>
                </b-card-header>
                <b-card-text class="small">
                  <b-list-group data-type="spatial" v-if="filters.polygon" flush>
                    <b-list-group-item
                      class="justify-content-between align-items-center text-left bg-secondary"
                      border-variant="light"
                      style="padding:0.5rem;padding-right:0rem;"
                    >
                      <small>{{ regionLabel ? regionLabel : 'Polygon'}}</small>
                      <b-button size="sm" style="padding:0.1rem;" @click="$emit('removed', 'polygon')">
                        <b-icon-x-circle-fill
                          variant="light"
                        />
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-text>
              </b-card>
              <b-card no-body bg-variant="transparent" style="margin:2px;">
                <b-card-header header-bg-variant="secondary" style="padding:0rem;">
                  <div class="text-center no-wrap" >
                    <small>Temporal</small>
                  </div>
                </b-card-header>
                <b-card-text class="small">
                  <b-list-group data-type="temporal" flush>
                    <b-list-group-item
                      :key="index"
                      v-for="(filter, index) in filters.temporal"
                      border-variant="light"
                      class="d-flex justify-content-between align-items-center text-left bg-secondary"
                      style="padding:0.5rem;padding-right:0rem;"
                    >
                      <small>{{ filter.begin }} - {{ filter.end }}</small>
                      <b-button size="sm" style="padding:0.1rem;" @click="$emit('removed', 'temporal', index)">
                        <b-icon-x-circle-fill
                          variant="light"
                        />
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-text>
              </b-card>
              <b-card no-body bg-variant="transparent" style="margin:2px;">
                <b-card-header header-bg-variant="secondary" style="padding:0rem;">
                  <div class="text-center no-wrap" >
                    <small>Conceptual</small>
                  </div>
                </b-card-header>
                <b-card-text class="small">
                  <b-list-group data-type="concepts" flush>
                    <b-list-group-item
                      v-for="(filter, index) in conceptFilters"
                      :key="index"
                      style="padding:0.5rem;padding-right:0rem;"
                      class="justify-content-between align-items-center text-left bg-secondary"
                    >
                      <small>{{ filter.label }}</small>
                      <b-button size="sm" variant="transparent" style="padding:0.1rem;" @click="$emit('removed', 'concept', index)">
                        <b-icon-x-circle-fill
                          variant="light"
                        />
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-text>
              </b-card>
              <b-card no-body bg-variant="transparent" style="margin:2px;">
                <b-card-header header-bg-variant="secondary" style="padding:0rem;">
                  <div class="text-center no-wrap" >
                    <small>Keywords</small>
                  </div>
                </b-card-header>
                <b-card-text class="small">
                  <b-list-group data-type="concepts" flush>
                    <b-list-group-item
                      v-for="(filter, index) in keywordFilters"
                      :key="index"
                      style="padding:0.5rem;padding-right:0rem;"
                      class="justify-content-between align-items-center text-left bg-secondary"
                    >
                      <small>{{ filter }}</small>
                      <b-button size="sm" variant="transparent" style="padding:0.1rem;" @click="$emit('removed', 'keyword', index)">
                        <b-icon-x-circle-fill
                          variant="light"
                        />
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-card-text>
              </b-card>
            </b-card-group>
          </b-card-body>
          <b-card-body v-if="results" style="padding:.7rem;">
            <b-card-title style="margin-bottom:0rem;">
              <h3>Results</h3>
            </b-card-title>
            <b-card-body style="padding:.7rem;">
              <b-card-text>
                <b-container>
                  <b-row>
                    <b-col sm="3">
                      <a class="text-white" href="#matched-section"><u>Matched</u></a>
                    </b-col>
                    <b-col sm="3" v-for="(result, index) in matched" :class="'text-'+categories[index].toLowerCase()" :key="index">
                      {{ result.toLocaleString() }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="3">
                      <a class="text-white" href="#related-section"><u>Related</u></a>
                    </b-col>
                    <b-col sm="3" v-for="(result, index) in related" :class="'text-'+categories[index].toLowerCase()" :key="index">
                      {{ result.toLocaleString() }}
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="3">
                      <a class="text-white" href="#contextual-section"><u>Contextual</u></a>
                    </b-col>
                    <b-col sm="3" v-for="(result, index) in contextual" :class="'text-'+categories[index].toLowerCase()" :key="index">
                      {{ result.toLocaleString() }}
                    </b-col>
                  </b-row>
                </b-container>
              </b-card-text>
            </b-card-body>
          </b-card-body>
        </b-card>
      </b-collapse>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    resultsCount: {
      type: Number,
      default: 0,
    },
    filterCount: {
      type: Number,
      default: 0,
    },
    results: {
      type: [Object, Boolean],
      required: true,
    },
    filters: {
      type: [Object, Boolean],
      required: true,
    },
    conceptFilters: {
      type: [Array, Boolean],
      required: true,
    },
    keywordFilters: {
      type: [Array, Boolean],
      required: true,
    },
    regionLabel: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      categories: ['Archaeological','Environmental', 'Textual'],
    }
  },
  computed: {
    matched() {
      return this.getTotals('matched')
    },
    related() {
      return this.getTotals('related')
    },
    contextual() {
      return this.getTotals('contextual')
    },
  },
  methods: {
    getTotals(type) {
      let categories = [0,0,0]
      if (this.results[type] && this.results[type].length > 0) {
        this.results[type].forEach((cat, index) => {
          categories[_.indexOf(this.categories, cat.category)] = cat.total
        })
      }
      return categories
    },
  }
}
</script>

<style>
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
