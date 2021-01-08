<template>
  <div>
    <b-form v-model="schema.value">
      <b-row>
        <b-col>
          <b-input-group v-for="(query, key) in totalQueries" :key="query" size="lg" class="mb-3">
            <b-input-group-prepend>
              <b-dropdown no-flip :text="getText(key)" variant="outline-secondary" aria-placeholder="Select Field">
                <div v-for="value in schema.values" :key="value.id">
                  <b-dropdown-item @click="setField(key, 'field', value.name, value.type, value.id)">{{ value.name }}</b-dropdown-item>
                </div>
              </b-dropdown>
              <b-dropdown :text="(form[key] && form[key]['operator']) ? form[key]['operator'] : 'equals'" variant="outline-secondary">
                <div v-if="value[key]">
                  <div v-for="operator in getOperators(value[key])" :key="operator.value">
                    <b-dropdown-item @click="setField(key, 'operator', operator.value)">{{ operator.type }}</b-dropdown-item>
                  </div>
                </div>
                <div v-else v-for="operator in operators" :key="operator.value">
                  <b-dropdown-item @click="setField(key, 'operator', operator.value)">{{ operator.type }}</b-dropdown-item>
                </div>
              </b-dropdown>
              <b-form-input variant="outline-secondary" v-model="values[key]" @input="setField(key, 'value', values[key])" placeholder="Text Input">

              </b-form-input>
            </b-input-group-prepend>
            <b-input-group-append>
              <b-row>
                <b-col>
                  <b-button-group>
                    <b-button variant="light" size="sm" v-if="totalQueries > 1" @click="decrement(key)">
                      -
                    </b-button>
                    <b-button variant="light" size="sm" v-if="query === totalQueries" @click="increment">
                      <b-icon-plus-circle-fill></b-icon-plus-circle-fill>
                    </b-button>
                  </b-button-group>
                </b-col>
              </b-row>
            </b-input-group-append>
          </b-input-group>
        </b-col>

      </b-row>
    </b-form>
  </div>
</template>

<script>
import { abstractField } from 'vue-form-generator'
export default {
  data() {
    return {
      form: [],
      operators: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Contains', value: 'contains'},
        {type: 'Not Contains', value: 'not_contains'},
        {type: 'Greater Than', value: 'greater_than'},
        {type: 'In', value: 'in'},
        {type: 'Not In', value: 'not_in'},
        {type: 'Less Than', value: 'less_than'},
        {type: 'Less Than or Equal to', value: 'less_than_or_equal_to'},
        {type: 'Greater Than or Equal to', value: 'greater_than_or_equal_to'},
        {type: 'Starts With', value: 'starts_with'},
        {type: 'Ends With', value: 'ends_with'},
      ],
      number: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Greater Than', value: 'greater_than'},
        {type: 'Less Than', value: 'less_than'},
        {type: 'Less Than or Equal to', value: 'less_than_or_equal_to'},
        {type: 'Greater Than or Equal to', value: 'greater_than_or_equal_to'},
      ],
      array: [
        {type: 'In', value: 'in'},
        {type: 'Not In', value: 'not_in'},
      ],
      string: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
        {type: 'Contains', value: 'contains'},
        {type: 'Not Contains', value: 'not_contains'},
        {type: 'Starts With', value: 'starts_with'},
        {type: 'Ends With', value: 'ends_with'},
      ],
      boolean: [
        {type: 'Equals', value: 'equals'},
        {type: 'Not Equals', value: 'not_equals' },
      ],
      totalQueries: 1,
      queries: {},
      values: {},
    }
  },
  watch: {
    form: {
      handler(val) {
        if (val) {
          this.queries = val
          if (this.model.queries.length > 0) {
            for (let i = 0; i < this.queries.length; i++) {
              if (this.model.queries[i]) {
                _.merge(this.model.queries[i], this.queries[i])
              }
              else {
                this.model.queries[i] = {}
                Object.assign(this.model.queries[i], this.queries[i])
              }
            }
          }
          else {
            this.model.queries = this.queries
          }
        }
      },
      deep: true,
    },
    model: {
      handler(val) {
        if (val && val.queries.length > 0) {
          this.totalQueries = 0
          for (let i = 0; i < val.queries.length; i++) {
            this.$set(this.form, i, val.queries[i])
            this.values[i] = this.form[i].value
            this.totalQueries += 1
          }
          if (this.totalQueries === 0) {
            this.totalQueries = 1
          }
        }
      },
    },
  },
  mixins: [abstractField],
  mounted() {
    if (this.form.length === 0 && this.model.queries.length > 0) {
      this.form = this.model.queries
      this.totalQueries = this.model.queries.length
      for (let i = 0; i < this.form.length; i++) {
        this.values[i] = this.form[i].value
      }
    }
  },
  methods: {
    // If switching datasets, reset field if path is not contained in new dataset
    getText(val) {
      if (this.form && this.form[val] && this.form[val].field) {
        let test = this.schema.values.filter((field) => {
          if (field.name === this.form[val].field) {
            return true
          }
        })
        if (test.length === 0) {
          return 'Select Field'
        }
        this.form[val].type = test[0].type
        return this.form[val].field
      }
      return 'Select Field'
    },
    getOperators(val) {
      if (val) {
        if (val.type) {
          if (val.type === 'begin' || val.type === 'end') {
            return this.number
          }
          if (val.type === 'url') {
            return this.string
          }
          return this[val.type]
        }
        let test = this.schema.values.filter((value) => {
          if (val.field === value.name) {
            val.type = value.type
            return true
          }
        })
        if (test.length > 0) {
          let type = test[0].type
          if (type === 'begin' || type === 'end') {
            return this.number
          }
          if (type === 'url') {
            return this.string
          }
          return this[type]
        }
      }
      return this.operators
    },
    increment() {
      this.totalQueries += 1
    },
    decrement(int) {
      this.totalQueries -= 1
      this.deleteQuery(this.model.queries[int].id, int)
    },
    deleteQuery(id, int) {
      axios.delete(
        `${process.env.VUE_APP_API_URL}/combinator-queries/${id}`
      );
      let queries = this.model.queries
      for (let i = int; i <= queries.length; i++) {
        if (queries[i + 1]) {
          queries[i] = this.model.queries[i + 1]
          this.$delete(this.model.queries, (i + 1))
          this.values[i] = queries[i].value
          this.$delete(this.values, (i + 1))
        }
        else {
          this.$delete(this.model.queries, i)
          this.$delete(this.values, i)
        }
      }
      this.model.queries = queries
      this.form = this.model.queries
    },
    setField(int, field, val, type, id) {
      if (!this.form[int]) {
        this.$set(this.form, int, {})
      }
      if (!this.form[int].count) {
        this.$set(this.form[int], 'count', int)
        if (!this.form[int]['operator']) {
          this.$set(this.form[int], 'operator', 'equals')
        }
      }
      if (field === 'value') {
        this.$set(this.form[int], field, this.values[int])
      }
      if (field === 'field') {
        this.$set(this.form[int], field, val)
        this.$set(this.form[int], 'type', type)
        this.$set(this.form[int], 'dataset_field', id)
      }
      else {
        this.$set(this.form[int], field, val)
      }
    },
  },

}
</script>

<style>
.dropdown-menu {
  max-height: 380px;
  overflow-y: auto;
}
</style>
