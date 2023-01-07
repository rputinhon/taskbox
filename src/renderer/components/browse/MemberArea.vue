<template>
  <v-sheet ref="feed" width="100%" height="calc(100vh - 40px)" style="margin-top: 40px; overflow: hidden" :color="analysing == false ? 'transparent' : 'workspace'">
    <v-app-bar fixed height="40" flat :color="analysing == false ? 'transparent' : 'workspace'">
      <v-img class="ml-2" v-if="!authenticated" contain :style="memberTab !== 0 && 'filter: grayscale(1)!important;'" src="img/logo_worm_32_flat.png" max-width="32px"/>
      <v-spacer> </v-spacer>
      <v-tabs v-if="authenticated" class="mr-1" hide-slider v-model="memberTab" height="40">
        <v-tab :style="`min-width: 50px;`" class="pa-1 windowbar-button" @click="showTaskBox()">
          <v-img contain :style="memberTab !== 0 && 'filter: grayscale(1)!important;'" src="img/logo_worm_32_flat.png" max-width="32px"  />
        </v-tab>
        <!-- <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-3 windowbar-button">
          <v-badge color="primary" left offset-x="38" bottom offset-y="17" :value="hasTasks" dot />
          <svg version="1.1" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :style="memberTab !== 1 && 'filter:grayscale(1)'" d="m 27.869099,7.3592406 c -0.0059,0.00582 -0.01175,0.011671 -0.01757,0.017571 L 15.712736,19.593636 11.775508,15.802653 c -2.3844606,-2.296403 -6.2323023,-2.22586 -8.5291946,0.15813 -2.29821147,2.38477 -2.2261004,6.2341 0.1596802,8.531262 v 0.0021 l 8.2170694,7.910114 c 2.359122,2.270783 6.1547,2.228842 8.463049,-0.09354 L 36.41018,15.884818 C 38.744077,13.536056 38.731785,9.6851501 36.38279,7.3514891 36.35686,7.3260311 36.33015,7.3013871 36.30269,7.2775921 33.709749,5.197852 30.043786,5.30006 27.869096,7.3592411 Z" :fill="'#0187f3'" />
          </svg>
        </v-tab>
        <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-2 windowbar-button">
          <v-badge color="primary" left offset-x="38" bottom offset-y="17" :value="hasInvitations" dot />
          <svg height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              :style="memberTab !== 2 && 'filter:grayscale(1)'"
              d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
              :fill="'#0187f3'"
            />
          </svg>
        </v-tab> -->
      </v-tabs>

      <v-btn icon fab x-small class="windowbar-button mr-3 ml-0" @click="close()">
        <svg style="transform: rotate(90deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" stroke="#0187f3" stroke-width="5" fill="#0187f3" />
        </svg>
      </v-btn>
      <v-divider vertical class="mr-0"></v-divider>
      <v-progress-linear v-if="working" indeterminate top fixed class="mt-10" />
    </v-app-bar>

    <v-tabs v-model="memberTab" height="0" color="grey">
      <v-tab-item tabindex="0" style="overflow: hidden !important" >
        <home @newProject="$emit('newProject')" />
      </v-tab-item>
      <!-- <v-tab-item tabindex="0" eager v-if="authenticated">
        <div class="mx-0" :style="`width:100%;overflow-y: scroll !important;`">
          <v-layout align-center justify-start column fill-height>
            <tasks-pannel :group="false" :icon="'m 27.869099,7.3592406 c -0.0059,0.00582 -0.01175,0.011671 -0.01757,0.017571 L 15.712736,19.593636 11.775508,15.802653 c -2.3844606,-2.296403 -6.2323023,-2.22586 -8.5291946,0.15813 -2.29821147,2.38477 -2.2261004,6.2341 0.1596802,8.531262 v 0.0021 l 8.2170694,7.910114 c 2.359122,2.270783 6.1547,2.228842 8.463049,-0.09354 L 36.41018,15.884818 C 38.744077,13.536056 38.731785,9.6851501 36.38279,7.3514891 36.35686,7.3260311 36.33015,7.3013871 36.30269,7.2775921 33.709749,5.197852 30.043786,5.30006 27.869096,7.3592411 Z'" :title="'Personal Tasks'" :subtitle="`${TaskDoneCount} of ${TaskTotalCount - TaskCanceledCount} task(s) done.`" :taskboxList="myTaskboxes" :filtering="filtering" :taskList="filteredList(myTasks, 'title', { value: filter, field: 'status' })" :refreshing="refreshing" @refresh="getTasks(true)" @mounting="setMounting" />
          </v-layout>
        </div>
      </v-tab-item>
      <v-tab-item tabindex="1" v-if="authenticated" style="overflow: hidden !important">
        <div class="mx-0" :style="`width:100%;height: calc(100vh - 40px);overflow-y: scroll !important;`">
          <v-layout align-center justify-start column>
            <connections />
          </v-layout>
        </div>
      </v-tab-item> -->
    </v-tabs>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { connectionStatus, getConnectionStatusByValue } from '../../store/models/ConnectionModel';

import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';

// import Connections from '../lists/Connections.vue';
// import TasksPannel from '../lists/TasksPannel.vue';
import Home from '../dialogs/Home.vue';
import { eventBus } from '../../../main';

export default {
  name: 'MemberArea',
  props: { showing: Boolean },
  components: {
    // Empty,
    // Connections,
    // Post,
    // TasksPannel,
    Home,
  },
  data() {
    return {
      loading: false,
      working:false,
      filtering: false,
      refreshing: false,
      searching: false,
      saving: false,
      search: null,
      refreshkey:0
    };
  },
  created(){
    eventBus.$on('setWorking',(value)=>{
      this.working=value;
    })

    eventBus.$on('updateTasks',()=>{
      this.refreshkey++;
    })

  },
  watch: {
    loading(value){
      this.working = value;
    },
    authenticated(value) {
      if (!value) this.memberTab = 0;
    },
  },
  computed: {
    ...mapState({
      filter: (state) => state.app.taskFilter,
      analysing: (state) => state.taskbox.analysing,
      currentMainTab: (state) => state.app.mainTab,
      currentMemberTab: (state) => state.app.memberTab,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
      // current user info
      session: (state) => state.user.session.authenticated,
      profile: (state) => state.user.profile,
      // tasks
      tasks: (state) => state.user.tasks,
      taskboxes: (state) => state.user.taskboxes,
      // myAuditions: (state) => state.user.auditions,
      // members lists
      members: (state) => state.connection.members,
      blocked: (state) => state.connection.blocked,
      canceled: (state) => state.connection.canceled,
      invited: (state) => state.connection.invited,
      invitations: (state) => state.connection.invitations,
    }),
    myTasks(){
      this.refreshkey;
      return this.tasks;
    },
    myTaskboxes(){
      this.refreshkey;
      return this.taskboxes;
    },
    TaskDoneCount() {
      return this.myTasks.filter((t) => t.status == taskstate.DONE.value).length;
    },
    TaskCanceledCount() {
      return this.myTasks.filter((t) => t.status == taskstate.REPROVED.value).length;
    },
    TaskTotalCount() {
      return this.myTasks.length;
    },
    AuditionDoneCount() {
      return 0; // this.myAuditions.filter((t) => t.status == taskstate.DONE.value).length;
    },
    AuditionCanceledCount() {
      return 0; // this.myAuditions.filter((t) => t.status == taskstate.CANCELED.value).length;
    },
    AuditionTotalCount() {
      return 0; // this.myAuditions.length;
    },
    memberTab: {
      get() {
        return this.currentMemberTab;
      },
      set(value) {
        this.$store.commit('app/SET_MEMBER_TAB', value);
      },
    },
    taskcount() {
      return (this.taskBoxInfo && this.taskBoxInfo.Incomplete.value) || 0;
    },
    hasTasks() {
      if (!this.myTasks) return false;
      return this.myTasks.filter((t) => t.status < taskstate.DONE.value).length;
    },
    hasInvitations() {
      if (!this.invited || !this.invitations) return false;
      return this.invited.concat(this.invitations).length;
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.status);
    },
  },
  methods: {
    showTaskBox() {
      if(this.currentMainTab!==0)
        this.$store.commit('app/SET_MAIN_TAB', 0);
    },
    setMounting(value) {
      this.mounting = value;
    },
    filteredList(list, field, filter){
      let searchResult = this.search ? list.filter((item) => item[field] && item[field].toLowerCase().includes(this.search)) : list.filter((item) => filter.value.includes(item[filter.field]));
      if (!filter) return searchResult;
      else {
        if (!this.searching) return searchResult.filter((item) => filter.value.includes(item[filter.field]));
        else return searchResult;
      }
    },
    refresh() {
      switch (this.memberTab) {
        case 0:
          this.getTasks();
          break;
        case 1:
          this.getTasks();
          break;
        case 2:
          this.getConnections();
          break;
        default:
          break;
      }
    },
    // Tasks
    async getTasks(refreshing) {
      this.loading = true;
      this.refreshing = refreshing;
      this.$store.dispatch('user/GET_TASKS', { member: null }).then(() => {
        setTimeout(() => {
          this.loading = false;
          this.refreshing = false;
        }, 1000);
      });
    },
    updateFilter(value) {
      this.filtering = true;
      this.filter = value;
      setTimeout(() => {
        this.filtering = false;
      }, 700);
    },
    // People
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
        setTimeout(() => {
          this.$refs.searchbar.blur();
          this.searching = false;
          this.loading = false;
        }, 700);
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
    connectionStatus(member) {
      if (this.invited.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.INVITED.value);
      if (this.members.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.ACCEPTED.value);
      if (this.blocked.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.BLOCKED.value);
      if (this.canceled.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.CANCELED.value);
      return getConnectionStatusByValue(connectionStatus.UNEXISTENT.value);
    },
    getConnections() {
      this.loading = true;
      this.$store.dispatch('connection/GET_ALL').then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    // Profile
    updateProfile() {
      this.$store.commit('user/SET_PROFILE', this.profile);
    },
    saveProfile() {
      this.saving = true;
      this.$store
        .dispatch('user/UPDATE_PROFILE', this.profile)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.saving = false;
        });
    },
    close() {
      this.$store.commit('app/TOGGLE_MEMBER_AREA', false);
    },
  },
};
</script>
