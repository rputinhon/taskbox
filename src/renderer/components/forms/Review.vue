<template>
  <v-card flat class="overflow-y-auto" color="transparent" min-width="400" height="100%" width="100%" max-height="600" v-if="task">
    <v-progress-linear v-if="loading" absolute top indeterminate color="warning" />
    <v-list class="pa-2" color="transparent">
      <v-list-item v-if="allowAddReview" class="mx-2 pa-0 ma-0">
        <v-text-field v-model="msg" :placeholder="`Type the review notes here`" hide-details="true" dense @keydown.enter="addReviewItem()" @keydown.esc="msg = null" @blur="addReviewItem()">
          <template v-slot:prepend>
            <member-item :id="profile.id" :options="['onlyAvatar', 'hover']" :size="26" />
          </template>
        </v-text-field>
      </v-list-item>
      <div v-for="(auditor, a) in auditorsWithReviews" :key="a">
        <v-btn fixed rounded right small depressed class="mt-2" :style="auditionStatus(auditor).value == 2 && 'border:2px solid #f7ab39'" :color="auditionStatus(auditor).color">{{ auditionStatus(auditor).text }}</v-btn>
        <member-item :subtitle="`${openReviewItems(auditor)} open items`" class="ml-2" :id="auditor" :options="[]" :size="26" />
        <review-item v-for="(item, i) in reviewItems(auditor)" :key="i" :audit="allowAddReview" :reviewItem="item" :itemNumber="i + 1" @delete="deleteItem(item)" @setStatus="setReviewStatus" @toggleItem="toggleItem(auditor, i)" />
      </div>
      <span v-if="!auditorsWithReviews.length"> no reviews asked </span>
    </v-list>
  </v-card>
</template>

<script>
import ReviewItem from './ReviewItem.vue';

import { mapState } from 'vuex';

import auditionstatus from '../../enums/auditionstatus';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import moment from 'moment';
import _ from 'lodash';
import MemberItem from '../lists/MemberItem.vue';
import reviewstatus from '../../enums/reviewstatus';

export default {
  name: 'Review',
  props: { task: Object, allowAddReview: Boolean },
  components: {
    ReviewItem,
    MemberItem,
  },
  data() {
    return {
      loading: false,
      saving: null,
      hovering: null,
      msg: null,
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
      library: (state) => state.library.library,
    }),
    auditors() {
      return (this.task.auditors && Object.kyes(this.task.auditors)) || [];
    },
    auditorsWithReviews() {
      return this.task.auditors && Object.keys(this.task.auditors).filter((k) => this.task.auditors[k].reviews.length > 0);
    },
    reviews() {
      return Object.values(this.task.auditors)
        .filter((a) => a.reviews.length > 0)
        .map((a) => a.reviews);
    },
    types() {
      return Object.values(auditionstatus);
    },
    node() {
      return this.entity.node;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    reviewing() {
      if (!this.status) return false;
      return this.status.value == taskstate.REVIEWING.value ? true : false;
    },
    hasOpenReviews() {
      return this.reviews && this.reviews.filter((r) => r.status !== auditionstatus.APROOVED.value).length ? true : false;
    },
    workers() {
      return this.task.workers.map((w) => w.profile).filter((w) => w !== undefined);
    },
  },
  methods: {
    auditionStatus(auditor) {
      let items = this.reviewItems(auditor);
      if (items.filter((r) => r.status == reviewstatus.REFUSED.value || r.status == reviewstatus.OPEN.value).length) return reviewstatus.OPEN;
      if (items.filter((r) => r.status == reviewstatus.PARCIALLYAPROVED.value).length) return reviewstatus.PARCIALLYAPROVED;
      return reviewstatus.APROVED;
    },
    reviewItems(auditor) {
      return this.task.auditors && this.task.auditors[auditor] && _.cloneDeep(this.task.auditors[auditor]).reviews;
    },
    openReviewItems(auditor) {
      return this.task.auditors && this.task.auditors[auditor] && _.cloneDeep(this.task.auditors[auditor]).reviews.filter((i) => i.status == reviewstatus.OPEN.value || i.status == reviewstatus.REFUSED.value).length;
    },
    isAuditor(member) {
      return member == this.profile.id || this.task.createdBy == this.profile.id;
    },
    isAprooved(review) {
      return review.status == auditionstatus.APROOVED.value;
    },
    openItensCount(review) {
      return (review && review.reviewItems.filter((i) => i.value !== true).length) || 0;
    },
    getDate(date) {
      return moment(date).from();
    },
    addReviewItem() {
      if (this.msg == '' || !this.msg) return;
      this.loading = true;
      this.$store.dispatch('task/ADD_REVIEW_ITEM', { task: this.task, auditor: this.profile.id, msg: this.msg }).then(() => {
        this.msg = null;
        this.loading = false;
      });
    },
    deleteItem(itemIndex) {
      this.loading = true;
      this.$store.dispatch('task/DELETE_REVIEW_ITEM', { task: this.task, auditor: this.profile.id, index: itemIndex }).then(() => {
        this.msg = null;
        this.loading = false;
      });
    },
    setReviewStatus(args) {
      this.loading = true;
      this.$store.dispatch('task/SET_REVIEW_STATUS', { task: this.task, auditor: this.profile.id, index: args[1], status: args[0].status }).then(() => {
        this.msg = null;
        this.loading = false;
      });
    },
    toggleItem(auditor, index) {
      this.loading = true;
      this.$store.dispatch('task/TOGGLE_REVIEW_ITEM', { task: this.task, auditor: auditor, index: index }).then(() => {
        this.msg = null;
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.message {
  text-align: left;
  margin: 0px;
  margin-bottom: 2px;
  padding-top: 0px;
  padding-bottom: 0px;
  min-height: 30px !important;
  border-radius: 10px;
}

.chunk {
  margin-left: 18px;
  margin-right: 18px;
}

.root {
  border-radius: 10px;
  border-end-start-radius: 0px !important;
}
</style>
