<template>
    <b-list-group id="citationList" class="overflow-auto" style="height: 300px;">
        <b-list-group-item v-for="(c, index) in citations" :key="index"> 
            <b-icon-card-text class="mr-2"/>
            <span v-html="enhance(c)"/>
        </b-list-group-item>              
    </b-list-group>  
</template>

<script>
export default {
	name: 'DartCitations',
	components: {},
	props: {		
        citation: {
            type: String,
            default: ""
        }		
	},
	data: function() {
		return {}
	},
	computed: { 
        // obtaining array of citation strings from input string       
        citations: function() {
            return (this.citation || "")
                .split("\n")        // split by newline into separate citations
                .map(s => s.trim()) // trim whitespace from start/end of each
                .filter(i => i)     // empty string is 'falsy', so filtered out
        }        
	},
	methods: { 
        // embolden authors and date (everything up to and including (CCYY), only if present)
        enhance: c => {
            let pos = c.search(/\(\d{4}\)/) // looking for position of bracketed 4 digit number
            return pos > -1 ? `<span class="font-weight-bold">${c.substr(0, pos + 6)}</span>${c.substr(pos + 6)}` : c
        }
	}
}
</script>

<style scoped>
</style>