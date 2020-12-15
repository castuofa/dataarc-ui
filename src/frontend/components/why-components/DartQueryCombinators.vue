<template>
	<b-card no-body class="m-1">
        <template #header>
            <b-icon-command />
            <span class="mx-2">Combinators for query</span>            
        </template>
        <b-overlay :show="busy" rounded="sm">
			<b-form-radio-group size="sm" buttons v-model="display">           
				<b-form-radio name="display" value="matched">
                    <b-badge class="matched">matched {{ uniqueMatchedCombinators.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="related">
                    <b-badge class="related">related {{ uniqueRelatedCombinators.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="contextual">
                    <b-badge class="contextual">contextual {{ uniqueContextualCombinators.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="all">
                    <b-badge variant="dark">all {{ uniqueAllCombinators.length }}</b-badge>
                </b-form-radio>
			</b-form-radio-group>
			<b-list-group id="combinatorList" class="overflow-auto" style="height: 300px;">
				<b-list-group-item class="py-1" v-for="com in displayedCombinators" 
					:key="com.id" 
					:alt="com.title"
					:title="com.title"
					:class="{ hilited: com.hilited }"
					@mouseover="combinatorMouseover(com)"
					@mouseout="combinatorMouseout(com)"
					@click.prevent="combinatorSelected(com)">1					
					<b-icon-command class="mr-2"/>
					<span>{{ com.title }}</span>
				</b-list-group-item>
			</b-list-group>
        </b-overlay>
    </b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js' 

export default {
	name: 'DartQueryCombinators',
	components: { 
	},
	mixins: [DartCommon],
	props: {
		conceptIDs: {
			type: Array,
			required: false,
			default: () => []            
		},		
		hiliteForConceptID: {
			type: String,
			required: false,
			default: ""
		}		
	},
	watch: {
        conceptIDs: {
            immediate: true,
            handler(newValue) { 
				let self = this
				self.busy = true
				
				self.getQueryConcepts(newValue, json => {
					self.queryConcepts = (json.data.concepts || []) 

					self.getCombinators(self.matchedConceptIDs, json => {
						self.matchedCombinators = (json.data.combinators || [])  				
					})

					self.getCombinators(self.relatedConceptIDs, json => {
						self.relatedCombinators = (json.data.combinators || [])  				
					})

					self.getCombinators(self.contextualConceptIDs, json => {
						self.contextualCombinators = (json.data.combinators || [])  									
					})  
					self.busy = false
				})				
            }
		},

		hiliteForConceptID: function(newValue) {			
			// hilight any combinators associated with the specified concept ID
			this.displayedCombinators.forEach((com, index, array) => {
                com.hilited = com.concepts.some(con => con.id == newValue)
                this.$set(array, index, com) // done this way or change is not reactive
            })
		}
    },
	data() {
		return {
			busy: false,
			display: "matched",
			queryConcepts: [],
			matchedCombinators: [],
			relatedCombinators: [],
			contextualCombinators: []
		}
	},
	computed: {
		matchedConceptIDs() {
			let ids = this.queryConcepts.map(c => c.id)
			return ids
		},

		relatedConceptIDs() {
			const unique = new Set()
            for (const concept of this.queryConcepts || []) {
                for(const c of concept.related || []) {
					unique.add(c.id)
				}
			}       
            return [...unique]			 
		},

		contextualConceptIDs() {
			const unique = new Set()
            for (const concept of this.queryConcepts || []) {
                for(const c of concept.contextual || []) {
					unique.add(c.id)
				}
			}       
            return [...unique]
		},

		uniqueMatchedCombinators(){
			return this.getUniqueCombinators(this.matchedCombinators)			
		},

		uniqueRelatedCombinators(){
			return this.getUniqueCombinators(this.relatedCombinators)	
		},

		uniqueContextualCombinators(){
			return this.getUniqueCombinators(this.contextualCombinators)	
		},

		uniqueAllCombinators(){
			let combinators = []
				.concat(this.matchedCombinators)
				.concat(this.relatedCombinators)
				.concat(this.contextualCombinators)
			return this.getUniqueCombinators(combinators)	
		},

		displayedCombinators() {
			let combinators = []
			switch(this.display) {
				case "matched": 
					combinators = this.uniqueMatchedCombinators
					break
				case "related": 
					combinators = this.uniqueRelatedCombinators
					break
				case "contextual": 
					combinators = this.uniqueContextualCombinators
					break
				default: 
					combinators = this.uniqueAllCombinators
					break				
			}
			return combinators
		}	
	},
	methods: {

		// ensure uniqueness of an array of combinators
		getUniqueCombinators(combinators) {
			const unique = new Map()
            for (const com of combinators) {
                if(!unique.has(com.id)) {
                    unique.set(com.id, com)  
                }
            }           
            return [...unique.values()].sort((a, b) => a.title.localeCompare(b.title))
		},
		
		// get (selected properties of) query concepts from array of IDs
		getQueryConcepts(conceptIDs, callback) {
			let self = this            
            
             try {
                let ids = conceptIDs.map(id => {
					let cleanID = encodeURIComponent(this.clean(id))
					return `"${cleanID}"`
				}).join()				
                let qry = `{ 
                    concepts(where: { id: [${ids}] }) {
                        id title group  
                        related { id title group } 
                        contextual { id title group }
                    }}`
                self.runQuery(qry, callback)
            }
            catch(err) { 
                console.log(err) 
                self.busy = false 
            }            
		},

		// identify combinators that include one or more of the conceptIDs				
		getCombinators(conceptIDs, callback) {
			let self = this

			try {
				let ids = conceptIDs.map(id => {
					let cleanID = encodeURIComponent(this.clean(id))
					return `{ _id: "${cleanID}" }`
				}).join()
				let qry = `{ 
					combinators(where: { concepts: [${ids}] }){ 
						id title concepts{ id } 
					}}`     
				self.runQuery(qry, callback)   
			}
			catch(err){
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
.list-group-item { cursor: pointer }
.hilited, .list-group-item:hover {
	background-color: palegreen;
	color: darkgreen;
}
.matched { background: #28A745; }
.related { background: #FFC101; }
.contextual { background: #DC3545; }
</style>