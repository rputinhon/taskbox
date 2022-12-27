<template>
  <v-menu bottom offset-y left z-index="10" v-if="taskBoxInfo">
    <template v-slot:activator="{ on: menu }">
      <v-btn :ripple="false" class="windowbar-button pr-1 pl-2" v-on="{ ...menu }" depressed rounded small @dblclick.stop>
         <small class="mx-0" :style="`font-size:11px;color:${status.color}`">{{ taskBoxInfo.Progress || 0 }}%</small>
        <svg style="pointer-events: none" width="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path :d="status.icon" :fill="status.color" />
        </svg>
      </v-btn>
    </template>
    <v-card class="pa-3 pb-5 windowbar-button" width="300">
      <task-status-menu :task="taskbox" v-if="options.includes('status')" :options="['fab', 'flat', 'icon']" :size="80" :extraClass="'mt-1'" :entity="currentTaskBox" />
      <v-list-item-subtitle v-if="options.includes('status')">
        {{ status.text }}
      </v-list-item-subtitle>
      <task-subject v-if="options.includes('subject')" :task="currentTaskBox" :options="['popup']" :extraClass="'text-center'" />
      <v-simple-table class="my-6" dense style="background-color: transparent">
        <tbody>
          <tr v-for="(item, i) in taskBoxInfo" :key="i" v-show="item.name">
            <td style="height: 18px; width: 30px; border: none !important">
              <svg width="23" version="1.1" viewBox="0 -7 48 52" xmlns="http://www.w3.org/2000/svg">
                <path y="1" :d="item.icon" :fill="item.color" style="pointer-events: none" />
              </svg>
            </td>
            <td style="height: 18px;border: none !important">{{ item.name }}</td>
            <td style="height: 18px; width: 30px; border: none !important">{{ item.value }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import { getStatusTypeByValue } from '../../enums/taskstate';
import TaskSubject from '../lists/TaskSubject.vue';
import TaskStatusMenu from '../menus/TaskStatusMenu.vue';

export default {
  components: { TaskStatusMenu, TaskSubject },
  name: 'TaskBoxTableInfo',
  props: { taskbox: Object, options: Array },
  data() {
    return {
      info: null,
    };
  },
  mounted() {
    // if (this.taskbox) this.getInfo(this.taskbox);
  },
  watch: {
    // taskbox(value) {
    //   // if (value) this.getInfo(value);
    //   else this.info = null;
    // },
  },
  computed: {
    ...mapState({
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      currentTaskBoxInfo: (state) => state.taskbox.taskBoxInfo,
      workingTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    status() {
      return getStatusTypeByValue(this.currentTaskBox.status);
    },
    taskBoxInfo() {
      return this.info ? this.info : this.currentTaskBoxInfo;
    },
  },
  methods: {

  },
};
</script>
