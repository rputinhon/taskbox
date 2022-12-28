<template>
  <v-sheet height="100%" width="100%">
    <v-responsive width="100%" ref="image" height="100%" style="align-items: center" class="pa-0 ma-0" :class="background == 0 && 'checked'" :style="`background-color:${backgroundTypes[background]}`">
      <v-progress-linear absolute top color="primary" indeterminate v-if="loading" />
      <v-img class="ma-0 pa-0" :max-height="maxheight" v-if="file && fileExist" contain :src="`data:${mime};base64,${image}`"> </v-img>
      <v-list-item-subtitle v-else>
        <v-chip color="error"> file deleted or moved! </v-chip>
      </v-list-item-subtitle>
    </v-responsive>
    <v-overlay v-if="working">
      Opening in the default external app...
      <v-btn x-small color="accent" @click="working = false">back</v-btn>
    </v-overlay>
    <v-toolbar v-if="showToolsBar" v-show="!loading" color="grey lighten-2" class="px-4 mb-3" dense height="30" bottom style="position: fixed; left: 43.5%; bottom: 50px" rounded="pill">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn elevation="0" class="mr-1" color="primary" v-on="onTooltip" rounded x-small @click="selectFile()" v-text="'change file'"> </v-btn>
        </template>
        Change File
      </v-tooltip>
      <v-tooltip v-if="fileExist" bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn :disabled="disabled" elevation="0" color="primary" v-on="onTooltip" rounded x-small @click="workOnTask(hasReviews ? true : false)" v-text="'edit'"> </v-btn>
        </template>
        Edit in the default external application
      </v-tooltip>
      <v-btn-toggle v-if="fileExist" class="ml-2 mb-1" rounded group mandatory v-model="background">
        <v-item-group v-for="(color, c) in backgroundTypes" :key="c">
          <v-tooltip v-if="image" bottom transition="none">
            <template v-slot:activator="{ on: onTooltip }">
              <v-btn tile v-on="{ ...onTooltip }" elevation="0" x-small :color="color" class="px-0 mx-0" height="15" min-width="15">
                <v-img v-if="c == 0" height="15" width="15" src="img/checker.png" />
              </v-btn>
            </template>
            background
          </v-tooltip>
        </v-item-group>
      </v-btn-toggle>
    </v-toolbar>
  </v-sheet>
</template>

<script>
import { eventBus } from '../../../../main';
import taskstate, { getStatusTypeByValue } from '../../../enums/taskstate';
import _ from 'lodash';
import { mapState } from 'vuex';
const { ipcRenderer, nativeImage } = require('electron');
const open = require('open');

export default {
  components: {},
  name: 'previewTypeImage',
  props: { fullscreen: Boolean, mime: String, inTask: Object, showToolsBar: Boolean },
  data() {
    return {
      fileExist: true,
      image: null,
      loading: false,
      working: false,
      maxheight: 'auto',
      background: 1,
      backgroundTypes: ['checker', 'white', 'black'],
    };
  },
  async mounted() {
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
              let size = nativeImage.createFromDataURL(`data:${this.mime};base64,${result}`).getSize().height;
              this.maxheight = size;
              eventBus.$emit('previewLoaded', false);
              this.loading = false;
            })
        });
    });
  },
  watch: {
    fileExist() {
      eventBus.$emit('previewLoaded', false);
    },
    async previewingTask() {
      this.fileExist = await this.checkFileExist();
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
    taskable() {
      return this.task.taskable;
    },
    hasFile() {
      if (!this.file) return false;
      return this.task.value && this.task.value.file ? true : false;
    },
    disabled() {
      if (!this.taskable && this.status.value == 0) return false;
      return this.status.value !== taskstate.STARTED.value && this.status.value !== taskstate.REVIEWING.value ? true : false;
    },
  },
  methods: {
    async checkFileExist() {
      if (!this.hasFile) return false;
      return await ipcRenderer.invoke('app:fileExist', this.file.path);
    },
    getIconType(t) {
      return getStatusTypeByValue(t).icon;
    },
    async workOnTask(hasReviews) {
      if (hasReviews) this.$store.commit('task/REVIEW_TASK', this.task);
      else this.$store.commit('task/WORK_ON_TASK', this.task);

      this.working = true;
      await open(this.task.value.file.path, { wait: true })
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.working = false;
        });
    },
    selectFile() {
      ipcRenderer.invoke('app:selectFile').then(async (file) => {
        // console.logfile);
        if (file == null) return;

        let entity = _.cloneDeep(this.task);

        entity.title = file.name;

        if (file.extension == '.png' || file.extension == '.jpg') {
          let clip = await nativeImage.createThumbnailFromPath(file.path, { width: 256, height: 256 });
          this.maxheight
          entity.thumbnail = clip.toDataURL();
        }
        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity);
      });
    },
  },
};
</script>

<style scoped>
.checked {
  background-repeat: repeat;
  background-image: url('/img/checker.png');
}
</style>
