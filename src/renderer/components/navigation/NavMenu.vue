<template>
  <v-toolbar flat class="pr-4" max-width="fit-content" color="transparent" height="30px">
    <v-tooltip v-if="options.includes('home')" bottom transition="none">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="windowbar-button mx-1" :disabled="isHome" v-on="on" v-bind="attrs" x-small icon @click="goHome()" style="z-index: 200 !important">
          <svg width="18" height="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 24,5.2578125 c -0.429504,7.67e-5 -1.123047,0.5058594 -1.123047,0.5058594 L 5.3027344,23.337891 c -0.8563843,0.968035 -0.1694256,2.49368 1.1230469,2.49414 h 3.9550777 v 15.410156 c 8.3e-5,0.828393 0.671607,1.499917 1.5,1.5 h 8.072266 c 0.828393,-8.3e-5 1.499917,-0.671607 1.5,-1.5 v -9.457031 h 5.09375 v 9.457031 c 8.3e-5,0.828393 0.671607,1.499917 1.5,1.5 h 8.072266 c 0.828393,-8.3e-5 1.499917,-0.671607 1.5,-1.5 V 25.832031 h 3.955078 c 1.292473,-4.6e-4 1.979431,-1.526105 1.123047,-2.49414 C 37.321249,17.756748 25.123047,5.7636719 25.123047,5.7636719 c 0,0 -0.693543,-0.5057827 -1.123047,-0.5058594 z m 0,3.7617188 c 0,0 10.160093,9.2083977 14.240234,13.8124997 h -2.121093 c -0.828393,8.3e-5 -1.499917,0.671607 -1.5,1.5 v 15.410156 h -5.072266 v -9.457031 c -8.3e-5,-0.828393 -0.671607,-1.499917 -1.5,-1.5 h -8.09375 c -0.828393,8.3e-5 -1.499917,0.671607 -1.5,1.5 v 9.457031 H 13.380859 V 24.332031 c -8.3e-5,-0.828393 -0.671607,-1.499917 -1.5,-1.5 H 9.759766 Z"
              :style="isHome && 'filter:grayscale(1)'"
              :fill="'#0067fb'"
            />
          </svg>
        </v-btn>
      </template>
      Home
    </v-tooltip>
    <v-tooltip class="mr-1" v-if="options.includes('parent')" bottom transition="none">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="windowbar-button " color="primary" v-on="on" v-bind="attrs" :disabled="isHome" x-small icon @click="goUp()" style="z-index: 200 !important">
          <svg width="17" height="17" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" :style="isHome && 'filter:grayscale(1)'" :fill="'#0067fb'" />
          </svg>
        </v-btn>
      </template>
      Parent taskBox
    </v-tooltip>
    <v-tooltip v-if="options.includes('back')" bottom transition="none">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ml-1 windowbar-button" color="primary" v-on="on" v-bind="attrs" :disabled="!canBack" x-small icon @click="goBack()" style="z-index: 200 !important">
          <svg style="transform: rotate(270deg)" width="17" height="17" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" :style="!canBack && 'filter:grayscale(1)'" :fill="'#0067fb'" />
          </svg>
        </v-btn>
      </template>
      Back
    </v-tooltip>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'NavMenu',
  props: { options: Array },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      backStack: (state) => state.taskbox.backStack,
    }),
    isHome() {
      return this.currentTaskBox.root == null ? true : false;
    },
    canBack() {
      return this.backStack.length > 1;
    },
  },
  methods: {
    goBack() {
      this.$store.commit('taskbox/NAV_BACK');
    },
    goUp() {
      if (!this.isHome) this.$store.commit('taskbox/NAV_UP');
    },
    goHome() {
      if (!this.isHome) this.$store.commit('taskbox/NAV_HOME');
    },
  },
};
</script>
