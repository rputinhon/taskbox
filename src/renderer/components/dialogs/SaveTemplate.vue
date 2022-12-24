<template>
  <v-row justify="center" align="center" v-if="taskbox">
    <v-dialog v-model="taskbox" max-width="400" persistent>
      <v-card rounded="lg" class="pa-5 pt-10" v-if="taskbox">
        <svg height="45" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m 17.5625,9.8007813 c -0.06095,1.5059437 0.562363,2.5833647 1.076172,3.4179687 l -2.986328,-0.02734 c -3.872322,-0.03624 -7.0195315,3.149968 -7.0195315,7.00586 v 17.109375 c 0,3.855834 3.1500175,7.005859 7.0058595,7.005859 h 16.722656 c 3.855841,0 7.005859,-3.150026 7.005859,-7.005859 v -2.75 -0.01758 c -0.02414,-0.96789 -0.262931,-1.907709 -1.02539,-2.52539 -0.76246,-0.617681 -1.667045,-0.584494 -2.277344,-0.470703 C 35.454154,31.65676 34.956185,31.857418 34.548828,32 c -0.407357,0.142582 -0.742269,0.197266 -0.677734,0.197266 -1.816448,0 -3.230469,-1.414023 -3.230469,-3.230469 v -0.04297 c 0,-1.816443 1.414022,-3.230469 3.230469,-3.230469 h 0.0039 0.002 c -0.02591,1.28e-4 0.320388,0.05466 0.730469,0.181641 0.410081,0.126978 0.904404,0.302161 1.478515,0.410156 0.574112,0.107996 1.340572,0.211049 2.144532,-0.296875 0.803959,-0.507924 1.136718,-1.513001 1.136718,-2.40039 v -3.390625 c 0,-3.855838 -3.153017,-6.984874 -6.998046,-7.007813 l -3.542969,-0.02148 c 0.162408,-0.394901 0.361344,-0.837343 0.560547,-1.337891 0.233225,-0.586037 0.476562,-1.185296 0.476562,-1.9882811 0,-3.3838406 -2.77049,-6.1387551 -6.154297,-6.1542969 C 19.982731,3.6703882 17.539418,6.4922256 17.5625,9.8007813 Z M 23.708984,6.6875 c 1.773788,0 3.154297,1.3805118 3.154297,3.1542969 0,0.00549 -0.07755,0.4112231 -0.263672,0.8789061 -0.186123,0.467683 -0.445941,1.018391 -0.667968,1.591797 -0.222028,0.573406 -0.492315,1.127768 -0.361329,2.033203 0.06549,0.452718 0.346661,1.042718 0.820313,1.386719 0.473652,0.344001 0.987473,0.427 1.439453,0.429687 l 4.521484,0.02734 c 2.256921,0.01347 4.015625,1.761701 4.015625,4.007813 v 3.0625 c -0.251888,-0.06525 -0.520477,-0.14083 -0.873046,-0.25 -0.461906,-0.143026 -0.944342,-0.318952 -1.626954,-0.316407 -3.424094,0.0022 -6.226562,2.805897 -6.226562,6.230469 v 0.04297 c 0,3.425901 2.804566,6.230469 6.230469,6.230469 0.728719,0 1.214928,-0.207932 1.669922,-0.367188 0.357242,-0.125041 0.614616,-0.203502 0.841796,-0.265625 0.0065,0.0584 -0.01801,-0.04675 -0.01563,0.04883 v 2.69336 c 0,2.246104 -1.75975,4.005859 -4.005859,4.005859 H 15.638672 c -2.24611,0 -4.005859,-1.759756 -4.005859,-4.005859 V 20.197266 c 0,-2.246063 1.762869,-4.026722 3.992187,-4.00586 l 4.179687,0.03906 c 0.441138,0.0041 0.858778,-0.01668 1.353516,-0.253906 0.494738,-0.237222 1.00174,-0.891447 1.082031,-1.457032 0.160582,-1.131169 -0.297481,-1.559682 -0.585937,-2.072265 -0.576912,-1.025167 -1.122694,-2.093635 -1.101563,-2.5332035 l 0.002,-0.035156 v -0.037109 c 0,-1.7737838 1.380514,-3.1542969 3.154297,-3.1542969 z"
            fill="#0057ff"
          />
        </svg>
        <v-card-subtitle> Save as Template </v-card-subtitle>
        <v-card-text class="text-center py-2">
          <v-text-field rounded outlined autofocus class="my-3" dense ref="name" v-model="name" required label="Name" flat> </v-text-field>
          <v-textarea dense v-model="description" ref="description" height="100px" no-resize placeholder="Description" filled flat> </v-textarea>
          <v-row align="center" justify="center" class="text-center py-2">
            <v-switch v-model="exportTemplate" label="Export Template to file?" :persistent-hint="exportTemplate" :hint="folder" />
          </v-row>
        </v-card-text>
        <v-card-actions class="py-8">
          <v-row align="center" justify="center">
            <v-btn small rounded class="mr-1" @click="close()" color="grey"> cancel </v-btn>
            <v-btn small rounded :disabled="saving" color="primary" @click="save()" @submit="save()"> save </v-btn>
          </v-row>
        </v-card-actions>
        <v-progress-linear absolute bottom v-if="saving" indeterminate />
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import { ipcRenderer } from 'electron';

export default {
  name: 'SaveTemplate',
  props: { folder: String },
  data() {
    return {
      isLoading: false,
      exportTemplate: false,
      saving: false,
      name: null,
      description: null,
      descriptionLimit: 60,
    };
  },
  watch: {
    task(value) {
      if (value) this.name = value.title;
    },
  },
  computed: {
    ...mapState({
      taskbox: (state) => _.cloneDeep(state.taskbox.toTemplate),
    }),
    subjectItems() {
      return this.subjectEntries.map((entry) => {
        return entry.name;
      });
    },
    task() {
      if (!this.taskbox) return null;
      return this.$store.state.taskbox.root.tasks[this.taskbox.id];
    },
  },
  methods: {
    clear() {
      this.subject = null;
      this.name = null;
      this.description = null;
    },
    async save() {
      let request = {
        name: this.name,
        description: this.description,
        data: null,
      };

      if (this.name == '' || !this.name) return;

      this.saving = true;
      this.$store.dispatch('taskbox/CREATE_TEMPLATE', this.taskbox.id).then(async (data) => {
        request.data = data;
        await new Promise((res) => {
          this.$store
            .dispatch('templates/SAVE_TEMPLATE', request)
            .then(() => {})
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              if (this.exportTemplate) {
                ipcRenderer
                  .invoke('app:export-Template', request)
                  .then((result) => {
                    console.log('exported: ', result);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
                  .finally(() => {
                    this.name = null;
                    this.subject = null;
                    this.category = null;
                    this.description = null;
                    this.saving = false;
                    this.close();
                  });
              } else {
                this.name = null;
                this.subject = null;
                this.category = null;
                this.description = null;
                this.saving = false;
                this.close();
              }
            });
          setTimeout(res, 1000);
        });
      });
    },
    refresh() {
      this.$store.dispatch('templates/FETCH_ALL');
    },
    close() {
      this.$store.commit('taskbox/CLOSE_CREATE_TEMPLATE');
    },
  },
};
</script>
