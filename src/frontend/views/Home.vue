<template>
  <div>
    <manage-profile @load-saved-search="handleSearch" v-if="$route.path === '/manage-profile'"/>
    <data-arc v-else :saved-search="savedSearch" :sampleFilter="sampleFilter" @login="$emit('login')"/>
  </div>
</template>

<script>

import DataArc from '../components/DataARC.vue'
import ManageProfile from '../components/ManageProfile.vue'

export default {
  name: 'HomeView',
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
  components: {
    DataArc,
    ManageProfile
  },
  methods: {
    handleSearch(search) {
      this.savedSearch = {}
      Object.assign(this.savedSearch, search)
    }
  },
}
</script>

<style lang="scss">
body {
  font-size: 1.25rem;
}
</style>
