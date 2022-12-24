<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${status.color}!important`"></Socket>
          <external-input :index="0" :externalInput="externalInputs" @remove="removeExternalinput"  />
        </div>
      </v-col>
      <v-col align-self="center" cols="10" v-if="node.data">
        <svg :id="`id:${node.id}`" :name="node.name" class="categoryIcon v-shake" width="230" height="250" version="1.1" viewBox="-3 3 55 68" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
            <linearGradient :id="node.id" x1="-4.3" x2="57" y1="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop :stop-color="color" offset="0" />
              <stop :stop-color="color" :offset="value / 100 || 0" />
              <stop stop-color="transparent" :offset="value / 100 || 0" />
              <stop stop-color="transparent" offset="1" />
            </linearGradient>
          </defs>
          <g stroke-linecap="round" stroke-linejoin="round">
            <rect x="-4.3" y="3.7" width="57" height="60" ry="13" :fill="`url(#${node.id})`" />
            <path
              class="darken"
              d="M 7.7946617,2.9960287 C 0.88569846,2.7946694 -5.1705975,9.2329874 -4.6410156,16.107047 c 0.010729,12.366452 -0.021478,24.733444 0.016162,37.099556 0.1598873,6.744141 6.5697011,12.366987 13.2636925,11.797368 10.7356061,-0.01065 21.4717521,0.02139 32.2070191,-0.01617 6.744685,-0.160366 12.365633,-6.572137 11.796264,-13.2659 -0.01071,-12.310207 0.01952,-24.620718 -0.01729,-36.930686 C 52.464846,8.0473303 46.054261,2.4264891 39.361133,2.9960287 c -10.522156,0 -21.044314,0 -31.5664713,0 z m 0,1.7011067 c 11.1707033,0.035645 22.3458833,-0.071978 33.5137323,0.055055 5.666239,0.4149999 10.148567,5.9044776 9.632623,11.5236926 -0.04333,7.886034 0.08856,15.778226 -0.06943,23.660239 -0.484835,5.689626 -6.060155,10.059581 -11.679262,9.495584 -10.833032,-0.03557 -21.670533,0.07187 -32.5007126,-0.05503 -5.675875,-0.410262 -10.150317,-5.902935 -9.6326301,-11.523846 0.034859,-7.840914 -0.070912,-15.686229 0.055067,-23.524295 C -2.4491836,8.9658794 2.4151635,4.5854744 7.7946617,4.6971354 Z M -2.9410157,44.975847 c 2.40402212,4.293713 7.4343868,6.57304 12.2551958,6.156962 10.6161969,-0.02671 21.2352099,0.0538 31.8496219,-0.04095 4.002854,-0.271558 7.775317,-2.642681 9.777215,-6.116015 -0.109299,3.427308 0.278845,6.899298 -0.335949,10.284441 -1.178791,5.113325 -6.43611,8.560036 -11.581577,8.042578 -10.776788,-0.03559 -21.55805,0.07191 -32.3319825,-0.05507 -5.6669189,-0.41544 -10.1482906,-5.90644 -9.6325242,-11.525888 0,-2.248686 0,-4.497371 0,-6.746058 z"
              :fill="status.color"
            />
            <path class="multiply" v-show="status.value > 1 && analysing == false" v-if="!node.data.thumbnail ? true : showMiniature ? false : true" transform="scale(0.6) translate(18 22)" :d="'m 31.034874,15.137637 c -0.0049,0.0048 -0.0098,0.0097 -0.01465,0.01465 L 20.900611,25.336953 17.618305,22.176565 c -1.987828,-1.914417 -5.195617,-1.855609 -7.110442,0.131827 -1.915925,1.988085 -1.8558089,5.197114 0.133119,7.112164 v 0.0018 l 6.850235,6.59429 c 1.966704,1.893059 5.130922,1.858094 7.055299,-0.07798 L 38.155224,22.245063 c 1.945675,-1.958067 1.935428,-5.16841 -0.02283,-7.113888 -0.02162,-0.02122 -0.04388,-0.04177 -0.06678,-0.06161 -2.161629,-1.733795 -5.217792,-1.648588 -7.030742,0.06807 z'" style="pointer-events: none" color="#000000" fill="grey" />
          </g>
          <g v-show="!taskDone || analysing !== false">
            <text x="23.804688" y="23.9303" fill="#000000" font-family="sans-serif" font-size="16px" style="line-height: 1.25; pointer-events: none" xml:space="preserve">
              <tspan x="42" y="17" class="multiply" fill="#757575" font-family="Arial" font-size="10px" font-weight="700" text-align="center" text-anchor="middle">{{ taskCount }}</tspan>
            </text>
          </g>
        </svg>
        <v-progress-circular v-if="loading" fixed style="position: absolute; margin-top: 56px; margin-left: -151px" indeterminate :color="status.color" size="70" />
        <LOD :lod="LODTYPE.MEDIUM">
          <v-card v-if="showMiniature && node.data.thumbnail" flat color="transparent" style="pointer-events: none; overflow: hidden; border-radius: 40px; top: 19px; left: 8px; position: absolute; opacity: 0.8" width="230" height="190">
            <v-img width="200" height="166" style="pointer-events: none" :src="node.data.thumbnail" />
          </v-card>
        </LOD>
      </v-col>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:output="output" type="output" :socket="output.socket" :style="`background:${status.color}!important;`"></Socket>
          <v-chip v-if="node.data && node.data.passout" :class="hoverSocket == output.key && 'px-10 mr-16'" class="px-4 IOPassout" color="error" link>
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
            <span> {{ node.data.title }} {{ '| ' + info }}</span>
          </div>
        </RULE>
      </div>
    </LOD>
  </div>
</template>

<script>
import VueRenderPlugin from 'rete-vue-render-plugin';
import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import store from '../../../../store';
import LODTYPES from '../../../../enums/LOD';
import LOD from '../../../navigation/Lod.vue';
import RULE from '../../../navigation/Rule.vue';
import RULES from '../../../../enums/rules';
import ExternalInput from '../ExternalInput.vue';
import _ from 'lodash';
import { taskModel } from '../../../../store/models/TaskModel';

export default {
  components: { ExternalInput, LOD, RULE },
  name: 'TaskBoxNode_Default',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      defaultTitle: 'TaskBoxName',
      editingTitle: false,
      hoverSocket: null,
      worker: null,
      externalInputs: null,
      updatedTitle: null,
      refreshkey: 0,
      loading: false,
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
    taskCount() {
      this.refreshkey;
      if(!store.state.taskbox.root || !store.state.taskbox.root.taskboxes[this.node.id])return 0;
      return Object.keys(store.state.taskbox.root.taskboxes[this.node.id].data.nodes).length;
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
    LODTYPE() {
      return LODTYPES;
    },
    lod() {
      return store.state.taskbox.LOD || LODTYPES.HIGH;
    },
    taskDone() {
      this.refreshkey;
      return this.status.value == taskstate.DONE.value ? true : false;
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
        return this.task.title;
      },
      set(value) {
        this.updatedTitle = value;
      },
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
  },
  methods: {
    update() {
      this.refreshkey++;
    },
    removeExternalinput() {
      store.commit('task/REMOVE_EXTERNAL_VALUE', { task: this.task });
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
        .then(() => {})
        .catch((error) => console.log(error));
      this.editingTitle = false;
    },
    setLOD(value) {
      this.lod = value;
    },
    getStatusType(value) {
      return getStatusTypeByValue(value || this.status);
    },
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
  },
};
</script>
