<template>
  <v-dialog v-if="isOpen" v-model="isOpen" max-width="370" persistent @keydown.escape="close()" @keydown.enter="yes()">
    <v-card class="pa-5" v-if="resetingTaskbox">
       <v-app-bar flat absolute height="40" class="px-4" color="transparent">
        <v-app-bar-nav-icon class="mr-0">
          <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 38.137,10.842319 c -0.4592,-0.13324 -0.95335,0.0247 -1.2502,0.39956 l -0.02725,-0.13016 -15.096,15.48 -7.1044,-7.0832 c -0.45412,-0.45156 -1.186,-0.45694 -1.6467,-0.01209 l -3.9442,3.8019 c -0.47251,0.45664 -0.47936,1.2118 -0.015188,1.6769 l 11.887,11.884 c 0.46077,0.46136 1.2088,0.45996 1.6679,-0.0031 l 20.015,-20.151 c 0.46337,-0.46596 0.45519,-1.2212 -0.01816,-1.6769 l -4.0895,-3.9412 -0.03329,0.04843 c -0.09491,-0.11931 -0.21211,-0.21904 -0.34509,-0.29362 z" stroke="#0187f3" fill="transparent" stroke-width="3" />
          </svg>
        </v-app-bar-nav-icon>
        Reset Tasks
        <v-spacer> </v-spacer>
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn v-on="{ ...onTooltip }" small fab icon @click="close()">
              <svg width="26" height="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="grey" />
              </svg>
            </v-btn>
          </template>
          close
        </v-tooltip>
      </v-app-bar>
      <v-card-title class="text-h5 text-center my-2 " style="display: block">
        <thumbnail :options="['transparent','mx-auto']" :size="60" :task="resetingTaskbox"/>
      </v-card-title>
      <v-list-item-title>
        {{ resetingTaskbox.title }}
      </v-list-item-title>
      <v-row align="center" justify="center" style="min-height: 110px">
        <v-card-text class="text-center">
          <v-list-item-content v-if="!changing">
            <v-list-item-title> Do you want to reset this taskbox? </v-list-item-title>
            <span class="primary--text mt-1"> This action will reset the progresses and statuses off all tasks inside this taskbox. </span>
          </v-list-item-content>
          <v-progress-linear v-else rounded height="14" color="primary" :indeterminate="changing">
            <small>reseting...</small>
          </v-progress-linear>
        </v-card-text>
      </v-row>
      <v-card-actions>
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn small class="mr-3" color="secondary" @click="close()"> no </v-btn>
          <v-btn small style="color: white" color="primary" @click="yes()" @submit="yes()"> yes </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Thumbnail from '../lists/Thumbnail.vue';
export default {
  components: { Thumbnail },
  name: 'ConfirmReset',
  data() {
    return {
      isOpen: false,
      changing: false,
    };
  },
  watch: {
    resetingTaskbox(value) {
      this.isOpen = value ? true : false;
    },
  },
  computed: {
    ...mapState({
      resetingTaskbox: (state) => state.taskbox.resetingTaskbox,
    }),
  },
  methods: {
    async task() {
      return new Promise((res) => {
        this.$store.dispatch('taskbox/RESET_TASKBOX_TASK', this.resetingTaskbox.id).then(() => {
          setTimeout(res, 1000);
        });
      });
    },
    async yes() {
      this.changing = true;
      await this.task();
      this.changing = false;
      this.close();
    },
    async close() {
      this.$store.commit('taskbox/CLOSE_RESETING_TASK');
    },
  },
};
</script>
