
<template>
	<b-card no-body>
        <template #header>
            <b-icon-card-list />
            <span class="mx-2">Datasets for query</span>  			                 
        </template> 
		<b-overlay :show="busy" rounded="sm">
			<div class="bg-secondary text-center">
				<b-form-radio-group size="sm" buttons v-model="display" class="border-0">           
					<b-form-radio name="display" value="matched">
						<b-badge variant="dark">matched {{ matchedDatasets.length }}</b-badge>
					</b-form-radio>
					<b-form-radio name="display" value="related">
						<b-badge variant="dark">related {{ relatedDatasets.length }}</b-badge>
					</b-form-radio>
					<b-form-radio name="display" value="contextual">
						<b-badge variant="dark">contextual {{ contextualDatasets.length }}</b-badge>
					</b-form-radio>
					<b-form-radio name="display" value="all">
						<b-badge variant="dark">all {{ allDatasets.length }}</b-badge>
					</b-form-radio>
				</b-form-radio-group>
			</div>
			<div id="datasetList" class="overflow-auto m-0" style="height: 300px;">				     
				<!--<div v-for="(result, rindex) in resultsToDisplay" :key="rindex"> 
					<b-list-group-item button v-for="(dataset, dindex) in result.datasets" -->
					<b-list-group-item button v-for="(dataset, index) in datasetsToDisplay"	
						:key="index" 
						:alt="dataset.title"
						:title="dataset.title"
						:class="`text-${dataset.category}`"
						@click.prevent="datasetSelected(dataset.id)">
						<b-card-text>
							<b-icon-card-list class="mr-2"/>
							<span>{{ dataset.title }}</span>
							<!--<b-badge class="ml-2" variant="dark">{{ dataset.total }}</b-badge>-->
						</b-card-text>						
					</b-list-group-item>
				<!--</div>-->
			</div>     
		</b-overlay>
	</b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'

export default {
	name: 'DartQueryResults',
	components: { 
	},
	mixins: [ DartCommon ],
	props: {		
		filter: {
            type: Object,
            required: true			
		},
		conceptIDs: {
			type: Array, // note: only passed because filter watch didn't react to concept array changes
			required: false,
			default: () => []            
		},	
	},

	data() {
		return {
			busy: false,
			display: "all",
			matchedDatasets: [],
			relatedDatasets: [],
			contextualDatasets: []		
		}
	},

	computed: {
		allDatasets() {			
			// get all datasets concatenated
			let datasets = this.matchedDatasets
				.concat(this.relatedDatasets)
				.concat(this.contextualDatasets)

			// ensure uniqueness
			const uniqueDatasets = new Map()
			datasets.forEach(ds => {
				if (!uniqueDatasets.has(ds.id)) {
					uniqueDatasets.set(ds.id, ds)
				}
			})

			// return sorted by title
			return[...uniqueDatasets.values()].sort((a,b) => a.title.localeCompare(b.title))
		},	
		
		// TODO: need flat list of datasets, sorted by label/title....
		datasetsToDisplay() {
			let datasets = []

			switch(this.display) {
				case "matched": datasets = this.matchedDatasets; break;
				case "related": datasets = this.relatedDatasets; break;
				case "contextual": datasets = this.contextualDatasets; break;
				default: datasets = this.allDatasets; break;
			}			
			return datasets

		}		
	},
	watch: {		
        filter: {
            immediate: true,
            handler(newValue) {
				this.getAllDatasets()
            }        
		},
		conceptIDs: {
            immediate: true,
            handler(newValue) { 
				this.getAllDatasets()				
			}
		}
	
	},
	methods: {
		
		getAllDatasets() {
			this.getDatasets(Object.assign({}, this.filter || {}, { type: "matched" }))
			this.getDatasets(Object.assign({}, this.filter || {}, { type: "related" }))
			this.getDatasets(Object.assign({}, this.filter || {}, { type: "contextual" }))
		},
		
		getDatasets(filter) {
			let self = this

			// clear previous results
			self.matchedDatasets = []
			self.relatedDatasets = []
			self.contextualDatasets = []
			
			// if no query concepts then return empty array
			if((filter.concept || []).length == 0) return []

			try {
				self.busy = true
				let uri = `${self.$apiUrl}/query/results`    
				self.postJSON(uri, filter, json => {
					let results = (json || [])

					// get list of unique datasets from results
					const uniqueDatasets = new Map()
					results.forEach(result => {
						result.datasets.forEach(dataset => {
							if (!uniqueDatasets.has(dataset.id)) {
								const ds = { 
									id: dataset.dataset_id, 
									category: result.category.toLowerCase(),
									title: dataset.dataset
								}
          						uniqueDatasets.set(ds.id, ds)
							}
						})
					})

					// sort by title	
					let sortedDatasets = [...uniqueDatasets.values()]
						.sort((a,b) => a.title.localeCompare(b.title))
					
					// put in correct place
					switch(filter.type) {
						case "related": self.relatedDatasets = sortedDatasets; break;
						case "contextual": self.contextualDatasets = sortedDatasets; break;
						default: self.matchedDatasets = sortedDatasets; break;
					}
					self.busy = false
				})
			}
			catch(err){ 
				console.log(err) 
				self.busy = false
			}			
		},		
		datasetSelected(dataset) {
			this.$emit('datasetSelected', dataset) 
		}
	},
	// lifecycle hooks
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	destroyed() {}
}
</script>

<style scoped>
li {
    display: block;
}
/* Note -after integration get colors from central CSS? */
.archaeological { background: #6177AA; }
.textual { background: #FC8D62; }
.environmental { background: #66C2A5; }

.matched { background: #28A745; }
.related { background: #FFC101; }
.contextual { background: blue; }
</style>