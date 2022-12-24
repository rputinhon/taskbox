<template>
  <v-card v-if="creatingPost" class="pb-1">
    <v-system-bar class="mx-auto mt-1" light height="30">
      <v-btn :color="capitalEffect ? 'primary' : 'secondary'" class="mr-1" x-small @click="changeCap()"> {{ cap || 'H' }} </v-btn>
      <v-btn-toggle mandatory v-model="align" dark>
        <v-btn dark width="20" height="20" v-for="(type, t) in textalignTypes" :key="t" x-small>
          <svg width="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path :d="type.icon" :fill="t == align ? '#252525' : 'white'" />
          </svg>
        </v-btn>
      </v-btn-toggle>
      <v-btn min-width="25" style="font-size: 18px" class="ml-1 px-0" x-small @click="options.fontsize += 2"> A </v-btn>
      <v-btn min-width="25" class="px-0" x-small @click="options.fontsize -= 2"> A </v-btn>
      <v-menu rounded="0" offset-y top>
        <template v-slot:activator="{ on: menu }">
          <v-btn style="border: 1px solid #353535" v-on="{ ...menu }" light :color="options.fontcolor" class="ml-1 px-1" x-small><span class="gre--text multiply">font</span> </v-btn>
        </template>
        <v-card class="mx-auto" height="500" width="60">
          <v-color-picker v-model="options.fontcolor" hide-canvas hide-inputs hide-sliders hide-mode-switch show-swatches swatches-max-height="500"  />
        </v-card>
      </v-menu>
      <v-menu rounded="0" right offset-x top>
        <template v-slot:activator="{ on: menu }">
          <v-btn style="border: 1px solid #353535" v-on="{ ...menu }" light :color="options.backgroundColor" class="ml-1 px-1" x-small></v-btn>
        </template>
        <v-card class="mx-auto px-0" height="500" width="60">
          <v-color-picker class="mx-0" v-model="options.backgroundColor" hide-canvas hide-inputs hide-sliders hide-mode-switch show-swatches swatches-max-height="500" />
        </v-card>
      </v-menu>
    </v-system-bar>
    <v-row v-if="creatingPost" no-gutters justify="center" align="center" class="overflow-y-auto overflow-x-hidden" :style="`word-break:keep-all;font-size:${fontSize}px;text-align: ${textAlign}!important;line-height:${fontSize}px; max-height: 450px; font-weight: 700; min-height: 450px;background:${backgroundColor}`">
      <v-col @click.prevent class="pa-10 overflow-hidden" width="100%" height="auto" style="height: auto">
        <span :style="`color:${fontColor}!important`">
          <b v-show="capitalEffect" :style="`font-size: ${100}px;margin-right: -30px;`">{{ cap }} </b>
          {{ text }}
        </span>
      </v-col>
    </v-row>
    <v-toolbar class="pa-0 pr-2 my-1" height="35px" elevation="0">
      <v-text-field class="ma-2" solo-inverted dense :hide-details="true" autofocus ref="textarea" placeholder="Write here your short history..." v-model="creatingPost.subject" @keydown.tab.prevent> </v-text-field>
      <v-btn class="mx-2" small right color="secondary" @click="$emit('close')"> cancel </v-btn>
      <v-btn small right color="primary" :loading="loading" @click="beforePost()"> post! </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { getPostTypeByValue } from '../../../store/models/PostModel';
import _ from 'lodash';

export default {
  name: 'PostHistory',
  data() {
    return {
      loading: false,
      creatingPost: null,
      align: 2,
      textalignTypes: [
        { value: 0, text: 'left', icon: 'm 8.4651164,10.912512 c -0.6780065,0 -1.2242147,0.545692 -1.2242147,1.223698 v 1.530139 c -2e-7,0.678006 0.5462082,1.223698 1.2242147,1.223698 H 39.162984 c 0.678006,0 1.223698,-0.545692 1.223698,-1.223698 V 12.13621 c 0,-0.678006 -0.545692,-1.223698 -1.223698,-1.223698 z m 0,10.911479 c -0.6780065,0 -1.2242147,0.545691 -1.2242147,1.223698 v 1.529622 c -2e-7,0.678006 0.5462082,1.223698 1.2242147,1.223698 H 39.162984 c 0.678006,0 1.223698,-0.545692 1.223698,-1.223698 v -1.529622 c 0,-0.678007 -0.545692,-1.223698 -1.223698,-1.223698 z m 0,10.912513 c -0.6780065,0 -1.2242147,0.54569 -1.2242147,1.223698 v 1.529622 c -2e-7,0.678005 0.5462082,1.224214 1.2242147,1.224214 H 27.521318 c 0.678005,0 1.223698,-0.546209 1.223698,-1.224214 v -1.529622 c 0,-0.678008 -0.545693,-1.223698 -1.223698,-1.223698 z' },
        { value: 1, text: 'right', icon: 'm 39.162467,10.912512 c 0.678007,0 1.224215,0.545692 1.224215,1.223698 v 1.530139 c 0,0.678006 -0.546208,1.223698 -1.224215,1.223698 H 8.4645997 c -0.678006,0 -1.223698,-0.545692 -1.223698,-1.223698 V 12.13621 c 0,-0.678006 0.545692,-1.223698 1.223698,-1.223698 z m 0,10.911479 c 0.678007,0 1.224215,0.545691 1.224215,1.223698 v 1.529622 c 0,0.678006 -0.546208,1.223698 -1.224215,1.223698 H 8.4645997 c -0.678006,0 -1.223698,-0.545692 -1.223698,-1.223698 v -1.529622 c 0,-0.678007 0.545692,-1.223698 1.223698,-1.223698 z m 0,10.912513 c 0.678007,0 1.224215,0.54569 1.224215,1.223698 v 1.529622 c 0,0.678005 -0.546208,1.224214 -1.224215,1.224214 H 20.106266 c -0.678005,0 -1.223698,-0.546209 -1.223698,-1.224214 v -1.529622 c 0,-0.678008 0.545693,-1.223698 1.223698,-1.223698 z' },
        { value: 2, text: 'center', icon: 'm 36.516634,10.912512 c 0.678007,0 1.224215,0.545692 1.224215,1.223698 v 1.530139 c 0,0.678006 -0.546208,1.223698 -1.224215,1.223698 H 11.110433 c -0.678006,0 -1.223698,-0.545692 -1.223698,-1.223698 V 12.13621 c 0,-0.678006 0.545692,-1.223698 1.223698,-1.223698 z m 2.645833,10.911479 c 0.678007,0 1.224215,0.545691 1.224215,1.223698 v 1.529622 c 0,0.678006 -0.546208,1.223698 -1.224215,1.223698 H 8.4645997 c -0.678006,0 -1.223698,-0.545692 -1.223698,-1.223698 v -1.529622 c 0,-0.678007 0.545692,-1.223698 1.223698,-1.223698 z m -6.35,10.912513 c 0.678007,0 1.224215,0.54569 1.224215,1.223698 v 1.529622 c 0,0.678005 -0.546208,1.224214 -1.224215,1.224214 H 13.756266 c -0.678005,0 -1.223698,-0.546209 -1.223698,-1.224214 v -1.529622 c 0,-0.678008 0.545693,-1.223698 1.223698,-1.223698 z' },
        { value: 3, text: 'justify', icon: 'm 8.4651164,10.912512 c -0.6780065,0 -1.2242147,0.545692 -1.2242147,1.223698 v 1.530139 c -2e-7,0.678006 0.5462082,1.223698 1.2242147,1.223698 H 39.162984 c 0.678006,0 1.223698,-0.545692 1.223698,-1.223698 V 12.13621 c 0,-0.678006 -0.545692,-1.223698 -1.223698,-1.223698 z m 0,10.911479 c -0.6780065,0 -1.2242147,0.545691 -1.2242147,1.223698 v 1.529622 c -2e-7,0.678006 0.5462082,1.223698 1.2242147,1.223698 H 39.162984 c 0.678006,0 1.223698,-0.545692 1.223698,-1.223698 v -1.529622 c 0,-0.678007 -0.545692,-1.223698 -1.223698,-1.223698 z m 0,10.912513 c -0.6780065,0 -1.2242147,0.54569 -1.2242147,1.223698 v 1.529622 c -2e-7,0.678005 0.5462082,1.224214 1.2242147,1.224214 H 39.162985 c 0.678005,0 1.223698,-0.546209 1.223698,-1.224214 v -1.529622 c 0,-0.678008 -0.545693,-1.223698 -1.223698,-1.223698 z' },
      ],
      options: {
        capitalEffect: false,
        textalign: 'center',
        fontsize: 30,
        fontcolor: 'black',
        backgroundColor: 'grey',
      },
      colors: ['#fafafafa'],
    };
  },
  watch: {
    align(value) {
      this.options.textalign = this.textalignTypes.find((t) => t.value == value).text;
    },
  },
  mounted() {
    this.creatingPost = _.cloneDeep(this.post);
    if (!this.creatingPost.data) {
      this.creatingPost.data = {};
      Object.assign(this.creatingPost.data, { options: this.options });
    }
  },
  computed: {
    ...mapState({
      post: (state) => _.cloneDeep(state.post.creatingPost),
      member: (state) => state.user.profile,
    }),
    capitalEffect() {
      return this.options.capitalEffect;
    },
    backgroundColor() {
      return this.options.backgroundColor;
    },
    fontColor() {
      return this.options.fontcolor;
    },
    fontSize() {
      return this.options.fontsize;
    },
    textAlign() {
      return this.textalignTypes.find((t) => t.value == this.align).text;
    },
    cap() {
      return this.creatingPost.subject.slice(0, 1);
    },
    text() {
      Object.assign(this.creatingPost.data, { options: this.options });
      return !this.options.capitalEffect ? this.creatingPost.subject : this.creatingPost.subject.slice(1, this.creatingPost.subject.length);
    },
    postType() {
      return getPostTypeByValue(this.creatingPost.postType);
    },
  },
  methods: {
    changeCap() {
      this.options.capitalEffect = !this.options.capitalEffect;
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
