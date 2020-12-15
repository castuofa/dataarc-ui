
<template>
	<b-card no-body class="m-1">
        <template #header>
            <b-icon-card-list />
            <span class="mx-2">Dataset results for query</span>  			                 
        </template> 
		<b-overlay :show="busy" rounded="sm">
			<b-form-radio-group size="sm" buttons v-model="display"> 
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

			<div id="resultList" class="overflow-auto m-0" style="height: 300px;">				     
				<div v-for="(result, rindex) in resultsToDisplay" :key="rindex">					
					<b-list-group-item button v-for="(dataset, dindex) in result.datasets" 
						:key="dindex" 
						@click.prevent="datasetSelected(dataset)">
						<b-icon-card-list class="mr-2"/>
						<span>{{ dataset.dataset }}</span>
						<b-badge class="ml-2" variant="secondary" pill>{{ dataset.total }}</b-badge>						
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
            required: false,
			default: () => {} 
		}
	},
	data() {
		return {
			busy: false,
			display: "textual",
			queryFilter: this.filter,
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
					case "environmental": totals.environmental = r.total; break;
					case "archaeological": totals.archaeological = r.total; break;
					case "textual": totals.textual = r.total; break;
					default: totals.other += r.total; break;
				}
				totals.all += r.total				
			})
			return totals
			// return a.reduce(function (total, obj) { return total + obj.total }, 0);
			
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
				if(newValue.concept)             
					this.getResults()
            }        
		}		
	},
	methods: {
		getResults() {
			let self = this

			try {
				self.busy = true
				let uri = `${self.baseURI}/query/results`    
				self.postJSON(uri, self.queryFilter, json => {
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