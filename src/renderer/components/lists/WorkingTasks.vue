<template>
  <v-sheet class="mx-0 overflow-auto" color="background" :style="`width:100%;max-height:calc(100vh - 40px)`">
    <v-layout align-start justify-start row class="overflow-auto pa-8" style="min-height:100vh;width: max-content !important">
        <roots/>
        <tasks-pannel v-if="authenticated" key="1" class="mr-5"  :taskList="offlineTasks" :title="'Colaborations'" />
        <tasks-pannel v-if="authenticated" key="2" class="mr-5"  :taskList="offlineTasks" :title="'Open Tasks'" />
    </v-layout>
  </v-sheet>
</template>

<script>

import { mapState } from 'vuex';
import _ from 'lodash';
import TasksPannel from './TasksPannel.vue';
import Roots from '../dialogs/Roots.vue';

export default {
  name: 'WorkingTasks',
  components: {
    TasksPannel,
    Roots
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  computed: {
    ...mapState({
      offlineTasks: (state) => _.cloneDeep(Object.values(state.taskbox.myTasks)),
      myTasks: (state) => _.cloneDeep(Object.values(state.taskbox.myTasks)),
      jobTasks: (state) => _.cloneDeep(Object.values(state.taskbox.myTasks)),
      profile: (state) => state.user.profile,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  methods: {
      getProfile(id) {
      this.$store.dispatch('user/GET_PROFILE', id).then((profile) => {
        this.profile = profile;
        this.getPosts();
      });
    },
  },
};
</script>

<style scoped>
.draggableitem {
  overflow: visible;
  padding: 0px;
  margin: 3px 0px;
  border: 2px solid transparent;
}

.ghost {
  background: rgb(187, 187, 187) !important;
  background-blend-mode: multiply;
  opacity: 0.3;
  pointer-events: none;
  /* border: 2px solid #bebebe; */
}
.drag {
  cursor: grabbing !important;
  background: rgba(255, 255, 255, 1) !important;
  box-shadow: -5px 8px 15px rgba(0, 0, 0, 0.3) !important;
  position: absolute;
  transform: rotateZ(-1deg);
  opacity: 1 !important;
}
</style>
