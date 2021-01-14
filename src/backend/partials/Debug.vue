<template lang="html">
  <div
    class="bg-secondary mt-2 mb-2"
    style="overflow-x:auto;overflow-y:auto; max-width:600px;"
  >
    <pre v-if="$DEBUG.NODE_ENV === 'development'">
      Debug Data:
      <slot />
  </pre>
  </div>
</template>

<script lang="js">
export default {
  name: 'Log',
}
</script>
