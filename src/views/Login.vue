<template>
  <div>
    <form
      class="login"
      @submit.prevent="handleSubmit()"
    >
      <div class="form-group">
        <label>Email address</label>
        <input
          v-model="email"
          required
          type="email"
          class="form-control form-control-lg"
        >
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          required
          type="password"
          class="form-control form-control-lg"
        >
      </div>
      <b-row>
        <b-col sm="6">
          <b-button
            @click="$emit('link-clicked', 'Register')"
            class="btn btn-dark btn-lg btn-block"
          >
            Register
          </b-button>
          <br>
          <a
            href="#"
            @click="$emit('link-clicked', 'Forgot Password')"
          >
            Forgot Password?
          </a>
        </b-col>
        <b-col sm="6">
          <button
            type="submit"
            class="btn btn-dark btn-lg btn-block"
          >
            Login
          </button>
        </b-col>
      </b-row>
    </form>
    <div
      v-if="submitted && !status.loggedIn && status.error"
      class="alert alert-danger mt-2"
      role="alert"
    >
      >
      {{ status.error.message }}
    </div>

    <debug>
      Status: {{ status }}
    </debug>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      submitted: false,
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  created() {
    // reset the login status when you reach the login page
    this.logout()
  },
  methods: {
    ...mapActions('account', ['login', 'logout']),

    handleSubmit() {
      this.submitted = true
      const { email, password } = this
      if (email && password) {
        const identifier = email
        this.login({ identifier, password }).then(() => {
          if(this.status.loggedIn) {
            this.$emit('close-modal')
          }
        })
      }
    },
  },
}
</script>

<style lang="scss">
.help{
  color: #d9534f;
}
</style>
