<template>
  <v-sheet width="100%" color="transparent">
    <v-card-title class="text-subtitle-1 py-0">
      <v-list-item class="ma-0 pa-0" style="min-height: 40px; width: 100%">
        <v-list-item-icon class="pa-0 mr-1">
          <svg class="mx-1" style="pointer-events: none" width="23" height="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="m 23.492535,8.6849562 v 6.221e-4 c -0.434225,-9.636e-4 -0.867743,0.040492 -1.20333,0.3893831 -0.442093,0.6475357 -0.831412,1.5150866 -1.174824,2.5037026 a 12.694069,12.757367 0 0 0 -2.941001,1.096583 c -0.917521,-0.547754 -1.791904,-0.970606 -2.560715,-1.183922 -0.481489,-0.05013 -0.839384,0.197715 -1.170577,0.478542 -0.110373,0.09364 -0.217662,0.191584 -0.325701,0.282637 -0.501925,0.42304 -1.047005,0.815306 -1.0517,1.568454 0.01245,0.755445 0.258167,1.691831 0.650187,2.715983 a 12.694069,12.757367 0 0 0 -2.072469,4.554928 c -1.01525,0.348737 -1.9065257,0.74566 -2.567993,1.197265 -0.4651878,0.447449 -0.3834854,1.069406 -0.3839256,1.634564 -5.281e-4,0.656422 -0.052663,1.325859 0.5197851,1.815306 0.5769376,0.470976 1.4347955,0.881629 2.4509345,1.239113 a 12.694069,12.757367 0 0 0 2.1404,4.602857 c -0.385517,0.995506 -0.655695,1.927156 -0.736919,2.72023 0.04183,0.644097 0.569789,0.983389 1.00136,1.348288 0.501262,0.423824 0.979244,0.895012 1.722509,0.773309 0.720056,-0.134804 1.571053,-0.514373 2.482474,-1.046243 a 12.694069,12.757367 0 0 0 2.842745,1.044423 c 0.343473,0.988891 0.733228,1.85722 1.17543,2.504917 0.447449,0.465186 1.069407,0.383484 1.634564,0.383925 0.656423,6.21e-4 1.325858,0.05266 1.815305,-0.519785 0.46114,-0.564889 0.864459,-1.3995 1.216673,-2.38786 a 12.694069,12.757367 0 0 0 2.738424,-1.006816 c 0.899354,0.522111 1.738688,0.894212 2.450331,1.027439 0.743263,0.121703 1.221244,-0.349485 1.722506,-0.773309 0.431572,-0.364899 0.959531,-0.704191 1.00136,-1.348288 -0.07958,-0.777043 -0.340258,-1.68741 -0.713262,-2.660185 a 12.694069,12.757367 0 0 0 2.184066,-4.662902 c 1.015633,-0.357395 1.872991,-0.768305 2.449723,-1.239113 0.572446,-0.489447 0.520906,-1.158884 0.52039,-1.815306 -1.08e-4,-0.141291 0.005,-0.286493 0.0055,-0.431235 9.32e-4,-0.434224 -0.04049,-0.867743 -0.389386,-1.203329 -0.661009,-0.451257 -1.551312,-0.847508 -2.565615,-1.196051 a 12.694069,12.757367 0 0 0 -2.11553,-4.6253 c 0.376627,-0.997043 0.611936,-1.908483 0.624104,-2.64684 -0.0047,-0.753147 -0.549169,-1.145415 -1.051093,-1.568453 -0.108038,-0.09105 -0.215932,-0.189001 -0.326309,-0.282637 -0.33119,-0.280827 -0.689087,-0.528669 -1.170577,-0.478542 -0.758076,0.210337 -1.618418,0.62491 -2.521897,1.161481 a 12.694069,12.757367 0 0 0 -2.84455,-1.059586 C 26.602175,10.607245 26.199379,9.7752705 25.73908,9.2114137 25.249633,8.6389678 24.580198,8.6905077 23.923775,8.6910218 c -0.14129,1.103e-4 -0.286492,-0.00575 -0.431234,-0.0061 z m 0.507655,9.5520378 a 5.7631307,5.7631307 0 0 1 5.763125,5.763124 5.7631307,5.7631307 0 0 1 -5.763125,5.763126 5.7631307,5.7631307 0 0 1 -5.763126,-5.763126 5.7631307,5.7631307 0 0 1 5.763126,-5.763124 z"
              fill="#0187f3"
            />
          </svg>
        </v-list-item-icon>
        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> Settings </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-list v-for="(setting, s) in appSettings" :key="s" class="mx-0 px-0">
        <v-list-item>
          <v-switch inset persistent-hint :hint="setting.description" :label="setting.label" v-model="setting.value" @change="updateSettings()" />
        </v-list-item>
      </v-list>
      <v-list-item>
        <v-switch inset persistent-hint :hint="serverSettings[1].description" :label="serverSettings[1].label + ' (Beta)'" v-model="serverSettings[1].value" @change="updateServerSettings()" />
      </v-list-item>
    </v-card-text>
    <div v-if="serverSettings[1].value">
      <v-card-title class="text-subtitle-1">
        <svg class="mx-1" style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path
            d="m 23.86521,3.1191893 c -11.305829,0 -20.5429321,9.2350367 -20.5429321,20.5408647 0,11.305829 9.2371031,20.542933 20.5429321,20.542933 11.305828,0 20.540863,-9.237104 20.540863,-20.542933 0,-11.305828 -9.235035,-20.5408647 -20.540863,-20.5408647 z m -5.29e-4,3.2943725 a 17.247273,17.247273 0 0 1 0.612365,0.016536 c 0.943543,1.0446959 3.756207,4.4428342 5.447728,9.8159392 H 17.700211 c 1.660282,-5.273868 4.411628,-8.6570986 5.408972,-9.7730476 a 17.247273,17.247273 0 0 1 0.75551,-0.059428 z M 28.78841,7.1370319 A 17.247273,17.247273 0 0 1 39.432206,16.246037 H 33.045527 C 31.948866,12.368733 30.232672,9.269382 28.788423,7.1370319 Z m -9.989041,0.057361 C 17.36285,9.3249164 15.666836,12.401602 14.579472,16.246037 H 8.3250732 A 17.247273,17.247273 0 0 1 18.799369,7.1943929 Z M 7.2419352,19.245853 h 6.6543738 c -0.296225,1.706227 -0.458243,3.529329 -0.425814,5.459099 0.03013,1.792907 0.214283,3.460375 0.507463,5.002279 H 7.7586995 A 17.247273,17.247273 0 0 1 6.6176839,23.661088 17.247273,17.247273 0 0 1 7.2419352,19.245853 Z m 9.6996658,0 h 13.741797 c 0.322244,1.675362 0.503158,3.483399 0.470773,5.410523 -0.03094,1.841303 -0.231923,3.523143 -0.546737,5.050855 H 17.017566 c -0.314814,-1.527712 -0.515794,-3.209552 -0.546737,-5.050855 -0.03238,-1.927124 0.148529,-3.735161 0.470772,-5.410523 z m 16.78709,0 h 6.804753 a 17.247273,17.247273 0 0 1 0.578776,4.415235 17.247273,17.247273 0 0 1 -1.141016,6.046143 h -6.324163 c 0.293179,-1.541904 0.477332,-3.209372 0.507463,-5.002279 0.03243,-1.92977 -0.129588,-3.752872 -0.425813,-5.459099 z M 9.2428466,32.707048 h 5.4808024 c 0.936435,3.031088 2.2598,5.434137 3.49591,7.225913 A 17.247273,17.247273 0 0 1 9.2428466,32.707048 Z m 8.5912064,0 h 11.956892 c -1.48844,4.349506 -3.795569,7.003462 -4.932514,8.123018 a 17.247273,17.247273 0 0 1 -0.993738,0.07803 17.247273,17.247273 0 0 1 -1.106393,-0.08733 c -1.139717,-1.124048 -3.439193,-3.774107 -4.924247,-8.113715 z m 15.067297,0 h 5.585706 a 17.247273,17.247273 0 0 1 -9.12399,7.28741 c 1.248061,-1.797854 2.591197,-4.221845 3.538284,-7.28741 z"
            fill="#0057ff"
          />
        </svg>
        Server Settings (Beta)
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content> Configure a remote server to work with Taskbox. It will syncs your offline data in a remote database. For instance Taskbox only have support to CouchDB as server. </v-list-item-content>
        </v-list-item>

        <div class="py-6">
          <!-- <v-list-item>
          <v-row>
            <v-col cols="6" class="pr-1">
              <v-text-field :disabled="!serverSettings[1].value" label="admin username" hide-details="true" outlined dense v-model="username" />
            </v-col>
            <v-col cols="6" class="pl-1">
              <v-text-field :disabled="!serverSettings[1].value" label="admin password" type="password" outlined dense hide-details="true" v-model="password" />
            </v-col>
          </v-row>
        </v-list-item> -->
          <v-list-item>
            <v-text-field :disabled="!serverSettings[1].value" rounded success hide-details="false" :loading="synking || retrying" label="url" type="url" placeholder="ex: http://localhost:5984" outlined dense v-model="url" :error="syncErrors.lenght > 0 || !serverReady ? true : false" :error-messages="syncErrors">
              <template v-slot:append>
                <v-btn :disabled="serverSettings[1].value" outlined rounded small color="primary" style="margin-top: -2px; margin-right: -16px" @click="retry()" v-text="!serverSettings[1].value?'retry':'ok'"></v-btn>
              </template>
            </v-text-field>
          </v-list-item>
          <v-list-item-content v-if="serverSettings[1].value">
            <!-- <small v-if="!loginError" class="primary--text"> {{ syncOK ? 'LAST SYNC: ' + syncLastDate : ' ' }}</small> -->
            <small v-if="loginError" class="error--text"> {{ loginError }}</small>
          </v-list-item-content>
          <!-- <a class="pt-3"> More info...</a> -->
          <!-- <v-list-item>
          <v-btn :disabled="!serverSettings[1].value" block outlined style="margin-top: -5px" color="secondary" @click="sync()"> sync </v-btn>
        </v-list-item> -->
        </div>
      </v-card-text>
    </div>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import store from '../../store';

export default {
  data() {
    return {
      synking: false,
      retrying: false,
      loginError: null,
      defaultHost: 'http://localhost:5984',
      url: '',
    };
  },
  mounted() {
    this.url = window.localStorage.getItem('host') || this.defaultHost;
  },
  watch: {
    appSettings(settings) {
      this.$store.commit(
        'user/UPDATE_SETTINGS',
        settings.map((s) => s.value)
      );
    },
    serverReady(value) {
      if (!value && this.remote) this.retry();
    },
  },
  computed: {
    ...mapState({
      appSettings: (state) => _.cloneDeep(state.app.appSettings),
      serverSettings: (state) => _.cloneDeep(state.app.serverSettings),
      userProfile: (state) => _.cloneDeep(state.user.user.metadata.profile),
      server: (state) => state.app.server,
      serverReady: (state) => state.user.serverReady,
    }),
    authenticated() {
      return store.getters['user/authenticated'];
    },
    remote() {
      return this.serverSettings[1].value;
    },
    syncOK() {
      if (!this.server.syncInfo) return false;
      return this.server.syncInfo.status == 'complete' || this.server.syncInfo.ok ? true : false;
    },
    syncLastDate() {
      if (!this.server.syncInfo) return '';
      return moment(this.server.syncInfo.end_time || this.server.syncInfo.start_time).format('DD/MM/YY HH:mm:ss');
    },
    syncErrors() {
      if (!this.server.syncInfo) return [];
      return this.server.syncInfo.errors;
    },
  },
  methods: {
    saveHost() {
      window.localStorage.setItem('host', this.url);
      this.$store.commit('app/INIT_SERVER', this.url);
    },
    updateSettings() {
      this.$store.commit('app/SET_APP_SETTINGS', this.appSettings);
    },
    updateServerSettings() {
      this.$store.commit('app/SET_SERVER_SETTINGS', this.serverSettings);
    },
    retry() {
      this.retrying = true;
      setTimeout(() => {
        this.saveHost();
        this.retrying = false;
      }, 2000);
    },
  },
};
</script>
