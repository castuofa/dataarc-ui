<template>
  <b-container :fluid="fluid">
    <h3>{{component}}</h3>
    <small>{{rows ? rows : 0 }} entries found</small>
    <div class="d-flex justify-content-end">
      <slot name="button"/>
    </div>
    <br>
    <b-row>
      <div class="d-flex justify-content-start">
        <b-pagination
          size="sm"
          v-model="currentPage"
          @change="notify"
          :total-rows="rows"
          :per-page="(perPage === 0 ? 10 : perPage)"
          :limit="4"
          first-number
          last-number
        />
      </div>
      <div size="lg" class="justify-content-center">
        <b-input-group>
          <b-input v-model="filters" @update="$emit('inputChanged', filters, component)" placeholder="Filter by Keyword"></b-input>
          <b-button v-if="filters" @click="clear">Clear<b-icon-x></b-icon-x></b-button>
        </b-input-group>
      </div>
    </b-row>
    <slot name="table"/>
    <b-modal hide-backdrop content-class="shadow" centered id="deleteConfirmation">
      <template v-slot:modal-title>
        Delete Confirmation
      </template>
      <p class="my-2">
        Are you sure you want to delete this {{ component.slice(0, -1) }}?
      </p>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="danger" @click="$emit('deleteConfirmed')">
          Delete
        </b-button>
      </template>
    </b-modal>
    <div>
      <b-dropdown id="dropdown-1" :text="perPage.toString()" class="m-md-2">
        <div v-for="limit in limits" :key="limit">
          <b-dropdown-item @click="$emit('limitUpdated', limit, component)">{{limit}}</b-dropdown-item>
        </div>
      </b-dropdown>
      <small>entries per Page</small>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'TableLayout',
  props: [
    'rows',
    'currentPage',
    'perPage',
    'limits',
    'component',
    'fluid'
  ],
  data() {
    return {
      filters: '',
    }
  },
  methods: {
    notify(val) {
      this.$emit('change', val, this.component)
    },
    clear() {
      this.filters = ''
      this.$emit('inputChanged', this.filters, this.component)
    },
  },

}
</script>

<style>
.table td {
  padding: 0.5rem;
  padding-right: 0rem;
}

.btn-sm, .btn-group-sm > .btn{
  padding: 0.3rem;
}

</style>
