<template>
  <v-menu ref="addMenu" top rounded="pill" z-index="1" offset-y light nudge-left="9" nudge-bottom="65">
    <template v-slot:activator="{ on: menu, attrs }">
      <v-btn fab left top absolute elevation="0" color="primary" v-bind="attrs" v-on="menu" x-small class="mt-9 ml-2 windowbar-button" :disabled="disabled">
        <svg width="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="m 22.065319,8.3519448 c -0.704083,0 -1.27124,0.5666409 -1.27124,1.2707236 V 21.058663 H 9.8872518 c -0.7040827,0 -1.2707237,0.567157 -1.2707237,1.27124 v 2.965194 c 0,0.704083 0.566641,1.271239 1.2707237,1.271239 H 20.794079 v 10.906829 c 0,0.704082 0.567157,1.270722 1.27124,1.270722 h 2.965194 c 0.704083,0 1.27124,-0.56664 1.27124,-1.270722 V 26.566336 h 11.435995 c 0.704083,0 1.270722,-0.567156 1.270722,-1.271239 v -2.965194 c 0,-0.704083 -0.566639,-1.27124 -1.270722,-1.27124 H 26.301753 V 9.6226684 c 0,-0.7040827 -0.567157,-1.2707236 -1.27124,-1.2707236 z" :fill="disabled ? 'rgba(0,0,0,0.26)' : 'white'" stop-color="#000000" style="paint-order: fill markers stroke" />
        </svg>
      </v-btn>
    </template>
    <v-card color="background" rounded="pill" max-width="50px" class="py-4 pt-13 mt-9">
      <v-list-item class="px-0 ma-0" v-for="(item, i) in library.blockLibrary.blocktypes" :key="i" @click="addNode($event, { name: item.name })" v-show="item.properties.isactive == true">
        <v-list-item-content class="py-0">
          <svg class="categoryIcon" height="38" version="1.1" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
            <path :d="item.meta.typeicon" fill="grey" />
          </svg>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-list class="my-1 mt-0 pt-0" v-for="(category, c) in getcategoryActive()" :key="c" color="background">
          <v-menu nudge-top="30" offset-x open-on-hover light v-if="c>0">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-badge dot overlap :value="''" color="success" offset-x="6" offset-y="35">
                <v-btn v-on="menu" v-bind="attrs" icon height="32">
                  <svg class="categoryIcon" width="32" height="45" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g v-html="category.svgIcon"></g>
                  </svg>
                </v-btn>
              </v-badge>
            </template>
            <v-card color="background">
              <v-list-item-group v-for="item in getcategoryItems(category.name)" :key="item.name">
                <v-list-item v-if="item.name !== 'TaskBox'" class="py-0" @click="addNode($event, item), closeMenu()">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-img draggable="true" @dragstart="startDrag($event, item), (grabbing = true)" @dragend="grabbing = false" :class="grabbing && 'grabbing'">
                      <svg class="categoryIcon pt-1" width="40" height="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path :d="item.meta.typeicon" :fill="item.meta.color" />
                      </svg>
                    </v-img>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-card>
          </v-menu>
        </v-list> -->
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import { NodeView } from '../../libs/nodeview';
export default {
  name: 'ComponentType',
  props: { disabled: Boolean },
  data: () => ({ grabbing: false }),
  computed: {
    ...mapState({
      myTemplates: (state) => state.templates.myTemplates,
      library: (state) => state.library.library,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
  },
  mounted() {
    // console.log(this.library);
  },
  methods: {
    active(name) {
      return this.library.blockLibrary.blocktypes.filter((b) => b.name === name).active || false;
    },
    getcategoryActive() {
      if (!this.library) return;
      return this.library.categoryLibrary.filter((c) => c.active === true && this.getcategoryItems(c.name).length > 0);
    },
    getcategoryItems(category) {
      return this.library.blockLibrary.blocktypes.filter((b) => b.meta.category === category && b.properties.isactive);
    },
    addNode(evt, item) {
      NodeView.createNodeAndAdd(item.name, evt);
    },
    addTemplate(evt, template) {
      NodeView.addTemplate(template, evt);
    },
    startDrag(evt, item) {
      evt.dataTransfer.dropEffect = 'move';
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('item', item.name);
      evt.dataTransfer.setDragImage(evt.target, 0, 0);
    },
    closeMenu() {
      this.$refs.addMenu.isActive = false;
    },
    getTemplates() {
      this.$store.dispatch('templates/FETCH_ALL');
    },
  },
};
</script>

<style>
.grabbing {
  cursor: grabbing;
}
</style>
