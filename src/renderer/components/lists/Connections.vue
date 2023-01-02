<template>
  <v-card flat color="background" width="100%" :height="height || 'calc(100vh - 40px)'">
    <v-card-title class="text-subtitle-1 py-0 my-0" v-if="!searching">
      <v-list-item class="ma-0 pa-0" style="min-height: 30px; width: 100%">
        <v-list-item-icon v-if="false" class="pa-0 mr-1">
          <svg class="mr-2" style="pointer-events: none" width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
              fill="#0187f3"
            />
          </svg>
        </v-list-item-icon>
        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> Members </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab :loading="loading" @click="refresh()">
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
        </v-list-item-action>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="searching = true">
                <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M 20.279297 9.6289062 L 20.279297 20.279297 L 9.6289062 20.279297 L 9.6289062 27.720703 L 20.279297 27.720703 L 20.279297 38.371094 L 27.720703 38.371094 L 27.720703 27.720703 L 38.371094 27.720703 L 38.371094 20.279297 L 27.720703 20.279297 L 27.720703 9.6289062 L 20.279297 9.6289062 z " fill="grey" />
                </svg>
              </v-btn>
            </template>
            add member
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-card-title>
    <v-card-title v-else class="py-0" style="height: 56px">
      <search :options="['profile']" :local="'for members'" />
      <v-btn class="ml-2" color="primary" rounded x-small @click="(searching = false), (search = null)">close</v-btn>
    </v-card-title>
    <v-list v-for="(invitation, m) in invitations" :key="m + invitation.id" class="ma-0 pa-0" color="transparent">
      <v-list-item link style="text-align: left" class="mx-0">
        <member-item :id="invitation.host" :isInvitation="true" :subtitle="'Is asking to connect with you.'" :options="['status']" @statusAction="'';" />
        <v-list-item-action>
          <v-btn x-small color="accent" @click="accept(invitation.id)"> accept </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn x-small icon fab color="error" @click="deleteConnection(invitation.id)">
            <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#ff5555" />
            </svg>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-list v-for="(member, m) in memberList" :key="m + member" class="ma-0 pa-0" color="transparent">
      <v-list-item link style="text-align: left" class="mx-0">
        <member-item :id="member.member" :options="['status']" :subtitle="connectionStatus(member.member).message" @statusAction="'';" />
        <v-list-item-action v-for="(action, a) in connectionStatus(member.member).actions" :key="a">
          <v-btn v-if="!isMember(member.member)" x-small :depressed="!action.action" :color="action.color"> {{ action.text }} </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn v-if="!isMember(member.member)" x-small fab icon color="error" @click="deleteConnection(member.connection)">
            <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#ff5555" />
            </svg>
          </v-btn>
          <member-menu v-else :member="member.member" />
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <empty
      v-if="isEmpty"
      :size="90"
      :extraClass="'mb-16'"
      :text="' '"
      :icon="'m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z'"
    />
  </v-card>
</template>

<script>
import MemberItem from './MemberItem.vue';

import { mapState } from 'vuex';

import Empty from '../dialogs/Empty.vue';
import { connectionStatus, getConnectionStatusByValue } from '../../store/models/ConnectionModel';
import MemberMenu from '../menus/MemberMenu.vue';
import Search from '../browse/Search.vue';

export default {
  props: { height: String },
  components: {
    MemberItem,
    Empty,
    MemberMenu,
    Search,
  },
  data() {
    return {
      loading: false,
      searching: false,
      search: null,
    };
  },

  computed: {
    ...mapState({
      invited: (state) => state.connection.invited,
      members: (state) => state.connection.members,
      blocked: (state) => state.connection.blocked,
      canceled: (state) => state.connection.canceled,
      invitations: (state) => state.connection.invitations,
    }),
    isEmpty() {
      return this.memberList.concat(this.invitations).length == 0 ? true : false;
    },
    memberList() {
      return this.members.concat(this.blocked, this.canceled, this.invited);
    },
  },
  methods: {
    getInvition(id) {
      return this.invitations.find((c) => c.host == id);
    },
    isInvition(id) {
      return this.invitations.find((c) => c.host == id) ? true : false;
    },
    isMember(member) {
      return this.members.map((e) => e.member).includes(member);
    },
    statusAction(action, value) {
      if (!action) return;
      this.loading = true;
      this.$store.dispatch(action, value).then(() => {
        this.refresh();
      });
    },
    accept(connection) {
      this.loading = true;
      this.$store.dispatch('connection/ACCEPT', connection).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    deleteConnection(connection) {
      this.loading = true;
      this.$store.dispatch('connection/DELETE', connection).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    connectionStatus(member) {
      if (this.invited.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.INVITED.value);
      if (this.members.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.ACCEPTED.value);
      if (this.blocked.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.BLOCKED.value);
      if (this.canceled.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.CANCELED.value);
      return getConnectionStatusByValue(connectionStatus.UNEXISTENT.value);
    },
    refresh() {
      this.loading = true;
      this.$store.dispatch('connection/GET_ALL').then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
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
  background-color: #eeeeee !important;
  overflow-x: visible !important;
}
.people {
  background-color: #eeeeee;
  padding: 10px 20px 10px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 500px;
  min-height: calc(100vh - 40px) !important;
  max-height: calc(100vh - 40px) !important;
}
</style>
