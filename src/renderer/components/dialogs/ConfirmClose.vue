<template>
  <v-dialog v-model="isOpen" max-width="370" persistent @keydown.escape="close()">
    <v-card class="pa-5">
      <v-card-title class="text-h5 text-center" style="display: block">
        <svg width="50" height="50" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y=".52899" width="47" height="47" ry="8.5" fill="#fafafa" />
          <path
            d="M 24,5.8925781 C 21.669477,6.5192873 19.431256,7.4955304 17.13811,8.2637827 13.599886,9.5352302 10.061662,10.806678 6.5234375,12.078125 5.3762767,12.774835 5.2269296,14.260409 4.6193636,15.388966 3.679185,17.597849 2.7390063,19.806732 1.7988277,22.015615 1.2307054,24.50009 3.9425225,24.0394 5.3131135,23.417573 c 0.480666,0.06902 0.089379,1.326253 0.216183,1.877482 0,3.074822 0,6.149644 0,9.224466 0.2167716,1.641443 2.0545414,1.655374 3.2557615,2.224815 4.902377,1.76165 9.804753,3.523301 14.70713,5.284951 1.340299,0.190342 2.547407,-0.667693 3.815762,-1.004143 4.799999,-1.740961 9.623297,-3.425071 14.408705,-5.201632 1.197697,-0.800906 0.614946,-2.385073 0.754048,-3.590802 0,-1.993587 0,-3.987173 0,-5.98076 1.071992,-0.56014 2.384344,-0.771912 3.236449,-1.659598 0.695242,-1.230119 -0.33702,-2.488794 -0.624785,-3.699319 -0.859506,-2.480301 -1.817587,-4.942367 -2.615564,-7.434048 -0.04835,-1.494187 -1.776155,-1.561978 -2.81934,-2.040536 C 34.600913,9.6057887 29.554362,7.7931288 24.507812,5.9804688 Z m 0,3.09375 C 28.177734,10.48763 32.355469,11.988932 36.533203,13.490234 32.355469,14.992187 28.177734,16.494141 24,17.996094 24,14.992839 24,11.989583 24,8.9863281 Z M 8.5292969,15.623047 c 4.6100261,1.656901 9.2200521,3.313802 13.8300781,4.970703 0.31132,1.301579 0.05922,2.685196 0.140625,4.020252 0,4.624759 0,9.249519 0,13.874279 -4.656901,-1.673828 -9.313802,-3.347656 -13.9707031,-5.021484 0,-5.947917 0,-11.895833 0,-17.84375 z M 39.470703,27.537109 c 0,1.976563 0,3.953125 0,5.929688 -4.656901,1.673828 -9.313802,3.347656 -13.970703,5.021484 0,-2.453776 0,-4.907552 0,-7.361328 0.161036,1.525095 1.909784,1.876814 3.019617,1.098773 3.650362,-1.562872 7.300724,-3.125745 10.951086,-4.688617 z"
            fill="#0057FF"
          />
          Closing TaskBox
        </svg>
      </v-card-title>
      <v-row align="center" justify="center" style="min-height: 110px">
        <v-card-text class="text-center"> Do you want to save your work before close? </v-card-text>
      </v-row>
      <v-card-actions>
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn small color="secondary" @click="cancel()"> cancel </v-btn>
          <v-btn small class="mx-3" style="color: white" color="error" @click="close()"> close </v-btn>
          <v-btn small style="color: white" color="primary" @click="yes()"> save and close </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { ipcRenderer } from 'electron';
import _ from 'lodash';

export default {
  name: 'ConfirmClose',
  props: { open: Boolean },
  data() {
    return {
      isOpen: false,
      changing: false,
    };
  },
  watch: {
    open(value) {
      this.isOpen = value;
    },
  },
  computed: {
    ...mapState({
      profile: (state) => _.cloneDeep(state.user.profile),
    }),
  },
  methods: {
    async task() {
      return new Promise((res) => {
        this.$store.dispatch('taskbox/RESET_TASKBOX_TASK', this.taskbox.task).then(() => {});
        setTimeout(res, 1000);
      });
    },
    cancel() {
      this.$listeners.close();
    },
    async close() {
      await new Promise((resolve) => {
        resolve(ipcRenderer.send('app:quit'));
      });
      ipcRenderer.send('app:forcequit');
    },
    async yes() {
      await new Promise((resolve) => {
        this.$store
          .dispatch('taskbox/SAVE', { saveTaskBox: true })
          .then(() => {
            if (this.$store.getters['user/authenticated']) {
              this.$store
                .dispatch('user/UPDATE_PROFILE', this.profile)
                .then(() => {
                  ipcRenderer.send('app:quit');
                })
                .catch((error) => {
                  console.log(error);
                })
                .finally(async () => {
                  resolve(ipcRenderer.send('app:forcequit'));
                });
            } else {
              resolve(ipcRenderer.send('app:quit'));
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
      ipcRenderer.send('app:forcequit');
    },
  },
};
</script>
