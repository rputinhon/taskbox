<template>
  <div>
    <!-- <canvas id="beforeRender"></canvas> -->
    <div v-if="node.data.task" :class="selected()" style="width: 220px; padding-top: 6px">
      <v-row no-gutters style="width: 280px; height: 235px; margin-left: -30px">
        <v-col align-self="center" cols="1">
          
          <div class="input" v-for="input in inputs()" :key="input.key" :hidden="ishidden(input)" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" :style="`background:${input.socket.color}!important`">
            <!-- {{printInput(input)}} -->
          </Socket>
          <!-- v-if="node.data.passout" -->
          <v-chip v-if="hasExternalInput(input.key) || hasExposedInput(input).exposed" :class="hoverSocket == input.key ? 'px-10' : 'pr-10'" :color="hasExposedInput(input).color || einputs[input.key].data.color" link style="color: white; z-index: -100; position: fixed; right: 231px; margin-top: 2px"> 
            <template slot:apend>
              <v-tooltip top transition="none" v-if="hoverSocket == input.key">
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn v-on="tooltip" class="text-h6" x-small  style="margin-left: -8px;" left icon @click="removeExternalInput(input.key)"> x </v-btn>
                </template>
                remove
              </v-tooltip>
            </template>
            <span v-if="hasExposedInput(input).exposed">
              {{hasExposedInput(input).exposed[0].name}}
            </span>
              <v-tooltip  v-else-if="hasExternalInput(input.key)" top transition="none">
                <template v-slot:activator="{ on: tooltip }">
                <span v-on="tooltip" :style="!isDataFlowing(input.key) ? 'text-decoration: line-through;':''">
                {{ einputs[input.key].data.name}}
                </span>
                </template>
                <span v-text="isDataFlowing(input.key)?'flowing':'not flowing'"/>
              </v-tooltip>
          </v-chip>
        </div>
        </v-col>
        <v-col align-self="center" cols="10">
          <v-row align="center" justify="center">
            <svg class="categoryIcon" width="245" height="250" version="1.1" viewBox="0 0 47 55.016" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect x="0" y=".52899" width="47" height="51.5" ry="8.5" :fill="baseColor" />
            </svg>

            <div style="position: absolute; margin-top: -60px;pointer-events:none;">
              <svg width="88" height="88" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y=".52899" width="47" height="47" ry="10" :fill="node.meta.color" />
                <path :d="getIcon(node.name)" fill="#fafafa" />
              </svg>
            </div>
            <div style="pointer-events:none;position: absolute; left: 25px; bottom: 35px; width: 220px; max-width: 180px" class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
          </v-row>
        </v-col>
        <v-col align-self="center" cols="1">
          <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null">
            <Socket v-socket:output="output" type="output" :socket="output.socket" :style="`background:${!node.data.passout ? output.socket.color : '#FF5252'}!important`"></Socket>
            <v-chip v-if="node.data.passout" :class="hoverSocket == output.key && 'px-10 mr-16'" class="px-4" color="red" link style="color: white; z-index: -100; position: absolute; margin-left: -16px; margin-top: 2px">
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
      <div>
        <v-list-item v-if="getMember()">
          <v-btn right absolute fab small elevation="0" v-if="havePermissionTo('editStatus')">
            <v-avatar size="40px">
              <img alt="user" src="fotoperfil.jpg" />
            </v-avatar>
          </v-btn>
        </v-list-item>
      </div>
    </div>
    <div class="title">
      <v-text-field v-if="editingTitle && havePermissionTo('editTitle')" color="primary" single-line class="nodetitle mx-auto d-block" style="width: 250px; margin-top: -5px" autofocus v-model="node.data.title" :key="node.id" dense hide-details="true" @keydown.enter="changeAction()" @keydown.escape="changeAction()" @blur="changeAction()" @click.prevent="" />
      <span v-else @click.stop="editingTitle = true">
        {{ node.data.title || defaultTitle }}
      </span>
    </div>
    <!-- <canvas id="afterRender"></canvas> -->
  </div>
</template>

<script>
import VueRenderPlugin from 'rete-vue-render-plugin';
import { eventBus } from '../../../../../main';
import taskstate from '../../../../enums/taskstate';
import { ipcRenderer } from 'electron';
import { iconTypes } from '../../../../fixtures/iconTypes';
export default {
  name: 'IconWithValueNode_Default',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      defaultTitle: this.node.name,
      dragging: false,
      editingTitle: false,
      hoverSocket: null,
      einputs:{'a':undefined,'b':undefined}
    };
  },
  computed: {
    taskCompleted() {
      // if (!this.node.data.task) return;
      return this.node.data.task.progress == 100 ? true : false;
    },
    baseColor() {
      if (!this.statusType()) return taskstate.UNDONE.color;
      return this.statusType().color;
    },
  },
  methods: {
   isDataFlowing(key){
      return this.einputs[key]?
      this.einputs[key].data.flowingData.flowing &&
      this.einputs[key].data.flowingData.parentflowing?true:false:false
    },
    updateExternalInput(inputData,key){
       this.einputs[key]=inputData;
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
    hasExposedInput(input) {
      this.hasConnections(input)
      if(input.connections.length==0)return false;
      return (input.connections[0].data && input.connections[0].data) || false;
    },
    hasExternalInput(key) {
      
      if(this.einputs[key])
        return this.einputs[key];
      else
        return false;
    },
     removeExternalInput(key) {
      if(this.einputs[key]){
      let exposed = this.einputs[key].data.exposedTo;
        if(exposed[this.node.id].length>0)
        {
            let index = exposed[this.node.id].indexOf(key);
            exposed[this.node.id].splice(index,1);
            this.einputs[key]=undefined;
          
          if(exposed[this.node.id].length==0)
          delete exposed[this.node.id];
        }

      }
      else{
        let connection = this.node.getConnections().filter(c => c.input.key == key)[0];
        if(connection)
        this.editor.removeConnection(connection);
      }
        this.editor.trigger('process')
        eventBus.$emit('updateExternalConnection');
        this.changeAction();
    },
    previewContent(item) {
      eventBus.$emit('preview', {node:item,stack:true});
    },
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
    changeOption() {
      if (this.oneInput() || this.oneInput(this.lastOperation)) {
        this.removeConnections();
        this.lastOperation = this.node.data.selected;
      }
    },
    getIcon(name) {
      return iconTypes[name.toLowerCase()];
    },
    oneInput(value) {
      return this.node.meta.options[value || this.node.data.selected].oneinput;
    },
    ishidden(i) {
      // // console.logi);
      let value = i.key == 'b' && this.oneInput() ? true : false;
      return value;
    },
    removeConnections() {
      let connections = this.node.getConnections();
      connections.forEach((conn) => {
        this.editor.removeConnection(conn);
      });

      this.inputs().forEach((inp) => {
        this.removeExternalInput(inp.key);
      });
    },
    statusType() {
      let type = Object.entries(taskstate).find((s) => s[1].value === this.node.data.task.status);
      return type ? type[1] : taskstate['UNDONE'];
    },
    getMember() {
      return this.node.members || null;
    },
    //for setting the task done at once
    havePermissionTo() {
      //check user.credentials
      return true;
    },
    thickAction() {
      if (this.dragging) {
        this.dragging = false;
        return;
      }
      if (this.taskCompleted == false) {
        this.node.data.task.progress = 100;
        this.node.data.task.status = taskstate.DONE.value;
        let task = {
          title: this.node.data.title || this.defaultTitle,
          subject: this.node.data.task.subject,
          member: 'Rodrigo',
        };
        ipcRenderer.invoke('app:set-taskDone', task).then(() => {});
      } else {
        this.node.data.task.progress = 0;
        this.node.data.task.status = taskstate.UNDONE.value;
      }

      this.changeAction();
    },
    //Update the data direct into the editor then commit to save
    changeAction() {
      let node = this.node;
      node.update();
      this.editingTitle = false;
      eventBus.$emit('saveCurrentTaskbox', node.id);
    },
  },
};
</script>
