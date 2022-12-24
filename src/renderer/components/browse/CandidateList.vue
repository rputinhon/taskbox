<template>
  <v-btn style="min-width: 0 !important" text depressed large left bottom rounded :disabled="disabled" :class="hasCandidats && 'pl-3 pr-1'" class="px-1 mb-1" elevation="0" color="transparent" @click.stop>
    <avatar-list :concat="7" :list="candidats" :max="max"/>
    <v-divider v-if="!isCandidate && hasCandidats" vertical class="primary-text mx-2 mr-0 my-2"></v-divider>
    <v-tooltip v-if="isCandidate" bottom transition="none">
      <template v-slot:activator="{ on: tooltip }">
        <v-menu rounded="0" right offset-x light :close-on-content-click="true" @click.stop>
          <template v-slot:activator="{ on: menu }">
            <v-btn v-on="{ ...menu, ...tooltip }" v-show="options.includes('action')" large class="pr-1 pl-0" style="margin-left: -10px" elevation="0" :disabled="disabled" rounded :outlined="!isCandidate" color="transparent" @mouseenter="hovering = true" @mouseleave="hovering = false">
              <svg class="px-0 mx-0" style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " :fill="'grey'" />
              </svg>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="400">
            <v-list>
              <v-list-item v-if="author" link style="min-height: 40px; height: 40px">
                <v-btn color="primary" text block small @click.stop="analyseCandidats()"> Analyse Candidats </v-btn>
              </v-list-item>
              <v-list-item link style="min-height: 40px; height: 40px">
                <v-btn color="error" text block small @click.stop="removeCandidate()"> Remove Candidate </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
      Menu
    </v-tooltip>
    <be-candidate v-if="!isCandidate" :task="task ? task.id : post && post.data.task" @updateList="updateList" />
    <small v-if="!hasCandidats" class="grey--text">no candidats</small>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import BeCandidate from './BeCandidate.vue';
import _ from 'lodash';
import AvatarList from '../lists/AvatarList.vue';

export default {
  name: 'CandidateList',
  props: { post: Object, disabled: Boolean, options: Array, task: Object },
  components: { BeCandidate, AvatarList },
  data() {
    return {
      hovering: false,
      max: 6,
      candidats: [],
    };
  },
  mounted() {
    this.getCandidats();
  },
  computed: {
    ...mapState({
      user: (state) => state.user.profile,
      members: (state) => state.connection.members,
    }),
    author() {
      return true;
    },
    hiddenCandidats() {
      return Math.abs(this.max - this.candidatsCount);
    },
    hasCandidats() {
      return this.candidatsCount > 0 ? true : false;
    },
    candidatsCount() {
      return this.candidats.length;
    },
    isCandidate() {
      return this.candidats.includes(this.user.id);
    },
  },
  methods: {
    analyseCandidats() {},
    async getCandidats() {
      if (this.task && this.task.candidats) return this.updateList(this.task.candidats.map((c) => c.member));
      else
        this.$store.dispatch('task/GET_FIELD', { task: this.task ? this.task.id : this.post.data.task, field: 'candidats' }).then((candidats) => {
          if (candidats) this.updateList(candidats.map((c) => c.member));
        });
    },
    concatCandidats() {
      let copy = _.cloneDeep(this.candidats);
      return copy.splice(this.max, this.candidats.length);
    },
    removeCandidate() {
      this.$store.dispatch('task/REMOVE_TASK_CANDIDATE', { task: this.task ? this.task.id : this.post.data.task, member: this.user.id }).then((candidats) => {
        this.updateList(candidats.map((c) => c.member));
      });
    },
    changeCandidateStatus(status) {
      this.$store.dispatch('post/CHANGE_CANDIDATE_STATUS', { task: this.task ? this.task.id : this.post.data.task, member: this.user.id, status: status }).then((candidats) => {
        this.updateList(candidats.map((c) => c.member));
      });
    },
    updateList(value) {
      this.candidats = value;
    },
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
    },
  },
};
</script>
