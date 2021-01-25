<template>
    <details>
        <summary>
            <DartConcept
                :id="currentConcept.id"
                :label="currentConcept.title"
                :group="currentConcept.group"
                :showGroup="true"
                :hilited="hilitedConceptIDs.some(id => id == currentConcept.id)"
                @selected="conceptSelected" 
                @mouseover="conceptMouseover" 
                @mouseout="conceptMouseout"/>            
        </summary>
        <details class="ml-2">
            <summary>
                <span class="font-italic text-secondary mx-1">Related</span> 
				<b-badge class="font-italic m-1" variant="dark">{{ related.length }}</b-badge>
            </summary>
             <b-list-group class="ml-2">
                <li v-for="(c, index) in related" :key="index">
                    <DartConcept 
                        :id="c.id" 
                        :label="c.title" 
                        :group="c.group"
                        :showGroup="true"
                        :hilited="hilitedConceptIDs.some(id => id == c.id)"                        
                        @selected="conceptSelected" 
                        @mouseover="conceptMouseover" 
                        @mouseout="conceptMouseout"/>
                </li>
            </b-list-group>
        </details>
        <details class="ml-2">
            <summary>
                <span class="font-italic text-secondary mx-1">Contextual</span> 
				<b-badge class="font-italic m-1" variant="dark">{{ contextual.length }}</b-badge>
            </summary>
            <b-list-group class="ml-3">
                <li v-for="(c, index) in contextual" :key="index">
                    <DartConcept 
                        :id="c.id" 
                        :label="c.title"
                        :group="c.group" 
                        :showGroup="true"
                        :hilited="hilitedConceptIDs.some(id => id == c.id)"                        
                        @selected="conceptSelected" 
                        @mouseover="conceptMouseover" 
                        @mouseout="conceptMouseout"/>
                </li>
            </b-list-group>
        </details>       
	</details>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'
import DartConcept from './DartConcept.vue'

export default {
	name: 'DartExpandedConcept',
	components: {
		DartConcept
	},
	mixins: [ DartCommon ],
	props: {
		concept: {
			type: Object,
            required: false,
            default: () => {}
        },
        hilitedConceptIDs: {
           type: Array,
           required: false,
           default: () => [] 
        }		
	},
	data() {
		return {
            //currentConcept: this.concept || {}
        }
	},
	computed: {  
        currentConcept(){
            return  this.concept || {}
        },      
        related(){
            let unique = new Map() 
            for (let c of this.currentConcept.related || []) {
                if(!unique.has(c.id)) {
                    unique.set(c.id, c)  
                }
            } 
			return [...unique.values()]
				.sort((a, b) => a.title.localeCompare(b.title)) 
        },
        contextual(){
           let unique = new Map() 
            for (let c of this.currentConcept.contextual || []) {
                if(!unique.has(c.id)) {
                    unique.set(c.id, c)  
                }
            } 
			return [...unique.values()]
				.sort((a, b) => a.title.localeCompare(b.title))
        }
    },
	methods: {
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
.hilited {
    background: palegreen;
    color: darkgreen;
} 
li {
    display: block;
}
</style>