<template lang="html">
  <b-navbar
    class="fixed-top"
    toggleable="md"
    type="dark"
    variant="info"
  >
    <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
      <a
        class="navbar-brand brand-logo"
        href="/"
        style="color:#000000"
      >DataARC</a>
    </div>
    <div class="navbar-menu-wrapper d-flex align-items-center ml-auto ml-lg-0">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

      </b-navbar-nav>
      <button
        class="navbar-toggler navbar-toggler-right align-self-center"
        type="button"
        @click="collapedMobileSidebar()"
      >
        <span class="mdi mdi-menu" />
      </button>
    </div>
  </b-navbar>
</template>

<script lang="js">
import { mapState, mapActions } from 'vuex'
import roleHandlerMixin from '@/router/role-handler.mixin'

export default {
  name: 'AppHeader',
  mixins: [roleHandlerMixin],
  computed: {
    ...mapState('account', ['user', 'role']),
    compileRoutes() {
      return this.adminRoutes
    },
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
    collapedMobileSidebar: () => {
      document.querySelector('.sidebar').classList.toggle('active')
    },
    handleLogout() {
      this.logout()
      this.$router.push('/')
    },
  },
}
</script>

<style scoped lang="scss">

.app-header {
}
</style>
