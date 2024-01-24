<template>
  <v-sheet ref="feed" width="100%" height="calc(100vh - 40px)" class="overflow-y-auto" color="background" @scroll="scroll">
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on }">
        <v-fade-transition>
          <v-btn class="mt-8" v-show="showGoUp" top small right v-on="on" fixed fab color="primary" @click="goUp()">
            <svg width="27" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" :fill="'white'" />
            </svg>
          </v-btn>
        </v-fade-transition>
      </template>
      go up
    </v-tooltip>
    <v-app-bar elevation="2" height="150" :src="userProfile.coverPicture">
      <member-item :size="90" :options="['bordered','session']" :align="'left'" :id="!loggedUser ? userProfile.id : null" :subtitle="session.text" :extraClass="'ma-6'" />
      <v-btn v-if="loggedUser" absolute left style="margin-top: 50px" fab x-small @click="selectAvatar()">
        <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
            fill="#353535"
            style="pointer-events: none"
          />
        </svg>
      </v-btn>
      <v-btn class="windowbar-button ma-0 mt-6" absolute top right v-if="loggedUser" fab x-small @click="selectCover()">
        <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
            fill="#353535"
            style="pointer-events: none"
          />
        </svg>
      </v-btn>
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on }">
          <v-fade-transition>
            <v-btn v-show="loggedUser" right bottom v-on="on" fixed fab color="primary" @click="createPost()">
              <svg width="27" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 23.660023,6.6275345 c -1.015496,0 -1.833589,0.8180926 -1.833589,1.8335892 V 21.826434 H 8.4611237 c -1.0154966,0 -1.8335892,0.818093 -1.8335892,1.833589 v 0.304954 c 0,1.015496 0.8180926,1.833589 1.8335892,1.833589 H 21.826434 v 13.36531 c 0,1.015498 0.818093,1.833588 1.833589,1.833588 h 0.304954 c 1.015496,0 1.833589,-0.81809 1.833589,-1.833588 v -13.36531 h 13.36531 c 1.015498,0 1.833588,-0.818093 1.833588,-1.833589 v -0.304954 c 0,-1.015496 -0.81809,-1.833589 -1.833588,-1.833589 H 25.798566 V 8.4611237 c 0,-1.0154966 -0.818093,-1.8335892 -1.833589,-1.8335892 z" :fill="'white'" />
              </svg>
            </v-btn>
          </v-fade-transition>
        </template>
        new publication
      </v-tooltip>
      <v-btn v-show="!loggedUser" :ripple="false" v-if="authenticated" fixed right small :color="!following ? 'white' : 'primary'" class="mr-5" v-text="following ? 'following' : 'follow'" @click="following ? unfollow() : follow()"> </v-btn>
    </v-app-bar>
    <v-row no-gutters align="center" class="pa-5 pt-6" style="min-height: calc(100vh - 190px)">
      <v-col v-for="(post, i) in filteredList(posts, 'title')" :key="i" :lg="showingMemberArea ? 6 : 4" md="6" sm="7.5" xl="3" cols="12" class="pa-3">
        <v-lazy class="fill-height">
          <post class="mx-auto" :post="post" />
        </v-lazy>
      </v-col>
      <empty
        v-if="posts.length == 0"
        :loading="loading"
        :icon="'m 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z'"
        :text="' '"
      />
    </v-row>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import Empty from '../dialogs/Empty.vue';
import { eventBus } from '../../../main';
import _ from 'lodash';
import Post from './Post.vue';
import MemberItem from '../lists/MemberItem.vue';
import { ipcRenderer, nativeImage } from 'electron';

export default {
  name: 'UserFeed',
  components: { Empty, Post, MemberItem },
  data: () => ({
    loading: false,
    saving: false,
    showGoUp: false,
    filter: null,
    searching: false,
  }),
  created() {
    eventBus.$on('updatePost', () => {
      this.getPosts(false);
    });

    eventBus.$on('refresh', (window) => {
      if (window == 'myfeed') {
        this.getPosts(true);
      }
    });
  },
  mounted() {
    this.getPosts(true);
  },
  watch: {
    feedProfile(value) {
      if (value) {
        this.getPosts(true);
      }
    },
    filter() {
      this.getPosts(true);
    },
  },
  computed: {
    ...mapState({
      searchValue: (state) => state.app.search,
      posts: (state) => state.post.personal,
      myTasks: (state) => _.cloneDeep(Object.values(state.taskbox.myTasks)),
      feedProfile: (state) => state.app.userFeed,
      showingMemberArea: (state) => state.app.showMemberArea,
      currentUserProfile: (state) => _.cloneDeep(state.user.profile),
      session: (state) => state.user.session.authenticated,
    }),
    search: {
      get() {
        return this.searchValue;
      },
      set(value) {
        this.$store.commit('app/SEARCH', value);
      },
    },
    userProfile() {
      return this.loggedUser ? this.currentUserProfile : this.feedProfile;
    },
    loggedUser() {
      return this.feedProfile.id == this.currentUserProfile.id;
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    following() {
      return this.currentUserProfile.following && this.currentUserProfile.following.includes(this.feedProfile.id);
    },
  },
  methods: {
    // Feed (Posts)
    createPost() {
      this.$store.commit('post/OPEN_POST_CREATOR', { postType: 0 });
    },
    follow() {
      this.$store.dispatch('user/FOLLOW', this.feedProfile.id);
    },
    unfollow() {
      this.$store.dispatch('user/UNFOLLOW', this.feedProfile.id);
    },
    refresh() {
      this.getPosts(true);
    },
    filteredList(list, field, filter) {
      let searchResult = this.searchValue ? list.filter((item) => item[field] && item[field].toLowerCase().includes(this.search)):list;
      if (!filter) return searchResult;
      else {
        return searchResult.filter((item) => filter.value.includes(item[filter.field]));
      }
    },
    signout() {
      this.$store
        .dispatch('user/LOGOUT')
        .then(() => {})
        .catch((error) => console.log(error));
    },
    scroll(e) {
      const { target } = e;
      if (target.scrollTop > 300) this.showGoUp = true;
      else this.showGoUp = false;

      if (Math.ceil(target.scrollTop) >= target.scrollHeight - target.offsetHeight - 600 && !this.loading) this.getPosts(false);
    },
    goUp() {
      const container = this.$refs.feed;
      container.$el.scrollTop = 0;
    },
    async getPosts(clear) {
      this.loading = true;
      this.$store.dispatch('post/FETCH_PERSONAL', { filter: this.filter, member: this.feedProfile.id, clear: clear }).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    updateProfile() {
      this.$store.commit('user/SET_PROFILE', this.userProfile);
    },
    saveProfile() {
      this.saving = true;
      this.$store
        .dispatch('user/UPDATE_PROFILE', this.userProfile)
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.saving = false;
        });
    },
    selectAvatar() {
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (avatar) => {
        if (avatar == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(avatar[0], { width: 128, height: 128 });
        this.userProfile.profilePicture = clip.toDataURL();
        this.saveProfile();
      });
    },
    selectCover() {
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (cover) => {
        if (cover == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(cover[0], { width: 512, height: 128 });
        this.userProfile.coverPicture = clip.toDataURL();
        this.saveProfile();
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
