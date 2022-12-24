<template>
  <v-app id="inspire">

    <v-main style="bakcground-color: rgb(33, 33, 33)">
      <slot />
    </v-main>

  </v-app>
</template>

<script>

import { mapState } from 'vuex';
import apistate from '../enums/apistate';

import { getStatusTypeByValue } from '../enums/taskstate';
import { eventBus } from '../../main';

export default {
  name: 'AppLayoutWorkspace',
  data: () => ({
    isApiWorking: false,
    apiStateText: '',
    lastApiAction: '',
    loading: false,
    
  }),
  watch: {
    apiState() {
      if (this.apiState !== apistate.DONE) this.lastApiAction = this.apistate;

      this.isApiWorking = this.apiStateLoading;
      this.apiStateText = this.lastApiAction;

      clearTimeout(this.apiStateLoading);

      this.isApiWorking = setTimeout(() => {
        this.isApiWorking = false;
        this.apiStateText = '';
      }, 1000);
    },
  },
  computed: {
    ...mapState({
      apiState: (state) => state.apiState,
      project: (state) => state.taskbox.project,
      dataReady: (state) => state.taskbox.dataReady,
      errorMessage: (state) => state.errorState,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      userProfile: (state) => state.user.profile,
    }),
    status() {
      return getStatusTypeByValue(this.taskbox ? this.taskbox.data.task.status : 0);
    },
    apiStateLoading() {
      return this.apiState == apistate.LOADING || apistate == apistate.INIT || apistate == apistate.SAVING ? true : false;
    },
    apistate() {
      return Object.keys(apistate)[this.apiState].toLowerCase();
    },
    taskbox() {
      if (!this.dataReady) return null;
      return this.project.taskboxes[this.currentTaskBox];
    },
  },
  methods:{
    toggleTasks(){
      eventBus.$emit('toggleTasks');
    }

  }
 
};
</script>

<style>
.v-app-bar-title__content {
  width: 100% !important;
  overflow: hidden;
}
.v-navigation-drawer__border {
  width: 0px !important;
}
.v-navigation-drawer__content {
  overflow: hidden;
}
</style>

<style scoped>
#inspire {
  overflow: hidden !important;
  background: rgb(33, 33, 33) !important;
  margin: 0px !important;
}

.v-input__slot {
  max-height: 30px;
}
</style>
