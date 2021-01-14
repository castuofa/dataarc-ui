class Categories {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.color = data.color;
    this.createUrl = `${process.env.VUE_APP_API_URL}/categories`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/categories/${this.id}`;
    this.routeUrl = '/admin/categories';
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
        `${process.env.VUE_APP_API_URL}/categories/${this.id}`
      );
      return 'allCategories';
    } catch (err) {
      console.log(err);
    }
  };
}

export default Categories;
