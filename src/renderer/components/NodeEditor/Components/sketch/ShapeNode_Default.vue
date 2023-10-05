<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${status.color}!important`"> </Socket>
          <small class="white--text" style="margin-left: -10px">
            {{ input.name }}
          </small>
          <external-input  :index="0" :externalInput="externalInputs"  @remove="removeExternalinput" />
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg :id="`id:${node.id}`" :name="node.name" style="pointer-eventes: all" class="categoryIcon" width="200" height="200" version="1.1" viewBox="0 -1 47 57" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient :id="node.id" x2="48" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop :stop-color="color" offset="0" />
                <stop :stop-color="color" :offset="value / 100 || 0" />
                <stop :stop-color="'transparent'" :offset="value / 100 || 0" />
                <stop :stop-color="'transparent'" offset="1" />
              </linearGradient>
            </defs>
            <rect x="0" y=".52899" width="47" height="51.5" ry="5" :fill="`url(#${node.id})`" stroke-width="1.7" :stroke="(!hasOpenItens && status.color) || 'orange'" />
            <path class="multiply noevents" transform="scale(0.45) translate(28 35)" :d="fileIcon" :fill="'grey'" />
            <LOD :lod="LODTYPE.MEDIUM">
              <text v-if="task.value && task.value.file" x="0" y="0" fill="#d3bc5f" font-family="sans-serif" font-size="10.396px" stroke-width=".4" style="line-height: 1.25" xml:space="preserve">
                <tspan class="multiply" x="23.5" y="45" :fill="'grey'" font-family="sans-serif" font-size="6px" font-weight="bold" text-align="center" text-anchor="middle" style="pointer-events: none; line-height: 1.5" xml:space="preserve">
                  {{ task.value.file.extension }}
                </tspan>
              </text>
            </LOD>
          </svg>
          <LOD v-if="showMiniature && task.thumbnail" :lod="LODTYPE.MEDIUM" style="pointer-events: none !important">
            <v-card flat color="transparent" style="z-index: 0; pointer-events: none; overflow: hidden; border-radius: 15px; top: 32px; left: 30px; position: absolute" width="201" height="240">
              <v-img width="160" height="176" style="pointer-events: none" :src="task.thumbnail" />
            </v-card>
          </LOD>
          <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
        </v-row>
      </v-col>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null" style="margin-right: -40px">
          <worker v-if="showWorker" :task="task" :size="45" :max="3" :justify="'center'" :ExtraClass="'mt-3 mr-14'" :ExtraStyle="'margin-top:10px'" />
          <Socket v-socket:output="output" type="output" :socket="output.socket" :style="`background:${!false ? status.color : '#FF5252'}!important;${!showWorker && 'margin-left:-35px'}`"></Socket>
          <!-- <v-chip v-if="output.data.expose" :class="hoverSocket == output.key && 'px-10 mr-16'" class="px-4 IOPassout" color="error" link>
            <template slot:close v-if="hoverSocket == output.key">
              out
              <v-tooltip bottom right transition="none">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="tooltip" class="ml-2 text-h6" x-small fixed icon @click="(output.expose = false), changeAction()"> x </v-btn>
                </template>
                remove
              </v-tooltip>
            </template>
          </v-chip> -->
        </div>
      </v-col>
    </v-row>
    <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
    <LOD :lod="LODTYPE.MEDIUM" v-if="showLabel">
      <div class="title">
        <RULE :rule="rules.EDIT" :doc="task" :returnCondition="true">
          <div slot-scope="allow" v-if="allow.value">
            <v-text-field ref="nodetitle" v-if="editingTitle" color="primary" single-line class="nodetitle mx-auto d-block" style="width: 250px; margin-top: -5px" autofocus v-model="title" :key="node.id" dense hide-details="true" @keydown.enter="changeName()" @keydown.escape="cancelChangeName()" @blur="changeName()" @click.prevent="" />
            <span v-else @click.stop="editingTitle = true"> {{ task.title }} {{ '| ' + info }}</span>
          </div>
          <div v-else>
            <span> {{ node.data.title }} {{ '| ' + info }}</span>
          </div>
        </RULE>
      </div>
    </LOD>
  </div>
</template>

<script>
import Worker from '../Worker.vue';

import LODTYPES from '../../../../enums/LOD';
import { getFileType } from '../../../../fixtures/fileTypes';
import store from '../../../../store';
import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ExternalInput from '../ExternalInput.vue';
import RULES from '../../../../enums/rules';
import RULE from '../../../navigation/Rule.vue';
import LOD from '../../../navigation/Lod.vue';
import _ from 'lodash';
import { taskModel } from '../../../../store/models/TaskModel';
import { hasOpenAuditions } from '../../../../store/modules/task/task';
import { getAuditionStatusByValue } from '../../../../enums/auditionstatus';
// import { ipcRenderer } from 'electron';

export default {
  components: { Worker, ExternalInput, RULE, LOD },
  name: 'FileNode_Default',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      editingTitle: false,
      updatedTitle: '',
      hoverSocket: null,
      externalInputs: null,
      refreshkey: 0,
    };
  },
  computed: {
    showWorker() {
      return false;
    },
    analysing() {
      return store.state.taskbox.analysing;
    },
    analisis() {
      if (!this.analysing || !store.state.taskbox.analisis[this.node.id]) return false;
      return store.state.taskbox.analisis[this.node.id][this.analysing];
    },
    task() {
      this.refreshkey;
      if (!store.state.taskbox.root || !store.state.taskbox.root.tasks || !store.state.taskbox.root.tasks[this.node.id]) return taskModel;
      return store.state.taskbox.root.tasks[this.node.id];
    },
    status() {
      this.refreshkey;
      return getStatusTypeByValue(this.task.status);
    },
    value() {
      this.refreshkey;
      return !this.analysing ? this.task.progress || 0 : 100;
    },
    color() {
      this.refreshkey;
      return !this.analysing ? this.status.color : this.analisis.color;
    },
    info() {
      this.refreshkey;
      return !this.analysing ? this.task.progress + '%' : this.analisis.text;
    },
    auditing() {
      this.refreshkey;
      return hasOpenAuditions(this.task);
    },
    file() {
      this.refreshkey;
      if (!this.task.value) return false;
      return this.task.value.file;
    },
    fileIcon() {
      this.refreshkey;
      return this.task.status == taskstate.DONE.value ? 'm 31.034874,15.137637 c -0.0049,0.0048 -0.0098,0.0097 -0.01465,0.01465 L 20.900611,25.336953 17.618305,22.176565 c -1.987828,-1.914417 -5.195617,-1.855609 -7.110442,0.131827 -1.915925,1.988085 -1.8558089,5.197114 0.133119,7.112164 v 0.0018 l 6.850235,6.59429 c 1.966704,1.893059 5.130922,1.858094 7.055299,-0.07798 L 38.155224,22.245063 c 1.945675,-1.958067 1.935428,-5.16841 -0.02283,-7.113888 -0.02162,-0.02122 -0.04388,-0.04177 -0.06678,-0.06161 -2.161629,-1.733795 -5.217792,-1.648588 -7.030742,0.06807 z' : getFileType(this.file && this.file.extension || null).info.icon;
    },
    LODTYPE() {
      this.refreshkey;
      return LODTYPES;
    },
    showMiniature() {
      if (!store.state.app.displaySettings) return false;
      return store.state.app.displaySettings[0].value;
    },
    showLabel() {
      if (!store.state.app.displaySettings) return false;
      return store.state.app.displaySettings[1].value;
    },
    rules() {
      return RULES;
    },
    title: {
      get() {
        this.refreshkey;
        return this.task.title;
      },
      set(value) {
        this.updatedTitle = value;
      },
    },
    lastReview() {
      return this.task.due.reviews && this.task.due.reviews[this.task.due.reviews.length - 1];
    },
    lastRevStatus() {
      return getAuditionStatusByValue(this.lastReview.status || 0);
    },
    hasOpenItens() {
      return this.lastReview && this.lastReview.reviewItems.filter((i) => i.value !== true).length > 0 ? true : false;
    },
  },
  methods: {
    update() {
      this.refreshkey++;
    },
    removeExternalinput(id) {
      store.commit('task/REMOVE_EXTERNAL_VALUE', { task: this.task, inputId: id });
    },
    cancelChangeName() {
      this.$refs.nodetitle.blur();
      this.editingTitle = false;
    },
    changeName() {
      if (!this.updatedTitle || this.updatedTitle.trim().length == 0) {
        this.editingTitle = false;
        return;
      }
      let copy = _.cloneDeep(this.task);
      copy.title = this.updatedTitle;
      store
        .dispatch('taskbox/UPDATE_TASK', copy)
        .then(() => {
          //  ipcRenderer.invoke('app:rename-File', file.path).then(async (template) => {
          //       await self.addTemplate(template, e);
          //   })
        })
        .catch((error) => console.log(error));
      this.editingTitle = false;
    },
    // IO data
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
    unstartedColor() {
      return taskstate.UNSTARTED.color;
    },
  },
};
</script>

<style scoped>
.output {
  left: 50px !important;
}
</style>
