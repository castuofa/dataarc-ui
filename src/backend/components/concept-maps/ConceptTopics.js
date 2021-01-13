class ConceptTopics {
    constructor(data) {
      this.id = data.id;
      this.title = data.title;
      this.concept = data.concept;
      this.createUrl = `${process.env.VUE_APP_API_URL}/concept-topics`;
      this.editUrl = `${process.env.VUE_APP_API_URL}/concept-topics/${this.id}`;
      this.routeUrl = '/admin/concept-topics';
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
          `${process.env.VUE_APP_API_URL}/concept-topics/${this.id}`
        );
        return 'allConceptTopics';
      } catch (err) {
        console.log(err);
      }
    };
  }

  export default ConceptTopics;
