<template>
  <v-card flat class="message" rounded="sm" :color="reviewStatus.color" width="100%" height="fit-content" :style="reviewStatus.value == 2 && 'border:2px solid #f7ab39'" style="direction: rtl" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <v-list-item class="mt-0 pb-0 py-0 px-0 message" style="min-height: 15px !important">
      <v-list-item-content class="ma-0 pa-0">
        <v-tooltip bottom transition="none" v-if="hovering">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn absolute fab icon x-small v-on="onTooltip" class="mr-10" @click="$emit('delete')">
              <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#fafafa" stop-color="#000000" style="paint-order: fill markers stroke" />
              </svg>
            </v-btn>
          </template>
          Delete
        </v-tooltip>
        <review-comments :badge="true" :reviewItem="reviewItem" />
        <v-card-text class="text-caption px-2 text-left" style="padding: 5px 5px; direction: ltr">
          <span>{{ itemNumber }} - </span>
          {{ reviewItem.text }}
        </v-card-text>
      </v-list-item-content>
      <v-list-item-avatar class="ma-0 pa-0">
        <v-btn  :loading="checking" class="mx-0" icon @click="$emit('toggleItem'), (checking = true)">
          <svg width="24" height="24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m10.754-3.4365e-8c-5.9037 0-10.754 4.8503-10.754 10.754v26.492c0 5.9037 4.8503 10.754 10.754 10.754h26.492c5.9037 0 10.754-4.8503 10.754-10.754v-26.492c1e-15 -5.9037-4.8503-10.754-10.754-10.754zm0 6.2495h26.492c2.5507 0 4.5045 1.9538 4.5045 4.5045v26.492c0 2.5507-1.9538 4.5045-4.5045 4.5045h-26.492c-2.5507 0-4.5045-1.9538-4.5045-4.5045v-26.492c0-2.5507 1.9538-4.5045 4.5045-4.5045z" 
            fill="white" stroke-width="0.8" />
            <path v-if="reviewItem.checked" d="m 35.590286,9.5800382 c -0.573351,0.01831 -1.09936,0.296418 -1.47461,0.6855468 L 19.728957,25.017538 13.340285,18.648397 c -0.832238,-0.827545 -2.202573,-0.838692 -3.046875,-0.02344 l -3.9433589,3.802734 h -0.002 c -0.865194,0.836135 -0.877305,2.249903 -0.02734,3.101563 v 0.002 L 18.209379,37.415973 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013673,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815988 -0.98915,-0.6237838 -1.5625,-0.6054688 z" fill="white" />
          </svg>
        </v-btn>
      </v-list-item-avatar>
      <v-list-item-avatar width="20" class="ma-0 pa-0" v-if="audit && reviewItem.checked">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-menu ref="status" rounded="0" z-index="2000" top right offset-x light :close-on-content-click="false">
              <template v-slot:activator="{ on: menu }">
                <v-btn :loading="loading" v-on="{ ...menu, ...onTooltip }" class="mx-0" icon>
                  <svg width="24" height="24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="reviewStatus.value == 0" d="m10.754-3.4365e-8c-5.9037 0-10.754 4.8503-10.754 10.754v26.492c0 5.9037 4.8503 10.754 10.754 10.754h26.492c5.9037 0 10.754-4.8503 10.754-10.754v-26.492c1e-15 -5.9037-4.8503-10.754-10.754-10.754zm0 6.2495h26.492c2.5507 0 4.5045 1.9538 4.5045 4.5045v26.492c0 2.5507-1.9538 4.5045-4.5045 4.5045h-26.492c-2.5507 0-4.5045-1.9538-4.5045-4.5045v-26.492c0-2.5507 1.9538-4.5045 4.5045-4.5045z" :fill="'white'" stroke-width="0.8" />
                    <rect v-else width="48" height="48" ry="10" :fill="'white'" />
                    <path v-if="reviewStatus.value !== 0" :d="reviewStatus.icon" :fill="reviewStatus.color" :stroke="reviewStatus.color" />
                  </svg>
                </v-btn>
              </template>
              <v-card flat class="mx-auto" max-width="400">
                <v-list-item link v-for="(type, r) in revStatusTypes" :key="r" @click="setStatus(type.value)">
                  <v-list-item-icon class="py-0">
                    <svg width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path :d="type.icon" :fill="type.color" />
                    </svg>
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ type.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-card>
            </v-menu>
          </template>
          {{ reviewStatus.text }}
        </v-tooltip>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
import reviewstatus, { getReviewStatusTypeByValue } from '../../enums/reviewstatus';
import { mapState } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import ReviewComments from './ReviewComments.vue';

export default {
  components: { ReviewComments },
  name: 'ReviewItem',
  props: { reviewItem: Object, itemNumber: Number, audit: Boolean },
  data() {
    return {
      loading: false,
      checking: false,
      saving: null,
      hovering: false,
      lastStatus: 0,
      msg: null,
    };
  },
  watch: {
    checked() {
      this.checking = false;
    },
    reviewStatus(status) {
      if (status.value !== this.lastStatus) this.loading = false;
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
      library: (state) => state.library.library,
    }),
    reviewStatus() {
      return getReviewStatusTypeByValue(this.reviewItem.status || 0);
    },
    aproved() {
      return this.reviewStatus.value == reviewstatus.APROVED.value || this.reviewStatus.value == reviewstatus.PARCIALLYAPROVED.value ? true : false;
    },
    revStatusTypes() {
      return Object.values(reviewstatus);
    },
    checked() {
      return this.reviewItem.checked;
    },
  },
  methods: {
    getDate(date) {
      return moment(date).from();
    },
    setStatus(status) {
      if (status == this.reviewItem.status) return;
      this.lastStatus = this.reviewItem.status;
      this.loading = true;
      let copy = _.cloneDeep(this.reviewItem);
      copy.status = status;
      this.$listeners.setStatus([copy, this.itemNumber - 1]);
      this.$refs.status.isActive = false;
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
