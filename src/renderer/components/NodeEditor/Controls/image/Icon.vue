<template>
  <input
    type="number"
    :readonly="readonly"
    :value="value"
    :style="{
      backgroundColor: readonly ? '#555' : 'white',
      color: readonly ? 'white' : 'black'
    }"
    @input="changes($event)"
    @dblclick.stop
    @pointermove.stop
  />
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
    changes(e) {
      this.value = +e.target.value;
      this.update();
    },

    update() {
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger('process');
    },
  },
};
</script>
