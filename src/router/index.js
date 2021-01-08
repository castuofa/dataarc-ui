import Cookies from 'js-cookie'
import Vue from 'vue'
import VueRouter from 'vue-router'
import NotFound from '@/backend/components/NotFound.vue'
import defaultLayout from '@/backend/layouts/Default.vue'
import frontendLayout from '@/frontend/layouts/Layout.vue'
import dashboardLayout from '@/backend/layouts/Dashboard.vue'
import axios from 'axios'
import roles from './roles'
Vue.use(VueRouter)

const token = Cookies.get('jwt')
let rawUser = Cookies.get('user')
let user = rawUser ? JSON.parse(rawUser) : null

if (token) {
  // store.commit('ADD NAME', token)
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

const routes = [
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
    meta: { layout: defaultLayout },
  },
  {
    path: '/',
    component: frontendLayout,
    children: [
      {
        path: '/',
        name: 'frontend',
        component: () => import('@/frontend/views/Home.vue'),
        alias: ['/manage-profile']
      },
    ],
    meta: {
      auth: false,
      role: 'public',
    },
  },
  {
    path: '/auth',
    name: 'home',
    component: defaultLayout,
    children: [
      {
        path: 'register',
        name: 'register',
        component: () => import('@/backend/views/Pages/Register.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/backend/views/Pages/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/backend/views/Pages/ResetPassword.vue'),
      },
      {
        path: 'unauthorized',
        name: 'Unauthorized',
        component: () => import('@/backend/views/Pages/Error401.vue'),
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/backend/views/Pages/Notice.vue'),
      },
    ],
    meta: {
      auth: false,
      role: 'public',
    },
  },

  {
    path: '/basic',
    name: 'authenticated',
    component: dashboardLayout,
    children: [
      {
        path: 'home',
        name: 'blank',
        component: defaultLayout,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/backend/views/Pages/Profile.vue'),
      },
    ],
    meta: {
      auth: true,
      role: 'authenticated',
    },
  },

  {
    path: '/contributor',
    name: 'contributors',
    component: dashboardLayout,
    children: [
      {
        path: 'datasets',
        name: 'Datasets',
        component: () => import('@/backend/components/datasets/Datasets.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Dataset',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'combinators',
        name: 'Combinators',
        component: () => import('@/backend/components/combinators/Combinators.vue'),
        props: true,
        meta: {
          title: 'Combinators',
        },
        children: [
          {
            path: 'create',
            name: 'Create Combinator',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update Combinator',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'dataset/:id',
        name: 'Dataset View',
        component: () => import('@/backend/components/datasets/DatasetView.vue'),
        props: true,
        children: [
          {
            path: 'template',
            name: 'Update Templates',
            component: () => import('@/backend/components/datasets/DatasetTemplates.vue'),
            props: true,
          },
        ],
      },
    ],
    meta: {
      auth: true,
      role: 'contributors',
    },
  },

  {
    path: '/admin',
    name: 'administrator',
    component: dashboardLayout,
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/backend/components/Container.vue'),
        redirect: 'users/index',
        children: [
          {
            path: 'index',
            name: 'View Users',
            component: () => import('@/backend/components/users/Users-index.vue'),
          },
        ],
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/backend/components/categories/Categories.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Category',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update Category',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'temporal-coverages',
        name: 'TemporalCoverages',
        component: () => import('@/backend/components/temporal-coverages/TemporalCoverages.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create TemporalCoverage',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update TemporalCoverage',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'concept-maps',
        name: 'ConceptMaps',
        component: () => import('@/backend/components/concept-maps/ConceptMaps.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create ConceptMap',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'concepts',
        name: 'Concepts',
        component: () => import('@/backend/components/concepts/Concepts.vue'),
        props: true,
        children: [
          {
            path: 'create',
            name: 'Create Concept',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
          {
            path: 'update/:id',
            name: 'Update Concept',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'concept-map/:id',
        component: () => import('@/backend/components/concept-maps/ConceptMapsView.vue'),
        props: true,
        children: [
          {
            path: '',
            name: 'Update ConceptMap',
            component: () => import('@/backend/components/CreateUpdateDelete.vue'),
            props: true,
          },
        ],
      },
    ],
    meta: {
      auth: true,
      role: 'administrator',
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return desired position
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.name === 'home') return next('/')

  const authRequired = to.matched.some((record) => record.meta.auth)
  // const rawUser = Cookies.get('user')
  // const loggedIn = rawUser ? JSON.parse(Cookies.get('user')) : null

  if (!authRequired) return next()

  if (authRequired && !user) {
    rawUser = Cookies.get('user')
    user = rawUser ? JSON.parse(rawUser) : null
    if (!user) return next('/')
  }

  const roleRestriction = to.matched.some((record) => {
    return roles[record.meta.role] >= roles[user.role.type]
  })

  if (!roleRestriction) {
    return next('/unauthorized')
  }
  // Are you contributor or above?

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
  .slice()
  .reverse()
  .find((r) => r.name)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
  .slice()
  .reverse()
  .find((r) => r.meta && r.meta.metaTags)
  const previousNearestWithMeta = from.matched
  .slice()
  .reverse()
  .find((r) => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) { document.title = `${nearestWithTitle.name} | DataARC Admin` }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(
    document.querySelectorAll('[data-vue-router-controlled]'),
  ).map((el) => el.parentNode.removeChild(el))

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
  .map((tagDef) => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach((key) => {
      tag.setAttribute(key, tagDef[key])
    })

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  })
  // Add the meta tags to the document head.
  .forEach((tag) => document.head.appendChild(tag))

  next()
})

export default router
