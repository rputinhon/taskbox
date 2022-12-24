<template>
  <v-card v-if="creatingPost">
    <v-card height="512" flat color="grey" @click.stop>
      <v-fade-transition hide-on-leave leave-absolute>
        <v-carousel show-arrows-on-hover :show-arrows="hasImages" :hide-delimiters="!hasImages" hide-delimiter-background height="512px" continuous>
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
            <v-carousel-item v-for="(image, i) in images" :key="i">
              <v-img :src="image" class="my-auto" height="512"> </v-img>

              <v-tooltip bottom transition="none" v-if="images.length < 10">
                <template v-slot:activator="{ on }">
                  <v-fade-transition>
                    <v-btn right top class="mt-6" style="margin-right: 80px !important" absolute v-on="on" fab x-small @click.stop="selectImages(true)">
                      <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 20.279297 9.6289062 L 20.279297 20.279297 L 9.6289062 20.279297 L 9.6289062 27.720703 L 20.279297 27.720703 L 20.279297 38.371094 L 27.720703 38.371094 L 27.720703 27.720703 L 38.371094 27.720703 L 38.371094 20.279297 L 27.720703 20.279297 L 27.720703 9.6289062 L 20.279297 9.6289062 z " fill="#252525" style="pointer-events: none" />
                      </svg>
                    </v-btn>
                  </v-fade-transition>
                </template>
                Add Images *max {{ 10 - imagesCount }}
              </v-tooltip>

              <v-tooltip bottom transition="none">
                <template v-slot:activator="{ on }">
                  <v-fade-transition>
                    <v-btn right top class="mt-6 mr-10" absolute v-on="on" fab x-small @click.stop="changeImage(i)">
                      <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 5.3408124,5.7314895 c -1.226767,0 -2.2148737,0.98759 -2.2148737,2.214357 0.030197,6.1083365 0,12.0852235 0,18.2357595 0,2.38137 1.9176336,4.298488 4.2990047,4.298488 H 27.093703 c 2.381372,0 4.298487,-1.917118 4.298487,-4.298488 V 14.19824 c 0,-2.381372 -1.917115,-4.2984882 -4.298487,-4.2984882 H 15.500498 V 7.9458465 c 0,-1.226767 -0.987589,-2.214357 -2.214356,-2.214357 z" transform="translate(7 5)" fill="#252525" style="pointer-events: none" />
                      </svg>
                    </v-btn>
                  </v-fade-transition>
                </template>
                Change
              </v-tooltip>

              <v-tooltip bottom transition="none">
                <template v-slot:activator="{ on }">
                  <v-fade-transition>
                    <v-btn right top class="mt-6" absolute v-on="on" fab x-small @click.stop="deleteImage(i)">
                      <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#ff5555" style="pointer-events: none" />
                      </svg>
                    </v-btn>
                  </v-fade-transition>
                </template>
                Delete
              </v-tooltip>
            </v-carousel-item>
          <v-carousel-item v-if="!hasImages" style="height: 512">
            <v-card height="512" width="512" color="grey">
              <v-tooltip bottom transition="none">
                <template v-slot:activator="{ on }">
                  <v-fade-transition>
                    <v-btn right top class="mt-6" absolute v-on="on" fab x-small @click.stop="selectImages()">
                      <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="m 5.3408124,5.7314895 c -1.226767,0 -2.2148737,0.98759 -2.2148737,2.214357 0.030197,6.1083365 0,12.0852235 0,18.2357595 0,2.38137 1.9176336,4.298488 4.2990047,4.298488 H 27.093703 c 2.381372,0 4.298487,-1.917118 4.298487,-4.298488 V 14.19824 c 0,-2.381372 -1.917115,-4.2984882 -4.298487,-4.2984882 H 15.500498 V 7.9458465 c 0,-1.226767 -0.987589,-2.214357 -2.214356,-2.214357 z" transform="translate(7 5)" fill="#252525" style="pointer-events: none" />
                      </svg>
                    </v-btn>
                  </v-fade-transition>
                </template>
                Add Images *max 10
              </v-tooltip>

              <empty :loading="loading" :extraClass="'mt-16'" :size="150" :icon="postType.icon" :text="' '" />
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-fade-transition>
    </v-card>
    <v-toolbar class="pa-0 pr-2 my-1" height="35px" elevation="0">
      <v-spacer></v-spacer>
      <v-btn class="mx-2" small right color="secondary" @click="$emit('close')"> cancel </v-btn>
      <v-btn small right color="primary" :loading="loading" @click="beforePost()"> post! </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { ipcRenderer, nativeImage } from 'electron';
import { mapState } from 'vuex';
import { eventBus } from '../../../../main';
import { getPostTypeByValue } from '../../../store/models/PostModel';
import _ from 'lodash';
import Empty from '../../dialogs/Empty.vue';

export default {
  components: { Empty },
  name: 'PostPortifolio',
  data() {
    return {
      loading: false,
      creatingPost: null,
      refreshKey: 0,
    };
  },
  mounted() {
    this.creatingPost = _.cloneDeep(this.post);
  },
  computed: {
    ...mapState({
      post: (state) => _.cloneDeep(state.post.creatingPost),
      member: (state) => state.user.profile,
    }),
    postType() {
      return getPostTypeByValue(this.creatingPost.postType);
    },
    hasImages() {
      this.refreshKey;
      return this.imagesCount == 0 ? false : true;
    },
    imagesCount() {
      this.refreshKey;
      return this.creatingPost.data && this.creatingPost.data.images? this.creatingPost.data.images.length : 0;
    },
    images() {
      this.refreshKey;
      return this.creatingPost.data && this.creatingPost.data['images'] ? this.creatingPost.data.images : [];
    },
  },
  methods: {
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
    },
    deleteImage(index) {
      this.refreshKey++;
      this.creatingPost.data['images'].splice(index, 1);
    },
    changeImage(index) {
      this.loading = true;
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (files) => {
        if (!this.creatingPost.data || !this.creatingPost.data['images']) {
          this.creatingPost.data = {};
          this.creatingPost.data['images'] = [];
        }

        nativeImage.createThumbnailFromPath(files[0], { width: 512, height: 512 }).then((clip) => {
          this.creatingPost.data['images'][index] = clip.toDataURL();
        });

        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    selectImages() {
      this.loading = true;
      ipcRenderer.invoke('app:selectImage', { multiple: true }).then(async (files) => {

        files.splice(10 - this.imagesCount, files.length);

        if (!this.creatingPost.data || !this.creatingPost.data['images']) {
          this.creatingPost.data = {};
          this.creatingPost.data['images'] = [];
        }

        files.map(async (path) => {
          nativeImage.createThumbnailFromPath(path, { width: 512, height: 512 }).then((clip) => {
            this.creatingPost.data['images'].push(clip.toDataURL());
          });
        });

        setTimeout(() => {
          this.refreshKey++;
          this.loading = false;
        }, 700);
      });
    },
    beforePost() {
      this.creatingPost.data.options = this.options;
      // this.$store.commit('post/UPDATE_CREATING_POST', this.creatingPost);
      this.$listeners.save(this.creatingPost);
    },
  },
};
</script>

<style>
.v-item--active {
  opacity: 1 !important;
  background-color: aliceblue !important;
}
</style>
