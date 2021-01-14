<template>
  <div>
    <multiselect
      v-model="model[schema.model]"
      :options="schema.values"
      :multiple="true"
      group-values="values"
      group-label="group"
      :group-select="true"
      :hide-selected="true"
      placeholder="Type to search"
      track-by="id"
      label="title"
      ><span slot="noResult">Oops! No elements found. Consider changing the search query.</span></multiselect
    >
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
export default {
  data() {
    return {}
  },
  mixins: [abstractField],
  mounted() {},
  methods: {},
}
</script>

<style></style>
