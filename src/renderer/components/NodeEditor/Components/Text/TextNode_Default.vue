<template>
  <div :class="selected()" class="nodeBase">
    <v-row no-gutters class="nodeBody">
      <v-col align-self="center" cols="1"> </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg class="categoryIcon" width="245" height="250" version="1.1" viewBox="0 0 47 55.016" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient :id="node.id" x2="48" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop :stop-color="status().color" offset="0" />
                <stop :stop-color="status().color" :offset="node.data.task.progress / 100 || 0" />
                <stop :stop-color="unstartedColor()" :offset="node.data.task.progress / 100 || 0" />
                <stop :stop-color="unstartedColor()" offset="1" />
              </linearGradient>
            </defs>
            <rect x="0" y=".52899" width="47" height="51.5" ry="8.5" :fill="node.data.taskable ? `url(#${node.id})` : status().color" />
          </svg>
          <span v-if="node.data.taskable" class="statusInfo">
            {{ status().value > 0 ? `${status().text} |  ${node.data.task.progress} %` : status().text }}
          </span>
          <div style="position: absolute;">
            <svg width="88" height="88" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g v-if="node.meta" v-html="node.meta.typeicon"></g>
            </svg>
          </div>
          <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
        </v-row>
      </v-col>
      <v-col align-self="center" cols="1">
        <div v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null">
          <v-tooltip bottom right transition="none" v-if="node.data.taskable && worker">
            <template v-slot:activator="{ on: tooltip }">
              <v-menu rounded="0" right offset-x light nudge-top="12" nudge-right="15">
                <template v-slot:activator="{ on: menu }">
                  <v-btn v-on="{ ...tooltip, ...menu }" fab elevation="0" absolute color="primary" style="position: absolute; margin-left: -58px; margin-top: -10px">
                    <v-avatar color="grey" size="48">
                      <v-img v-if="worker && worker.profilePicture" :src="`data:image/png;base64,${worker.profilePicture}`" />
                      <svg version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                        <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                      </svg>
                    </v-avatar>
                  </v-btn>
                </template>
                <v-card class="mx-auto" max-width="400">
                  <v-list-item-group @change="changeAction()">
                    <v-list-item>
                      <v-list-item-title>Change Worker</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Set Open Task</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="toggleTaskable()">
                      <v-list-item-title>Not a Task</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-card>
              </v-menu>
            </template>
            {{ worker.username }}
          </v-tooltip>
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

import taskstate, { getStatusTypeByValue } from '../../../../enums/taskstate';
import { taskManager } from '../../../../libs/taskmanager';
import { memberRepository } from '../../../../store/modules/user/profileRepository';

export default {
  name: 'TextNode_Default',
  extends: VueRenderPlugin.Node,
  data() {
    return {
      defaultTitle: 'TextName',
      editingTitle: false,
      hovering: false,
      extension: null,
      hoverSocket: null,
      worker: null,
    };
  },
  async mounted() {
    await this.getWorker();
  },
  computed: {
    fileType() {
      return null;
    },
    taskCompleted() {
      if (!this.node.data.task) return;
      return this.node.data.task.status == taskstate.DONE.value ? true : false;
    },
  },
  methods: {
    toggleTaskable() {
      taskManager.setTaskable(this.node, false);
    },
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
    unstartedColor() {
      return taskstate.UNSTARTED.color;
    },
    status() {
      return getStatusTypeByValue(this.node.data.task.status || 0);
    },
    async getWorker() {
      this.worker = await profileRepository.find(this.node.data.task.workers[0]);
    },
    //for setting the task done at once
    havePermissionTo() {
      //check user.credentials
      return true;
    },
    thickAction() {
      if (this.taskCompleted == false) {
        this.node.data.task.progress = 100;
        this.node.data.task.status = taskstate.DONE.value;
      } else {
        this.node.data.task.progress = 0;
        this.node.data.task.status = taskstate.UNDONE.value;
      }

      this.changeAction();
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

<style scoped>
.output {
  left: 50px !important;
}
</style>
