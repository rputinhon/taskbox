<template>
  <v-sheet v-if="currentTask" color="transparent" width="100%" max-height="fit-content" class="py-3 mx-0 overflow-hidden">
    <v-card-title class="text-center mx-auto" style="max-width:300px">
      <thumbnail :task="currentTask" :options="[(!options.includes('readOnly') || disabled) && 'edit', 'transparent', 'mx-auto']" :size="thumbSize || 150" />
      <v-progress-linear :color="status.color" style="max-width:200px;" height="10" class="mx-auto" v-if="options.includes('progress')" :value="currentTask.progress" rounded/>
    </v-card-title>
    <v-card color="transparent" v-if="!editingSubject || disabled" flat class="pa-6 subject windowbar-button" @click="!options.includes('readOnly') ? edit() : undefined">{{ currentTask.subject }}</v-card>
    <v-textarea v-else outlined rows="9" class="ma-0 pa-0" label="task description" no-resize autofocus dense hide-details="true" v-model="subject" @keydown.enter="updateSubject()" @keydown.escape="editingSubject = false" @blur="updateSubject()"></v-textarea>
  </v-sheet>
</template>

<script>
import _ from 'lodash';
import Thumbnail from './Thumbnail.vue';
import { taskRepository } from '../../store/modules/task/taskRepository';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { isTaskCanceled, isTaskPaused } from '../../store/modules/task/task';

export default {
  name: 'Subject',
  components: { Thumbnail },
  props: { task: Object, taskId: String, options: Array, thumbSize: Number },
  data() {
    return {
      editingSubject: false,
      updatedSubject: null,
      loadedTask: null,
    };
  },
  mounted() {
    this.getTask(this.taskId);
  },
  computed: {
    currentTask(){
      return this.task || this.loadedTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    disabled() {
      return this.paused || this.canceled ? true : false;
    },
    paused() {
      return isTaskPaused(this.task);
    },
    canceled() {
      return isTaskCanceled(this.task);
    },
    isTaskBox() {
      if (!this.task) return;
      return this.task.taskType == 'taskbox' ? true : false;
    },
    subject: {
      get() {
        return this.task.subject;
      },
      set(value) {
        this.updatedSubject = value.trim().length !== 0 ? value : this.task.subject;
      },
    },
  },
  methods: {
    edit() {
      if (this.options.includes('readOnly')) return;
      this.editingSubject = true;
    },
    async getTask(id) {
      if (this.task) this.loadedTask = this.task;
      else {
        taskRepository.find(id).then((task) => {
          this.loadedTask = task;
        });
      }
    },
    updateSubject() {
      if (!this.updatedSubject || this.updatedSubject.trim().length == 0) return (this.editingSubject = false);
      let copy = _.cloneDeep(this.task);
      copy.subject = this.updatedSubject;

      this.$store.dispatch('taskbox/UPDATE_TASK', copy);
      this.editingSubject = false;
    },
  },
};
</script>

<style scoped>
.subject {
  color: #353535;
  width: 100%;
  font-size: 17px;
  text-align: center;
  font-weight: 600;
}
</style>
