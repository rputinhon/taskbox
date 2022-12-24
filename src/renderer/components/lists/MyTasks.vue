<template>
  <v-sheet class="mx-0 pa-5 mytasks" :style="`width:100%;max-height:calc(100vh - 60px)`">
    <v-layout align-baseline justify-start column fill-height>
      <draggable :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @click.stop>
        <v-card v-for="c in 2" :key="c" hover rounded="lg" class="mb-3  pa-3 pt-2 windowbar-button" width="500px">
          <v-card-title v-if="!searching" class="my-auto pl-0 py-0 mb-3" style="height: 35px">
            <v-avatar left size="30" class="mr-2" color="grey">
              <v-img v-if="profile.profilePicture" :src="profile.profilePicture" />
              <svg v-else width="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
              </svg>
            </v-avatar>
            <v-spacer class="text-subtitle-2"> {{profile.username}} </v-spacer>
            <v-tooltip bottom transition="none">
              <template v-slot:activator="{ on }">
                <v-btn right v-on="on" fab icon x-small @click="searching = true" class="mt-1">
                  <svg style="pointer-events: none" width="21" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="#1070ff" />
                  </svg>
                </v-btn>
              </template>
              search
            </v-tooltip>
          </v-card-title>
          <v-card-title v-if="searching" class="my-auto py-0 mb-3" style="height: 35px">
            <v-text-field class="my-auto px-0 mt-1" v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
              <template v-slot:append class="mx-0" style="min-width: 40px">
                <v-btn color="primary" rounded x-small @click="searching = false"> close </v-btn>
              </template>
              <v-tooltip bottom transition="none">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" fab icon x-small @click="updateList()">
                    <svg style="pointer-events: none" width="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <path
                        d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                        fill="grey"
                      />
                    </svg>
                  </v-btn>
                </template>
                refresh
              </v-tooltip>
            </v-text-field>
          </v-card-title>
          <div v-show="!loading" key="0" class="tasks">
            <v-fade-transition hide-on-leave leave-absolute style="display: block">
              <draggable v-model="priority" :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @click.stop>
                <v-card v-for="(entity, t) in filteredTasks" :key="`${t}_${entity.id}`" class="my-1" flat rounded="lg" color="transparent">
                  <task-item v-if="!filterOnlyOpenTasks" :priority="t + 1" :entity="entity" :hide="['reviews']" />
                  <open-task-item v-else :entity="entity" :hide="['reviews']" />
                </v-card>
              </draggable>
            </v-fade-transition>
          </div>
          <div v-show="loading" key="1">
            <v-card v-for="t in filteredTasks.length || 1" :loading="loading" :key="t + 'empty'" class="my-1 text-right" height="50px" outlined flat rounded="lg" style="opacity: 0.5">
              <svg class="mt-2" width="50" version="1.1" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="m 35.589844,9.5800781 c -0.573351,0.018314 -1.09936,0.2964182 -1.47461,0.6855469 L 19.728516,25.017578 13.339844,18.648437 C 12.507606,17.820892 11.137271,17.809745 10.292969,18.625 l -3.9433596,3.802734 h -0.00195 c -0.8651932,0.836135 -0.8773048,2.249903 -0.027344,3.101563 v 0.002 L 18.208984,37.416016 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013672,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815986 -0.98915,-0.6237833 -1.5625,-0.6054689 z m 0.06445,1.9980469 c -0.0039,1.25e-4 0.03782,-0.01158 0.171875,0.105469 0.0018,0.0016 1.32e-4,3.45e-4 0.002,0.002 l 4.058594,3.912109 c 0.0798,0.07683 0.08021,0.171302 0.002,0.25 v 0.002 L 19.873047,36 c -0.07744,0.07811 -0.172347,0.07971 -0.25,0.002 V 36 L 7.7363281,24.117187 c -0.077774,-0.07793 -0.076039,-0.173169 0.00195,-0.25 l 3.9433598,-3.802734 c 0.0771,-0.07444 0.172045,-0.07362 0.248047,0.002 l 7.818359,7.796875 15.804687,-16.207031 0.002,-0.002 c 0.08804,-0.0913 0.103575,-0.0763 0.09961,-0.07617 z"
                  fill="grey"
                  opacity="0.6"
                />
              </svg>
            </v-card>
          </div>

          <empty
            v-show="isEmpty"
            :loading="loading"
            :text="'no tasks'"
            :icon="'m 35.589844,9.5800781 c -0.573351,0.018314 -1.09936,0.2964182 -1.47461,0.6855469 L 19.728516,25.017578 13.339844,18.648437 C 12.507606,17.820892 11.137271,17.809745 10.292969,18.625 l -3.9433596,3.802734 h -0.00195 c -0.8651932,0.836135 -0.8773048,2.249903 -0.027344,3.101563 v 0.002 L 18.208984,37.416016 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013672,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815986 -0.98915,-0.6237833 -1.5625,-0.6054689 z m 0.06445,1.9980469 c -0.0039,1.25e-4 0.03782,-0.01158 0.171875,0.105469 0.0018,0.0016 1.32e-4,3.45e-4 0.002,0.002 l 4.058594,3.912109 c 0.0798,0.07683 0.08021,0.171302 0.002,0.25 v 0.002 L 19.873047,36 c -0.07744,0.07811 -0.172347,0.07971 -0.25,0.002 V 36 L 7.7363281,24.117187 c -0.077774,-0.07793 -0.076039,-0.173169 0.00195,-0.25 l 3.9433598,-3.802734 c 0.0771,-0.07444 0.172045,-0.07362 0.248047,0.002 l 7.818359,7.796875 15.804687,-16.207031 0.002,-0.002 c 0.08804,-0.0913 0.103575,-0.0763 0.09961,-0.07617 z'"
          />
        </v-card>
      </draggable>
    </v-layout>
  </v-sheet>
</template>

<script>
import Empty from './Empty.vue';
import Draggable from 'vuedraggable';
import OpenTaskItem from '../lists/OpenTaskItem.vue';

import { mapState } from 'vuex';
import _ from 'lodash';
import TaskItem from '../lists/TaskItem.vue';
import { getStatusTypeByValue } from '../../enums/taskstate';

export default {
  name: 'MyTasks',
  components: {
    Draggable,
    Empty,
    OpenTaskItem,
    TaskItem,
  },
  props: {
    isTasksTab: Boolean,
  },
  data() {
    return {
      sortModel: Number,
      filter: [],
      noFilter: [],
      priority: [],
      filterByTaskBox: false,
      filterOnlyOpenTasks: false,
      search: '',
      loading: false,
      refreshig: false,
      showTasks: false,
      searching: false,
      templates: Array,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.priority = this.filteredTasks.map((t) => t.id);
    });
  },
  watch: {
    activeTasks() {
      this.$nextTick(() => {
        this.loading = true;
        this.priority = this.filteredTasks.map((t) => t.id);
        setTimeout(() => {
          this.loading = false;
        }, 300);
      });
    },
  },
  computed: {
    ...mapState({
      activeTasks: (state) => _.cloneDeep(Object.values(state.taskbox.myTasks)),
      profile: (state) => state.user.profile,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    filteredTasks() {
      let p = this.priority;
      return this.activeTasks
        .filter((t) => t.task.title.toLowerCase().includes(this.search))
        .sort(function (a, b) {
          return p.indexOf(a.id) - p.indexOf(b.id);
        });
    },
    isEmpty() {
      return this.filteredTasks.length == 0 ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.task.status);
    },
  },
  methods: {},
};
</script>

<style scoped>
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
