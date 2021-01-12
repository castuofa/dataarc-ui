<template>
  <section id="keyword-section" class="bg-light">
    <b-container class="text-center pt-5 pb-5">
      <b-row>
        <b-col>
          <h2>
            Keyword
            <sup><a
              :href="$helpUrls.keyword"
              title="Read instructions on how to use the tool"
              class="text-dark"
              target="_blank"
              data-toggle="tooltip"><b-icon-file-earmark-text /></a></sup>
          </h2>
          <hr class="primary">
          <p>
            Filter by keyword. Keywords are commonly occurring words found within the database text.<br>
            Keyword and concept filters using the same word(s) will produce different results.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3 mb-3">
          <b-card no-body class="shadow">
            <keyword v-model="keywords" :pre-loaded="preLoadedKeywords" />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import Keyword from './keyword-components/Keyword.vue'
export default {
  name: 'KeywordContainer',
  components: {
    Keyword,
  },

  data() {
    return {
      keywords: '',
      loadedKeywords: ''
    }
  },
  computed: {
    preLoadedKeywords() {
      if (this.loadedKeywords) {
        return this.loadedKeywords
      }
      return false
    }
  },
  watch: {
    keywords() {
      this.$emit('input', this.keywords)
    },
  },
  methods: {
    loadFilters(arrayValues) {
      this.loadedKeywords = arrayValues
    },
    removeFilters() {
      this.loadedKeywords = false
    },
  }
}
</script>

<style></style>
