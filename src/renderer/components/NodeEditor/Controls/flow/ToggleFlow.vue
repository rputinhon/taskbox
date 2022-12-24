<template>
    <v-tooltip top transition="none" style="margin-left:-20px">
      <template v-slot:activator="{ on, attrs }">
          <v-btn class="ma-1 mt-3" icon fab fixed left top large v-on="on" :key="ikey" :readonly="readonly" v-bind="attrs"  @click="toggleDataFlowing()" @dblclick.stop>
            <svg  version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path v-if="data.flowing"  d="m 5.3378906,20.71875 c -1.7718574,0 -3.1992187,1.427362 -3.1992187,3.199219 v 0.439453 c 0,1.771858 1.4273613,3.199219 3.1992187,3.199219 H 43.664923 c 1.771857,0 3.199218,-1.427361 3.199218,-3.199219 v -0.439453 c 0,-1.771857 -1.427361,-3.199219 -3.199218,-3.199219 z" fill="#0057ff" stop-color="#000000" style="paint-order: fill markers stroke" />
              <path  v-else d="M 22.28125,5.3554688 C 21.395562,5.3239069 20.497766,5.632634 19.794922,6.2871094 18.389234,7.5960601 18.312143,9.7818119 19.621094,11.1875 l 12.912109,13.867188 c 0.874674,0.864499 1.971988,1.687749 3.033203,1.707031 h 8.09961 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.521484 c 0,-1.771858 -1.427361,-3.199219 -3.199218,-3.199219 H 37.152344 L 24.695312,6.4609375 C 24.040837,5.7580935 23.166938,5.3870306 22.28125,5.3554688 Z M 5.1992188,19.923828 C 3.4273614,19.923828 2,21.35119 2,23.123047 V 23.5625 c 0,1.771857 1.4273614,3.199219 3.1992188,3.199219 h 6.4667972 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.439453 c 0,-1.771857 -1.427361,-3.199219 -3.199218,-3.199219 z" fill="grey"  />
            </svg>
        </v-btn>
    </template>
    <span v-if="data && data.flowing">flowing</span>
    <span v-else>not flowing</span>
  </v-tooltip>
</template>

<script lang="js">
  export default {
    name:'ToggleControl',
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      data: {},
    }),

    mounted() {
      this.data = this.getData(this.ikey);
      console.log(this.data);
    },

    methods: {
      toggleDataFlowing() {
        this.data.flowing = !this.data.flowing;
        this.update();
      },

      update() {
        // if (this.ikey) this.putData(this.ikey, this.data);
        this.emitter.trigger("updatenodes");
        this.emitter.trigger("process");
        this.emitter.trigger('saveTaskBox');
      },
    },
  };
</script>
