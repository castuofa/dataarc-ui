<template>
  <div ref="profile">
    <b-row>
      <b-col class="text-center pt-5">
        <h2>
          Manage Profile
        </h2>
        <hr class="primary">
        <!-- <p>Use the timeline to examine how data is distributed temporally.</p> -->
      </b-col>
    </b-row>
    <br>
    <b-col sm="10" align-self="center" md="auto">
      <b-row class="justify-content-md-center">
        <b-col sm="6">
          <user-info
            id="user-info"
          />
        </b-col>
        <b-col sm="6">
          <searches
            id="searches"
            :userId="currentId"
          />
        </b-col>
      </b-row>
    </b-col>
    <br>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Searches from './profile-components/Searches.vue'
import UserInfo from './profile-components/UserInfo.vue'

export default {
  components: {
    Searches,
    UserInfo,
  },
  data() {
    return {
      currentId: '',
    }
  },
  computed: {
    ...mapState('account', ['user', 'role', 'status']),
  },
  mounted() {
    this.scrollToRef()
    if (!this.status || !this.user) {
      this.$router.push('/')
    }
    this.getId()
  },
  updated() {
    this.scrollToRef()
  },
  methods: {
    getId() {
      if (this.user && this.user.id) {
        this.currentId = this.user.id
      }
    },
    scrollToRef() {
      this.$refs.profile.scrollIntoView()
    },
  }
}
</script>

<style>

</style>
