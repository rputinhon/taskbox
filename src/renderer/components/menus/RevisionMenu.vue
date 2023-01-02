<template>
  <v-tooltip bottom transition="none" z-index="1000">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu rounded="0" ref="revisionmenu" open-on-hover z-index="2000" top right offset-x light :close-on-content-click="false">
        <template v-slot:activator="{ on: menu }">
          <v-btn v-on="{ ...tooltip, ...menu }" fab x-small :icon="disabled" :color="'warning'" @click.stop>
            <svg width="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 35.590075,9.5797768 v 5.292e-4 c -0.57335,0.018309 -1.099079,0.2961008 -1.474327,0.68523 l -1.069187,1.096573 7.171656,6.993889 1.088821,-1.096057 0.0021,-0.0021 c 0.846529,-0.853423 0.831103,-2.267676 -0.03514,-3.10162 l -4.105691,-3.955313 -0.0155,-0.0155 C 36.720571,9.8038429 36.163472,9.5614788 35.590122,9.5797938 Z m -4.038513,3.3150432 -7.420735,7.609355 -0.981853,7.332367 7.907529,-0.256831 7.649144,-7.700821 z m -19.730061,5.125785 c -0.552152,-0.0043 -1.105922,0.196472 -1.528073,0.604098 l -3.9434281,3.802868 h -0.00206 c -0.8651941,0.836135 -0.8773536,2.24996 -0.027389,3.10162 v 0.0021 L 18.209227,37.4158 c 0.844091,0.843029 2.243929,0.839603 3.08405,-0.0078 l 5.525757,-5.562447 -7.090006,-6.828007 -6.388757,-6.36912 c -0.416119,-0.413773 -0.966619,-0.623545 -1.51877,-0.627869 z" 
              :opacity="!disabled ? '1' : '0.5'"
              fill="white" />
            </svg>
          </v-btn>
        </template>
        <v-card flat class="mx-auto" max-width="400" color="background">
          <review :task="task" />
        </v-card>
      </v-menu>
    </template>
    show review items
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex';
import auditionstatus from '../../enums/auditionstatus';
import Review from '../forms/Review.vue';
export default {
  components: { Review },
  props: { task: Object, disabled: Boolean },
  name: 'RevisionMenu',
  data() {
    return {};
  },

  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    types() {
      return Object.values(auditionstatus);
    },
    revNumber() {
      return this.task.due.reviews.length;
    },
    isUnsolved() {
      return this.lastReview ? !this.lastReview.value : false;
    },
    hasReview() {
      return this.task.due.reviews && this.task.due.reviews.length > 0;
    },
    lastReview() {
      return this.task.due.reviews[this.task.due.reviews.length - 1];
    },
    lastRevStatus() {
      return this.lastReview && this.lastReview.value ? 'success' : 'grey';
    },
    hasOpenItens() {
      return this.hasReview && this.lastReview.reviewItems && this.lastReview.reviewItems.filter((i) => i.value !== true).length > 0 ? true : false;
    },
  },
  methods: {},
};
</script>
