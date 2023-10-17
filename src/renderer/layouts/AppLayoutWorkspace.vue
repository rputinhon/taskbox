<template>
  <v-app id="inspire">

    <window-bar />

    <v-main style="height: 100vh; background-color: transparent!important">
      <v-tabs v-model="mainTab" height="0">
        <v-tab-item eager style="min-height: calc(100vh - 40px) !important">
          <task-box />
        </v-tab-item>
        <v-tab-item eager style="min-height: calc(100vh - 40px) !important">
          <feed v-if="userFeed == null" />
          <user-feed v-else />
        </v-tab-item>
      </v-tabs>
    </v-main>

    <v-navigation-drawer v-model="showMemberArea" app   hide-overlay width="550" style="z-index: 5">
      <member-area />
    </v-navigation-drawer>
    <login />

    <confirm-status />
    <post-preview />
    <post-create />
    <new-project :open="newProject" @close="closeModal()" />
    <confirm-delete-project :open="showConfirmDeleteProject" :projectId="deletingProject" @close="closeModal()" />
  </v-app>
</template>

<script>

import ConfirmDeleteProject from '../components/dialogs/ConfirmDeleteProject.vue';
import ConfirmStatus from '../components/dialogs/ConfirmStatus.vue';
import Feed from '../components/browse/Feed.vue';
import Login from '../components/dialogs/Login.vue';
import MemberArea from '../components/browse/MemberArea.vue';
import NewProject from '../components/dialogs/NewProject.vue';
import PostCreate from '../components/browse/PostCreate.vue';
import PostPreview from '../components/browse/PostPreview.vue';
import TaskBox from '../views/TaskBox.vue';
import UserFeed from '../components/browse/UserFeed.vue';
import WindowBar from '../components/dialogs/WindowBar.vue';

import { mapState } from 'vuex';

import { getStatusTypeByValue } from '../enums/taskstate';
import { eventBus } from '../../main';

export default {
  name: 'AppLayoutWorkspace',
  components: {
    ConfirmDeleteProject,
    ConfirmStatus,
    Feed,
    Login,
    MemberArea,
    NewProject,
    PostCreate,
    PostPreview,
    TaskBox,
    UserFeed,
    WindowBar,
  },
  data: () => ({
    tab: null,
    deletingProject: null,
    newProject: false,
    showingProfile: null,
    showConfirmDeleteProject: false,
  }),
  async created() {

    eventBus.$on('deleteProject', (id) => {
      this.deletingProject = id;
      this.showConfirmDeleteProject = true;
    });

    eventBus.$on('newProject', () => {
      this.newProject = true;
    });

    eventBus.$on('showProfile', (id) => {
      if (id !== this.userFeed.id) this.$store.commit('post/CLEAR_PERSONAL');
      this.$store.dispatch('user/GET_PROFILE', id).then((profile) => {
        this.$store.commit('app/SET_USER_FEED', profile);
        this.$store.commit('app/SET_MAIN_TAB', 1);
      });
    });
    window.addEventListener('resize', this.resize);
  },
  watch: {
    userFeed(value) {
      if (!value) this.$store.commit('post/CLEAR_PERSONAL');
    },
    mainTab(value) {
      if (value !== 1) {
        this.$store.commit('app/SET_USER_FEED', null);
        this.$store.commit('post/CLEAR');
      }

      if (value !== 0) this.$store.commit('app/TOGGLE_TASKS', false);
    },
    authenticated() {
      this.$store.commit('app/SET_USER_FEED', null);
      // this.$store.commit('taskbox/SUCCESS_CLOSE_ROOT');
    },
  },
  computed: {
    ...mapState({
      root: (state) => state.taskbox.root,
      errorMessage: (state) => state.errorState,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      memberTab: (state) => state.app.memberTab,
      mainTab: (state) => state.app.mainTab,
      userFeed: (state) => state.app.userFeed,
      showingTasks: (state) => state.app.showTasks,
      showingMainMenu: (state) => state.app.showMainMenu,
      showingMemberArea: (state) => state.app.showMemberArea,
      children: (state) => state.taskbox.children,
      user: (state) => state.user.user,
      profile: (state) => state.user.profile,
    }),
    showMemberArea: {
      get() {
        return this.showingMemberArea;
      },
      set(value) {
        this.$store.commit('app/TOGGLE_MEMBER_AREA', value);
      },
    },
    showMainMenu: {
      get() {
        return this.showingMainMenu;
      },
      set(value) {
        this.$store.commit('app/TOGGLE_MAIN_MENU', value);
      },
    },
    showTasks: {
      get() {
        return this.showingTasks;
      },
      set(value) {
        this.$store.commit('app/TOGGLE_TASKS', value);
      },
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox ? this.currentTaskBox.task.status : 0);
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  methods: {
    resize() {
      this.temporaryAside = window.innerWidth < 900 ? true : false;
    },
    closeModal() {
      this.newProject = false;
      this.showConfirmDeleteProject = false;
      this.deletingProject = null;
    },
    showProfile() {
      this.showingProfile = this.profile.id;
      this.$store.commit('app/SET_MAIN_TAB', 2);
    },
  },
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
  overflow: hidden !important;
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
