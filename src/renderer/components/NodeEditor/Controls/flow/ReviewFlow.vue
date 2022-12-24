<template>
<div style="position:absolute;bottom: 20px!important;left: 25px!important;">
  <v-avatar class="ml-8"  size="80" color="grey">
    <svg width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
      <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
    </svg>
  </v-avatar>
  <v-avatar rounded="lg" style="position:absolute;margin-top:20px;margin-left:20px;pointer-events:none">
    <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path :d="inputIcon()" fill="grey" stop-color="#000000" style="paint-order: fill markers stroke" />
    </svg>
  </v-avatar>
  <v-menu rounded="0" right offset-x light nudge-top="12" nudge-left="0">
    <template v-slot:activator="{ on, attrs }">
    <v-btn icon outlined fab fixed right  x-large  v-on="on" v-bind="attrs" @dblclick.stop @click="toggleDataFlowing()" class="mr-2 px-2 mt-1">
      <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path :d="inputStatus().icon" :fill="inputStatus().value>0?inputStatus().color:'grey'" stop-color="#000000" style="paint-order: fill markers stroke" />
      </svg>
    </v-btn>
    </template>
    <v-card class="mx-auto" max-width="400" v-if="data">
        <v-list-item v-if="data.task">
          <!-- <v-progress-linear absolute height="100%" reverse :buffer-value="data.task.progress"/> -->
          <v-list-item-content>
            <v-list-item-title>
              {{data.title}}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{data.task.progress}}%
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      <v-list-item-group v-model="flowingModel" active-class="border" color="indigo" mandatory>
        <v-list-item v-for="(item, i) in ActionList" :key="i">
          <v-list-item-icon>
            <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path :d="item.icon" :fill="item.color" stop-color="#000000" style="paint-order: fill markers stroke" />
            </svg>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-card>
  </v-menu>
</div>

</template>

<script lang="js">

import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate'
import { iconTypes }  from '../../../../fixtures/iconTypes'
export default {
  name:'ReviewFlowControl',
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'change'],

  data: () => ({
    data: {},
    flowingModel:null,
    ActionList: [
      {
        name: 'Ask Review',
        color:'#FB8C00',
        icon: 'm 29.527631,13.282675 5.482532,5.155782 C 39.676866,14.285303 34.36616,8.2073968 29.527631,13.282675 Z M 27.673666,15.25261 14.738531,29.000286 c -0.867941,3.036456 -1.536423,4.933995 -2.206423,7.646229 2.973653,-0.800827 4.964394,-1.496236 7.689756,-2.48778 L 33.154335,20.41186 Z'
      },
      {
        name: 'Aproove',
        color: '#4CAF50',
        icon: 'M 34.029804,13.351153 20.633798,26.916629 14.309317,20.634998 c -1.188924,-1.178741 -3.039198,-1.09663 -4.134161,0.183464 -1.096172,1.280866 -1.021085,3.276894 0.167703,4.457929 l 8.326768,8.269629 c 1.129295,1.121371 2.870695,1.111808 3.989328,-0.02192 L 38.039461,17.948739 c 1.177738,-1.192641 1.235746,-3.188191 0.129596,-4.457932 -1.458367,-1.336732 -2.745759,-0.995892 -4.139247,-0.139648 z'
      },
    ],
  }),
  mounted() {
    // this.data = this.getData(this.ikey);
    // console.log(this.data);
  },
  watch:{
      data(value){
        this.data=value;
        return this.update();
      }
    },

  methods: {
    inputIcon(){
      if(!this.data.name) return 'm12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm12.762 11.846c0.99181 0.009698 1.9608 0.49714 2.5508 1.3906l2.8477 4.3145h5.4492c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-6.3887c-1.2167 0.27382-2.5239-0.20891-3.2539-1.3145l-3.8164-5.7773c-0.94401-1.4296-0.55262-3.3411 0.87695-4.2852 0.53609-0.354 1.1393-0.51947 1.7344-0.51367zm-13.338 5.7051h4.9238c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-4.9238c-1.7131 0-3.0918-1.3806-3.0918-3.0938 1e-7 -1.7131 1.3787-3.0918 3.0918-3.0918z';
        return iconTypes[this.data.name.toLowerCase()][0];
    },
    statusTypes(){
        return taskstate;
    },
    inputStatus(){
        return getStatusTypeByValue(this.data?this.data.task ? this.data.task.status: 0:0 );
    },
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
