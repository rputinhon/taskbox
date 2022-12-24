<template>
  <v-card v-if="dataReady" color="transparent" flat height="43" width="100%" class="windowbar py-0 mx-1 mr-0 my-auto">
    <v-list-item class="ma-0 pa-0 my-auto" style="width: 100%; min-height: 35px !important; margin-top: 3px !important">
      <v-list-item-title class="py-0 text-left" style="font-weight: 550; color: #555555 !important">
        <task-subject :color="'#0187f3'" :task="currentTaskBox" :options="['popup', 'statistics', 'status']" />
        <task-box-table-info v-if="options && options.includes('info')" :taskbox="currentTaskBox" :options="['status']" />
        {{ currentTaskBox.title }}
      </v-list-item-title>
      <v-spacer> </v-spacer>
    </v-list-item>
  </v-card>
</template>

<script>
import moment from 'moment';
import { analizeColor, getPercentage, isTaskDone, isTaskStarted } from '../../store/modules/task/task';
import { mapState } from 'vuex';
import _ from 'lodash';
import { getStatusTypeByValue } from '../../enums/taskstate';
import TaskSubject from '../lists/TaskSubject.vue';
import TaskBoxTableInfo from '../dialogs/TaskBoxTableInfo.vue';

export default {
  name: 'TaskBoxTitle',
  props: { options: Array },
  components: {
    TaskSubject,
    TaskBoxTableInfo,
  },
  data() {
    return {
      interval: 0,
    };
  },
  mounted() {
    if (this.dataReady && this.hasDue) {
      this.getInterval();
      setInterval(() => {
        this.getInterval();
      }, 10000);
    }
  },
  watch: {
    currentTaskBox(value) {
      if (this.dataReady && value) {
        if (this.hasDue) {
          this.getInterval();
          setInterval(() => {
            this.getInterval();
          }, 10000);
        }
      }
    },
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      currentTaskBox: (state) => _.cloneDeep(state.taskbox.currentTaskBox),
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
    }),
    dataReady() {
      return this.currentTaskBox ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.status);
    },
    completed() {
      return isTaskDone(this.currentTaskBox);
    },
    started() {
      if (!this.dataReady) return false;
      return isTaskStarted(this.currentTaskBox);
    },
    //due
    hasDue() {
      return this.currentTaskBox.due.plannedToEndAt ? true : false;
    },
    dueColor() {
      return analizeColor(this.interval, true);
    },
    isLate() {
      return moment.utc(this.currentTaskBox.due.plannedToEndAt) - moment.now() < 0 ? true : false;
    },
    startDate() {
      return this.plannedToStartAt ? this.plannedToStartAt : this.started ? this.startedDate : 'no due';
    },
    startedDate() {
      return moment(this.currentTaskBox.due.startedAt).format('DD/MM HH:mm');
    },
    endDate() {
      return this.plannedToEndAt ? this.plannedToEndAt : this.completed ? this.completedDate : 'no due';
    },
    completedDate() {
      return moment(this.currentTaskBox.due.completedAt).format('DD/MM HH:mm');
    },
    plannedToStartAt() {
      if (!this.currentTaskBox.due.plannedToStartAt) return false;
      return moment(this.currentTaskBox.due.plannedToStartAt).format('DD/MM HH:mm');
    },
    plannedToEndAt() {
      if (!this.currentTaskBox.due.plannedToEndAt) return false;
      return moment(this.currentTaskBox.due.plannedToEndAt).format('DD/MM HH:mm');
    },
  },
  methods: {
    startedIn() {
      return this.started ? 'started ' + moment(this.currentTaskBox.due.startedAt).fromNow() : 'unstarted';
    },
    dueIn() {
      return !this.completed ? (this.hasDue ? moment().to(this.currentTaskBox.due.plannedToEndAt) : 'no due') : 'done ' + moment().to(this.currentTaskBox.due.completedAt);
    },
    getInterval() {
      this.$nextTick(() => {
        if (!this.started) return 0;
        let min = moment(this.currentTaskBox.due.startedAt).valueOf();
        let max = moment(this.currentTaskBox.due.plannedToEndAt).valueOf();
        let value = moment.now();
        this.interval = getPercentage([min, max], value);
      });
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
