<template>
  <v-menu rounded="0" left offset-y light :close-on-content-click="false">
    <template v-slot:activator="{ on: menu }">
      <v-badge :value="false" dot overlap color="error">
        <v-btn v-on="{ ...menu }" elevation="0" fab x-small icon class="windowbar-button px-0">
          <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
              fill="#1070ff"
            />
          </svg>
        </v-btn>
      </v-badge>
    </template>
    <v-card width="400" max-height="600px" class="overflow-y-auto">
      <span style="position: absolute; z-index: 10; left: 15px; top: 10px" v-text="memberTab == 0 ? 'Workers' : 'Members'"> </span>
      <v-tabs v-model="memberTab" centered right>
        <v-tab class="pa-3" style="min-width: 50px; max-width: 50px">
          <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              :style="memberTab !== 0 && 'filter:grayscale(1)'"
              d="m 23.794017,2.7458747 c -0.301993,5.64e-4 -0.603991,0.116771 -0.833544,0.3483 L 2.9456758,23.244884 c -0.4633701,0.465958 -0.4552633,1.2212 0.018087,1.6769 l 4.0896725,3.94136 c 0.5706665,0.503799 1.1924215,0.455623 1.6557122,-0.0248 L 23.804867,13.358668 30.909342,20.44144 c 0.454121,0.451561 1.186228,0.457253 1.646928,0.0124 l 3.943946,-3.801835 c 0.472511,-0.456641 0.479147,-1.211799 0.01499,-1.6769 L 24.628589,3.0910737 c -0.230383,-0.230679 -0.532582,-0.34576 -0.834572,-0.345199 z M 39.70364,18.404869 c -0.284694,0.0091 -0.555906,0.141674 -0.787551,0.381889 l -15.096236,15.479675 -7.104475,-7.08329 c -0.45412,-0.451559 -1.185712,-0.456734 -1.646412,-0.01189 l -3.944461,3.801835 c -0.472509,0.456639 -0.479155,1.2118 -0.01499,1.6769 l 11.887128,11.88403 c 0.460772,0.46136 1.2085,0.45996 1.6676,-0.0031 l 20.01532,-20.150704 c 0.46337,-0.465961 0.454785,-1.221201 -0.01861,-1.6769 L 40.571801,18.761953 C 40.286467,18.510054 39.988332,18.395775 39.70364,18.404869 Z"
              fill="#1070ff"
            />
          </svg>
        </v-tab>
        <v-tab class="pa-3" style="min-width: 50px; max-width: 50px">
          <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              :style="memberTab !== 1 && 'filter:grayscale(1)'"
              d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
              fill="#1070ff"
            />
          </svg>
        </v-tab>
        <v-tab-item>
          <v-card v-for="(member, i) in invitations" :key="i">
            <v-list-item>
              <v-list-item-avatar class="mr-4" color="grey" size="30">
                <v-img v-if="member.profilePicture" :src="member.profilePicture" />
                <svg version="1.1" height="30px" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                  <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-left" v-html="member.username" />
                <v-list-item-subtitle class="text-left"> Is asking to connect with you. </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn x-small rounded color="primary" @click="acceptInvitation(member.invitationId)">
                  accept
                  <!-- <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " 
                    fill="#0187f3" />
                  </svg> -->
                </v-btn>
              </v-list-item-action>
              <!-- <v-btn fab icon x-small>
                  <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="#0187f3" />
                  </svg>
                </v-btn> -->
            </v-list-item>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-autocomplete :loading="isLoading" v-model="invitingMember" hide-no-data autofocus item-text="name" item-value="name" :items="memberItems" :search-input.sync="searchMember" height="35px" dense hide-details="true" filled ref="members" placeholder="Search for people">
            <template v-slot:item="data">
              <v-list-item-avatar color="grey" size="30">
                <v-img v-if="data.item.avatar" :src="data.item.avatar" />
                <svg v-else version="1.1" height="20px" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                  <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-list-item-avatar>
              <v-list-item-title class="text-left" v-html="data.item.name" />
              <v-btn right :color="memberStatus(data.item.id) ? memberStatus(data.item.id).color : 'primary'" class="mt-2" rounded x-small @click="!isMember(data.item.id) && inviteMember(data.item.id)" v-text="memberStatus(data.item.id) ? memberStatus(data.item.id).text : 'invite'"></v-btn>
            </template>
            <template v-slot:prepend-inner>
              <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
              </svg>
            </template>
          </v-autocomplete>
          <v-list>
            <v-list-item v-for="(member, m) in people" :key="m">
              <v-list-item-avatar class="mr-4" color="grey" size="30">
                <v-img v-if="member.avatar" :src="member.avatar" />
                <svg v-else version="1.1" height="30px" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                  <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-list-item-avatar>
              <v-list-item-title class="text-left" v-html="member.name" />
              <v-btn right x-small rounded :color="status(member.status).color">
                {{ status(member.status).text }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import memberstatus, { getMemberStatusByValue } from '../../enums/memberstatus';
import { memberRepository } from '../../store/modules/user/profileRepository';
export default {
  name: 'Members',
  props: {},
  data() {
    return {
      memberTab: 0,
      isLoading: false,
      search: null,
      searchMember: null,
      memberItems: [],
      invitingMember: null,
    };
  },
  watch: {
    async searchMember(value) {
      // if (this.memberItems.length > 0) return;
      if (this.isLoading && !value) return;
      this.isLoading = true;

      await memberRepository
        .search(value)
        .then((res) => {
          this.$nextTick(() => {
            this.memberItems = res;
          });
        })
        .catch((err) => {
          this.$store.commit('SET_ERROR_STATE', err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    ...mapState({
      people: (state) => state.user.members,
      invitations: (state) => state.invitation.invitationsToMe,
    }),
    members() {
      return this.people.filter((p) => p.status == memberstatus.MEMBER.value);
    },
  },
  methods: {
    isMember(id) {
      return this.members.find((m) => m.id == id);
    },
    inviteMember(id) {
      this.invitingMember = null;
      this.$refs.members.blur();
      this.$store.dispatch('invitation/INVITE_MEMBER', id).then(() => {});
    },
    acceptInvitation(id) {
      // if (this.isMember(id)) return;
      this.$store.dispatch('invitation/ACCEPT_INVITATION', id).then(() => {});
    },
    status(s) {
      return getMemberStatusByValue(s || 0);
    },
    memberStatus(id) {
      let member = this.people.find((m) => m.id == id);
      return member ? getMemberStatusByValue(member.status) : false;
    },
    async getMember(id) {
      let member = await memberRepository.get(id, ['_id', 'data.id', 'data.username', 'data.profilePicture']);
      console.log(member);
      return member;
    },
  },
};
</script>
