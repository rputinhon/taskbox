<template>
  <v-dialog v-if="dataReady && isOpen" close-delay="500" v-model="isOpen" max-width="400" persistent @keydown.escape="close()" @keydown.enter="yes()">
    <v-card rounded="0" class="pa-3 transition" min-height="80" min-width="400" v-if="deletingItem">
      <v-app-bar flat height="30" class="px-4 py-0" color="transparent">
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

      <deleting-item :task="deletingTask" />

      <v-list-item v-if="fileExistInFilesFolder">
        <v-switch class="mx-auto" :disabled="deleting" inset color="error" v-model="deleteFiles" dense label="Delete also the file?" :messages="'*It Deletes only files in the taskbox folder.'" />
      </v-list-item>

      <v-card-actions class="mt-2">
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn rounded :disabled="deleting" small class="mx-1" color="secondary" @click="(skipped = true), next(false)"> no </v-btn>
          <v-btn rounded :disabled="deleting" small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="next(false)"> yes </v-btn>
          <v-btn rounded :disabled="deleting" small class="mx-1" color="error" @click="next(true)"> yes to all </v-btn>
        </v-row>
      </v-card-actions>

      <v-app-bar class="mt-2" bottom flat color="transparent">
        <v-list-item>
          <v-progress-linear :color="deleting || loading ? 'primary' : 'transparent'" rounded height="13" :indeterminate="loading || deleting"> <small v-text="deleting ? 'deleting ...' : !loading ? 'Delete this task?' : 'loading ...'"> </small> </v-progress-linear>
        </v-list-item>
      </v-app-bar>
    </v-card>
  </v-dialog>
</template>

<script>
import DeletingItem from './DeletingItem.vue';

import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';
import { NodeView } from '../../libs/nodeview';
// import _ from 'lodash';

export default {
  components: { DeletingItem },
  name: 'ConfirmDelete',
  data() {
    return {
      isOpen: false,
      loading: false,
      deleting: false,
      deleteFiles: false,
      yesForAll: false,
      skipped: false,
      fileExistInFilesFolder: false,
      parentIndex: [],
      childIndex: 0,
      refreshkey: 0,
      parent: [],
      closedParents: [],
      processed: [],
    };
  },
  watch: {
    // isTaskBox(value) {
    //   if (value) this.next();
    // },
    // index(value) {
    //   if (!value.length) this.close();
    // },
    // file(value) {
    //   this.$nextTick(() => {
    //     this.checkfileExistInFilesFolder(value);
    //   });
    // },
    deletingTasks(value) {
      if (value) {
        
        this.parent = Object.values(this.deletingTasks.children);

        this.isOpen = true;
        // this.childIndex = 0;
      } else {
        this.isOpen = false;
        // this.childIndex = 0;
        this.loading = false;
        this.parent = [];
        setTimeout(() => {
          this.deleting = false;
        }, 500);
      }
    },
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.root.task,
      deletingTasks: (state) => state.taskbox.deleting,
      taskList: (state) => state.taskbox.root.tasks,
    }),
    dataReady() {
      return this.library && this.deletingTasks ? true : false;
    },
    file() {
      this.refreshkey;
      return this.deletingTask && this.deletingTask.value && this.deletingTask.value.file;
    },
    lastParent() {
      this.refreshkey;
      return this.closedParents.length ? this.closedParents[this.closedParents.length - 1] : null;
    },
    parentTask() {
      this.refreshkey;
      return this.taskList[this.deletingTask.taskbox] || this.currentTaskBox;
    },
    deletingItem() {
      this.refreshkey;
      return this.parent && this.parent[this.childIndex];
    },
    deletingTask() {
      this.refreshkey;
      if (!this.deletingItem) return;
      return this.taskList[this.deletingItem.id];
    },
    isNextTaskBox() {
      this.refreshkey;
      return this.parent && this.parent[this.childIndex + 1] ? true : false;
    },
    isTaskBox() {
      this.refreshkey;
      return this.deletingItem && this.deletingItem.children ? true : false;
    },
    hasToDelete() {
      this.refreshkey;
      return this.parent && this.childIndex < this.parent.length - 1 ? true : false;
    },
    lastIndex() {
      this.refreshkey;
      return this.parentIndex.length - 1;
    },
  },
  methods: {
    async openTaskBox() {
      this.closedParents.push(this.parent);
      this.parent = Object.values(this.parent[this.childIndex].children);
      this.parentIndex.push(this.childIndex);
      this.childIndex = 0;
    },
    async closeTaskBox() {
      this.parent = this.lastParent;
      this.closedParents.pop();
      this.childIndex = this.lastIndex + 1;
      this.parentIndex.pop();
      this.refreshkey++;
    },
    async next(closing) {
      if (this.isTaskBox && !closing) return await this.openTaskBox();
      
      if (this.hasToDelete) {
        this.childIndex++;
        if (this.isTaskBox && !closing) await this.openTaskBox();
        // else this.childIndex++;
      } else {
        if (this.lastParent) {
          await this.closeTaskBox().then(() => {
             this.next(true);
          });
        } else this.close();
      }

      this.refreshkey++;
    },
    async deleteNode(task) {
      let item = task || this.deletingItem;
      this.deleting = true;
      return new Promise((res) => {
        if (this.deleteFiles == true && this.file) {
          ipcRenderer
            .invoke('app:deleteFile', this.file.path)
            .then(() => {})
            .catch((error) => console.log(error))
            .finally(async () => {
              if (item) {
                // this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
                console.log('deleted:', { task: item.id, parent: item.taskbox, files: this.deleteFiles });
                this.deleting = false;
                setTimeout(res(this.next()), 1000);
                // });
              }
            });
        } else {
          if (item) {
            console.log('deleted:', { task: item.id, parent: item.taskbox, files: this.deleteFiles });
            this.deleting = false;
            // this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
            setTimeout(res(this.next()), 1000);
            // });
          }
        }
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
    close() {
      this.deleteFiles = false;
      this.yesForAll = false;
      this.skipped = false;
      this.parentIndex = [];
      this.closedParents = [];
      this.childIndex = 0;
      this.$store.commit('taskbox/SET_DELETING_TASKS', null);
      this.$store.commit('taskbox/SUCCESS_UPDATE_TASKS_INFO');
      this.$store.dispatch('taskbox/GET_FILE_LIST').then(() => {
        NodeView.saveTaskBox(true);
      });
    },
  },
};
</script>

<style scoped>
.transition {
  transition: height 0.1s;
}
</style>
