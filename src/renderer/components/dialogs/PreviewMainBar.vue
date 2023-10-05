<template>
  <v-app-bar dense flat top color="transparent" class="mx-2 my-0 pl-2 px-2" max-height="55px" style="z-index: 10;position: initial;">
    <v-tooltip v-if="task.useExternalValue" transition="none" bottom z-index="1010">
      <template v-slot:activator="{ on: tooltip }">
        <v-btn v-on="tooltip" color="accent" class="mr-2" height="15" width="15" fab @click="removeExternalValue()"></v-btn>
      </template>
      Click to Remove Input
    </v-tooltip>

    <!-- <task-subject :task="task" :options="['popup', 'icon']" class="mr-2" /> -->
    <task-icon :task="task" />
    <task-title :task="task" :options="['edit', 'progress']" />
    <v-spacer></v-spacer>
    <!-- <task-chat :chatId="task.id" :color="status.color" :nodeIcon="getIcon()" :workers="task.workers" /> -->
    <!-- <task-menu :task="task" :options="['icon', 'tile', 'fab']" @showReviews="$emit('showReviews')" /> -->
    <!-- <avatar-list v-if="authenticated" style="direction: rtl" class="mr-3" :concat="4" :size="28" :max="8" :list="workers" /> -->
    <!-- <span class="text-subtitle-2 grey--text"> | {{ task.progress }}% </span> -->
    <task-status-menu :task="task" :options="['progress','workers', 'fab', 'icon', 'flat']" :extraClass="'mx-3'" :hideItems="isTaskBox ? [0, 2] : []" :hideSlideBar="isTaskBox ? true : false" @confirmChange="changeStatus" @updateTaskBox="$emit('updateTaskBox')" />

    <v-tooltip bottom transition="none" z-index="1000">
      <template v-if="hasReviews" v-slot:activator="{ on: tooltip }">
        <v-menu rounded="0" ref="revisionmenu" z-index="2000" top left offset-x light :close-on-content-click="false">
          <template v-slot:activator="{ on: menu }">
            <v-btn tile class="px-0" height="48px" min-width="48px" v-on="{ ...tooltip, ...menu }" depressed :style="reviewStatus.value == 2 && 'border:2px solid #f7ab39'" :color="reviewStatus.color"> rev </v-btn>
          </template>
          <v-card flat class="mx-auto" max-width="400" color="background">
            <review :task="task" :allowAddReview="true" />
          </v-card>
        </v-menu>
      </template>
      Review
    </v-tooltip>
    <!-- <worker v-if="!isTaskBox" :task="task" :justify="'end'" :max="3" :size="30" :ExtraStyle="'margin-right:3px;'" /> -->
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn v-show="allowfullscreen" class="ml-3" v-on="{ ...onTooltip }" icon tile small @click.stop="$emit('toggleFullScreen')">
          <svg width="20" height="20" version="1.1" viewBox="0 0 33.867 33.867" xmlns="http://www.w3.org/2000/svg">
            <path v-if="!fullscreen || task.taskType == 'taskbox'" d="M 5.0272498,3.2284219 A 1.799365,1.799365 0 0 0 3.2284218,5.02725 v 23.8125 a 1.799365,1.799365 0 0 0 1.798828,1.798828 H 28.83975 A 1.799365,1.799365 0 0 0 30.638578,28.83975 V 5.02725 A 1.799365,1.799365 0 0 0 28.83975,3.2284219 Z M 6.8260779,6.8260781 H 27.040921 V 27.040922 H 6.8260779 Z" fill="grey" />
            <path v-else d="m 5.150769,4.9193926 c -1.3931258,3.993e-4 -2.2637582,1.5083358 -1.567564,2.715031 3.9274895,6.8026574 7.854981,13.6053154 11.78247,20.4079734 0.696791,1.206947 2.438858,1.206947 3.135648,0 3.92749,-6.802658 7.85498,-13.605316 11.782471,-20.4079735 0.696197,-1.2066966 -0.174437,-2.7146384 -1.567566,-2.715031 -7.855154,0 -15.710306,0 -23.565459,1e-7 z m 3.1356499,3.6202159 c 5.7648941,0 11.5297871,0 17.2946811,0 C 22.698819,13.532166 19.816281,18.524577 16.933758,23.516998 14.051148,18.524629 11.16879,13.532115 8.2864189,8.5396085 Z" fill="grey" />
          </svg>
        </v-btn>
      </template>
      maximize
    </v-tooltip>
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn v-on="{ ...onTooltip }" small fab icon @click="close()">
          <svg width="26" height="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="grey" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-btn>
      </template>
      close
    </v-tooltip>
    <!-- <v-progress-linear v-if="status.value > 0" bottom fixed rounded :color="status.color" :buffer-value="task.progress" style="pointer-events: none"></v-progress-linear> -->
  </v-app-bar>
</template>

<script>
// import TaskChat from './TaskChat.vue';
// import AvatarList from '../lists/AvatarList.vue';
// import TaskMenu from '../menus/TaskMenu.vue';
import Review from '../forms/Review.vue';
import TaskStatusMenu from '../menus/TaskStatusMenu.vue';
import TaskIcon from '../lists/TaskIcon.vue';
// import TaskSubject from '../lists/TaskSubject.vue';
import TaskTitle from '../lists/TaskTitle.vue';
// import Worker from '../NodeEditor/Components/Worker.vue';

import reviewstatus from '../../enums/reviewstatus';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import _ from 'lodash';

export default {
  name: 'previewMainBar',
  props: { task: Object, allowfullscreen: Boolean, fullscreen: Boolean, disabled: Boolean },
  components: {
    Review,
    TaskStatusMenu,
    // Worker,
    // TaskChat,
    TaskIcon,
    // TaskSubject,
    TaskTitle,
    // AvatarList,
  },
  data: () => ({
    editingTitle: false,
  }),
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    dataReady() {
      return this.task ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    isTaskBox() {
      if (!this.dataReady) return false;
      return this.task.taskType == 'taskbox' ? true : false;
    },
    hasReviews() {
      return this.task.auditors && Object.values(this.task.auditors).filter((a) => a.reviews.length > 0).length;
    },
     reviewStatus() {
      if (!this.task.auditors) return reviewstatus.OPEN;

      let items = [];
      Object.values(this.task.auditors).forEach((element) => {
        element.reviews.forEach((item) => {
          items.push(item);
        });
      });

      if (items.filter((r) => r.status == reviewstatus.REFUSED.value || r.status == reviewstatus.OPEN.value).length) return reviewstatus.OPEN;
      if (items.filter((r) => r.status == reviewstatus.PARCIALLYAPROVED.value).length) return reviewstatus.PARCIALLYAPROVED;
      return reviewstatus.APROVED;
    },
    taskable() {
      if (!this.dataReady) return false;
      return this.task.taskable;
    },
    unstarted() {
      return this.status.value == taskstate.UNSTARTED.value ? true : false;
    },
    completed() {
      return this.status.text == 'Done' ? true : false;
    },
    workers() {
      return this.task.workers.map((w) => w.profile).filter((w) => w !== undefined);
    },
  },
  methods: {
    saveTitle() {
      this.$refs.name.blur();
      // this.$store.commit('taskbox/UPDATE_DATA_TITLE', { node: this.node, title: this.node.data.title });
    },
    removeExternalValue() {
      let copy = _.cloneDeep(this.task);
      copy.value = {};
      Object.assign(copy, { useExternalValue: false });
      this.$store.dispatch('taskbox/UPDATE_TASK', copy);
    },
    setNotTaskable() {},
    changeStatus(newStatus) {
      eventBus.$emit('confirmChangeStatus', [this.node, newStatus]);
    },
    getIcon() {
      let type = this.library.blockLibrary.blocktypes.find((t) => t.name.toLowerCase() == this.task.taskType);

      return type.meta.typeicon;
    },
    startTask() {
      this.$store.commit('task/START_TASK', this.task);
    },
    close() {
      this.$store.commit('taskbox/CLOSE_PREVIEW');
    },
  },
};
</script>
