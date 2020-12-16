class Datasets {
  constructor(data) {
    this.formData = ((
      {
        title,
        description,
        metadata,
        citation,
        url,
        image,
        source,
        category,
        title_layout,
        summary_layout,
        details_layout,
        link_layout
      }) => (
      {
        title,
        description,
        metadata,
        citation,
        url,
        image,
        source,
        category,
        title_layout,
        summary_layout,
        details_layout,
        link_layout
      }))(data);
    this.id = data.id;
    this.createUrl = `${process.env.VUE_APP_API_URL}/datasets`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/datasets/${this.id}`;
    this.routeUrl = '/contributor/datasets';
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
      const resp = await axios.put(this.editUrl, this.formData);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _delete = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.VUE_APP_API_URL}/datasets/${this.id}`
      );
      return 'allDatasets';
    } catch (err) {
      console.log(err);
    }
  };
}

export default Datasets;
