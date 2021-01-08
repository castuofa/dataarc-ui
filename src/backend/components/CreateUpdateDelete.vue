/* eslint-disable indent */
<template>
  <div>
    <b-row>
      <b-overlay
        :show="loading"
        no-wrap
      />
      <b-col :sm="model && model.type === 'Combinators' ? '7' : '12'">
        <b-container>
          <div class="panel panel-default">
            <div class="panel-heading">
              {{ model.action }} {{ model.title }}
              <br>
            </div>
            <div class="panel-body">
              <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors">
                    {{ error }}
                  </li>
                </ul>
              </p>
              <vue-form-generator
                :schema="schema"
                :model="model"
                :options="formOptions"
                :current-dataset="currentDataset"
              />
            </div>
          </div>
        </b-container>
      </b-col>
      <b-col
        v-if="model && model.type === 'Combinators'"
        sm="5"
      >
        <div
          v-if="currentDataset.id"
          class="panel panel-default"
        >
          <div class="panel-heading">
            Query Results: {{ filteredFeatures.matched_count ? filteredFeatures.matched_count : 0 }} out of {{ currentDataset.features_count }} records
            <br>
            <span v-if="filters && filteredFeatures.matched_count">
              Filtered features: {{ rows }} out of {{ filteredFeatures.matched_count }} results
            </span>
          </div>
          <div
            class="panel-body"
            style="max-height: 75vh; overflow-y: auto;"
          >
            <div
              v-if="filteredFeatures.matched_count"
              class="d-flex justify-content-between"
            >
              <b-pagination
                v-model="currentPage"
                size="sm"
                :total-rows="rows"
                :per-page="(perPage === 0 ? 10 : perPage)"
                :limit="4"
                first-number
                last-number
                @change="updatePage"
              />
              <div class="justify-content-between">
                <b-input-group>
                  <b-input
                    v-model="filters"
                    placeholder="Filter"
                  />
                  <b-button
                    v-if="filters"
                    @click="filters = ''"
                  >
                    Clear<b-icon-x />
                  </b-button>
                </b-input-group>
              </div>
              <div class="justify-content-end">
                <b-dropdown
                  id="dropdown-1"
                  :text="perPage.toString()"
                >
                  <div
                    v-for="limit in limits"
                    :key="limit"
                  >
                    <b-dropdown-item @click="perPage = limit">
                      {{ limit }}
                    </b-dropdown-item>
                  </div>
                </b-dropdown>
                <small> per Page</small>
              </div>
            </div>
            <b-table
              v-if="currentDataset.features_count"
              :filter="filters"
              :current-page="currentPage"
              responsive
              :items="filteredFeatures.features"
              :fields="resultsFields"
              :per-page="perPage"
              @filtered="updatePagination"
            >
              <template
                v-slot:cell(properties)="row"
                class="Properties"
              >
                <div
                  v-if="row.item.properties"
                  class="w-200 text-wrap"
                  style="max-width: 800px;"
                >
                  {
                  <span
                    v-for="(property, key, index) in row.item.properties"
                    :key="key"
                  >
                    {{ key }}: <strong>{{ property }}</strong> <span v-if="(index + 1) !== Object.keys(row.item.properties).length"> | </span>
                  </span>
                  }
                </div>
              </template>
            </b-table>
            <span v-if="currentDataset.features_count && filteredFeatures.matched_count === 0">
              No Matches found
            </span>
            <span v-if="currentDataset && currentDataset.features_count === 0">
              No Features found for this Dataset
            </span>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '@/mixins/collectionMixin'

export default {
  mixins: [collectionMixin],
  data() {
    return {
      filters: '',
      resultsFields: [
        'properties',
      ],
      item: {},
      model: {
        type: '',
        action: '',
        user: {},
        username: '',
        email: '',
        password: '',
        provider: '',
        confirmed: false,
        blocked: false,
        role: [],
        fields: [],
        templates: [],
        features: [],
        color: '',
        datasets: [],
        events: [],
        combinators: [],
        concepts: [],
        queries: [],
        keywords: [],
        dataset_templates: [],
        operator: 'and',
      },
      schema: {
        fields: [
          {
            type: 'select',
            values: this.datasets ? this.datasets : [''],
            label: 'Dataset',
            model: 'dataset',
            disabled(model) {
              return model.action === 'Update'
            },
            visible(model) {
              return model.type === 'Combinators'
            },
            selectOptions: {
              name: 'title',
            },
            onChanged(model, schema, event) {
              this.currentDatasetId = model.dataset
            },
          },
          {
            type: 'query',
            label: 'Queries',
            model: 'queries',
            values: ['field1', 'field2'],
            visible(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            required: true,
            selectOptions: {
              value: 'id',
              path: 'path',
            },
          },
          {
            type: 'select',
            values: [
              { type: 'And', value: 'and' },
              { type: 'Or', value: 'or' },
              { type: 'Nor', value: 'nor' },
              { type: 'Not', value: 'not' },
            ],
            label: 'Operator',
            model: 'operator',
            default: 'and',
            visible(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            selectOptions: {
              value: 'value',
              name: 'type',
            },
          },
          {
            type: 'submit',
            buttonText: 'Test Queries',
            inputType: 'submit',
            visible(model) {
              return model.type === 'Combinators' && model.dataset && Object.keys(model.queries).length > 0
            },
            onSubmit: this.testQueries,
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Provider',
            model: 'provider',
            visible(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'checkbox',
            label: 'Confirmed',
            model: 'confirmed',
            default: false,
            visible(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'checkbox',
            label: 'Blocked',
            model: 'blocked',
            default: false,
            visible(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'select',
            values: this.roles ? this.roles : ['1', '2'],
            label: 'Role',
            model: 'role',
            default: false,
            visible(model) {
              return model.type === 'Users'
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Title*',
            model: 'title',
            featured: true,
            required: true,
            visible(model) {
              return ((model.type !== 'Combinators' && model.type !== 'Users') || (model.type === 'Combinators' && model.dataset))
            },
          },
          {
            type: 'wrap',
            label: 'Description',
            model: 'description',
            id: 'description',
            featured: true,
            visible(model) {
              return (model.type === 'Combinators' && model.dataset) || (model.type !== 'Users' && model.type !== 'Combinators')
            },
            required: false,
            autocomplete: 'off',
          },
          {
            type: 'wrap',
            label: 'Citation',
            model: 'citation',
            visible(model) {
              return (model.type === 'Combinators' && model.dataset)
              || model.type === 'Datasets'
              || model.type === 'TemporalCoverages'
              || model.type === 'ConceptMaps'
              || model.type === 'Concepts'
            },
            autocomplete: 'off',
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Metadata',
            model: 'metadata',
            visible(model) {
              return model.type === 'Datasets'
            },
            required: false,
            autocomplete: 'off',
          },
          {
            type: 'input',
            inputType: 'url',
            label: 'Url',
            model: 'url',
            visible(model) {
              return model.type === 'Datasets'
              || model.type === 'TemporalCoverages'
              || model.type === 'ConceptMaps'
              || model.type === 'Concepts'
            },
          },
          {
            type: 'input',
            inputType: 'number',
            label: 'Begin',
            model: 'begin',
            visible(model) {
              return model.type === 'TemporalCoverages'
            },
          },
          {
            type: 'input',
            inputType: 'number',
            label: 'End',
            model: 'end',
            visible(model) {
              return model.type === 'TemporalCoverages'
            },
          },
          {
            type: 'select',
            values: [
              { type: 'Activities', value: 'activities' },
              { type: 'Actors', value: 'actors' },
              { type: 'Community Places', value: 'community_places' },
              { type: 'Events', value: 'events' },
              { type: 'Ideas', value: 'ideas' },
              { type: 'Imaginary Landscape', value: 'imaginary_landscape' },
              { type: 'Physical Landscape', value: 'physical_landscape' },
              { type: 'Physical Processes', value: 'physical_processes' },
            ],
            label: 'Group',
            model: 'group',
            visible(model) {
              return model.type === 'Concepts'
            },
            selectOptions: {
              value: 'value',
              name: 'type',
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Image',
            model: 'image',
            visible(model) {
              return model.type === 'Datasets'
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Source',
            model: 'source',
            visible(model) {
              return model.type === 'Datasets'
              || model.type === 'ConceptMaps'
            },
            required: false,
          },
          {
            type: 'select',
            values: this.categories ? this.categories : ['1', '2'],
            label: 'Category',
            model: 'category',
            visible(model) {
              return model.type === 'Datasets'
            },
            selectOptions: {
              value: 'id',
              name: 'title',
            },
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Color',
            model: 'color',
            visible(model) {
              return model.type === 'Categories'
            },
          },
          {
            type: 'multi',
            multiSelect: true,
            label: 'Concepts',
            model: 'concepts',
            values: this.groupedConcepts ? this.groupedConcepts : ['1', '2'],
            visible(model) {
              return (model.type === 'Combinators' && model.action === 'Update') || (model.type === 'Combinators' && model.dataset)
            },
            selectOptions: {
              key: 'title',
              label: 'title',
              multiple: true,
              searchable: true,
              clearOnSelect: true,
              groupValues: 'values',
              groupLabel: 'group',
              hideSelected: true,
              trackBy: 'id',
              onNewTag(newTag, id, options, value) {
                options.push(newTag)
                value.push(newTag)
              },
            },
            onChanged(model, newVal, oldVal, field) {
              model = newVal
            },
          },
          {
            type: 'submit',
            buttonText: 'Submit',
            inputType: 'submit',
            visible(model) {
              return model.type !== 'Combinators' || model.dataset
            },
            onSubmit: this.update,
          },
          {
            type: 'submit',
            buttonText: 'Cancel',
            inputType: 'submit',
            visible(model) {
              return model.action === 'Update'
            },
            onSubmit: this.back,
          },
        ],
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      },
      types: ['Datasets', 'Combinators', 'Categories'],
      createUrl: '',
      editUrl: '',
      routeUrl: '',
      errors: [],
      action: '',
      collectionType: '',
      component: 'CRUD',
    }
  },
  computed: {
    ...mapState('account', ['status'],
      {
        account: (state) => state.account,
        users: (state) => state.users.all,
        user: (state) => state.users.user,
      }),
  },
  watch: {
    categories(val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'category') {
          field.values = val
        }
      })
    },
    groupedConcepts(val) {
      if (val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'concepts') {
            field.values = val
          }
        })
      }
    },
    topics(val) {
      if (val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'topics') {
            field.values = val
          }
        })
      }
    },
    datasets(val) {
      if (val && val.length > 0) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'dataset') {
            field.values = val
          }
        })
      }
    },
    roles(val) {
      this.schema.fields.filter((field) => {
        if (field.model && field.model === 'role') {
          field.values = val
        }
      })
    },
    model: {
      handler(newVal, oldVal) {
        if (newVal.dataset) {
          this.currentDatasetId = newVal.dataset
          this.$apollo.queries.dataset.skip = false
        }
      },
      deep: true,
    },
    currentDataset(val) {
      if (val) {
        this.schema.fields.filter((field) => {
          if (field.model && field.model === 'queries') {
            field.values = val.fields
          }
        })
        this.$apollo.queries.allConcepts.skip = false
      }
    },
    currentCombinator(val) {
      if (val) {
        this.model.id = val.id
        this.model.queries = val.queries
      }
    },
    currentConceptMap(val) {
      if (val) {
        Object.keys(val).forEach((key) => {
          if (key !== '__typename') {
            this.model[key] = val[key]
          }
        })
      }
    },
  },
  mounted() {
    this.setData()
  },
  methods: {
    ...mapActions('account', 'users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete',
    }),
    setData() {
      const variables = this.$route.name.split(' ')
      const pathArray = this.$route.path.split('/')
      this.action = variables[0]

      this.collectionType = (variables[1] !== 'Category' ? `${variables[1]}s` : 'Categories')
      if (this.$route.name === 'Create Combinator' || this.$route.name === 'Update Combinator') {
        if (this.$route.params.id) {
          this.currentId = this.$route.params.id
          this.$apollo.queries.combinator.skip = false
          this.$apollo.queries.combinator.refetch()
        }
        else {
          this.$apollo.queries.allDatasets.skip = false
        }
      }
      else if (this.$route.name === 'Update ConceptMap') {
        this.currentId = this.$route.params.id
        this.$apollo.queries.conceptMap.skip = false
        this.$apollo.queries.conceptMap.refetch()
      }
      else if (this.$route.name === 'Create Dataset') {
        this.$apollo.queries.allCategories.skip = false
      }
      if (this.$route.name !== 'Update Combinator') {
        this.loading = false
      }

      if (this.action === 'Update' && this.collectionType !== 'Datasets' && this.collectionType !== 'Combinators' && this.collectionType !== 'ConceptMaps') {
        this.editUrl = `${pathArray[2]}/${this.$route.params.id}`
        const vm = this
        this.getSingle(this.editUrl).then((value) => {
          vm.item = value.data
          vm.model = vm.item
          if(!vm.model.keywords){
            vm.model.keywords = []
          }
          if (vm.model.category) {
            const temp = vm.model.category.id
            vm.model.category = temp
          }
          if (vm.model.role) {
            const temp = vm.model.role.id
            vm.model.role = temp
          }
          vm.model.type = vm.collectionType
          vm.model.action = vm.action
        })
      }

      this.model.type = this.collectionType
      this.model.action = this.action
    },
    update(val) {
      val.type = this.model.type
      val.action = this.model.action
      this.setFormData(val)
    },
    back(val) {
      if (val) {
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  border-color: #ddd;
}

.panel-heading {
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;

  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.panel-body {
  padding: 15px;
}

</style>

<style>
.form-control {
  padding-top: 0.35rem;
}

.multiselect, .multiselect__tags, .multiselect__input  {
  font-size: 0.85rem;
}
</style>
