<template>
  <div :class="selected()" class="flowReview">
    <v-row no-gutters class="flowReviewBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" @mouseenter="ishoverSocket(input)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${input.socket.color}!important`"></Socket>
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg class="categoryIcon" version="1.1" viewBox="0 0 100 37" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="7" y="1" width="85" height="35" ry="18" :fill="baseColor" />
          </svg>
        </v-row>
      </v-col>
      <div class="control" style="margin-left: 40px; top: 20px !important">
        <v-avatar style="margin-left: -60px" size="80" color="grey">
          <svg width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
          </svg>
        </v-avatar>
        <v-tooltip top transition="none">
          <template v-slot:activator="{ on }">
            <v-btn absolute fab icon large class="ml-3 mt-2" v-on="on" @click="toggleFlow()">
              <svg width="50" height="50" version="1.1" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <path transform="scale(.2) translate(0 5)" v-if="node.data.flowingData.flowing" d="M 34.029804,13.351153 20.633798,26.916629 14.309317,20.634998 c -1.188924,-1.178741 -3.039198,-1.09663 -4.134161,0.183464 -1.096172,1.280866 -1.021085,3.276894 0.167703,4.457929 l 8.326768,8.269629 c 1.129295,1.121371 2.870695,1.111808 3.989328,-0.02192 L 38.039461,17.948739 c 1.177738,-1.192641 1.235746,-3.188191 0.129596,-4.457932 -1.458367,-1.336732 -2.745759,-0.995892 -4.139247,-0.139648 z" fill="white" />
                <path transform="scale(.2) translate(0 5)" v-else d="M 22.28125,5.3554688 C 21.395562,5.3239069 20.497766,5.632634 19.794922,6.2871094 18.389234,7.5960601 18.312143,9.7818119 19.621094,11.1875 l 12.912109,13.867188 c 0.874674,0.864499 1.971988,1.687749 3.033203,1.707031 h 8.09961 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.521484 c 0,-1.771858 -1.427361,-3.199219 -3.199218,-3.199219 H 37.152344 L 24.695312,6.4609375 C 24.040837,5.7580935 23.166938,5.3870306 22.28125,5.3554688 Z M 5.1992188,19.923828 C 3.4273614,19.923828 2,21.35119 2,23.123047 V 23.5625 c 0,1.771857 1.4273614,3.199219 3.1992188,3.199219 h 6.4667972 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.439453 c 0,-1.771857 -1.427361,-3.199219 -3.199218,-3.199219 z" fill="grey" stop-color="#000000" style="paint-order: fill markers stroke" />
              </svg>
            </v-btn>
          </template>
          Toggle Flowing
        </v-tooltip>

        <v-menu rounded="0" right offset-x light nudge-top="12" nudge-left="0" :disabled="!inputData()" close-on-content-click>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon fab fixed right x-large v-on="on" v-bind="attrs" @dblclick.stop class="mr-2 px-2 mt-1">
              <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path :d="inputIcon()" :fill="statusType().value > 0 ? 'white' : 'grey'" stop-color="#000000" style="paint-order: fill markers stroke" />
              </svg>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="400">
            <v-list-item>
              <!-- <v-progress-linear absolute height="100%" :buffer-value="inputData().data.task.progress"/> -->
              <v-list-item-content v-if="inputData()">
                <v-list-item-title>
                  {{ inputData().data.title }}
                </v-list-item-title>
                <v-list-item-subtitle> {{ inputStatus().text }} | {{ inputData().data.task.progress }}% </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-btn rounded color="primary" @click.stop="Preview()">Preview</v-btn>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-btn rounded color="warning" @click.stop="ShowReviewDialog()">Review</v-btn>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="statusType().value !==4">
              <v-list-item-content>
                <v-btn rounded color="success" @click="Aproove()">Aproove</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-menu>
      </div>
      <!-- <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div> -->
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output)" @mouseleave="hoverSocket = null">
          <Socket v-socket:output="output" type="output" :socket="output.socket" :style="`background:${!node.data.passout ? output.socket.color : '#FF5252'}!important`"></Socket>
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
    <div class="title">
      <v-text-field v-if="editingTitle && havePermissionTo('editTitle')" color="primary" single-line class="nodetitle mx-auto d-block" style="width: 250px; margin-top: -5px" autofocus v-model="node.data.title" :key="node.id" dense hide-details="true" @keydown.enter="changeAction()" @keydown.escape="changeAction()" @blur="changeAction()" @click.prevent="" />
      <span v-else @click.stop="editingTitle = true">
        {{ node.data.title || defaultTitle }}
      </span>
    </div>
  </div>
</template>

<script>
import VueRenderPlugin from 'rete-vue-render-plugin';
import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import { eventBus } from '../../../../../main';
import { iconTypes } from '../../../../fixtures/iconTypes';
import { NodeView } from '../../../../libs/nodeview';
import { taskManager } from '../../../../libs/taskmanager';

export default {
  name: 'SimpleFlow',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      defaultTitle: this.node.name,
      hovering: false,
      editingTitle: false,
      hoverSocket: null,
      lastOperation: 0,
      einputs: { a: undefined, b: undefined },
    };
  },
  created() {
    this.lastOperation = this.node.data.selected;
    eventBus.$on('CreateReview', (id) => {
      if (id == this.inputData().id) this.CreateReview();
    });
  },
  computed: {
    baseColor() {
      if (!this.statusType()) return taskstate.UNDONE.color;
      return this.statusType().color;
    },
  },
  methods: {
    toggleFlow() {
      this.node.data.flowingData.flowing = !this.node.data.flowingData.flowing;
      NodeView.updateNode(this.node.id);
    },
    Preview() {
      eventBus.$emit('preview', {node:this.inputData(),stack:true});
    },
    Aproove() {
      if (this.node.data.task.status == taskstate.DONE.value) return;
      if (!taskManager.isTaskDone(this.inputData().data.task)) taskManager.setTaskDone(this.inputData().data.task);
      this.inputData().data.taskable = true;
      taskManager.setTaskDone(this.node.data.task);
      this.node.data.flowingData.flowing = true;
    },
    CreateReview() {
      this.inputData().data.taskable = true;
      taskManager.reviewTask(this.inputData().data.task);
      taskManager.reviewTask(this.node.data.task);

    },
    ShowReviewDialog() {
      eventBus.$emit('review', this.inputData());
    },
    inputData() {
      let input = this.inputs()[0].connections;
      return input.length > 0 ? input[0].output.node : null;
    },
    inputIcon() {
      let input = this.inputs()[0].connections;
      if (input.length == 0) return 'm12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm12.762 11.846c0.99181 0.009698 1.9608 0.49714 2.5508 1.3906l2.8477 4.3145h5.4492c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-6.3887c-1.2167 0.27382-2.5239-0.20891-3.2539-1.3145l-3.8164-5.7773c-0.94401-1.4296-0.55262-3.3411 0.87695-4.2852 0.53609-0.354 1.1393-0.51947 1.7344-0.51367zm-13.338 5.7051h4.9238c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-4.9238c-1.7131 0-3.0918-1.3806-3.0918-3.0938 1e-7 -1.7131 1.3787-3.0918 3.0918-3.0918z';
      else return iconTypes[this.inputData().name.toLowerCase()][0];
    },
    statusTypes() {
      return taskstate;
    },
    inputStatus() {
      let input = this.inputs()[0].connections;
      return getStatusTypeByValue(input.length == 0 ? 0 : this.inputData().data.task.status);
    },
    toggleDataFlowing() {
      this.node.data.flowingData.flowing = !this.node.data.flowingData.flowing;
      this.changeAction();
    },
    // IO data
    isDataFlowing(input) {
      return (this.einputs[input.key] && this.einputs[input.key].flowingData.flowing && this.einputs[input.key].flowingData.parentflowing) || (this.hasExposedInput(input) && this.hasExposedInput(input).flowingData.flowing && this.hasExposedInput(input).flowingData.parentflowing) ? true : false;
    },
    updateExternalInput(inputData, key) {
      if (this.einputs[key] && this.einputs[key] == inputData) return;
      this.einputs[key] = inputData;
    },
    getExternalConnectionData(key) {
      let datanode = this.einputs[key].flowingData.connections.find((c) => c.node == this.node.id && c.key == key).data;
      if (datanode !== undefined) {
        let data = NodeView.filterInputData(this.einputs[key].nodes.find((n) => n.id == datanode));
        data.color = this.einputs[key].color;
        return data;
      } else return this.einputs[key];
    },
    hasConnections(input) {
      if (input.connections.length > 0) {
        if (this.hasExternalInput(input.key)) this.removeExternalInput(input.key);
        return true;
      } else return false;
    },
    // input from inside a taskbox in the same view
    hasExposedInput(input) {
      this.hasConnections(input);
      if (input.connections.length == 0) return false;
      return input.connections[0].data || false;
    },
    // input from external taskbox (exposed to out)
    hasExternalInput(key) {
      if (this.einputs[key]) return this.einputs[key];
      else return false;
    },
    // remove external input
    removeExternalInput(key) {
      if (this.einputs[key]) {
        let exposed = this.einputs[key].flowingData;
        let conn = exposed.connections && exposed.connections.find((c) => c.node == this.node.id && c.key == key);
        if (conn) {
          let index = exposed.connections.indexOf(conn);
          exposed.connections.splice(index, 1);
          this.einputs[key] = undefined;
        }
        this.changeAction();
      } else {
        let connection = this.node.getConnections().filter((c) => c.input.key == key)[0];
        if (connection) this.editor.removeConnection(connection);
        this.editor.trigger('process');
      }
      eventBus.$emit('updateExternalConnection');
    },
    // remove in view connection when clicked
    removeConnections() {
      let connections = this.node.getConnections();
      connections.forEach((conn) => {
        this.editor.removeConnection(conn);
      });

      this.inputs().forEach((inp) => {
        this.removeExternalInput(inp.key);
      });
    },
    // if the node has only one input it hides others
    oneInput(value) {
      return this.node.meta.options[value || this.node.data.selected].oneinput;
    },
    ishidden(i) {
      let value = i.key == 'b' && this.oneInput() ? true : false;
      return value;
    },
    // Apearence
    getSocketColor(input) {
      return this.hasExposedInput(input).color || this.getExternalConnectionData(input.key).color;
    },
    hasIconVariations(name) {
      return iconTypes[name].length > 1 ? true : false;
    },
    getIconVariations(name) {
      return iconTypes[name];
    },
    getIcon(name) {
      let _icons = iconTypes[name || this.node.meta.options[this.node.data.selected].name];
      return _icons.length <= 1 ? _icons[0] : _icons[this.node.data.textype];
    },
    ishoverSocket(io) {
      this.hoverSocket = io.key;
    },
    statusType() {
      let type = Object.entries(taskstate).find((s) => s[1].value == this.node.data.task.status);
      return type ? type[1] : taskstate['UNDONE'];
    },
    getMember() {
      return this.node.members || null;
    },
    // Actions
    previewContent(item) {
      eventBus.$emit('preview', {node:item,stack:true});
    },
    changeOption() {
      if (this.oneInput() || this.oneInput(this.lastOperation)) {
        this.removeConnections();
        this.lastOperation = this.node.data.selected;
      }
    },
    //for setting the task done at once
    havePermissionTo() {
      //check user.credentials
      return true;
    },
    closeMenu() {
      this.$refs.optionsMenu.isActive = false;
    },
    //Update the data direct into the editor then commit to save
    changeAction() {
      this.editingTitle = false;

      this.node.update();

      this.editor.trigger('process');
      this.editor.trigger('saveTaskBox');
    },
  },
};
</script>
