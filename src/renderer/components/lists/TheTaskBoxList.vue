<template>
  <v-sheet class="taskboxList" :height="`calc(100vh - ${authenticated ? '160px' : '40px'})`" color="grey lighten-3">
    <v-card-title style="height: 80px" v-if="!searching">
      <v-list-item-icon class="mx-2">
        <svg style="pointer-events: none" width="30" height="30" version="1.1" viewBox="0 0 40 55" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path :d="icon" fill="#0057ff" />
        </svg>
      </v-list-item-icon>
      <v-list-item-content class="text-left">
        <v-list-item-title class="py-0 my-0"> My Projects 
        <v-btn-toggle style="position:relative;margin-left:50px" group mandatory v-model="displayMode">
          <v-item-group v-for="(type, t) in displayTypes" :key="t">
            <v-tooltip bottom transition="none">
              <template v-slot:activator="{ on: onTooltip }">
                <v-btn tile v-on="{ ...onTooltip }" elevation="0" x-small class="pa-0 ma-0" height="15" min-width="15" @click.stop>
                  <svg width="18" height="15" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path transform="translate(2 0)" :d="type.icon" fill="grey" />
                  </svg>
                </v-btn>
              </template>
              Display ({{ type.name }})
            </v-tooltip>
          </v-item-group>
        </v-btn-toggle>
        </v-list-item-title>
        <v-spacer> </v-spacer>
      </v-list-item-content>
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon x-small fab :loading="loading" @click="updateList()">
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
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" elevation="0" class="mx-2" v-on="on" v-bind="attrs" x-small @click="$emit('newProject')"> new </v-btn>
        </template>
        New Project
      </v-tooltip>
    </v-card-title>
    <v-card-title v-else style="height: 80px" class="pt-7">
      <v-text-field v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append>
          <v-btn color="primary" rounded x-small @click="(searching = false), (search = '')">close</v-btn>
        </template>
      </v-text-field>
    </v-card-title>

    <v-list class="pa-0 ma-0">
      <v-container fluid class="ma-0 pa-0 pb-5">
        <v-row dense class="ma-0 px-0">
          <v-col :style="isOpen(i) ? `border:2px solid ${status(taskbox.task.status).color};border-radius:10px` : ''" v-for="(taskbox, i) in filteredList" :key="i" :cols="displayTypes[displayMode].cols" class="ma-0 my-1">
            <project-item :taskbox="taskbox" :open="isOpen(i)" :listMode="displayMode" />
          </v-col>
        </v-row>
      </v-container>
    </v-list>

    <empty :icon="icon" :text="'no projects'" v-if="isEmpty" />
  </v-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import { iconTypes } from '../../fixtures/iconTypes';
import { getStatusTypeByValue } from '../../enums/taskstate';
import ProjectItem from './ProjectItem.vue';
import Empty from '../dialogs/Empty.vue';
import store from '../../store';

export default {
  name: 'TheProjectList',
  props: { open: Boolean },
  components: { ProjectItem, Empty },
  data() {
    return {
      loading: false,
      displayMode: 0,
      displayTypes: [
        { cols: 12, name: 'List', icon: 'M 4.9864359,5.9083071 V 13.292585 H 37.23253 V 5.9083071 Z m 0.01416,11.2485359 V 24.54112 H 37.24669 v -7.384277 z m 0,11.059081 v 7.384279 H 37.24669 v -7.384279 z' },
        { cols: 4, name: 'Small Icon', icon: 'M 6.8665634,6.5042546 V 19.004255 H 19.366563 V 6.5042546 Z m 15.9999996,0 V 19.004255 H 35.366562 V 6.5042546 Z M 6.8665634,22.504255 V 35.004256 H 19.366563 V 22.504255 Z m 15.9999996,0 V 35.004256 H 35.366562 V 22.504255 Z' },
        { cols: 12, name: 'Large', icon: 'M 6.8665633,6.5042548 H 35.366561 V 35.004255 H 6.8665633 Z' },
      ],
      searching: false,
      search: '',
      icon: 'M 7.8834844,12.654189 C 4.7030622,15.50337 4.0907038,15.840062 2.8539021,18.557003 l -2.0978909,4.812611 c -0.69347361,1.591232 0.22320854,2.355498 2.0104793,1.087534 l 3.2728698,-2.321258 0.010166,13.216403 h 0.012874 c 0.044418,1.132245 1.028397,2.100345 2.8974732,2.588362 l 14.0760515,3.675208 c 3.380215,0.882555 8.321676,-0.145793 11.078974,-2.305545 l 5.217619,-4.087134 c 1.161549,-0.909822 1.699832,-1.867291 1.739432,-2.737278 l 0.01355,-6.79e-4 0.0054,-3.698434 4.985875,-4.07347 c 1.486748,-1.214828 1.862063,-3.394397 0.769771,-4.97861 L 43.700379,15.17146 c -0.625936,-0.90783 -1.593535,-1.416179 -2.58577,-1.457104 l 0.0014,-0.907872 -0.0047,0.0054 C 41.110703,11.64569 40.120858,10.6444 38.20833,10.145048 L 24.132304,6.4698031 C 15.729887,4.9270849 14.621607,8.0061843 7.8834844,12.654189 Z M 23.468919,8.3570377 35.293915,11.227076 c 1.296646,0.338548 2.195868,0.953177 2.224602,1.730353 0.02271,0.614478 -0.566937,1.242386 -1.347771,1.854 l -5.553717,4.350136 c -2.151019,1.684857 -4.28075,2.029463 -6.917721,1.340964 L 19.819296,19.489457 V 8.221779 c 1.051637,-0.2378544 2.52124,-0.1386104 3.649623,0.1352587 z M 8.3900087,19.183437 c 0,0 9.6113683,2.230904 14.6459193,3.545406 2.069715,0.540393 4.723511,0.361711 7.104093,-0.351809 -0.381249,1.076915 -0.273574,2.304113 0.41131,3.29744 l 3.146158,4.562587 c 1.092293,1.584214 3.226051,1.955334 4.712798,0.740508 l 0.385239,-0.307461 c 0.0396,1.297919 0.167044,2.338013 -1.541612,3.497145 l -5.553716,3.767577 c -2.15102,1.684869 -5.299712,1.90461 -7.936681,1.216108 L 10.136887,35.924384 C 8.8553157,35.588913 8.4282693,35.011356 8.3957671,34.242877 8.2200215,28.268139 8.3900304,19.183437 8.3900304,19.183437 Z m 19.8743803,6.40258 c -0.891648,0 -1.609331,0.723521 -1.609331,1.62242 v 9.779943 c 0,0.898899 0.717683,1.6231 1.609331,1.6231 0.891646,0 1.60933,-0.724201 1.60933,-1.6231 v -9.779943 c 0,-0.898899 -0.717684,-1.62242 -1.60933,-1.62242 z',
      cols: 4,
    };
  },
  computed: {
    ...mapState({
      rootTaskBoxes: (state) => state.taskbox.rootTaskBoxes,
      project: (state) => state.taskbox.project,
    }),
    ...mapGetters({
      root: ['taskbox/currentRootId'],
    }),
    authenticated() {
      return store.getters['user/authenticated'];
    },
    isEmpty() {
      return this.rootTaskBoxes && this.rootTaskBoxes.length == 0 ? true : false;
    },
    filteredList() {
      if (!this.search) return this.rootTaskBoxes;
      return this.rootTaskBoxes.filter((t) => t.task.title.toLowerCase().includes(this.search));
    },
  },
  methods: {
    async task(id) {
      return await store.dispatch('task/FIND_TASK', id);
    },
    status(s) {
      return getStatusTypeByValue(s);
    },
    isOpen(i) {
      if (!this.root) return false;
      let id = this.filteredList[i].id;
      return id == this.root ? true : false;
    },
    async updateList() {
      this.loading = true;
      await new Promise((res) => {
        this.$store.dispatch('taskbox/FETCH_ROOTS');
        setTimeout(res, 1000);
      });
      this.loading = false;
    },
    getStatus(status) {
      return getStatusTypeByValue(status);
    },
    getIcon(node) {
      let name = node.name;
      if (node.meta.options) name = node.meta.options[node.data.selected].name;
      return iconTypes[name.toLowerCase()][0] || 'm32.588 13.54 3.5541 3.4281-17.399 17.518-10.335-10.332 3.4281-3.3055 6.9072 6.8868z';
    },
    refresh() {
      this.$store.dispatch('taskbox/FETCH_TASKBOXES');
    },
  },
};
</script>

<style scoped>
.taskboxList {
  padding: 5px 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
