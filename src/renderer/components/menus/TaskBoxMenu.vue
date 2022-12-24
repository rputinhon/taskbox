<template>
  <v-menu class="windowbar-button" rounded="0" bottom left offset-y light :close-on-content-click="true" v-if="task">
    <template v-slot:activator="{ on: menu }">
      <RULE :rule="rules.EDIT" :doc="task" :returnCondition="true">
        <v-btn :style="extraStyle && extraStyle" v-show="!hide" :class="extraClass && extraClass" slot-scope="allow" :loading="working" :absolute="options.includes('absolute')" :right="options.includes('right')" :disabled="!allow.value" v-on="{ ...menu }" :elevation="options.includes('icon') ? 0 : 5" fab x-small :icon="options.includes('icon')" class="windowbar-button px-0 my-auto">
          <v-badge :value="hasChanges && options.includes('save')" right overlap offset-x="3" offset-y="5" color="primary" dot>
            <svg width="23" version="1.1" viewBox="0 0 48 43" xmlns="http://www.w3.org/2000/svg">
              <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " :fill="!allow.value ? 'rgba(100,100,100,0.3)' : options.includes('white') ? '#fafafa' : 'grey'" />
            </svg>
          </v-badge>
        </v-btn>
      </RULE>
    </template>
    <v-card max-width="400" class="windowbar-button pb-2">
      <v-list>
        <v-list-item class="my-3" v-if="options.includes('thumbnail') && task.thumbnail">
          <thumbnail v-if="task.thumbnail" :task="task" :options="['edit']" :size="200" />
        </v-list-item>

        <v-list-item :disabled="disabled" v-if="options.includes('open')" link style="min-height: 30px; height: 30px" @click="openItem(task.id)">
          <v-list-item-icon class="py-1 my-0 px-0 mr-2">
            <svg width="28" version="1.1" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m 21.983086,15.979536 c -2.644585,0 -4.830787,2.184332 -4.830787,4.828917 v 26.761166 c 0,2.644586 2.186202,4.830788 4.830787,4.830788 h 26.761166 c 2.644586,0 4.830788,-2.186202 4.830788,-4.830788 V 20.808453 c 0,-2.644585 -2.186202,-4.828917 -4.830788,-4.828917 z M 57.36882,32.693582 c -0.747616,-0.04205 -1.387905,0.529626 -1.430494,1.277212 -0.04313,0.748328 0.528852,1.389791 1.277211,1.432366 0,0 2.88864,0.164521 6.107532,2.112798 3.218891,1.948276 6.697566,5.572416 7.752532,12.957181 1.814183,12.699294 8.274613,21.334168 15.757888,24.331519 -7.4849,2.99558 -13.943411,11.649331 -15.757888,24.350676 -1.054966,7.384776 -4.533641,11.011246 -7.752532,12.959516 -3.218892,1.94828 -6.107532,2.11047 -6.107532,2.11047 -0.748551,0.0426 -1.320605,0.68433 -1.277211,1.43283 0.04284,0.7474 0.683052,1.3188 1.430494,1.27674 0,0 3.567967,-0.20496 7.358574,-2.49928 3.790608,-2.29431 7.873989,-6.78668 9.032548,-14.896596 2.149151,-15.044069 10.99905,-23.182821 18.948817,-23.182821 0.749113,8.3e-5 1.356482,-0.607078 1.356657,-1.356191 -3.94e-4,-0.09779 -0.01136,-0.195248 -0.03271,-0.290678 0.01172,-0.02582 0.02263,-0.052 0.03271,-0.07851 8.3e-5,-0.749296 -0.607361,-1.356741 -1.356657,-1.356658 -7.949767,0 -16.799666,-8.140154 -18.948817,-23.184225 -1.158559,-8.109914 -5.24194,-12.600885 -9.032548,-14.8952 -3.790607,-2.294313 -7.358574,-2.501147 -7.358574,-2.501147 z m 43.88693,22.412663 c -2.644579,0 -4.828917,2.186202 -4.828917,4.830786 v 26.7607 c 0,2.644587 2.184338,4.829386 4.828917,4.829386 h 26.76117 c 2.64458,0 4.83078,-2.184799 4.83078,-4.829386 v -26.7607 c 0,-2.644584 -2.1862,-4.830786 -4.83078,-4.830786 z M 22.721467,97.597729 c -2.644587,0 -4.830787,2.186205 -4.830787,4.830781 v 26.76117 c 0,2.64458 2.1862,4.83078 4.830787,4.83078 h 26.761166 c 2.644587,0 4.830786,-2.1862 4.830786,-4.83078 v -26.76117 c 0,-2.644576 -2.186199,-4.830781 -4.830786,-4.830781 z"
                :fill="disabled ? 'grey' : '#252525'"
              />
            </svg>
          </v-list-item-icon>
          <v-list-item-title class="text-center" v-text="'Open in Editor'"></v-list-item-title>
        </v-list-item>

        <v-list-item :disabled="disabled" v-if="options.includes('pack')" @click="packTaskBox()" style="min-height: 40px; height: 40px">
          <v-list-item-icon class="py-2 my-0 px-0 mr-2">
            <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m 20.716197,2.2600586 c -3.526603,0.021492 -7.47311,1.1898149 -9.949534,3.1139128 L 4.5179127,10.228541 c -1.4089796,1.09473 -2.1057563,2.251628 -2.1289846,3.300291 l -0.029196,-0.03455 0.018978,23.449 h 0.015571 c 0.053192,1.344937 1.2313929,2.495295 3.4696357,3.074981 l 16.8562022,4.365512 c 4.047856,1.048349 9.964956,-0.173255 13.266854,-2.738723 l 6.248263,-4.854572 c 1.390963,-1.080733 2.035822,-2.218697 2.083241,-3.252117 l 0.01656,-3.78e-4 0.03599,-23.375513 -0.0059,0.0068 C 44.364426,8.7838478 43.179494,7.5939874 40.889212,7.0008307 L 24.033033,2.6352462 C 23.021068,2.3731579 21.892219,2.2528935 20.716684,2.2600586 Z m 0.193677,2.0506373 c 0.917058,-0.00555 1.797445,0.087523 2.586898,0.2919748 l 6.107632,1.5786112 -1.458415,1.1270235 -3.255523,-0.9640045 c -1.927148,-0.5706317 -3.664461,-0.4019308 -3.895432,0.3781075 -0.230972,0.7800391 1.134209,1.8673581 3.061357,2.437991 L 25.28074,9.5229347 24.106026,10.430491 20.44904,9.3477506 c -1.927147,-0.5706332 -3.664948,-0.4019321 -3.895919,0.3781068 -0.230972,0.7800386 1.134696,1.8673586 3.061844,2.4379916 l 1.625327,0.481272 -1.065709,0.82337 -3.889106,-1.151842 c -1.927148,-0.570632 -3.664948,-0.401931 -3.895919,0.378108 -0.23097,0.780039 1.134696,1.867359 3.061844,2.437991 l 1.858421,0.550373 -2.182514,1.686641 -7.1091033,-1.855014 C 6.4596586,15.111102 5.5589983,14.353118 5.353447,13.449026 5.5063506,12.737294 6.0382511,11.980081 6.9685558,11.257267 L 13.146746,6.7389541 c 1.931907,-1.501022 5.011956,-2.4114922 7.763128,-2.4282582 z m 9.747098,2.1430959 8.123229,2.2958962 c 1.552758,0.4021451 2.454807,1.1553783 2.664755,2.055018 -0.149766,0.714892 -0.650524,1.514258 -1.614133,2.202465 l -6.148992,4.391303 c -2.719132,1.801921 -7.191733,2.954605 -10.349538,2.13677 l -7.152414,-1.892485 2.146017,-1.658904 3.420486,1.012667 c 1.927149,0.570632 3.664462,0.402417 3.895433,-0.377621 0.230972,-0.780039 -1.134695,-1.867359 -3.061844,-2.437992 l -1.388827,-0.411198 1.065221,-0.823369 3.65358,1.081281 c 1.927147,0.570633 3.664464,0.401932 3.895435,-0.378107 0.230971,-0.780039 -1.134699,-1.867359 -3.061847,-2.437992 l -1.621434,-0.479812 1.174712,-0.9080426 4.054559,1.2005046 c 1.927149,0.570632 3.664462,0.401931 3.895433,-0.378108 0.230975,-0.7800386 -1.13421,-1.867359 -3.061355,-2.4379915 L 29.16206,7.6090392 Z m 10.97534,8.4847932 0.06472,17.92726 c -0.125581,0.868963 -0.49417,1.618392 -1.633598,2.503687 l -6.134392,4.457 C 31.353164,41.827907 26.60545,42.72618 23.450058,41.899067 L 7.8542135,37.81093 C 6.3195172,37.412436 5.4219408,36.672059 5.1987013,35.786085 5.1873168,35.459065 5.1754862,35.132055 5.1641523,34.80505 l 0.064719,-17.408036 c 0.00162,-0.416163 0.8050291,0.321198 1.28031,0.444288 l 16.2109367,4.107115 c 4.047852,1.048346 9.964957,-0.173261 13.266855,-2.738725 z m -12.651277,8.741244 c -1.067757,0 -1.927034,0.859275 -1.927034,1.927035 V 38.88686 c 0,1.067757 0.859277,1.928009 1.927034,1.928009 1.067762,0 1.928007,-0.860252 1.928007,-1.928009 V 25.606864 c 0,-1.06776 -0.860245,-1.927035 -1.928007,-1.927035 z m -10.850276,0.88955 c -0.568143,0 -1.070531,0.114355 -1.507564,0.342584 -0.437033,0.223373 -0.835327,0.572796 -1.194664,1.048677 v -1.194664 h -2.607337 v 11.260986 h 2.607337 v -4.282786 c 0.359337,0.475881 0.757631,0.827749 1.194664,1.055975 0.437033,0.223375 0.939421,0.335289 1.507564,0.335289 1.005175,0 1.831085,-0.398294 2.476922,-1.194666 0.645836,-0.801226 0.968383,-1.830927 0.968383,-3.08861 0,-1.257683 -0.322547,-2.28445 -0.968383,-3.080822 -0.645837,-0.801226 -1.471747,-1.201963 -2.476922,-1.201963 z m -0.968384,1.893944 c 0.558431,0 0.983116,0.203789 1.274471,0.611689 0.296211,0.407898 0.444289,1.000206 0.444289,1.777152 0,0.77695 -0.148078,1.369745 -0.444289,1.777642 -0.291355,0.407898 -0.71604,0.611688 -1.274471,0.611688 -0.55843,0 -0.988488,-0.20379 -1.289556,-0.611688 -0.29621,-0.412754 -0.444288,-1.005549 -0.444288,-1.777642 0,-0.772089 0.148078,-1.361954 0.444288,-1.769854 0.301068,-0.412753 0.731126,-0.618987 1.289556,-0.618987 z"
                :fill="disabled ? 'grey' : '#252525'"
              />
            </svg>
          </v-list-item-icon>
          <v-list-item-title class="text-center">Pack TaskBox</v-list-item-title>
        </v-list-item>

        <v-list-item :disabled="disabled" v-if="options.includes('template')" @click="saveTemplate(currentTaskBox)" style="min-height: 30px; height: 30px">
          <v-list-item-icon class="py-1 my-0 px-0 mr-2">
            <svg width="23" version="1.3" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m 17.5625,9.8007813 c -0.06095,1.5059437 0.562363,2.5833647 1.076172,3.4179687 l -2.986328,-0.02734 c -3.872322,-0.03624 -7.0195315,3.149968 -7.0195315,7.00586 v 17.109375 c 0,3.855834 3.1500175,7.005859 7.0058595,7.005859 h 16.722656 c 3.855841,0 7.005859,-3.150026 7.005859,-7.005859 v -2.75 -0.01758 c -0.02414,-0.96789 -0.262931,-1.907709 -1.02539,-2.52539 -0.76246,-0.617681 -1.667045,-0.584494 -2.277344,-0.470703 C 35.454154,31.65676 34.956185,31.857418 34.548828,32 c -0.407357,0.142582 -0.742269,0.197266 -0.677734,0.197266 -1.816448,0 -3.230469,-1.414023 -3.230469,-3.230469 v -0.04297 c 0,-1.816443 1.414022,-3.230469 3.230469,-3.230469 h 0.0039 0.002 c -0.02591,1.28e-4 0.320388,0.05466 0.730469,0.181641 0.410081,0.126978 0.904404,0.302161 1.478515,0.410156 0.574112,0.107996 1.340572,0.211049 2.144532,-0.296875 0.803959,-0.507924 1.136718,-1.513001 1.136718,-2.40039 v -3.390625 c 0,-3.855838 -3.153017,-6.984874 -6.998046,-7.007813 l -3.542969,-0.02148 c 0.162408,-0.394901 0.361344,-0.837343 0.560547,-1.337891 0.233225,-0.586037 0.476562,-1.185296 0.476562,-1.9882811 0,-3.3838406 -2.77049,-6.1387551 -6.154297,-6.1542969 C 19.982731,3.6703882 17.539418,6.4922256 17.5625,9.8007813 Z M 23.708984,6.6875 c 1.773788,0 3.154297,1.3805118 3.154297,3.1542969 0,0.00549 -0.07755,0.4112231 -0.263672,0.8789061 -0.186123,0.467683 -0.445941,1.018391 -0.667968,1.591797 -0.222028,0.573406 -0.492315,1.127768 -0.361329,2.033203 0.06549,0.452718 0.346661,1.042718 0.820313,1.386719 0.473652,0.344001 0.987473,0.427 1.439453,0.429687 l 4.521484,0.02734 c 2.256921,0.01347 4.015625,1.761701 4.015625,4.007813 v 3.0625 c -0.251888,-0.06525 -0.520477,-0.14083 -0.873046,-0.25 -0.461906,-0.143026 -0.944342,-0.318952 -1.626954,-0.316407 -3.424094,0.0022 -6.226562,2.805897 -6.226562,6.230469 v 0.04297 c 0,3.425901 2.804566,6.230469 6.230469,6.230469 0.728719,0 1.214928,-0.207932 1.669922,-0.367188 0.357242,-0.125041 0.614616,-0.203502 0.841796,-0.265625 0.0065,0.0584 -0.01801,-0.04675 -0.01563,0.04883 v 2.69336 c 0,2.246104 -1.75975,4.005859 -4.005859,4.005859 H 15.638672 c -2.24611,0 -4.005859,-1.759756 -4.005859,-4.005859 V 20.197266 c 0,-2.246063 1.762869,-4.026722 3.992187,-4.00586 l 4.179687,0.03906 c 0.441138,0.0041 0.858778,-0.01668 1.353516,-0.253906 0.494738,-0.237222 1.00174,-0.891447 1.082031,-1.457032 0.160582,-1.131169 -0.297481,-1.559682 -0.585937,-2.072265 -0.576912,-1.025167 -1.122694,-2.093635 -1.101563,-2.5332035 l 0.002,-0.035156 v -0.037109 c 0,-1.7737838 1.380514,-3.1542969 3.154297,-3.1542969 z"
                :fill="disabled ? 'grey' : '#252525'"
              />
            </svg>
          </v-list-item-icon>
          <v-list-item-title>Save As Template</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="options.includes('save')" class="mt-2" style="min-height: 30px; height: 30px">
          <v-btn rounded :disabled="disabled" block :color="hasChanges ? 'primary' : 'secondary'" small @click="saveTaskBox()"> Save </v-btn>
        </v-list-item>

        <v-list-item v-if="options.includes('delete')" style="min-height: 30px; height: 30px">
          <v-btn  rounded :disabled="disabled" block color="error" small @click="deleteItem(task.id)"> Delete taskbox </v-btn>
        </v-list-item>
        <v-list-item v-if="options.includes('close')" style="min-height: 30px; height: 30px">
          <v-btn rounded block color="primary" small @click="closeTaskBox()"> Close </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
const { clipboard, ipcRenderer, nativeImage } = require('electron');
import { NodeView } from '../../libs/nodeview';
import { mapState } from 'vuex';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import apistate from '../../enums/apistate';
import RULES from '../../enums/rules';
import _ from 'lodash';

import Thumbnail from '../lists/Thumbnail.vue';
import RULE from '../navigation/Rule.vue';
import { isTaskCanceled, isTaskPaused } from '../../store/modules/task/task';
import { eventBus } from '../../../main';

export default {
  components: { RULE, Thumbnail },
  props: { taskbox: Object, options: Array, hide: Boolean, extraClass: String, extraStyle: String },
  name: 'TaskBoxMenu',
  data() {
    return {
      hovering: false,
      working: false,
    };
  },
  watch: {
    apiState(value) {
      if (value !== apistate.DONE) this.working = true;
      else {
        setTimeout(() => {
          this.working = false;
        }, 0);
      }
    },
  },
  computed: {
    ...mapState({
      hasChanges: (state) => state.taskbox.hasChanges,
      currentTaskBox: (state) => _.cloneDeep(state.taskbox.currentTaskBox),
      root: (state) => _.cloneDeep(state.taskbox.root.task),
      apiState: (state) => state.apiState,
    }),
    task() {
      return this.taskbox ? this.taskbox : this.currentTaskBox;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    unstarted() {
      return this.task.status == taskstate.UNSTARTED.value ? true : false;
    },
    disabled() {
      return this.paused || this.canceled ? true : false;
    },
    paused() {
      return isTaskPaused(this.currentTaskBox);
    },
    canceled() {
      return isTaskCanceled(this.currentTaskBox);
    },
    isRoot() {
      if (!this.task || !this.root) return false;
      return this.task.id == this.root.id ? true : false;
    },
    rules() {
      return RULES;
    },
  },
  methods: {
    openItem(id) {
      this.$store.dispatch('taskbox/FETCH_ROOT', id);
    },
    deleteItem(id) {
      this.working = true;
      eventBus.$emit('setWorking',true)
      this.$store.dispatch('taskbox/DELETE_ROOT', id).then(() => {
        setTimeout(() => {
          this.working = false;
          eventBus.$emit('setWorking',false)
        }, 300);
      });
    },
    selectImage() {
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (path) => {
        if (path == undefined) return;

        let clip = await nativeImage.createThumbnailFromPath(path, { width: 512, height: 512 });
        let task = _.cloneDeep(this.task);

        task.thumbnail = clip.toDataURL();
        this.$store.dispatch('taskbox/UPDATE_CURRENT_TASKBOX', task);
      });
    },
    getClipBoardImage() {
      if (!clipboard.readImage().isEmpty()) {
        let clip = clipboard.readImage();
        let size = clip.getSize();
        let finalSize = 512;

        let task = _.cloneDeep(this.task);

        task.thumbnail = clip
          .resize({ width: finalSize * clip.getAspectRatio(), height: finalSize })
          .crop({ x: size.width / 2 - size.height / 2 - size.height / 2 / 2, y: 0, width: finalSize, height: finalSize })
          .toDataURL();

        this.$store.dispatch('taskbox/UPDATE_CURRENT_TASKBOX', task);
      }
    },
    saveTemplate(taskbox) {
      this.$store.commit('taskbox/CREATE_TEMPLATE', taskbox);
    },
    packTaskBox() {
      this.$store.commit('taskbox/SET_PACKING');
    },
    async saveTaskBox() {
      NodeView.saveTaskBox(true);
    },
    closeTaskBox() {
      this.$store.commit('taskbox/SUCCESS_CLOSE_ROOT');
    },
  },
};
</script>
