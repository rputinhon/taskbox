<template>
  <v-sheet v-if="file">
    <v-card-title>
      <v-app-bar dense fixed elevate-on-scroll absolute color="transparent" class="mx-2 px-2" max-height="45px">
        <v-app-bar-nav-icon>
          <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <!-- <rect x="0" y=".52899" width="47" height="47" ry="8.5" :fill="node.meta.color" /> -->
            <path :d="getIcon(node.name)" :fill="status.color" />
          </svg>
        </v-app-bar-nav-icon>

        <v-text-field class="nodeDialogName" v-if="editingTitle" hide-details="true" dense autofocus single-line v-model="node.data.title" @keydown.enter="save()" @keydown.escape="save()" @blur.stop="save()" @click.prevent=""> </v-text-field>
        <v-card-title style="min-width: 200px" v-else class="pa-0" @click.stop="editingTitle = true">
          {{ node.data.title || node.name }}
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn class="ml-3" small fab icon @click="$emit('closePreview')">
          <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-btn>
      </v-app-bar>
    </v-card-title>
    <v-card-text class="mt-14"> No Preview for {{ node.data.title }} </v-card-text>
  </v-sheet>
</template>

<script>
import { iconTypes } from '../../fixtures/iconTypes';
export default {
  name: 'previewTypeDefault',
  props: { node: {} },
  data() {
    return {
      loading: false,
      editingTitle: false,
    };
  },
  methods: {
    getIcon(name) {
      let iconIndex = 0;
      if (this.node.meta.options) {
        iconIndex = this.node.data.textype;
        name = this.node.meta.options[this.node.data.selected].name;
      }
      return iconTypes[name.toLowerCase()][iconIndex];
    },
    save(){

    }
  },
};
</script>
