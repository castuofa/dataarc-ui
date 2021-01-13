<template>
  <div>
    <b-form>
      <b-form-textarea v-model="model[schema.model]" rows="4" size="lg" no-auto-shrink></b-form-textarea>
    </b-form>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
export default {
  data() {
    return {

    }
  },
  mixins: [abstractField],
  mounted() {
  },
  methods: {

  },

}
</script>

<style>
</style>
