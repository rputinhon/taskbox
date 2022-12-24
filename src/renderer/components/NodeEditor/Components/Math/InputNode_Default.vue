<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1"> </v-col>
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
            <text x="0" y="0" fill="#9955ff" font-family="sans-serif" font-size="10.396px" stroke-width=".25991" style="line-height: 1.25" xml:space="preserve">
              <tspan x="23.5" y="30" fill="#333" font-family="sans-serif" font-size="4px" text-align="center" text-anchor="middle" style="pointer-events:none; line-height: 1.5" xml:space="preserve">
                {{ numberTypesList[node.data.numberType].name }}
              </tspan>
            </text>
          </svg>
          <span v-if="node.data.taskable" class="statusInfo">
              {{status().value>0 ? `${status().text} |  ${node.data.task.progress} %`:status().text}}
          </span>
 
          <div style="position: absolute; margin-top: -70px">
            <v-menu rounded="0" right offset-x light nudge-top="12" nudge-right="15">
              <template v-slot:activator="{ on, attrs }">
                <v-btn tile icon class="mx-1" v-bind="attrs" v-on="on">
                  <svg width="88" height="88" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g v-html="numberTypesList[node.data.numberType].icon" />
                    <path :d="numberTypesList[node.data.numberType].icon" :fill="node.meta.color"/>
                    <path d="m43.026 35.523-3.7033 6.4142-3.7033-6.4142h3.7033z" fill="#fafafa" />
                  </svg>
                </v-btn>
              </template>
              <v-card class="mx-auto" max-width="400">
                <v-list-item-group v-model="node.data.numberType" active-class="border" color="indigo" mandatory @change="changeAction()">
                  <v-list-item v-for="(item, i) in numberTypesList" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card>
            </v-menu>
          </div>
        </v-row>
      </v-col>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null" >
          <Socket v-socket:output="output" type="output" :socket="output.socket"  :style="`background:${!node.data.passout ? output.socket.color : '#FF5252'}!important`"></Socket>
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
    <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
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
// import i18n from 'i18n'; // function to translate text
import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';


export default {
  name: 'inputNode_Default',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      defaultTitle: 'Number',
      hovering: false,
      editingTitle: false,
      hoverSocket: null,
      numberTypesList: [
        {
          name: 'variable',
          icon: 'm12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm5.8477 10.412h4.2871v4.2852h2.8555v-4.2852h4.2871v4.2852h2.8574v4.2871h-2.8574v2.8555h2.8574v4.2871h-2.8574v4.2852h-4.2871v-4.2852h-2.8555v4.2852h-4.2871v-4.2852h-2.8574v-4.2871h2.8574v-2.8555h-2.8574v-4.2871h2.8574v-4.2852zm4.2871 8.5723v2.8555h2.8555v-2.8555h-2.8555z'
        },
        {
          name: 'constant',
          icon: 'm12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm5.8477 10.412h4.2871v4.2852h2.8555v-4.2852h4.2871v4.2852h2.8574v4.2871h-2.8574v2.8555h2.8574v4.2871h-2.8574v4.2852h-4.2871v-4.2852h-2.8555v4.2852h-4.2871v-4.2852h-2.8574v-4.2871h2.8574v-2.8555h-2.8574v-4.2871h2.8574v-4.2852zm4.2871 8.5723v2.8555h2.8555v-2.8555h-2.8555z'
        },
      ],
    };
  },
  methods: {
    unstartedColor(){
        return taskstate.UNSTARTED.color;
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
    //for setting the task done at once
    havePermissionTo() {
      //check user.credentials
      return true;
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
