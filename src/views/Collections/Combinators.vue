<template>
  <b-container fluid>
    <router-view/>
    <table-view-layout v-if="$route.name === 'Combinators'" :fluid="true" :rows="rows" :component="component" :limits="limits" :currentPage="currentPage" :perPage="perPage" @change="updatePage" @inputChanged="updateFilter" @deleteConfirmed="deleteItem(itemToDelete, 'Combinators')" @limitUpdated="updateLimit">
      <template v-slot:button>
        <b-button variant="primary" :to="{name: 'Create Combinator' }"><b-icon-plus></b-icon-plus>Add new Combinator</b-button>
      </template>
      <template v-slot:table>
        <b-table id="combinators" ref="combinators" v-if="combinators" :busy="combinatorsLoading" :filter="filter" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="combinators" :fields="displayFields" @filtered="updatePagination">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(dataset)="row">
            <div class="text-wrap" style="width: 250px; max-width: 300px;" v-if="row.item.dataset">
              {{ row.item.dataset.title }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <fa-icon
              v-if="row.item.review"
              icon="exclamation-circle"
              class="fa-2x text-danger sr-icons"
              title="Review Needed"
            />
            <b-button-group size="sm">
              <b-button :to="{name: 'Update Combinator', params: {id: row.item.id} }" variant="primary" v-text="'Edit'"></b-button>
              <b-button variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '../../mixins/collectionMixin'
export default {
  data() {
    return {
      component: 'Combinators',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'dataset', sortable: true },
      ],
      combinatorsLoading: true,
      combinators: [],
    }
  },
  mixins: [collectionMixin],
  watch: {
    combinators(val) {
      if (val) {
        this.combinatorsLoading = this.loadingState(val.length)
      }
    },
    $route(to, from) {
      if (to.name !== 'Combinators') {
        this.$apollo.queries.allCombinators.skip = true
      }
      if (from.name !== 'Combinators') {
        this.$apollo.queries.allCombinators.skip = false
        this.$apollo.queries.allCombinators.refetch()
      }
    },
  },
  mounted() {
    if (!this.$route.params.id && this.$route.name !== 'Create Combinator') {
      this.$apollo.queries.allCombinators.skip = false
    }
  },
}
</script>
