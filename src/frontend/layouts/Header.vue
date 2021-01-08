<template>
  <div>
    <dataarc-nav :triggerLogin="triggerLogin"/>
    <header class="masthead home-shore">
      <div class="header-content">
        <div class="header-content-inner">
          <h1 id="homeHeading">
            DataARC Search Tool
          </h1>
          <hr class="light" />
          <h3>
            Find contextualized data from ecological, archaeological, and
            historical sources for the North Atlantic.
          </h3>
          <p>
            You can search and filter by any combination of keyword, time, space
            and concept. Combine filters to narrow your search.
          </p>
          <p>
            The filters do not need to be completed in any particular order.
            We recommend applying a filter and then revisiting the other data
            visualization graphs to view the changes that reflect the newly selected data.
          </p>
          <h6>
            <a target="_blank" :href="`${$helpUrls.baseUrl}master/`" class="btn btn-sm btn-outline-light">Not sure where to start?</a>
          </h6>
          <br /><br /><br />
          <div class="row">
            <div class="col-lg-4 col-md-6 text-center">
              <div class="service-box">
                <a
                  class="js-scroll-trigger text-light"
                  href="#temporal-section"
                >
                  <fa-icon
                    :icon="['far', 'clock']"
                    class="fa-4x text-success sr-icons"
                  />
                  <h4 class="mt-2">Temporal</h4>
                </a>
                <a
                  class="btn btn-sm btn-light js-scroll-trigger"
                  href="#temporal-section"
                  @click="$emit('apply-sample-filter', 'temporal')"
                  >Run Example</a
                >
                <p>See the results produced using a temporal filter (1,000 - 2,000 CE).</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 text-center">
              <div class="service-box">
                <a class="js-scroll-trigger text-light" href="#spatial-section">
                  <fa-icon icon="compass" class="fa-4x text-danger sr-icons" />
                  <h4 class="mt-2">Spatial</h4>
                </a>
                <a
                  class="btn btn-sm btn-light js-scroll-trigger"
                  href="#spatial-section"
                  @click="$emit('apply-sample-filter', 'polygon')"
                  >Run Example</a
                >
                <p>See the results from drawing a spatial bounding box around Iceland.</p>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 text-center">
              <div class="service-box">
                <a class="js-scroll-trigger text-light" href="#concept-section">
                  <fa-icon icon="sitemap" class="fa-4x text-warning sr-icons" />
                  <h4 class="mt-2">Concept</h4>
                </a>
                <a
                  class="btn btn-sm btn-light js-scroll-trigger"
                  href="#concept-section"
                  @click="$emit('apply-sample-filter', 'concept')"
                  >Run Example</a
                >
                <p>
                  See the results from filtering based on the concept of "humans."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
  <!-- Navigation -->
</template>

<script>
import DataarcNav from './Nav.vue';
// import CallToAction from './CallToAction.vue'
export default {
  name: 'FrontendHeader',
  components: {
    DataarcNav
    // CallToAction,
  },
  props: {
    triggerLogin: {
      type: Boolean,
      required: true
    },
  },
};
</script>

<style lang="scss" scoped>
header.masthead {
  min-height: 100vh;
}
</style>
