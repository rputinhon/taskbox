<template>
  <v-toolbar absolute style="flex-wrap: wrap !important" class="my-2 ml-2 mr-2" color="transparent" outlined height="38px!important" elevation="0" v-if="breadCrumb">
    <task-subject :color="'grey'" :task="taskbox" :options="['popup', 'statistics', 'status']" />
    <nav-menu :options="['menu', 'home', 'parent']" />
    <!-- <v-autocomplete class="mt-6 mr-6" solo-inverted v-show="searching" :items="items" :search-input.sync="search" hide-no-data autofocus dense placeholder="search" rounded> </v-autocomplete> -->
    <v-list class="pl-1 bread" color="transparent" v-for="(bread, i) in breadCrumb" :key="i">
      <v-list-item class="breadmenuitem">
        <v-menu rounded="lg" offset-y transition="none" open-on-hover>
          <template v-slot:activator="{ on }">
            <v-toolbar-title class="breaditem" v-on="on" @click="openTaskBox(bread)">
              <span>
                {{ i == 0 && bread.root !== null ? '...' : '' }}
                {{ bread.title }}
              </span>
              <span v-if="i !== breadCrumb.length - 1">\</span>
            </v-toolbar-title>
          </template>
          <v-list v-for="(breadChild, k) in bread.children" :key="k" class="py-0">
            <v-list-item class="listitem my-0" @click="openTaskBox(breadChild)">
              <v-list-item-subtitle class="breaditem">
                {{ breadChild.title }}
                - {{ breadChild.progress }}%
              </v-list-item-subtitle>
              <v-list-item-icon class="my-2">
                <svg width="15" height="15" version="1.1" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
                  <path :d="status(breadChild.status).icon" :fill="status(breadChild.status).color" />
                </svg>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-list>
  </v-toolbar>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getStatusTypeByValue } from '../../enums/taskstate';
import TaskSubject from '../lists/TaskSubject.vue';
import NavMenu from './NavMenu.vue';
export default {
  name: 'BreadCrumb',
  components: { 
    NavMenu,
    TaskSubject,
    },
  data: () => ({
    editingTitle: false,
  }),
  computed: {
    ...mapState({
      breadCrumb: (state) => state.taskbox.breadCrumb,
      profile: (state) => state.user.profile,
      taskbox: (state) => state.taskbox.currentTaskBox,
    }),
    ...mapGetters({
      root: ['taskbox/currentRootId'],
      currentTaskBox: ['taskbox/currentTaskBoxId'],
    }),
  },
  methods: {
    isRoot(id) {
      return this.profile.id == id ? true : false;
    },
    openTaskBox(item) {
      if (item.id == this.currentTaskBox) return;
      this.$store.dispatch('taskbox/OPEN_TASKBOX', { id: item.id, deeper: true, savestack: true });
    },
    status(status) {
      return getStatusTypeByValue(status || 0);
    },
  },
};
</script>

<style scoped>
.v-list::-webkit-scrollbar {
  width: 3px;
}
.v-list::-webkit-scrollbar-track {
  background-color: #363636;
}

.v-list::-webkit-scrollbar-thumb {
  background-color: #5f5f5f;
}

.listitem {
  flex-wrap: nowrap;
  min-height: 30px !important;
  cursor: pointer;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 15px;
  padding-right: 10px;
}

.breadmenuitem.v-list-item {
  padding: 0px 0;
  border-radius: 0px;
  font-size: 13px;
  flex-wrap: nowrap;
  cursor: pointer;
}
.bread {
  overflow: auto;
  max-width: 140px;
  flex-wrap: wrap !important;
  height: auto;
}

.breaditem {
  color: aliceblue;
  font-size: 12px;
  font-weight: 600;
}

.v-list-item {
  text-align: left;
  cursor: pointer;
}
</style>
