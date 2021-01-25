<template>
    <div>
        <b-form-radio-group buttons v-model="listDisplay">           
            <b-form-radio name="listDisplay" value="listed">listed</b-form-radio>
            <b-form-radio name="listDisplay" value="grouped">grouped</b-form-radio>
            <b-form-radio name="listDisplay" value="inline">inline</b-form-radio>
        </b-form-radio-group>
       
        <b-list-group id="conceptList" class="overflow-auto m-1" style="height: 250px;">     
            <template v-if="listDisplay == 'listed'">  
                <li class="py-0" action v-for="(concept, cindex) in sortedConcepts" :key="cindex">    
                    <DartExpandedConcept v-if="showExpanded"
                        :concept="concept" 
                        :hilitedConceptIDs="hilitedConceptIDs"
                        @conceptMouseover="conceptMouseover" 
                        @conceptMouseout="conceptMouseout" 
                        @conceptSelected="conceptSelected"/>
                    
                    <DartConcept v-else
                        :hilited="hilitedConceptIDs.some(id => id == concept.id)"
                        :group="concept.group"
                        :showGroup="true"
                        @mouseover="conceptMouseover" 
                        @mouseout="conceptMouseout" 
                        @selected="conceptSelected"
                        :id="concept.id">{{ concept.title }}</DartConcept>
                </li> 
            </template>
            <template v-else-if="listDisplay == 'grouped'">
                <b-list-group-item class="px-1 py-1" v-for="(group, gindex) in uniqueGroups" :key="gindex">
                    <details>
                        <summary>
                            <span class="font-italic text-secondary">{{ group.replace("_", " ") }}</span> 
                            <b-badge class="font-italic m-1" variant="dark">{{ conceptsInGroup(group).length }}</b-badge><br> 
                        </summary> 
                        <DartConcept v-for="(concept, cindex) in conceptsInGroup(group)"
                            :key="cindex"
                            :hilited="hilitedConceptIDs.some(id => id == concept.id)"
                            @mouseover="conceptMouseover" 
                            @mouseout="conceptMouseout" 
                            @selected="conceptSelected"
                            :id="concept.id">{{ concept.title }}</DartConcept>
                        </details>
                </b-list-group-item>
            </template> 
            <template v-else><!--else inline-->
                <li class="mx-1">
                    <DartConcept v-for="(concept, cindex) in sortedConcepts" 
                        :key="cindex"
                        :hilited="hilitedConceptIDs.some(id => id == concept.id)"
                        @mouseover="conceptMouseover" 
                        @mouseout="conceptMouseout" 
                        @selected="conceptSelected" 
                        :id="concept.id">{{ concept.title }}</DartConcept>
                    <!--<span class="font-italic text-secondary ml-2">{{ concept.group }}</span>-->   
                </li>        
            </template>    
        </b-list-group>
    </div>
</template>
 
<script>
import DartCommon from '@/mixins/DartCommon.js' 
import DartConcept from './DartConcept.vue'
import DartExpandedConcept from './DartExpandedConcept.vue'

export default {
	name: 'DartConceptList',
	components: {
        DartConcept,
        DartExpandedConcept
    },
    mixins: [ DartCommon ],
	props: {		
        concepts: {
            type: Array,
            default: () => []
        },
        hilitedConceptIDs: {
           type: Array,
           required: false,
           default: () => [] 
        },
        showExpanded: {
            type: Boolean,
            required: false,
            default: true
        },
        display: {
            type: String,
            required: false,
            default: "listed",
            validator: value => ["listed", "grouped", "inline"].includes(value)      
        }			
	},
	data: function() {
		return {
            listDisplay: this.display // "listed" | "grouped" | "inline" 
        }
    },
    watch: {},
	computed: {
        // returns cleaned version of input array        
        sortedConcepts: function() { 
            return(this.concepts || []).sort((a, b) => a.title.localeCompare(b.title))  
        }, 
        uniqueGroups: function() {
            return [...new Set(this.sortedConcepts.map(c => c.group).filter(g => g))].sort()
        }     
	},
	methods: {         
         conceptsInGroup: function(group) {
            return this.sortedConcepts
                .filter(c => c.group == group)
                .sort((a, b) => a.title.localeCompare(b.title))
        },

        /*onConceptSelected: function(id) {            
            this.$emit('conceptSelected', { id: id }) 
        },
        
        onConceptSelectedOld: function(event) {  // this gets value from elements with attribute :data-id="value"           
            this.$emit('conceptSelected', { id: event.currentTarget.dataset.id }) 
        },*/

        conceptMouseover(data) {
           this.$emit('conceptMouseover', data) 
        },		
        conceptMouseout(data) {
            this.$emit('conceptMouseout', data) 
        },
        conceptSelected(data) {
            this.$emit('conceptSelected', data) 
        }	
	}
}
</script>

<style scoped> 
.hilited {
    background: palegreen;
    color: darkgreen;
} 
li {
    display: block;
}
</style>