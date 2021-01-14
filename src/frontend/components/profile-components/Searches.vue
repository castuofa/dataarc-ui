<template>
  <section
    class="bg-white"
  >
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h3>
            Searches
          </h3>
          <hr class="primary">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col class="mt-3 mb-3">
          <b-card no-body class="shadow">
            <b-table ref="search" responsive head-variant="light" :fields="fields" :items="searches">
              <template v-slot:cell(title)="row">
                <b-button variant="light" title="Load Saved Search" @click="$emit('load-saved-search', row.item); routeHome()">{{row.item.title}}</b-button>
              </template>
              <template v-slot:cell(filters)="row">
                <ul v-for="item, index in row.item.filters" class="text-left" :key="index">
                  <div v-if="index === 'polygon'">
                    Polygon [....]
                  </div>
                  <div v-else>
                    {{ item }}
                  </div>
                </ul>
              </template>
              <template v-slot:cell(actions)="row" class="actions">
                <b-button variant="primary" title="Check Email for Link" v-text="'Request Download'" @click="requestDownload(row.item)" :disabled="row.item.process"></b-button>
                <b-button variant="primary" target="_blank" v-text="'Download'" :disabled="!row.item.path || row.item.process" :href="link(row.item.path)"></b-button>
              </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    userId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      searches: [],
      count: 0,
      fields: [
        { key: 'actions', sortable: false },
        { key: 'title', sortable: true },
        { key: 'description', sortable: true },
        { key: 'filters', sortable: false },
      ],
    }
  },
  mounted() {

  },
  apollo: {
    searchesQuery: {
      query: gql`
        query searches($id: ID!) {
          searches(where: { user: $id }) {
            id
            title
            description
            filters
            path
            expires
          }
          countSearches
        }
      `,
      variables(val) {
        return {
          id: this.userId
        };
      },
      polling: 5000,
      skip: false,
      update(data) {
        return data.searches
      },
      result({ data }) {
        if (data) {
          let stopQuery = data.searches.filter(search => {
            if (search.path === null) {
              return search
            }
          });
          this.searches = data.searches
          this.count = data.countSearches

          if (stopQuery.length === 0) {
            this.$apollo.queries.searchesQuery.stopPolling();
          } else {
            this.$apollo.queries.searchesQuery.startPolling(5000);
          }
        }
      }
    }
  },
  methods: {
    link(val) {
      return `${this.$apiUrl}/${_.trimStart(val, '/public')}`
    },
    getSearches() {
      this.$apollo.queries.searchesQuery.refetch()
    },
    routeHome() {
      this.$router.replace('/')
    },
    requestDownload(search) {
      search.process = true
      this.$refs.search.refresh()
      window.axios.put(
        `${this.$apiUrl}/searches/${search.id}`,
        search,
      ).then(({ data }) => {
        this.getSearches()
      })
    }
  }

}
</script>

<style>

</style>
