<template>
  <v-tooltip bottom transition="none" v-if="task">
    <template v-slot:activator="{ on: onTooltip }">
      <v-menu rounded="0" ref="taskmenu" bottom offset-y light>
        <template v-slot:activator="{ on: onMenu }">
          <RULE :rule="rules.EDIT" :doc="task" :returnCondition="true">
            <v-btn v-on="{ ...onMenu, ...onTooltip }" slot-scope="allow" :absolute="options.includes('absolute')" :left="options.includes('left')" :right="options.includes('right')" :disabled="!allow.value" :elevation="options.includes('icon') ? 0 : 5" fab x-small :icon="options.includes('icon')" class="windowbar-button" :class="extraClass && extraClass">
              <svg width="23" version="1.1" viewBox="0 0 48 43" xmlns="http://www.w3.org/2000/svg">
                <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " :fill="!allow.value ? 'rgba(100,100,100,0.3)' : options.includes('white') || completed || reviewing ? '#fafafa' : status.color" />
              </svg>
            </v-btn>
          </RULE>
        </template>
        <v-card class="mx-auto" max-width="400" width="150">
          <v-list-item-group>
            <v-list-item v-if="!isTaskBox" @click.stop="deleteTask()">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-card>
      </v-menu>
    </template>
    task menu
  </v-tooltip>
</template>

<script>
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import RULES from '../../enums/rules';
import RULE from '../navigation/Rule.vue';

export default {
  name: 'TaskMenu',
  props: { task: Object, options: Array,extraClass:String },
  components: {
    RULE,
  },
  data() {
    return {};
  },
  computed: {
    isTaskBox() {
      if (!this.task) return;
      return this.task.taskType == 'taskbox' ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    completed() {
      if (!this.task) return false;
      return this.task.status == taskstate.DONE.value ? true : false;
    },
    reviewing() {
      if (!this.task) return;
      return this.task.status == taskstate.REVIEWING.value ? true : false;
    },
    unstarted() {
      if (!this.task) return;
      return this.task.status == taskstate.UNSTARTED.value ? true : false;
    },
    rules() {
      return RULES;
    },
  },
  methods: {
    deleteTask() {
      this.$store.dispatch('taskbox/DELETE_TASKS', [this.task.id]);
    },
  },
};
</script>
