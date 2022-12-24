<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${status.color}!important`"></Socket>
          <external-input  :index="0" :externalInput="externalInputs"  @remove="removeExternalinput"  />
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg :id="`id:${node.id}`" :name="node.name" style="pointer-eventes: all" class="categoryIcon" width="245" height="250" version="1.1" viewBox="0 0 47 55.016" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient :id="node.id" x2="48" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop :stop-color="color" offset="0" />
                <stop :stop-color="color" :offset="value / 100 || 0" />
                <stop :stop-color="unstartedColor()" :offset="value / 100 || 0" />
                <stop :stop-color="unstartedColor()" offset="1" />
              </linearGradient>
            </defs>
            <rect ry="1" x="0" y=".52899" width="47" height="52" :fill="color" />
            <rect ry="1" x="0" y=".52899" width="47" height="10" :fill="`url(#${node.id})`" style="opacity: 0.8; filter: brightness(1.2)" />
          </svg>
          <LOD :lod="LODTYPE.HIGH">
            <span v-if="task.taskable" class="statusInfo">
              {{ `${task.progress}%` }}
            </span>
            <span v-else class="statusInfo"> Note </span>
          </LOD>
          <v-card-text v-show="lod >= LODTYPE.MEDIUM" class="notepreview">
            {{ task.value }}
          </v-card-text>
          <!-- <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div> -->
        </v-row>
      </v-col>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null" style="margin-right:-75px" >
          <Socket v-socket:output="output" type="output" :socket="output.socket" :style="`background:${!node.data.passout ? status.color : '#FF5252'}!important;${!showWorker && 'margin-left:-75px'}`"></Socket>
          <v-chip v-if="node.data.passout" :class="hoverSocket == output.key && 'px-10 mr-16'" class="px-4 IOPassout" color="error" link>
            <template slot:close v-if="hoverSocket == output.key">
              out
              <v-tooltip bottom right transition="none">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="tooltip" class="ml-2 text-h6" x-small fixed icon @click="(node.data.passout = false), changeAction()"> x </v-btn>
                </template>
                remove
              </v-tooltip>
            </template>
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <LOD :lod="LODTYPE.MEDIUM" v-if="showLabel">
      <div class="title">
        <RULE :rule="rules.EDIT" :doc="task" :returnCondition="true">
          <div slot-scope="allow" v-if="allow.value">
            <v-text-field ref="nodetitle" v-if="editingTitle" color="primary" single-line class="nodetitle mx-auto d-block" style="width: 250px; margin-top: -5px" autofocus v-model="title" :key="node.id" dense hide-details="true" @keydown.enter="changeName()" @keydown.escape="cancelChangeName()" @blur="changeName()" @click.prevent="" />
            <span v-else @click.stop="editingTitle = true"> {{ task.title }} {{ '| ' + info }}</span>
          </div>
          <div v-else>
            <span> {{ task.title }} {{ '| ' + info }}</span>
          </div>
        </RULE>
      </div>
    </LOD>
  </div>
</template>

<script>
import ExternalInput from '../ExternalInput.vue';

import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import { memberRepository } from '../../../../store/modules/user/profileRepository';
import VueRenderPlugin from 'rete-vue-render-plugin';
import store from '../../../../store';
import LODTYPES from '../../../../enums/LOD';
import LOD from '../../../navigation/Lod.vue';
import RULE from '../../../navigation/Rule.vue';
import RULES from '../../../../enums/rules';
import _ from 'lodash';
import { taskModel } from '../../../../store/models/TaskModel';

export default {
  components: { ExternalInput, LOD, RULE },
  name: 'NoteNode_Default',
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
      return store.getters['user/authenticated'];
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
      return !this.analysing ? this.task.progress + '%' : this.analisis.text;
    },
    LODTYPE() {
      return LODTYPES;
    },
    lod() {
      return store.state.taskbox.LOD || LODTYPES.HIGH;
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
    showLabel() {
      if (!store.state.app.displaySettings) return false;
      return store.state.app.displaySettings[1].value;
    },
    rules() {
      return RULES;
    },
  },
  methods: {
    update() {
      this.refreshkey++;
    },
    removeExternalinput(id) {
      store.commit('task/REMOVE_EXTERNAL_VALUE', { task: this.task, inputId: id });
    },
    hasExternalInputs() {
      return this.externalInputs ? true : false;
    },
    // IO data
    getExternalConnectionData() {
      return null;
    },
    async getWorker() {
      this.worker = await memberRepository.find(this.task.workers[0]);
    },

    ishoverSocket(key) {
      this.hoverSocket = key;
    },
    //for setting the task done at once
    changeName() {
      let copy = _.cloneDeep(this.task);
      copy.title = this.updatedValue;
      if (this.updatedTitle == '') return;
      store.dispatch('taskbox/UPDATE_TASK', copy)
            .then(() => { })
            .catch((error) => console.log(error))
      this.editingTitle = false;
      this.node.update();
      // this.changeAction();
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
.notepreview {
  position: absolute;
  pointer-events: none;
  top: 50px;
  display: -webkit-box;
  max-width: 180px;
  max-height: 175px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
}
</style>
