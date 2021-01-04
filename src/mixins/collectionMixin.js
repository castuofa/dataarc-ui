import gql from 'graphql-tag';
import {
  Combinators,
  Categories,
  Datasets,
  Users,
  DatasetFields,
  TemporalCoverages,
  ConceptMaps,
  ConceptTopics,
  Concepts
} from '../models';
import TableViewLayout from '../views/Collections/templates/TableViewLayout.vue';

const Models = {
  Combinators,
  Categories,
  Datasets,
  Users,
  DatasetFields,
  TemporalCoverages,
  ConceptMaps,
  ConceptTopics,
  Concepts
};

const apollo = {
  allCombinators: {
    query: gql`
      query combinators($start: Int, $limit: Int) {
        combinators(start: $start, limit: $limit) {
          id
          name
          title
          description
          citation
          url
          operator
          dataset {
            id
            title
          }
        }
        countCombinators
      }
    `,
    skip: true,
    ssr: false,
    variables() {
      // Use vue reactive properties here
      return {
        limit:
          this && this.combinators.length === 0 && this.currentPage === 1
            ? 20
            : 60,
        start:
          this && this.combinators.length === 0 && this.currentPage === 1
            ? 0
            : this.combinators.length
      };
    },
    update(data) {
      return data.allCombinators;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        if (this.combinators.length === 0) {
          this.combinators = data.combinators;
        } else {
          this.combinators = _.unionWith(
            this.combinators,
            data.combinators,
            _.isEqual
          );
        }
        if (this.rows !== data.countCombinators) {
          this.rows = data.countCombinators;
        }
        if (this.combinators.length === this.rows) {
          this.$apollo.queries.allCombinators.skip = true;
        }
      }
    }
  },
  allConcepts: {
    query: gql`
      query concepts($start: Int, $limit: Int) {
        concepts(start: $start, limit: $limit) {
          id
          title
          description
          citation
          url
          group
        }
        countConcepts
      }
    `,
    skip: true,
    ssr: false,
    variables() {
      // Use vue reactive properties here
      return {
        limit:
          this &&
          this.concepts &&
          this.concepts.length === 0 &&
          this.currentPage === 1
            ? 20
            : 100,
        start:
          this &&
          this.concepts &&
          this.concepts.length === 0 &&
          this.currentPage === 1
            ? 0
            : this.concepts.length
      };
    },
    update(data) {
      return data.allConcepts;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        if (this.concepts.length === 0) {
          this.concepts = data.concepts;
        } else {
          this.concepts = _.unionWith(this.concepts, data.concepts, _.isEqual);
          this.groupedConcepts = _.groupBy(this.concepts, 'group');
          let temp = [];
          for (var group in this.groupedConcepts) {
            temp.push({
              group: _.startCase(group),
              values: _.sortBy(this.groupedConcepts[group], 'title')
            });
          }
          if (temp.length > 0) {
            let sorted = _.sortBy(temp, 'group');
            this.groupedConcepts = sorted;
          }
        }
        if (
          this.rows !== data.countConcepts &&
          this.component !== 'ConceptMap View'
        ) {
          this.rows = data.countConcepts;
        }
        if (this.concepts.length === this.rows) {
          this.$apollo.queries.allConcepts.skip = true;
        }
      }
    }
  },
  allTopics: {
    query: gql`
      query topics($start: Int, $limit: Int) {
        topics(start: $start, limit: $limit) {
          id
          name
          title
          concept_map {
            id
            name
            title
          }
        }
        countTopics
      }
    `,
    skip: true,
    ssr: false,
    variables() {
      // Use vue reactive properties here
      return {
        limit: 100,
        start:
          this &&
          this.topics &&
          this.topics.length === 0 &&
          this.currentPage === 1
            ? 0
            : this.topics.length
      };
    },
    update(data) {
      return data.allTopics;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        if (this.topics.length === 0) {
          this.topics = data.topics;
        } else {
          this.topics = _.unionWith(this.topics, data.topics, _.isEqual);
        }
        if (this.rows !== data.countTopics) {
          this.rows = data.countTopics;
        }
        if (this.topics.length === this.rows) {
          this.$apollo.queries.allTopics.skip = true;
        }
      }
    }
  },
  allCategories: {
    query: gql`
      query {
        categories {
          id
          name
          title
          description
          color
          datasets_count
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allCategories;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.categories = data.categories;
        this.rows = this.categories.length;
      }
    }
  },
  allTemporalCoverages: {
    query: gql`
      query {
        temporalCoverages {
          id
          title
          description
          citation
          url
          begin
          end
        }
      }
    `,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allTemporalCoverages;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        this.temporalCoverages = data.temporalCoverages;
        this.rows = this.temporalCoverages.length;
      }
    }
  },
  allConceptMaps: {
    query: gql`
      query {
        conceptMaps {
          id
          name
          title
          description
          citation
          url
          processed
          active
          source
          topics_count
          process
        }
      }
    `,
    polling: 5000,
    skip: true,
    ssr: false,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allConceptMaps;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        let stopQuery = data.conceptMaps.filter(conceptMap => {
          if (conceptMap.process) {
            return conceptMap;
          }
        });
        if (stopQuery.length === 0 || this.component !== 'ConceptMaps') {
          this.$apollo.queries.allConceptMaps.stopPolling();
        } else {
          this.$apollo.queries.allConceptMaps.startPolling(5000);
        }
        this.conceptMaps = data.conceptMaps;
        this.rows = this.conceptMaps.length;
      }
    }
  },
  allConceptTopics: {
    query: gql`
      query conceptTopics($map: ID!, $start: Int, $limit: Int) {
        conceptTopics(where: { map: $map }, start: $start, limit: $limit) {
          id
          title
          concept {
            id
            title
          }
        }
        conceptMaps(where: { id: $map }) {
          topics_count
        }
      }
    `,
    skip: true,
    ssr: false,
    variables() {
      // Use vue reactive properties here
      return {
        map:
          this && this.currentId ? this.currentId : '5fa05f2ac8efcfd72451a752',
        limit: 100,
        start:
          this &&
          this.conceptTopics &&
          this.conceptTopics.length === 0 &&
          this.currentPage === 1
            ? 0
            : this.conceptTopics.length
      };
    },
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allConceptTopics;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        if (this.conceptTopics.length === 0) {
          this.conceptTopics = data.conceptTopics;
        } else {
          this.conceptTopics = _.unionWith(
            this.conceptTopics,
            data.conceptTopics,
            _.isEqual
          );
        }
        if (this.rows !== data.conceptMaps[0].topics_count) {
          this.rows = data.conceptMaps[0].topics_count;
        }
        if (this.conceptTopics.length === this.rows) {
          this.$apollo.queries.allConceptTopics.skip = true;
        }
      }
    }
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
          source
          image
          metadata
          processed
          fields_count
          features_count
          combinators_count
          process
        }
      }
    `,
    pollInterval: 5000,
    skip: true,
    update(data) {
      // The returned value will update
      // the vue property 'datasets'
      return data.allDatasets;
    },
    result({ data, loading, networkStatus }) {
      if (data) {
        let stopQuery = data.datasets.filter(dataset => {
          if (dataset.process) {
            return dataset;
          }
        });
        if (stopQuery.length === 0 || this.component !== 'Datasets') {
          this.$apollo.queries.allDatasets.stopPolling();
        } else {
          this.$apollo.queries.allDatasets.startPolling(5000);
        }
        this.datasets = data.datasets;
        this.rows = this.datasets.length;
      }
    }
  },
  dataset: {
    query: gql`
      query datasets($id: ID!) {
        datasets(where: { id: $id }) {
          id
          name
          title
          description
          citation
          url
          category {
            id
            name
            title
          }
          source
          image
          metadata
          features_count
          fields_count
          combinators_count
          processed
          title_layout
          link_layout
          details_layout
          summary_layout
          fields {
            id
            name
            title
            type
            source
            description
            citation
            url
          }
          combinators {
            id
            title
            description
            citation
            features_count
          }
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentDatasetId ? this.currentDatasetId : this.currentId
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.datasets) {
        this.currentDataset = data.datasets[0];
        this.fieldsCount = this.currentDataset.fields.length;
        this.combinatorsCount = this.currentDataset.combinators.length;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  },
  conceptMap: {
    query: gql`
      query conceptMaps($id: ID!) {
        conceptMaps(where: { id: $id }) {
          id
          title
          description
          citation
          url
          source
          topics_count
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.conceptMaps) {
        [this.currentConceptMap] = data.conceptMaps;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  },
  combinator: {
    query: gql`
      query combinators($id: ID!) {
        combinators(where: { id: $id }) {
          id
          name
          title
          description
          citation
          url
          operator
          queries {
            id
            field
            type
            operator
            value
            review
          }
          concepts {
            id
            name
            title
            group
            _id
          }
          dataset {
            id
            title
            fields {
              id
              name
              type
            }
          }
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      // The returned value will update
      // the vue property 'currentDataset'
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.combinators) {
        [this.currentCombinator] = data.combinators;
        this.model = this.currentCombinator;
        if (this.model.dataset && this.model.dataset.id) {
          this.model.dataset = this.model.dataset.id;
        }
        this.currentDatasetId = this.model.dataset;
        this.$apollo.queries.dataset.skip = false;
        this.model.type = this.collectionType;
        this.model.action = this.action;
        this.loading = false;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  },
  queryResults: {
    query: gql`
      query combinatorResults($id: ID!) {
        combinatorResults(id: $id) {
          combinator {
            id
            name
          }
          features {
            id
            properties
          }
          matched_count
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentCombinator.id
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.combinatorResults) {
        this.loading = false;
        this.filteredFeatures = data.combinatorResults;
        this.rows = this.filteredFeatures.matched_count;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  },
  getRandomFeature: {
    query: gql`
      query randomFeature($id: ID!) {
        randomFeature(where: { dataset: $id }) {
          id
          properties
        }
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentDatasetId ? this.currentDatasetId : this.currentId
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.randomFeature) {
        this.randomFeature = data.randomFeature;
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  },
  getTopics: {
    query: gql`
      query topics($id: ID!, $start: Int, $limit: Int) {
        topics(where: { concept_map: $id }, start: $start, limit: $limit) {
          id
          title
          description
          citation
        }
        countTopics(where: { concept_map: $id })
      }
    `,
    // Reactive parameters
    variables() {
      // Use vue reactive properties here
      return {
        id: this.currentId,
        limit:
          this && this.topics.length === 0 && this.currentPage === 1 ? 20 : 100,
        start:
          this && this.topics.length === 0 && this.currentPage === 1
            ? 0
            : this.topics.length
      };
    },
    skip: true,
    ssr: false,
    // Variables: deep object watch
    deep: false,
    update(data) {
      return data.id;
    },
    // Optional result hook
    result({ data, loading, networkStatus }) {
      if (data && data.topics) {
        if (this.topics.length === 0) {
          this.topics = data.topics;
        } else {
          this.topics = _.unionWith(this.topics, data.topics, _.isEqual);
        }
        if (this.rows !== data.countTopics) {
          this.rows = data.countTopics;
        }
        if (this.topics.length === this.rows) {
          this.$apollo.queries.getTopics.skip = true;
        }
      }
    },
    // Error handling
    error(error) {
      console.error("We've got an error!", error);
    }
  }
};

const methods = {
  async setProcess(val, component) {
    this.currentId = val.id;
    let url = component === 'Datasets' ? 'datasets' : 'concept-maps';
    val.process = true;
    const resp = await axios.get(`${this.$apiUrl}/${url}/process/${val.id}`);
    if (resp) {
      this.$apollo.queries[`all${component}`].refetch();
    }
  },
  async getSingle(path) {
    try {
      const temp = await axios.get(`${this.$apiUrl}/${path}`);
      return temp;
    } catch (err) {
      console.log(err);
    }
  },
  getSource(path, key) {
    return axios
      .get(`${this.$apiUrl}/${path}`)
      .then(response => {
        if (key) {
          return response.data[key];
        }
        return response.data;
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  },
  setFormField(val, type) {
    this.schema.fields.filter(field => {
      if (field.model && field.model === type) {
        field.values = val;
      }
    });
  },
  setFormData(val) {
    const dataModel = new Models[val.type](val);
    if (val.action === 'Create') {
      dataModel._create().then(value => {
        this.$router.push(dataModel.routeUrl);
      });
    } else {
      dataModel._update().then(value => {
        if (
          val.type === 'DatasetFields' ||
          val.type === 'ConceptTopics' ||
          (val.type === 'Users' && this.$route.name === 'View Users')
        ) {
          this.makeToast('success');
          return;
        }
        if (val.type === 'Combinators') {
          this.$router.push(dataModel.routeUrl);
        } else {
          this.$router.go(-1);
        }
      });
    }
  },
  makeToast(variant) {
    this.$bvToast.toast('Saved!', {
      variant,
      solid: true
    });
  },
  loadingState(length, component) {
    if (length === 0) {
      return false;
    }
    if (component) {
      return (
        this[`current${component}Page`] * this[`current${component}Limit`] -
          (this[`current${component}Limit`] - 1) >
        length
      );
    }
    return this.currentPage * this.perPage - (this.perPage - 1) > length;
  },
  updatePage(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Page`] = val;
    } else {
      this.currentPage = val;
      let array = this.lcFirst(component);
      this[`${array}Loading`] =
        this.currentPage * this.perPage - (this.perPage - 1) >
        this[array].length;
    }
  },
  updateLimit(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`current${component}Limit`] = val;
    } else {
      this.perPage = val;
    }
  },
  deleteItem(item, type) {
    let array = this.lcFirst(type);
    if (this[array]) {
      const test = _.remove(this[array], function(val) {
        return val.id === item.id;
      });
      if (test.length > 0) {
        this.rows -= 1;
        if (this.$refs[array]) {
          this.$refs[array].refresh();
        }
      }
      this.$bvModal.hide('deleteConfirmation');
      const dataModel = new Models[item.type ? item.type : type](item);
      dataModel._delete().then(value => {
        if (dataModel.routeUrl === this.$router.history.current.path) {
          if (value === 'users') {
            this.makeToast('success');
            this.getAllUsers();
          }
        } else {
          this.$router.push(dataModel.routeUrl);
        }
      });
    }
  },
  getDate(val) {
    if (!val) {
      return '';
    }
    const newDate = new Date(val);
    return newDate.toLocaleString();
  },
  updateFilter(val, component) {
    if (this.$route.name === 'Dataset View') {
      this[`filter${component}`] = val;
    } else {
      this.filter = val;
    }
  },
  updatePagination(array, val) {
    if (this.$route.name === 'Dataset View') {
      if (array[0].__typename === 'DatasetField') {
        this.fieldsCount = val;
        this.currentFieldsPage = 1;
      } else {
        this.combinatorsCount = val;
        this.currentCombinatorsPage = 1;
      }
    } else {
      this.currentPage = 1;
    }
    this.rows = val;
  },
  _equals(string, val, type) {
    if (type === 'number') {
      return string === Number(val);
    }
    if (type === 'boolean') {
      const isTrueSet = val === 'true';
      return string === isTrueSet;
    }
    return string === val;
  },
  _not_equals(string, val, type) {
    if (type === 'number') {
      return string !== Number(val);
    }
    if (type === 'boolean') {
      const isTrueSet = val === 'true';
      return string !== isTrueSet;
    }
    return string !== val;
  },
  _contains(string, val) {
    return string.includes(val);
  },
  _not_contains(string, val) {
    return !string.includes(val);
  },
  _greater_than(int, val, type) {
    if (type === 'number') {
      return int > Number(val);
    }
    return int > val;
  },
  _less_than(int, val, type) {
    if (type === 'number') {
      return int < Number(val);
    }
    return int < val;
  },
  testQueries(val) {
    this.loading = true;
    const dataModel = new Models['Combinators'](val);
    // If combinator doesn't already exist, create it, then get query results
    if (!this.currentCombinator && this.model.action !== 'Update') {
      dataModel._create().then(value => {
        this.currentCombinator = value.data;
        this.$router.push(`/contributor/combinators/update/${value.data.id}`);
        this.action = 'Update';
        this.model.action = 'Update';
        this.$apollo.queries.queryResults.skip = false;
      });
    }
    // If combinator exists, update it, then get query results
    else {
      val.id = this.model.id;
      const newModel = new Models['Combinators'](val);
      newModel._update().then(value => {
        this.currentCombinator = value.data;
        this.$apollo.queries.queryResults.skip = false;
        this.$apollo.queries.queryResults.refetch();
      });
    }
  },
  shorten(val) {
    if (val.length > 150) {
      return val.substring(0, 150) + '...';
    }
    return val;
  },
  lcFirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
};

const asyncComputed = {
  roles: {
    get() {
      if (this._roles && this._roles.length > 0) {
        return this._roles;
      }
      return this.getSource('users-permissions/roles', 'roles').then(roles => {
        this._roles = roles;
        return this._roles;
      });
    },
    shouldUpdate() {
      return this.component === 'Users';
    }
  }
};

const data = function() {
  return {
    deleteModal: false,
    itemToDelete: [],
    currentPage: 1,
    perPage: 10,
    limits: [10, 20, 50, 100],
    currentId: '',
    currentDatasetId: '',
    datasets: [],
    features: [],
    categories: [],
    concepts: [],
    temporalCoverages: [],
    conceptMaps: [],
    topics: [],
    currentDataset: {},
    currentConceptMap: {},
    currentCombinator: null,
    currentFieldsPage: 1,
    currentCombinatorsPage: 1,
    currentFieldsLimit: 10,
    currentCombinatorsLimit: 10,
    start: 0,
    filter: '',
    filteredFeatures: [],
    groupedConcepts: [],
    loading: true,
    rows: 0
  };
};

export default {
  apollo,
  methods,
  asyncComputed,
  data,
  components: {
    TableViewLayout
  }
};
