<template>
  <b-container fluid>
    <router-view />
    <table-view-layout
      v-if="$route.name === 'TemporalCoverages'"
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'TemporalCoverages')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:button>
        <b-button
          variant="primary"
          :to="{name: 'Create TemporalCoverage' }"
        >
          <b-icon-plus />Add new Temporal Coverage
        </b-button>
      </template>
      <template v-slot:table>
        <b-table
          v-if="temporalCoverages"
          ref="temporalCoverages"
          id="temporalCoverages"
          :busy="temporalCoveragesLoading"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
          responsive
          table-variant="light"
          head-variant="light"
          :items="temporalCoverages"
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
            <div class="text-wrap" style="width: 200px; max-width: 200px;" v-if="row.item.title">
              {{ row.item.title }}
            </div>
          </template>
          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button :to="{name: 'Update TemporalCoverage', params: {id: row.item.id} }" variant="primary" v-text="'Edit'"></b-button>
              <b-button variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation></b-button>
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
      component: 'TemporalCoverages',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'begin', sortable: true },
        { key: 'end', sortable: true },
      ],
      temporalCoveragesLoading: true,
    }
  },
  watch: {
    temporalCoverages(val) {
      if (val) {
        this.temporalCoveragesLoading = this.loadingState(val.length)
      }
    },
    $route(to, from) {
      if (to.name !== 'TemporalCoverages') {
        this.$apollo.queries.allTemporalCoverages.skip = true
      }
      else if (from.name !== 'TemporalCoverages') {
        this.$apollo.queries.allTemporalCoverages.skip = false
        this.$apollo.queries.allTemporalCoverages.refetch()
      }
    },
  },
  created() {
    this.$apollo.queries.allTemporalCoverages.skip = false
  },
}
</script>
