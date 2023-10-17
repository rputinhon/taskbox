<template>
  <v-row align="center" justify="center" style="height: 100%; width: 100%">
    <v-list color="transparent">
      <creating-file-list @create="create" />
      <v-list-item>
        <v-tooltip left transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey" icon :loading="loading" fab @click="selectFile()" v-on="on" v-bind="attrs">
              <svg version="1.1" viewBox="-1 -2 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 11.213876,0.87347503 c -2.4849912,0 -4.8722399,1.94484257 -4.8722399,4.34236857 V 17.653283 c 0,2.397527 1.8682267,2.937547 4.2657559,2.937547 2.397529,0 3.677993,-0.54002 3.677993,-2.937547 v -0.01405 h -0.0056 V 8.6523538 C 14.154072,6.9336748 12.994039,5.5400036 11.192091,5.5236546 9.7860788,5.5108976 8.2345618,6.9914534 8.1751308,8.4717435 c -0.09055,2.1757135 -0.0506,7.4738795 -0.0506,7.4738795 l 0.950837,-0.01335 c 0,0 -0.03787,-5.294652 0.0506,-7.4204697 0.168112,-1.3944445 1.1017352,-2.0413569 2.0689342,-2.0344979 1.382293,0.0098 2.031988,0.9505943 2.134023,2.1588868 v 0.00281 9.0002268 h -0.01265 v 0.01405 c 0,1.877126 -0.831756,1.967735 -2.708883,1.967735 -1.8771272,0 -3.2959439,-0.09061 -3.2959439,-1.967735 V 5.2158486 c 0,-1.877126 2.0253007,-3.3732596 3.9024279,-3.3732596 1.877127,0 3.868747,1.4961336 3.868747,3.3732596 v 6.9137734 h 0.800714 V 5.2158436 c 0.008,-2.43319 -2.290797,-4.34236857 -4.669459,-4.34236857 z"
                  color="#000000"
                  fill="gray"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.67"
                  style="-inkscape-stroke: none; paint-order: stroke fill markers"
                />
              </svg>
            </v-btn>
          </template>
          Select a file
        </v-tooltip>
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
      this.loading = true;
      ipcRenderer.invoke('app:selectFile').then(async (file) => {
        if (file == null) {
          this.loading = false;
          return;
        }

        let entity = _.cloneDeep(this.previewingTask);

        entity.title = file.name;

        if (file.extension == '.png' || file.extension == '.jpg') {
          let clip = await nativeImage.createThumbnailFromPath(file.path, { width: 256, height: 256 });
          entity.thumbnail = clip.toDataURL();
        }

        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity).then(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>
