<template>
  <b-navbar
    id="mainNav"
    class="navbar navbar-expand-lg navbar-light navbar-shrink fixed-top"
  >
    <div class="container">
      <b-navbar-brand class="navbar-brand js-scroll-trigger" href="/">DataARC</b-navbar-brand>
      <a target="_blank" class="navbar-about btn btn-sm btn-outline-dark" href="https://www.data-arc.org/about/the-datasets/">About Our Data</a>
      <button
        class="navbar-toggler navbar-toggler-right"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <b-collapse id="navbarResponsive" class="collapse navbar-collapse" is-nav>
        <b-navbar-nav class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="start">Start</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="timeline">Timeline</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="map">Map</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="concepts">Concepts</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="keyword">Keyword</a>
          </li>
          <li class="nav-item">
            <a class="nav-link js-scroll-trigger" :href="why">Why</a>
          </li>
          <li v-if="!status.loggedIn" class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#" @click="action = 'Login'" v-b-modal.handleUserActions>Login</a>
          </li>
          <li v-if="!status.loggedIn" class="nav-item">
            <a class="nav-link js-scroll-trigger" href="#" @click="action = 'Register'" v-b-modal.handleUserActions>Register</a>
          </li>
          <b-nav-item-dropdown v-if="status.loggedIn" text="Manage" right>
            <b-dropdown-item to="/manage-profile">Profile</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'authenticated' }">Admin</b-dropdown-item>
            <b-dropdown-item @click="handleLogout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </div>
    <b-modal content-class="shadow" hide-footer centered id="handleUserActions">
      <template v-slot:modal-title>
        <h3>{{action}}</h3>
      </template>
      <p class="my-2">
        <login @link-clicked="setAction" @close-modal="action = ''; $bvModal.hide('handleUserActions')" v-if="action === 'Login'" />
        <register @link-clicked="setAction" @close-modal="action = ''; $bvModal.hide('handleUserActions')" v-if="action === 'Register'" />
        <forgot-password v-if="action === 'Forgot Password'" @close-modal="action = ''; $bvModal.hide('handleUserActions')"/>
        <notice @link-clicked="setAction" v-if="action === 'Notice'" />
      </p>
    </b-modal>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Login from '@/backend/views/Login.vue'
import Register from '@/backend/views/Pages/Register.vue'
import ForgotPassword from '@/backend/views/Pages/ForgotPassword.vue'
import Notice from '@/backend/views/Pages/Notice.vue'
export default {
  components: {
    Login,
    Register,
    ForgotPassword,
    Notice
  },
  props: {
    triggerLogin: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      submitted: false,
      action: '',
    }
  },
  computed: {
    ...mapState('account', ['user', 'role', 'status']),
    start() {
      return this.$route.path === '/manage-profile' ? '/#page-top' : '#page-top'
    },
    timeline() {
      return this.$route.path === '/manage-profile' ? '/#temporal-section' : '#temporal-section'
    },
    map() {
      return this.$route.path === '/manage-profile' ? '/#spatial-section' : '#spatial-section'
    },
    concepts() {
      return this.$route.path === '/manage-profile' ? '/#concept-section' : '#concept-section'
    },
    keyword() {
      return this.$route.path === '/manage-profile' ? '/#keyword-section' : '#keyword-section'
    },
    why() {
      return this.$route.path === '/manage-profile' ? '/#why-section' : '#why-section'
    },
  },
  watch: {
    triggerLogin(val) {
      if (val) {
        this.action = 'Login'
        this.$bvModal.show('handleUserActions')
      }
    }
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),
    handleLogout() {
      this.logout().then(() => {
        if (this.$route.path !== '/') {
          this.$router.push('/')
        }
      });
    },
    handleSubmit() {
      this.submitted = true
      const { email, password } = this
      if (email && password) {
        const identifier = email
        this.login({ identifier, password })
      }
    },
    setAction(val) {
      this.action = val
    },
  }
};
</script>

<style lang="scss" scoped>
#mainNav {
  border-color: rgba(34, 34, 34, 0.05);
  background: white;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  transition: all 0.2s;
}

#mainNav .navbar-brand {
  font-weight: 700;
  text-transform: uppercase;
  color: #0089d0;
}

#mainNav .navbar-brand:focus,
#mainNav .navbar-brand:hover {
  color: #0089d0;
}

#mainNav .navbar-about {
  font-size: 11px;
  font-weight: 700;
  border: 1px dashed #eeeeee;
}

#mainNav .navbar-about:hover {
  border-style: solid;
}

#mainNav .navbar-toggle {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #222222;
}

#mainNav .navbar-nav > li.nav-item > a.nav-link:focus,
#mainNav .navbar-nav > li.nav-item > a.nav-link {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #222222;
}

#mainNav .navbar-nav {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #222222;
}

#mainNav .navbar-nav > li.nav-item > a.nav-link:focus:hover,
#mainNav .navbar-nav > li.nav-item > a.nav-link:hover {
  color: #0089d0;
}

#mainNav .navbar-nav > li.nav-item > a.nav-link:focus.active,
#mainNav .navbar-nav > li.nav-item > a.nav-link.active {
  color: #0089d0 !important;
  background-color: transparent;
}

#mainNav .navbar-nav > li.nav-item > a.nav-link:focus.active:hover,
#mainNav .navbar-nav > li.nav-item > a.nav-link.active:hover {
  background-color: transparent;
}

#mainNav > .container > #navbarResponsive {
  margin: 10px 0px;
}

@media (min-width: 992px) {
  #mainNav {
    border-color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
  }
  #mainNav .navbar-brand {
    color: rgba(255, 255, 255, 0.7);
  }
  #mainNav .navbar-brand:focus,
  #mainNav .navbar-brand:hover {
    color: white;
  }
  #mainNav .navbar-nav > li.nav-item > a.nav-link,
  #mainNav .navbar-nav > li.nav-item > a.nav-link:focus {
    color: rgba(255, 255, 255, 0.7);
  }
  #mainNav .navbar-nav > li.nav-item > a.nav-link:hover,
  #mainNav .navbar-nav > li.nav-item > a.nav-link:focus:hover {
    color: white;
  }
  #mainNav.navbar-shrink {
    border-color: rgba(34, 34, 34, 0.05);
    background-color: white;
  }
  #mainNav.navbar-shrink .navbar-brand {
    font-size: 16px;
    color: #0089d0;
  }
  #mainNav.navbar-shrink .navbar-brand:focus,
  #mainNav.navbar-shrink .navbar-brand:hover {
    color: #0089d0;
  }
  #mainNav.navbar-shrink .navbar-nav > li.nav-item > a.nav-link,
  #mainNav.navbar-shrink .navbar-nav > li.nav-item > a.nav-link:focus {
    color: #222222;
  }
  #mainNav.navbar-shrink .navbar-nav > li.nav-item > a.nav-link:hover,
  #mainNav.navbar-shrink .navbar-nav > li.nav-item > a.nav-link:focus:hover {
    color: #0089d0;
  }
}
</style>
