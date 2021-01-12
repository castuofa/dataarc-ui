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
      {{ status.success }}
    </div>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">
          {{ error }}
        </li>
      </ul>
    </p>
    <form
      class="forgotPassword"
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
      <br>
      <button
        type="submit"
        class="btn btn-dark btn-lg btn-block"
      >
        Request Password Reset
      </button>
    </form>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      submitted: false,
      errors: [],
    }
  },
  computed: {
    ...mapState('account', ['status']),
  },
  watch: {
    status(val) {
      if (val.success) {
        setTimeout(() => this.$emit('close-modal'), 1500)
      }
    },
  },
  methods: {
    ...mapActions('account', ['forgotPassword']),
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    handleSubmit() {
      this.submitted = true
      const { email} = this
      if (this.validEmail(email)) {
        this.forgotPassword(email)
      }
      else {
        this.errors.push('Valid email required.')
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
