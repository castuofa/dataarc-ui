
<template>
	<b-card no-body>
        <template #header>
            <b-icon-card-list />
            <span class="mx-2">Datasets for query</span>  			                 
        </template> 
		<b-overlay :show="busy" rounded="sm">
			<div class="bg-secondary text-center">	
				<b-form-radio-group size="sm" buttons v-model="display" class="bg-secondary border-0"> 
					<b-form-radio name="display" value="archaeological">
						<b-badge class="archaeological">archaeo {{ resultTotals.archaeological }}</b-badge>
					</b-form-radio>          
					<b-form-radio name="display" value="environmental" >
						<b-badge class="environmental">enviro {{ resultTotals.environmental }}</b-badge>
					</b-form-radio>
					
					<b-form-radio name="display" value="textual">
						<b-badge class="textual">textual {{ resultTotals.textual }}</b-badge>
					</b-form-radio>
					<b-form-radio name="display" value="all">
						<b-badge variant="dark">all {{ resultTotals.all }}</b-badge>
					</b-form-radio>
				</b-form-radio-group>
			</div>
			<div id="resultList" class="overflow-auto m-0" style="height: 300px;">				     
				<div v-for="(result, rindex) in resultsToDisplay" :key="rindex">					
					<b-list-group-item button v-for="(dataset, dindex) in result.datasets" 
						:key="dindex" 
						:alt="dataset.dataset"
						:title="dataset.dataset"
						@click.prevent="datasetSelected(dataset)">
						<b-card-text>
							<b-icon-card-list class="mr-2"/>
							<span>{{ dataset.dataset }}</span>
							<b-badge class="ml-2" variant="dark">{{ dataset.total }}</b-badge>
						</b-card-text>						
					</b-list-group-item>
				</div>
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
			results: []			
		}
	},
	computed: { 		
		resultTotals() {
			let totals = {
				environmental: 0, 
				archaeological: 0, 
				textual: 0, 
				other: 0,
				all: 0
			}	
			this.results.forEach(r => {
				switch(r.category.toLowerCase()) {
					case "environmental": totals.environmental += r.datasets.length; break;
					case "archaeological": totals.archaeological += r.datasets.length; break;
					case "textual": totals.textual += r.datasets.length; break;
					default: totals.other += r.datasets.length; break;					
				}
				totals.all += r.datasets.length			
			})
			return totals			
		},
		resultsToDisplay() {
			if(this.display != "all")
				return this.results.filter(r => r.category.toLowerCase() == this.display)
			else
				return this.results
		}		
	},
	watch: {		
        filter: {
            immediate: true,
            handler(newValue) {
				this.getResults()
            }        
		},
		conceptIDs: {
            immediate: true,
            handler(newValue) { 
				this.getResults()
			}
		}
	
	},
	methods: {
		getResults() {
			let self = this
			self.results = []
			
			if(((self.filter || {}).concept || []).length == 0) return

			try {
				self.busy = true
				let uri = `${self.$apiUrl}/query/results`    
				self.postJSON(uri, self.filter, json => {
					self.results = json || []
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
</style>