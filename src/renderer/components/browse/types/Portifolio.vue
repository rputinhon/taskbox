<template>
  <v-card v-if="post" height="fit-content" color="grey" flat @click.prevent rounded="0">
    <v-fade-transition hide-on-leave leave-absolute>
      <v-carousel class="carossel" show-arrows-on-hover :show-arrows="imagesCount > 1" :hide-delimiters="imagesCount < 2" hide-delimiter-background max-height="450" height="450" continuous>
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
          <v-responsive width="100%" ref="image" height="100%" style="align-items: center" class="pa-0 ma-0">
              <v-img :src="image.data" :max-height="image.height" contain class="my-auto"> </v-img>
            </v-responsive>
        </v-carousel-item>
      </v-carousel>
    </v-fade-transition>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../../main';

export default {
  name: 'PostPortifolio',
  props: { post: Object },
  data() {
    return {};
  },
  mounted() {
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    hasImages() {
      return this.images.length > 0 ? true : false;
    },
    imagesCount() {
      return this.images.length;
    },
    images() {
      return this.post.data && this.post.data['images'] ? this.post.data.images : [];
    },
  },
  methods: {
    isMe(id) {
      return id == this.member.id ? true : false;
    },
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
    },
  },
};
</script>

<style>
.v-item--active {
  opacity: 1 !important;
  background-color: aliceblue !important;
}
.carossel .v-btn--icon.v-size--small {
  height: 12px;
  width: 12px;
}
</style>
