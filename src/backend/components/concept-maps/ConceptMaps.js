class ConceptMaps {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.url = data.url;
    this.source = data.source;
    this.createUrl = `${process.env.VUE_APP_API_URL}/concept-maps`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/concept-maps/${this.id}`;
    this.routeUrl = '/admin/concept-maps';
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _delete = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.VUE_APP_API_URL}/concept-maps/${this.id}`
      );
      return 'allConceptMaps';
    } catch (err) {
      console.log(err);
    }
  };
}

export default ConceptMaps;
