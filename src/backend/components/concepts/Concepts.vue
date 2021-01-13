<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'Concepts'"
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Concepts')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create Concept' }"
        >
          <b-icon-plus />Add new Concept
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="concepts"
          ref="concepts"
          :busy="conceptsLoading"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="concepts"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(title)="row">
            <div
              v-if="row.item.title"
              class="text-wrap"
              style="width: 200px; max-width: 200px;"
            >
              {{ row.item.title }}
            </div>
          </template>
          <template
            v-slot:cell(actions)="row"
            class="actions"
          >
            <b-button-group size="sm">
              <b-button
                :to="{name: 'Update Concept', params: {id: row.item.id} }"
                variant="primary"
                v-text="'Edit'"
              />
              <b-button
                v-b-modal.deleteConfirmation
                variant="primary"
                @click="itemToDelete = row.item"
                v-text="'Delete'"
              />
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '@/mixins/collectionMixin'
export default {
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Concepts',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'group', sortable: true },
      ],
      conceptsLoading: true,
    }
  },
  watch: {
    concepts(val) {
      if (val && val.length) {
        this.$emit('bv::refresh::table', 'concepts')
        this.conceptsLoading = this.loadingState(val.length)
      }
    },
    $route(to, from) {
      if (to.name !== 'Concepts') {
        this.$apollo.queries.allConcepts.skip = true
      }
      else if (from.name !== 'Concepts') {
        this.$apollo.queries.allConcepts.skip = false
        this.$apollo.queries.allConcepts.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allConcepts.skip = false
  },
}
</script>
