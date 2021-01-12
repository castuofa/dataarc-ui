<template>
	<b-card no-body class="m-1">
		<template #header>
			<b-icon-tag class="mr-2"/>
			<span>Concept details</span>			
		</template>
		<b-overlay :show="busy" rounded="sm">		
		<b-card-body class="p-2">
			<div>
				<span class="font-weight-bold">{{ currentConcept.title }}</span>
				<span class="font-italic text-secondary ml-2">{{ getGroupLabel(currentConcept.group) }}</span>
			</div>
			<b-card-text class="overflow-auto" style="height: 75px;">For further details see <a target="_blank" rel="noopener noreferrer" :href="currentConceptURI">{{currentConcept.title}}</a></b-card-text>	
			<b-tabs content-class="mt-2">
				<b-tab active>
					<!--tab header-->
					<template v-slot:title>
						<b-icon-tags />
						<span class="mx-2">Concepts</span>						
					</template>
					<div style="height: 300px;" class="overflow-auto">						
						<DartExpandedConcept 
						:concept="currentConcept" 
                        :hilitedConceptIDs="hilitedConceptIDs"
                        @conceptMouseover="conceptMouseover" 
                        @conceptMouseout="conceptMouseout" 
                        @conceptSelected="conceptSelected"/>					
					</div>
				</b-tab>	

				<b-tab>
					<!--tab header-->
					<template v-slot:title>
						<b-icon-card-text />
						<span class="mx-2">Citations</span>
						<b-badge variant="info" pill>{{ $refs.dartCitations.citations.length }}</b-badge>      
					</template>
					<DartCitations ref="dartCitations" :citation="currentConcept.citation"></DartCitations>
				</b-tab>

			</b-tabs>
		
		</b-card-body>
		</b-overlay>
	</b-card>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'
//import DartConceptList from '@/components/DartConceptList.vue'
import DartExpandedConcept from './DartExpandedConcept.vue'
import DartCitations from './DartCitations.vue'

export default {
	name: 'DartConceptDetails',
	components: {
		//DartConceptList,
		DartExpandedConcept,
		DartCitations
		
    },
    mixins: [DartCommon],	
	props: {
		conceptID: {
			type: String,
			default: "" 
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
			currentConceptID: this.conceptID,
			currentConcept: {}			
		}
	},
	computed: {
		currentConceptURI(){
			let conceptName = encodeURIComponent(this.clean(this.currentConcept.name))
			return `https://ropitz.github.io/experiments/dataarc-concepts/${conceptName}.html`
		}
	},
	watch: {
        conceptID: {
            immediate: true,
            handler(newValue) {
				if(newValue !== "") {  
					this.getConcept(newValue)					
				}
            }        
		}		
	},
	methods: {
		// get full details of current conceptID, via API
		getConcept(conceptID) {
			let self = this
			try {
				self.busy = true
				self.currentConcept = {}			
				let cleanID = encodeURIComponent(self.clean(conceptID))
				let uri = `${self.baseURI}/concepts/${cleanID}`		
				self.getJSON(uri, data => {					
					self.currentConcept = data
					self.busy = false
				})
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
			this.currentConceptID = data.conceptID
            this.$emit('conceptSelected', data) 
        },		

		getGroupLabel(group) {
            return this.clean(group).replace("_", " ")
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
    background:palegreen;
	color: darkgreen;
}
</style>