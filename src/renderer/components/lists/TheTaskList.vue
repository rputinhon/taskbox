<template>
  <v-sheet color="transparent" class="px-6">
    <!-- <v-app-bar :absolute="options.includes('absolute')" clipped-left elevation="3" height="40px" max-height="40px" class="px-3" flat color="transparent" style="z-index: 10">
      <v-progress-linear fixed height="100%" :color="status.color" :buffer-value="taskBoxInfo ? taskBoxInfo.Progress : 0" style="pointer-events: none; z-index: 3">
        <v-list-item-subtitle>
          <span class="text-caption" v-if="taskBoxInfo">
            {{ taskBoxInfo.DoneCount }} of {{ taskBoxInfo.Count }} task{{ taskBoxInfo.Count != 1 ? 's' : '' }} Done <span style="font-size: 10px" v-if="taskBoxInfo.Progress">({{ taskBoxInfo.Progress }}%)</span>
          </span>
        </v-list-item-subtitle>
      </v-progress-linear>
      <v-btn v-if="!hideCloseButton" x-small fab icon @click="$emit('close')">
        <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="grey" />
        </svg>
      </v-btn>
      <nav-menu :task="task" :options="['home', 'parent', 'back']" />
      <v-spacer></v-spacer>

     
      <task-filter :taskable="onlyTaskable" :filterModel="taskFilter" @updateFilter="updateFilter" @updateFilterTaskable="updateFilterTaskable" />
      <flowing-menu v-if="controlFlowing" :taskbox="taskbox" />
    </v-app-bar> -->

    <span class="tasklist pa-2">
      <analisys v-if="false" />
      <draggable v-model="taskOrder" :disabled="false" :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @change="updateTaskOrder()">
        <v-card hover rounded="lg" v-for="(entity, n) in filteredTasks" :key="n" class="my-1">
          <v-list-item class="pa-0 ma-0">
            <v-list-item-icon v-if="showAnalisys" class="mx-0 pl-2 pr-4 my-auto">
              <v-list-item-title class="text-h6 grey--text">
                {{ n }}
              </v-list-item-title>
            </v-list-item-icon>
            <v-list-item-content class="py-0">
              <task-item :entity="entity" :analisis="null" :hide="['reviews']" />
            </v-list-item-content>
            <v-list-item-icon v-if="controlFlowing" :class="!flowing(task) && 'ml-3'" class="mx-0 px-0 my-0">
              <flow-task-menu :node="entity.node" :options="['tile']" />
            </v-list-item-icon>
          </v-list-item>
        </v-card>
      </draggable>
    </span>
    <empty v-show="isEmpty" :icon="'m 38.137,10.842319 c -0.4592,-0.13324 -0.95335,0.0247 -1.2502,0.39956 l -0.02725,-0.13016 -15.096,15.48 -7.1044,-7.0832 c -0.45412,-0.45156 -1.186,-0.45694 -1.6467,-0.01209 l -3.9442,3.8019 c -0.47251,0.45664 -0.47936,1.2118 -0.015188,1.6769 l 11.887,11.884 c 0.46077,0.46136 1.2088,0.45996 1.6679,-0.0031 l 20.015,-20.151 c 0.46337,-0.46596 0.45519,-1.2212 -0.01816,-1.6769 l -4.0895,-3.9412 -0.03329,0.04843 c -0.09491,-0.11931 -0.21211,-0.21904 -0.34509,-0.29362 z'" :text="'no tasks'" :loading="false" />
  </v-sheet>
</template>

<script>
import Analisys from '../navigation/Analisys.vue';
import Draggable from 'vuedraggable';
import Empty from '../dialogs/Empty.vue';
// import FlowingMenu from '../menus/FlowingMenu.vue';
import FlowTaskMenu from '../menus/FlowTaskMenu.vue';
// import TaskFilter from '../menus/TaskFilter.vue';
import TaskItem from '../lists/TaskItem.vue';

import { eventBus } from '../../../main';
import { mapState } from 'vuex';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import _ from 'lodash';
// import NavMenu from '../navigation/NavMenu.vue';
// import RULE from '../navigation/Rule.vue';
import RULES from '../../enums/rules';
import { taskboxRepository } from '../../store/modules/taskbox/taskboxRepository';

export default {
  name: 'TaskList',
  props: {
    entity: Object,
    options: Array,
  },
  components: {
    Analisys,
    Draggable,
    Empty,
    // FlowingMenu,
    FlowTaskMenu,
    // NavMenu,
    TaskItem,
    // TaskFilter,
    // RULE,
  },
  data() {
    return {
      taskFilter: 6,
      onlyTaskable: true,
      taskOrder: [],
      confirmingStatus: false,
      taskboxToChangeStatus: null,
      currentChildren: [],
      newStatus: {},
      analisisType: 'progress',
      showAnalisys: false,
    };
  },
  mounted() {
    if (this.profile.remember.taskFilter) this.taskFilter = this.profile.remember.taskFilter;
    if (this.profile.remember.onlyTaskable) this.onlyTaskable = this.profile.remember.onlyTaskable;

    if (!this.children) this.getTasks();
  },
  watch: {
    showAnalisys(value) {
      if (!value) this.analisys = null;
    },
  },
  computed: {
    ...mapState({
      appSettings: (state) => state.app.appSettings,
      project: (state) => state.taskbox.project,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      children: (state) => state.taskbox.children,
      profile: (state) => _.cloneDeep(state.user.profile),
      tasks: (state) => _.cloneDeep(state.task.children),
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
    }),
    controlFlowing() {
      if (!this.appSettings[2]) return false;
      return this.appSettings[2].value || false;
    },
    isEmpty() {
      return this.filteredTasks.length == 0 ? true : false;
    },
    taskboxFlowing() {
      if (!this.task) return true;
      return this.task.data.flowingData.flowing;
    },
    dataReady() {
      return this.taskbox && this.task ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    statusTypes() {
      return taskstate;
    },
    rules() {
      return RULES;
    },
    filteredTasks() {
      return this.children || this.currentChildren;
      //   .filter((entity) => {
      //     return this.taskFilter < 6 ? entity.task.status == this.taskFilter : entity;
      //   })
      //   .filter((entity) => (this.onlyTaskable ? entity.task.taskable == true : entity));
      // // .sort(function (a, b) {
      // //   if (a.task.priority < b.task.priority) return -1;
      // //   if (a.task.priority > b.task.priority) return 1;
      // //   return 0;
      // // });

      // return taskList;
    },
  },
  methods: {
    async getTasks() {
      taskboxRepository.getTasks(this.entity.children).then((response) => {
        this.taskOrder = Object.values(response);
        eventBus.$emit('previewLoaded', false);
        return (this.currentChildren = Object.values(this.taskOrder || this.children));
      });
    },
    flowing(task) {
      return task.data.flowingData.flowing;
    },
    updateAnalisys(value) {
      this.analisisType = value;
    },
    closeConfirmStatus() {
      this.confirmingStatus = false;
      this.newStatus = {};
      this.taskboxToChangeStatus = null;
    },
    updateFilter(value) {
      this.taskFilter = value;
      this.$store.commit('user/UPDATE_SETTINGS', { taskFilter: this.taskFilter });
    },
    updateFilterTaskable(value) {
      this.onlyTaskable = value;
      this.$store.commit('user/UPDATE_SETTINGS', { onlyTaskable: this.onlyTaskable });
    },
    updateTaskOrder() {
      // let count = 0;
      // this.tasks.forEach(async (task) => {
      //   await this.$store.dispatch('task/UPDATE_TASK', { id: task.id, toUpdate: { priority: count } });
      //   count++;
      // });
    },
  },
};
</script>

<style>
.tasklist {
  max-height: 100% !important;
  padding-top: 10px !important;
  overflow-y: auto;
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
