<template>
  <v-app-bar height="45px" bottom style="z-index: 1" absolute class="mx-0 px-3" color="transparent">
    <v-list-item>
    <v-slider :disabled="isDisabled" :color="status.color" style="width: 100%" class="ml-3" inverse-label  :label="`${node.data.task.progress}%`" hide-details="true" v-model="progress" :thumb-label="true" @mouseup="updateProgress()"> </v-slider>
    </v-list-item>
  </v-app-bar>
</template>

<script>
import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { NodeView } from '../../libs/nodeview';
import store from '../../store';

export default {
  name: 'TaskProgressBar',
  props: { hideItems: [], node: {}, status:{} },
  data() {
    return {
      statusTypes: [],
      loading: true,
      updatedprogress:0
    };
  },
  computed: {
    isDisabled() {
      if (!this.status) return;
      return !this.started || this.canceled || this.paused  || this.taskDone ? true : false;
    },
    started() {
      if (!this.status) return;
      return this.status.value !== taskstate.UNSTARTED.value ? true : false;
    },
    paused() {
      if (!this.status) return;
      return this.status.value == taskstate.PAUSED.value ? true : false;
    },
    canceled() {
      if (!this.status) return;
      return this.status.value == taskstate.REPROVED.value ? true : false;
    },
    taskDone() {
      if (!this.status) return;
      return this.status.value == taskstate.DONE.value ? true : false;
    },
    progress: {
      get() {
        return this.node.data.task.progress;
      },
      set(value) {
        this.updatedprogress = value;
      },
    },
  },
  methods: {
    getIconType(t) {
      return getStatusTypeByValue(t).icon;
    },
    async updateProgress() {
       store.commit('taskbox/UPDATE_TASK_PROGRESS', { task: this.node.data.task, value: this.updatedprogress,processTotal:true });
       
      await NodeView.saveTaskBox();
    },
    confirmChange(status) {
      eventBus.$emit('confirmChangeStatus', [this.node, status]);
    },
  },
};
</script>
