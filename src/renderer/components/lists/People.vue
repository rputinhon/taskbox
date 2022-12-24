<template>
  <v-sheet class="pa-3" width="100%" color="overflow-y-auto grey lighten-2">
    <v-card-title>
      <svg class="mr-2" style="pointer-events: none" width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path
          d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
          fill="#0187f3"
        />
      </svg>
      People
      <v-spacer></v-spacer>
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon x-small fab class="ml-4" :loading="loading" @click="updateList()">
            <svg style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path
                d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                fill="grey"
              />
            </svg>
          </v-btn>
        </template>
        refresh
      </v-tooltip>
    </v-card-title>
    <v-autocomplete v-model="invitingMember" hide-no-data autofocus item-text="name" item-value="name" :items="memberItems" :search-input.sync="searchMember" height="35px" dense hide-details="true" solo ref="members" placeholder="Search for people" rounded>
      <template v-slot:item="data">
        <v-list-item-avatar>
          <v-img :src="data.item.avatar" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name" />
        </v-list-item-content>
        <v-list-item-icon>
          <v-btn :color="memberStatus(data.item.id) ? memberStatus(data.item.id).color : 'grey'" class="mt-2" rounded x-small @click="!isMember(data.item.id) && inviteMember()" v-text="memberStatus(data.item.id) ? memberStatus(data.item.id).text : 'not member'"></v-btn>
        </v-list-item-icon>
      </template>
      <template v-slot:prepend-inner>
        <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
        </svg>
      </template>
    </v-autocomplete>
    <v-list-item-subtitle class="error--text">
      {{ notification.members.hasPendingMembers.value ? notification.members.hasPendingMembers.message : '' }}
    </v-list-item-subtitle>
    <v-list v-for="invitation in invitationsSent" :key="invitation.invited" class="py-0 my-0">
      <invitation-item :invitation="invitation" :invitator="userProfile.id" :profile="userProfile" />
    </v-list>
    <v-list class="py-0 my-0 mt-5">
      <member-item v-for="(member, i) in members" :key="i" :invitation="false" :member="member" @Delete="DELETEMEMBER(member)" />
    </v-list>
    <empty
      v-if="members.length == 0"
      :text="'no team'"
      :icon="'m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z'"
    />
  </v-sheet>
</template>

<script>
import InvitationItem from './InvitationItem.vue';
import MemberItem from './MemberItem.vue';

import { mapState } from 'vuex';
import { memberRepository } from '../../store/modules/user/profileRepository';
import { nextTick } from 'process';

import _ from 'lodash';
import Empty from '../dialogs/Empty.vue';
import { getMemberStatusByValue } from '../../enums/memberstatus';

export default {
  components: {
    MemberItem,
    InvitationItem,
    Empty,
  },
  data() {
    return {
      loading: false,
      teamTab: 0,
      searching: false,
      inviting: false,
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
          nextTick(() => {
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
      appSettings: (state) => _.cloneDeep(state.app.appSettings),
      invitations: (state) => _.cloneDeep(state.invitation.invitations),
      notification: (state) => _.cloneDeep(state.notification),
      members: (state) => _.cloneDeep(state.user.members),
      userProfile: (state) => _.cloneDeep(state.user.profile),
      serverSettings: (state) => _.cloneDeep(state.app.serverSettings),
      server: (state) => state.app.server,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    invitationsSent() {
      return [];
      // let invitations = this.invitations.send.filter((i) => i.invitator == this.userProfile.id);
      // invitations.map((i) => {
      //   if (i.status.value == memberstatus.MEMBER.value) this.$store.dispatch('user/ADD_MEMBER', { team: null, member: i.invited, invitation: i.id, tasks: [] });
      // });
      // return invitations.filter((i) => i.status.value <= 1);
    },
    invitationsReceived() {
      return [];
      // let invitations = this.invitations.filter((i) => i.invited == this.userProfile.id);
      // invitations.map((i) => {
      //   if (i.status.value == memberstatus.INVITED.value) this.$store.dispatch('invitation/CHANGE_INVITE_STATUS', { id: i.id, status: memberstatus.RECEIVED });
      // });

      // return invitations;
    },
  },
  methods: {
    memberStatus(id) {
      let member = this.members.find((m) => m.id == id);
      return member ? getMemberStatusByValue(member.status) : false;
    },
    async isInvited(id) {
      return await this.$store.dispatch('invitation/IS_INVITED', id);
    },
    inviteMember() {
      this.invitingMember = null;
      this.$refs.members.blur();
      this.$store.dispatch('invitation/INVITE_MEMBER', this.memberItems[0].id).then(() => {
        this.updateList();
      });
    },
    async updateList() {
      this.loading = true;
      this.$store.dispatch('user/GET_MEMBERS').then(() => {
        this.$store.dispatch('invitation/FETCH_ALL').then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
      });
    },
  },
};
</script>

<style>
.v-slide-group__content {
  background-color: transparent !important;
}

.theme--light.v-tabs-items {
  background-color: #e0e0e0 !important;
  overflow-x: visible !important;
}
.people {
  background-color: #e0e0e0;
  padding: 10px 20px 10px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 500px;
  min-height: calc(100vh - 40px) !important;
  max-height: calc(100vh - 40px) !important;
}
</style>
