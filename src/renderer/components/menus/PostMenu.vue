<template>
  <v-menu rounded="0" right offset-x light :close-on-content-click="true" @click.stop>
    <template v-slot:activator="{ on: menu }">
      <v-btn v-on="{ ...menu }" x-small :icon="!post.archived" fab depressed :color="post.archived?'error':''">
        <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " 
          :fill="!post.archived&&'grey'||'white'" />
        </svg>
      </v-btn>
    </template>
    <v-card class="mx-auto" max-width="400">
      <v-list>
        <v-list-item>
          <v-select label="share with" ref="share" :items="shareTypes" v-model="post.shareWith" height="25" dense hide-details="true" style="max-width: 130px" @click.stop @change="save()">
            <template v-slot:append>
              <v-btn icon :loading="loading" fab x-small>
                <svg width="28" version="1.1" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="m 16.603318,10.487538 c -7.9688576,0 -12.5759362,6.291988 -12.5759362,6.291988 -0.3629984,0.492951 -0.2574995,1.186859 0.2356032,1.549652 0.4931123,0.362867 1.1870497,0.257087 1.5496527,-0.236219 0,0 2.2075366,-2.979893 6.1355373,-4.507971 -0.816027,1.03138 -1.304777,2.331789 -1.304777,3.741183 0,3.328517 2.724778,6.053293 6.053295,6.053293 3.328516,0 6.053296,-2.724776 6.053296,-6.053293 0,-1.398384 -0.481042,-2.689578 -1.285608,-3.717065 4.083388,1.52575 6.644462,4.444277 6.644462,4.444277 0.400809,0.463037 1.101219,0.51316 1.563877,0.111915 0.462633,-0.400754 0.512743,-1.100689 0.111915,-1.563258 0,0 -5.223496,-6.114513 -13.181326,-6.114513 z m 0.09337,3.192682 c 2.028098,0 3.645952,1.617855 3.645952,3.645951 0,2.028098 -1.617854,3.645953 -3.645952,3.645953 -2.028096,0 -3.645951,-1.617855 -3.645951,-3.645953 0,-2.028096 1.617855,-3.645951 3.645951,-3.645951 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
          </v-select>
        </v-list-item>
        <v-divider></v-divider>
        <!-- <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn text block small @click.stop="sharePost()"> Share </v-btn>
        </v-list-item> -->
        <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn text block small @click.stop="modifyPost()"> Modify </v-btn>
        </v-list-item>
        <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn :text="!post.archived" block :color="post.archived?'error':''" small v-text="post.archived?'archived':'archive'" @click.stop="archivePost()"> Archive </v-btn>
        </v-list-item>
        <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn text block small @click.stop="deletePost()"> Delete </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { shareWith } from '../../store/models/PostModel';
import _ from 'lodash';
export default {
  name: 'PostMenu',
  props: { post: Object },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    shareTypes() {
      return Object.values(shareWith);
    },
  },
  methods: {
    save() {
      this.loading = true;
      this.$store.dispatch('post/SAVE', this.post).then(() => {
        this.$refs.share.blur();
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    sharePost() {},
    modifyPost() {
      this.$store.commit('post/OPEN_POST_CREATOR', { post: this.post });
    },
    archivePost() {
      let copy = _.cloneDeep(this.post);
      if (!copy.archived) Object.assign(copy, { archived: false });
      copy.archived = !copy.archived;
      this.$store.dispatch('post/SAVE', copy);
    },
    deletePost() {
      this.$store.dispatch('post/DELETE', this.post.id);
    },
  },
};
</script>
