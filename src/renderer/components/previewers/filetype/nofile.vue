<template>
    <v-row align="center" justify="center" style="height: 100%; width: 100%">
      <v-list color="transparent">
        <creating-file-list @create="create" />
        <v-list-item>
          <v-btn rounded color="primary" :loading="loading" small @click="selectFile()"> select file </v-btn>
        </v-list-item>
      </v-list>
      <creator-dialog :showCreate="showCreate" :type="creatingType" :task="previewingTask" @close="close" />
    </v-row>
</template>

<script>
import { eventBus } from '../../../../main';
import taskstate, { getStatusTypeByValue } from '../../../enums/taskstate';
import { iconTypes } from '../../../fixtures/iconTypes';

import CreatingFileList from '../../menus/CreatingFileList.vue';
import CreatorDialog from '../../NodeEditor/creators/CreatorDialog.vue';
// import NavMenu from '../../navigation/NavMenu.vue';
import _ from 'lodash';
import { mapState } from 'vuex';

const { ipcRenderer, nativeImage } = require('electron');
export default {
  name: 'previewTypeNoFile',
  props: { inTask: Object },
  components: { 
    CreatingFileList, 
    CreatorDialog, 
    // NavMenu 
    },
  data() {
    return {
      loading: false,
      editingTitle: false,
      creatingType: null,
      showCreate: false,
    };
  },
  mounted() {
    setTimeout(function () {
      eventBus.$emit('previewLoaded', false);
    }, 800);
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    node() {
      return this.currentTaskBox.data.nodes[this.previewingTask.id];
    },
    task() {
      return this.inTask || this.previewingTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    started() {
      return this.status.value > taskstate.UNSTARTED.value ? true : false;
    },
    taskable() {
      return this.task.taskable;
    },
  },
  methods: {
    create(type) {
      this.creatingType = type;
      this.showCreate = true;
    },
    close() {
      this.creatingType = null;
      this.showCreate = false;
    },
    getIcon(name) {
      let iconIndex = 0;
      if (this.node.meta.options) {
        iconIndex = this.node.data.textype;
        name = this.node.meta.options[this.node.data.selected].name;
      }
      return iconTypes[name.toLowerCase()][iconIndex];
    },
    selectFile() {
      this.loading=true;
      ipcRenderer.invoke('app:selectFile').then(async (file) => {
        // console.logfile);
        if (file == null) return;

        let entity = _.cloneDeep(this.previewingTask);

        entity.title = file.name;

        if (file.extension == '.png' || file.extension == '.jpg') {
          let clip = await nativeImage.createThumbnailFromPath(file.path, { width: 256, height: 256 });
          entity.thumbnail = clip.toDataURL();
        }

        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity).then(()=>{
          this.loading=false;
        })
      });
    },
  },
};
</script>
