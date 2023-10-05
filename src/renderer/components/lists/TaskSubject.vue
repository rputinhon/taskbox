<template>
  <RULE :rule="rules.EDIT" :returnCondition="true" v-if="currentTask">
    <v-menu :disabled="!options.includes('popup')"  :left="!options.includes('right')" :right="options.includes('right')" bottom offset-y  z-index="1000" :close-on-content-click="false">
      <template v-slot:activator="{ on: onHover }">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn class="windowbar-button ma-0" icon :absolute="options.includes('absolute')" :x-large="options.includes('largeIcon')" :small="!options.includes('largeIcon')" v-on="{ ...onHover, ...onTooltip }" elevation="0" @click.stop="getTask(taskId);">
              <svg :width="options.includes('largeIcon') ? 70 : 24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path
                  d="m 23.813284,6.1423433 c -9.741057,0 -17.6709407,7.9298827 -17.6709407,17.6709407 0,9.741057 7.9298837,17.669373 17.6709407,17.669373 9.74106,0 17.669373,-7.928316 17.669373,-17.669373 0,-9.741058 -7.928313,-17.6709407 -17.669373,-17.6709407 z m 0,3.0183004 c 8.109833,0 14.651073,6.5427983 14.651073,14.6526403 0,8.109841 -6.54124,14.651073 -14.651073,14.651073 -8.109842,0 -14.6526403,-6.541232 -14.6526403,-14.651073 0,-8.109842 6.5427983,-14.6526403 14.6526403,-14.6526403 z m 6.893437,6.5504723 c -0.968943,0.0031 -1.898374,0.390866 -2.581401,1.078132 l -7.355538,7.403778 -2.386089,-2.297453 -0.0012,-0.0012 c -1.445161,-1.390499 -3.776293,-1.347109 -5.167899,0.09726 -1.392798,1.445257 -1.3486,3.778089 0.09726,5.170251 l 4.979646,4.793749 v 0.0012 c 1.429713,1.376179 3.728559,1.350574 5.127503,-0.05687 h 0.0012 l 9.893014,-9.954588 c 1.414023,-1.42303 1.405892,-3.755849 -0.01647,-5.170251 -0.687525,-0.683806 -1.620353,-1.067011 -2.590028,-1.064014 z m 0.0071,2.120968 c 0.407655,-0.0012 0.798501,0.158054 1.08676,0.446314 l 0.0012,0.0012 c 0.608298,0.608297 0.612169,1.559373 0.0059,2.169599 l -9.893051,9.954578 c -0.599344,0.602112 -1.540928,0.612803 -2.153127,0.02354 v 0.0012 l -4.97969,-4.793795 c -0.619856,-0.59683 -0.637497,-1.551185 -0.0404,-2.170776 0.596742,-0.619371 1.550501,-0.638185 2.169992,-0.04158 l 7.59e-4,0.0012 3.139094,3.021829 c 0.417286,0.40172 1.079681,0.394388 1.487972,-0.01647 l 8.09171,-8.143488 c 0.287147,-0.288929 0.675486,-0.452031 1.082838,-0.453372 z"
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
              <small :style="`color:${status.color}`">
                {{task.title}} | {{ status.text }}
              </small>
              <!-- <svg :width="24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :d="status.icon" :fill="status.color" />
              </svg> -->
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
