<template>
  <div id="page-top">
    <layout-header @apply-sample-filter="applyFilter" :triggerLogin="triggerLogin"/>
    <router-view :sampleFilter="runSampleFilter" @login="triggerLogin = true"/>
    <layout-footer />
  </div>
</template>

<script>

import LayoutHeader from './Header.vue'
import LayoutFooter from './Footer.vue'

export default {
  name: 'FrontendLayout',
  components: {
    LayoutHeader,
    LayoutFooter,
  },
  data() {
    return {
      triggerLogin: false,
      runSampleFilter: '',
      savedSearch: {},
    }
  },
  watch: {
    triggerLogin(val) {
      if (val) {
        setTimeout(() => this.triggerLogin = false, 1000)
      }
    },
    runSampleFilter(val) {
      if (val) {
        setTimeout(() => this.runSampleFilter = '', 1000)
      }
    }
  },
  methods: {
    applyFilter(filter) {
      this.runSampleFilter = filter
    }
  }
}
</script>

<style lang="scss">

@import "../scss/global";

</style>
