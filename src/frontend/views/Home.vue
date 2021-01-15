<template>
  <div>
    <manage-profile v-if="$route.path === '/manage-profile'"/>
    <data-arc v-else :saved-search="savedSearch" :sampleFilter="sampleFilter" @login="$emit('login')"/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import DataArc from '../components/DataARC.vue'
import ManageProfile from '../components/ManageProfile.vue'

const searchQuery = gql`
  query searches($id: ID!) {
    searches(where: { id: $id }) {
      id
      title
      description
      filters
      path
      expires
    }
  }
`

export default {
  name: 'HomeView',
  components: {
    DataArc,
    ManageProfile
  },
  props: {
    sampleFilter: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      savedSearch: {},
    }
  },
  computed: {
    searchHash() {
      return (this.$route.hash && this.$route.hash.startsWith('#searchId'))
    },
    searchId() {
      return this.$route.hash.split('=')[1]
    }
  },
  watch: {
    $route(to, from) {
      if (this.searchHash) {
        this.loadSearch()
      }
    }
  },
  mounted() {
    if (this.searchHash) {
      this.loadSearch()
    }
  },
  methods: {
    loadSearch() {
      this.$apollo.query({
        query: searchQuery,
        variables: {
          id: this.searchId,
        },
      }).then(({ data }) => {
        [this.savedSearch] = data.searches
      })
    },
  },
}
</script>

<style lang="scss">
body {
  font-size: 1.25rem;
}
</style>
