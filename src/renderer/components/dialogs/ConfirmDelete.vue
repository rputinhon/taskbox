<template>
  <v-dialog v-model="isOpen" max-width="370" persistent @keydown.escape="close()">
    <v-card class="pa-5">
      <v-card-title class="text-h5 text-center" style="display: block">
        <svg width="50" height="50" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y=".52899" width="47" height="47" ry="8.5" fill="#fafafa" />
          <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#ff5555" />
          Deleting
        </svg>
      </v-card-title>
      <v-row align="center" justify="center" style="min-height: 110px">
        <v-card-text class="text-center"> Are you sure you want to delete these tasks? </v-card-text>
    <v-progress-linear color="error" indeterminate v-if="deleting"/>
        <v-card-subtitle> <small class="text-center"> *Files will be kept </small> </v-card-subtitle>
      </v-row>
      <v-card-actions>
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn small rounded color="secondary" @click="close()"> cancel </v-btn>
          <v-btn small rounded style="color: white" class="ml-3" color="error" @click="yes()"> delete </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
// import { deletingstatus } from '../../enums/deletingstatus';

export default {
  name: 'ConfirmDelete',
  data() {
    return {
      isOpen: false,
      loading: false,
      deleting: false,
    };
  },
  computed: {
    ...mapState({
      library: (state) => state.library.library,
      currentTaskBox: (state) => state.taskbox.root.task,
      taskList: (state) => state.taskbox.root.tasks,
      deletingNodes: (state) => state.taskbox.deletingNodes,
    }),
    dataReady() {
      return this.isOpen && this.library && this.deletingTasks ? true : false;
    },
  },
  watch: {
    deletingNodes(value) {
      if (value) {
        this.isOpen = true;
      }
    },
  },
  methods: {
    async yes() {
      this.deleting=true;
      await new Promise((res) => {
        this.deletingNodes.forEach((id) => {
          this.$store.commit('taskbox/DELETE_TASK', id)
        });
        setTimeout(res, 300);
      });
      this.close();
    },
    close() {
      this.deleting=false;
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
.transition {
  transition: height 0.1s;
}
</style>
