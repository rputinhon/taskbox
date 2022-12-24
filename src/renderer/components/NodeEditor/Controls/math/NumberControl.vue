<template>
<div style="position:absolute;bottom:-15px;left:15px;width:190px">
  <v-text-field
    type="number"
    id="inputNode"
    solo
    outlined
    flat
    rounded
    :key="ikey"
    :readonly="readonly"
    v-model="value"
    @click="changes($event)"
    @keydown.escape="changes($event)"
    @keydown.enter="changes($event)"
    @blur="changes($event)"
    @dblclick.stop
    @pointermove.stop
  />
</div>
</template>

<script lang="js">
// import { eventBus } from "../../../../../main";
  export default {
    name:'NumberControl',
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      data: {},
      value:0,
    }),

    mounted() {
      this.data = this.getData(this.ikey)|| 0;
      this.value=this.data.value;
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
        
        setTimeout(() => this.emitter.trigger('saveTaskBox'), 1000);
      },
    },
  };
</script>
