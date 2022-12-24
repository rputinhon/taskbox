<template>
  <v-card hover draggable="true"  ref="file"  @dragstart.stop="drag($event, $el, file)">
    <v-list-item class="mx-0 mt-1">
      <v-list-item-icon class="mx-3 my-auto ml-0">
        <svg :id="`fileIcon_${id}`" width="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path :d="fileIcon || defaultIcon" fill="grey" />
        </svg>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-left" style="cursor: pointer">
          {{ file.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-left text-caption"> {{ file.size }} kb </v-list-item-subtitle>
        <v-menu rounded="0" right offset-x light nudge-right="15" :close-on-content-click="false">
          <template v-slot:activator="{ on: menu }">
            <v-btn icon v-on="{ ...menu }" fab x-small absolute right>
              <svg width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="grey" />
              </svg>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="400">
            <v-list>
              <v-list-item link @click="deleteFile(file)">
                <v-list-item-title class="text-center" v-text="'Delete'"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { ipcRenderer } from 'electron';
import { getFileType } from '../../fixtures/fileTypes';
const path = require('path');

export default {
  name: 'FileItem',
  props: { file: {}, folder: String,id:Number },
  data() {
    return {
      defaultIcon:
        'm 36.497647,28.338259 -0.01608,2.51722 -4.198048,-0.04825 0.008,1.986432 3.401866,0.04825 -0.01608,2.517221 -3.377739,-0.04021 0.008,1.889926 4.190005,0.0563 -0.01608,2.51722 -6.779606,0.04825 0.04021,-11.54061 z m -14.106082,-0.04021 2.613727,-0.128676 -0.04021,9.127939 h 3.948739 l -0.04021,2.533304 -6.321199,-0.08846 z m -0.707717,11.403891 -2.613727,0.128676 0.04021,-11.54061 2.533305,0.02413 z m -3.385782,-11.36368 -0.01608,2.51722 -4.198048,-0.04825 0.008,1.986432 3.401866,0.04825 -0.01608,2.517221 -3.377739,-0.04021 0.01608,4.463442 -2.613727,0.04825 0.04021,-11.54061 z M 11.490234,12.183594 c -5.1243793,0 -9.3066402,4.182261 -9.3066402,9.30664 v 25.019532 c 0,5.124379 4.1822609,9.30664 9.3066402,9.30664 h 25.019532 c 5.124379,0 9.30664,-4.182261 9.30664,-9.30664 V 21.490234 c 0,-5.124379 -4.182261,-9.30664 -9.30664,-9.30664 z m 0,3.601562 h 25.019532 c 3.191366,0 5.705078,2.513712 5.705078,5.705078 v 25.019532 c 0,3.191366 -2.513712,5.705078 -5.705078,5.705078 H 11.490234 c -3.1913657,0 -5.7050778,-2.513712 -5.7050778,-5.705078 V 21.490234 c 0,-3.191366 2.5137121,-5.705078 5.7050778,-5.705078 z',
    };
  },
  created() {},
  watch: {},
  computed: {
    fileIcon() {
      let extension = path.extname(this.file.name);
      return getFileType(extension).info.icon;
    },
  },
  methods: {
    drag(e, el, item) {
      let dt = e.dataTransfer;
      if (e.ctrlKey) dt.effectAllowed = 'copy';
      else dt.effectAllowed = 'move';
      dt.setData('name', item.name);
      dt.setData('path', item.path);
      dt.setData('extension', item.extension);
      let icon = document.getElementById(`fileIcon_${this.id}`);
      dt.setDragImage(icon, 0, 0);
    },
    deleteFile(file) {
      ipcRenderer.invoke('app:deleteFile', file.path);
      this.$store.dispatch('taskbox/GET_FILE_LIST');
    },
  },
};
</script>
