<template>
  <v-menu absolute rounded="pill" class="pa-0 ma-0" offset-y light transition="none" :close-on-content-click="true" style="z-index: 1001">
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <RULE :rule="rules.EDIT" :returnCondition="true">
            <v-btn slot-scope="allow" :disabled="!allow.value" :class="extraClass && extraClass" :left="options.includes('left')" :elevation="options.includes('flat') ? 0 : 2" :fab="options.includes('fab')" :icon="options.includes('icon')" :absolute="options.includes('absolute')" :outlined="options.includes('outlined') && !taskDone && !reviewing" :color="status.color" :right="options.includes('right')" :x-small="!options.includes('small')" :style="extraStyle && extraStyle" v-on="{ ...onMenu, ...onTooltip }">
              <svg :width="!taskDone ? 25 : 30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="status.icon" :fill="options.includes('icon') ? (!allow.value ? 'rgba(100,100,100,0.3)' : status.color) : '#fafafa'" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
              </svg>
            </v-btn>
          </RULE>
        </template>
        {{ status.text }}
      </v-tooltip>
    </template>
    <v-card outlined rounded="pill" class="pa-0 ma-0">
      <v-list class="my-0 py-1" v-for="(item, i) in statusTypes" :key="i" v-show="!hideItems.includes(i)">
        <v-tooltip v-if="item" right transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn icon fab :x-small="!options.includes('small')" v-on="onTooltip" :color="i == status.value ? item.color : 'grey darken-2'" @click="confirmChange(i)">
              <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="item.icon" :fill="i == status.value ? item.color : 'grey'" />
              </svg>
            </v-btn>
          </template>
          Set TaskBox {{ item.text }}
        </v-tooltip>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import RULE from '../navigation/Rule.vue';
import RULES from '../../enums/rules';

export default {
  components: { RULE },
  name: 'VerticalStatusMenu',
  props: { entity: Object, extraClass: String, hideItems: Array, options: Array, extraStyle: String },
  data() {
    return {
      statusTypes: [],
      loading: true,
      updatedstatus: 0,
      pretendedStatus: 0,
    };
  },
  mounted() {
    this.filter = this.filterModel;
    this.statusTypes = Object.values(taskstate);
  },
  computed: {
    task(){
      return this.entity.task;
    },
    reviewing() {
      if (!this.status) return;
      return this.status.value == taskstate.REVIEWING.value ? true : false;
    },
    taskDone() {
      if (!this.status) return;
      return this.status.value == taskstate.DONE.value ? true : false;
    },
    taskStatus: {
      get() {
        return this.task.status;
      },
      set(value) {
        this.updatedstatus = value;
      },
    },
    rules() {
      return RULES;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
  },
  methods: {
    confirmChange(i) {
      if (this.statusTypes[i].value == this.status.value) return;
      eventBus.$emit('confirmChangeStatus', { task: this.task, newStatus: this.statusTypes[i] });
    },
  },
};
</script>

<style>
.titlebar-button {
  -webkit-app-region: no-drag;
}
.customTaskSlider .v-slider--horizontal {
  width: 183px;
  max-width: 183px !important;
  min-height: 20px !important;
}
.statusButton {
  z-index: 3;
  top: 12px;
  text-transform: lowercase !important;
}
</style>
