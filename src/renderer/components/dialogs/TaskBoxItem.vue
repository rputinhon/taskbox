<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions>
      <v-row style="width: 100%">
        <v-card-title class="px-0 py-1">
                <v-spacer></v-spacer>
                <task-box-menu :taskbox="root" :options="['thumbnail', 'open', 'reset', 'delete', 'absolute', 'right']" />
          <v-list-item>
            <v-list-item-icon class="mr-6 my-auto " style="max-width: 60px">
              <svg v-if="!root.task.thumbnail" width="60" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 7.8834844,12.654189 C 4.7030622,15.50337 4.0907038,15.840062 2.8539021,18.557003 l -2.0978909,4.812611 c -0.69347361,1.591232 0.22320854,2.355498 2.0104793,1.087534 l 3.2728698,-2.321258 0.010166,13.216403 h 0.012874 c 0.044418,1.132245 1.028397,2.100345 2.8974732,2.588362 l 14.0760515,3.675208 c 3.380215,0.882555 8.321676,-0.145793 11.078974,-2.305545 l 5.217619,-4.087134 c 1.161549,-0.909822 1.699832,-1.867291 1.739432,-2.737278 l 0.01355,-6.79e-4 0.0054,-3.698434 4.985875,-4.07347 c 1.486748,-1.214828 1.862063,-3.394397 0.769771,-4.97861 L 43.700379,15.17146 c -0.625936,-0.90783 -1.593535,-1.416179 -2.58577,-1.457104 l 0.0014,-0.907872 -0.0047,0.0054 C 41.110703,11.64569 40.120858,10.6444 38.20833,10.145048 L 24.132304,6.4698031 C 15.729887,4.9270849 14.621607,8.0061843 7.8834844,12.654189 Z M 23.468919,8.3570377 35.293915,11.227076 c 1.296646,0.338548 2.195868,0.953177 2.224602,1.730353 0.02271,0.614478 -0.566937,1.242386 -1.347771,1.854 l -5.553717,4.350136 c -2.151019,1.684857 -4.28075,2.029463 -6.917721,1.340964 L 19.819296,19.489457 V 8.221779 c 1.051637,-0.2378544 2.52124,-0.1386104 3.649623,0.1352587 z M 8.3900087,19.183437 c 0,0 9.6113683,2.230904 14.6459193,3.545406 2.069715,0.540393 4.723511,0.361711 7.104093,-0.351809 -0.381249,1.076915 -0.273574,2.304113 0.41131,3.29744 l 3.146158,4.562587 c 1.092293,1.584214 3.226051,1.955334 4.712798,0.740508 l 0.385239,-0.307461 c 0.0396,1.297919 0.167044,2.338013 -1.541612,3.497145 l -5.553716,3.767577 c -2.15102,1.684869 -5.299712,1.90461 -7.936681,1.216108 L 10.136887,35.924384 C 8.8553157,35.588913 8.4282693,35.011356 8.3957671,34.242877 8.2200215,28.268139 8.3900304,19.183437 8.3900304,19.183437 Z m 19.8743803,6.40258 c -0.891648,0 -1.609331,0.723521 -1.609331,1.62242 v 9.779943 c 0,0.898899 0.717683,1.6231 1.609331,1.6231 0.891646,0 1.60933,-0.724201 1.60933,-1.6231 v -9.779943 c 0,-0.898899 -0.717684,-1.62242 -1.60933,-1.62242 z"
                  :fill="status(root.task.status).color"
                />
              </svg>
              <v-img style="border-radius: 10px" class="pa-1" v-else contain :src="root.task.thumbnail" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-left">
                <v-tooltip bottom transition="none">
                  <template v-slot:activator="{ on }">
                    <v-avatar v-on="on" size="25" color="grey">
                      <v-img v-if="getMember(root.createdBy) && getMember(root.createdBy).avatar" :src="getMember(root.createdBy).avatar" />
                      <svg v-else version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                          v-if="root.createdBy == 'offline'"
                          d="m 20.353212,30.787077 q 0,-1.935949 0.517754,-3.4667 0.517753,-1.53075 1.260618,-2.61128 0.742864,-1.080529 1.95846,-2.521236 0.967974,-1.125551 1.508239,-1.890926 0.540265,-0.787887 0.900441,-1.710839 0.382688,-0.945464 0.382688,-2.048504 v -0.02251 q 0,-1.530751 -0.765375,-2.363659 Q 25.373173,13.296003 24,13.296003 q -1.350663,0 -2.116038,0.945463 -0.742864,0.922952 -0.765375,2.61128 v 0.02251 h -6.393134 v -0.02251 q 0.112555,-2.971457 1.238107,-5.064983 1.125552,-2.1160371 3.151545,-3.2190778 2.048504,-1.1030408 4.862384,-1.1030408 2.926434,0 5.01996,0.9904856 2.093527,0.9904855 3.174056,2.881413 1.103041,1.868415 1.103041,4.524718 v 0.02251 q 0,1.733349 -0.495243,3.129034 -0.472731,1.395684 -1.193085,2.453702 -0.697842,1.035508 -1.868416,2.408681 -1.10304,1.328151 -1.733349,2.228593 -0.607798,0.900441 -1.035508,2.093526 -0.42771,1.170574 -0.42771,2.588769 z m 0.02251,3.579255 h 6.168024 v 6.168023 h -6.168024 z"
                          fill="white"
                        />
                        <path v-else transform="scale(.26) translate(0 0)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                      </svg>
                    </v-avatar>
                  </template>
                  created by {{ getMember(root.createdBy) && getMember(root.createdBy).name }}
                </v-tooltip>
                {{ root.task.title }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-left"> task: {{ root.task.subject }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <due-control :entity="root" />
        </v-card-title>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <draggable v-model="priority" :disabled="false" :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @click.stop>
        <v-card hover outlined :ripple="false" v-for="(entity, t) in filteredList(root.tasks)" :key="`${t}_${entity.id}`" class="ma-1" style="border-radius: 5px" @click.stop>
          <task-item :entity="entity" :analisis="null" />
        </v-card>
        <v-card hover outlined :ripple="false" v-for="(taskbox, tb) in filteredList(root.taskboxes)" :key="`${tb}_${root.id}`" class="pa-1 ma-1" style="border-radius: 5px" @click.stop>
          <v-card-title class="px-1 py-0 my-0">
            <v-list-item style="max-height: 20px; min-height: 20px">
              <v-list-item-icon class="mr-2 my-0 mt-3" style="max-width: 30px">
                <svg v-if="!taskbox.task.thumbnail" width="35" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 7.8834844,12.654189 C 4.7030622,15.50337 4.0907038,15.840062 2.8539021,18.557003 l -2.0978909,4.812611 c -0.69347361,1.591232 0.22320854,2.355498 2.0104793,1.087534 l 3.2728698,-2.321258 0.010166,13.216403 h 0.012874 c 0.044418,1.132245 1.028397,2.100345 2.8974732,2.588362 l 14.0760515,3.675208 c 3.380215,0.882555 8.321676,-0.145793 11.078974,-2.305545 l 5.217619,-4.087134 c 1.161549,-0.909822 1.699832,-1.867291 1.739432,-2.737278 l 0.01355,-6.79e-4 0.0054,-3.698434 4.985875,-4.07347 c 1.486748,-1.214828 1.862063,-3.394397 0.769771,-4.97861 L 43.700379,15.17146 c -0.625936,-0.90783 -1.593535,-1.416179 -2.58577,-1.457104 l 0.0014,-0.907872 -0.0047,0.0054 C 41.110703,11.64569 40.120858,10.6444 38.20833,10.145048 L 24.132304,6.4698031 C 15.729887,4.9270849 14.621607,8.0061843 7.8834844,12.654189 Z M 23.468919,8.3570377 35.293915,11.227076 c 1.296646,0.338548 2.195868,0.953177 2.224602,1.730353 0.02271,0.614478 -0.566937,1.242386 -1.347771,1.854 l -5.553717,4.350136 c -2.151019,1.684857 -4.28075,2.029463 -6.917721,1.340964 L 19.819296,19.489457 V 8.221779 c 1.051637,-0.2378544 2.52124,-0.1386104 3.649623,0.1352587 z M 8.3900087,19.183437 c 0,0 9.6113683,2.230904 14.6459193,3.545406 2.069715,0.540393 4.723511,0.361711 7.104093,-0.351809 -0.381249,1.076915 -0.273574,2.304113 0.41131,3.29744 l 3.146158,4.562587 c 1.092293,1.584214 3.226051,1.955334 4.712798,0.740508 l 0.385239,-0.307461 c 0.0396,1.297919 0.167044,2.338013 -1.541612,3.497145 l -5.553716,3.767577 c -2.15102,1.684869 -5.299712,1.90461 -7.936681,1.216108 L 10.136887,35.924384 C 8.8553157,35.588913 8.4282693,35.011356 8.3957671,34.242877 8.2200215,28.268139 8.3900304,19.183437 8.3900304,19.183437 Z m 19.8743803,6.40258 c -0.891648,0 -1.609331,0.723521 -1.609331,1.62242 v 9.779943 c 0,0.898899 0.717683,1.6231 1.609331,1.6231 0.891646,0 1.60933,-0.724201 1.60933,-1.6231 v -9.779943 c 0,-0.898899 -0.717684,-1.62242 -1.60933,-1.62242 z"
                    :fill="status(taskbox.task.status).color"
                  />
                </svg>
                <v-img style="border-radius: 10px" class="pa-1" v-else contain :src="taskbox.task.thumbnail" />
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title class="text-left mt-7">
                  {{ taskbox.task.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-btn absolute right top :outlined="!isOpen(taskbox.id)" class="mr-10 mt-1" x-small color="primary" @click.stop="openRoot(taskbox.id)"> open </v-btn>
            <task-box-menu  :taskbox="root" :options="['thumbnail', 'open', 'reset', 'delete', 'absolute', 'right']" />
            <due-control :entity="taskbox" />
          </v-card-title>
          <v-sheet class="ma-2">
            <draggable v-model="priority" :disabled="false" :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @change="updateTaskOrder()">
              <v-card v-for="(entity, n) in filteredList(taskbox.tasks)" :key="n" rounded="md" class="my-1" width="100%" hover>
                <v-slide-x-transition>
                  <task-item :entity="entity" :analisis="null" />
                </v-slide-x-transition>
              </v-card>
            </draggable>
          </v-sheet>
        </v-card>
      </draggable>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Draggable from 'vuedraggable';
import TaskItem from '../lists/TaskItem.vue';

import { getStatusTypeByValue } from '../../enums/taskstate';
import { mapState } from 'vuex';
import DueControl from './DueControl.vue';
import TaskBoxMenu from '../menus/TaskBoxMenu.vue';
export default {
  name: 'TaskBoxItem',
  props: { root: Object },
  components: {
    TaskItem,
    Draggable,
    DueControl,
    TaskBoxMenu,
  },
  data(){
    return{
      priority:[]
    }
  },
  mounted(){
    this.priority = this.root;
  },
  computed: {
    ...mapState({
      members: (state) => state.user.members,
    }),
  },
  methods: {
    getMember(id) {
      return this.members.find((m) => m.member == id);
    },
    status(s) {
      return getStatusTypeByValue(s);
    },
    filteredList(list) {
      if (!list) return [];
      return list
        .filter((t) => t.task.title.toLowerCase().includes(this.search))
        .sort(function (a, b) {
          if (a.task.title > b.task.title) return 1;
          if (a.task.title < b.task.title) return -1;
          return 0;
        });
    },
  },
};
</script>
