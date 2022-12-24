<template>
  <draggable v-model="getTasks" :disabled="isDisabled" :force-fallback="true" drag-Class="drag" ghost-Class="ghost" @change="updateTaskOrder()">
    <v-list v-for="(task, n) in tasks" :key="n" class="draggableitem">
      <v-list-item class="pa-0 ma-0">
        <v-list-item-icon v-if="analyse" class="mx-0 pl-2 pr-3 my-auto">
          <v-list-item-title class="text-h6">
            {{n}}
          </v-list-item-title>
        </v-list-item-icon>
        <v-list-item-content class="py-0">
          <task-item :node="task" :taskBoxDisabled="isDisabled" :analyse="analyse" :analisys="getAnalisys(n)" />
        </v-list-item-content>
        <v-list-item-icon v-if="controlFlowing" :class="!flowing(task) && 'ml-3'" class="mx-0 px-0 my-0">
          <flow-task-menu :node="task" :options="['tile']" />
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </draggable>
</template>

<script>
import TaskItem from '../lists/TaskItem.vue';
import FlowTaskMenu from '../menus/FlowTaskMenu.vue';
import Draggable from 'vuedraggable';

import { NodeView } from '../../libs/nodeview';
import { eventBus } from '../../../main';
import { mapState } from 'vuex';

import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import moment from 'moment';

export default {
  name: 'TaskBoxItem',
  props: { taskbox: Object, tasks: Array , analyse:Boolean ,analisys:Array},
  components: {
    TaskItem,
    Draggable,
    FlowTaskMenu,
  },
  data() {
    return {
      draggableNodeList: [],
      dragging:false,
    };
  },
  created() {
    this.draggableNodeList = this.tasks.map((n) => {
      return n.id;
    });
    this.updateTaskOrder();
  },
  watch: {
    tasks(value) {
      this.draggableNodeList = value.map((n) => {
        return n.id;
      });
    },
  },
  computed: {
    ...mapState({
      userProfile: (state) => state.user.profile,
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
    }),
    getTasks:{
      get(){
        return this.tasks;
      },
      set(){
        this.$store.commit('taskbox/UPDATE_TASK_ORDER', this.tasks);
      }
    },
    controlFlowing() {
      if (!this.profile && !this.userProfile.appSettings[2]) return false;
      return this.userProfile.appSettings[2].value || false;
    },
    isDisabled() {
      return this.status.text == 'Reproved' || this.status.text == 'Paused' || this.forcedStatus ? true : false;
    },
    forcedStatus() {
      return this.taskbox.data.task.forceStatus;
    },
    taskCount() {
      if (!this.taskBoxInfo) return;
      return this.taskBoxInfo[this.taskbox.id].Count;
    },
    status() {
      return getStatusTypeByValue(this.taskbox.data.task.status);
    },
    startedDate() {
      if (!this.taskbox.data.task.due.startedAt) return '';
      return moment(this.taskbox.data.task.due.startedAt).format('DD/MM/YYYY');
    },
    completedDate() {
      if (!this.taskbox.data.task.due.completedAt) return '';
      return moment(this.taskbox.data.task.due.completedAt).format('DD/MM/YYYY');
    },
    taskDone() {
      return this.status.value == taskstate.DONE.value;
    },
  },
  methods: {
    getAnalisys(n){
      if(!this.analisys)return null;
      return this.analisys[n];
    },
    setNotTaskable(node) {
      this.$store.commit('taskbox/resetTask', node.data.task);
      this.$store.commit('taskbox/setNotTaskable', node);
      this.$store.commit('taskbox/PROCESS_TASKBOX_STATUS', { id: node.data.taskbox, recursive: true });
    },
    toggleFlowing(node) {
      this.$store.commit('taskbox/toggleDataFlowing', node);
    },
    taskStatus(status) {
      return getStatusTypeByValue(status || 0);
    },
    flowing(node) {
      return node.data.flowingData.flowing;
    },
    changeStatus(newStatus) {
      eventBus.$emit('confirmChangeStatus', [this.taskbox, newStatus]);
    },
    openTaskBox() {
      eventBus.$emit('openTaskBox', this.taskbox, null);
    },
    updateTaskOrder() {
      this.$store.commit('taskbox/UPDATE_TASK_ORDER', { nodes: this.tasks, orderedData: this.draggableNodeList });
      NodeView.saveTaskBox();
    },
  },
};
</script>

<style>
.hashleft {
  border-left: 3px dotted #acacac !important;
}

.taskbox {
  border-radius: 12px !important;
  border: 2px solid;
}

.disabledBut {
  opacity: 0.6 !important;
}

.disabledByStatus {
  pointer-events: none !important;
  cursor: auto !important;
  opacity: 0.4 !important;
}
.statuslabel {
  font-size: 11px;
  margin-right: 10px;
}
.v-expansion-panel-content__wrap {
  padding: 0px !important;
}
</style>
