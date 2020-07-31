import { mapState } from 'vuex'

const roles = {
  administrator: 0,
  contributor: 1,
  authenticated: 2,
}

const computed = {
  ...mapState('account', ['user', 'role']),
  contributorRoutes() {
    return this.mapRoutes('contributor')
  },
  authenticatedRoutes() {
    return this.mapRoutes('authenticated')
  },
  adminRoutes() {
    return this.mapRoutes('administrator')
  },
}

const methods = {
  mapRoutes(roleValue) {
    const roleLevel = roles[roleValue]
    const paths = this.$router.options.routes.filter((route) => {
      return route.meta.role === roleValue && roles[route.meta.role] >= roleLevel
    })
    if (paths.length > 0) {
      const parent = paths[0]
      return paths[0].children.map((route) => {
        return { path: `${parent.path}/${route.path}`, name: route.name }
      })
    }
    return []
  },
}

export default {
  computed,
  methods,
}
