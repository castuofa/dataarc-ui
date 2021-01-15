<template>
  <section id="filter-section" class="bg-secondary text-light">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Filters
            <sup><a
              :href="$helpUrls.filter"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"
              bg
            ><b-icon-file-earmark-text /></a></sup>
          </h2>
          <hr class="primary" />
          <p>
            A list of filters currently applied to the data using AND logic (all criteria are met).<br>
            To remove a filter, click the X to the right of the filter.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card-group deck id="filters" v-if="filters">
            <!-- Spatial -->
            <b-card
              header="Spatial"
              v-if="filters.box || filters.polygon"
              bg-variant="dark"
              text-variant="white"
              no-body
            >
              <b-list-group data-type="spatial" v-if="filters.box" flush>
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center text-left bg-transparent"
                >
                  <small>Bounding Box {{ filters.box }}</small>
                  <b-icon-x-circle-fill
                    variant="light"
                    @click="$emit('removed', 'box')"
                  />
                </b-list-group-item>
              </b-list-group>
              <b-list-group data-type="spatial" v-if="filters.polygon" flush>
                <b-list-group-item
                  class="d-flex justify-content-between align-items-center text-left bg-transparent"
                >
                  <span v-if="regionLabel">{{regionLabel}}</span>
                  <span v-else><small>Polygon {{ shorten(filters.polygon) }} ...</small></span>
                  <b-button variant="dark" @click="$emit('removed', 'polygon')">
                    <b-icon-x-circle-fill
                      variant="light"
                    />
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-card>
            <!-- /Spatial -->

            <!-- Temporal -->
            <b-card
              header="Temporal"
              v-if="filters.temporal && filters.temporal.length"
              bg-variant="dark"
              text-variant="white"
              no-body
            >
              <b-list-group data-type="temporal" flush>
                <b-list-group-item
                  :key="index"
                  v-for="(filter, index) in filters.temporal"
                  class="d-flex justify-content-between align-items-center text-left bg-transparent"
                >
                  Range: {{ filter.begin }} - {{ filter.end }}
                  <b-button variant="dark" @click="$emit('removed', 'temporal', index)">
                    <b-icon-x-circle-fill
                      variant="light"
                    />
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-card>
            <!-- /Temporal -->

            <!-- Concepts -->
            <b-card
              header="Concepts"
              v-if="filters.concept && conceptFilters && conceptFilters.length"
              bg-variant="dark"
              text-variant="white"
              no-body
            >
              <b-list-group data-type="concepts" flush>
                <b-list-group-item
                  v-for="(filter, index) in conceptFilters"
                  :key="index"
                  class="d-flex justify-content-between align-items-center text-left bg-transparent"
                >
                  {{ filter.label }}
                  <b-button variant="dark" @click="$emit('removed', 'concept', index)">
                    <b-icon-x-circle-fill
                      variant="light"
                    />
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-card>
            <!-- /Concepts -->

            <!-- Keywords -->
            <b-card
              header="Keywords"
              v-if="filters.keyword"
              bg-variant="dark"
              text-variant="white"
              no-body
            >
              <b-list-group data-type="keyword" flush>
                <b-list-group-item
                  :key="index"
                  v-for="(filter, index) in filters.keyword"
                  class="d-flex justify-content-between align-items-center text-left bg-transparent"
                >
                  {{ filter }}
                  <b-button variant="dark" @click="$emit('removed', 'keyword', index)">
                    <b-icon-x-circle-fill
                      variant="light"
                    />
                  </b-button>
                </b-list-group-item>
              </b-list-group>
            </b-card>
            <!-- /Keywords -->
          </b-card-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col align-self="center">
          <b-button-group class="border-0">
            <b-button
              title="Upload Filters"
              variant="danger"
              @click="startFileUpload"
            >
              <b-icon-upload aria-hidden="true" /> Upload Filters
              <input
                type="file"
                @change="readFile"
                style="display:none"
                ref="fileUpload"
              />
            </b-button>
            <a
              ref="downloadAnchor"
              :href="filterDownloadData"
              :download="downloadName"
            >
              <b-button
                title="Download Filters"
                variant="success"
                :disabled="filterCount === 0"
              >
                <b-icon-download aria-hidden="true" /> Download Filters
              </b-button>
            </a>
            <b-button
              title="Save Search to Profile"
              variant="primary"
              @click="saveSearchFilters"
              :disabled="filterCount === 0"
            >
              <b-icon-cloud-arrow-up aria-hidden="true" /> Save Search
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>
    <b-modal content-class="shadow" centered id="loginNotice">
      <template v-slot:modal-title>
        <h3>Notice</h3>
      </template>
      <p class="my-2">
        Please login to save your search.
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="dark" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="dark" @click="$emit('login');close()">
          Login
        </b-button>
      </template>
    </b-modal>
    <b-modal content-class="shadow" hide-footer centered id="saveSearch">
      <template v-slot:modal-title>
        <h3>Save Search</h3>
      </template>
      <p class="my-2">
        <b-form @submit.prevent="sendForm">
          <b-form-group label="Title">
            <b-input v-model="form.title"/>
          </b-form-group>
          <b-form-group label="Description">
            <b-input v-model="form.description"/>
          </b-form-group>
          Filters in Search: <b-badge variant="success">
            {{ filterCount }}
          </b-badge>
          <br>
          <br>
          <b-button type="submit" size="sm" variant="dark" >
            Save
          </b-button>
          <b-button size="sm" variant="dark" @click="close()">
            Cancel
          </b-button>
        </b-form>
      </p>
    </b-modal>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    filters: {
      type: Object,
      required: true
    },
    conceptFilters: {
      type: Array,
      required: true
    },
    filterCount: {
      type: Number,
      required: true
    },
    regionLabel: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      downloadName: 'filters.json',
      form: {}
    };
  },
  computed: {
    ...mapState('account', ['user', 'role', 'status']),
    filterDownloadData() {
      let stringFilters = '';
      if (!this.filters || !Object.keys(this.filters).length > 0) {
        stringFilters = JSON.stringify({});
      } else {
        stringFilters = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(this.filters)
        )}`;
      }
      return stringFilters;
    }
  },
  methods: {
    readFile(e) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.readAsText(file);
      let _this = this;
      reader.onload = function() {
        _this.loadPreviousSearch(reader.result);
      };

      reader.onerror = function() {
        console.log(reader.error);
      };
    },
    loadPreviousSearch(data) {
      this.$emit('filters-loaded', JSON.parse(data));
    },
    startFileUpload() {
      this.$refs.fileUpload.click();
    },
    shorten(val) {
      return val.slice(0, 3);
    },
    saveSearchFilters() {
      if (!this.status.loggedIn) {
        this.$bvModal.show('loginNotice')
      }
      else {
        this.$bvModal.show('saveSearch')
      }
      // this.$refs.downloadAnchor.click();

    },
    sendForm() {
      this.form.user = this.user.id
      this.form.filters = this.filters
      window.axios.post(
        `${this.$apiUrl}/searches`,
        this.form,
      ).then(({ data }) => {
        this.$bvModal.hide('saveSearch')
      })
    },
    close() {
      this.$bvModal.hide('loginNotice')
      this.$bvModal.hide('saveSearch')
    }
  }
};
</script>

<style></style>
