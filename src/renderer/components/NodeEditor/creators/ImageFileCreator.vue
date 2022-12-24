<template>
  <div>
    <v-card-title class="pl-0">
      <v-list-item-icon class="ma-1">
        <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path :d="type.info.icon" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
        </svg>
      </v-list-item-icon>
      <v-list-item-content class="text-left">
        <v-list-item-title> Creates an empty {{type.info.category}} file </v-list-item-title>
        <v-list-item-subtitle>
          <small> Local: {{ path }} </small>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-card-title>
    <v-card-text class="my-6">
      <v-row class="mb-1">
        <v-text-field outlined required label="name without extension" hide-details="true" v-model="name" dense />
        <v-select dense outlined hide-details="true" style="max-width: 100px" v-model="creatingType" :items="extensions" placeholder="select type">
          <template v-slot:append>
            <svg class="pt-1" style="transform: rotate(0deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
            </svg>
          </template>
        </v-select>
      </v-row>
      <v-row>
        <v-select
          label="template"
          dense
          outlined
          hide-details="true"
          class="mr-2"
          style="max-width: 168px"
          v-model="imageTemplate"
          :items="
            templateList.map((t) => {
              return t.name;
            })
          "
          placeholder="templates"
          @change="applyTemplate()"
        >
          <template v-slot:append>
            <svg class="pt-1" style="transform: rotate(0deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
            </svg>
          </template>
        </v-select>
        <v-text-field class="mr-2" type="number" style="max-width: 80px" outlined required label="width(px)" hide-details="true" v-model="width" dense @change="imageTemplate = null" />
        <v-text-field type="number" style="max-width: 80px" outlined required label="height(px)" hide-details="true" v-model="height" dense @change="imageTemplate = null" />
      </v-row>
      <v-row align="center" justify="center" class="pt-3">
        <v-list-item-subtitle class="mx-0 px-0">
          Background Color
        </v-list-item-subtitle>
        <v-color-picker  width="250px" canvas-height="100px" v-model="backgroundColor" hide-mode-switch  />
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small style="margin-top: 2px" color="grey" @click="$emit('close')"> cancel </v-btn>
      <v-btn :disabled="name == null || name == ''" small style="margin-top: 2px" color="primary" @click="createFile()"> create </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { getExtensionByMime, getMime } from '../../../fixtures/fileTypes';

export default {
  name: 'ImageFileCreator',
  props: { type: {} },
  data() {
    return {
      name: null,
      creatingType: 'png',
      path: '',
      width: 512,
      height: 512,
      backgroundColor: 'rgba(255,255,255,1)',
      extensions: [],
      imageTemplate: 'Square Small',
      templateList: [
        {
          name: 'Square Icon',
          width: '128',
          height: '128',
        },
        {
          name: 'Square Extra Small',
          width: '256',
          height: '256',
        },
        {
          name: 'Square Small',
          width: '512',
          height: '512',
        },
        {
          name: 'Square Mid',
          width: '1024',
          height: '1024',
        },
        {
          name: 'Square Large',
          width: '2048',
          height: '2048',
        },
        {
          name: 'Square 4k',
          width: '4096',
          height: '4096',
        },
        {
          name: 'Square 8k',
          width: '8192',
          height: '8192',
        },
      ],
    };
  },
  async mounted() {
    this.extensions = await this.getExtensions();
    await ipcRenderer.invoke('app:get-Folders').then((folders) => {
      this.path = folders.files;
    });
    this.backgroundColor="rgba(255,255,255,1)"
  },
  methods: {
    applyTemplate() {
      if (!this.imageTemplate) return;
      let template = this.templateList.find((t) => t.name == this.imageTemplate);
      this.width = template.width;
      this.height = template.height;
    },
    async getExtensions() {
      return getExtensionByMime(this.type.info.category + '/*');
    },
    async createFile() {
      let canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      let ctx = canvas.getContext('2d');
      let img = new Image(this.width, this.height);

      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL();
      const data = dataUrl.substring(`data:${getMime(this.creatingType)};base64,`.length);
      let result = await ipcRenderer.invoke('app:createFile', { name: `${this.name}.${this.creatingType}`, data: data, encode: 'base64' });
      this.backgroundColor='';
      this.$listeners.closeAndSave(result);
    },
  },
};
</script>
