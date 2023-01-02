<template>
  <v-toolbar flat height="30px" color="transparent" class="my-0 windowbar-button">
      <v-btn-toggle v-model="filter"  multiple group  color="background" @change="updateFilter()">
        <v-tooltip bottom transition="none" v-for="(item, t) in filterTypes" :key="t">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn fab width="26" height="24" icon v-on="{ ...onTooltip }" x-small class="pa-0  ma-0" @click.stop>
              <svg width="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="item.icon" :fill="filter.includes(item.value) ?'#1070ff': 'grey'" />
              </svg>
            </v-btn>
          </template>
          Filter by {{ item.text }}
        </v-tooltip>
      </v-btn-toggle>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import taskstate from '../../enums/taskstate';
export default {
  name: 'TaskFilter',
  props: { filterModel: Array },
  data() {
    return {
      filter: [],
      filterTypes: [],
    };
  },
  created() {
    this.filter = this.filterModel;
    this.filterTypes = Object.values(taskstate);
  },

  watch: {
    filterModel() {
      this.filter = this.filterModel;
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    types() {
      return [this.filterTypes[1], this.filterTypes[2], this.filterTypes[3], this.filterTypes[0], this.filterTypes[4], this.filterTypes[5]];
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  methods: {
    updateFilter() {
      this.$listeners.update(this.filter);
    },
  },
};
</script>
