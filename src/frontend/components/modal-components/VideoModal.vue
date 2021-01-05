<template>
  <b-modal visible @hide="$emit('video-closed')" size="lg" :centered="true" id="video" :hide-footer="true">
    <div class="modal-content" >
      <div style="padding:45% 0 0 0;position:relative;">
        <iframe :src="path" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen />
      </div>
    </div>
  </b-modal>
</template>

<script>

export default {
  props: {
    path: {
      type: [String, Boolean],
      default: false,
    },
  },
}
</script>

<style>

</style>
