<template>
 <vue-mathjax class="stringPreview" v-if="name=='Formula'" :formula="data.mutated || ''"/>
 <div v-else style="position:absolute;bottom:20px;left:30px;width:220px">
  <v-list-item-title class="text-h4 pt-5 stringPreview"  :key="ikey">
          {{value}}
  </v-list-item-title>
 </div>
</template>

<script lang="js">
import vueMathjax from 'vue-mathjax/src/components/vue-mathjax.vue';
  export default {
    name:'StringPreview',
    components: { vueMathjax },
    props: ['name','emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      data: {},
      value:0,
    }),

    mounted() {
      this.data = this.getData(this.ikey);
      this.value=this.data.value;
    },
    watch:{
      value(){
        return this.update();
      }
    },

    methods: {
      changes(e) {
        if(!e.target)return 0;
        this.value = +e.target.value;
        this.update();
      },

      update() {
        this.data.value=this.value;
        if (this.ikey) this.putData(this.ikey, this.data);
        this.emitter.trigger("process");
      },
    },
  };
</script>

<style  scoped>
  .stringPreview{
    color:#9955ff;
    font-weight: 700;
    pointer-events: none;
  }
  
</style>
