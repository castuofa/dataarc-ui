<template>
    <!--<div class="shadow border p-3" >-->
    <b-container>
    <b-row>
    <b-col>
        <div class="p-3 shadow">
        <b-card-group deck class="my-3">
            <DartQueryConcepts
                :conceptIDs="filter.concept" 
                :hilitedConceptIDs="hilitedConceptIDs"
                @conceptMouseover="conceptMouseover" 
                @conceptMouseout="conceptMouseout"
                @conceptSelected="conceptSelected"/>
            <DartQueryCombinators 
                :conceptIDs="filter.concept"
                :hiliteForConceptID="hoveredConceptID"
                @combinatorMouseover="combinatorMouseover" 
                @combinatorMouseout="combinatorMouseout"
                @combinatorSelected="combinatorSelected"/>     
            <DartQueryResults 
                :conceptIDs="filter.concept"
                :filter="filter"
                @datasetSelected="datasetSelected"/>               
        </b-card-group> 
        <b-card-group deck class="my-5">   
            <DartConceptDetails 
                :conceptID="selectedConceptID" 
                :hilitedConceptIDs="hilitedConceptIDs"
                @conceptMouseover="conceptMouseover" 
                @conceptMouseout="conceptMouseout"
                @conceptSelected="conceptSelected"/>
            <DartCombinatorDetails 
                :combinatorID="selectedCombinatorID"
                :hilitedConceptIDs="hilitedConceptIDs"
                @conceptMouseover="conceptMouseover" 
                @conceptMouseout="conceptMouseout"
                @conceptSelected="conceptSelected"/>
            <DartResultDetails 
                :datasetID="selectedDatasetID"
                :hiliteForConceptID="hoveredConceptID"
                @combinatorMouseover="combinatorMouseover" 
                @combinatorMouseout="combinatorMouseout"
                @combinatorSelected="combinatorSelected"/> 
        </b-card-group>
        </div>
    </b-col>
    </b-row>
    
    </b-container>
</template>

<script>
import DartQueryConcepts from './DartQueryConcepts.vue' 
import DartQueryCombinators from './DartQueryCombinators.vue' 
import DartQueryResults from './DartQueryResults.vue' 
import DartConceptDetails from './DartConceptDetails.vue'
import DartCombinatorDetails from './DartCombinatorDetails.vue' 
import DartResultDetails from './DartResultDetails.vue' 

export default {
	name: 'DartQueryExplainer',
	components: {
        DartQueryConcepts,
        DartQueryCombinators,
        DartQueryResults,
        DartConceptDetails,
        DartCombinatorDetails,
        DartResultDetails
	},
	mixins: [],
	props: {
        filter: {
            type: Object,
            required: true
        }        	
	},
	data() {
		return {
            hoveredConceptID: "",
            selectedConceptID: "",
            selectedCombinatorID: "",
            selectedDatasetID: "",
            hilitedConceptIDs: []  
		}
	},
    computed: {},    
	methods: {        
        conceptMouseover(data) {
            this.hoveredConceptID = data.conceptID 
            this.hilitedConceptIDs = [data.conceptID]            
        },
        conceptMouseout() {
            this.hoveredConceptID = ""
            this.hilitedConceptIDs = []            
        },
        conceptSelected(data) {
            this.selectedConceptID = data.conceptID
        },
        combinatorMouseover(com) {
             this.hilitedConceptIDs = com.concepts.map(c => c.id)
        },
        combinatorMouseout() {
            this.hilitedConceptIDs = []
        },
        combinatorSelected(com) {
            this.selectedCombinatorID = com.id
        },
        datasetSelected(id) {
            this.selectedDatasetID = id
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

</style>