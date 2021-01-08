class Combinators {
  constructor(data) {
    if (data.id) {
      this.id = data.id;
    }
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.operator = data.operator;
    this.dataset = data.dataset;
    this.queries = data.queries;
    if (data.concepts) {
      let temp = []
      data.concepts.forEach((concept) => {
        temp.push(concept.id)
      })
      this.concepts = temp;
    }
    this.createUrl = `${process.env.VUE_APP_API_URL}/combinators`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/combinators/${this.id}`;
    this.routeUrl = '/contributor/combinators';
  }

  _create = async () => {
    try {
      let promises = [];
      if (this.queries) {
        let _queries = this.queries;
        this.queries = [];
        for (let i = 0; i < Object.keys(_queries).length; i++) {
          promises.push(
            this._createOrUpdateQuery(_queries[i]).then((response) => {
              this.queries.push(response.data.id);
            })
          );
        }
      }
      return Promise.all(promises).then(() => {
        const resp = axios.post(this.createUrl, this);
        return resp;
      });
    } catch (err) {
      return err;
    }
  };

  _createOrUpdateQuery = async (val) => {
    try {
      if (val) {
        let url = val.id
          ? `${process.env.VUE_APP_API_URL}/combinator-queries/${val.id}`
          : `${process.env.VUE_APP_API_URL}/combinator-queries`;
        let action = val.id ? 'put' : 'post';
        const resp = await axios[action](url, val);
        return resp;
      }
    } catch (err) {
      console.log(err);
    }
  };

  _update = async () => {
    try {
      let promises = [];
      if (this.queries) {
        let _queries = Object.assign(this.queries);
        let length = Object.keys(_queries).length;
        this.queries = [];
        for (let i = 0; i < length; i++) {
          promises.push(
            this._createOrUpdateQuery(_queries[i]).then((response) => {
              if (response) {
                let id = _queries[i].id ? _queries[i].id : response.data.id;
                this.queries.push(id);
              }
            })
          );
        }
      }
      return Promise.all(promises).then(() => {
        const resp = axios.put(this.editUrl, this);
        return resp;
      });
    } catch (err) {
      console.log(err);
    }
  };

  _delete = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.VUE_APP_API_URL}/combinators/${this.id}`
      );
      return 'allCombinators';
    } catch (err) {
      console.log(err);
    }
  };
}

export default Combinators;
