<template>
  <b-container fluid>
    <table-view-layout
      :fluid="true"
      :rows="rows"
      :component="component"
      :limits="limits"
      :current-page="currentPage"
      :per-page="perPage"
      @inputChanged="updateFilter"
      @change="updatePage"
      @deleteConfirmed="deleteItem(itemToDelete, 'Users')"
      @limitUpdated="updateLimit"
    >
      <template v-slot:table>
        <b-table
          ref="users"
          id="users"
          :busy="usersLoading"
          :per-page="perPage"
          :current-page="currentPage"
          table-variant="light"
          head-variant="light"
          :filter="filter"
          :items="users.items"
          :fields="displayFields"
          @filtered="updatePagination"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(confirmed)="row">
            <b-form-checkbox v-model="row.item.confirmed" @change="row.item.confirmed != row.item.confirmed" />
          </template>
          <template v-slot:cell(blocked)="row">
            <b-form-checkbox v-model="row.item.blocked" @change="row.item.blocked != row.item.blocked" />
          </template>
          <template v-slot:cell(role)="row">
            <div v-if="row.item.role.name">
              <b-dropdown :text="row.item.role.name">
                <div v-for="role in roles" :key="role.id">
                  <b-dropdown-item v-model="row.item.role" @click="row.item.role = role">
                    {{ role.name }}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </div>
          </template>

          <template v-slot:cell(actions)="row" class="actions">
            <b-button-group size="sm">
              <b-button variant="primary" v-text="'Delete'" @click="itemToDelete = row.item" v-b-modal.deleteConfirmation />
              <b-button variant="primary" v-text="'Save'" @click="updateUser(row.item)"></b-button>
            </b-button-group>
          </template>
        </b-table>
      </template>
    </table-view-layout>
  </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import collectionMixin from '@/mixins/collectionMixin'
export default {
  mixins: [collectionMixin],
  data() {
    return {
      component: 'Users',
      displayFields: [
        { key: 'actions', sortable: false },
        { key: 'username', sortable: true },
        { key: 'email', sortable: true },
        { key: 'confirmed', sortable: true },
        { key: 'blocked', sortable: true },
        { key: 'role', sortable: true },
      ],
      total: '',
      usersLoading: true,
    }
  },
  computed: {
    ...mapState({
      account: (state) => state.account,
      users: (state) => state.users.all,
      user: (state) => state.users.user,
    }),
  },
  watch: {
    $route(to, from) {
      this.getAllUsers()
    },
    users(val) {
      if (val.items) {
        this.total = val.items.length
        this.usersLoading = this.loadingState(this.total)
        this.rows = this.total
      }
    },
  },
  created() {
    this.getInitialData()
  },
  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAll',
      getById: 'getById',
      deleteUser: 'delete',
    }),
    getInitialData() {
      this.getAllUsers()
    },
    updateUser(val) {
      let temp = val
      temp.type = 'Users'
      temp.action = 'Update'
      temp.admin = true
      this.setFormData(temp)
    },
  },
}
</script>
