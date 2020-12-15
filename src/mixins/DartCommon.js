const DartCommon = { 
  data() {
		return {
      baseURI: "https://api.data-arc.org"
    }
	},  
  methods: {
    // get 'cleaned' string
    clean: s => (s || "").toString().trim(),

    request(uri, options, callback) {
      try {
        const doit = request => fetch(request, options)
          .then(response => {
            if (!response.ok) {
              console.log(response.statusText)
              throw Error(response.statusText)
            }      
            return response    
          })
          .then(response => response.json()) 
          .then(json => callback(json || {}))
        doit(uri)
      }
      catch(err){ console.log(err) }
      //finally {}
    },

    // get JSON from a URI or service call
    /*getJSONold(uri, callback) {
      const get = request => fetch(request, {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        if (!response.ok) throw Error(response.statusText)      
        return response    
      }).then(response => response.json()) 
      .then(json => callback(json || {}))
      get(uri)  
    },*/

    getJSON(uri, success, error) {
      let options = {
        method: 'GET', 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        } 
      }
      //this.request(uri, options, success) 
      fetch(uri, options)
        .then(response => response.json())
        .then(success)
        .catch(error)
    },

    postJSON(uri, data, callback) {
      let options = {
        method: 'POST', 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data) 
      }     
      this.request(uri, options, callback)
    },        
          
    // run GraphQL query 
    runQuery(query, callback, error) {
      let uri = `${this.baseURI}/graphql?query=${encodeURIComponent(query)}`
      this.getJSON(uri, callback, error)
    }
  }
}
  
export default DartCommon