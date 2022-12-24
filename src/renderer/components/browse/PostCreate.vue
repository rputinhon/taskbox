<template>
  <v-dialog v-if="post && postType" :scrollable="false" :fullscreen="false" overlay-opacity="0.9" width="512px" class="overflow-visible" style="min-width: auto" v-model="post" persistent light>
    <v-card height="fit-content" class="overflow-visible">
      <v-card-title class="mx-0 px-2 pl-4">
        <v-avatar color="grey" size="27" class="mx-3" @click.stop="goToProfile(post.member)">
          <v-img v-if="member" :src="member.profilePicture" />
          <svg v-else version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
          </svg>
        </v-avatar>
        <v-text-field label="Post Title" autofocus v-model="post.title" dense :hide-details="true"></v-text-field>
        <v-spacer></v-spacer>
        <v-select label="visibility" :items="shareTypes" v-model="post.shareWith" height="25" dense hide-details="true" style="max-width: 110px">
          <template v-slot:append>
            <svg width="28" version="1.1" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 16.603318,10.487538 c -7.9688576,0 -12.5759362,6.291988 -12.5759362,6.291988 -0.3629984,0.492951 -0.2574995,1.186859 0.2356032,1.549652 0.4931123,0.362867 1.1870497,0.257087 1.5496527,-0.236219 0,0 2.2075366,-2.979893 6.1355373,-4.507971 -0.816027,1.03138 -1.304777,2.331789 -1.304777,3.741183 0,3.328517 2.724778,6.053293 6.053295,6.053293 3.328516,0 6.053296,-2.724776 6.053296,-6.053293 0,-1.398384 -0.481042,-2.689578 -1.285608,-3.717065 4.083388,1.52575 6.644462,4.444277 6.644462,4.444277 0.400809,0.463037 1.101219,0.51316 1.563877,0.111915 0.462633,-0.400754 0.512743,-1.100689 0.111915,-1.563258 0,0 -5.223496,-6.114513 -13.181326,-6.114513 z m 0.09337,3.192682 c 2.028098,0 3.645952,1.617855 3.645952,3.645951 0,2.028098 -1.617854,3.645953 -3.645952,3.645953 -2.028096,0 -3.645951,-1.617855 -3.645951,-3.645953 0,-2.028096 1.617855,-3.645951 3.645951,-3.645951 z" fill="grey" />
            </svg>
          </template>
        </v-select>
        <v-menu rounded="0" bottom offset-y light>
          <template v-slot:activator="{ on: menu }">
            <v-btn v-on="menu" elevation="0" color="white" class="px-0 mr-2">
              <svg style="pointer-events: none" width="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path :d="postType.icon" fill="#0187f3" />
              </svg>
              <svg style="transform: rotate(0deg)" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 36.338815,14.519012 23.468539,28.411775 11.20589,13.973178 c -1.155312,-0.955569 -2.8664834,-0.793807 -3.8222654,0.361328 -0.9568939,1.155609 -0.7950734,2.868283 0.361328,3.824219 L 21.110879,33.315833 c 1.482641,1.628525 3.29714,1.80994 4.960358,0.300835 L 40.711862,17.737762 c 0.888321,-1.207171 0.630421,-2.905816 -0.576172,-3.794922 -1.437955,-0.918123 -2.745092,-0.318825 -3.796875,0.576172 z" fill="grey" />
              </svg>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item-group class="pa-0 ma-0" v-model="postTypeModel" @change="changePostType(postTypeModel)">
                <v-list-item v-for="(type, t) in postTypes" :key="t" style="min-height: 25px !important" class="pl-1">
                  <v-list-item-icon class="ma-0 pa-0">
                    <v-btn elevation="0" fab icon>
                      <svg width="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path :d="type.icon" fill="#0187f3" />
                      </svg>
                    </v-btn>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ type.componentType }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </v-card-title>
      <v-card flat rounded="0" min-height="510px" light>
      <component v-bind:is="componentType" @save="save" @close="close()"> </component>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { getPostTypeByValue, postType, shareWith } from '../../store/models/PostModel';
import _ from 'lodash';

export default {
  name: 'PostCreate',
  data() {
    return {
      loading: false,
      componentType: null,
      postTypeModel: 0,
    };
  },
  mounted() {
    if (this.postType) {
      this.postTypeModel = this.postType.value;
      this.getComponentType(this.postType.componentType);
    }
  },
  watch: {
    postType(value) {
      if (value) this.getComponentType(value.componentType);
    },
  },
  computed: {
    ...mapState({
      post: (state) => _.cloneDeep(state.post.creatingPost),
      member: (state) => state.user.profile,
    }),
    shareTypes() {
      return Object.values(shareWith);
    },
    postType() {
      if (!this.post) return;
      return getPostTypeByValue(this.post.postType);
    },
    postTypes() {
      return Object.values(postType);
    },
  },
  methods: {
    changePostType(value) {
      this.$store.commit('post/CHANGE_POST_TYPE', value);
    },
    getComponentType(name) {
      this.componentType = () => import(`./creators/${name}.vue`);
    },
    save(value) {
      this.loading = true;
      let copy = _.cloneDeep(this.post);
      Object.assign(copy,value);
      this.$store.dispatch('post/SAVE', copy).then(() => {
        setTimeout(() => {
          this.loading = false;
          this.close();
        }, 700);
      });
    },
    close() {
      this.componentType = null;
      this.postTypeModel = 0;
      this.$store.commit('post/CLOSE_POST_CREATOR');
    },
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
    },
  },
};
</script>

<style>
/* ::-webkit-scrollbar {
  width: 0px !important;
  height: 5px !important;
}
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0px;
}
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 0px;
} */
</style>
