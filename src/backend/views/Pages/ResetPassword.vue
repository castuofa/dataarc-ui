<template>
  <div>
    <div
      v-if="submitted && !status.loggedIn && status.error"
      class="alert alert-danger mt-2"
      role="alert"
    >
      >
      {{ status.error.message }}
    </div>
    <div
      v-if="submitted && status.success"
      class="alert alert-success mt-2"
      role="alert"
    >
      >
      {{ status.success }} Redirecting...
    </div>
    <p v-if="passwordErrors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in passwordErrors">
          {{ error }}
        </li>
      </ul>
    </p>
    <form
      class="resetPassword"
      @submit.prevent="handleSubmit()"
    >
      <h3>Reset Password</h3>

      <div class="form-group">
        <input
          v-model="code"
          hidden
        >
        </input>
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
      <div class="form-group">
        <label>Confirm Password</label>
        <input
          v-model="passwordConfirmation"
          required
          type="password"
          class="form-control form-control-lg"
        >
      </div>
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block"
      >
        Reset Password
      </button>
    </form>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      code: '',
      password: '',
      passwordConfirmation: '',
      submitted: false,
      passwordErrors: [],
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  watch: {
    status(val) {
      if (val.success) {
        setTimeout(() => this.$router.push('/'), 1500)
      }
    },
  },
  mounted() {
    this.code = this.$route.query.code
  },
  methods: {
    ...mapActions('account', ['resetPassword']),

    handleSubmit() {
      this.submitted = true
      const { code, password, passwordConfirmation } = this
      this.passwordErrors = []

      if (!password) {
        this.passwordErrors.push('Password required.')
      } else if (!passwordConfirmation) {
        this.passwordErrors.push('Confirmation Password required.')
      } else if (password !== passwordConfirmation) {
        this.passwordErrors.push('Passwords must match.')
      } else if (code && password && passwordConfirmation) {
        this.resetPassword({code, password, passwordConfirmation })
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
