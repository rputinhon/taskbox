<template>
  <v-card flat v-if="dataReady">
    <deleting-item v-if="!isTaskBox" :parent="parent" :deleteFiles="deleteFiles" :task="deletingItem" @delete="deleteItem" @files="setDeleteFiles" />
    <v-card-actions class="mt-2">
      <v-row class="py-3" align="center" justify="center" style="width: 100%">
        <v-btn rounded :disabled="deleting" small class="mx-1" color="secondary" @click="next(true)"> no </v-btn>
        <v-btn rounded :disabled="deleting" small class="mx-1" :color="!deleteFiles ? 'primary' : 'error'" @click="deleteItem()"> yes </v-btn>
        <v-btn rounded :disabled="deleting" small class="mx-1" color="error" @click="$emit('setDeleteAll', true), deleteItem()"> yes to all </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';
import DeletingItem from './DeletingItem.vue';
import { deletingstatus } from '../../enums/deletingstatus';

export default {
  name: 'DeletingTaskBoxItem',
  components: { DeletingItem, DeletingTaskBoxItem },
  props: { list: Object, skipped: Boolean, yesForAll: Boolean },
  data() {
    return {
      childIndex: 0,
      deleting: false,
      deleteFiles: false,
      refreshKey: 0,
      loading: false,
      index:[0],
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
      console.log(this.list);
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
    next(skipped) {
      if (skipped) {
        this.$listeners.setKipped(true);
        console.log('skip');
        this.$store.commit('taskbox/CHANGE_DELETING_STATUS', { item: this.taskboxChild, status: deletingstatus.KEPT });
      }
      if (this.hasToDelete) {

        this.childIndex++;
        this.refreshKey++;

      } else {
        // delete the parent taskbox
        if (!skipped) {
          this.$store.commit('taskbox/CHANGE_DELETING_STATUS', { item: this.taskboxChild, status: deletingstatus.KEPT });
          this.deleteParent(this.taskboxChild);
        } else this.$listeners.done();
      }
    },
    setDone() {
      if (this.yesForAll) {
        // if (!this.isTaskBox) this.deleteItem();
        this.deleteItem();
      } else {
        this.deleteParent(this.taskbox);
      }
    },
    setDeleteAll(value) {
      this.$listeners.setDeleteAll(value);
    },
    setDeleteFiles(value) {
      this.deleteFiles = value;
    },
    async deleteParent(parent) {
      if (parent && parent.status == deletingstatus.WAITING)
        this.deleteNode(this.parent).then(() => {
          this.$store.commit('taskbox/CHANGE_DELETING_STATUS', { item: parent, status: deletingstatus.DELETED });
          this.$listeners.done();
        });
      else this.$listeners.done();
    },
    async deleteItem(item) {
      return await this.deleteNode(item).then(() => {
        this.$store.commit('taskbox/CHANGE_DELETING_STATUS', { item: this.taskboxChild, status: deletingstatus.DELETED });
        return this.next();
      });
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
                setTimeout(res(), 1000);
                // });
              }
            });
        } else {
          if (item) {
            console.log('deleted:', { task: item.id, parent: item.taskbox, files: this.deleteFiles });
            this.deleting = false;
            // this.$store.dispatch('taskbox/DELETE_TASK', item).then(() => {
            setTimeout(res(), 1000);
            // });
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
