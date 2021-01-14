<template>
  <div>
    <b-jumbotron>
      <template v-slot:header>
        <div class="text-center">
          dataARC
        </div>
      </template>

      <template v-slot:lead>
        <div class="text-center">
          You have been successfully Registered!
        </div>
      </template>

      <hr class="my-4">

      <p>
        <b-row>
          <b-col sm="1">
            <strong>Note:</strong>
          </b-col>
          <b-col sm="11">
            You can now login, however, you will need to wait for an email confirmation before gaining Contributor access.
          </b-col>
        </b-row>
      </p>
      <div class="text-center">
        <b-button variant="primary" @click="$emit('link-clicked', 'Login')">Continue to Login</b-button>
      </div>
    </b-jumbotron>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },

  methods: {
  },
}
</script>

<style src="bootstrap/dist/css/bootstrap.css"></style>
<style src="bootstrap-vue/dist/bootstrap-vue.css"></style>
