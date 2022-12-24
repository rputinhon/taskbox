<template>
  <v-dialog v-if="isOpen" v-model="isOpen" max-width="370" persistent @keydown.escape="close()" @keydown.enter="yes()">
    <v-card class="pa-5" v-if="changingStatus">
      <v-app-bar flat absolute height="40" class="px-4" color="transparent">
        <v-app-bar-nav-icon class="mr-0">
          <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 38.137,10.842319 c -0.4592,-0.13324 -0.95335,0.0247 -1.2502,0.39956 l -0.02725,-0.13016 -15.096,15.48 -7.1044,-7.0832 c -0.45412,-0.45156 -1.186,-0.45694 -1.6467,-0.01209 l -3.9442,3.8019 c -0.47251,0.45664 -0.47936,1.2118 -0.015188,1.6769 l 11.887,11.884 c 0.46077,0.46136 1.2088,0.45996 1.6679,-0.0031 l 20.015,-20.151 c 0.46337,-0.46596 0.45519,-1.2212 -0.01816,-1.6769 l -4.0895,-3.9412 -0.03329,0.04843 c -0.09491,-0.11931 -0.21211,-0.21904 -0.34509,-0.29362 z" stroke="#0187f3" fill="transparent" stroke-width="3" />
          </svg>
        </v-app-bar-nav-icon>
        Change Status
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
      <v-card-title class="text-h5 text-center mt-5" style="display: block">
        <svg version="1.1" width="100" viewBox="0 0 50 45" xmlns="http://www.w3.org/2000/svg" style="overflow: visible">
          <path d="M 18.255593,4.2834353 5.4858191,13.228038 5.4052874,38.14297 29.474115,43.140312 41.712501,35.18536 V 9.5867362 Z" fill="white" />
          <path
            v-if="completed"
            d="m 21.267244,3.3953828 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.7025703,11.051801 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 l 16.1962096,4.194657 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 43.989601,9.6630499 42.85062,8.5202168 40.650024,7.9502873 L 24.453814,3.7556304 C 23.481477,3.5038063 22.396782,3.3885362 21.267278,3.3954195 Z m 0.185733,1.9699794 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 L 30.231199,7.2824816 15.800406,17.961068 9.0661396,16.130973 C 7.5686211,15.743133 6.7031862,15.014608 6.5056849,14.145917 6.6526004,13.462056 7.1633632,12.734524 8.0572387,12.040013 L 13.993817,7.6989324 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.789461,2.1790905 7.381327,2.085813 c 1.49195,0.3863973 2.35794,1.1105083 2.559676,1.9749193 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.968483,-1.770438 z m 10.121395,8.0329293 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 8.9085936,37.553775 C 7.4339913,37.170888 6.5712127,36.459768 6.3567137,35.608484 6.3457757,35.294275 6.3348777,34.980065 6.3239797,34.665856 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759406,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 25.827441 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z"
            :fill="newStatus.color"
          />
          <path
            v-else
            d="m 21.26718,3.3952713 c -3.38851,0.02065 -7.18069,1.142794 -9.56014,2.991548 L 5.70276,11.051651 C 4.34895,12.103513 3.67972,13.215434 3.6574,14.223034 l -0.0279,-0.03359 0.0181,22.530923 h 0.015 c 0.0511,1.292273 1.18305,2.397361 3.33365,2.954343 l 16.19642,4.194573 c 3.88935,1.0073 9.57494,-0.16636 12.74755,-2.631361 l 6.00325,-4.664833 c 1.33649,-1.038415 1.95586,-2.131404 2.00143,-3.124356 l 0.016,-5.29e-4 0.0346,-22.460126 -0.005,0.0062 C 43.99,9.6631663 42.85077,8.5204683 40.65017,7.9505383 L 24.45427,3.7554563 C 23.48193,3.5036323 22.3974,3.3883883 21.2679,3.3952713 Z m 0.18603,1.969905 c 0.88115,-0.0053 1.7271,0.08467 2.48564,0.28112 4.93042,1.198119 9.80347,2.604567 14.68489,3.984253 1.49195,0.3863977 2.35832,1.1101457 2.56005,1.9745567 -0.14391,0.686899 -0.62494,1.454892 -1.55081,2.116149 l -5.90816,4.219381 c -2.61267,1.731361 -6.91046,2.838914 -9.94462,2.053104 -0.77738,-0.207764 -1.55537,-0.412961 -2.33319,-0.619083 0.004,-0.04734 0.006,-0.09478 0.006,-0.143144 V 8.6833203 c 0,-0.958846 -0.77179,-1.730644 -1.73064,-1.730644 h -0.15296 c -0.95885,0 -1.73116,0.771798 -1.73116,1.730644 V 18.422261 C 14.91511,17.65511 11.99041,16.893953 9.06617,16.130928 7.56866,15.743088 6.70311,15.014727 6.50561,14.146036 6.65252,13.462175 7.16357,12.734732 8.05745,12.040221 l 5.93659,-4.3413367 c 1.85626,-1.442247 4.81553,-2.317598 7.45897,-2.333708 z m 19.91093,10.2122967 0.062,17.224788 c -0.12066,0.834938 -0.4746,1.555422 -1.56941,2.406055 l -5.89422,4.282424 c -2.47501,1.923 -7.0368,2.785817 -10.06863,1.991093 L 8.90875,37.553908 C 7.43415,37.171021 6.57147,36.459573 6.35697,35.608292 6.34607,35.294078 6.33477,34.979922 6.32387,34.665713 l 0.0625,-16.72611 c 0.002,-0.399866 0.77323,0.308058 1.2299,0.42633 l 15.57631,3.946528 c 3.88935,1.007296 9.57494,-0.166359 12.74755,-2.631363 z M 29.2083,23.975926 c -1.02595,0 -1.85157,0.825618 -1.85157,1.851566 v 12.759944 c 0,1.025951 0.82562,1.852601 1.85157,1.852601 1.02595,0 1.85208,-0.82665 1.85208,-1.852601 V 25.827492 c 0,-1.025948 -0.82613,-1.851566 -1.85208,-1.851566 z"
            :fill="newStatus.color"
          />
          <path transform="scale(.26458) translate(40 90)" :d="newStatus.icon" :fill="newStatus.color" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
        </svg>
      </v-card-title>

      <v-card-text v-if="task">
        Do you want to set <b>"{{ task.title }}"</b> status to "<b :style="`color:${newStatus.color}`">{{ newStatus.text }}</b
        >"
      </v-card-text>
      <v-progress-linear class="my-3" :color="changing ? newStatus.color : 'grey'" stream :indeterminate="changing" />
      <v-card-actions>
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn small class="mr-3" color="grey" @click="close()"> no </v-btn>
          <v-btn small style="color: white" :color="newStatus.color" @click="yes()" @submit="yes()"> yes </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import taskstate from '../../enums/taskstate';
export default {
  name: 'ConfirmStatus',
  data() {
    return {
      isOpen: false,
      changing: false,
    };
  },
  watch: {
    changingStatus(value) {
      this.isOpen = value ? true : false;
    },
  },
  computed: {
    ...mapState({
      changingStatus: (state) => state.taskbox.changingStatus,
      newStatus: (state) => state.taskbox.newStatus,
    }),
    task() {
      return this.changingStatus;
    },
    completed() {
      return this.newStatus.value == taskstate.DONE.value;
    },
    comfirming() {
      return this.changingStatus ? true : false;
    },
  },
  methods: {
    async action() {
      return new Promise((res) => {
        switch (this.newStatus.text) {
          case 'Unstarted':
            this.$store.commit('taskbox/RESET_TASK');
            this.$store.dispatch('taskbox/RESET_TASKBOX_TASK', this.changingStatus.id).then(() => {
              this.$store.commit('taskbox/CLOSE_RESETING_TASK');
              setTimeout(res, 1000);
            });
            break;
          case 'Working':
            this.$store.dispatch('taskbox/SET_TASKBOX_WORKING', this.changingStatus.id).then(() => {
              setTimeout(res, 1000);
            });
            break;
          case 'Paused':
            this.$store.dispatch('taskbox/SET_TASKBOX_PAUSED', this.changingStatus.id).then(() => {
              setTimeout(res, 1000);
            });
            break;
          case 'Done':
            this.$store.dispatch('taskbox/SET_TASKBOX_DONE', this.changingStatus.id).then(() => {
              setTimeout(res, 1000);
            });
            break;
          case 'Canceled':
            this.$store.commit('task/CANCEL_TASK', this.changingStatus);
            break;
        }
        setTimeout(res, 1000);
      });
    },
    async yes() {
      this.changing = true;
      await this.action();
      this.changing = false;
      this.close();
    },
    async close() {
      this.$store.commit('taskbox/CLOSE_CONFIRM_STATUS');
    },
  },
};
</script>
