<template>
  <div :class="selected()" class="simpleFlow">
    <v-row no-gutters class="simpleFlowBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key"  @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${input.socket.color}!important`"></Socket>
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg class="categoryIcon" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="7" y="4" width="35" height="37" ry="8.5" :fill="baseColor" />
          </svg>
        </v-row>
      </v-col>
      <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null">
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
import taskstate from '../../../../enums/taskstate';
import { eventBus } from '../../../../../main';
import { iconTypes } from '../../../../fixtures/iconTypes';
import { NodeView } from '../../../../libs/nodeview';

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
      einputs:{'a':undefined,'b':undefined}
    };
  },
  created() {
    this.lastOperation = this.node.data.selected;
  },
  computed: {
    baseColor() {
      if (!this.statusType()) return taskstate.UNDONE.color;
      return this.statusType().color;
    },
  },
  methods: {
    // IO data
    isDataFlowing(input){
      return (this.einputs[input.key] &&
      this.einputs[input.key].flowingData.flowing &&
      this.einputs[input.key].flowingData.parentflowing) || 
      (this.hasExposedInput(input) &&
      this.hasExposedInput(input).flowingData.flowing &&
      this.hasExposedInput(input).flowingData.parentflowing) ? true : false;
    },
    updateExternalInput(inputData,key){
      if(this.einputs[key] && this.einputs[key] == inputData) return;
      this.einputs[key]=inputData;
    },
    getExternalConnectionData(key){
      let datanode = this.einputs[key].flowingData.connections.find(c=>c.node==this.node.id && c.key==key).data
      if(datanode!==undefined){
        let data = NodeView.filterInputData(this.einputs[key].nodes.find(n=>n.id==datanode))
        data.color = this.einputs[key].color;
        return data;
      }
      else
      return this.einputs[key];
    },
    hasConnections(input){
      if(input.connections.length>0){
        if(this.hasExternalInput(input.key))
          this.removeExternalInput(input.key)
          return true
      }
      else
      return false;
    },
    // input from inside a taskbox in the same view
    hasExposedInput(input) {
      this.hasConnections(input)
      if(input.connections.length==0)return false;
      return input.connections[0].data || false;
    },
    // input from external taskbox (exposed to out)
    hasExternalInput(key) {
      if(this.einputs[key])
        return this.einputs[key];
      else
        return false;
    },
    // remove external input
    removeExternalInput(key) {
      if(this.einputs[key]){
      let exposed = this.einputs[key].flowingData;
      let conn= exposed.connections && exposed.connections.find(c=>c.node==this.node.id && c.key ==key);
        if(conn)
        {
            let index=exposed.connections.indexOf(conn);
            exposed.connections.splice(index,1);
            this.einputs[key]=undefined;
        }
        this.changeAction();
      }
      else{
        let connection = this.node.getConnections().filter(c => c.input.key == key)[0];
        if(connection)
        this.editor.removeConnection(connection);
        this.editor.trigger('process')
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
    getSocketColor(input){
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
    ishoverSocket(key) {
      this.hoverSocket = key;
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

      this.editor.trigger("process");
      this.editor.trigger('saveTaskBox');
    },
  },
};
</script>
