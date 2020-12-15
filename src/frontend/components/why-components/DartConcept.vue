<template>
    <span>
        <b-badge
            pill 
            class="border mr-1"
            variant="secondary" 
            :class="{ hilited: hilited }" 
            role="button" 
            @mouseover="mouseover"
            @mouseout="mouseout"
            @click.prevent="selected"
            :alt="cleanLabel" 
            :title="cleanLabel"> 
            <b-icon-tag class="mr-1"/>
            <slot>{{ cleanLabel }}</slot>
        </b-badge>
        <span class="font-italic text-secondary ml-2" 
            v-if="showGroup">{{ cleanGroup }}</span>       
    </span>
</template>

<script>
import DartCommon from '@/mixins/DartCommon.js'

export default {
    name: "DartConcept",
    props: {
        id: {
            type: String,
            required: false,
            default: ""
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        group: {
            type: String,
            required: false,
            default: "" 
        },
        showGroup: {
            type: Boolean,
            required: false,
            default: false
        },
        hilited: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    mixins: [ DartCommon ],
    data() {
        return { }
    },    
    computed: {
        cleanId: function() { 
            return this.clean(this.id) 
        },
        cleanLabel: function() { 
            return this.clean(this.label)
        },
        cleanGroup: function() {
            return this.clean(this.group).replace("_", " ")
        }        
    },
    methods: {
        mouseover() {
            this.$emit('mouseover', { conceptID: this.cleanId })
        },
        mouseout() {
            this.$emit('mouseout', { conceptID: this.cleanId })
        },
        selected() {
            this.$emit('selected', { conceptID: this.cleanId })
        },
    }
}
</script>

<style scoped>
.hilited {
    border-color: blue;
    background:palegreen;
    color: darkgreen;
}
</style>