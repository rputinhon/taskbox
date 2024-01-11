<template>
    <v-toolbar floating absolute bottom class="mb-2" :style="`z-index:5;opacity:${analysing !== false && !hovering ? 0.1 : 1}`" style="right: 50px;transition: 0.35s cubic-bezier(0.25, 0.8, 0.5, 1) !important;" color="transparent" flat @mouseenter="hovering = true" @mouseleave="hovering = false">
      <tools-bar  />
      <v-menu rounded="0" nudge-top="30" top left :close-on-content-click="false">
        <template v-slot:activator="{ on: menu }">
          <v-tooltip top transition="none">
            <template v-slot:activator="{ on: onTooltip }">
              <v-btn v-on="{ ...onTooltip, ...menu }" icon x-small class="mx-2" color="primary" fab>
                <svg width="40" height="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    transform="translate(7 7)"
                    d="m 16.603318,10.487538 c -7.9688576,0 -12.5759362,6.291988 -12.5759362,6.291988 -0.3629984,0.492951 -0.2574995,1.186859 0.2356032,1.549652 0.4931123,0.362867 1.1870497,0.257087 1.5496527,-0.236219 0,0 2.2075366,-2.979893 6.1355373,-4.507971 -0.816027,1.03138 -1.304777,2.331789 -1.304777,3.741183 0,3.328517 2.724778,6.053293 6.053295,6.053293 3.328516,0 6.053296,-2.724776 6.053296,-6.053293 0,-1.398384 -0.481042,-2.689578 -1.285608,-3.717065 4.083388,1.52575 6.644462,4.444277 6.644462,4.444277 0.400809,0.463037 1.101219,0.51316 1.563877,0.111915 0.462633,-0.400754 0.512743,-1.100689 0.111915,-1.563258 0,0 -5.223496,-6.114513 -13.181326,-6.114513 z m 0.09337,3.192682 c 2.028098,0 3.645952,1.617855 3.645952,3.645951 0,2.028098 -1.617854,3.645953 -3.645952,3.645953 -2.028096,0 -3.645951,-1.617855 -3.645951,-3.645953 0,-2.028096 1.617855,-3.645951 3.645951,-3.645951 z"
                    :fill="'#bdbdbd'"
                    stop-color="#000000"
                    style="paint-order: fill markers stroke"
                  />
                </svg>
              </v-btn>
            </template>
            display
          </v-tooltip>
        </template>
        <v-card class="mx-auto" max-width="400">
          <v-list v-for="(setting, s) in displaySettings" :key="s" class="my-0 py-0">
            <v-list-item class="my-0 py-0">
              <v-switch dense persistent-hint :label="setting.label" v-model="setting.value" @change="updateSettings()" />
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-tooltip top transition="none">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon x-small color="primary" fab v-bind="attrs" v-on="on" @click.stop="$emit('frameAll')">
            <svg width="22" height="22" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 16.068359,9.6289061 c -3.535123,0 -6.4394529,2.9043299 -6.4394529,6.4394529 v 4.210938 h 3.7421879 v -4.210938 c 0,-1.52732 1.169945,-2.697265 2.697265,-2.697265 h 4.210938 V 9.6289061 Z m 11.652344,0 v 3.7421879 h 4.210938 c 1.52732,0 2.697265,1.169945 2.697265,2.697265 v 4.210938 h 3.742188 v -4.210938 c 0,-3.535123 -2.90433,-6.4394529 -6.439453,-6.4394529 z M 9.6289061,27.720703 v 4.210938 c 0,3.535123 2.9043299,6.439453 6.4394529,6.439453 h 4.210938 v -3.742188 h -4.210938 c -1.52732,0 -2.697265,-1.169945 -2.697265,-2.697265 v -4.210938 z m 24.9999999,0 v 4.210938 c 0,1.52732 -1.169945,2.697265 -2.697265,2.697265 h -4.210938 v 3.742188 h 4.210938 c 3.535123,0 6.439453,-2.90433 6.439453,-6.439453 v -4.210938 z" :fill="'#bdbdbd'" stop-color="#000000" style="paint-order: fill markers stroke" />
            </svg>
          </v-btn>
        </template>
        <span>Zoom All</span>
      </v-tooltip>
    </v-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import ToolsBar from '../navigation/ToolsBar.vue';

export default {
  components: { ToolsBar },
  data() {
    return {
      hovering: false,
    };
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      displaySettings: (state) => _.cloneDeep(state.app.displaySettings),
    }),
  },
  methods: {
    updateSettings() {
      this.$store.commit('app/SET_DISPLAY_SETTINGS', this.displaySettings);
    },
  },
};
</script>
