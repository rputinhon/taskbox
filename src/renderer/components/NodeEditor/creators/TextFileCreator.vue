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
      <v-row>
        <v-text-field outlined required label="name without extension" hide-details="true" v-model="name" dense />
        <v-select dense outlined hide-details="true" style="max-width: 100px" v-model="creatingType" :items="extensions" placeholder="select type">
          <template v-slot:append>
            <svg class="pt-1" style="transform: rotate(0deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
            </svg>
          </template>
        </v-select>
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
import { getExtensionByMime } from '../../../fixtures/fileTypes';
export default {
  name: 'TextFileCreator',
  props: { type: {} },
  data() {
    return {
      name: null,
      creatingType: 'txt',
      path: '',
      extensions: [],
    };
  },
  async mounted() {
    this.extensions = await this.getExtensions();
    await ipcRenderer.invoke('app:get-Folders').then((folders) => {
      this.path = folders.files;
    });
    // console.log(this.extensions);
  },
  methods: {
    async getExtensions() {
      return getExtensionByMime(this.type.info.category + '/' + this.type.variants[0]);
    },
    async createFile() {
      let result = await ipcRenderer.invoke('app:createFile', { name: `${this.name}.${this.creatingType}`, data: '' });
      this.$listeners.closeAndSave(result);
    },
  },
};
</script>
