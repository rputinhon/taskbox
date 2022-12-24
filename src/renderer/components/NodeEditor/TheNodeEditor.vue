<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-row align="center" justify="center" class="ma-0 pa-0" style="width: 100%; height: calc(100vh - 40px)">
      <empty
        v-show="isEmpty"
        :loading="openning"
        :text="' '"
        :image="'img/logo_worm_128_flat.png'"
      />

      <taskbox-transition v-if="!levelDown" hide-on-leave origin="center center 0px">
        <div id="nodeview" dropzone="true" class="pa-0 ma-0" v-show="!loading" />
      </taskbox-transition>
      <v-scale-transition hide-on-leave v-else origin="center center 0px">
        <div id="nodeview" dropzone="true" class="pa-0 ma-0" v-show="!loading" />
      </v-scale-transition>

      <!-- modals -->
      <!-- inputs -->
      <v-navigation-drawer v-if="false" permanent absolute color="transparent" width="auto" height="100%" style="text-align: left; overflow-y: auto; top: 75px; overflow-x: hidden">
        <v-fade-transition group>
          <v-list v-for="(input, i) in taskBoxInputs" :key="i" class="py-0 px-2">
            <static-input :input="input" @preview="preview(input.node)" />
          </v-list>
        </v-fade-transition>
      </v-navigation-drawer>

      <!-- output -->
      <v-navigation-drawer v-if="dataReady && false" permanent fixed right :class="authenticated && 'mr-8'" color="transparent" width="70px" height="100%" style="z-index: 0; overflow-y: auto; top: 75px; pointer-events: none">
        <v-row align="center" justify="center" class="mx-0 px-0" style="height: calc(100vh - 100px)">
          <v-chip x-small style="overflow: visible; pointer-events: auto; pointer-events: all" :color="haveOutputs ? 'error' : 'white'" :outlined="!haveOutputs" link @mouseenter="overOut = true" @mouseleave="overOut = false"> out </v-chip>
        </v-row>
      </v-navigation-drawer>

      <analisys v-if="analysing !== false" :absolute="true" :height="70" />
    </v-row>

    <div v-if="dataReady">
      <v-overlay v-if="paused || canceled" absolute color="white" :style="`color:${status.color}`" class="text-h4"> {{ status.text }} </v-overlay>
      <display-menu v-if="dataReady" @frameAll="frameAll()" />
      <choose-connection :open="chooseConnection" :droppingConn="droppingConn" @close="closeChooseConnection()" @choose="ChooseSelected()" />
      <modal-color-picker v-if="editingframe" :show="pickColor" :frame="editingframe" @closePickColor="closePickColor()" />
      <confirm-delete />
    </div>
  </v-container>
</template>

<script>
import './flow.css';

import { eventBus } from '../../../main.js';

import ConfirmDelete from '../dialogs/ConfirmDelete.vue';
import ChooseConnection from '../dialogs/ChooseConnection.vue';
import DisplayMenu from '../menus/DisplayMenu.vue';
import Empty from '../dialogs/Empty.vue';
import ModalColorPicker from '../forms/ModalColorPicker.vue';
import StaticInput from '../lists/StaticInput.vue';

import { NodeView } from '../../libs/nodeview';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';

import { mapGetters, mapState } from 'vuex';
import _ from 'lodash';
import Analisys from '../navigation/Analisys.vue';

export default {
  components: {
    Empty,
    StaticInput,
    ConfirmDelete,
    ChooseConnection,
    ModalColorPicker,
    DisplayMenu,
    Analisys,
  },
  data: () => ({
    loading: false,
    selected: [],
    // to control animation when open taskbox
    levelDown: false,
    // review dialog
    showReview: false,
    reviewingNode: null,
    //delete dialog
    showConfirmDelete: false,
    //change status dialog
    toDelete: [],
    //choose connection dialog
    chooseConnection: false,
    droppingConn: null,
    //choose worker
    overOut: false,
    pickColor: false,
    editingframe: null,
    loadingOrigin: ['center', 'center'],
    refreshKey: 0,
  }),
  async created() {
    eventBus.$on('pickColor', (frame) => {
      this.editingframe = frame;
      this.pickColor = true;
    });

    eventBus.$on('connectFromExternalinput', (conn) => {
      NodeView.connectingFromExtenal(conn);
    });

    eventBus.$on('droppingConnection', async (conn) => {
      if (this.overOut == true) {
        await NodeView.exposeOutput(conn, true);
      }
      this.overOut = false;
    });

    eventBus.$on('chooseConnection', (conn) => {
      this.droppingConn = conn;
      this.chooseConnection = true;
    });

    eventBus.$on('addNode', (e, name) => {
      NodeView.addNode(e, name);
    });

    eventBus.$on('review', (node) => {
      this.review(node);
    });

    eventBus.$on('checkEmpty', () => {
      this.refreshKey++;
    });

    eventBus.$on('confirmDeletion', (list) => {
      this.showConfirmDelete = true;
      this.toDelete = list;
    });

    eventBus.$on('OpenTaskbox', (deeper) => {
      this.levelDown = deeper;
      this.loading = true;
      this.$nextTick(() => {
        this.updateEditor();
      });
    });

    document.addEventListener('mousewheel', this.mousewheel, { passive: true });

    // NodeView.initEditor(this.library);
  },
  computed: {
    ...mapState({
      root: (state) => _.cloneDeep(state.taskbox.root),
      currentTaskBoxTask: (state) => state.taskbox.currentTaskBox,
      openning: (state) => state.taskbox.loading,
      library: (state) => state.library.library,
      analysing: (state) => state.taskbox.analysing,
      taskBoxInputs: (state) => state.taskbox.taskBoxInputs,
    }),
    ...mapGetters({
      currentTaskBox: 'taskbox/currentTaskBox',
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    dataReady() {
      return this.currentTaskBox && this.currentTaskBoxTask ? true : false;
    },
    workspaceColor() {
      let c = this.$vuetify.theme.themes[this.$vuetify.theme.isDark ? 'dark' : 'light'];
      return c.workspace;
    },
    haveOutputs() {
      return this.Outputs.length > 0 ? true : false;
    },
    Outputs() {
      return [];
      // if (!this.dataReady) return [];
      // return Object.entries(this.currentTaskBox.data.nodes).filter((n) => n[1].data.exposed === true);
    },
    status() {
      return getStatusTypeByValue(this.dataReady ? this.currentTaskBoxTask.status : 0);
    },
    paused() {
      return this.status.value == taskstate.PAUSED.value ? true : false;
    },
    canceled() {
      return this.status.value == taskstate.REPROVED.value ? true : false;
    },
    statusTypes() {
      return taskstate;
    },
    isDisabled() {
      return false;
      // let result = taskRepository.checkIfAnyParentDisabled(this.currentTaskBox.task);
      // return result;
    },
    isEmpty() {
      if (!this.dataReady) return true;
      this.refreshKey;
      return NodeView.isEmpty();
    },
  },
  methods: {
    async updateEditor() {
      new Promise((resolve, reject) => {
        if (!NodeView.isInitialized())
          NodeView.initEditor(this.library).then(() => {
            NodeView.updateEditorData(this.currentTaskBox)
              .then(() => {})
              .catch((error) => {
                reject(error);
              })
              .finally(async () => {
                // eventBus.$emit('updateExternalConnection');
                NodeView.clearSelection();
                NodeView.process();
                this.loading = false;
                this.refreshKey++;
                if (this.analysing !== false) this.$store.commit('taskbox/ANALISE');
                resolve();
              });
          });
        else {
          NodeView.updateEditorData(this.currentTaskBox)
            .then(() => {})
            .catch((error) => {
              reject(error);
            })
            .finally(async () => {
              // eventBus.$emit('updateExternalConnection');
              NodeView.clearSelection();
              NodeView.process();
              this.loading = false;
              this.refreshKey++;
              if (this.analysing !== false) this.$store.commit('taskbox/ANALISE');
              resolve();
            });
        }
      });
    },
    frameAll() {
      NodeView.frameAll();
    },
    isOnline() {
      return navigator.onLine ? true : false;
    },
    toggleDataFlowing(data) {
      !data.flowingData && Object.assign(data, { flowingData: { flowing: true } });
      data.flowingData.flowing = !data.flowingData.flowing;
      NodeView.saveTaskBox();
    },
    closePickColor() {
      let c = this.editingframe.color.rgba;
      this.editingframe.color = `rgba(${c.r},${c.g},${c.b},${c.a})`;

      NodeView.updateFrameColor(this.editingframe);

      this.pickColor = false;
      this.editingframe = null;
    },
    closeChooseConnection() {
      this.chooseConnection = false;
      this.droppingNode = null;
    },
    closeConfirmDelete() {
      this.showConfirmDelete = false;
      this.toDelete = null;
    },
    closeConfirmStatus() {
      this.showConfirmChangeStatus = false;
      this.toConfirmStatus = null;
      this.newStatus = null;
    },
    closeChangeWorker() {
      this.toChangeWorker = null;
      this.showChangeWorker = false;
    },
    closeReview() {
      this.reviewingNode = null;
      this.showReview = false;
    },
    async preview(id) {
      this.$store.commit('taskbox/PREVIEW_TASK', id);
    },
    review(node) {
      this.reviewingNode = node;
      this.showReview = true;
    },
    hasSelection() {
      return this.selected.length > 0 || this.comments.length > 0 ? true : false;
    },
    hasFramable() {
      return this.selected.length > 0 && this.comments.length == 0 ? true : false;
    },
    mousewheel(e) {
      if (this.loading) return;
      if (e.ctrlKey) {
        if (e.wheelDeltaY < 0) {
          let root = this.$store.getters['taskbox/currentRootId'];
          let current = this.$store.getters['taskbox/currentTaskBoxId'];
          if (e.shiftKey) {
            if (root !== current) {
              this.loading = true;
              this.$store.commit('taskbox/NAV_HOME');
            } else this.$store.commit('app/TOGGLE_MEMBER_AREA', true);
          } else {
            if (root !== this.currentTaskBox.id) {
              this.loading = true;
              this.$store.commit('taskbox/NAV_UP');
            }
          }
        } else {
          if (e.wheelDeltaY > 0 && !this.loading) {
            let node = (e.srcElement && e.srcElement.ownerSVGElement) || null;
            if (node) {
              let id = node.id.split(':')[1];
              let name = e.srcElement.ownerSVGElement.getAttribute('name');
              if (name == 'TaskBox') {
                this.loading = true;

                this.$store.dispatch('taskbox/OPEN_TASKBOX', { id: id, deeper: true, savestack: false });
              } else {
                this.$store.commit('taskbox/PREVIEW_TASK', { task: id, savestack: true });
              }
              // this.loadingOrigin = [e.screenX, e.screenY];
            }
          }
        }
      }
    },
  },
};
</script>

<style>
.taskbox-transition-enter-active,
.taskbox-transition-leave-active {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.scale-transition-move {
  transition: transform 0.1s;
}

.taskbox-transition-enter,
.taskbox-transition-leave,
.taskbox-transition-leave-to {
  opacity: 0;
  transform: scale(1.5) !important;
}

.disabled {
  pointer-events: none;
  opacity: 0.3;
}

.flowReview {
  width: 284px;
}

.flowReviewBody {
  width: 360px;
  height: 120px;
  margin-left: -35px !important;
}

.simpleFlow {
  width: 105px;
}

.simpleFlowBody {
  width: 140px;
  height: 108px;
  margin-left: -20px !important;
}

.taskboxBase {
  width: 248px;
  padding-left: 2px;
}

.taskboxBody {
  width: 320px;
  height: 280px;
  margin-left: -35px !important;
}

.nodeBase {
  width: 220px;
  padding-top: 6px;
}

.nodeBody {
  width: 280px;
  height: 235px;
  margin-left: -30px !important;
}

.nodeMenu {
  position: absolute;
  margin-top: -30px;
}

.IOPassout {
  color: white;
  position: absolute;
  margin-left: -16px;
  margin-top: 2px;
}

.nodeIOdisabled {
  opacity: 0.4;
  text-decoration: line-through !important;
}

.searchbar {
  font-size: 8px;
}

.v-chip .v-chip__content {
  display: block !important;
  align-items: center;
  height: 20px !important;
}

.v-toolbar__content,
.v-toolbar__extension {
  padding: 0px;
}

.resizer {
  width: 40px;
  height: 40px;
}
</style>
