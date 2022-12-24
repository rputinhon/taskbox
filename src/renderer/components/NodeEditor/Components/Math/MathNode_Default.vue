<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" :hidden="ishidden(input)" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${input.socket.color}!important`"></Socket>
          <v-chip v-if="hasExternalInput(input.key) || hasExposedInput(input).exposed" link class="nodeIO" :class="!isDataFlowing(input) && 'nodeIOdisabled'" :color="getSocketColor(input)" > 
            <template slot:apend>
              <v-tooltip top transition="none" v-if="hoverSocket == input.key">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="tooltip" class="text-h6 mr-1" x-small icon @click="removeExternalInput(input.key)"> x </v-btn>
                </template>
                remove
              </v-tooltip>
            </template>
              <v-tooltip top transition="none">
                <template v-slot:activator="{ on: tooltip }">
                  <span v-if="hasExposedInput(input).exposed" v-on="tooltip">
                    {{ hasExposedInput(input).exposed[0].data.title }}
                  </span>
                  <span v-else-if="hasExternalInput(input.key)" v-on="tooltip">
                    {{ getExternalConnectionData(input.key).name }}
                  </span>
                </template>
                <span v-text="isDataFlowing(input)?getExternalConnectionData(input.key).flowingData.value:'not flowing'"/>
              </v-tooltip>
          </v-chip>
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg class="categoryIcon" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <defs>
              <linearGradient :id="node.id" x2="48" y1="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop :stop-color="status().color" offset="0"/>
              <stop :stop-color="status().color" :offset="(node.data.task.progress/100) || 0"/>
              <stop :stop-color="unstartedColor()" :offset="(node.data.task.progress/100) || 0"/>
              <stop :stop-color="unstartedColor()" offset="1"/>
              </linearGradient>
            </defs>
            <rect x="4" y="1" width="40" height="45" ry="8.5" :fill="node.data.taskable?`url(#${node.id})`:status().color" />
          </svg>
          <span v-if="node.data.taskable" class="statusInfo">
              {{status().value>0 ? `${status().text} |  ${node.data.task.progress} %`:status().text}}
          </span>
          <div  class="nodeMenu">
            <v-menu rounded="0" right offset-x light nudge-top="12" nudge-right="15" ref="optionsMenu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn tile icon class="mx-1" v-bind="attrs" v-on="on">
                  <svg version="1.1" width="90" height="90" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path  :d="getIcon()" :fill="node.meta.color" />
                    <path d="m43.026 35.523-3.7033 6.4142-3.7033-6.4142h3.7033z" fill="#fafafa" />
                  </svg>
                </v-btn>
              </template>
              <v-card class="pa-1" :max-width="8 * 48.3">
                <v-list-item-group v-model="node.data.selected" active-class="border" color="indigo" style="overflow-y: auto; max-height: 700px" mandatory @change="changeAction(), changeOption()">
                  <table class="table" style="display: flex; flex-wrap: wrap">
                    <tr v-for="(item, i) in node.meta.options" :key="i" class="py-0 my-0">
                      <td class="px-2 ma-0" style="max-width: 50px !important; width: 50px; max-height: 40px !important; border: 1px">
                        <v-tooltip bottom transition="none" nudge-top="10">
                          <template v-slot:activator="{ on: tooltip }">
                            <v-list-item v-on="tooltip" class="ma-0 pa-0">
                              <svg width="40" height="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path :d="getIcon(item.name)" fill="#333" />
                              </svg>
                              <v-menu rounded="0" open-on-hover top offset-y nudge-left="6" light>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn tile icon v-bind="attrs" v-on="on">
                                    <svg width="37" height="37" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                      <path :d="getIcon(item.name)" fill="#333" />
                                    </svg>
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-list-item-group v-if="hasIconVariations(item.name)" v-model="node.data.textype" active-class="border" color="indigo" mandatory @change="changeAction(i)">
                                    <v-list-item class="my-0 py-0 px-1" style="width: 50px !important" v-for="(icon, k) in getIconVariations(item.name)" :key="k" @click="closeMenu($event)">
                                      <svg width="40" height="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path :d="icon" fill="#333" />
                                      </svg>
                                    </v-list-item>
                                  </v-list-item-group>
                                </v-card>
                              </v-menu>
                            </v-list-item>
                          </template>
                          {{ item.name }}
                        </v-tooltip>
                      </td>
                    </tr>
                  </table>
                </v-list-item-group>
              </v-card>
            </v-menu>
          </div>
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
import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import { eventBus } from '../../../../../main';
import { iconTypes } from '../../../../fixtures/iconTypes';
import { NodeView } from '../../../../libs/nodeview';

export default {
  name: 'MathNode_Default',
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
      if(this.einputs[key]!==undefined)
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
      this.editor.trigger('updateexternalinputs');
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
    unstartedColor(){
        return taskstate.UNSTARTED.color;
    },
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
    status() {
        return getStatusTypeByValue(this.node.data.task.status || 0)
    },
    getMember() {
      return this.node.members || null;
    },
    // Actions
    previewContent(item) {
      eventBus.$emit('preview', {node:item,stack:false});
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
    changeAction(selected) {

      this.editingTitle = false;

      if (selected) this.node.data.selected = selected;

      this.node.data.title = this.node.meta.options[this.node.data.selected].name;
      this.node.update();

      this.editor.trigger("process");
      this.editor.trigger('saveTaskBox');
    },
  },
};
</script>
