<template>
<span>
</span>
</template>

<script lang="js">
  export default {
    name:'ExternalInput',
    props: ['node','emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      value: 0,
    }),
    created(){
    // console.logthis.node);
      this.update();
    },
    mounted() {
      this.value = this.getData(this.ikey) || 0;
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
        if (this.ikey) this.putData(this.ikey, this.value);
        this.emitter.trigger("process");
      },
    },
  };
</script>
