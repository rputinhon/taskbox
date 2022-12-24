<template>
  <v-tooltip transition="none" bottom z-index="1010">
    <template v-slot:activator="{ on: tooltip }">
      <v-card v-on="{ ...tooltip }" hover width="auto" color="transparent" :max-height="size || 'auto'" style="border-radius: 5px !important; overflow-y: clip" :style="selected && 'border: 2px solid #0187f3!important;'" elevation="2" @mouseenter="hovering = true" @mouseleave="hovering = false">
        <v-progress-linear :color="status.color" background-color="white" :value="task.progress" absolute height="100%" style="border-radius: 0px" />
        <v-list-item link class="ma-0 pa-0" :style="`min-height: ${size || 30 - 2}px; z-index: 10`" @click="action()">
          <v-list-item-icon class="ma-0 mx-0 pa-0 my-auto">
            <svg version="1.1" class="mx-auto" :height="`${size - 3 || 30 - 5}px`" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path :d="getIcon(task.taskType)" :fill="'#353535'" />
            </svg>
          </v-list-item-icon>
          <v-list-item-content class="ma-0 pa-0">
            <v-list-item-title v-if="hovering || selected || type == 'output'" class="mx-3 pa-0" style="font-size: 12px; color: black">
              {{ task.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-btn fab icon x-small v-if="icon" class="ma-0 mx-0 pa-0 my-auto">
        <svg version="1.1" :height="`${size || 30 - 2}px`" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path :d="icon" :fill="iconColor" />
        </svg>
      </v-btn>
    </template>
    {{ task.title }} - {{ task.progress }}%
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex';
import { getAuditionStatusByValue } from '../../enums/auditionstatus';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { getFileType } from '../../fixtures/fileTypes';
import { isTaskDone } from '../../store/modules/task/task';

export default {
  name: 'IO',
  props: { task: Object, type: String, icon: String, iconColor: String, size: Number },
  data() {
    return {
      hovering: false,
    };
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
    }),
    file() {
      return this.task.value && this.task.value.file;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    completed() {
      return isTaskDone(this.task);
    },
    isAudition() {
      return this.previewingTask && this.previewingTask.taskType == 'audition';
    },
    isAuditing() {
      return this.isAudition && this.auditingTask && this.auditingTask.id == this.task.id;
    },
    audition() {
      return this.previewingTask.value && this.previewingTask.value.auditions && this.previewingTask.value.auditions[this.auditingTask.id];
    },
    selected() {
      return this.isAuditing ? true : false;
    },
  },
  methods: {
    auditStatus(id) {
      return this.previewingTask.value && this.previewingTask.value.auditions && this.previewingTask.value.auditions[id] && getAuditionStatusByValue(this.previewingTask.value.auditions[id].status || 0);
    },
    getIcon(name) {
      let type = this.library.blockLibrary.blocktypes.find((t) => t.name.toLowerCase() == name.toLowerCase());
      if (!this.file) return type.meta.typeicon;
      return getFileType(this.file.extension).info.icon;
    },
    action() {
      if (this.isAudition && this.type == 'input') this.audit();
      else this.preview();
    },
    audit() {
      this.$store.commit('taskbox/SET_AUDITING_TASK', this.task);
    },
    preview() {
      this.$store.commit('taskbox/SET_AUDITING_TASK', null);
      this.$store.commit('taskbox/PREVIEW_TASK', { task: this.task.id, savestack: true });
    },
  },
};
</script>

<style scoped></style>
