<template>
  <v-card v-if="task" height="48" :color="auditingStatus.color" width="auto" flat :class="!approved && 'auditing'" class="auditionBit">
    <v-list-item v-if="accepted" class="pa-0 pr-2">
      <v-menu rounded="0" right offset-x light nudge-top="12" nudge-left="0" close-on-content-click>
        <template v-slot:activator="{ on }">
          <v-btn :color="auditingStatus.color" right x-small fab class="py-0 ml-2 mx-1" v-on="on" @click="accepted ? acceptAudition() : undefined">
            <svg version="1.1" width="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path :d="auditingStatus.icon" fill="white" />
            </svg>
          </v-btn>
        </template>
        <v-card class="mx-auto" max-width="400" min-width="150">
          <v-sheet width="100%" max-height="300">
            <v-list class="px-3" v-for="member in auditors" :key="member">
              <v-list-item v-if="member !== profile.id" link style="min-height: 35px !important">
                <member-item :id="member" :options="['username']" :align="'left'" :size="25" :height="35" />
              </v-list-item>
            </v-list>
          </v-sheet>
          <v-divider></v-divider>
          <v-list class="px-3">
            <v-list-item link style="min-height: 35px !important">
              <member-item :id="profile.id" :options="['username']" :align="'left'" :size="25" :height="35" />
            </v-list-item>
          </v-list>
          <v-list-item link @click="approveAudition()" style="min-height: 30px" :style="approved && `background-color:${actionTypes.APROOVED.color}`">
            <v-list-item-icon class="ma-2">
              <svg version="1.1" width="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="actionTypes.APROOVED.icon" :fill="approved && 'white' || actionTypes.APROOVED.color" />
              </svg>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ actionTypes.APROOVED.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="reviewAudition()" class="ma-0" style="min-height: 30px" :style="reviewing && `background-color:${actionTypes.REVIEWING.color}`">
            <v-list-item-icon class="ma-2">
              <svg version="1.1" width="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="actionTypes.REVIEWING.icon" :fill="reviewing && 'white' || actionTypes.REVIEWING.color" />
              </svg>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ actionTypes.REVIEWING.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="reproveAudition()" style="min-height: 30px" :style="reproved && `background-color:${actionTypes.REPROVED.color}`">
            <v-list-item-icon class="ma-2">
              <svg version="1.1" width="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="actionTypes.REPROVED.icon" :fill="reproved && 'white' || actionTypes.REPROVED.color" />
              </svg>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ actionTypes.REPROVED.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-menu>
    </v-list-item>
    <v-list-item v-else-if="currentUserIsAuditor" class="py-0 px-3">
      <v-btn right x-small rounded color="primary" :loading="accepting == auditing.id" @click="acceptAudition()"> audit </v-btn>
      <member-item v-if="!hideMember && !currentUserIsAuditor" :extraClass="'mx-2'" :id="task.workers[0].profile" :size="35" :options="['onlyAvatar']" />
    </v-list-item>
  </v-card>
</template>

<script>
import MemberItem from '../lists/MemberItem.vue';
import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';
import { mapState } from 'vuex';

export default {
  name: 'AuditionBit',
  props: { task: Object, auditing: Object, hideMember: Boolean},
  components: {
    MemberItem,
  },
  data() {
    return {
      saving: false,
      accepting: null,
    };
  },
  mounted(){
    console.log(this.auditors);
  },
  watch: {
    accepted(value) {
      if (value) this.accepting = null;
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    actionTypes() {
      return auditionstatus;
    },
    auditingStatus() {
      return getAuditionStatusByValue((this.auditing && this.auditing.auditors && this.auditing.auditors[this.profile.id].status) || 0);
    },
    auditors() {
      return this.auditing && this.auditing.auditors && Object.keys(this.auditing.auditors).includes(this.profile.id) ? true : false;
    },
    accepted() {
      return this.auditing && this.auditing.auditors && Object.keys(this.auditing.auditors).includes(this.profile.id) ? true : false;
    },
    approved() {
      return this.auditingStatus.value == auditionstatus.APROOVED.value ? true : false;
    },
    reviewing() {
      return this.auditingStatus.value == auditionstatus.REVIEWING.value ? true : false;
    },
    reproved() {
      return this.auditingStatus.value == auditionstatus.REPROVED.value ? true : false;
    },
    currentUserIsAuditor() {
      return this.accepted;
    },
    hasReviews() {
      return this.auditing && this.auditing.auditors && Object.values(this.auditing.auditors).filter((a) => a.reviews.length > 0).length;
    },
  },
  methods: {
    acceptAudition() {
      if (this.accepted) return;
      this.accepting = this.auditing.id;
      this.$store.commit('task/AUDIT', { task: this.auditing, auditor: this.profile.id });
    },
    approveAudition() {
      if (this.approved) return;
      this.saving = true;
      this.$store.commit('task/SET_AUDITION_STATUS', { task: this.auditing, auditor: this.profile.id, status: auditionstatus.APROOVED.value });
      setTimeout(() => {
        this.saving = false;
      }, 700);
    },
    reviewAudition() {
      if (this.reviewing) return;
      this.saving = true;
      this.$store.commit('task/SET_AUDITION_STATUS', { task: this.auditing, auditor: this.profile.id, status: auditionstatus.REVIEWING.value });
      setTimeout(() => {
        this.saving = false;
      }, 700);
    },
    reproveAudition() {
      if (this.reproved) return;
      this.saving = true;
      this.$store.commit('task/SET_AUDITION_STATUS', { task: this.auditing, auditor: this.profile.id, status: auditionstatus.REPROVED.value });
      setTimeout(() => {
        this.saving = false;
      }, 700);
    },
  },
};
</script>

<style>

.auditionBit {
  border-radius: 0 25px 25px 0 !important;
}

.auditing {
  margin-left: 15px;
  border-left: 1px dashed #e0e0e0 !important;
}
</style>
