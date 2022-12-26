<template>
  <v-autocomplete rounded autofocus dense solo :dark="dark" color="primary" :background-color="!dark ? 'grey lighten-2' : ''" flat :loading="loading" hide-no-data item-text="name" item-value="name" :items="searchItems" :search-input.sync="search" hide-details="true" ref="searchbar" :placeholder="`Search ${local}`" style="max-heigth: 30px" @blur="clearSearch()">
    <template v-slot:item="data">
      <div style="width: 100%" v-if="data.item.type == 'profile'" @click="goToProfile(data.item.id)">
        <member-item :id="data.item.id" :subtitle="invitating(data.item.id) ? 'Is asking to connect with you.' : ''" :options="['username', 'connectionActions']" :align="'left'" />
      </div>
      <v-list-item v-else-if="data.item.type == 'post'" @click="openPost(data.item)">
        <post-item :post="data.item" />
      </v-list-item>
    </template>
    <template v-slot:prepend-inner>
      <svg  style="margin-left:-15px;pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
      </svg>
    </template>
    <template v-slot:append>
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on }">
          <v-btn style="margin-right:-15px" :loading="loading" v-on="on" fab icon x-small @dblclick.stop @click.stop="update()">
            <svg style="pointer-events: none" width="21" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path
                d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                fill="grey"
              />
            </svg>
          </v-btn>
        </template>
        refresh
      </v-tooltip>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { postRepository } from '../../store/modules/post/postRepository';
import { memberRepository } from '../../store/modules/user/profileRepository';
import MemberItem from '../lists/MemberItem.vue';
import PostItem from '../browse/PostItem.vue';

export default {
  name: 'MemberArea',
  props: { options: Array, local: String, isFilter: Boolean, refresh: String, dark: Boolean },
  components: {
    MemberItem,
    PostItem,
  },
  data() {
    return {
      loading: false,
      searching: false,
      profileSearch: [],
      postSearch: [],
      searchItems: [],
    };
  },
  watch: {
    async search(value) {
      if (this.isFilter) return;
      if (!value) return this.clearSearch();
      if (this.loading || value.trim().length == 0) return this.clearSearch();
      this.loading = true;

      if (this.options.includes('profile'))
        await memberRepository
          .search(value)
          .then((res) => {
            if (res) {
              this.profileSearch = res.filter((p) => p.id !== this.profile.id);
              this.searchItems = this.searchItems.concat(this.profileSearch);
            } else {
              this.profileSearch = [];
            }
          })
          .catch((err) => {
            this.$store.commit('SET_ERROR_STATE', err);
          })
          .finally(() => (this.loading = false));

      if (this.options.includes('post')) {
        let criteria = {
          selector: {
            ['data.title']: { $regex: RegExp(value.toLowerCase(), 'i') },
          },
        };

        await postRepository
          .search(criteria)
          .then((res) => {
            if (res) {
              this.postSearch = res.map((s) => {
                Object.assign(s, { name: s.title });
                return s;
              });
              this.searchItems = this.searchItems.concat(this.postSearch);
            } else {
              this.postSearch = [];
            }
          })
          .catch((err) => {
            this.$store.commit('SET_ERROR_STATE', err);
          })
          .finally(() => (this.loading = false));
      }
    },
  },
  computed: {
    ...mapState({
      searchValue: (state) => state.app.search,
      mainTab: (state) => state.app.mainTab,
      feedProfile: (state) => state.app.userFeed,
      // current user info
      profile: (state) => state.user.profile,
      members: (state) => state.connection.members,
      invitations: (state) => state.connection.invitations,
    }),
    search: {
      get() {
        return this.searchValue;
      },
      set(value) {
        this.$store.commit('app/SEARCH', value);
      },
    },
  },
  methods: {
    invitating(id) {
      let value = this.invitations.find((i) => i.host == id && i.status == 0);
      return value;
    },
    isMember(member) {
      return this.members.map((e) => e.member).includes(member);
    },
    goToProfile(id) {
      this.$store.commit('post/CLEAR_PERSONAL');
      this.$store.dispatch('user/GET_PROFILE', id).then((profile) => {
        this.$store.commit('app/SET_USER_FEED', profile);
        this.$store.commit('app/SET_MAIN_TAB', 1);
      });
    },
    openPost(post) {
      console.log(post);
      this.$store.commit('post/PREVIEW_POST', post);
    },
    update() {
      this.loading = true;
      eventBus.$emit('refresh', this.refresh);
      setTimeout(() => {
        this.loading = false;
      }, 700);
    },
    clearSearch() {
      this.search = null;
      this.searchItems = [];
    },
  },
};
</script>
