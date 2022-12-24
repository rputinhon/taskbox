<template>
  <v-list color="transparent" style="position: absolute; right: 0; height: auto">
    <v-card :loading="saving" class="mr-2 pa-3" width="80" rounded="pill" color="rgba(255,255,255,0.2)">
      <v-menu rounded="lg" ref="memberpicker" min-width="200" left light transition="none" :close-on-content-click="false">
        <template v-slot:activator="{ on: onMenu }">
          <v-avatar v-on="{ ...onMenu }" size="55">
            <member-item :id="workers[0]" :size="50" :options="['onlyAvatar', 'hover']" />
          </v-avatar>
        </template>
        <member-picker @select="setWorkers" :multiple="false" :list="workers" />
      </v-menu>

      <small>{{ auditionStatus.text }}</small>
      <v-divider class="mt-3"></v-divider>

      <v-tooltip v-if="!isAuditing" left transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn v-on="{ ...onTooltip }" fab :loading="saving" color="grey" class="my-3" @click.stop="audit()">
            <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 35.89829,9.207423 v 5.35e-4 c -0.588346,0.01878 -1.127841,0.303851 -1.512912,0.703164 l -6.806261,6.979136 c 2.629844,2.700937 4.652205,4.777455 7.119665,7.311628 l 7.066106,-7.113299 0.0021,-0.0021 c 0.86868,-0.875759 0.852858,-2.327027 -0.03604,-3.182797 L 37.517796,9.844865 37.501906,9.828955 C 37.058344,9.43737 36.486662,9.188663 35.898304,9.207457 Z m -24.390633,8.661745 c -0.5666,-0.0045 -1.13486,0.201613 -1.56806,0.619908 l -4.04664,3.902399 h -0.002 c -0.88784,0.858018 -0.90032,2.308846 -0.0281,3.182796 v 0.0021 l 12.199848,12.195587 c 0.866182,0.865086 2.302656,0.861579 3.164765,-0.0074 l 5.416902,-5.452956 C 22.053485,27.499089 17.12943,22.563427 13.066257,18.51347 c -0.42701,-0.424603 -0.99192,-0.639866 -1.55852,-0.644302 z" :fill="'white'" />
            </svg>
          </v-btn>
        </template>
        Audit
      </v-tooltip>

      <v-tooltip left transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn v-show="isAuditing" v-on="{ ...onTooltip }" :loading="saving" class="my-3" :outlined="!approved" fab :color="reviewing || reproved ? 'grey' : 'success'" @click.stop="approveAudition()">
            <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 35.590286,9.5800382 c -0.573351,0.01831 -1.09936,0.296418 -1.47461,0.6855468 L 19.728957,25.017538 13.340285,18.648397 c -0.832238,-0.827545 -2.202573,-0.838692 -3.046875,-0.02344 l -3.9433589,3.802734 h -0.002 c -0.865194,0.836135 -0.877305,2.249903 -0.02734,3.101563 v 0.002 L 18.209379,37.415973 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013673,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815988 -0.98915,-0.6237838 -1.5625,-0.6054688 z" :fill="approved ? 'white' : reproved || reviewing ? 'grey' : '#81e68b'" />
            </svg>
          </v-btn>
        </template>
        Approve
      </v-tooltip>
      <v-tooltip left transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn v-show="isAuditing" v-on="{ ...onTooltip }" :loading="saving" :outlined="!reviewing" fab :color="approved || reproved ? 'grey' : 'warning'" @click.stop="reviewAudition()">
            <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 35.590075,9.5797768 v 5.292e-4 c -0.57335,0.018309 -1.099079,0.2961008 -1.474327,0.68523 l -1.069187,1.096573 7.171656,6.993889 1.088821,-1.096057 0.0021,-0.0021 c 0.846529,-0.853423 0.831103,-2.267676 -0.03514,-3.10162 l -4.105691,-3.955313 -0.0155,-0.0155 C 36.720571,9.8038429 36.163472,9.5614788 35.590122,9.5797938 Z m -4.038513,3.3150432 -7.420735,7.609355 -0.981853,7.332367 7.907529,-0.256831 7.649144,-7.700821 z m -19.730061,5.125785 c -0.552152,-0.0043 -1.105922,0.196472 -1.528073,0.604098 l -3.9434281,3.802868 h -0.00206 c -0.8651941,0.836135 -0.8773536,2.24996 -0.027389,3.10162 v 0.0021 L 18.209227,37.4158 c 0.844091,0.843029 2.243929,0.839603 3.08405,-0.0078 l 5.525757,-5.562447 -7.090006,-6.828007 -6.388757,-6.36912 c -0.416119,-0.413773 -0.966619,-0.623545 -1.51877,-0.627869 z" :fill="reviewing ? 'white' : approved || reproved ? 'grey' : '#f7ab39'" />
            </svg>
          </v-btn>
        </template>
        Review
      </v-tooltip>
      <v-tooltip left transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn v-show="isAuditing" v-on="{ ...onTooltip }" :loading="saving" class="my-3" :outlined="!reproved" fab :color="approved || reviewing ? 'grey' : 'error'" @click.stop="reproveAudition()">
            <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" :fill="reproved ? 'white' : approved || reviewing ? 'grey' : '#f14f43'" />
            </svg>
          </v-btn>
        </template>
        Reprove
      </v-tooltip>
    </v-card>
  </v-list>
</template>

<script>
import { getStatusTypeByValue } from '../../enums/taskstate';
import { eventBus } from '../../../main';
import { mapState } from 'vuex';

import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';
import MemberItem from '../lists/MemberItem.vue';
import MemberPicker from '../forms/MemberPicker.vue';
import { isTaskReviewing } from '../../store/modules/task/task';

export default {
  name: 'AuditionBar',
  props: { fullscreen: Boolean },
  components: { MemberItem, MemberPicker },
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
    this.$store.commit('taskbox/AUDIT_NEXT_INPUT');
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
      return this.auditingTask && this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id];
    },
    auditions() {
      return this.task.value && this.task.value.auditions ? this.task.value.auditions : null;
    },
    auditionStatus() {
      return getAuditionStatusByValue(this.isAuditing ? this.task.value.auditions[this.auditingTask.id].status : 0);
    },
    approved() {
      return this.auditingTask && this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.APROOVED.value ? true : false;
    },
    reviewing() {
      return this.auditingTask && this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.REVIEWING.value ? true : false;
    },
    reproved() {
      return this.auditingTask && this.task.value && this.task.value.auditions && this.task.value.auditions[this.auditingTask.id] && this.task.value.auditions[this.auditingTask.id].status == auditionstatus.REPROVED.value ? true : false;
    },
    hasReviews() {
      return (this.auditingTask && this.auditingTask.due.reviews && this.auditingTask.due.reviews.length) || false;
    },
    workers() {
      return (this.previewingTask && this.previewingTask.workers.map((w) => w.profile).filter((w) => w !== undefined)) || [];
    },
  },
  methods: {
    setWorkers(list) {
      this.$store.commit('task/SET_WORKERS', { task: this.task, workers: list.filter((w) => w !== undefined) });
      this.$refs.memberpicker.isActive = false;
    },
    audit() {
      this.saving = true;
      this.$store.dispatch('task/AUDIT', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id) }).then(() => {
        setTimeout(() => {
          this.saving = false;
        }, 700);
      });
    },
    approveAudition() {
      if (this.approved) return;
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
      if (this.reviewing) return;
      this.saving = true;
      this.$store.dispatch('task/SET_AUDITION_STATUS', { audition: this.task, auditing: this.auditingTask.id, inputs: this.taskInputs.map((t) => t.id), status: auditionstatus.REVIEWING.value }).then(() => {
        if (!isTaskReviewing(this.auditingTask)) this.$store.commit('task/REVIEW_TASK', this.auditingTask);
        setTimeout(() => {
          this.saving = false;
        }, 700);
      });
    },
    reproveAudition() {
      if (this.reproved) return;
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
  },
};
</script>
