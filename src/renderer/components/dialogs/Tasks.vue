<template>
  <v-sheet v-if="dataReady" width="100%" height="100%" class="pa-2 py-4" :color="analysing == false ? 'transparent' : 'workspace'">
    <v-fade-transition leave-absolute>
      <analisys :filtered="filteredList(tasks, 'title', { value: filter, field: 'status' })" v-if="analysing !== false" />
    </v-fade-transition>
    <v-card-title class="text-subtitle-1 py-0 pt-0 mx-3">
      <v-list-item v-if="!searching" class="ma-0 pa-0" style="min-height: 40px; width: 100%">
        <!-- <v-btn style="z-index: 6" icon x-small left @click="showRoots = !showRoots">
          <svg :style="`transform:rotate(${showRoots ? 180 : 0}deg)`" height="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
          </svg>
        </v-btn>
        <v-divider class="py-2 mx-2 mr-1 mb-2" vertical inset></v-divider>
        <v-card v-if="showRoots" class="text-left pa-1 pt-5" style="top: 35px; position: absolute; z-index: 10; overflow-x: auto; overflow-y: hidden; display: flex" height="90" width="95%" color="background">
          <small style="position: absolute; top: -5px; margin-left: 2px">roots</small>
          <v-btn v-for="(root, r) in roots" :key="r" :elevation="isOpen(root.id) ? 3 : 0" :color="isOpen(root.id) ? 'primary lighten-1' : 'transparent'" height="100%" width="80" @click="openRoot(root.id)">
            <svg version="1.1" class="mb-5" viewBox="0 0 50 45" xmlns="http://www.w3.org/2000/svg" style="overflow: visible">
              <path d="M 18.255593,4.2834353 5.4858191,13.228038 5.4052874,38.14297 29.474115,43.140312 41.712501,35.18536 V 9.5867362 Z" fill="white" />
              <path
                d="m 21.267244,3.3953828 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.7025703,11.051801 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 l 16.1962096,4.194657 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 43.989601,9.6630499 42.85062,8.5202168 40.650024,7.9502873 L 24.453814,3.7556304 C 23.481477,3.5038063 22.396782,3.3885362 21.267278,3.3954195 Z m 0.185733,1.9699794 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 L 30.231199,7.2824816 15.800406,17.961068 9.0661396,16.130973 C 7.5686211,15.743133 6.7031862,15.014608 6.5056849,14.145917 6.6526004,13.462056 7.1633632,12.734524 8.0572387,12.040013 L 13.993817,7.6989324 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.789461,2.1790905 7.381327,2.085813 c 1.49195,0.3863973 2.35794,1.1105083 2.559676,1.9749193 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.968483,-1.770438 z m 10.121395,8.0329293 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 8.9085936,37.553775 C 7.4339913,37.170888 6.5712127,36.459768 6.3567137,35.608484 6.3457757,35.294275 6.3348777,34.980065 6.3239797,34.665856 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759406,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 25.827441 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z"
                :fill="status(root.status).color"
              />
              <path transform="scale(.26458) translate(40 90)" :d="status(root.status).icon" :fill="status(root.status).color" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" />
            </svg>
            <v-list-item-subtitle style="max-width: 70px; font-size: 11px; position: absolute; bottom: -2px; text-transform: lowercase">
              {{ root.title }}
            </v-list-item-subtitle>
          </v-btn>
        </v-card> -->
        <v-btn rounded :color="hasChanges ? 'primary' : 'secondary'" :depressed="!hasChanges" :disabled="saving" class="mx-1" x-small @click="saveTaskBox()"> Save </v-btn>
        <v-btn rounded color="primary" style="z-index: 6" x-small @click="closeTaskBox()"> Close </v-btn>
        <v-spacer></v-spacer>
        <nav-menu style="z-index: 6" v-show="!searching" :options="['parent', 'home']" />
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on }">
            <v-btn style="z-index: 6" v-on="on" icon x-small fab :loading="loading" @click="updateList()">
              <svg style="pointer-events: none" width="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                  fill="grey"
                />
              </svg>
            </v-btn>
          </template>
          Refresh
        </v-tooltip>
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on }">
            <v-btn style="z-index: 6" v-show="!searching" v-on="on" icon x-small fab @click="searching = true">
              <svg style="pointer-events: none" width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
              </svg>
            </v-btn>
          </template>
          Search
        </v-tooltip>
        <task-sort :show="!searching" @update="updateSort" />
        <task-filter :extraClass="'mr-0 windowbar-button'" :right="true" v-show="!searching" :filterModel="filter" @updateFilter="updateFilter" />
      </v-list-item>
      <v-text-field style="z-index: 6" class="my-1" v-show="searching" v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append>
          <v-btn color="primary" rounded x-small @click="(searching = false), (search = '')">close</v-btn>
        </template>
      </v-text-field>
      <v-list-item-content class="text-left" style="min-width: 180px; z-index: 6">
        <v-list-item-title class="my-0 py-0" style="min-height: 25px">
          <svg width="20" height="20" style="margin-bottom: -5px" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 21.454744,3.5828806 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.8900701,11.239299 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 L 23.379756,44.05664 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 44.177101,9.8505477 43.03812,8.7077146 40.837524,8.1377851 L 24.641314,3.9431282 C 23.668977,3.6913041 22.584282,3.576034 21.454778,3.5829173 Z M 21.640477,5.55286 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 l 5.868296,1.5161893 -13.91,10.7510777 -6.8307416,-1.782339 C 7.7561209,15.930631 6.890686,15.202106 6.6931847,14.333415 6.8401002,13.649554 7.350863,12.922022 8.2447385,12.227511 L 14.181317,7.8864302 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.365143,2.0588434 7.805645,2.2060601 c 1.49195,0.3863975 2.35794,1.1105085 2.559676,1.9749195 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.872008,-1.818194 z m 10.545713,8.1531766 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 9.0960934,37.741273 C 7.6214911,37.358386 6.7587125,36.647266 6.5442135,35.795982 6.5332755,35.481773 6.5223775,35.167563 6.5114795,34.853354 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759408,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 26.014939 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z m -8.340974,3.007211 c -0.08912,2.18e-4 -0.177472,0.03172 -0.246378,0.092 l -0.0015,-0.03977 -5.422647,3.846922 -1.812746,-2.43181 c -0.115953,-0.155094 -0.3404,-0.191874 -0.504457,-0.08264 l -1.404197,0.933272 c -0.168288,0.11217 -0.208794,0.334735 -0.09044,0.494315 l 3.03138,4.078486 c 0.11748,0.158308 0.346956,0.194247 0.511468,0.07953 l 7.1699,-4.990706 c 0.165966,-0.11536 0.202683,-0.338638 0.08109,-0.495874 l -1.051003,-1.359755 -0.01248,0.01325 c -0.02295,-0.03978 -0.05353,-0.0753 -0.09044,-0.103698 -0.0502,-0.02301 -0.104023,-0.03366 -0.157495,-0.03353 z"
              fill="#0187f3"
            />
          </svg>
          {{ currentTaskBoxTask.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="my-0 py-0" v-if="taskBoxInfo"> {{ taskBoxInfo.Done.value }} of {{ taskBoxInfo.Total.value - taskBoxInfo.Canceled.value }} tasks done </v-list-item-subtitle>
      </v-list-item-content>

      <v-spacer v-if="!searching"></v-spacer>

      <task-box-menu :extraStyle="'z-index:6'" :extraClass="'mx-1 ml-3'" :taskbox="currentTaskBoxTask" :options="['icon', 'template', 'pack']" />
      <task-box-table-info :taskbox="currentTaskBoxTask" :options="['status']" />

      <!-- Select To Act -->
      <!-- <v-btn v-if="!isEmpty" style="margin-right: -32px !important" class="mx-0" icon @click="selecting = !selecting">
        <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="m10.754-3.4365e-8c-5.9037 0-10.754 4.8503-10.754 10.754v26.492c0 5.9037 4.8503 10.754 10.754 10.754h26.492c5.9037 0 10.754-4.8503 10.754-10.754v-26.492c1e-15 -5.9037-4.8503-10.754-10.754-10.754zm0 6.2495h26.492c2.5507 0 4.5045 1.9538 4.5045 4.5045v26.492c0 2.5507-1.9538 4.5045-4.5045 4.5045h-26.492c-2.5507 0-4.5045-1.9538-4.5045-4.5045v-26.492c0-2.5507 1.9538-4.5045 4.5045-4.5045z" color="#000000" fill="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.67" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
          <path v-if="selecting" d="m12.674 27.313 8.0132 6.6263 14.64-19.879" fill="none" stroke="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.4301" />
        </svg>
      </v-btn> -->
      <!-- Select To Act -->
    </v-card-title>

    <!-- <v-overlay v-if="disabled" absolute color="grey" class="text-h4" :style="`color:${parentStatus.color}`"> {{ parentStatus.text }} </v-overlay> -->

    <div v-if="!filtering && !loading" key="0">
      <v-list-item v-for="(task, k) in filteredList(tasks, 'title', { value: filter, field: 'status' })" :key="`${k}_${task.id}`" v-show="task.taskType !== 'audition'" class="my-1" flat rounded="lg" color="transparent">
        <task-item :style="(task.taskType == 'taskbox' && 'z-index:6') || ''" v-if="task.taskType !== 'audition'" :task="task" :options="['subject', 'status', 'menu', 'worker']" />
        <v-btn v-if="selecting" style="margin-right: -20px !important" class="mx-0" icon @click="toggleSelection(task.id)">
          <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m10.754-3.4365e-8c-5.9037 0-10.754 4.8503-10.754 10.754v26.492c0 5.9037 4.8503 10.754 10.754 10.754h26.492c5.9037 0 10.754-4.8503 10.754-10.754v-26.492c1e-15 -5.9037-4.8503-10.754-10.754-10.754zm0 6.2495h26.492c2.5507 0 4.5045 1.9538 4.5045 4.5045v26.492c0 2.5507-1.9538 4.5045-4.5045 4.5045h-26.492c-2.5507 0-4.5045-1.9538-4.5045-4.5045v-26.492c0-2.5507 1.9538-4.5045 4.5045-4.5045z" color="#000000" fill="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.67" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
            <path v-if="isSelected(task.id)" d="m12.674 27.313 8.0132 6.6263 14.64-19.879" fill="none" stroke="grey" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.4301" />
          </svg>
        </v-btn>
        <!-- <audition-bit v-if="false" :task="hasAudition(task.id)" :auditing="task" /> -->
      </v-list-item>
    </div>
    <div key="1" v-else>
      <v-card color="#8e8e8e24" :loading="filtering || loading" loader-height="100%" v-for="t in tasks.length || 1" :key="t + 'empty'" class="my-1 mx-4 text-right" height="50px" flat style="opacity: 0.5; background-color: white" />
    </div>
    <empty v-if="isEmpty && !filtering" :loading="filtering" :text="' '" :icon="'m 27.869099,7.3592406 c -0.0059,0.00582 -0.01175,0.011671 -0.01757,0.017571 L 15.712736,19.593636 11.775508,15.802653 c -2.3844606,-2.296403 -6.2323023,-2.22586 -8.5291946,0.15813 -2.29821147,2.38477 -2.2261004,6.2341 0.1596802,8.531262 v 0.0021 l 8.2170694,7.910114 c 2.359122,2.270783 6.1547,2.228842 8.463049,-0.09354 L 36.41018,15.884818 C 38.744077,13.536056 38.731785,9.6851501 36.38279,7.3514891 36.35686,7.3260311 36.33015,7.3013871 36.30269,7.2775921 33.709749,5.197852 30.043786,5.30006 27.869096,7.3592411 Z'" />
  </v-sheet>
</template>

<script>
// import AuditionBit from '../lists/AuditionBit.vue';
import Empty from '../dialogs/Empty.vue';
import TaskFilter from '../menus/TaskFilter.vue';
import TaskItem from '../lists/TaskItem.vue';

import { mapGetters, mapState } from 'vuex';
import _ from 'lodash';
import { NodeView } from '../../libs/nodeview';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import TaskSort from '../menus/TaskSort.vue';
import NavMenu from '../navigation/NavMenu.vue';
import TaskBoxMenu from '../menus/TaskBoxMenu.vue';
import Analisys from '../navigation/Analisys.vue';
import { isTaskCanceled, isTaskPaused } from '../../store/modules/task/task';
import auditionstatus from '../../enums/auditionstatus';
import { eventBus } from '../../../main';
import TaskBoxTableInfo from './TaskBoxTableInfo.vue';

export default {
  name: 'TasksPannel',
  components: {
    Empty,
    TaskItem,
    TaskFilter,
    TaskSort,
    NavMenu,
    TaskBoxMenu,
    Analisys,
    TaskBoxTableInfo,
    // AuditionBit,
  },
  data() {
    return {
      loading: false,
      selecting: false,
      selection: [],
      saving: false,
      showRoots: false,
      filtering: false,
      filter: [0, 1, 2, 3, 4, 5, 6],
      sortModel: 2,
      searching: false,
      search: null,
      refreshkey: 0,
    };
  },
  created() {
    eventBus.$on('updateTasks', () => {
      this.refreshkey++;
    });
  },
  watch: {
    selecting(value) {
      this.selection = value ? this.filteredList(this.currentTaskBoxTasks, 'title', { value: this.filter, field: 'status' }).map((t) => t.id) : [];
    },
    filter() {
      this.filtering = true;
      setTimeout(() => {
        this.filtering = false;
      }, 1500);
    },
  },
  computed: {
    ...mapState({
      root: (state) => state.taskbox.root,
      roots: (state) => state.user.roots,
      hasChanges: (state) => state.taskbox.hasChanges,
      analysing: (state) => state.taskbox.analysing,
      analisis: (state) => state.taskbox.analisis,
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
      profile: (state) => state.user.profile,
      currentTaskBoxTask: (state) => _.cloneDeep(state.taskbox.currentTaskBox),
    }),
    ...mapGetters({
      currentTaskBox: 'taskbox/currentTaskBox',
      currentTaskBoxTasks: 'taskbox/currentTaskBoxTasks',
    }),
    dataReady() {
      return this.currentTaskBoxTasks;
    },
    tasks() {
      this.refreshkey;
      return Object.values(this.root.tasks).filter((t) => (this.currentTaskBox ? Object.keys(this.currentTaskBox.data.nodes).includes(t.id) : null));
    },
    isEmpty() {
      return this.tasks && this.tasks.length == 0 ? true : false;
    },
    parentStatus() {
      return getStatusTypeByValue(this.currentTaskBoxTask.status);
    },
    disabled() {
      return this.paused || this.canceled ? true : false;
    },
    paused() {
      return isTaskPaused(this.currentTaskBoxTask);
    },
    canceled() {
      return isTaskCanceled(this.currentTaskBoxTask);
    },
  },
  methods: {
    // hasAudition(id) {
    //   let node = this.currentTaskBox.data.nodes[id];
    //   let audition = null;
    //   node.outputs.flowingData.connections.map((conn) => {
    //     let task = this.currentTaskBoxTasks.find((t) => t.id == conn.node);
    //     if (task && task.taskType == 'audition') audition = task;
    //   });
    //   return audition;
    // },
    auditionApproved(taskAudition, id) {
      let audition = taskAudition && taskAudition.value.auditions[id];
      if (audition && audition.status == auditionstatus.APROOVED.value) return true;
      return false;
    },
    isSelected(id) {
      return this.selection.includes(id);
    },
    toggleSelection(id) {
      if (this.selection.includes(id)) {
        let index = this.selection.indexOf(id);
        this.selection.splice(index, 1);
      } else this.selection.push(id);
    },
    unselect(id) {
      return this.selection.includes(id);
    },
    filteredList(list, field, filter) {
      this.refreshkey;
      let sort = this.sortModel;
      let filtered = [];
      let searchResult = this.search ? list.filter((item) => item[field] && item[field].toLowerCase().includes(this.search)) : list;
      if (!filter) filtered = searchResult;
      else filtered = searchResult.filter((item) => filter.value.includes(item[filter.field]));

      let nodes = this.currentTaskBox ? this.currentTaskBox.data.nodes : {};
      // let pos = 0;
      return filtered.sort(function (a, b) {
        if (!nodes[a.id] || !nodes[b.id]) return 0;
        let na = nodes[a.id];
        let nb = nodes[b.id];
        switch (sort) {
          case 0:
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
          case 1:
            if (a.title > b.title) return -1;
            if (a.title < b.title) return 1;
            return 0;
          case 2:
            return Math.hypot(na.position[0], na.position[1]) - Math.hypot(nb.position[0], nb.position[1]);
        }
      });
    },
    openRoot(id) {
      if (this.root && this.root.id == id) return;
      this.$store.dispatch('taskbox/OPEN_TASKBOX', { deeper: false, id: id, isRoot: true }).then(() => {
        this.$store.commit('app/TOGGLE_MEMBER_AREA', false);
      });
    },
    isOpen(id) {
      return this.root.id == id ? true : false;
    },
    saveTaskBox() {
      this.saving = true;
      eventBus.$emit('setWorking', true);
      NodeView.saveTaskBox(true);
      setTimeout(() => {
        this.saving = false;
        eventBus.$emit('setWorking', false);
      }, 700);
    },
    closeTaskBox() {
      this.$store.commit('taskbox/SUCCESS_CLOSE_ROOT');
    },
    status(s) {
      return getStatusTypeByValue(s);
    },
    completed(status) {
      return status.value == taskstate.DONE.value ? true : false;
    },
    async updateList() {
      this.loading = true;
      this.$store.dispatch('user/GET_TASKS', { member: null }).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    updateFilter(value) {
      console.log(value);
      this.$nextTick(() => {
        this.loading = true;
        this.filter = value;
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    updateSort(value) {
      this.sortModel = value;
      console.log(value);
    },
    updateOrder() {
      // console.log(this.priority);
      // this.$store.commit('taskbox/UPDATE_TASK_ORDER', this.priority);
    },
    close() {
      this.$store.commit('app/TOGGLE_TASKS', false);
    },
  },
};
</script>

<style scoped>

.audition {
  border-radius: 0 25px 25px 0 !important;
  border-left: 3px dashed #eeeeee !important;
}
</style>
