<template>
  <div>
    <v-tooltip bottom transition="none">
      <template v-slot:activator="{ on: onTooltip }">
        <v-menu rounded="0" left offset-x light>
          <template v-slot:activator="{ on: onMenu }">
            <v-btn v-on="{ ...onMenu, ...onTooltip }" class="ma-3" fab right absolute color="primary" small>
              <svg width="23" version="1.1" viewBox="0 0 48 43" xmlns="http://www.w3.org/2000/svg">
                <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="white" />
              </svg>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="400">
            <v-list-item-group>
               <v-tooltip left transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-list-item v-on="{ ...onTooltip }" @click.stop="copyToClipboard()">
                    <v-list-item-icon class="mx-2">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m 12.763821,3.5119309 c -4.0190612,0 -7.3261682,3.3071064 -7.3261682,7.3261671 v 21.855515 c 0,4.019061 3.307107,7.326167 7.3261682,7.326167 H 25.51188 c 4.019063,0 7.326169,-3.307106 7.326169,-7.326167 V 10.838098 c 0,-4.0190607 -3.307106,-7.3261671 -7.326169,-7.3261671 z m 0,4.566646 H 25.51188 c 1.569016,0 2.762105,1.1905057 2.762105,2.7595211 v 21.855515 c 0,1.569014 -1.193089,2.760038 -2.762105,2.760038 H 12.763821 c -1.569015,0 -2.761588,-1.191024 -2.761588,-2.760038 V 10.838098 c 0,-1.5690154 1.192573,-2.7595208 2.761588,-2.7595211 z m 22.695254,4.8203771 v 4.56458 h 4.693772 c 1.569016,0 2.759522,1.192572 2.759522,2.761589 v 21.855512 c 0,1.569017 -1.190506,2.759523 -2.759522,2.759523 H 27.402721 c -1.376359,0 -2.46156,-0.916255 -2.707329,-2.200384 h -4.593001 c 0.289657,3.761692 3.469488,6.764962 7.30033,6.764962 h 12.750126 c 4.01906,0 7.326167,-3.305037 7.326167,-7.324101 V 20.225123 c 0,-4.019063 -3.307107,-7.326168 -7.326167,-7.326169 z"
                          fill="#0057FF"
                        />
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-title>Copy</v-list-item-title>
                  </v-list-item>
                </template>
                Copy file path to clipboard
              </v-tooltip>

              
              <v-tooltip left transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-list-item v-on="{ ...onTooltip }" @click.stop="selectFile()">
                    <v-list-item-icon class="mx-2">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m 22.053434,6.3297467 c -0.924519,0.00585 -1.817796,0.07614 -2.657719,0.1901693 -4.47959,0.6081562 -7.935433,2.3848674 -7.935433,2.3848674 l 2.267562,4.4570926 c 0,0 2.806769,-1.406795 6.341732,-1.886707 3.534962,-0.479912 7.305521,-0.114168 10.138915,3.277319 4.502359,5.389187 8.448892,12.249856 10.560079,16.181441 l -3.200839,1.540992 10.165789,6.926191 c 0.30743,-4.088733 0.617162,-8.177292 0.926042,-12.265917 l -3.370337,1.62264 C 43.129492,24.699848 38.993938,17.471924 34.044434,11.547516 30.914905,7.8015651 26.759526,6.5041815 22.987744,6.3462832 22.673428,6.3331252 22.361607,6.3277972 22.053434,6.3297467 Z M 5.1831463,13.516388 c -0.307421,4.088562 -0.61716,8.176949 -0.926042,12.265401 l 3.370854,-1.623674 c 2.158975,4.057758 6.2942777,11.286357 11.2442747,17.211354 4.172706,4.9946 10.169128,5.635754 14.648717,5.027599 4.479592,-0.608155 7.935434,-2.384867 7.935434,-2.384867 l -2.265495,-4.457094 c 0,0 -2.808835,1.406795 -6.343798,1.886707 -3.534966,0.479912 -7.303456,0.112101 -10.13685,-3.279386 C 18.207396,32.772659 14.259692,25.9123 12.148095,21.981504 l 3.200838,-1.541508 z"
                          fill="#0057FF"
                        />
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-title>Switch</v-list-item-title>
                  </v-list-item>
                </template>
                Choose another file
              </v-tooltip>

              <v-tooltip left transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-list-item v-on="{ ...onTooltip }" @click.stop="workOnTask()">
                    <v-list-item-icon class="mx-2">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 36.461042,8.3755467 -6.595687,6.5956863 8.244609,8.244608 6.595684,-6.595687 z M 26.567511,18.269076 11.727217,33.109368 8.2110185,44.54112 19.971825,41.353977 34.812121,26.513684 Z" fill="#0057FF" />
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-title>Modify</v-list-item-title>
                  </v-list-item>
                </template>
                Edit in the default external application
              </v-tooltip>

              <v-tooltip left transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-list-item v-on="onTooltip" @click.stop="savingTemplate = true">
                    <v-list-item-icon class="mx-2">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="m 17.5625,9.8007813 c -0.06095,1.5059437 0.562363,2.5833647 1.076172,3.4179687 l -2.986328,-0.02734 c -3.872322,-0.03624 -7.0195315,3.149968 -7.0195315,7.00586 v 17.109375 c 0,3.855834 3.1500175,7.005859 7.0058595,7.005859 h 16.722656 c 3.855841,0 7.005859,-3.150026 7.005859,-7.005859 v -2.75 -0.01758 c -0.02414,-0.96789 -0.262931,-1.907709 -1.02539,-2.52539 -0.76246,-0.617681 -1.667045,-0.584494 -2.277344,-0.470703 C 35.454154,31.65676 34.956185,31.857418 34.548828,32 c -0.407357,0.142582 -0.742269,0.197266 -0.677734,0.197266 -1.816448,0 -3.230469,-1.414023 -3.230469,-3.230469 v -0.04297 c 0,-1.816443 1.414022,-3.230469 3.230469,-3.230469 h 0.0039 0.002 c -0.02591,1.28e-4 0.320388,0.05466 0.730469,0.181641 0.410081,0.126978 0.904404,0.302161 1.478515,0.410156 0.574112,0.107996 1.340572,0.211049 2.144532,-0.296875 0.803959,-0.507924 1.136718,-1.513001 1.136718,-2.40039 v -3.390625 c 0,-3.855838 -3.153017,-6.984874 -6.998046,-7.007813 l -3.542969,-0.02148 c 0.162408,-0.394901 0.361344,-0.837343 0.560547,-1.337891 0.233225,-0.586037 0.476562,-1.185296 0.476562,-1.9882811 0,-3.3838406 -2.77049,-6.1387551 -6.154297,-6.1542969 C 19.982731,3.6703882 17.539418,6.4922256 17.5625,9.8007813 Z M 23.708984,6.6875 c 1.773788,0 3.154297,1.3805118 3.154297,3.1542969 0,0.00549 -0.07755,0.4112231 -0.263672,0.8789061 -0.186123,0.467683 -0.445941,1.018391 -0.667968,1.591797 -0.222028,0.573406 -0.492315,1.127768 -0.361329,2.033203 0.06549,0.452718 0.346661,1.042718 0.820313,1.386719 0.473652,0.344001 0.987473,0.427 1.439453,0.429687 l 4.521484,0.02734 c 2.256921,0.01347 4.015625,1.761701 4.015625,4.007813 v 3.0625 c -0.251888,-0.06525 -0.520477,-0.14083 -0.873046,-0.25 -0.461906,-0.143026 -0.944342,-0.318952 -1.626954,-0.316407 -3.424094,0.0022 -6.226562,2.805897 -6.226562,6.230469 v 0.04297 c 0,3.425901 2.804566,6.230469 6.230469,6.230469 0.728719,0 1.214928,-0.207932 1.669922,-0.367188 0.357242,-0.125041 0.614616,-0.203502 0.841796,-0.265625 0.0065,0.0584 -0.01801,-0.04675 -0.01563,0.04883 v 2.69336 c 0,2.246104 -1.75975,4.005859 -4.005859,4.005859 H 15.638672 c -2.24611,0 -4.005859,-1.759756 -4.005859,-4.005859 V 20.197266 c 0,-2.246063 1.762869,-4.026722 3.992187,-4.00586 l 4.179687,0.03906 c 0.441138,0.0041 0.858778,-0.01668 1.353516,-0.253906 0.494738,-0.237222 1.00174,-0.891447 1.082031,-1.457032 0.160582,-1.131169 -0.297481,-1.559682 -0.585937,-2.072265 -0.576912,-1.025167 -1.122694,-2.093635 -1.101563,-2.5332035 l 0.002,-0.035156 v -0.037109 c 0,-1.7737838 1.380514,-3.1542969 3.154297,-3.1542969 z"
                          fill="#0057FF"
                        />
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-title>Template</v-list-item-title>
                  </v-list-item>
                </template>
                Save this file as template
              </v-tooltip>
              <v-divider></v-divider>
              <v-tooltip left transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-list-item color="error" v-on="onTooltip" @click.stop="deleteTask()">
                    <v-list-item-icon class="mx-2">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#0057FF" />
                      </svg>
                    </v-list-item-icon>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </template>
                Set task without file
              </v-tooltip>
            </v-list-item-group>
          </v-card>
        </v-menu>
      </template>
      Menu
    </v-tooltip>

    <v-dialog v-model="savingTemplate" max-width="370" persistent @keydown.escape="close()">
      <v-card class="pa-5">
        <v-card-title class="text-h5 text-center" style="display: block">
          <svg width="50" height="50" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y=".52899" width="47" height="47" ry="8.5" fill="#fafafa" />
            <path
              d="m 17.5625,9.8007813 c -0.06095,1.5059437 0.562363,2.5833647 1.076172,3.4179687 l -2.986328,-0.02734 c -3.872322,-0.03624 -7.0195315,3.149968 -7.0195315,7.00586 v 17.109375 c 0,3.855834 3.1500175,7.005859 7.0058595,7.005859 h 16.722656 c 3.855841,0 7.005859,-3.150026 7.005859,-7.005859 v -2.75 -0.01758 c -0.02414,-0.96789 -0.262931,-1.907709 -1.02539,-2.52539 -0.76246,-0.617681 -1.667045,-0.584494 -2.277344,-0.470703 C 35.454154,31.65676 34.956185,31.857418 34.548828,32 c -0.407357,0.142582 -0.742269,0.197266 -0.677734,0.197266 -1.816448,0 -3.230469,-1.414023 -3.230469,-3.230469 v -0.04297 c 0,-1.816443 1.414022,-3.230469 3.230469,-3.230469 h 0.0039 0.002 c -0.02591,1.28e-4 0.320388,0.05466 0.730469,0.181641 0.410081,0.126978 0.904404,0.302161 1.478515,0.410156 0.574112,0.107996 1.340572,0.211049 2.144532,-0.296875 0.803959,-0.507924 1.136718,-1.513001 1.136718,-2.40039 v -3.390625 c 0,-3.855838 -3.153017,-6.984874 -6.998046,-7.007813 l -3.542969,-0.02148 c 0.162408,-0.394901 0.361344,-0.837343 0.560547,-1.337891 0.233225,-0.586037 0.476562,-1.185296 0.476562,-1.9882811 0,-3.3838406 -2.77049,-6.1387551 -6.154297,-6.1542969 C 19.982731,3.6703882 17.539418,6.4922256 17.5625,9.8007813 Z M 23.708984,6.6875 c 1.773788,0 3.154297,1.3805118 3.154297,3.1542969 0,0.00549 -0.07755,0.4112231 -0.263672,0.8789061 -0.186123,0.467683 -0.445941,1.018391 -0.667968,1.591797 -0.222028,0.573406 -0.492315,1.127768 -0.361329,2.033203 0.06549,0.452718 0.346661,1.042718 0.820313,1.386719 0.473652,0.344001 0.987473,0.427 1.439453,0.429687 l 4.521484,0.02734 c 2.256921,0.01347 4.015625,1.761701 4.015625,4.007813 v 3.0625 c -0.251888,-0.06525 -0.520477,-0.14083 -0.873046,-0.25 -0.461906,-0.143026 -0.944342,-0.318952 -1.626954,-0.316407 -3.424094,0.0022 -6.226562,2.805897 -6.226562,6.230469 v 0.04297 c 0,3.425901 2.804566,6.230469 6.230469,6.230469 0.728719,0 1.214928,-0.207932 1.669922,-0.367188 0.357242,-0.125041 0.614616,-0.203502 0.841796,-0.265625 0.0065,0.0584 -0.01801,-0.04675 -0.01563,0.04883 v 2.69336 c 0,2.246104 -1.75975,4.005859 -4.005859,4.005859 H 15.638672 c -2.24611,0 -4.005859,-1.759756 -4.005859,-4.005859 V 20.197266 c 0,-2.246063 1.762869,-4.026722 3.992187,-4.00586 l 4.179687,0.03906 c 0.441138,0.0041 0.858778,-0.01668 1.353516,-0.253906 0.494738,-0.237222 1.00174,-0.891447 1.082031,-1.457032 0.160582,-1.131169 -0.297481,-1.559682 -0.585937,-2.072265 -0.576912,-1.025167 -1.122694,-2.093635 -1.101563,-2.5332035 l 0.002,-0.035156 v -0.037109 c 0,-1.7737838 1.380514,-3.1542969 3.154297,-3.1542969 z"
              fill="#0057FF"
            />
            Closing TaskBox
          </svg>
        </v-card-title>
        <v-row align="center" justify="center" style="min-height: 110px">
          <v-text-field autofocus outlined required label="Name of the file template" hide-details="true" v-model="templateName" dense />
        </v-row>
        <v-card-actions>
          <v-row class="py-3" align="center" justify="center" style="width: 100%">
            <v-btn rounded small color="grey" @click="savingTemplate = false"> cancel </v-btn>
            <v-btn rounded :disabled="templateName == null || templateName == ''" small class="ml-2" color="primary" @click="templateFile()"> create </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-if="working">
      <v-row>
        Opening in the default external app
        <v-btn x-small class="ml-6 mt-1" color="accent" loading icon> </v-btn>
      </v-row>
      <v-btn x-small class="mt-6" color="accent" @click="getData()"> back </v-btn>
    </v-overlay>
  </div>
</template>

<script>
import _ from 'lodash';

import taskstate, { getStatusTypeByValue } from '../../../enums/taskstate';
import { eventBus } from '../../../../main';
import { mapState } from 'vuex';
const open = require('open');
const {  clipboard } = require('electron');

const { ipcRenderer } = require('electron');
export default {
  name: 'previewTypeText',
  props: { mime: String, fullscreen: Boolean, inTask: Object },
  data() {
    return {
      text: null,
      fileExist: true,
      loading: false,
      working: false,
      isProtected: true,
      savingTemplate: false,
      templateName: null,
      max: 2197,
      page: {
        name: 'A4',
        lineheight: 1.5,
        mx: 20,
        my: 20,
        w: 600,
        h: 800,
      },
    };
  },
  async mounted() {
    this.checkFileExist().then((response) => {
      this.fileExist = response;
      if (response) this.getData();
    });
    this.working = false;
    if (this.status.value == taskstate.STARTED.value || this.status.value == taskstate.REVIEWING.value) this.working = true;
    else this.working = false;
  },
  watch: {
    // status(s) {
    //   if (s.value == taskstate.STARTED.value || s.value == taskstate.REVIEWING.value) this.working = true;
    //   else this.working = false;
    // },
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
    }),
    task() {
      return this.inTask || this.previewingTask;
    },
    file() {
      return this.task.value.file;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    height() {
      return this.page.h - this.page.my * 2;
    },
  },
  methods: {
    getData() {
      this.$nextTick(async () => {
        this.loading = true;
        await ipcRenderer
          .invoke('app:getFile', {
            path: this.file.path,
            encoding: 'utf8',
          })
          .then((result) => {
            this.text = result;
            eventBus.$emit('previewLoaded', false);
            this.loading = false;
            this.working = false;
          });
      });
    },
    async checkFileExist() {
      if (!this.file) return false;
      await ipcRenderer.invoke('app:existInFilesFolder', this.task.value.file.path).then((response) => {
        this.isProtected = !response;
      });
      return await ipcRenderer.invoke('app:fileExist', this.file.path);
    },
    copyToClipboard(){
       clipboard.writeText(this.task.value.file.path)
    },
    selectFile() {
      ipcRenderer.invoke('app:selectFile').then(async (file) => {
        // console.logfile);
        if (file == null) return;

        let entity = _.cloneDeep(this.task);

        entity.title = file.name;
        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity);
      });
    },
    async workOnTask() {
      this.$store.commit('task/WORK_ON_TASK', this.task);

      this.working = true;
      // await ipcRenderer.invoke('app:workOnFileTask', { task: this.task }).then(async () => {
      // this.$refs.textarea.focus();
      await open(this.task.value.file.path, { wait: true })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.getData();
        });
      // });
    },
    async templateFile() {
      if (this.templateName == null || this.templateName == '') return;
      await ipcRenderer.invoke('app:saveFileTemplate', { file: this.file, name: this.templateName }).then((response) => {
        console.log(response);
        this.savingTemplate = false;
      });
    },
  },
};
</script>

<style>
.v-input textarea {
  margin-right: 5px;
  margin-bottom: 5px;
  page-break-after: auto;
  text-align: justify !important;
  font-weight: 100;
  line-height: 22px;
  font-size: 14px !important;
}
</style>
