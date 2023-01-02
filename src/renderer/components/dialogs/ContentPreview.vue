<template>
  <div>
    <v-dialog :scrollable="true" v-if="dataReady" :fullscreen="fullscreen" overlay-opacity="0.9" width="900px" style="overflow: hidden !important; min-width: auto" max-width="80vw" v-model="dataReady" persistent light>
      <v-card height="630px" class="overflow-hidden">
        <preview-main-bar :task="auditingTask || previewingTask" :disabled="false" :allowfullscreen="allowfullscreen" :fullscreen="fullscreen" @toggleFullScreen="fullscreen = !fullscreen" @maximize="fullscreen = !fullscreen" @showReviews="showReviews = true" />
        <!-- <v-card-text class="ma-0 px-0 py-0"  style="height:100%;overflow-y:scroll;background-color:#eeeeee!important" :style="!fullscreen && 'min-height: 610px;max-height: 640px;max-width:100%'"> -->
          <v-fade-transition leave-absolute hide-on-leave>
            <component v-if="dataReady" v-show="!loading" v-bind:is="componentType" :showToolsBar="true" :userProfile="userProfile" :fullscreen="fullscreen" :status="status" @toggleMessages="showReviews = !showReviews" @ShowReviewDialog="review = true"> </component>
          </v-fade-transition>
          <v-row justify="center" v-show="loading" align="center" style="width: 100%; height: 100%; position: absolute" class="my-0 py-0">
            <v-progress-circular color="primary" indeterminate />
          </v-row>
        <!-- </v-card-text> -->
        <task-chat />
      </v-card>
    </v-dialog>
    <v-fade-transition v-if="dataReady" leave-absolute hide-on-leave group>
      <v-navigation-drawer key="0" v-if="!fullscreen" class="ml-2 pa-0 px-1" style="z-index: 1000; top: 120px; overflow-y: auto !important" height="calc(100vh - 200px)" fixed permanent color="transparent" stateless width="auto" left>
        <v-list class="py-0 px-0" v-for="(input, i) in taskInputs" :key="i">
          <v-list-item>
            <io-item :task="input" :type="'input'" :icon="isAudition ? auditStatus(input.id).icon : null" :iconColor="isAudition ? auditStatus(input.id).color : null" />
            <v-list-item-icon class="mx-0 px-0" v-if="!isTaskbox && !isAudition">
              <v-tooltip transition="none" bottom z-index="1010">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="tooltip" fab x-small class="ml-1 mt-1" :outlined="!connected(input.id)" height="11" width="11" :color="!connected(input.id) ? 'white' : 'accent'" @click.stop="useExternalValue(input.value)" />
                </template>
                Click to Use Input
              </v-tooltip>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-navigation-drawer key="1" v-if="!fullscreen && !isAudition" class="mr-2 pa-0 px-1" expand-on-hover mini-variant-width="35px" style="z-index: 1000; top: 120px; overflow-y: auto !important" height="calc(100vh - 200px)" fixed permanent color="transparent" stateless width="100" right>
        <v-list class="py-1 px-0" style="direction: ltr" v-for="(output, i) in taskOutputs" :key="i">
          <io-item :task="output" :type="'output'" />
        </v-list>
      </v-navigation-drawer>
    </v-fade-transition>
  </div>
</template>

<script>
import IoItem from '../lists/IOItem.vue';
import PreviewMainBar from './PreviewMainBar.vue';
import TaskChat from '../forms/TaskChat.vue';

import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import _ from 'lodash';

import { mapState } from 'vuex';
import { taskRepository } from '../../store/modules/task/taskRepository';
import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';

export default {
  name: 'contentPreview',
  components: {
    PreviewMainBar,
    IoItem,
    TaskChat,
  },
  data: () => ({
    loading: true,
    allowfullscreen: true,
    fullscreen: false,
    showReviews: false,
    componentType: null,
  }),
  created() {
    this.loading = true;
    eventBus.$on('previewLoaded', (value) => {
      this.loading = value;
    });
  },
  mounted() {
    this.loading = true;
  },
  watch: {
    previewingTask(value) {
      if (value !== null) {
        this.loading = true;
        this.getComponentType(value.taskType);
        this.hovering = false;
        this.checkDisabled();
      }
      this.preview = value;
    },
    status(s) {
      if (s.value == taskstate.REVIEWING.value) this.showReviews = true;
    },
  },
  computed: {
    ...mapState({
      userProfile: (state) => state.user.profile,
      library: (state) => state.library.library,
      taskInputs: (state) => state.taskbox.taskInputs,
      taskOutputs: (state) => state.taskbox.taskOutputs,
      appSettings: (state) => state.app.appSettings,
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    node() {
      return this.currentTaskBox.data.nodes[this.previewingTask.id];
    },
    task() {
      if (!this.dataReady) return null;
      return this.previewingTask;
    },
    isTaskbox() {
      return this.task.taskType == 'taskbox';
    },
    isAudition() {
      return this.task && this.task.taskType == 'audition';
    },
    hasReviews() {
      return this.task && this.task.due.reviews && this.task.due.reviews.length > 0 && this.task.due.reviews[this.task.due.reviews.length - 1].status !== auditionstatus.APROOVED.value ? true : false;
    },
    reviewNumber() {
      return this.hasReviews ? this.task.due.reviews.length : 0;
    },
    dataReady() {
      return this.previewingTask ? true : false;
    },
    paused() {
      return this.status.value == taskstate.PAUSED.value ? true : false;
    },
    canceled() {
      return this.status.value == taskstate.REPROVED.value ? true : false;
    },
    status() {
      if (!this.task) return getStatusTypeByValue(0);
      return getStatusTypeByValue(this.task.status);
    },
  },
  methods: {
    connected(id) {
      return this.task.useExternalValue && this.task.externalValue == id ? true : false;
    },
    useExternalValue(value) {
      let copy = _.cloneDeep(this.task);
      Object.assign(copy, { useExternalValue: true });
      copy.value = value;
      this.$store.dispatch('taskbox/UPDATE_TASK', copy);
    },
    isExternal(id) {
      return this.previewingTask.externalValue && this.previewingTask.externalValue.includes(id);
    },
    getComponentType(name) {
      this.componentType = null;
      if (!name) return null;

      let type = this.library.blockLibrary.blocktypes.find((type) => type.name.toLowerCase() == name);
      let previwerType = (type && type.meta.previewType.name) || 'taskbox';
      this.allowfullscreen = type.meta.previewType.properties.fullscreen;
      this.componentType = () => import(`../previewers/${previwerType}.vue`);
    },
    auditStatus(id) {
      return getAuditionStatusByValue((this.previewingTask.value && this.previewingTask.value.auditions && this.previewingTask.value.auditions[id] && this.previewingTask.value.auditions[id].status) || 0);
    },
    async checkDisabled() {
      if (!this.task) return false;
      let result = await taskRepository.checkIfAnyParentDisabled(this.task);
      return result;
    },
    previewInput(node) {
      eventBus.$emit('preview', { node: node, stack: true });
    },
  },
  beforeDestroy() {
    this.loading = false;
  },
};
</script>

<style>
.v-dialog:not(.v-dialog--fullscreen) {
  max-height: 86.5%;
  align-content: space-between;
}
.nodeDialogName.v-input input {
  text-align: left !important;
  color: black !important;
  font-size: 20px !important;
}
</style>
