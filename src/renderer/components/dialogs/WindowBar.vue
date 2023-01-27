<template>
  <v-app-bar app :flat="analysing !== false" width="auto" style="z-index: 2" height="40px" :dark="analysing !== false && mainTab == 0" :color="analysing == false ? 'white' : 'dark'" class="windowbar px-1" @dblclick="restoreSize()">
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on }">
        <v-btn v-show="!showMemberArea" fab left x-small icon v-on="on" class="ml-1 windowbar-button" @dblclick.stop @click.stop="showTaskBox()">
          <v-img style="filter: brightness(1.1) !important" contain :style="mainTab !== 0 && 'filter: grayscale(1)!important;'" src="img/logo_worm_32_flat.png" max-width="32px" />
        </v-btn>
      </template>
      taskbox
    </v-tooltip>

    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on }">
        <v-btn v-show="workRemotelly && authenticated" fab icon x-small v-on="on" class="windowbar-button mx-2 ml-3" @dblclick.stop @click.stop="goToFeed()">
          <v-img contain :style="mainTab !== 1 && 'filter: grayscale(1)!important;'" src="img/globe_64.png" max-width="27px" />

          <!-- <svg style="pointer-events: none" width="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="m 23.86521,3.1191893 c -11.305829,0 -20.5429321,9.2350367 -20.5429321,20.5408647 0,11.305829 9.2371031,20.542933 20.5429321,20.542933 11.305828,0 20.540863,-9.237104 20.540863,-20.542933 0,-11.305828 -9.235035,-20.5408647 -20.540863,-20.5408647 z m -5.29e-4,3.2943725 a 17.247273,17.247273 0 0 1 0.612365,0.016536 c 0.943543,1.0446959 3.756207,4.4428342 5.447728,9.8159392 H 17.700211 c 1.660282,-5.273868 4.411628,-8.6570986 5.408972,-9.7730476 a 17.247273,17.247273 0 0 1 0.75551,-0.059428 z M 28.78841,7.1370319 A 17.247273,17.247273 0 0 1 39.432206,16.246037 H 33.045527 C 31.948866,12.368733 30.232672,9.269382 28.788423,7.1370319 Z m -9.989041,0.057361 C 17.36285,9.3249164 15.666836,12.401602 14.579472,16.246037 H 8.3250732 A 17.247273,17.247273 0 0 1 18.799369,7.1943929 Z M 7.2419352,19.245853 h 6.6543738 c -0.296225,1.706227 -0.458243,3.529329 -0.425814,5.459099 0.03013,1.792907 0.214283,3.460375 0.507463,5.002279 H 7.7586995 A 17.247273,17.247273 0 0 1 6.6176839,23.661088 17.247273,17.247273 0 0 1 7.2419352,19.245853 Z m 9.6996658,0 h 13.741797 c 0.322244,1.675362 0.503158,3.483399 0.470773,5.410523 -0.03094,1.841303 -0.231923,3.523143 -0.546737,5.050855 H 17.017566 c -0.314814,-1.527712 -0.515794,-3.209552 -0.546737,-5.050855 -0.03238,-1.927124 0.148529,-3.735161 0.470772,-5.410523 z m 16.78709,0 h 6.804753 a 17.247273,17.247273 0 0 1 0.578776,4.415235 17.247273,17.247273 0 0 1 -1.141016,6.046143 h -6.324163 c 0.293179,-1.541904 0.477332,-3.209372 0.507463,-5.002279 0.03243,-1.92977 -0.129588,-3.752872 -0.425813,-5.459099 z M 9.2428466,32.707048 h 5.4808024 c 0.936435,3.031088 2.2598,5.434137 3.49591,7.225913 A 17.247273,17.247273 0 0 1 9.2428466,32.707048 Z m 8.5912064,0 h 11.956892 c -1.48844,4.349506 -3.795569,7.003462 -4.932514,8.123018 a 17.247273,17.247273 0 0 1 -0.993738,0.07803 17.247273,17.247273 0 0 1 -1.106393,-0.08733 c -1.139717,-1.124048 -3.439193,-3.774107 -4.924247,-8.113715 z m 15.067297,0 h 5.585706 a 17.247273,17.247273 0 0 1 -9.12399,7.28741 c 1.248061,-1.797854 2.591197,-4.221845 3.538284,-7.28741 z"
              :style="mainTab !== 1 && 'filter:grayscale(1)'"
              fill="#0187f3"
            />
          </svg> -->
        </v-btn>
      </template>
      Feed
    </v-tooltip>

    <v-toolbar height="40" flat color="transparent" class="px-0 text-center windowbar">

      <v-list-item v-if="analysing !== false && mainTab == 0 && dataReady" class="windowbar">
        <v-responsive max-width="-webkit-fill-available" class="mx-2 windowbar-button overflow-visible">
          <analalisis-menu />
        </v-responsive>
      </v-list-item>

      <v-list-item v-if="analysing == false && mainTab == 0 && dataReady" class="mx-0 px-0 windowbar" style="min-height: 40px; height: 40px">
        <bread-crumb style="z-index:0" v-if="currentTaskBox" />
        <task-box-title v-if="false" :options="['info']" v-show="analysing == false" />
      </v-list-item>

      <v-list-item v-if="mainTab !== 0" class="windowbar">
        <v-responsive max-width="-webkit-fill-available" class="mx-0 windowbar-button overflow-visible">
          <search :dark="false" :refresh="refresh" :local="!userFeed ? 'in Taskbox' : 'in Feed'" :isFilter="!userFeed == null" :options="['profile', userFeed == null && 'post']" />
        </v-responsive>
      </v-list-item>

    </v-toolbar>

    <v-spacer></v-spacer>

    <task-box-menu v-if="mainTab == 0 && dataReady"  :taskbox="currentTaskBox" :extraClass="'mx-2'" :options="[analysing !== false && 'white', 'save', 'icon', 'close', 'template', 'reset', 'pack']" />

    <v-tooltip v-if="mainTab == 0 && dataReady" bottom transition="none">
      <template v-slot:activator="{ on, attrs }">
        <v-btn :disabled="paused || canceled" class="mr-3 ml-2 windowbar-button" :color="analysing !== false ? 'error' : 'rgba(0,0,0,0.3)'" v-on="on" elevation="0" height="20" width="20" v-bind="attrs" x-small fab @click="toggleAnalisis()" @mouseover.prevent>
          <svg style="pointer-events: none !important" width="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 26.25,11.744141 c -1.06005,0.196305 -1.897801,0.886739 -2.513672,1.726562 -0.61587,0.839824 -1.070946,1.861359 -1.464844,3.005859 -0.787794,2.289001 -1.315457,5.094488 -1.83789,7.808594 -0.522434,2.714106 -1.045153,5.342115 -1.703125,7.111328 -0.328986,0.884607 -0.700916,1.54137 -1.003907,1.863282 -0.30299,0.321911 -0.389572,0.345564 -0.667968,0.302734 -0.887825,-0.136589 -1.607472,-0.742172 -2.265625,-1.828125 -0.658154,-1.085953 -1.163673,-2.588955 -1.503906,-4.095703 -0.680467,-3.013496 -0.734376,-5.980469 -0.734375,-5.980469 a 1.1825,1.1825 0 0 0 -1.203125,-1.162109 1.1825,1.1825 0 0 0 -1.16211,1.201172 c 0,0 0.04562,3.153226 0.792969,6.46289 0.373672,1.654832 0.915466,3.36257 1.787109,4.800781 0.871644,1.438212 2.165865,2.668096 3.929688,2.939454 1.047428,0.161142 2.083322,-0.311221 2.75,-1.019532 0.666677,-0.70831 1.10994,-1.616581 1.498047,-2.660156 0.776212,-2.087149 1.285666,-4.773562 1.808593,-7.490234 0.522928,-2.716673 1.054571,-5.458074 1.751953,-7.484375 0.348692,-1.013151 0.742724,-1.840397 1.134766,-2.375 0.392043,-0.534604 0.722296,-0.742121 1.039063,-0.800781 0.317538,-0.0588 0.614944,0.0077 1.082031,0.353515 0.467087,0.345766 1.020266,0.977435 1.560547,1.816406 1.080561,1.677944 2.121098,4.147348 2.984375,6.66211 1.726553,5.029523 2.789062,10.230468 2.789062,10.230468 a 1.1825,1.1825 0 0 0 1.394531,0.921875 1.1825,1.1825 0 0 0 0.921875,-1.394531 c 0,0 -1.07716,-5.305276 -2.86914,-10.52539 C 33.648932,19.524708 32.584002,16.933431 31.3125,14.958984 30.676749,13.971761 29.993164,13.131405 29.171875,12.523438 28.350586,11.91547 27.309279,11.547978 26.25,11.744141 Z"
              stroke-width="2"
              :stroke="'#fafafa'"
              :fill="'#fafafa'"
            />
          </svg>
        </v-btn>
      </template>
      toggle analisis
    </v-tooltip>

    <task-subject v-if="mainTab == 0 && dataReady" :color="'grey'" :task="currentTaskBox" :options="['popup', 'statistics', 'status']" />

    <v-list-item v-if="authenticated" style="max-width: fit-content" class="ma-0 pa-0 mx-1">
      <profile />
    </v-list-item>

    <v-divider vertical class="mx-2"></v-divider>

    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn v-on="{ ...onTooltip }" class="windowbar-button" icon tile small @dblclick.stop @click.stop="minimize()">
          <svg width="13" height="13" version="1.1" viewBox="0 0 33.867 33.867" xmlns="http://www.w3.org/2000/svg">
            <path d="m 5.3378906,20.71875 c -1.7718574,0 -3.1992187,1.427362 -3.1992187,3.199219 v 0.439453 c 0,1.771858 1.4273613,3.199219 3.1992187,3.199219 H 43.664923 c 1.771857,0 3.199218,-1.427361 3.199218,-3.199219 v -0.439453 c 0,-1.771857 -1.427361,-3.199219 -3.199218,-3.199219 z" fill="#353535" />
          </svg>
        </v-btn>
      </template>
      minimize
    </v-tooltip>
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn v-on="{ ...onTooltip }" class="windowbar-button" icon tile small @dblclick.stop @click.stop="maximize()">
          <svg width="15" height="15" version="1.1" viewBox="0 0 33.867 33.867" xmlns="http://www.w3.org/2000/svg">
            <path d="M 5.0272498,3.2284219 A 1.799365,1.799365 0 0 0 3.2284218,5.02725 v 23.8125 a 1.799365,1.799365 0 0 0 1.798828,1.798828 H 28.83975 A 1.799365,1.799365 0 0 0 30.638578,28.83975 V 5.02725 A 1.799365,1.799365 0 0 0 28.83975,3.2284219 Z M 6.8260779,6.8260781 H 27.040921 V 27.040922 H 6.8260779 Z" fill="#353535" />
          </svg>
        </v-btn>
      </template>
      maximize
    </v-tooltip>
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn v-on="{ ...onTooltip }" class="windowbar-button" icon tile small @dblclick.stop @click.stop="hasChanges ? (showConfirm = true) : close()">
          <svg width="20" height="20" version="1.1" viewBox="0 0 33.867 33.867" xmlns="http://www.w3.org/2000/svg">
            <path d="m 10.369047,6.963773 -3.2822269,3.323242 6.5644529,6.646484 -6.5644529,6.646485 3.2822269,3.323243 6.564453,-6.646486 6.564453,6.646486 3.282226,-3.323243 -6.564453,-6.646485 6.564453,-6.646484 -3.282226,-3.323242 -6.564453,6.646484 z" fill="#353535" />
          </svg>
        </v-btn>
      </template>
      close
    </v-tooltip>
    <confirm-close :open="showConfirm" @close="showConfirm = false" />
  </v-app-bar>
</template>

<script>
import ConfirmClose from './ConfirmClose.vue';
import TaskBoxTitle from '../navigation/TaskBoxTitle.vue';
import BreadCrumb from '../navigation/TheBreadMenu.vue';

import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';

import store from '../../store';
import { isTaskCanceled, isTaskDone, isTaskPaused } from '../../store/modules/task/task';
import Search from '../browse/Search.vue';
import TaskBoxMenu from '../menus/TaskBoxMenu.vue';
import AnalalisisMenu from '../menus/AnalalisisMenu.vue';
import Profile from './Profile.vue';
import TaskSubject from '../lists/TaskSubject.vue';

export default {
  name: 'WindowBar',
  props: { canBack: Boolean },
  components: {
    AnalalisisMenu,
    BreadCrumb,
    ConfirmClose,
    Profile,
    Search,
    TaskBoxMenu,
    TaskBoxTitle,
    TaskSubject,
  },
  data() {
    return {
      loading: false,
      apiStateText: '',
      showConfirm: false,
      filterTypes: [
        { name: 'portiolios', icon: 'M 6.8665634,6.5042546 V 19.004255 H 19.366563 V 6.5042546 Z m 15.9999996,0 V 19.004255 H 35.366562 V 6.5042546 Z M 6.8665634,22.504255 V 35.004256 H 19.366563 V 22.504255 Z m 15.9999996,0 V 35.004256 H 35.366562 V 22.504255 Z' },
        {
          name: 'open tasks',
          icon: 'm 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      searchValue: (state) => state.app.search,
      taskFilter: (state) => state.app.taskFilter,
      memberTab: (state) => state.app.memberTab,
      currentMainTab: (state) => state.app.mainTab,
      showingMemberArea: (state) => state.app.showMemberArea,
      userFeed: (state) => state.app.userFeed,
      analysing: (state) => state.taskbox.analysing,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      hasChanges: (state) => state.taskbox.hasChanges,
      profile: (state) => state.user.profile,
      currentTasks: (state) => state.taskbox.children,
      workRemotelly: (state) => state.app.serverSettings[1].value,
      myTasks: (state) => state.user.tasks,
      invited: (state) => state.connection.invited,
      invitations: (state) => state.connection.invitations,
    }),
    showMemberArea: {
      get() {
        return this.showingMemberArea;
      },
      set(value) {
        this.$store.commit('app/TOGGLE_MEMBER_AREA', value);
      },
    },
    refresh() {
      if (this.mainTab == 1) return 'feed';
      if (this.mainTab == 2) return 'tasks';
      return '';
    },
    mainTab: {
      get() {
        return this.currentMainTab;
      },
      set(value) {
        this.$store.commit('app/SET_MAIN_TAB', value);
      },
    },
    filter: {
      get() {
        return this.taskFilter;
      },
      set(value) {
        this.$store.commit('app/SET_TASK_FILTER', value);
      },
    },
    search: {
      get() {
        return this.searchValue;
      },
      set(value) {
        this.$store.commit('app/SEARCH', value);
      },
    },
    hasNotifications() {
      return this.hasTasks || this.hasInvitations ? true : false;
    },
    hasTasks() {
      if (!this.myTasks) return false;
      return this.myTasks.filter((t) => t.status < taskstate.DONE.value).length;
    },
    hasInvitations() {
      if (!this.invited || !this.invitations) return false;
      return this.invited.concat(this.invitations).length;
    },
    dataReady() {
      return this.currentTaskBox ? true : false;
    },
    authenticated() {
      return store.getters['user/authenticated'];
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.status);
    },
    isWorkSpace() {
      return this.mainTab == 0;
    },
    completed() {
      return isTaskDone(this.currentTaskBox);
    },
    paused() {
      return isTaskPaused(this.currentTaskBox);
    },
    canceled() {
      return isTaskCanceled(this.currentTaskBox);
    },
    //due
    hasDue() {
      return this.currentTaskBox.due.plannedToEndAt ? true : false;
    },
    auditing() {
      return false; // Object.values(this.currentTasks).filter((t) => t.node.data.flowingData.flowing == false).length;
    },
  },
  methods: {
    toggleAnalisis() {
      this.$store.commit('taskbox/CHANGE_ANALISIS', this.analysing == false ? 'progress' : false);
      this.$store.commit('taskbox/ANALISE');
    },
    showTaskBox() {
      if (this.mainTab !== 0) this.mainTab = 0;
      else {
        this.$store.commit('app/SET_MEMBER_TAB', 0);
        this.$store.commit('app/TOGGLE_MEMBER_AREA', true);
        // this.$store.commit('app/TOGGLE_TASKS', this.currentTaskBox ? undefined : false);
      }
    },
    updateFeed() {
      eventBus.$emit('refresh', this.mainTab == 2 ? 'myfeed' : 'feed');
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    goToFeed() {
      this.$store.commit('app/SET_USER_FEED', null);
      this.$store.commit('app/SET_MAIN_TAB', 1);
    },
    restoreSize() {
      ipcRenderer.send('app:restoreSize');
    },
    minimize() {
      ipcRenderer.send('app:minimize');
    },
    maximize() {
      ipcRenderer.send('app:maximize');
    },
    async close() {
      await new Promise((resolve) => {
        if (store.getters['user/authenticated']) {
          store
            .dispatch('user/UPDATE_PROFILE', this.profile)
            .then(() => {
              ipcRenderer.send('app:quit');
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(async () => {
              resolve(ipcRenderer.send('app:forcequit'));
            });
        } else {
          resolve(ipcRenderer.send('app:quit'));
        }
      });
      ipcRenderer.send('app:forcequit');
    },
  },
};
</script>

<style>
.logo {
  filter: brightness(1.1);
}
.windowbar {
  width: 100%;
  height: 40px !important;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  pointer-events: all;
}
.windowbar-button {
  -webkit-app-region: no-drag;
}
.v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
  min-height: 30px !important;
}
</style>
