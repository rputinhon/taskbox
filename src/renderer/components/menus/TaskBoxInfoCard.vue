<template>
  <RULE :rule="rules.EDIT">
    <v-card flat class="px-4 windowbar-button overflow-hidden" color="transparent" v-if="taskBoxInfo && currentTaskBox">
      <v-card-title class="text-center mx-auto py-1 my-1">
        <small class="text-caption grey--text mr-3">Recent Taskbox:</small>
      </v-card-title>
      <v-row class="pa-0">
        <v-col cols="7">
          <v-card-subtitle class="text-center mx-auto py-1">
            {{ currentTaskBox.task.title }}
          </v-card-subtitle>
          <v-tooltip transition="none" bottom>
            <template v-slot:activator="{ on: onTooltip }">
              <v-card v-on="{ ...onTooltip }" class="mx-auto mt-2 my-auto overflow-hidden" color="transparent" hover rounded="lg" width="200" height="200" @mouseenter="hovering = true" @mouseleave="hovering = false" @click="open()">
                <v-img v-if="currentTaskBox.task.thumbnail" contain :src="currentTaskBox.task.thumbnail" style="position: absolute" />
                <svg v-else version="1.1" class="mt-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style="overflow: visible; max-height: 180px">
                  <path d="M 18.255593,4.2834353 5.4858191,13.228038 5.4052874,38.14297 29.474115,43.140312 41.712501,35.18536 V 9.5867362 Z" fill="white" />
                  <path
                    d="m 21.267244,3.3953828 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.7025703,11.051801 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 l 16.1962096,4.194657 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 43.989601,9.6630499 42.85062,8.5202168 40.650024,7.9502873 L 24.453814,3.7556304 C 23.481477,3.5038063 22.396782,3.3885362 21.267278,3.3954195 Z m 0.185733,1.9699794 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 L 30.231199,7.2824816 15.800406,17.961068 9.0661396,16.130973 C 7.5686211,15.743133 6.7031862,15.014608 6.5056849,14.145917 6.6526004,13.462056 7.1633632,12.734524 8.0572387,12.040013 L 13.993817,7.6989324 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.789461,2.1790905 7.381327,2.085813 c 1.49195,0.3863973 2.35794,1.1105083 2.559676,1.9749193 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.968483,-1.770438 z m 10.121395,8.0329293 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 8.9085936,37.553775 C 7.4339913,37.170888 6.5712127,36.459768 6.3567137,35.608484 6.3457757,35.294275 6.3348777,34.980065 6.3239797,34.665856 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759406,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 25.827441 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z"
                    :fill="status.color"
                  />
                  <path transform="scale(.26458) translate(40 90)" :d="status.icon" :fill="status.color" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-card>
            </template>
            click to open
          </v-tooltip>
          <v-list-item-subtitle class="my-4 mx-auto" style="width: 250px">
            <task-status-menu :entity="currentTaskBox" :options="['fab', 'icon', 'flat']" />
            {{ status.text }}
          </v-list-item-subtitle>
          <v-list-item class="mt-3">
            <task-subject :entity="currentTaskBox" :options="['icon']" />
          </v-list-item>
        </v-col>
        <v-col cols="5">
          <v-simple-table dense style="background-color: transparent">
            <tbody>
              <tr v-for="(item, i) in taskBoxInfo" :key="i" v-show="item.name">
                <td class="mx-0 px-0" style="height: 18px; width: 20px; border: none !important">
                  <svg width="23" version="1.1" viewBox="0 -7 48 52" xmlns="http://www.w3.org/2000/svg">
                    <path y="1" :d="item.icon" :fill="item.color" style="pointer-events: none" />
                  </svg>
                </td>
                <td style="height: 18px; width: 100%!important; border: none !important">{{ item.name }}</td>
                <td style="height: 18px; width: 20px; border: none !important" class="mx-0 px-0">{{ item.value }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>
  </RULE>
</template>

<script>
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import RULE from '../navigation/Rule.vue';
import RULES from '../../enums/rules';
import { mapState } from 'vuex';
import _ from 'lodash';
import { taskboxRepository } from '../../store/modules/taskbox/taskboxRepository';
import TaskSubject from '../lists/TaskSubject.vue';
import TaskStatusMenu from './TaskStatusMenu.vue';

export default {
  components: { RULE, TaskSubject, TaskStatusMenu },
  props: { taskbox: Object },
  name: 'TaskBoxInfoCard',
  data() {
    return {
      hasChanges: false,
      hovering: false,
      working: false,
      info: null,
    };
  },
  mounted() {
    if (this.taskbox) this.getInfo(this.taskbox);
  },
  watch: {
    taskbox(value) {
      if (value) this.getInfo(value);
      else this.info = null;
    },
  },
  computed: {
    ...mapState({
      workingTaskBox: (state) => _.cloneDeep(state.taskbox.currentTaskBox),
      currentTaskBoxInfo: (state) => state.taskbox.taskBoxInfo,
      mytasks: (state) => _.cloneDeep(state.user.mytasks),
      root: (state) => _.cloneDeep(state.taskbox.root),
      apiState: (state) => state.apiState,
    }),
    currentTaskBox() {
      return this.taskbox ? this.taskbox : this.workingTaskBox;
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.task.status);
    },
    
    taskBoxInfo() {
      return this.info ? this.info : this.currentTaskBoxInfo;
    },
    rules() {
      return RULES;
    },
    statustype() {
      return taskstate;
    },
  },
  methods: {
    open() {
      this.$store.dispatch('taskbox/FETCH_ROOT', this.currentTaskBox.id);
    },
    async getInfo(value) {
      taskboxRepository.getTasks(value.children).then((tasks) => {
        taskboxRepository.getTaskBoxInfo(tasks).then((info) => {
          this.info = info;
        });
      });
    },
  },
};
</script>
