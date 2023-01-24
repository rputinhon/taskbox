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
        <v-list-item-title>
          <svg width="20px" style="margin-bottom: -5px" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="getIcon('taskbox')" fill="#1070ff" />
          </svg>
          <span class="grey--text">{{ parent ? ' ' + parent.title + ' / ' : '' }}</span
          >{{ task.title }}{{ file ? file.extension : '' }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { getFileType } from '../../fixtures/fileTypes';

export default {
  name: 'DeletingItem',
  props: { task: Object },
  data() {
    return {
      refreshkey: 0,
    };
  },
  mounted() {
    this.refreshkey++;
  },
  watch:{
    task(){
      this.refreshkey++;
    }
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      taskList: (state) => state.taskbox.root.tasks,
      taskParent: (state) => state.taskbox.root.task,
    }),
    parent() {
      this.refreshkey;
      return this.taskParent.id == this.task.taskbox ? this.taskParent : this.taskList[this.task.taskbox];
    },
    dataReady() {
      return this.library && this.task !== null ? true : false;
    },
    file() {
      this.refreshkey;
      return this.task && this.task.value && this.task.value.file;
    },
  },
  methods: {
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
