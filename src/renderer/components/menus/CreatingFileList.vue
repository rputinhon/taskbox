<template>
  <v-menu class="pa-0 ma-0" offset-x ref="createmenu" nudge-top="40%" :close-on-content-click="false">
    <template v-slot:activator="{ on: onMenu }">
      <v-btn rounded color="primary" small v-on="{ ...onMenu }" style="z-index: 1"> Create File </v-btn>
    </template>
    <v-card class="pa-0 ma-0">
      <v-list v-for="(item, i) in list" :key="i" class="my-0 py-0" v-show="item.active">
        <v-list-item link @click="createFile(item)">
          <v-list-item-icon class="mx-1 my-auto">
            <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path  :d="item.info.icon" fill="#0067fb" stop-color="#000000" style="paint-order: fill markers stroke" />
            </svg>
          </v-list-item-icon>
          <v-list-item-title>
            {{ item.info.category }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
// import { ipcRenderer } from 'electron';
import { typeInfo } from '../../fixtures/fileTypes';
export default {
  name: 'DropDownList',
  //   props: { list: {} },
  data() {
    return {
      list: {},
      creatingType: null,
    };
  },
  created() {
    this.list = typeInfo;
    // console.log(this.list);
  },
  methods: {
    createFile(type) {
      this.$listeners.create(type);
      this.creatingType = null;
      this.$refs.createmenu.isActive = false;
    },
  },
};
</script>
