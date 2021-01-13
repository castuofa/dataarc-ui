<template>
  <div class="container-scroller">
    <app-header />
    <div class="container-fluid page-body-wrapper">
      <app-sidebar />
      <div class="main-panel">
        <div class="content-wrapper">
          <div
            v-if="alert.message && alert.message[0] && alert.message[0].messages"
            :class="`alert ${alert.type}`"
          >
            {{ alert.message[0].messages[0].message }}
          </div>
          <router-view />
        </div>
        <!-- content wrapper ends -->
        <!-- <app-footer /> -->
      </div>
      <!-- main panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</template>

<script>
import AppHeader from '@/backend//partials/AppHeader'
import AppSidebar from '@/backend//partials/AppSidebar'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Dashboard',
  components: {
    AppHeader,
    AppSidebar,
    // AppFooter,
  },
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

<style lang="scss">
.btn {
  font-weight: unset;
  text-transform: unset;
  border: unset;
}

.app {
}
</style>

<style lang="scss" scoped>
.page-body-wrapper {
  padding-top: unset!important;
}
</style>
