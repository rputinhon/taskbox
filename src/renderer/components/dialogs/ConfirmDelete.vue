<template>
  <v-dialog v-if="dataReady && isOpen" v-model="isOpen" max-width="400" persistent @keydown.escape="close()" @keydown.enter="yes()">
    <v-card rounded="0" class="pa-5 transition pb-13" min-height="300" min-width="400" v-if="deletingItem">
      <v-app-bar flat absolute height="40" class="px-4" color="transparent">
        Delete
        <v-spacer> </v-spacer>
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn v-on="{ ...onTooltip }" small fab icon @click="close()">
              <svg width="26" height="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="grey" />
              </svg>
            </v-btn>
          </template>
          close
        </v-tooltip>
      </v-app-bar>

      <deleting-item v-if="!isTaskBox" :deleteFiles="deleteFiles" :task="deletingItem" @loaded="loading = false" @done="next()" @toggleAllFiles="toggleAllFiles" />
      <deleting-task-box-item v-else :deleteFiles="deleteFiles" :list="deletingItem" @loaded="loading = false" @done="next()" />

      <v-card-actions class="mt-3" v-if="!isTaskBox">
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn :disabled="deleting" rounded small class="mx-1" color="secondary" @click="next(true)"> no </v-btn>
          <v-btn :disabled="deleting" rounded small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="deleteItem(false)"> yes </v-btn>
          <v-btn v-show="children.length > 1 && hasToDelete" rounded :disabled="deleting" small class="mx-1" color="error" @click="deleteItem(true)"> yes to all </v-btn>
        </v-row>
      </v-card-actions>

      <v-app-bar bottom flat absolute color="transparent">
        <v-list-item>
          <v-progress-linear :color="deleting || loading ? 'primary' : 'transparent'" rounded height="13" :indeterminate="loading || deleting"> <small v-text="deleting ? 'deleting ...' : !loading ? 'Delete this task?' : 'loading ...'"> </small> </v-progress-linear>
        </v-list-item>
      </v-app-bar>
    </v-card>
  </v-dialog>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';
import DeletingTaskBoxItem from './DeletingTaskBoxItem.vue';
import DeletingItem from './DeletingItem.vue';
import _ from 'lodash';

export default {
  components: { DeletingTaskBoxItem, DeletingItem },
  name: 'ConfirmDelete',
  data() {
    return {
      isOpen: false,
      deleting: false,
      deleteFiles: false,
      childIndex: 0,
      refreshkey: 0,
      loading: true,
    };
  },
  watch: {
    deletingTasks(value) {
      if (value) {
        this.isOpen = true;
        this.childIndex = 0;
      } else {
        this.isOpen = false;
        this.childIndex = 0;
        this.loading = true;
      }
    },
    isTaskBox(value) {
      if (value && this.childIndex == 0) this.loading = true;
    },
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      deletingTasks: (state) => state.taskbox.deleting,
      taskList: (state) => state.taskbox.root.tasks,
    }),
    dataReady() {
      return this.library && this.deletingTasks ? true : false;
    },
    isTaskBox() {
      if(!this.dataReady || !this.deletingChild)return false;
      return this.deletingTasks[this.deletingChild].children ? true : false;
    },
    hasToDelete() {
      let index = this.childIndex + 1;
      return index < this.children.length ? true : false;
    },
    children() {
      if (!this.deletingTasks) return;
      return Object.keys(this.deletingTasks);
    },
    deletingChild() {
      if (!this.deletingTasks) return;
      return this.children[this.childIndex];
    },
    deletingItem() {
      return !this.isTaskBox ? this.taskList[this.deletingChild] : _.clone(this.deletingTasks[this.deletingChild]);
    },
  },
  methods: {
    toggleAllFiles(value) {
      this.deleteFiles = value;
    },
    next() {
      let index = this.childIndex + 1;
      if (index < this.children.length) {
        // this.$nextTick(() => {
        this.childIndex = index;
        // });
      } else this.close();
    },
    async deleteNode(node) {
      let item = node || this.deletingItem;
      return new Promise((res) => {
        if (this.deleteFiles == true && this.file) {
          ipcRenderer
            .invoke('app:deleteFile', this.file.path)
            .then(() => {})
            .catch((error) => console.log(error))
            .finally(async () => {
              if (item) {
                this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
                  //  NodeView.deleteNode(this.deletingItem.id);
                });
              }
              setTimeout(res, 10);
            });
        } else {
          if (item) {
            this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
              //  NodeView.deleteNode(this.deletingItem.id);
            });
          }
          setTimeout(res, 10);
        }
      });
    },
    async deleteItem(all) {
      this.deleting = true;
      this.deleteNode().then(async () => {
        if (all) {
          await this.deleteItem(true);
        } else {
          this.deleting = false;
          this.deleteFiles = false;
        }
        this.next();
      });
    },
    async checkfileExistInFilesFolder(file) {
      if (file == null) return false;
      ipcRenderer.invoke('app:existInFilesFolder', file.path).then((response) => {
        this.fileExistInFilesFolder = response;
      });
    },
    getIcon(name) {
      if (!name) return;
      if (name == 'file' && this.file) return getFileType(this.file.extension).info.icon;
      let type = this.library.blockLibrary.blocktypes.find((t) => t.name.toLowerCase() == name);
      return type.meta.typeicon;
    },
    async close() {
      this.keeping = [];
      this.deleting = false;
      this.deleteFiles = false;

      await this.$store.dispatch('taskbox/GET_FILE_LIST');
      this.$store.commit('taskbox/SET_DELETING_TASKS', null);
    },
  },
};
</script>

<style scoped>
.transition {
  transition: height 0.1s;
}
</style>
