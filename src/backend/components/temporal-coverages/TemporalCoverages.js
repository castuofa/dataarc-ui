class TemporalCoverages {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.url = data.url;
    this.begin = data.begin;
    this.end = data.end;
    this.createUrl = `${process.env.VUE_APP_API_URL}/temporal-coverages`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/temporal-coverages/${this.id}`;
    this.routeUrl = '/admin/temporal-coverages';
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
        `${process.env.VUE_APP_API_URL}/temporal-coverages/${this.id}`
      );
      return 'allTemporalCoverages';
    } catch (err) {
      console.log(err);
    }
  };
}

export default TemporalCoverages;
