<template>
  <v-card flat v-if="dataReady">
    <deleting-item v-if="!isTaskBox" :parent="parent" :deleteFiles="deleteFiles" :task="deletingItem" @done="next()" @change="$emit('toggleAllFiles')" />
    <deleting-task-box-item v-else-if="taskboxChild" :deleteFiles="false" :list="taskboxChild" @done="next()" />
    <v-card-actions class="mt-3" v-if="!isTaskBox">
      <v-row class="py-3" align="center" justify="center" style="width: 100%">
        <v-btn :disabled="deleting" small class="mx-1" color="secondary" @click="next(true)"> no </v-btn>
        <v-btn :disabled="deleting" small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="deleteItem(false)"> yes </v-btn>
        <v-btn v-show="count > 1" :disabled="deleting" small class="mx-1" color="error" @click="deleteItem(true)"> yes to all </v-btn>
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
  props: { list: Object, deleteFiles: Boolean },
  data() {
    return {
      childIndex: 0,
      deleting: false,
      refreshKey: 0,
    };
  },
  created() {
    this.childIndex = 0;
    setTimeout(() => {
      this.refreshKey++;
    }, 100);
  },
  watch: {
    list() {
      this.childIndex = 0;
      this.refreshKey++;
    },
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      taskList: (state) => state.taskbox.root.tasks,
    }),
    dataReady() {
      this.refreshKey;
      return this.library && this.taskList && this.list ? true : false;
    },
    count(){
        return this.children.length;
    },
    isTaskBox() {
      this.refreshKey;
      if (!this.dataReady || !this.list.children || !this.list.children[this.children[this.childIndex]]) return;
      return this.list.children[this.children[this.childIndex]].children ? true : false;
    },
    children() {
      this.refreshKey;
      return Object.keys(this.list.children);
    },
    taskboxChild() {
      this.refreshKey;
      return Object.values(this.list.children)[this.childIndex];
    },
    parent() {
      this.refreshKey;
      return this.taskList[this.list.id];
    },
    deletingItem() {
      this.refreshKey;
      return this.taskList[this.children[this.childIndex]];
    },
  },
  methods: {
    next() {
      let index = this.childIndex + 1;
      if (index < this.children.length) {
        this.childIndex = index;
      } else this.$listeners.done();
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
