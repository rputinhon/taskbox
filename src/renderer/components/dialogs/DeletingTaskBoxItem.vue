<template>
  <v-card flat v-if="dataReady">
    <deleting-item v-if="!isTaskBox" :parent="parent" :deleteFiles="deleteFiles" :task="deletingItem" @delete="deleteItem()" @files="setDeleteFiles" />
    <deleting-task-box-item v-else-if="taskboxChild" :deleteFiles="false" :list="taskboxChild" @done="next(skipped)" @loaded="loading = false" />
    <v-card-actions v-if="!isTaskBox" class="mt-2">
      <v-row class="py-3" align="center" justify="center" style="width: 100%">
        <v-btn rounded :disabled="deleting" small class="mx-1" color="secondary" @click="next(true)"> no </v-btn>
        <v-btn rounded :disabled="deleting" small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="deleteItem(false)"> yes </v-btn>
        <v-btn rounded :disabled="deleting" small class="mx-1" color="error" @click="deleteItem(true)"> yes to all </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';
import DeletingItem from './DeletingItem.vue';
import DeletingTaskBoxItem from './DeletingTaskBoxItem.vue';

export default {
  name: 'DeletingTaskBoxItem',
  components: { DeletingItem, DeletingTaskBoxItem },
  props: { list: Object },
  data() {
    return {
      childIndex: 0,
      deleting: false,
      deleteFiles: false,
      yesForAll: false,
      skipped: false,
      refreshKey: 0,
      loading: false,
    };
  },
  mounted() {
    this.childIndex = 0;
    this.loading = true;
    setTimeout(() => {
      this.refreshKey++;
      this.$listeners.loaded();
    }, 1000);
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      taskList: (state) => state.taskbox.root.tasks,
    }),
    dataReady() {
      this.refreshKey;
      let ready = this.library && this.list ? true : false;
      return ready;
    },
    hasToDelete() {
      this.refreshKey;
      return this.childIndex < this.children.length - 1 ? true : false;
    },
    taskbox() {
      this.refreshKey;
      return this.list;
    },
    isTaskBox() {
      this.refreshKey;
      if (!this.taskbox.children || !this.taskbox.children[this.children[this.childIndex]]) return;
      return this.taskbox.children[this.children[this.childIndex]].children ? true : false;
    },
    children() {
      this.refreshKey;
      if (!this.dataReady) return;
      return Object.keys(this.taskbox.children);
    },
    taskboxChild() {
      this.refreshKey;
      return Object.values(this.taskbox.children)[this.childIndex];
    },
    parent() {
      this.refreshKey;
      return this.taskList[this.taskbox.id];
    },
    deletingItem() {
      this.refreshKey;
      return this.taskList[this.children[this.childIndex]];
    },
  },
  methods: {
    setDeleteFiles(value) {
      this.deleteFiles = value;
    },
    setDeleting(value) {
      this.$listeners.setDeleting(value);
    },
    next(skipped) {
      this.skipped = skipped;
      if (this.hasToDelete) {
        this.refreshKey++;
        this.childIndex++;
      } else this.setDone();
    },
    async deleteItem(all) {
      this.deleting = true;
      this.yesForAll = all;
      this.deleteNode().then(async () => {
        if (this.yesForAll && this.deleteFiles) {
          await this.deleteItem(true);
        } else {
          this.deleting = false;
          this.deleteFiles = false;
          this.yesForAll = false;
        }
        this.next();
      });
    },
    setDone() {
      this.refreshKey++;
      if (this.skipped == true) {
        // if is not current task box remove nodes and save;
        this.$listeners.done();
      }
      else{
        // await delete taskbox and next
          // this.deleteNode(this.parent).then(() => {
            this.$listeners.done();
          // });
      }
    },
    async deleteNode(task) {
      let item = task || this.deletingItem;
      return new Promise((res) => {
        if (this.deleteFiles == true && this.file) {
          ipcRenderer
            .invoke('app:deleteFile', this.file.path)
            .then(() => {})
            .catch((error) => console.log(error))
            .finally(async () => {
              if (item) {
                this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
                  setTimeout(res, 10);
                });
              }
            });
        } else {
          if (item) {
            this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
              setTimeout(res, 10);
            });
          }
        }
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
