<template>
  <v-sheet class="portifolio" color="background">
    <v-progress-linear v-show="loading" indeterminate absolute style="margin-top: -20px" />
    <v-list v-if="creating" class="ma-0 pa-0 mb-5">
      <v-card outlined rounded="lg" hover width="100%" height="210px" v-if="editingPortifolio">
        <v-sheet height="100%" rounded="lg" color="background">
          <div v-if="editingPortifolio.images.length == 0">
            <v-btn :loading="loading" rounded small color="primary" class="mt-12" @click="SelectImages()"> select images </v-btn>
          </div>
          <v-carousel hide-delimiters height="150px" v-if="editingPortifolio.images.length > 0">
            <template v-slot:prev="{ on, attrs }">
              <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity: 0.5" color="black">
                <svg style="transform: rotate(90deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
            <template v-slot:next="{ on, attrs }">
              <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity: 0.5" color="black">
                <svg style="transform: rotate(270deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
            <v-carousel-item v-for="(image, i) in editingPortifolio.images" :key="i">
              <v-img :src="`data:image/png;base64,${image}`" width="100%" height="100%"> </v-img>
            </v-carousel-item>
          </v-carousel>
        </v-sheet>
        <v-toolbar flat bottom absolute width="100%" class="px-5" height="60px">
          <svg width="30" height="30" version="1.1" viewBox="0 0 48 58" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#004fc1" stop-color="#000000" />
            <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#0067fb" stop-color="#000000" />
            <rect x="6.2223" y="6" width="35.534" height="28.534" ry="7.6733" fill="#424242" stop-color="#000000" style="opacity: 0.3" />
            <g transform="matrix(.88587 0 0 .88587 2.7391 1)">
              <path d="m32.848 12.855c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" color="#000000" fill="#e6e6e6" stroke-linecap="round" stroke-linejoin="round" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
            </g>
          </svg>
          <v-list-item-content class="py-0 mx-5 text-left" style="min-width: 300px">
            <v-text-field dense hide-details="true" v-model="editingPortifolio.title" placeholder="type the title here." />
            <v-text-field dense hide-details="true" v-model="editingPortifolio.description" placeholder="type the description here." />
          </v-list-item-content>
          <v-spacer></v-spacer>
          <v-btn rounded color="primary" small class="mx-2" @click.stop="SaveNewPortifolio()"> save </v-btn>
        </v-toolbar>
      </v-card>
    </v-list>
    <v-list v-for="(portifolio, p) in portifolios" :key="p" class="ma-0 pa-0 mb-5">
      <v-lazy>
        <v-tooltip right transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-card outlined :color="editingPortifolioID == portifolio.id ? 'accent' : ''" rounded="lg" hover width="100%" :height="hovering == p || editingPortifolioID == portifolio.id ? '205px' : '150px'" @mouseenter="hovering = p" @mouseleave="hovering = null" v-on="on" v-bind="attrs" @click="previewContent(portifolio)">
              <v-sheet height="100%" rounded="lg" color="background">
                <v-carousel hide-delimiters show-arrows-on-hover height="148px" style="border-radius: 8px">
                  <template v-slot:prev="{ on, attrs }">
                    <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity: 0.5" color="black">
                      <svg style="transform: rotate(90deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
                      </svg>
                    </v-btn>
                  </template>
                  <template v-slot:next="{ on, attrs }">
                    <v-btn x-small fab v-on="on" v-bind="attrs" style="opacity: 0.5" color="black">
                      <svg style="transform: rotate(270deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
                      </svg>
                    </v-btn>
                  </template>
                  <v-carousel-item v-for="(image, i) in portifolio.images" :key="i">
                    <v-img :src="`data:image/png;base64,${image}`" width="100%" height="100%"> </v-img>
                  </v-carousel-item>
                </v-carousel>
                <div v-if="editingPortifolioID == portifolio.id">
                  <v-btn absolute left top class="mt-5" icon fab x-small color="primary" @click.stop="AddImages(portifolio)">
                    <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 20.279297 9.6289062 L 20.279297 20.279297 L 9.6289062 20.279297 L 9.6289062 27.720703 L 20.279297 27.720703 L 20.279297 38.371094 L 27.720703 38.371094 L 27.720703 27.720703 L 38.371094 27.720703 L 38.371094 20.279297 L 27.720703 20.279297 L 27.720703 9.6289062 L 20.279297 9.6289062 z " fill="#0067fb" stop-color="#000000" style="paint-order: fill markers stroke" />
                    </svg>
                  </v-btn>

                  <v-btn absolute right top class="mt-5" icon fab x-small color="primary" @click.stop="portifolio.images.splice(p - 1, 1)">
                    <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="red" stop-color="#000000" style="paint-order: fill markers stroke" />
                    </svg>
                  </v-btn>
                </div>
              </v-sheet>
              <v-toolbar :dark="isDark" :light="!isDark" flat bottom absolute width="100%" class="px-5" color="transparent" style="opacity: 0.8">
                <svg width="30" height="30" version="1.1" viewBox="0 0 48 58" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#004fc1" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#0067fb" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="6.2223" y="6" width="35.534" height="28.534" ry="7.6733" fill="#424242" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".64364" style="opacity: 0.3; -inkscape-stroke: none; paint-order: fill markers stroke" />
                  <g transform="matrix(.88587 0 0 .88587 2.7391 1)">
                    <path d="m32.848 12.855c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" color="#000000" fill="#e6e6e6" stroke-linecap="round" stroke-linejoin="round" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
                  </g>
                </svg>
                <v-list-item-content v-if="editingPortifolioID == portifolio.id" class="py-0 mx-5 text-left" style="min-width: 220px">
                  <v-text-field dense hide-details="true" v-model="portifolio.title" placeholder="type the title here." @click.stop />
                  <v-text-field dense hide-details="true" v-model="portifolio.description" placeholder="type the description here." @click.stop />
                </v-list-item-content>
                <v-list-item-content v-else class="py-0 mx-5 text-left">
                  <v-list-item-title> {{ portifolio.title }} </v-list-item-title>
                  <!-- <v-list-item-subtitle> {{ portifolio.description }} </v-list-item-subtitle> -->
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-menu rounded="lg" v-if="editingPortifolioID !== portifolio.id" right nudge-right="20" transition="none">
                  <template v-slot:activator="{ on: onMenu }">
                    <v-btn v-on="onMenu" x-small rounded icon class="mr-2" @click.stop="">
                      <svg width="25" height="25" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                        <path d="m3.1822 4.7124c-0.31986-4.71e-5 -0.57916 0.25926-0.57912 0.57912-4.71e-5 0.31986 0.25926 0.57916 0.57912 0.57912 0.31986 4.7e-5 0.57916-0.25926 0.57912-0.57912 4.72e-5 -0.31986-0.25926-0.57916-0.57912-0.57912zm2.0779 0c-0.31986-4.7e-5 -0.57916 0.25926-0.57912 0.57912-4.71e-5 0.31986 0.25926 0.57916 0.57912 0.57912 0.31986 4.71e-5 0.57916-0.25926 0.57912-0.57912 4.71e-5 -0.31986-0.25926-0.57916-0.57912-0.57912zm2.1407 0c-0.31986-4.71e-5 -0.57916 0.25926-0.57912 0.57912-4.72e-5 0.31986 0.25926 0.57916 0.57912 0.57912 0.31986 4.7e-5 0.57916-0.25926 0.57912-0.57912 4.71e-5 -0.31986-0.25926-0.57916-0.57912-0.57912z" fill="#333" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".69023" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                      </svg>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item @click="editingPortifolioID = portifolio.id"> edit </v-list-item>
                      <v-list-item @click="DeletePortifolio(portifolio.id)"> delete </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
                <!-- <v-btn v-if="editingPortifolioID !== portifolio.id" rounded color="primary" outlined small class="mx-2"> like </v-btn> -->
                <div v-if="editingPortifolioID == portifolio.id">
                  <v-btn rounded color="grey" x-small class="mx-2" @click.stop="editingPortifolioID = null"> cancel </v-btn>
                  <v-btn rounded color="accent" x-small class="mx-2" @click.stop="UpdatePortifolio(portifolio)"> save </v-btn>
                </div>
              </v-toolbar>
            </v-card>
          </template>
          {{ portifolio.description }}
        </v-tooltip>
      </v-lazy>
    </v-list>

    <span v-if="isEmpty() && !creating" style="position: absolute; margin-left: -30px; margin-top: 130px">
      <svg width="200" height="200" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path
          transform="scale(0.5) translate(18 25)"
          d="M 9.4076954,0 C 4.1952548,0 0,4.0998802 0,9.1938206 V 38.806179 C 0,43.900119 4.1952548,48 9.4076954,48 H 38.592305 C 43.804745,48 48,43.900119 48,38.806179 V 9.1938206 C 48,4.0998802 43.804745,0 38.592305,0 Z M 27.469388,9.8700076 c 2.537092,0 4.621006,0.9872244 6.251119,2.9635684 1.630112,1.964368 2.445571,4.496688 2.445571,7.598951 0,3.102263 -0.815459,5.643591 -2.445571,7.619936 -1.630113,1.964368 -3.714027,2.944914 -6.251119,2.944914 -1.434008,0 -2.702464,-0.274435 -3.805547,-0.825415 -1.103084,-0.56296 -2.108827,-1.43066 -3.015807,-2.604489 V 38.129992 H 14.067658 V 10.354998 h 6.580376 v 2.944914 c 0.90698,-1.173829 1.912723,-2.034853 3.015807,-2.585834 1.103083,-0.562959 2.371539,-0.8440704 3.805547,-0.8440704 z m -2.445571,4.6703604 c -3.438881,0.274109 -4.356164,3.296596 -4.375783,5.892159 0.03438,2.977392 1.360313,5.853096 4.375783,5.894492 3.435563,-0.266971 4.320625,-3.315691 4.339994,-5.894492 -0.0359,-2.958842 -1.341072,-5.850977 -4.339994,-5.892159 z"
          fill="grey"
          stop-color="#000000"
          style="paint-order: fill markers stroke"
        />
        <text x="0" y="10" font-family="sans-serif" font-size="10.396px" stroke-width=".25991" style="line-height: 1.25" xml:space="preserve">
          <tspan x="23.5" y="52" fill="grey" font-family="sans-serif" font-size="7.5px" font-weight="bold" text-align="center" text-anchor="middle" style="pointer-events: none; line-height: 1.5" xml:space="preserve">no portifolios</tspan>
        </text>
      </svg>
    </span>
    <portifolio-preview :dark="isDark" :content="content" :showPreview="preview" @close="(content = null), (preview = false)" />
  </v-sheet>
</template>

<script>
// import { nextTick } from 'process';
import { mapState } from 'vuex';
import PortifolioPreview from '../dialogs/PortifolioPreview.vue';
import { ipcRenderer } from 'electron';
import { nextTick } from 'process';

export default {
  name: 'Portifolio',
  components: { PortifolioPreview },
  props: { creating: Boolean, clean: Boolean },
  data() {
    return {
      isDark: false,
      content: null,
      preview: false,
      loading: false,
      hovering: null,
      editingPortifolioID: null,
      portifolios: [],
    };
  },
  async mounted() {
    await this.getPortifolios();
  },
  watch: {
    async clean(value) {
      if (value) this.portifolios.splice(0, this.portifolios.length);
      else await this.getPortifolios();
    },
  },
  computed: {
    ...mapState({
      editingPortifolio: (state) => state.user.editingPortifolio,
    }),
  },
  methods: {
    async getPortifolios() {
      this.loading = true;
      nextTick(async () => {
        this.portifolios = await this.$store
          .dispatch('user/FETH_PORTIFOLIOS')
          .then((result) => {
            return result;
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async UpdatePortifolio(portifolio) {
      this.editingPortifolioID = null;
      await this.$store.dispatch('user/UPDATE_PORTIFOLIO', portifolio);
    },
    async DeleteImage(portifolio, id) {
      portifolio.images.splice(id - 1, 1);
    },
    async DeletePortifolio(id) {
      await this.$store.dispatch('user/DELETE_PORTIFOLIO', id);
      this.getPortifolios();
    },
    previewContent(content) {
      this.content = content;
      this.preview = true;
    },
    AddImages(portifolio) {
      this.loading = true;
      ipcRenderer
        .invoke('app:selectImage', true)
        .then((images) => {
          if (images == undefined) return;
          portifolio.images.push(images);
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    SelectImages() {
      this.loading = true;
      ipcRenderer
        .invoke('app:selectImage', true)
        .then((images) => {
          if (images == undefined) return;
          this.editingPortifolio.images = images;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    SaveNewPortifolio() {
      this.$store.dispatch('user/UPDATE_PORTIFOLIO', this.editingPortifolio);
      this.getPortifolios();
      this.$listeners.notCreating();
    },
    isEmpty() {
      return this.portifolios.length == 0 ? true : false;
    },
  },
};
</script>

<style scoped>
.portifolio {
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: calc(100vh - 238px) !important;
  max-height: calc(100vh - 238px) !important;
}
</style>
