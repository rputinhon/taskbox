<template>
  <v-tooltip left transition="none" v-if="task" z-index="15">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu rounded="lg" ref="flowmenu" offset-x left light z-index="15" :close-on-click="true" :close-on-content-click="false">
        <template v-slot:activator="{ on: menu }">
          <v-btn style="z-index: 0" v-on="{ ...tooltip, ...menu }" elevation="0" x-small :color="hasAuditors ? auditionStatus.color : status.color" class="auditor px-0 my-0" :class="auditing && 'hashleft'" :height="!options.includes('fab') ? '48px' : ''">
            <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path v-if="!hasAuditors" d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="white" />
              <path v-else :d="auditionStatus.icon" fill="white" />
            </svg>
          </v-btn>
        </template>
        <v-card class="mx-auto pa-0" flat rounded="lg" max-width="400" width="250">
          <v-list-item v-if="hasAuditors" link class="py-0 my-0 pr-2" color="transparent" style="min-height: 48px">
            <v-list-item-title v-text="auditionStatus.text"></v-list-item-title>
            <svg version="1.1" height="35px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path :d="auditionStatus.icon" :fill="auditionStatus.color" />
            </svg>
          </v-list-item>
          <v-card v-for="(auditor, a) in task.auditors" :key="a" width="100%" class="pa-0 ma-0" flat rounded="0" :color="getAuditionStatus(auditor.status).color">
            <v-list-item color="warning" class="py-0 my-0 mx-0" style="min-height: 40px">
              <member-item :id="auditor.id"  :subtitle="getAuditionStatus(auditor.status).text" :options="['username']" :align="'left'"/>
              <v-list-item-icon class="py-0 my-auto">
                <audit-menu :task="task" :status="getAuditionStatus(auditor.status)" @Audit="Audit" @Review="Review" @Aproove="Aproove" @RemoveAuditor="removeAuditor(auditor.id)" />
              </v-list-item-icon>
            </v-list-item>
          </v-card>
          <v-menu rounded="0" ref="memberpicker" offset-x left light z-index="15" :close-on-click="true" :close-on-content-click="false">
            <template v-slot:activator="{ on: menu }">
              <v-list-item v-on="{ ...tooltip, ...menu }" link class="py-0 my-0" color="transparent" style="min-height: 48px">
                <svg version="1.1" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20.279297 9.6289062 L 20.279297 20.279297 L 9.6289062 20.279297 L 9.6289062 27.720703 L 20.279297 27.720703 L 20.279297 38.371094 L 27.720703 38.371094 L 27.720703 27.720703 L 38.371094 27.720703 L 38.371094 20.279297 L 27.720703 20.279297 L 27.720703 9.6289062 L 20.279297 9.6289062 z " fill="#1070ff" />
                </svg>
                <v-list-item-title v-text="'add auditor'"></v-list-item-title>
              </v-list-item>
            </template>
            <member-picker :list="task.auditors.map((a) => a.id)" @select="addAuditors" />
          </v-menu>
        </v-card>
      </v-menu>
    </template>
    audit
  </v-tooltip>
</template>

<script>
import taskstate from '../../enums/taskstate';
import { mapState } from 'vuex';
import { hasOpenAuditions } from '../../store/modules/task/task';
import { memberRepository } from '../../store/modules/user/profileRepository';
import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';
import AuditMenu from './AuditMenu.vue';
import MemberPicker from '../forms/MemberPicker.vue';
import MemberItem from '../lists/MemberItem.vue';

export default {
  components: { AuditMenu, MemberPicker, MemberItem },
  name: 'FlowTaskMenu',
  props: { task: Object, options: Array, status: Object },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      members: (state) => state.connection.members,
      userProfile: (state) => state.user.user.metadata,
    }),
    members() {
      return this.members.map((m) => m.member);
    },
    isTaskBox() {
      if (!this.task) return;
      return this.task.taskType == 'taskbox' ? true : false;
    },
    taskable() {
      return this.task.taskable;
    },
    auditionStatus() {
      return auditionstatus.WAITING;
    },
    hasAuditors() {
      return this.task.auditors && this.task.auditors.length;
    },
    auditing() {
      return hasOpenAuditions(this.task);
    },
    unstarted() {
      if (!this.task) return;
      return this.status.value == taskstate.UNSTARTED.value ? true : false;
    },
    completed() {
      if (!this.task) return;
      return this.status.value == taskstate.DONE.value ? true : false;
    },
  },
  methods: {
    addAuditors(selected) {
      let auditors = selected;
      this.$store.commit('task/ADD_AUDITORS', { task: this.task, auditors: auditors });
      this.close();
    },
    removeAuditor(id) {
      this.$store.commit('task/REMOVE_AUDITOR', { task: this.task, auditor: id });
      this.close();
    },
    Audit() {
      if (this.auditing) return;
      this.$store.commit('task/AUDIT', { task: this.task, auditor: this.userProfile.profileId });
      this.$refs.flowmenu.isActive = false;
    },
    Review() {
      this.$store.commit('task/REVIEW_TASK', { task: this.task, auditor: this.userProfile.profileId });
      setTimeout(() => {
        this.$store.commit('taskbox/PREVIEW_TASK', { task: this.task, savestack: false });
      }, 1000);
      this.close();
    },
    Aproove() {
      this.$store.commit('task/APROOVE_AUDITION', this.task);

      setTimeout(() => {
        this.$store.commit('taskbox/PREVIEW_TASK', { task: this.task, savestack: false });
      }, 1000);
      this.close();
    },
    getAuditionStatus(value) {
      return getAuditionStatusByValue(value);
    },
    async getMember(id) {
      return memberRepository.get(id, ['_id', 'data.id', 'data.username', 'data.profilePicture']).then((member) => {
        return member;
      });
    },
    close() {
      this.$refs.flowmenu.isActive = false;
    },
  },
};
</script>

<style scoped>
.auditor {
  border-radius: 0px 10px 10px 0px !important;
}
</style>
