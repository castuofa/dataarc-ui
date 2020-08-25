import gql from 'graphql-tag'
import {
  Combinators, MapLayers, Categories, Datasets, Users, DatasetFields,
} from '../models'
import TableViewLayout from '../views/Collections/templates/TableViewLayout.vue'

const Models = {
  Combinators,
  MapLayers,
  Categories,
  Datasets,
  Users,
  DatasetFields,
}

const apollo = {
  allCategories: {
    query: gql`
      query {
        categories {
          id
          name
          title
          description
          color
          datasets{
            title
          }
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allCategories
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.categories = data.categories
      }
    },
  },
  allMapLayers: {
    query: gql`
      query {
        mapLayers {
          id
          name
          title
          description
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allMapLayers
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.mapLayers = data.mapLayers
      }
    },
  },
  allDatasets: {
    query: gql`
      query {
        datasets {
          id
          name
          title
          description
          citation
          state
          state_msg
          state_at
        }
      }
    `,
    skip: (this ? (this.currentDataset || !this.currentId) : true),
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allDatasets
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.datasets = data.datasets
      }
    },
  },
  dataset: {
    query: gql`query dataset($id: ID!) {
      dataset(id: $id) {
        id
        name
        title
        description
        citation
        link
        category{
          id
          name
          title
        }
        title_layout
        link_layout
        details_layout
        summary_layout
        fields{
          id
          name
          title
          type
          path
        }
        combinators{
          id
          name
          title
          description
          citation
        }
      }
    }`,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId,
      }
    },
    skip: (this ? (this.currentDataset || !this.currentId) : true),
    ssr: false,
    // Variables: deep object watch
    deep: false,
    // We use a custom update callback because
    // the field names don't match
    // By default, the 'currentDataset' attribute
    // would be used on the 'data' result object
    // Here we know the result is in the 'id' attribute
    // considering the way the apollo server works
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.dataset) {
        this.currentDataset = data.dataset
        this.fieldsCount = this.currentDataset.fields.length
        this.combinatorsCount = this.currentDataset.combinators.length
      }
    },
    // Error handling
    error(error) {
      console.error('We\'ve got an error!', error)
    },
    // Loading state
    // loadingKey is the name of the data property
    // that will be incremented when the query is loading
    // and decremented when it no longer is.
    loadingKey: 'loadingQueriesCount',
    // watchLoading will be called whenever the loading state changes
    watchLoading(isLoading, countModifier) {
      // isLoading is a boolean
      // countModifier is either 1 or -1
    },
  },
  datasetWFeatures: {
    query: gql`query dataset($id: ID!) {
      dataset(id: $id) {
        id
        name
        title
        description
        citation
        link
        category{
          id
          name
          title
        }
        title_layout
        link_layout
        details_layout
        summary_layout
        fields{
          id
          name
          title
          type
          path
        }
        features{
          title
          properties
        }
        combinators{
          id
          name
          title
          description
          citation
        }
      }
    }`,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId,
      }
    },
    skip: (this ? (this.currentDataset || !this.currentId) : true),
    ssr: false,
    // Variables: deep object watch
    deep: false,
    // We use a custom update callback because
    // the field names don't match
    // By default, the 'currentDataset' attribute
    // would be used on the 'data' result object
    // Here we know the result is in the 'id' attribute
    // considering the way the apollo server works
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.dataset) {
        this.currentDataset = data.dataset
        this.fieldsCount = this.currentDataset.fields.length
      }
    },
    // Error handling
    error(error) {
      console.error('We\'ve got an error!', error)
    },
    // Loading state
    // loadingKey is the name of the data property
    // that will be incremented when the query is loading
    // and decremented when it no longer is.
    loadingKey: 'loadingQueriesCount',
    // watchLoading will be called whenever the loading state changes
    watchLoading(isLoading, countModifier) {
      // isLoading is a boolean
      // countModifier is either 1 or -1
    },
  },
}

const methods = {
  async process(val) {
    this.currentId = val.id
    val.state = 'processing'
    const resp = await axios.get(`${this.$baseUrl}/datasets/${val.id}/process`)
    if (resp) {
      this.$apollo.queries.allDatasets.refetch()
    }
  },
  async getSingle(path) {
    try {
      const temp = await axios.get(`${this.$baseUrl}/${path}`)
      return temp
    } catch (err) {
      console.log(err)
    }
  },
  getSource(path, key) {
    return axios.get(`${this.$baseUrl}/${path}`).then((response) => {
      if (key) {
        return response.data[key]
      }
      return response.data
    }).catch((error) => {
      console.log('error')
      console.log(error)
    })
  },
  setFormField(val, type) {
    this.schema.fields.filter((field) => {
      if (field.model && field.model === type) {
        field.values = val
      }
    })
  },
  setFormData(val) {
    const dataModel = new Models[val.type](val)
    if (val.action === 'Create') {
      dataModel._create().then((value) => {
        this.$router.push(dataModel.routeUrl)
      })
    }
    else {
      dataModel._update().then((value) => {
        if (val.type === 'DatasetFields') {
          return
        }
        else {
          this.$router.go(-1)
        }
      })
    }
  },
  limitFields() {
    const dataModel = Models[this.model.type]
    this.schema.fields.forEach((field) => {
      if (field.buttonText === 'Delete') {
        // If adding a new **, hide Delete button
        if (this.model.action === 'Create') {
          field.visible = false
        }
        return
      }
      // Always display submit
      if (field.buttonText === 'Submit') {
        return
      }
      if (field.model) {
        field.visible = dataModel.isAttributeFillable(field.model)
      }
    })
  },
  updatePage(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Page`] = val
    }
    else {
      this.currentPage = val
    }
  },
  updateLimit(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Limit`] = val
    }
    else {
      this.perPage = val
    }
  },
  deleteItem(item, type) {
    this.$bvModal.hide('deleteConfirmation')
    const dataModel = new Models[item.type ? item.type : type](item)
    dataModel._delete().then((value) => {
      if (dataModel.routeUrl === this.$router.history.current.path) {
        if (value === 'users') {
          this.getAllUsers()
        }
        else if (value === 'allDatasets' || value === 'allMapLayers' || value === 'allCategories') {
          this.$apollo.queries[value].refetch()
        }
        else {
          this.$asyncComputed[value].update()
        }
      }
      else {
        this.$router.push(dataModel.routeUrl)
      }
    })
  },
  getDate(val) {
    if (!val) {
      return ''
    }
    const newDate = new Date(val)
    return newDate.toLocaleString()
  },
  updateFilter(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`filter${component}`] = val
    }
    else {
      this.filter = val
    }
  },
  updatePagination(array, val) {
    if (this.$route.name === 'Dataset View') {
      if (array[0].__typename === 'DatasetField') {
        this.fieldsCount = val
      }
      else {
        this.combinatorsCount = val
      }
    }
    this.rows = val
  },
}

const asyncComputed = {
  rows: {
    get() {
      if (this.component === 'MapLayers') {
        return this.mapLayers.length
      }
      if (this.component === 'Users' && this.total > 0) {
        return this.total
      }
      return this[this.component.toLowerCase()].length
    },
    shouldUpdate() {
      if (this.component === 'MapLayers') {
        return (this.component && this.mapLayers)
      }
      return (this.component && (this.component === 'Users' || this[this.component.toLowerCase()]))
    },
  },
  // Keeping _***** values to get cache working later on possibly
  events: {
    get() {
      if (this._events && this._events.length > 0) {
        return this._events
      }
      return this.getSource('events')
      .then((events) => {
        this._events = events
        if (this.schema) {
          this.setFormField(this._events, 'events')
        }
        return this._events
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Events' || this.collectionType === 'Users' || this.component === 'Events')
    },
  },
  combinators: {
    get() {
      return this.getSource('combinators?_limit=200')
      .then((combinators) => {
        this._combinators = combinators
        if (this.schema) {
          this.setFormField(this._combinators, 'combinators')
        }
        return this._combinators
      })
    },
    shouldUpdate() {
      return this.component === 'Combinators'
    },
  },
  concepts: {
    get() {
      // if (this._concepts && this._concepts.length > 0) {
      //   return this._concepts
      // }
      return this.getSource('concepts')
      .then((concepts) => {
        this._concepts = concepts
        if (this.schema) {
          this.setFormField(this._concepts, 'concepts')
        }
        return this._concepts
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Combinators' || this.collectionType === 'Concepts' || this.component === 'Concepts')
    },
  },
  roles: {
    get() {
      if (this._roles && this._roles.length > 0) {
        return this._roles
      }
      return this.getSource('users-permissions/roles', 'roles')
      .then((roles) => {
        this._roles = roles
        if (this.schema) {
          this.setFormField(this._roles, 'roles')
        }
        return this._roles
      })
    },
    shouldUpdate() {
      return (this.collectionType === 'Users')
    },
  },
}

const data = function () {
  return {
    deleteModal: false,
    itemToDelete: [],
    currentPage: 1,
    perPage: 10,
    limits: [10, 20, 50, 100],
    currentId: '',
    datasets: [],
    mapLayers: [],
    categories: [],
    currentDataset: {},
    currentFieldsPage: 1,
    currentCombinatorsPage: 1,
    currentFieldsLimit: 10,
    currentCombinatorsLimit: 10,
    filter: '',
  }
}

export default {
  apollo,
  methods,
  asyncComputed,
  data,
  components: {
    TableViewLayout,
  },
}
