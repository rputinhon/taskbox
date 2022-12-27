<template>
  <v-app-bar rounded="lg" flat class="pa-0 ma-0" width="100%" height="10px" color="transparent" v-if="task">
    <v-progress-linear  color="grey" absolute height="100%" buffer-value="100" ><small style="font-size:10px">{{ dueIn }}</small></v-progress-linear>
    <date-time-picker :completed="completed" :started="started" :task="task" :type="'plannedToStartAt'" :dueColor="hasDue ? dueColor : 'grey'" />
    <v-spacer/>
    <date-time-picker :completed="completed" :started="started" :isLate="isLate" :task="task" :type="'plannedToEndAt'" :dueColor="hasDue ? dueColor : 'grey'"> ! </date-time-picker>
    <svg v-if="hasDue && !completed" :style="`position:absolute;left:${interval < 100 ? interval : 100}%`" version="1.1" width="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="14" height="14" ry="24" :fill="dueColor" />
    </svg>
  </v-app-bar>
</template>

<script>
import moment from 'moment';
import { analizeColor, isTaskDone, isTaskStarted } from '../../store/modules/task/task';
import { mapState } from 'vuex';
import { getStatusTypeByValue } from '../../enums/taskstate';
import DateTimePicker from './DateTimePicker.vue';
import { eventBus } from '../../../main';
import { DueTracker } from '../../libs/dueTracker';

export default {
  components: { DateTimePicker },
  props: { task: Object, options: Array, hovering: Boolean },
  name: 'TaskBoxTitle',
  data() {
    return {
      interval: 0,
    };
  },
  created() {
    eventBus.$on('updateInterval', (args) => {
      if (this.task && args.id == this.task.id) {
        this.interval = args.interval;
      }
    });
  },
  watch: {
    task(value) {
      DueTracker.track(value);
    },
    endDate() {
      DueTracker.track(this.task, true);
    },
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
    }),
    dataReady() {
      return this.task ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    completed() {
      return isTaskDone(this.task);
    },
    started() {
      if (!this.dataReady) return false;
      return isTaskStarted(this.task);
    },
    //due
    hasDue() {
      return this.task.due.plannedToEndAt ? true : false;
    },
    dueColor() {
      return analizeColor(this.interval, true);
    },
    isLate() {
      return moment.utc(this.task.due.plannedToEndAt) - moment.now() < 0 ? true : false;
    },
    startDate() {
      return this.plannedToStartAt ? this.plannedToStartAt : this.started ? this.startedDate : 'no due';
    },
    startedDate() {
      return moment(this.task.due.startedAt).format('DD/MM HH:mm');
    },
    endDate() {
      return this.plannedToEndAt ? this.plannedToEndAt : this.completed ? this.completedDate : 'no due';
    },
    completedDate() {
      return moment(this.task.due.completedAt).format('DD/MM HH:mm');
    },
    plannedToStartAt() {
      if (!this.task.due.plannedToStartAt) return false;
      return moment(this.task.due.plannedToStartAt).format('DD/MM HH:mm');
    },
    plannedToEndAt() {
      if (!this.task.due.plannedToEndAt) return false;
      return moment(this.task.due.plannedToEndAt).format('DD/MM HH:mm');
    },
  },
  methods: {
    startedIn() {
      return this.started ? 'started ' + moment(this.task.due.startedAt).fromNow() : 'unstarted';
    },
    dueIn() {
      return !this.completed ? (this.hasDue ? moment().to(this.task.due.plannedToEndAt) : 'no due') : 'done ' + moment().to(this.task.due.completedAt);
    },
    getInterval() {
      console.log(this.interval);
      return this.interval;
    },
  },
};
</script>

<style scoped>
.v-menu__content {
  overflow: hidden;
}

.v-toolbar__content,
.v-toolbar__extension {
  padding: 0px !important;
}
.v-application .pb-3 {
  padding-bottom: 0px !important;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 0px;
}
.v-messages__message {
  text-align: center;
}
</style>
