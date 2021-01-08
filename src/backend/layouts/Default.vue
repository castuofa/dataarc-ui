<template>
  <div class="default-layout">
    <div
      v-if="alert.message && alert.message[0] && alert.message[0].messages"
      :class="`alert ${alert.type}`"
    >
      {{ alert.message[0].messages[0].message }}
    </div>
    <div class="container d-flex justify-content-center align-items-center">
      <router-view />
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
export default {
  name: 'Default',
  computed: {
    ...mapState({
      alert: (state) => state.alert,
    }),
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert()
    },
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear',
    }),
  },
}
</script>

<style lang="scss" scoped>

.default-layout {
  min-height: 100vh;
  .container {
    min-height: 100vh;
  }
}
</style>
