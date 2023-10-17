<template>
  <v-sheet height="100%" width="100%">
    <file-actions />

    <v-responsive width="100%" ref="image" height="100%" style="align-items: center" class="pa-0 ma-0">
      <v-progress-linear absolute top color="primary" indeterminate v-if="loading" />
     
      <v-list-item-subtitle v-if="fileExist && !task.thumbnail">
        <v-chip color="warning"> No Preview for this type of file. </v-chip>
      </v-list-item-subtitle>
     
      <v-img v-else-if="fileExist && task.thumbnail" class="ma-0 pa-0 mb-5" height="512" contain :src="task.thumbnail"> </v-img>

      <v-list-item-subtitle v-else>
        <v-chip color="error"> file deleted or moved! </v-chip>
      </v-list-item-subtitle>

      <v-toolbar v-if="showToolsBar" v-show="!loading" color="background" class="px-4 mb-3" dense height="30" bottom style="position: fixed; left: 43.5%; bottom: 50px" rounded="pill">
        <v-tooltip v-if="fileExist" bottom transition="none">
          <template v-slot:activator="{ on }">
            <v-btn class="px-0 mx-1" color="primary" rounded v-on="on" x-small @click="getClipBoardImage()">
              <svg width="25" height="25" version="1.1" viewBox="0 0 46 50" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
                  fill="white"
                  style="pointer-events: none"
                />
              </svg>
            </v-btn>
          </template>
          Paste a thumbnail
        </v-tooltip>
      </v-toolbar>
    </v-responsive>
  </v-sheet>
</template>

<script>

import FileActions from './fileActions.vue';


import { mapState } from 'vuex';
import { eventBus } from '../../../../main';
import taskstate, { getStatusTypeByValue } from '../../../enums/taskstate';
const { clipboard, ipcRenderer, nativeImage } = require('electron');
import { isTaskWorking } from '../../../store/modules/task/task';
import { iconTypes } from '../../../fixtures/iconTypes';
import _ from 'lodash';

export default {
  name: 'previewTypeNoPreview',
  props: { hasReviews: Boolean, fullscreen: Boolean, showToolsBar: Boolean },
  components: { FileActions },
  data() {
    return {
      fileExist: true,
      loading: false,
      editingTitle: false,
      editing: false,
      working: false,
      updatedprogress: 0,
    };
  },
  created() {
    ipcRenderer.on('app:tick-review', (e, value) => {
      console.log(this.task, value);
      this.$store.dispatch('task/TOGGLE_REVIEW_ITEM', { task: this.task, reviewIndex: this.task.due.reviews.length - 1, itemIndex: value.item });
    });
  },
  watch: {
    async previewingTask() {
      this.fileExist = await this.checkFileExist();
    },
  },
  async mounted() {
    this.create('public/box_logo_b_64_closed.png');
    this.checkFileExist().then((response) => {
      this.fileExist = response;
      if (response)
        this.$nextTick(async () => {
          this.loading = true;
          await ipcRenderer
            .invoke('app:getFile', {
              path: this.file.path,
              encoding: 'base64',
            })
            .then((result) => {
              this.image = result;
              eventBus.$emit('previewLoaded', false);
              this.loading = false;
            });
        });
    });
  },

  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
      taskInputs: (state) => state.taskbox.taskInputs,
      taskOutputs: (state) => state.taskbox.taskOutputs,
    }),
    task() {
      return this.auditingTask || this.previewingTask;
    },
    file() {
      return this.task.value.file;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    taskable() {
      return this.task.taskable;
    },
    hasFile() {
      if (!this.task) return false;
      return this.task.value && this.task.value.file ? true : false;
    },
    disabled() {
      if (!this.taskable && this.status.value == 0) return false;
      return this.status.value !== taskstate.STARTED.value && this.status.value !== taskstate.REVIEWING.value ? true : false;
    },
    progress: {
      get() {
        return this.task.progress;
      },
      set(value) {
        this.updatedprogress = value;
      },
    },
  },
  methods: {
    create(path) {
      let img = nativeImage.createFromPath(path).toDataURL();
      clipboard.writeText(img);
    },
    async checkFileExist() {
      if (!this.hasFile) return false;
      return await ipcRenderer.invoke('app:fileExist', this.file.path);
    },
    selectFile() {
      ipcRenderer.invoke('app:selectFile').then(async (file) => {
        // console.logfile);
        if (file == null) return;

        let entity = _.cloneDeep(this.task);

        entity.title = file.name;

        if (file.extension == '.png' || file.extension == '.jpg') {
          let clip = await nativeImage.createThumbnailFromPath(file.path, { width: 256, height: 256 });
          entity.thumbnail = clip.toDataURL();
        }
        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity);
      });
    },
    async getClipBoardImage() {
      if (!clipboard.readImage().isEmpty()) {
        let clip = clipboard.readImage();
        let size = clip.getSize();
        // let image = clip.crop({x:(size.width/2)-512,y:(size.height/2)-512,width:512,height:512}).toDataURL();

        let entity = _.cloneDeep(this.task);

        entity.thumbnail = clip
          .resize({ width: size.width / 2, height: size.height / 2 })
          .crop({ x: size.width / 2 - size.height / 2 - size.height / 2 / 2, y: 0, width: size.height / 2, height: size.height / 2 })
          .toDataURL();

        this.$store.dispatch('taskbox/UPDATE_TASK', entity);
      }
    },
    updateProgress() {
      this.loading = true;
      this.$nextTick(() => {
        let copy = _.cloneDeep(this.task);
        copy.progress = this.updatedprogress;
        this.$store.commit('task/UPDATE_TASK_PROGRESS', copy);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    getIconType(t) {
      return getStatusTypeByValue(t).icon;
    },
    getIcon(name) {
      let iconIndex = 0;
      if (this.node.meta.options) {
        iconIndex = this.node.data.textype;
        name = this.node.meta.options[this.node.data.selected].name;
      }
      return iconTypes[name.toLowerCase()][iconIndex];
    },
    async workOnTask() {
      if (this.fileExist) {
        if (!isTaskWorking(this.task)) this.$store.commit('task/WORK_ON_TASK', this.task);
        this.working = true;
        ipcRenderer
          .invoke('app:workOnFileTask', {
            task: this.task,
            inputs: this.taskInputs,
            outputs: this.taskOutputs,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            this.editing = true;
            this.working = false;
          });
      }
    },
  },
};
</script>
