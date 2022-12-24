<template>
  <v-menu rounded="0" z-index="10000" bottom left offset-y transition="none" :close-on-content-click="false">
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn fab :right="right || false" :class="extraClass" icon elevation="0" x-small v-on="{ ...onMenu, ...onTooltip }" >
            <v-badge :value="filter.length !== 7" dot color="primary" overlap bottom offset-x="5" offset-y="30">
              <svg width="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 20.756304,27.497702 9.968079,6.1355109 H 37.941124 L 27.022358,27.497702 26.891815,37.857409 20.756304,43.470749 V 27.497702" :style="filter.length == 0 && 'filter:grayscale(1)'" 
                :fill="filter.length !== 7?'#1070ff':'grey'" stop-color="#000000" style="paint-order: fill markers stroke" />
              </svg>
            </v-badge>
          </v-btn>
        </template>
        Filter Tasks
      </v-tooltip>
    </template>
    <v-card class="mx-auto" max-width="400" width="150">
      <v-list-item>
        <v-list-item-title>Filter By</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item-group v-model="filter" active-class="border" color="primary" multiple>
        <v-list-item v-for="(item, i) in filterTypes" :key="i" v-show="isVisible(i)">
          <v-list-item-icon class="mr-0 pr-1">
            <svg width="30" height="30" version="1.1" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
              <path :d="item.icon" :fill="filter.includes(item.value) ? '#1070ff' : 'grey'" />
            </svg>
          </v-list-item-icon>
          <v-list-item-content :color="i == filter && 'accent'">
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      <v-divider></v-divider>
      <v-list-item link @click="filter = [0, 1, 2, 3, 4, 5, 6]">
        <v-list-item-icon class="mr-0 pr-1">
          <svg width="30" height="30" version="1.1" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <path d="m 30.660251,11.078125 a 3,3 0 0 0 -0.783203,0.01563 3,3 0 0 0 -1.964844,1.1875 l -9.050781,12.291016 a 3,3 0 0 0 -3.5,0.828125 3,3 0 0 0 0.06055,3.839843 L 15.154392,29.605469 9.5860322,25.001953 A 3,3 0 0 0 5.3614228,25.400391 3,3 0 0 0 5.7618135,29.625 l 8.0136725,6.626953 a 3.0003,3.0003 0 0 0 4.328125,-0.533203 l 1.902343,-2.583984 3.769532,3.117187 A 3.0003,3.0003 0 0 0 28.103611,35.71875 L 42.742283,15.839844 a 3,3 0 0 0 -0.636719,-4.195313 3,3 0 0 0 -2.228516,-0.550781 3,3 0 0 0 -1.964844,1.1875 L 25.154392,29.605469 23.570407,28.294922 32.742283,15.839844 a 3,3 0 0 0 -0.636719,-4.195313 3,3 0 0 0 -1.445313,-0.566406 z" color="#000000" :fill="filter.length == 0 ? '#1070ff' : 'grey'" />
          </svg>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Show All</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="taskable" color="primary">
        <v-list-item-content class="mt-0 pt-0">
          <v-switch v-model="isTaskable" dense label="Only Taskable" hide-details="true" @change="$emit('updateFilterTaskable', isTaskable)" />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import taskstate from '../../enums/taskstate';
export default {
  name: 'TaskFilter',
  props: { taskable: Boolean, extraClass: String, right: Boolean,filterModel:Array },
  data() {
    return {
      isTaskable: true,
    };
  },
  created() {
    this.isTaskable = this.taskable;

  },
  watch: {
    taskable() {
      return (this.isTaskable = this.taskable);
    },
  },
  computed: {
    ...mapState({
      taskFilter: (state) => state.app.taskFilter,
    }),
    filterTypes() {
      return Object.values(taskstate);
    },
    filter: {
      get() {
        return this.filterModel || this.taskFilter;
      },
      set(value) {
        this.filterModel?
        this.$listeners.updateFilter(value):
        this.$store.commit('app/SET_TASK_FILTER', value);
      },
    },
  },
  methods: {
    getIcon() {
      return this.filterTypes[this.filter].icon;
    },
    isVisible() {
      return true;
    },
  },
};
</script>
