<template>
  <v-textarea
  class="node"
    outlined
    no-resize
    height="195px"
    dense
    hide-details="true"
    :key="ikey"
    :value="value"
    :readonly="readonly"
    @input="changes($event)"
    @dblclick.stop
    @pointermove.stop
  >
  </v-textarea>
</template>

<script lang="js">

  export default {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      value: 0,
    }),

    mounted() {
      this.value = this.getData(this.ikey);
    },

    methods: {
      changes() {
        // console.loge);
        // this.value = e;
        this.update();
      },

      update() {
        if (this.ikey) this.putData(this.ikey, this.value);
        setTimeout(() => this.emitter.trigger("process"), 1000);
      },
    },
  };
</script>

