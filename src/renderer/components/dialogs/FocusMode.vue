<template>
  <div>
    <v-dialog :scrollable="true" :fullscreen="true" overlay-opacity="0.9" width="900px" style="overflow: hidden !important; min-width: auto" max-width="80vw" v-model="focusMode" persistent light>
      <v-card :color="status.color" height="630px" class="overflow-hidden">
        <v-app-bar dense flat top color="transparent" class="my-0 pl-2 px-2" max-height="55px" style="z-index: 10; position: initial">
          <task-icon :task="currentTaskBox" :hover="false" :color="'white'" />
          <task-title :task="currentTaskBox" :options="['edit', 'progress']" />
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on: onTooltip }">
              <v-btn right fixed v-on="{ ...onTooltip }" small fab icon @click="close()">
                <svg width="26" height="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="white" stop-color="#000000" style="paint-order: fill markers stroke" />
                </svg>
              </v-btn>
            </template>
            close
          </v-tooltip>
        </v-app-bar>
        <div key="0">
          <v-list-item v-for="(task, k) in tasks" :key="`${k}_${task.id}`" v-show="task.taskType !== 'audition'" class="my-1" flat rounded="lg" color="transparent">
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

        <v-carousel v-for="(tasklist, t) in tasks" :key="t" class="mt-2" mandatory hide-delimiters height="100%" next-icon="+" prev-icon="" show-arrows>
          <v-carousel-item v-for="(taskconnections, c) in connections" :key="c">
            <v-card hover color="red" outlined width="100%" height="100%"> </v-card>
          </v-carousel-item>
        </v-carousel>
        <!-- <preview-main-bar :task="auditingTask || previewingTask" :disabled="false" :allowfullscreen="allowfullscreen" :fullscreen="fullscreen" @toggleFullScreen="fullscreen = !fullscreen" @maximize="fullscreen = !fullscreen" @showReviews="showReviews = true" />
        <v-card-text class="ma-0 px-0 py-0"  style="height:100%;overflow-y:scroll;background-color:#eeeeee!important" :style="!fullscreen && 'min-height: 610px;max-height: 640px;max-width:100%'">
        <v-fade-transition leave-absolute hide-on-leave>
          <component v-if="dataReady" v-show="!loading" v-bind:is="componentType" :showToolsBar="true" :userProfile="userProfile" :fullscreen="fullscreen" :status="status" @toggleMessages="showReviews = !showReviews" @ShowReviewDialog="review = true"> </component>
        </v-fade-transition> -->
        <v-row justify="center" v-show="loading" align="center" style="width: 100%; height: 100%; position: absolute" class="my-0 py-0">
          <v-progress-circular color="primary" indeterminate />
        </v-row>
        <!-- </v-card-text> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import IoItem from '../lists/IOItem.vue';
// import PreviewMainBar from './PreviewMainBar.vue';
import TaskIcon from '../lists/TaskIcon.vue';
import TaskTitle from '../lists/TaskTitle.vue';

import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import _ from 'lodash';

import { mapState } from 'vuex';
import { taskRepository } from '../../store/modules/task/taskRepository';
import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';

export default {
  name: 'focusMode',
  components: {
    // PreviewMainBar,
    // IoItem,
    TaskIcon,
    TaskTitle,
  },
  data: () => ({
    loading: true,
    allowfullscreen: true,
    fullscreen: false,
    showReviews: false,
    componentType: null,
    tasks: Array,
    filtering: false,
      filter: [0, 1, 2, 3, 4, 5, 6],
    searching: false,
      search: null,
  }),
  created() {
    this.loading = true;
    eventBus.$on('previewLoaded', (value) => {
      this.loading = value;
    });
  },
  mounted() {
    this.loading = false;
  },
  watch: {
    filter() {
      this.filtering = true;
      setTimeout(() => {
        this.filtering = false;
      }, 1500);
    },
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
      root: (state) => state.taskbox.root,
      library: (state) => state.library.library,
      appSettings: (state) => state.app.appSettings,
      focusMode: (state) => state.taskbox.focusMode,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    node() {
      return this.currentTaskBox.data.nodes[this.previewingTask.id];
    },
    tasks() {
      this.refreshkey;
      return Object.values(this.root.tasks).filter((t) => (this.currentTaskBox ? Object.keys(this.currentTaskBox.data.nodes).includes(t.id) : null));
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
    filteredList(list, field, filter) {
      this.refreshkey;
      let sort = this.sortModel;
      let filtered = [];
      let searchResult = this.search ? list.filter((item) => item[field] && item[field].toLowerCase().includes(this.search)) : list;
      if (!filter) filtered = searchResult;
      else filtered = searchResult.filter((item) => filter.value.includes(item[filter.field]));

      let nodes = this.currentTaskBox ? this.currentTaskBox.data.nodes : {};
      let pos = 0;
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
            if (na.position[0] < nb.position[0] && na.position[1] < nb.position[1]) pos -= 2;
            else if (na.position[1] < nb.position[1]) pos -= 1;
            else pos++;

            return pos;
        }
      });
    },
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
    close() {
      this.$store.commit('taskbox/TOGGLE_FOCUS_MODE', false);
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
