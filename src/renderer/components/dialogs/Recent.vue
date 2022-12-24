<template>
  <v-card :loading="true" v-if="recent.lastModifiedTasks.length" width="100%" max-height="320" height="fit-content" color="grey lighten-3" class="overflow-y-auto overflow-x-hidden px-3 pb-3 my-2" rounded="lg">
    <v-card-title class="py-2">
      <small class="text-caption grey--text mr-3">Recent Tasks:</small>
    </v-card-title>
    <task-item class="mb-1" v-for="(task, t) in recent.lastModifiedTasks" :task="task" :options="['status']" :key="t" />

  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import TaskItem from '../lists/TaskItem.vue';

export default {
  components: {
    TaskItem,
  },
  name: 'Recent',
  data() {
    return {
      hovering: false,
      info: null,
      loading: false,
    };
  },
  mounted() {
    this.getInfo(this.recent.lastRoot);
    this.loading = true;
  },
  watch: {
    recent(value) {
      if (value) this.getInfo(value.lastRoot);
      else this.info = null;
      this.loading = false;
    },
  },
  computed: {
    ...mapState({
      recent: (state) => state.taskbox.recent,
    }),
    status() {
      return getStatusTypeByValue(this.recent.lastRoot.status || 0);
    },
    completed() {
      return this.status.value == taskstate.DONE.vaue ? true : false;
    },
  },
  methods: {
    async getInfo() {
      // if (value)
      //   taskboxRepository.getTasks(value.children).then((tasks) => {
      //     taskboxRepository.getTaskBoxInfo(tasks).then((info) => {
      //       this.info = info;
      //     });
      //   });
    },
    open() {
      this.$store.dispatch('taskbox/FETCH_ROOT', this.recent.lastRoot.id);
    },
  },
};
</script>
