<template>
  <v-sheet height="100%" class="overflow-hidden" color="grey lighten-2">
    <v-row no-gutters align="center" justify="center" style="height: 100%">
      <component :inTask="auditingTask" v-bind:is="componentType" :fullscreen="false" :status="status"> </component>
      <audition-bar v-if="auditingTask" />
      <v-list-item-subtitle v-else>
        Select An Input or 
        <v-btn x-small color="primary" @click="close()">close</v-btn>
      </v-list-item-subtitle>
    </v-row>
  </v-sheet>
</template>

<script>
import { getStatusTypeByValue } from '../../enums/taskstate';
import { eventBus } from '../../../main';
import { mapState } from 'vuex';
import RULES from '../../enums/rules';

import auditionstatus from '../../enums/auditionstatus';
import AuditionBar from '../navigation/AuditionBar.vue';

export default {
  name: 'previewTypeAudition',
  props: { fullscreen: Boolean },
  components: {
    AuditionBar,
  },
  data() {
    return {
      saving: false,
      tasks: [],
      refreshKey: 0,
      componentType: null,
    };
  },
  created() {
    eventBus.$on('updateTaskList', () => {
      this.refreshKey++;
    });
  },
  mounted() {
    eventBus.$emit('previewLoaded', false);
  },
  watch: {
    auditingTask(value) {
      if (value) this.getComponentType();
    },
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
      taskInputs: (state) => state.taskbox.taskInputs,
      library: (state) => state.library.library,
      profile: (state) => state.user.profile,
    }),
    rules() {
      return RULES;
    },
    types() {
      return Object.values(auditionstatus);
    },
    dataReady() {
      return this.componentType ? true : false;
    },
    task() {
      return this.previewingTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    isAuditing() {
      if (!this.auditingTask) return;
      return this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id];
    },
    auditions() {
      return this.task.value && this.task.value.auditions ? this.task.value.auditions : null;
    },
    approved() {
      return this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.APROOVED.value ? true : false;
    },
    reviewing() {
      return this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.REVIEWING.value ? true : false;
    },
    reproved() {
      return this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.REPROVED.value ? true : false;
    },
    hasReviews() {
      return (this.auditingTask.due.reviews && this.auditingTask.due.reviews.length) || false;
    },
    workers() {
      return (this.auditingTask && this.auditingTask.workers.map((w) => w.profile).filter((w) => w !== undefined)) || [];
    },
  },
  methods: {
    audit() {
      this.saving = true;
      this.$store.dispatch('task/AUDIT', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id) }).then(() => {
        setTimeout(() => {
          this.saving = false;
        }, 700);
      });
    },
    approveAudition() {
      this.saving = true;
      this.$store.dispatch('task/SET_AUDITION_STATUS', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id), status: auditionstatus.APROOVED.value }).then(() => {
        this.$store.commit('task/SET_TASK_DONE', this.auditingTask);
        setTimeout(() => {
          this.$store.commit('taskbox/AUDIT_NEXT_INPUT');
          this.saving = false;
        }, 700);
      });
    },
    reviewAudition() {
      this.saving = true;
      this.$store.dispatch('task/SET_AUDITION_STATUS', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id), status: auditionstatus.REVIEWING.value }).then(() => {
        this.$store.commit('task/REVIEW_TASK', this.auditingTask);
        setTimeout(() => {
          this.saving = false;
        }, 700);
      });
    },
    reproveAudition() {
      this.saving = true;
      this.$store.dispatch('task/SET_AUDITION_STATUS', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id), status: auditionstatus.REPROVED.value }).then(() => {
        this.$store.commit('task/CANCEL_TASK', this.auditingTask);
        setTimeout(() => {
          this.saving = false;
        }, 700);
      });
    },
    getComponentType() {
      this.componentType = null;
      let name = this.auditingTask.taskType;
      if (!name) return null;

      let type = this.library.blockLibrary.blocktypes.find((type) => type.name.toLowerCase() == name);
      let previwerType = (type && type.meta.previewType.name) || 'taskbox';

      this.componentType = () => import(`../previewers/${previwerType}.vue`);
    },
    close(){
      this.$store.commit('taskbox/CLOSE_PREVIEW');
    }
  },
};
</script>
