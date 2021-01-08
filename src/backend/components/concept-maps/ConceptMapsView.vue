<template>
  <b-container fluid>
<!-- Update Concept Map -->
    <router-view/>
    <br>
<!-- Concepts View -->
    <table-view-layout :fluid="false" :rows="rows" component="ConceptTopics" :limits="limits" :currentPage="currentPage" @inputChanged="updateFilter" :perPage="perPage" @change="updatePage" @limitUpdated="updateLimit">
      <template v-slot:table>
        <b-table v-if="conceptTopics" :filter="filter" :sort-compare="customSort" :busy="conceptTopicsLoading" :per-page="perPage" :current-page="currentPage" responsive table-variant="light" head-variant="light" :items="conceptTopics" :fields="fields" @filtered="updatePagination">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(concept)="row" class="Concept">
            <div style="max-width: 400px;">
              <div
              id="topicSearch"
              class="input-group"
              >
                <vue-bootstrap-typeahead
                  :data="concepts"
                  :serializer="s => s.title"
                  :placeholder="row.item.concept ? row.item.concept.title : ''"
                  @hit="updateConceptTopic(row.item, $event); row.item.concept = $event; makeToast('success')"
                />
              </div>
            </div>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import collectionMixin from '@/mixins/collectionMixin'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
export default {
  components: {
    VueBootstrapTypeahead
  },
  data() {
    return {
      component: 'ConceptMap View',
      action: 'Update',
      conceptTopics: [],
      fields: [
        { key: 'title', sortable: true },
        { key: 'concept', sortable: true },
      ],
      conceptTopicsLoading: true,
    }
  },
  mixins: [collectionMixin],
  watch: {
    conceptTopics(val) {
      if (val) {
        this.conceptTopicsLoading = this.loadingState(val.length)
      }
    },
  },
  mounted() {
    this.currentId = this.$route.params.id
    this.$apollo.queries.allConceptTopics.skip = false
    this.$apollo.queries.allConcepts.skip = false
  },
  methods: {
    customSort(a, b, key) {
      if(key === 'concept') {
        if(!a.concept) {
          return -1
        }
        else if(!b.concept) {
          return 1
        }
        else if(a.concept.title === b.concept.title) {
          return 0;
        }
        else if (a.concept.title > b.concept.title) {
          return 1;
        }
        return -1;
      }

    },
    updateConceptTopic(val, concept) {
      const temp = val
      temp.concept = concept.id
      temp.type = 'ConceptTopics'
      temp.action = 'Update'
      this.setFormData(temp)
    },
  }

}
</script>

<style>
.form-control {
  padding-top: 0.35rem;
}

.table td {
  padding: 0.8rem;
  padding-right: 0rem;
}

.btn-sm, .btn-group-sm > .btn{
  padding: 0.3rem;
}
</style>
