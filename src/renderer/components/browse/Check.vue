<template>
  <v-tooltip transition="none">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu rounded="0" transition="none" class="overflow-hidden" left top offset-y light open-on-hover>
        <template v-slot:activator="{ on: menu }">
          <v-btn depressed rounded class="px-2" v-on="{ ...tooltip, ...menu }" :disabled="disabled || !authenticated" v-if="post" :outlined="!checked" color="primary" @click.stop="check()" @mouseenter="hovering = true" @mouseleave="hovering = false">
            <span class="mx-1 px-0" :class="disabled || !authenticated ? 'grey--text' : checked ? 'white-text' : 'primary--text'"> {{ checkCount }} </span>
            <svg class="px-0 mx-0" style="pointer-events: none" width="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path v-if="checked" d="m 34.834764,10.957157 -15.096,15.48 -7.1044,-7.0832 c -0.45412,-0.45156 -1.186,-0.45694 -1.6467,-0.01209 l -3.9441987,3.8019 c -0.47251,0.45664 -0.47936,1.2118 -0.01519,1.6769 l 11.8869987,11.884 c 0.46077,0.46136 1.2088,0.45996 1.6679,-0.0031 l 20.015,-20.151 c 0.46337,-0.46596 0.45519,-1.2212 -0.01816,-1.6769 l -4.0895,-3.9412 c -0.570667,-0.503799 -1.192459,-0.455738 -1.655752,0.02469 z" fill="white" />
              <path
                v-else
                d="m 35.589844,9.5800781 c -0.573351,0.018314 -1.09936,0.2964182 -1.47461,0.6855469 L 19.728516,25.017578 13.339844,18.648437 C 12.507606,17.820892 11.137271,17.809745 10.292969,18.625 l -3.9433596,3.802734 h -0.00195 c -0.8651932,0.836135 -0.8773048,2.249903 -0.027344,3.101563 v 0.002 L 18.208984,37.416016 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013672,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815986 -0.98915,-0.6237833 -1.5625,-0.6054689 z m 0.06445,1.9980469 c -0.0039,1.25e-4 0.03782,-0.01158 0.171875,0.105469 0.0018,0.0016 1.32e-4,3.45e-4 0.002,0.002 l 4.058594,3.912109 c 0.0798,0.07683 0.08021,0.171302 0.002,0.25 v 0.002 L 19.873047,36 c -0.07744,0.07811 -0.172347,0.07971 -0.25,0.002 V 36 L 7.7363281,24.117187 c -0.077774,-0.07793 -0.076039,-0.173169 0.00195,-0.25 l 3.9433598,-3.802734 c 0.0771,-0.07444 0.172045,-0.07362 0.248047,0.002 l 7.818359,7.796875 15.804687,-16.207031 0.002,-0.002 c 0.08804,-0.0913 0.103575,-0.0763 0.09961,-0.07617 z"
                :fill="disabled || !authenticated ? 'grey' : '#0187f3'"
              />
            </svg>
          </v-btn>
        </template>
        <v-card max-height="300">
          <v-list class="px-3">
            <v-list-item-title class="text-center"> give a check! </v-list-item-title>
            <v-list-item v-for="(member, m) in checks" :key="m" style="min-height: 35px !important">
              <member-item :id="member" :options="['username']" :align="'left'" :size="25" :height="35" />
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
    give a check
  </v-tooltip>
</template>

<script>
import MemberItem from '../lists/MemberItem.vue';
import { mapState } from 'vuex';

export default {
  name: 'PostPortifolio',
  props: { post: Object, disabled: Boolean },
  components: {
    MemberItem,
  },
  data() {
    return {
      hovering: false,
      checks: [],
    };
  },
  mounted() {
    this.getChecks();
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    checked() {
      return this.checks.find((c) => c == this.member.id) ? true : false;
    },
    checkCount() {
      return this.checks.length || 0;
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  methods: {
    async getChecks() {
      this.$store.dispatch('post/GET_FIELD', { task: this.post.data.task, field: 'checks' }).then((checks) => {
        this.checks = checks.map((c) => c.member);
      });
    },
    check() {
      if (this.checked) return;
      this.$store.dispatch('post/CHECK', { post: this.post.id, member: this.member.id }).then((checks) => {
        this.checks = checks.map((c) => c.member);
      });
    },
  },
};
</script>
