<template>
  <v-sheet height="calc(100vh - 40px)" :color="root?'workspace':'#c2c2c2'" width="100%" class="taskbox pa-0 ma-0" v-if="dataReady">
    <node-editor />
    <bread-crumb style="z-index:0" v-if="currentTaskBox" />
    <worker-list />
    <content-preview />
    <save-template :open="showSaveTemplate" :folder="folders && folders.templates" :taskbox="toTemplate" @close="closeModal()" />
    <pack-project :folder="folders && folders.packs" :packOpen="showPackWindow" @close="closeModal()" />
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../main';
import { ipcRenderer } from 'electron';

import BreadCrumb from '../components/navigation/TheBreadMenu.vue';
import ContentPreview from '../components/dialogs/ContentPreview.vue';
import NodeEditor from '../components/NodeEditor/TheNodeEditor.vue';
import PackProject from '../components/dialogs/PackProject.vue';
import SaveTemplate from '../components/dialogs/SaveTemplate.vue';
import WorkerList from '../components/dialogs/WorkerList.vue';

export default {
  name: 'TaskBox',
  props: { showTasks: Boolean },
  components: {
    BreadCrumb,
    ContentPreview,
    NodeEditor,
    PackProject,
    SaveTemplate,
    WorkerList,
  },
  data() {
    return {
      loading: false,
      isApiWorking: false,
      showPackWindow: false,
      showSaveTemplate: false,
      toTemplate: null,
      folders: null,
    };
  },
  async created() {
    eventBus.$on('saveTemplate', (taskbox) => {
      this.toTemplate = taskbox;
      this.showSaveTemplate = true;
    });


    eventBus.$on('updateTaskCount', async (value) => {
      this.tasksRemaining = value;
    });

    eventBus.$on('confirmAction', (data) => {
      return Object.assign(this.confirmData, data);
    });

    eventBus.$on('packProject', () => {
      if (this.showPackWindow) return;
      this.showPackWindow = true;
    });

    eventBus.$on('toggleTasks', (value) => {
      if (this.showTasks == value) return;
      else this.showTasks = !this.showTasks;
    });
  },
  async mounted() {
    await ipcRenderer.invoke('app:get-Folders').then((folders) => {
      this.folders = folders;
    });
  },
  computed: {
    ...mapState({
      appSettings: (state) => state.app.appSettings,
      root: (state) => state.taskbox.root,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      library: (state) => state.library.library,
    }),
    dataReady() {
      return this.library ? true : false;
    },
  },
  methods: {
    closeModal() {
      this.showResetTask = false;
      this.showPackWindow = false;
      this.showSaveTemplate = false;
    },
  },
};
</script>

<style>
.tasks .v-chip__content {
  height: 30px !important;
}
</style>

<style scoped>
.v-navigation-drawer__content {
  height: inherit;
}
.theme--dark.v-tabs-items {
  background-color: #ffffff !important;
}

.theme--light.v-input input {
  color: #51b0ff;
  text-align: center;
  font-weight: 600;
  font-size: 26px;
}
.theme--light.v-input input .subject {
  color: #2c2c2c;
  text-align: center;
  font-size: 25px;
}
.theme--light.v-input textarea {
  color: #2c2c2c;
  text-align: center;
  font-weight: 550;
}
.theme--light.v-input textarea::-webkit-scrollbar {
  width: 5px;
}
.theme--light.v-input textarea::-webkit-scrollbar-track {
  background-color: transparent;
}

.theme--light.v-input textarea::-webkit-scrollbar-thumb {
  background-color: #a3a3a3;
}
</style>
