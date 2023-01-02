<template>
  <v-sheet height="100%" class="overflow-y-auto"  color="background" v-if="task">
    <v-responsive width="100%" ref="image"  style="align-items: center" class="pa-0 ma-0" >
      <v-progress-linear absolute top color="primary" indeterminate v-if="loading" />
      <v-card v-if="file && fileExist" class="mt-10 mx-auto my-7" :width="page.w" min-height="700px" height="fit-content" elevation="8">
        <v-textarea ref="textarea" auto-grow :min-height="height" :style="`padding:${page.my}px ${page.mx}px!important;`" solo style="border-color: transparent" class="text" type="text" :loading="loading" placeholder="Type the text here." no-resize flat v-model="text" @keydown.tab.prevent> </v-textarea>
      </v-card>
      <v-list-item-subtitle v-else>
        <v-chip color="error"> file deleted or moved! </v-chip>
      </v-list-item-subtitle>
    </v-responsive>
    <v-overlay v-if="working">
      Opening in the default external app...
      <v-btn x-small color="accent" @click="getData()">back</v-btn>
    </v-overlay>
    <v-toolbar v-show="!loading && fileExist" color="background" class="px-4 mb-3" dense height="30" bottom style="position: fixed; left: 40%; bottom: 50px" rounded="pill">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn elevation="0" class="mr-1" color="primary" v-on="onTooltip" rounded x-small @click="saveFile()" v-text="'save'"> </v-btn>
        </template>
        Save
      </v-tooltip>
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn elevation="0" class="mr-1" color="primary" v-on="onTooltip" rounded x-small @click="selectFile()" v-text="'change file'"> </v-btn>
        </template>
        Change File
      </v-tooltip>
      <v-tooltip v-if="fileExist" bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn elevation="0" color="primary" v-on="onTooltip" rounded x-small @click="workOnTask()" v-text="'edit'"> </v-btn>
        </template>
        Edit in the default external application
      </v-tooltip>
    </v-toolbar>
  </v-sheet>
</template>

<script>
import _ from 'lodash';

import taskstate, { getStatusTypeByValue } from '../../../enums/taskstate';
import { eventBus } from '../../../../main';
import { mapState } from 'vuex';
const open = require('open');

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
    status(s) {
      if (s.value == taskstate.STARTED.value || s.value == taskstate.REVIEWING.value) this.working = true;
      else this.working = false;
    },
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
      return await ipcRenderer.invoke('app:fileExist', this.file.path);
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
    async saveFile() {
      this.loading = true;
      await ipcRenderer.invoke('app:saveFile', Object.assign(_.cloneDeep(this.file), { data: this.text }));
      this.loading = false;
    },
    async workOnTask() {
      this.$store.commit('task/WORK_ON_TASK', this.task);

      this.$refs.textarea.focus();
      this.working = true;
      await open(this.task.value.file.path, { wait: true })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.getData();
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
