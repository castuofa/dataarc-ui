<template>
    <b-card no-body class="m-1">
        <template #header>
            <b-icon-tags />
            <span class="mx-2">Concepts for query</span>
        </template>
        <b-overlay :show="busy">	
            <b-form-radio-group size="sm" buttons v-model="display">           
				<b-form-radio name="display" value="matched">
                    <b-badge class="matched">matched {{ uniqueMatchedConcepts.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="related">
                    <b-badge class="related">related {{ uniqueRelatedConcepts.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="contextual">
                    <b-badge class="contextual">contextual {{ uniqueContextualConcepts.length }}</b-badge>
                </b-form-radio>
				<b-form-radio name="display" value="all">
                    <b-badge variant="dark">all {{ uniqueAllConcepts.length }}</b-badge>
                </b-form-radio>
			</b-form-radio-group>
			<DartConceptList
                class="p-1"
                ref="dartConceptList" 
                :concepts="displayedConcepts" 
                :showExpanded="false"
                :hilitedConceptIDs="hilitedConceptIDs"
                @conceptMouseover="conceptMouseover" 
                @conceptMouseout="conceptMouseout" 
                @conceptSelected="conceptSelected"/> 
        </b-overlay>	      
    </b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'
import DartConceptList from './DartConceptList.vue'


export default {
   name: 'DartQueryConcepts',
	components: {
        DartConceptList
    },
	mixins: [DartCommon],
	props: {
		conceptIDs: {
			type: Array,
			default: () => []  
        },
        hilitedConceptIDs: {
           type: Array,
           required: false,
           default: () => [] 
        }	
	},
	data() {
		return {
            busy: false,
            display: "query",
            concepts: []
        }
    },
    watch: {
        conceptIDs: {
            immediate: true,
            handler() {                
                this.getConcepts(this.conceptIDs)
            }        
        }         
	},
	computed: {	
        displayedConcepts(){
            let concepts = []
			switch(this.display) {
				case "matched": 
					concepts = this.uniqueMatchedConcepts
					break
				case "related": 
					concepts = this.uniqueRelatedConcepts
					break
				case "contextual": 
					concepts = this.uniqueContextualConcepts
					break
				default: 
					concepts = this.uniqueAllConcepts
					break				
			}
			return concepts
        },	

        uniqueMatchedConcepts(){
            return this.getUniqueConcepts(this.concepts)            
        },

        uniqueRelatedConcepts(){
            const concepts = []
            for (const concept of this.concepts || []) {
                for(const c of concept.related || []) {
                    concepts.push(c)
                }
            }
            return this.getUniqueConcepts(concepts)   
        },

        uniqueContextualConcepts(){
            const concepts = []
            for (const concept of this.concepts || []) {
                for(const c of concept.contextual || []) {
                    concepts.push(c)
                }
            }
            return this.getUniqueConcepts(concepts)   
        },

        uniqueAllConcepts(){
            const concepts = []
                .concat(this.uniqueMatchedConcepts)
                .concat(this.uniqueRelatedConcepts)
                .concat(this.uniqueContextualConcepts)
            return this.getUniqueConcepts(concepts)             
        }
    },
    
	methods: { 
        // ensure uniqueness in array of concepts
        getUniqueConcepts(concepts) {
            const unique = new Map()
            for (const concept of concepts || []) {
                if(!unique.has(concept.id)) {
                    unique.set(concept.id, concept)  
                }
            }            
            return [...unique.values()]
                .sort((a, b) => a.title.localeCompare(b.title))
        }, 

		getConcepts(conceptIDs) {
            // get (selected) properties of the query concepts 
            let self = this            
            
             try {
                self.busy = true
                let ids = conceptIDs.map(id => `"${id}"`).join()
                let query = `{ 
                    concepts(where: { id: [${ids}] }) {
                        id title group 
                        related { id title group } 
                        contextual { id title group }
                    }
                }`
                let success = json => {
                    self.concepts = json.data.concepts || []
                    self.busy = false
                }
                let error = err => {
                    console.log(err)
                    self.concepts = []
                    self.busy = false
                }
                self.runQuery(query, success, error)                
            }
            catch(err) { 
                console.log(err) 
                self.busy = false 
            }            
        },

		conceptMouseover(data) { 
            this.$emit('conceptMouseover', data) 
        },

        conceptMouseout(data) {
            this.$emit('conceptMouseout', data) 
        },

        conceptSelected(data) {
            this.$emit('conceptSelected', data) 
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
.hilited {
    background: palegreen;
    color: darkgreen
}
.matched { background: #28A745; }
.related { background: #FFC101; }
.contextual { background: #DC3545; }
</style>