<template>
  <div>
    <div
      v-if="!errors.length && submitted && !status.registering && status.error"
      v-for="error in status.error"
      :key="error.id"
      class="alert alert-danger mt-2"
      role="alert"
    >
      >
      {{ error.message }}
    </div>
    <form @submit.prevent="handleSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">
            {{ error }}
          </li>
        </ul>
      </p>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="text"
          name="username"
          class="form-control form-control-lg"
        >
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="user.email"
          type="text"
          name="email"
          class="form-control form-control-lg"
        >
      </div>
      <div class="form-group">
        <label htmlFor="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          name="password"
          class="form-control form-control-lg"
        >
      </div>
      <div class="form-group">
        <button
          class="btn btn-dark btn-lg mr-2"
          :disabled="status.registering"
        >
          Register
        </button>
        <img
          v-show="status.registering"
          src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
        >
        <b-button
          @click="$emit('close-modal')"
          class="btn btn-dark btn-lg ml-2"
        >
          Cancel
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '@/mixins/collectionMixin'
import userService from '@/api/user.service'

export default {
  mixins: [collectionMixin],
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: [],
      submitted: false,
      users: [],
      alert: {},
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  watch: {
    $route(to, from) {
      // clear alert on location change
      this.clearAlert()
    },
    status(val) {
      if (val.registered) {
        this.$emit('link-clicked', 'Notice')
      }
    }
  },
  methods: {
    ...mapActions('account', ['register'], { clearAlert: 'alert/clear' }),
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    handleSubmit(e) {
      this.submitted = true
      this.errors = []

      if (!this.user.username) {
        this.errors.push('Username required.')
      }
      if (!this.user.email) {
        this.errors.push('Email required.')
      } else if (!this.validEmail(this.user.email)) {
        this.errors.push('Valid email required.')
      }
      if (!this.user.password) {
        this.errors.push('Password required.')
      }

      if (!this.errors.length) {
        this.register(this.user)
      }
    },
  },
}
</script>
