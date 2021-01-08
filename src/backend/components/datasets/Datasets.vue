<template>
  <div>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'Datasets'"
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :currentPage="currentPage"
      :perPage="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Datasets')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button variant="primary" :to="{ name: 'Create Dataset' }"
          ><b-icon-plus></b-icon-plus>Add new Dataset</b-button
        >
      </template>
      <template v-slot:table>
        <b-table
          v-if="datasets"
          ref="datasets"
          id="datasets"
          :filter="filter"
          :per-page="perPage"
          :current-page="currentPage"
          :busy="datasetsLoading"
          responsive
          table-variant="light"
          head-variant="light"
          :items="datasets"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(title)="row" class="Title">
            <div
              class="text-wrap"
              style="width: 200px; max-width: 200px;"
              v-if="row.item.title"
            >
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:head(fields_count)="row" class="fieldsCount">
            <span># Fields</span>
          </template>
          <template v-slot:cell(fields_count)="row" class="fieldsCount">
            <div class="text-center">
              <b-badge pill variant="primary" style="font-size: 12px;">
                {{ row.item.fields_count }}
              </b-badge>
            </div>
          </template>
          <template v-slot:head(features_count)="row" class="featuresCount">
            <span># Features</span>
          </template>
          <template v-slot:cell(features_count)="row" class="featuresCount">
            <div class="text-center">
              <b-badge pill variant="primary">
                {{ row.item.features_count }}
              </b-badge>
            </div>
          </template>
          <template
            v-slot:head(combinators_count)="row"
            class="combinatorsCount"
          >
            <span># Combinators</span>
          </template>
          <template
            v-slot:cell(combinators_count)="row"
            class="combinatorsCount"
          >
            <div class="text-center">
              <b-badge pill variant="primary">
                {{ row.item.combinators_count }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button
                size="sm"
                variant="primary"
                :disabled="row.item.process || !row.item.source"
                v-text="'Process'"
                @click="setProcess(row.item, component)"
              ></b-button>
              <b-button
                size="sm"
                :to="{ name: 'Dataset View', params: { id: row.item.id } }"
                :disabled="row.item.process"
                variant="primary"
                v-text="'Edit'"
              ></b-button>
              <b-button
                size="sm"
                variant="primary"
                :disabled="row.item.process"
                v-text="'Delete'"
                @click="itemToDelete = row.item"
                v-b-modal.deleteConfirmation
              ></b-button>
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import collectionMixin from '@/mixins/collectionMixin';
export default {
  data() {
    return {
      component: 'Datasets',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'fields_count', sortable: true },
        { key: 'features_count', sortable: true },
        { key: 'combinators_count', sortable: true },
        { key: 'source', sortable: true }
      ],
      pending: 'warning',
      process: 'info',
      updating: 'info',
      failed: 'danger',
      done: 'success',
      fieldsCount: [],
      featuresCount: [],
      combinatorsCount: [],
      datasetsLoading: true
    };
  },
  created() {
    this.$apollo.queries.allDatasets.skip = false;
  },
  methods: {
    status(val) {
      if (val) {
        return this[val];
      }
      return 'secondary';
    },
    update(val) {
      const temp = [];
      temp.fieldType = val.type;
      temp.id = val.id;
      temp.title = val.title;
      temp.type = 'DatasetFields';
      temp.action = 'Update';
      this.setFormData(temp);
    }
  },
  mixins: [collectionMixin],
  watch: {
    datasets(val) {
      if (val) {
        this.datasetsLoading = this.loadingState(val.length);
      }
    },
    $route(to, from) {
      if (to.name !== 'Datasets') {
        this.$apollo.queries.allDatasets.skip = true;
      } else if (from.name !== 'Datasets') {
        this.$apollo.queries.allDatasets.skip = false;
        this.$apollo.queries.allDatasets.refetch();
      }
    }
  }
};
</script>

<style>
a.disabled {
  pointer-events: none;
}

/* .table td {
  padding: 0.4rem;
  font-size: 12px;
}

.table th {
  font-size: 12px;
}

.btn-sm, .btn-group-sm > .btn{
  font-size: 12px;
  padding: 0.25rem;
}

.btn{
  font-size: 12px;
} */

/* .btn-group-sm{
  font-size: 12px;
  padding: 0rem;
} */
</style>
