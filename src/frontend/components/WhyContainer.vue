<template>
  <section
    id="why-section"
    class="bg-light"
  >
    <div class="call-to-action">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2>
              Why
              <sup><a
                :href="$helpUrls.why"
                title="Read instructions on how to use the tool"
                class="text-dark"
                target="_blank"
                data-toggle="tooltip"><b-icon-file-earmark-text /></a></sup>
            </h2>
            <hr class="primary">
            <p>
              Explore the connections between the concepts, combinators and datasets <br>
              used to produce your search results.
            </p>
          </div>
        </div>
        <div class="row">
          <DartQueryExplainer :filter="filters"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DartQueryExplainer from './why-components/DartQueryExplainer.vue';

export default {
  name: 'WhyContainer',
  components: {
    DartQueryExplainer
  },
   props: {
    filters: {
      type: Object,
      required: true
    }
  },
}
</script>

<style>

</style>
