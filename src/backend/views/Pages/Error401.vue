<template lang="html">
  <section class="error-500">
    <div class="container-fluid full-page-wrapper">
      <div class="content-wrapper d-flex align-items-center text-center error-page bg-info">
        <div class="row flex-grow">
          <div class="col-lg-7 mx-auto text-white">
            <div class="row align-items-center d-flex flex-row">
              <div class="col-lg-6 text-lg-right pr-lg-4">
                <h3 class="display-1 mb-0">
                  401
                </h3>
              </div>
              <div class="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                <h3>Unauthorized</h3>
                <h3 class="font-weight-light">
                  You are not authorized to view that section
                </h3>
              </div>
            </div>
            <div class="row mt-5">
              <div class="col-12 text-center mt-xl-2">
                <a
                  class="text-white font-weight-medium"
                  href="/about"
                >Back to home</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
      <!-- page-body-wrapper ends -->
    </div>
  </section>
</template>

<script lang="js">
export default {
  name: 'Error401',
}
</script>

<style scoped lang="scss">
.error-500 {
}
</style>
