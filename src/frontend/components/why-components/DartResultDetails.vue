<template>
	<b-card no-body class="m-1">
        <template #header>
            <b-icon-card-list class="mr-1"/>
            <span>Dataset details</span>                   
        </template>
		<b-overlay :show="busy" rounded="sm">	
		<b-card-body class="p-2">
        <div class="font-weight-bold" >{{ dataset.title }}</div>
		<b-card-text class="overflow-auto" style="height: 75px;">{{ dataset.description }}</b-card-text>
		<!--<ul class="p-1" v-for="(c, index) in dataset.combinators" :key="index">
			<li>{{ c.title }}</li>	
		</ul>-->
		<b-tabs content-class="mt-2">
			<b-tab active>
				<template v-slot:title>
					<b-icon-command />
					<span class="mx-2">Combinators</span>
					<b-badge variant="info" pill>{{ combinatorsByTitle.length }}</b-badge>
				</template>
				<b-list-group id="combinatorList" class="overflow-auto" style="height: 300px;">
					<b-list-group-item class="py-1" v-for="com in combinatorsByTitle" 
						:key="com.id" 
						:alt="com.title"
						:title="com.title"
						:class="{ hilited: com.hilited }"
						@mouseover="combinatorMouseover(com)"
						@mouseout="combinatorMouseout(com)"
						@click.prevent="combinatorSelected(com)">
						<b-icon-command class="mr-2"/>
						<span>{{ com.title }}</span>
					</b-list-group-item>
				</b-list-group>
			</b-tab>
		</b-tabs>
		</b-card-body>
		</b-overlay>	
	</b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'

export default {
	name: 'DartResultDetails',
	components: { 
	},
	mixins: [ DartCommon ],
	props: {
		datasetID: {
			type: String,
			required: false,
			default: ""
		},
		hiliteForConceptID: {
			type: String,
			required: false,
			default: ""
		}	
	},
	data() {
		return {
			busy: false,
			dataset: {}
		}
	},
	computed: {
		combinatorsByTitle: function() {
			return ((this.dataset || {}).combinators || []).slice()
				.map(com => { // convert from array of ID to array of obj
					com.concepts = (com.concepts || []).map(id => { return {id: id}})
					return com
				})
                .sort((a, b) => a.title.localeCompare(b.title))
        }	
	},
	watch: {
		datasetID: {
            immediate: true,
            handler(newValue) {
				if(newValue !== "")                
					this.getDataset2(newValue)            
            }        
		},

		hiliteForConceptID: function(newValue) {
			// hilight any combinators associated with the specified concept ID
			((this.dataset || {}).combinators || []).forEach((com, index, array) => {
                com.hilited = com.concepts.some(con => con.id === newValue)
                this.$set(array, index, com) // this way or change is not reactive
            })
		}
	},
	methods: {
        /*getDataset(id){
			let self = this
			
			try {
				self.busy = true			
				let uri = `${self.baseURI}/datasets/${self.clean(encodeURIComponent(id))}`
				self.getJSON(uri, data => {
					self.dataset = data
					self.busy = false
				})
			}
			catch(err) { 
				console.log(err) 
				self.busy = false
			}			
		},*/

		// API call above returned extra data - retrieving 
		// what we need, seems faster in informal testing 
		getDataset2(id){
			let self = this
			console.log(id)
			try {
				self.busy = true
				let cleanID = self.clean(encodeURIComponent(id))			
				let query = `{ dataset(id: "${cleanID}") { id, title, description, combinators { id, title, concepts { id }}}}`
				let success = json => {
					self.dataset = json.data.dataset
					self.busy = false
				}
				let error = err => {
					console.log(err)
					self.dataset = {}
					self.busy =false
				}
				self.runQuery(query, success, error)
			}
			catch(err) { 
				console.log(err) 
				self.busy = false
			}			
		},
		combinatorSelected(combinator) {
			this.$emit('combinatorSelected', combinator) 				
		},
		combinatorMouseover(combinator) {
			combinator.hilited = true
			this.$emit('combinatorMouseover', combinator) 
		},		
        combinatorMouseout(combinator) {
			combinator.hilited = false
			this.$emit('combinatorMouseout', combinator) 
		},
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
.list-group-item { cursor: pointer }
.hilited, .list-group-item:hover {
	background-color: palegreen;
	color: darkgreen;
}
</style>