<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'Categories'"
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :currentPage="currentPage"
      :perPage="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Categories')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button variant="primary" :to="{ name: 'Create Category' }">
          <b-icon-plus />Add new Category
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="categories"
          ref="categories"
          id="categories"
          :busy="categoriesLoading"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="categories"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:head(datasets_count)="row">
            <div class="text-center">
              # Datasets
            </div>
          </template>
          <template v-slot:cell(datasets_count)="row">
            <div class="text-center">
              <b-badge pill variant="primary">
                {{ row.item.datasets_count }}
              </b-badge>
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button
                variant="primary"
                v-text="'Edit'"
                :to="{ name: 'Update Category', params: { id: row.item.id } }"
              ></b-button>
              <b-button
                variant="primary"
                v-text="'Delete'"
                @click="itemToDelete = row.item"
                v-b-modal.deleteConfirmation
              ></b-button>
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '@/mixins/collectionMixin';
export default {
  components: {},
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Categories',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'color', sortable: true },
        { key: 'datasets_count', sortable: true }
      ],
      categoriesLoading: true
    };
  },
  watch: {
    categories(val) {
      if (val) {
        this.categoriesLoading = this.loadingState(val.length);
      }
    },
    $route(to, from) {
      if (to.name !== 'Categories') {
        this.$apollo.queries.allCategories.skip = true;
      } else if (from.name !== 'Categories') {
        this.$apollo.queries.allCategories.skip = false;
        this.$apollo.queries.allCategories.refetch();
      }
    }
  },
  created() {
    this.$apollo.queries.allCategories.skip = false;
  }
};
</script>
