<template>
  <v-card width="100%" flat class="mb-4" color="transparent" >
    <v-progress-linear v-if="loading" absolute top indeterminate color="warning" />
    <v-card ref="reviews" hover class="py-0 my-0 overflow-y-auto text-left" width="340px" v-if="hasReviews" color="rgba(200,200,200,0.5)" >
    <small class="mx-2">Revisions:</small>
      <v-list v-for="(review, i) in reversedReviews" :key="i" class="my-0 py-0 text-center" color="transparent">
        <v-toolbar class="my-1 mx-3" v-if="!review.aprooved" flat :color="review.aprooved ? 'success darken-1' : 'warning darken-1'" rounded="lg" height="30px">
          <v-list-item class="ma-0 pa-0 pr-3">
            <v-list-item-icon class="mx-0">
              <v-btn class="mx-1" x-small icon @click="aprooveReview(i)" :disabled="review.aprooved">
                <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="m10.754-3.4365e-8c-5.9037 0-10.754 4.8503-10.754 10.754v26.492c0 5.9037 4.8503 10.754 10.754 10.754h26.492c5.9037 0 10.754-4.8503 10.754-10.754v-26.492c1e-15 -5.9037-4.8503-10.754-10.754-10.754zm0 6.2495h26.492c2.5507 0 4.5045 1.9538 4.5045 4.5045v26.492c0 2.5507-1.9538 4.5045-4.5045 4.5045h-26.492c-2.5507 0-4.5045-1.9538-4.5045-4.5045v-26.492c0-2.5507 1.9538-4.5045 4.5045-4.5045z" color="#000000" fill="#fafafa" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.67" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
                  <path v-if="review.aprooved" d="m12.674 27.313 8.0132 6.6263 14.64-19.879" fill="none" stroke="#fafafa" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.4301" />
                </svg>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="text-left">
              <v-list-item-subtitle style="color: white"> Review nº {{ reviews.length - i }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-toolbar>
        <div v-else>
          <v-list-item style="min-height:25px">
            <v-list-item-content class="py-0 my-0">
              <!-- <v-divider v-if="i >= 1"></v-divider> -->
              <small style="font-size: 10px" class="mx-1 my-0 py-0">
                REV {{ reviews.length - i }}
                <svg width="15" version="1.1" viewBox="0 0 48 35" xmlns="http://www.w3.org/2000/svg">
                  <path d="m 38.137,10.842319 c -0.4592,-0.13324 -0.95335,0.0247 -1.2502,0.39956 l -0.02725,-0.13016 -15.096,15.48 -7.1044,-7.0832 c -0.45412,-0.45156 -1.186,-0.45694 -1.6467,-0.01209 l -3.9442,3.8019 c -0.47251,0.45664 -0.47936,1.2118 -0.015188,1.6769 l 11.887,11.884 c 0.46077,0.46136 1.2088,0.45996 1.6679,-0.0031 l 20.015,-20.151 c 0.46337,-0.46596 0.45519,-1.2212 -0.01816,-1.6769 l -4.0895,-3.9412 -0.03329,0.04843 c -0.09491,-0.11931 -0.21211,-0.21904 -0.34509,-0.29362 z" fill="#4CAF50" stop-color="#000000" style="paint-order: fill markers stroke" />
                </svg>
                {{ getDate(i) }}
              </small>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-list v-for="(message, k) in review.reviewMessages" :key="k" class="py-0 my-0 px-2" color="transparent">
          <v-list-item class="mt-0 py-0 px-0 message">
            <v-list-item-avatar class="ma-0 py-0 px-1" style="bottom: 0px; align-self: flex-end">
              <v-avatar size="25" color="primary">
                <v-img v-if="getMember(message.member.profile) && getMember(message.member.profile).avatar" :src="getMember(message.member.profile).avatar" />
                <svg v-else width="25" height="25" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                  <path transform="scale(.3) translate(-2 -2)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-avatar>
            </v-list-item-avatar>
            <v-card flat :color="review.aprooved ? 'success' : 'warning'" rounded="lg" width="fit-content" max-width="200px" style="border-radius: 18px 18px 0px 18px !important; margin-bottom: 5px" class="text-right">
              <v-list-item-content class="py-0">
                <v-card-text class="text-caption py-1 pr-3 pl-5 my-0" style="color: white">
                  {{ message.text }}
                </v-card-text>
              </v-list-item-content>
            </v-card>
          </v-list-item>
        </v-list>
      </v-list>
    </v-card>
    <div v-else class="text-subtitle-1">
        no reviews asked
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';

export default {
  name: 'Review',
  props: { task: Object },
  data() {
    return {
      loading: false,
      expandedReviews: [],
      msg: null,
    };
  },
  mounted() {
    this.getReviews(this.task.id);
  },
  watch:{
    // task(){
      //   this.getReviews()      
      // }
  },
  computed: {
    ...mapState({
      user: (state) => _.cloneDeep(state.user.user),
      profile: (state) => _.cloneDeep(state.user.profile),
      members: (state) => state.user.members,
    }),
    reviews(){
      return this.task.due.reviews;
    },
    hasReviews() {
      return this.reversedReviews.length;
    },
    status() {
      return getStatusTypeByValue(this.entity.task.status);
    },
    reviewing() {
      if (!this.status) return false;
      return this.status.value == taskstate.REVIEWING.value ? true : false;
    },
    reversedReviews() {
      return _.cloneDeep(this.reviews).reverse();
    },
  },
  methods: {
    getMember(id) {
      return this.members.find((m) => m.member == id);
    },
    async getReviews() {
     return []
    },
    
    async save() {
      await this.$store.dispatch('chat/SAVE_REVIEWS', { id: this.task.id, reviews: this.reviews });
    },
    getDate(i) {
      return moment(this.reviews[this.reviews.length - i - 1].aproovedAt).format('DD/MM HH:mm');
    },
    expanded(i) {
      return this.expandedReviews.includes(i) || i == this.reviews.length - 1 ? true : false;
    },
    toggleExpanded(i) {
      if (!this.expandedReviews.includes(i)) this.expandedReviews.push(i);
      else {
        let index = this.expandedReviews.indexOf(i);
        this.expandedReviews.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
.message {
  min-height: 30px !important;
  max-height: 300px !important;
  direction: rtl;
}
</style>
