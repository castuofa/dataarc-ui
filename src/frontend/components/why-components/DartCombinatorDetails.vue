<template>
	<b-card no-body>
		<template #header>
			<b-icon-command class="mr-2"/>
			<span>Combinator details</span>			
		</template>	
		<b-overlay :show="busy" rounded="sm">	
        	<b-card-text class="overflow-auto p-1" style="height: 100px;">
				<div class="font-weight-bold">{{ combinator.title }}</div>
				<div>{{ combinator.description }}</div>
			</b-card-text>
			<b-tabs fill content-class="mx-2 my-0 p-0 border-0">
				<b-tab active>
					<template v-slot:title>
						<b-icon-tags />
						<span class="mx-2">Concepts</span>
						<b-badge variant="dark">{{ $refs.dartCombinatorConcepts.concepts.length }}</b-badge> 																	
					</template>
					<DartConceptList
						ref="dartCombinatorConcepts" 
						:concepts="uniqueConcepts" 
						:showExpanded="false"
						display="inline"
						:hilitedConceptIDs="hilitedConceptIDs"
						@conceptMouseover="conceptMouseover" 
						@conceptMouseout="conceptMouseout" 
						@conceptSelected="conceptSelected"/>							
				</b-tab>
				<b-tab title="Citations">
					<template v-slot:title>
						<b-icon-card-text />
						<span class="mx-2">Citations</span>
						<b-badge variant="dark">{{ $refs.dartCitations.citations.length }}</b-badge> 						    
					</template>
					<DartCitations 
						ref="dartCitations" 
						:citation="combinator.citation"></DartCitations>
				</b-tab>    
			</b-tabs>			
		</b-overlay>		
    </b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js' 
import DartConceptList from './DartConceptList.vue' 
import DartCitations from './DartCitations.vue'
// import DartCombinatorFeatures from '@/components/DartCombinatorFeatures.vue' 

export default {
	name: 'DartCombinatorDetails',
	components: { 
		DartConceptList,
		DartCitations			
	},
	mixins: [DartCommon],
	props: {		
		combinatorID: {
			type: String,
			default: ""			
		},		
		grouped: {
			type: Boolean,
			required: false,
			default: true
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
			combinator: {},
			isGrouped: this.grouped,	
			listDisplay: "listed" // "listed" | "grouped" | "inline"		
		}
	},
	watch: {
        combinatorID: {
            immediate: true,
            handler(newValue) {
				if(newValue !== "")                
					this.getCombinator(newValue)            
            }        
		}
	},
	computed: {
		uniqueConcepts(){
			const unique = new Map() 
            for (const c of this.combinator.concepts || []) {
                if(!unique.has(c.id)) {
                    unique.set(c.id, c)  
                }
            } 
			return [...unique.values()]
				.sort((a, b) => a.title.localeCompare(b.title)) 
		}
	},
	methods: {
		getCombinator(id) {
			let self = this
			
			try {
				self.busy = true			
				self.combinator = {}
				let uri = `${self.$apiUrl}/combinators/${self.clean(encodeURIComponent(id))}`
				self.getJSON(uri, data => {
					self.combinator = data
					self.busy = false
				})
			}
			catch(err) { 
				console.log(err) 
				self.busy = false
			}			
		},	
		
		conceptMouseover(data) {
            this.$emit('conceptMouseover', { conceptID: data.conceptID }) 
        },		
        conceptMouseout(data) {
            this.$emit('conceptMouseout', { conceptID: data.conceptID }) 
        },
        conceptSelected(data) {
            this.$emit('conceptSelected', { conceptID: data.conceptID }) 
        }
	}
}
</script>

<style scoped>

</style>