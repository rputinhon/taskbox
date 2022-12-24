<template>
  <v-card flat color="transparent" width="100%" :height="height || 'calc(100vh - 40px)'">
    <v-card-title class="text-subtitle-1 py-0 my-0" v-if="!searching">
      <v-list-item class="ma-0 pa-0" style="min-height: 30px; width: 100%">
        <v-list-item-icon v-if="false" class="pa-0 mr-1">
          <svg class="mx-1" style="pointer-events: none" width="23" height="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="icon" fill="#0187f3" />
          </svg>
        </v-list-item-icon>
        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> {{ title }} </v-list-item-title>
          <v-list-item-subtitle class="my-0 py-0"> {{ subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab :loading="refreshing" @click="refresh()">
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
        <!-- <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab  @click="onlyAuditions = !onlyAuditions">
                <svg style="pointer-events: none" width="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path :style="!onlyAuditions && 'filter:grayscale(1)'" d="m 35.89829,9.207423 v 5.35e-4 c -0.588346,0.01878 -1.127841,0.303851 -1.512912,0.703164 l -6.806261,6.979136 c 2.629844,2.700937 4.652205,4.777455 7.119665,7.311628 l 7.066106,-7.113299 0.0021,-0.0021 c 0.86868,-0.875759 0.852858,-2.327027 -0.03604,-3.182797 L 37.517796,9.844865 37.501906,9.828955 C 37.058344,9.43737 36.486662,9.188663 35.898304,9.207457 Z m -24.390633,8.661745 c -0.5666,-0.0045 -1.13486,0.201613 -1.56806,0.619908 l -4.04664,3.902399 h -0.002 c -0.88784,0.858018 -0.90032,2.308846 -0.0281,3.182796 v 0.0021 l 12.199848,12.195587 c 0.866182,0.865086 2.302656,0.861579 3.164765,-0.0074 l 5.416902,-5.452956 C 22.053485,27.499089 17.12943,22.563427 13.066257,18.51347 c -0.42701,-0.424603 -0.99192,-0.639866 -1.55852,-0.644302 z" fill="#0187f3" />
                </svg>
              </v-btn>
            </template>
            only auditions
          </v-tooltip>
        </v-list-item-action> -->
        <task-filter />
      </v-list-item>
    </v-card-title>
    <v-card-title v-else class="py-0" style="height: 56px">
      <v-text-field v-model="search" color="primary" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append>
          <v-btn style="margin-right:-18px" color="primary" rounded x-small @click="(searching = false), (search = null)">close</v-btn>
        </template>
      </v-text-field>
    </v-card-title>
    <v-fade-transition hide-on-leave leave-absolute group>
    <div key="1" v-if="filtering">
      <v-card color="#8e8e8e24" v-for="t in 1" :key="t + 'empty'"  class="my-1 mx-3 text-right overflow-hidden" height="50px" flat style="opacity: 0.5; background-color: white">
        <v-card width="100%" color="grey lighten-1" class="loading"  height="100%" />
      </v-card>
    </div>
    <div  key="0" v-else class="pb-4">
      <!-- <v-expansion-panels popout :value="[0]" multiple v-if="group">
        <v-expansion-panel v-for="(taskbox, t) in taskboxList" :key="`${t}_${taskbox.id}`" v-show="getTasks(taskbox.id).length">
          <v-expansion-panel-header :color="!undoneCount(taskbox.id) ? 'success' : 'white'">
            <v-card-title class="my-0 py-0 mx-0 px-0">
              <thumbnail :task="taskbox" :options="['transparent']" :size="30" />
              <span class="ml-3">
                {{ taskbox.title }}
              </span>
            </v-card-title>
            <v-btn rounded right absolute small text class="mr-8">
              <v-badge color="primary" left inline v-if="undoneCount(taskbox.id)" dot>
                <small class="text-right"> {{ undoneCount(taskbox.id) }} task </small>
              </v-badge>
            </v-btn>
            <template slot:expand-icon>
              <svg style="pointer-events: none; transform: rotate(90deg); position: absolute; right: 20px" width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="m 13.349538,14.548979 9.024248,9.327129 -9.064666,8.904228 c -0.456758,0.448892 -0.470557,1.180664 -0.03104,1.646452 l 4.692425,4.858866 c 0.451174,0.477732 1.206203,0.493271 1.676614,0.03448 L 34.312947,24.924838 c 0.466697,-0.455364 0.473839,-1.203429 0.01609,-1.667826 L 19.682287,8.3225147 c -0.460596,-0.468702 -1.215881,-0.469211 -1.676997,-0.0011 l -4.661419,4.5716023 c -0.510333,0.564832 -0.469429,1.187136 0.0056,1.655926 z" fill="grey" />
              </svg>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="grey lighten-2">
            <v-sheet class="px-3 pt-2" color="grey lighten-2">
              <v-fade-transition hide-on-leave leave-absolute group>
                <div v-for="(task, t) in getTasks(taskbox.id)" :key="`${t}_${task.id}`" class="my-1">
                  <task-item :task="task" :options="['status', 'worker']" />
                </div>
              </v-fade-transition>
            </v-sheet>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->
      <div  class="mb-3" v-for="(taskbox, t) in taskboxList" :key="`${t}_${taskbox.id}`">
        <v-list-item style="min-width: 45px" class="mt-1" v-if="getTasks(taskbox.id).length">
          <v-list-item-icon class="mr-5">
            <thumbnail :task="taskbox" :options="['transparent', 'hover']" :size="40" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-left">
              {{ taskbox.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-left"> info </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="(task, k) in getTasks(taskbox.id)" :key="`${k}_${task.id}`" class="my-1" flat rounded="lg" color="transparent">
          <task-item :task="task" :options="['subject', 'status', 'worker']" />
        </v-list-item>
      </div>
    </div>
    </v-fade-transition>
      <!-- <div v-show="!filtering">
        <v-list-item v-for="(task, k) in filteredTasks" :key="`${k}_${task.id}`" class="my-1" flat rounded="lg" color="transparent">
          <task-item :task="task" :options="['subject', 'status', 'worker']" />
        </v-list-item>
      </div> -->
    <empty
      v-if="isEmpty"
      :loading="filtering"
      :extraClass="'ml-3'"
      :text="' '"
      :icon="icon"
    />
  </v-card>
</template>

<script>
import Empty from '../dialogs/Empty.vue';
import TaskItem from '../lists/TaskItem.vue';

import { getStatusTypeByValue } from '../../enums/taskstate';
import Thumbnail from './Thumbnail.vue';
import { isTaskDone } from '../../store/modules/task/task';
import { mapState } from 'vuex';
import TaskFilter from '../menus/TaskFilter.vue';
import { eventBus } from '../../../main';

export default {
  name: 'TasksPannel',
  components: {
    Empty,
    TaskItem,
    Thumbnail,
    TaskFilter,
  },
  props: {
    title: String,
    subtitle: String,
    icon: String,
    height: String,
    taskList: Array,
    taskboxList: Array,
    profileId: String,
    isLoading: Boolean,
    group: Boolean,
    refreshing: Boolean,
  },
  data() {
    return {
      filtering: false,
      isMounted: false,
      profile: {},
      expanded: true,
      onlyAuditions: false,
      myAuditions: [],
      searching: false,
      search: null,
      refreshkey:0
    };
  },
  created(){
    eventBus.$on('updateTasks',()=>{
      this.refreshkey++;
    })
  },
  watch: {
    // memberTab(value) {
    //   if (value == 1) {
    //     this.filtering = true;
    //     setTimeout(() => {
    //       this.filtering = false;
    //     }, 1500);
    //   }
    // },
    filter() {
      this.filtering = true;
      setTimeout(() => {
        this.filtering = false;
      }, 1500);
    },
  },
  computed: {
    ...mapState({
      memberTab: (state) => state.app.memberTab,
      filter: (state) => state.app.taskFilter,
    }),
    isEmpty() {
      return this.taskList && this.taskList.length == 0 ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.task.status);
    },
    filteredTasks() {
      this.refreshkey;
      let searchResult = this.search ? this.taskList.filter((item) => item['title'] && item['title'].toLowerCase().includes(this.search)) : this.taskList;
      return searchResult;
    },
  },
  methods: {
    getTasks(id) {
      let searchResult =  this.search ? this.taskList.filter((t) => t.taskbox == id).filter((item) => item['title'] && item['title'].toLowerCase().includes(this.search)) : this.taskList.filter((t) => t.taskbox == id);
      return searchResult;
    },
    undoneCount(id) {
      return this.taskList.filter((t) => t.taskbox == id && !isTaskDone(t)).length;
    },
    refresh() {
      this.$listeners.refresh();
      this.filtering = true;
      setTimeout(() => {
        this.filtering = false;
      }, 1500);
    },
  },
};
</script>

<style scoped>
.v-expansion-panel-content__wrap {
  padding: 10px !important;
}

.draggableitem {
  overflow: visible;
  padding: 0px;
  margin: 3px 0px;
  border: 2px solid transparent;
}

.ghost {
  background: rgb(187, 187, 187) !important;
  background-blend-mode: multiply;
  opacity: 0.3;
  pointer-events: none;
  /* border: 2px solid #bebebe; */
}
.drag {
  cursor: grabbing !important;
  background: rgba(255, 255, 255, 1) !important;
  box-shadow: -5px 8px 15px rgba(0, 0, 0, 0.3) !important;
  position: absolute;
  transform: rotateZ(-1deg);
  opacity: 1 !important;
}
</style>
