<template>
  <v-dialog v-if="isOpen" v-model="isOpen" max-width="400" persistent @keydown.escape="close()" @keydown.enter="yes()">
    <v-card rounded="0" class="pa-5" min-height="auto" min-width="400" v-if="deletingItem">
      <v-app-bar flat absolute height="40" class="px-4" color="transparent">
        <v-app-bar-nav-icon class="mr-0">
          <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#ff5555" />
          </svg>
        </v-app-bar-nav-icon>
        Deleting Task:
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
      <v-list-item class="mt-8">
        <v-list-item-icon class="mx-auto text-center px-0">
          <svg width="50px" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="getIcon(deletingItem.taskType)" fill="#1070ff" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item style="min-height: 50px">
        <v-list-item-content class="my-0 py-0">
          <v-list-item-title> {{ deletingItem.title }}{{ file ? file.extension : '' }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-text style="min-height: 100px">
        <v-progress-linear rounded height="13" v-if="deleting" indeterminate> <small> deleting ... </small> </v-progress-linear>
        <span class="error--text" v-if="file && !fileExistInFilesFolder"> Deleting only the task. Files outside the taskbox files folder are not deleted. </span>
        <v-switch class="ml-8" v-if="fileExistInFilesFolder" :disabled="deleting" inset color="error" v-model="deleteFiles" dense label="Delete also the task file" :messages="'*This task have a file in the taskbox files folder'" />
      </v-card-text>
      <v-card-actions class="mt-3">
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn :disabled="deleting" small class="mx-1" color="secondary" @click="next()"> no </v-btn>
          <v-btn :disabled="deleting" small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="deleteItem(false)"> yes </v-btn>
          <v-btn v-show="deleting.length > 1" :disabled="deleting" small class="mx-1" color="error" @click="deleteItem(true)"> yes to all </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ipcRenderer } from 'electron';
// import { NodeView } from '../../libs/nodeview';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';
import moment from 'moment';
export default {
  name: 'ConfirmDelete',
  props: { open: Boolean, nodes: Array },
  data() {
    return {
      isOpen: false,
      index: 0,
      deleting: false,
      deleteFiles: false,
      fileExistInFilesFolder: false,
    };
  },
  watch: {
    file(value) {
      this.checkfileExistInFilesFolder(value);
    },
    deletingTasks(value) {
      if (value) {
        this.isOpen = true;
        this.index = 0;
      } else {
        this.isOpen = false;
        this.index = 0;
      }
    },
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      deletingTasks: (state) => state.taskbox.deleting,
      taskList: (state) => state.taskbox.root.tasks
    }),
    dataReady() {
      return this.library && this.deleting ? true : false;
    },
    deletingItem() {
      if (this.deletingTasks && this.taskList[this.deletingTasks.idList[this.deletingTasks.index]])
        return this.taskList[this.deletingTasks.idList[this.deletingTasks.index]];
      else
        return this.next();
    },
    createdAt() {
      return moment(this.deletingItem.createdAt).format('DD/MM/YY HH:mm:ss');
    },
    file() {
      return this.deletingItem && this.deletingItem.value && this.deletingItem.value.file;
    },
  },
  methods: {
    async checkfileExistInFilesFolder(file) {
      if (file == null) return false;
      ipcRenderer.invoke('app:existInFilesFolder', file.path).then(response=>{
        this.fileExistInFilesFolder = response;
      })
    },
    getIcon(name) {
      if (!name) return;
      if (name == 'file' && this.file) return getFileType(this.file.extension).info.icon;
      let type = this.library.blockLibrary.blocktypes.find((t) => t.name.toLowerCase() == name);
      return type.meta.typeicon;
    },
    next() {
      this.$store.commit('taskbox/DELETE_NEXT_TASK');
    },
    async deleteNode() {
      return new Promise((res) => {
        if (this.deleteFiles == true && this.file) {
          ipcRenderer
            .invoke('app:deleteFile', this.file.path)
            .then(() => {})
            .catch((error) => console.log(error))
            .finally(async () => {
              if (this.deletingItem) {
                this.$store.dispatch('taskbox/DELETE_TASKS', [this.deletingItem.id]).then(() => {
                  //  NodeView.deleteNode(this.deletingItem.id);
                });
              }
              setTimeout(res, 10);
            });
        } else {
          if (this.deletingItem) {
            this.$store.dispatch('taskbox/DELETE_TASKS', [this.deletingItem.id]).then(() => {
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
    async close() {
      await this.$store.dispatch('taskbox/GET_FILE_LIST');
      this.$store.commit('taskbox/CLOSE_DELETE_TASKS');
    },
  },
};
</script>
