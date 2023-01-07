<template>
  <v-card flat v-if="task">
    <v-list-item class="mt-6">
      <v-list-item-icon class="mx-auto text-center px-0">
        <svg width="50px" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path :d="getIcon(task.taskType)" fill="#1070ff" />
        </svg>
      </v-list-item-icon>
    </v-list-item>

    <v-list-item style="min-height: 30px">
      <v-list-item-content class="my-0 py-0">
        <v-list-item-title><span class="grey--text">{{parent?'...'+parent.title+' / ':''}}</span>{{ task.title }}{{ file ? file.extension : '' }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="fileExistInFilesFolder">
      <v-switch class="mx-auto" :disabled="deleting" inset color="error" v-model="yesToFile" dense label="Delete also the file?" :messages="'Deletes only files in taskbox files folder.'" @change="$emit('toggleAllFiles',yesToFile)" />
    </v-list-item>

  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';

export default {
  name: 'DeletingItem',
  props: { task: Object, deleteFiles: Boolean,parent:Object },
  data() {
    return {
      childIndex: 0,
      deleting: false,
      yesToFile:false,
      fileExistInFilesFolder: false,
      refreshkey:0
    };
  },
  mounted(){
    this.refreshkey++;
  },
  watch: {
    file(value) {
      this.$nextTick(()=>{
          this.checkfileExistInFilesFolder(value);
      })
    },
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
    }),
    dataReady() {
      return this.library && this.task !== null ? true : false;
    },
    deletingItem() {
      if (!this.taskbox) return;
      return this.taskList[this.children[this.childIndex]];
    },
    file() {
        this.refreshkey;
      return this.task && this.task.value && this.task.value.file;
    },
  },
  methods: {
    next(skip) {
      let index = this.childIndex + 1;
      if (index < this.children.length) {
        this.childIndex = index;
        if (!skip) this.$listeners.delete();
        else this.$listeners.skip();
      } else this.$listeners.done();
    },
    async deleteNode(node) {
      let item = node || this.task;
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
  },
};
</script>

<style scoped>
.transition {
  transition: height 0.1s;
}
</style>
