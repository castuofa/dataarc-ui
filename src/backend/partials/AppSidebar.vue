<template lang="html">
  <section class="app-sidebar">
    <nav
      id="sidebar"
      class="sidebar sidebar-offcanvas"
    >
      <ul class="nav">
        <li class="nav-item nav-profile">
          <div class="nav-link">
            <div class="profile-name">
              <p class="name" v-if="user">
                <b-dropdown menu-class="w-100" variant="light" :text="dropdownText">
                  <b-dropdown-item
                    :to="{name: 'Profile' }"
                  >
                    Profile
                  </b-dropdown-item>
                  <b-dropdown-item
                    @click="handleLogout()"
                  >
                    Logout
                  </b-dropdown-item>
                </b-dropdown>
              </p>
              <p class="designation">
                Role: {{ role ? role.name : '' }}
              </p>
            </div>
          </div>
        </li>
        <li
          v-if="role && role.name !== 'Authenticated' && role.name !== 'Public'"
          v-for="route in compileRoutes"
          :key="route.name"
          class="nav-item"
        >
          <router-link
            v-if="route.name && route.name !== 'Dataset View' && route.name !== 'blank' && route.name !== 'Profile'"
            class="nav-link"
            active-class="active"
            :to="route.path"
            exact
          >
            <img
              v-if="route.name !== 'Dataset View'"
              class="menu-icon"
              src="../../assets/images/menu_icons/01.png"
              alt="menu icon"
            ><span class="menu-title">{{ route.name }}</span>
          </router-link>
        </li>
        <span v-if="role && role.name === 'Administrator'">
          <br>
          <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
            <h4><strong>Admin Tools</strong></h4>
            </div>
          <li
            v-for="route in compileAdminRoutes"
            :key="route.name"
            class="nav-item"
          >

            <router-link
              v-if="route.name && route.name !== 'Dataset View' && route.name !== 'blank' && route.name !== 'Profile' && route.name !== 'ConceptMap View'"
              class="nav-link"
              active-class="active"
              :to="route.path"
              exact
            >
              <img
                v-if="route.name !== 'Dataset View'"
                class="menu-icon"
                src="../../assets/images/menu_icons/01.png"
                alt="menu icon"
              ><span class="menu-title">{{ route.name }}</span>
            </router-link>
          </li>
        </span>
      </ul>
    </nav>
  </section>
</template>

<script lang="js">
import { mapState, mapActions } from 'vuex'
import roleHandlerMixin from '@/router/role-handler.mixin'

export default {
  name: 'AppSidebar',
  mixins: [roleHandlerMixin],
  data() {
    return {

    }
  },
  computed: {
    ...mapState('account', ['user', 'role']),
    dropdownText() {
      return this.user.firstName ? `${this.user.firstName} ${this.user.lastName ? this.user.lastName : ''}` : this.user.email
    },
    compileRoutes() {
      return [...this.contributorRoutes, ...this.authenticatedRoutes]
    },
    compileAdminRoutes() {
      return [...this.adminRoutes]
    },
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/')
    },
  },
}
</script>

<style scoped lang="scss">
.app-sidebar {

}
</style>
