<template>
  <v-sheet width="100%"  height="calc(100vh - 40px)" color="transparent">
    <v-card-title height="40px" class="text-subtitle-1" v-if="!searching">
      <v-list-item class="ma-0 pa-0" style="min-height: 30px; width: 100%">
        <v-list-item-icon class="pa-0 mr-1">
          <svg class="mx-1" style="pointer-events: none" width="23" height="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="icon" fill="#0187f3" />
          </svg>
        </v-list-item-icon>
        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> Files </v-list-item-title>
          <v-list-item-subtitle>
            <v-tooltip bottom transition="none">
              <template v-slot:activator="{ on }">
                <v-list-item v-on="on" link class="ma-0 pa-0" style="min-height: 15px" @click="openFolder()">
                  <small v-on="on" style="font-size: 11px"> {{ folder }}</small>
                </v-list-item>
              </template>
              open folder
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab  @click="updateList()">
                <svg style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path
                    d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                    fill="grey"
                  />
                </svg>
              </v-btn>
            </template>
            refresh
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="searching = true">
                <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
            search
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-card-title>
    <v-card-title v-else style="height: 92px">
      <v-text-field v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append>
          <v-btn style="margin-right:-18px" color="primary" rounded x-small @click="(searching = false), (search = '')">close</v-btn>
        </template>
      </v-text-field>
    </v-card-title>
  
    <v-list class="px-4 py-0 my-0" v-for="(file, t) in filteredList" :key="t" color="transparent">
      <file-item :file="file" :folder="folder" :id="t" />
    </v-list>
    <empty :text="' '" :extraClass="'mb-12 mr-5'" :icon="icon" v-if="isEmpty" />
  </v-sheet>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import Empty from '../dialogs/Empty.vue';
import FileItem from './FileItem.vue';
import { eventBus } from '../../../main';

export default {
  name: 'FileList',
  props: { folder: String },
  components: {
    FileItem,
    Empty,
  },
  data() {
    return {
      loading: false,
      searching: false,
      search: '',
      icon:'M 9.6727308,5.282258 C 7.6642745,5.3353271 5.971897,7.0291843 5.970643,9.0803742 l -0.00546,6.5289188 v 0.531158 L 5.953677,33.958686 c -0.00213,3.500207 2.7313717,6.486438 6.215327,6.778491 l 23.381378,1.960581 c 3.483945,0.292054 6.460412,-2.458212 6.462895,-5.958249 l 0.01153,-15.788145 c 2.54e-4,-0.374173 -0.03269,-0.742064 -0.09252,-1.101823 h 0.06155 c 0.06215,-0.783593 0.07281,-5.191003 0.01204,-6.062784 -0.02134,-3.265122 -2.625121,-5.8710981 -5.811211,-5.9442466 -0.212396,-0.00491 -0.427194,0.00177 -0.644183,0.020007 L 23.154195,8.9018215 C 22.617233,7.3721286 21.223154,6.2280849 19.528129,6.0859928 L 10.07835,5.2937608 C 9.9420514,5.2823319 9.8066276,5.2787214 9.6727308,5.2822555 Z m 0.049514,2.8983524 c 0.036925,4.862e-4 0.074803,0.00226 0.1140335,0.0055 l 9.4497787,0.7917323 c 0.627698,0.052617 1.202502,0.679042 1.202354,1.3198883 l -0.002,5.504618 15.080932,1.262371 c 1.931055,0.161878 3.554932,1.932251 3.553541,3.884641 l -0.01097,15.788145 c -0.0017,1.952736 -1.386418,3.227777 -3.317473,3.065904 L 12.411032,37.843331 C 10.479986,37.681448 8.8557948,35.913258 8.8569861,33.960692 l 0.011503,-17.818243 v -0.531156 l 0.00543,-6.5294183 C 8.8742784,8.4817241 9.1682353,8.1734845 9.7221686,8.1806094 Z M 36.148013,10.742863 c 1.743326,0.01392 2.960751,1.249371 2.961869,3.079906 v 0.05251 l 0.0034,0.05302 c 0.01853,0.250489 0.03132,0.813161 0.03953,1.482434 -0.960284,-0.687966 -2.103779,-1.13394 -3.343482,-1.237862 L 23.39173,13.131072 V 11.79618 l 12.400647,-1.039806 c 0.120688,-0.01008 0.239379,-0.01443 0.355603,-0.01351 z',
    };
  },
  mounted(){
    this.updateList();
  },
  computed: {
    ...mapState({
      fileList: (state) => state.taskbox.fileList,
    }),
    isEmpty() {
      return this.fileList.length == 0 ? true : false;
    },
    filteredList() {
      return this.fileList.filter((t) => t.name.toLowerCase().includes(this.search));
    },
  },
  methods: {
    async updateList() {
      this.loading = true;
      eventBus.$emit('setWorking',true)
      await new Promise((res) => {
        this.$store.dispatch('taskbox/GET_FILE_LIST');
        setTimeout(res, 1000);
      });
      this.loading = false;
      eventBus.$emit('setWorking',false)
    },
    async openFolder() {
      ipcRenderer.send('app:openFolder', this.folder);
    },
  },
};
</script>

