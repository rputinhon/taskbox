<template>
  <v-sheet>
    <vue-mathjax :formula="content.data.flowingData.mutated || ''"/>
  </v-sheet>
</template>

<script>


import vueMathjax from 'vue-mathjax/src/components/vue-mathjax.vue';
  export default {
    name: "previewMathFormula",
  components: { vueMathjax },
    props: ["content"],
    data() {
        return {
            formula: '$$ x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a} $$',
      };
    },
    created(){
      require('mathjax').init();
    }
  };
</script>
