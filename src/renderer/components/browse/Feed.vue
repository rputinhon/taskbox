<template>
  <v-sheet ref="feed" width="100%" height="calc(100vh - 35px)" class="overflow-y-auto py-6" color="workspace" @scroll="scroll">
    <v-tooltip v-if="authenticated" bottom transition="none">
      <template v-slot:activator="{ on }">
        <v-fade-transition>
          <v-btn class="mt-8" top small right v-on="on" absolute fab color="primary" @click="goToFeed()">
            <member-item :size="40" :options="['onlyAvatar', 'bordered']" :id="profile.id" />
          </v-btn>
        </v-fade-transition>
      </template>
      my feed
    </v-tooltip>
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on }">
        <v-fade-transition>
          <v-btn class="mt-9 mr-12" v-show="showGoUp" top small right v-on="on" fixed fab color="primary" @click="goUp()">
            <svg width="27" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" :fill="'white'" />
            </svg>
          </v-btn>
        </v-fade-transition>
      </template>
      go up
    </v-tooltip>
    <v-row class="pa-5 pt-0">
      <v-col v-for="(post, i) in posts" :key="i" :lg="showingMemberArea ? 6 : 4" md="6" sm="7.5" xl="3" cols="12" class="pa-3">
        <v-lazy  class="fill-height">
          <post :post="post" :key="i" @update="getPost(i, post.id)" />
        </v-lazy>
      </v-col>
    </v-row>
    <empty
      v-if="posts.length == 0"
      :loading="loading"
      :text="'empty'"
      :image="'img/globe_128.png'"
    />
  </v-sheet>
  <!-- </v-sheet> -->
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import Empty from '../dialogs/Empty.vue';
import MemberItem from '../lists/MemberItem.vue';
import Post from './Post.vue';

export default {
  components: { Empty, Post, MemberItem },
  props: { showing: Boolean },
  name: 'Feed',
  data: () => ({
    tab: 1,
    searching: false,
    hovering: null,
    loading: false,
    filter: undefined,
    showGoUp: false,
  }),
  created() {
    eventBus.$on('updatePost', () => {
      this.$nextTick(() => {
        this.getPosts(false);
      });
    });

    eventBus.$on('refresh', (window) => {
      if (window == 'feed') {
        this.getPosts(true);
      }
    });
  },
  async mounted() {
    this.getPosts(false);
  },
  watch: {
    mainTab(value) {
      if (value == 1 && this.posts.length == 0) this.getPosts(true);
    },
    filter() {
      this.getPosts(true);
    },
  },
  computed: {
    ...mapState({
      posts: (state) => state.post.posts,
      profile: (state) => state.user.profile,
      mainTab: (state) => state.app.mainTab,
      currentUserFeed: (state) => state.app.userFeed,
      showingMemberArea: (state) => state.app.showMemberArea,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  methods: {
    goToFeed() {
      this.$store.commit('post/CLEAR_PERSONAL');
      this.$store.commit('app/SET_USER_FEED', this.profile);
      this.$store.commit('app/SET_MAIN_TAB', 1);
    },
    goUp() {
      const container = this.$refs.feed;
      container.$el.scrollTop = 0;
    },
    scroll(e) {
      const { target } = e;
      if (target.scrollTop > 300) this.showGoUp = true;
      else this.showGoUp = false;

      if (Math.ceil(target.scrollTop) >= target.scrollHeight - target.offsetHeight - 600 && !this.loading) this.getPosts(false);
    },
    async getPosts(clear) {
      this.loading = true;
      this.$store.dispatch('post/FETCH', { filter: this.filter, personal: false, clear: clear }).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.feed {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
