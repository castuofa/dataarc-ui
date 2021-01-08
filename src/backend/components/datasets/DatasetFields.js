class DatasetFields {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.url = data.url;
    this.type = data.fieldType;
    this.editUrl = `${process.env.VUE_APP_API_URL}/dataset-fields/${this.id}`;
    this.routeUrl = '';
  }

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
        `${process.env.VUE_APP_API_URL}/dataset-fields/${this.id}`
      );
      return 'dataset-fields';
    } catch (err) {
      console.log(err);
    }
  };
}

export default DatasetFields;
