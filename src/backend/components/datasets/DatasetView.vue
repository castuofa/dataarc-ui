<template>
  <b-container v-if="currentDataset" fluid>
    <router-view />
    <!-- Update Dataset -->
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3>Updating: {{ model.title }}</h3>
        <small>Last Updated: {{ getDate(model.processed) }}</small
        ><br />
        <router-link v-if="currentDataset" :to="{ name: 'Update Templates' }"
          >Edit Templates</router-link
        >
      </div>
      <div class="panel-body">
        <vue-form-generator
          :schema="schema"
          :model="model"
          :options="formOptions"
        />
      </div>
    </div>
    <br />
    <!-- Fields View -->
    <table-view-layout
      :fluid="true"
      :rows.sync="fieldsCount"
      component="Fields"
      :limits.sync="limits"
      :currentPage.sync="currentFieldsPage"
      @inputChanged="updateFilter"
      :perPage.sync="currentFieldsLimit"
      @change="updatePage"
      @limitUpdated="updateLimit"
    >
      <template v-slot:table>
        <b-table
          v-if="currentDataset"
          :busy="fieldsLoading"
          :filter="filterFields"
          :per-page="currentFieldsLimit"
          :current-page="currentFieldsPage"
          responsive
          table-variant="light"
          head-variant="light"
          :items="currentDataset.fields"
          :fields="fieldsList"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:head(title)="data">
            Display Name (Title)
          </template>
          <template v-slot:head(type)="data">
            Field Type
          </template>
          <template v-slot:cell(title)="row" class="Title">
            <div style="max-width: 400px;" v-if="row.item.title">
              <b-input
                v-model="row.item.title"
                @blur="updateField(row.item)"
              ></b-input>
            </div>
          </template>
          <template v-slot:cell(type)="row" class="Type">
            <div style="max-width: 400px;" v-if="row.item.type">
              <b-dropdown
                :disabled="row.item.type === 'array'"
                :text="row.item.type"
              >
                <div v-for="type in fieldTypes" :key="type">
                  <b-dropdown-item
                    v-model="row.item.type"
                    @click="
                      row.item.type = type;
                      updateField(row.item);
                    "
                  >
                    {{ type }}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </div>
          </template>
          <template v-slot:head(processed)="row">
            <span>Last Updated</span>
          </template>
          <template v-slot:cell(processed)="row" class="processed">
            <div>
              {{ getDate(row.item.processed) }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="Actions">
            <b-button-group>
              <b-button
                variant="primary"
                @click="currentField = row.item"
                v-b-modal.editMetadata
              >
                Edit Metadata
              </b-button>
              <b-button
                v-if="row.item.missing"
                variant="danger"
                v-text="'Delete Missing'"
                @click="itemToDelete = row.item"
                v-b-modal.deleteDatasetFieldConfirmation
              ></b-button>
              <fa-icon
                v-if="row.item.review"
                icon="exclamation-circle"
                class="fa-2x text-danger sr-icons"
                title="Review Needed"
              />
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
    <b-modal hide-backdrop content-class="shadow" centered id="editMetadata">
      <template v-slot:modal-title>
        Edit Metadata
      </template>
      <b-form>
        <b-form-group label="Description">
          <b-form-textarea
            v-model="currentField.description"
            rows="4"
            size="lg"
            no-auto-shrink
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Citation">
          <b-form-textarea
            v-model="currentField.citation"
            rows="4"
            size="lg"
            no-auto-shrink
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Url">
          <b-form-input
            v-model="currentField.url"
            rows="4"
            size="lg"
            no-auto-shrink
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          @click="updateField(currentField)"
        >
          Save
        </b-button>
      </template>
    </b-modal>
    <br />
    <!-- Combinators View -->
    <table-view-layout
      :fluid="true"
      :rows.sync="combinatorsCount"
      component="Combinators"
      :limits.sync="limits"
      :currentPage.sync="currentCombinatorsPage"
      :perPage.sync="currentCombinatorsLimit"
      @inputChanged="updateFilter"
      @change="updatePage"
      @limitUpdated="updateLimit"
    >
      <template v-slot:table>
        <b-table
          v-if="currentDataset"
          :busy="combinatorsLoading"
          :filter="filterCombinators"
          :per-page="currentCombinatorsLimit"
          :current-page="currentCombinatorsPage"
          responsive
          table-variant="light"
          head-variant="light"
          :items="currentDataset.combinators"
          :fields="combinatorsList"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(title)="row" class="Title">
            <div v-if="row.item.title">
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:head(features_count)="row" class="featuresCount">
            <span># Features</span>
          </template>
          <template v-slot:cell(features_count)="row" class="featuresCount">
            <div class="text-center">
              <b-badge pill variant="primary">
                {{ row.item.features_count ? row.item.features_count : 0 }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="Actions">
            <router-link
              :to="{ name: 'Update Combinator', params: { id: row.item.id } }"
            >
              <b-button variant="primary">Edit</b-button>
            </router-link>
          </template>
        </b-table>
      </template>
    </table-view-layout>
    <br />
    <b-modal
      hide-backdrop
      content-class="shadow"
      centered
      id="deleteDatasetConfirmation"
    >
      <template v-slot:modal-title>
        Delete Confirmation
      </template>
      <p class="my-2">
        Are you sure you want to delete this dataset?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="deleteItem(model, 'Datasets')"
        >
          Delete
        </b-button>
      </template>
    </b-modal>
    <b-modal
      hide-backdrop
      content-class="shadow"
      centered
      id="deleteDatasetFieldConfirmation"
    >
      <template v-slot:modal-title>
        Delete Confirmation
      </template>
      <p class="my-2">
        Are you sure you want to delete this field?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="deleteItem(itemToDelete, 'DatasetFields')"
        >
          Delete
        </b-button>
      </template>
    </b-modal>
    <b-button variant="danger" v-b-modal.deleteDatasetConfirmation
      >Delete Dataset</b-button
    >
  </b-container>
</template>

<script>
import gql from 'graphql-tag';
import collectionMixin from '@/mixins/collectionMixin';
export default {
  data() {
    return {
      currentField: {},
      component: 'Dataset View',
      action: 'Update',
      sortList: ['Path', 'Type'],
      fieldTypes: [
        'string',
        'number',
        'boolean',
        'array',
        'url',
        'begin',
        'end'
      ],
      fieldsList: [
        { key: 'actions', sortable: false },
        { key: 'name', sortable: true },
        { key: 'source', sortable: true },
        { key: 'title', sortable: true },
        { key: 'type', sortable: true },
        { key: 'processed', sortable: true }
      ],
      combinatorsList: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'features_count', sortable: true }
      ],
      filterFields: '',
      filterCombinators: '',
      fieldsCount: 0,
      combinatorsCount: 0,
      pending: 'warning',
      missing: 'danger',
      done: 'success',
      model: {
        type: '',
        action: '',
        title: '',
        description: '',
        metadata: '',
        citation: '',
        url: '',
        image: null,
        source: null,
        category: ''
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Title*',
            model: 'title',
            featured: true,
            required: true,
            visible: true
          },
          {
            type: 'wrap',
            label: 'Description',
            model: 'description',
            id: 'description',
            featured: true,
            visible: true,
            required: false,
            autocomplete: 'off'
          },
          {
            type: 'wrap',
            label: 'Citation',
            model: 'citation',
            visible: true,
            autocomplete: 'off'
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Metadata',
            model: 'metadata',
            visible: true,
            required: false
          },
          {
            type: 'input',
            inputType: 'url',
            label: 'Url',
            model: 'url',
            visible: true
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Image',
            model: 'image',
            visible: true
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Source',
            model: 'source',
            visible: true,
            required: false
          },
          {
            type: 'select',
            values: this.categories ? this.categories : ['1', '2'],
            label: 'Category',
            model: 'category',
            visible: true,
            selectOptions: {
              value: 'id',
              name: 'title'
            }
          },
          {
            type: 'submit',
            buttonText: 'Save',
            inputType: 'submit',
            visible: true,
            onSubmit: this.update
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      },
      fieldsLoading: true,
      combinatorsLoading: true
    };
  },
  methods: {
    update(val) {
      this.setFormData(val);
    },
    updateField(val) {
      const temp = [];
      temp.fieldType = val.type;
      temp.id = val.id;
      temp.title = val.title;
      temp.description = val.description;
      temp.citation = val.citation;
      temp.url = val.url;
      temp.type = 'DatasetFields';
      temp.action = 'Update';
      this.setFormData(temp);
      this.$bvModal.hide('editMetadata');
    },
    status(val) {
      if (val) {
        return this[val];
      }
      return 'secondary';
    }
  },
  mixins: [collectionMixin],
  watch: {
    currentDataset(val) {
      if (val) {
        this.model = val;
        if (this.model.category && this.model.category.id) {
          let temp = this.model.category.id;
          this.model.category = temp;
        }
        this.model.type = 'Datasets';
        this.model.action = 'Update';
        this.fieldsLoading = this.loadingState(val.fields.length, 'Fields');
        this.combinatorsLoading = this.loadingState(
          val.combinators.length,
          'Combinators'
        );
      }
    },
    categories(val) {
      if (val) {
        this.schema.fields.filter(field => {
          if (field.model && field.model === 'category') {
            field.values = val;
          }
        });
      }
    }
  },
  mounted() {
    this.currentId = this.$route.params.id;
    this.$apollo.queries.dataset.skip = false;
    this.$apollo.queries.dataset.refetch();
    this.$apollo.queries.allCategories.skip = false;
    this.$apollo.queries.allCategories.refetch();
  }
};
</script>

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

.table td {
  padding: 0.5rem;
  padding-right: 0rem;
}

.btn-sm,
.btn-group-sm > .btn {
  padding: 0.3rem;
}
</style>
