<template>
  <RULE :rule="rules.EDIT" :returnCondition="true" v-if="currentTask">
    <v-menu :disabled="!options.includes('popup')"  left bottom offset-y  z-index="1000" :close-on-content-click="false">
      <template v-slot:activator="{ on: onHover }">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn class="windowbar-button mx-1" icon :absolute="options.includes('absolute')" :x-large="options.includes('largeIcon')" :small="!options.includes('largeIcon')" v-on="{ ...onHover, ...onTooltip }" elevation="0" @click.stop="getTask(taskId);">
              <svg :width="options.includes('largeIcon') ? 70 : 24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="m 23.813533,4.882906 c -10.435442,0 -18.930627,8.495185 -18.930627,18.930627 0,10.435443 8.495185,18.92856 18.930627,18.92856 10.435443,0 18.92856,-8.493117 18.92856,-18.92856 0,-10.435442 -8.493117,-18.930627 -18.92856,-18.930627 z m 0,3.2333943 c 8.687941,3e-7 15.695166,7.0092907 15.695166,15.6972327 0,8.687944 -7.007225,15.695166 -15.695166,15.695166 -8.687942,0 -15.6972327,-7.007222 -15.6972327,-15.695166 0,-8.687942 7.0092907,-15.6972327 15.6972327,-15.6972327 z m -3.089734,4.6767167 c -0.45541,-0.0087 -0.82971,0.357841 -0.830957,0.813387 l -0.01292,3.730005 h 5.534029 l 0.04548,-3.646806 c 0.0084,-0.462601 -0.272744,-0.790943 -0.799434,-0.823722 z m -0.853694,7.441923 -0.04392,13.060184 c -0.0019,0.452033 0.363954,0.819362 0.815971,0.819073 l 7.984008,0.0016 c 0.455518,-2.65e-4 0.822198,-0.374465 0.81442,-0.829924 l -0.06976,-3.796668 c -0.0078,-0.443889 -0.369432,-0.800256 -0.813387,-0.801502 l -3.286104,-0.01035 0.106454,-8.442379 z"
                  :fill="color || '#1070ff'"
                />
              </svg>
            </v-btn>
          </template>
          task description
        </v-tooltip>
      </template>
      <v-card class="overflow-y-auto pa-3 pb-10" width="100%" min-width="500" max-width="512" min-height="100" max-height="650" height="520">
        <v-row no-gutters justify="center" align="center">
          <v-col align-self="center" :cols="isTaskBox && taskBoxInfo && options.includes('statistics') ? 8 : 12" class="pr-3">
            <v-btn disabled icon fab left top>
              <svg :width="24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :d="status.icon" :fill="status.color" />
              </svg>
              <small :style="`color:${status.color}`">
                {{ status.text }}
              </small>
            </v-btn>
            <subject :options="['edit']" :task="task" />
          </v-col>
          <v-col cols="4" v-if="isTaskBox && taskBoxInfo && options.includes('statistics')">
            <v-card hover class="pa-5 ma-0 windowbar-button" width="100%">
              <task-status-menu v-if="options.includes('status')" :options="['fab', 'flat', 'icon']" :size="80" :extraClass="'mt-1'" :task="currentTask" />
              <div class="text-subtitle-1 grey--text">Task Progress</div>
              <v-progress-linear height="15px" class="mt-1" :color="status.color" rounded :value="taskBoxInfo.Progress">
                <small class="black--text" style="font-size: 12px">{{ taskBoxInfo.Progress }}% </small>
              </v-progress-linear>
              <v-simple-table class="mt-13" dense style="background-color: transparent">
                <tbody>
                  <tr v-for="(item, i) in taskBoxInfo" :key="i" v-show="item.name">
                    <td style="height: 18px; width: 30px; border: none !important">
                      <svg width="23" version="1.1" viewBox="0 -7 48 52" xmlns="http://www.w3.org/2000/svg">
                        <path y="1" :d="item.icon" :fill="item.color" style="pointer-events: none" />
                      </svg>
                    </td>
                    <td style="height: 18px; border: none !important">{{ item.name }}</td>
                    <td style="height: 18px; width: 30px; border: none !important">{{ item.value }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
  </RULE>
</template>

<script>
import RULES from '../../enums/rules';
import RULE from '../navigation/Rule.vue';
import _ from 'lodash';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { mapState } from 'vuex';
import TaskStatusMenu from '../menus/TaskStatusMenu.vue';
import { taskRepository } from '../../store/modules/task/taskRepository';
import Subject from './Subject.vue';

export default {
  name: 'TaskSubject',
  components: { RULE, TaskStatusMenu, Subject },
  props: { task: Object, taskId: String, options: Array, extraClass: String, color: String },
  data() {
    return {
      editingSubject: false,
      updatedSubject: null,
      currentTask: null,
    };
  },
  mounted() {
    this.getTask(this.taskId);
  },
  computed: {
    ...mapState({
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
    }),
    rules() {
      return RULES;
    },
    status() {
      return getStatusTypeByValue(this.currentTask.status);
    },
    isTaskBox() {
      if (!this.currentTask) return;
      return this.currentTask.type == 'taskbox' ? true : false;
    },
    subject: {
      get() {
        return this.currentTask.subject;
      },
      set(value) {
        this.updatedSubject = value.trim().length !== 0 ? value : this.currentTask.subject;
      },
    },
    completed() {
      if (!this.status) return null;
      return this.status.value == taskstate.DONE.value ? true : false;
    },
  },
  methods: {
    edit() {
      if (this.options.includes('readOnly')) return;
      this.editingSubject = true;
    },
    async getTask(id) {
      if (this.task) this.currentTask = this.task;
      else {
        taskRepository.find(id).then((task) => {
          this.currentTask = task;
        });
      }
    },
    updateSubject() {
      if (!this.updatedSubject || this.updatedSubject.trim().length == 0) return (this.editingSubject = false);
      let copy = _.cloneDeep(this.currentTask);
      copy.subject = this.updatedSubject;

      this.$store.dispatch('taskbox/UPDATE_TASK', copy);
      this.editingSubject = false;
    },
  },
};
</script>

<style scoped>
.subject {
  color: grey;
  width: 100%;
  font-size: 16px;
  text-align: justify;
}
</style>
