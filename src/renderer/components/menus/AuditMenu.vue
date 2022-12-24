<template>
  <v-tooltip right transition="none" z-index="1000" v-show="hasAudition">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu  rounded="0" ref="bragmenu" right offset-x light :close-on-content-click="false">
        <template v-slot:activator="{ on: menu }">
          <v-btn v-on="{ ...tooltip, ...menu }" max-height="30" min-width="30" icon class="pa-1 ma-0 mx-1" color="transparent">
            <svg version="1.1" width="25" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path :d="status.icon" :fill="status.color" />
            </svg>
          </v-btn>
        </template>
        <v-card flat class="mx-auto" max-width="400" color="grey lighten-2">
          <v-list-item v-if="!approved">
            <v-btn v-if="types[3]" rounded small>
              <v-list-item-title class="text-center grey--text text-subtitle-2 multiply" v-text="types[3].text"></v-list-item-title>
              <v-list-item-icon class="my-auto mx-1 mr-2">
                <svg width="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path :d="types[3].icon" :fill="types[3].color" />
                </svg>
              </v-list-item-icon>
            </v-btn>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title> Approved </v-list-item-title>
              <v-list-item-subtitle> date sad/a sd/sad/as/ </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <review :task="auditingTask" @approveAudition="approveAudition" />
        </v-card>
      </v-menu>
    </template>
    change audition status
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex';
import auditionstatus, { getAuditionStatusByValue } from '../../enums/auditionstatus';
import Review from '../forms/Review.vue';
export default {
  components: { Review },
  name: 'AuditMenu',
  props: { auditingTask: Object, disabled: Boolean },
  data() {
    return {};
  },

  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
      auditionTask: (state) => state.taskbox.previewingTask,
    }),
    types() {
      return Object.values(auditionstatus);
    },
    hasOpenReviews() {
      return this.task.due.reviews && this.task.due.reviews.filter((r) => r.status !== auditionstatus.APROOVED.value).length > 0 ? true : false;
    },
    hasAudition() {
      return this.auditionTask.value && this.auditionTask.value.auditions && this.auditionTask.value.auditions[this.auditingTask.id];
    },
    status() {
      return getAuditionStatusByValue(this.hasAudition && this.auditionTask.value.auditions[this.auditingTask.id].status || 0);
    },
    approved() {
      return this.auditionTask.value && this.auditionTask.value.auditions && this.auditionTask.value.auditions[this.auditingTask.id] && this.auditionTask.value.auditions[this.auditingTask.id].status == auditionstatus.APROOVED.value;
    },
  },
  methods: {
    approveAudition(taskId) {
      this.$listeners.approveAudition(taskId);
    },
  },
};
</script>
