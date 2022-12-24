<template>
  <v-row justify="center" align="center" v-if="preview">
    <v-dialog overlay-opacity=".95" fullscreen height="100vh" style="overflow: hidden !important" v-model="preview" persistent light>
      <v-card min-height="600px" style="overflow: hidden" :dark="dark" :light="!dark">

        <v-btn absolute right top small fab icon @click="$emit('close')" class="mt-8">
          <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-btn>

        <v-sheet v-show="dataReady">
          <v-carousel show-arrows-on-hover hide-delimiters height="100vh" style="border-radius: 8px">
            <template v-slot:prev="{on,attrs}">
              <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity:0.5" color="black">
              <svg style="transform: rotate(90deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
              </svg>
              </v-btn>
            </template>
            <template v-slot:next="{on,attrs}">
              <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity:0.5" color="black">
              <svg style="transform: rotate(270deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
              </svg>
              </v-btn>
            </template>
            <v-carousel-item v-for="(image, i) in content.images" :key="i">
              <v-img contain :src="`data:image/png;base64,${image}`" height="100%" > </v-img>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
        <!-- <v-progress-circular v-else indeterminate /> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'PortifolioPreview',
  props: { content: {}, showPreview: Boolean, dark: Boolean },
  data: () => ({
    preview: false,
    editingTitle: false,
  }),
  computed: {
    dataReady() {
      return this.content ? true : false;
    },
  },
  methods: {},
  watch: {
    showPreview(value) {
      if (value == true) this.hovering = false;
      return (this.preview = value);
    },
  },
};
</script>

<style>
.nodeDialogName.v-input input {
  text-align: left !important;
  color: black !important;
  font-size: 20px !important;
}
</style>
