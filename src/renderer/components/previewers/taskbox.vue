<template>
  <!-- <v-sheet height="100%" width="100%" color="background" class="pa-0"> -->
  <tasks-pannel style="background-color: red" 
  :taskList="filteredList(tasks || [], { value: filter, field: 'status' })" 
  :height="'calc(100% - 40px)'" 
  :group="false" 
  :refreshing="refreshing" 
  @refresh="getTaskList()" />
  <!-- </v-sheet> -->
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { taskboxRepository } from '../../store/modules/taskbox/taskboxRepository';
import TasksPannel from '../lists/TasksPannel.vue';

export default {
  name: 'previewTypeTaskBox',
  props: { fullscreen: Boolean },
  components: {
    TasksPannel,
  },
  data() {
    return {
      editingTitle: false,
      refreshing: false,
      tasks: [],
      refreshKey: 0,
    };
  },
  created() {
    eventBus.$on('updateTaskList', () => {
      this.refreshKey++;
    });
  },
  mounted() {
    this.getTaskList();
  },
  watch: {
    refreshKey() {
      this.getTaskList();
    },
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
      filter: (state) => state.app.taskFilter,
    }),
    task() {
      return this.auditingTask || this.previewingTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
  },
  methods: {
    filteredList(list, filter) {
      return list.filter((item) => filter.value.includes(item[filter.field]));
    },
    getTaskList() {
      this.refreshing = true;
      taskboxRepository.getChildrenTasks(this.task.id).then((response) => {
        this.tasks = response;
        console.log(response);
        eventBus.$emit('previewLoaded', false);
        setTimeout(() => {
          this.refreshing = false;
        }, 1000);
      });
    },
  },
};
</script>
