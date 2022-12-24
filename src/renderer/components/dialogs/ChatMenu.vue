<template>
  <v-menu ref="chatMenu" rounded="lg" style="z-index: 10" min-width="260px" max-width="260px" nudge-right="130px" :close-on-content-click="false">
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn  elevation="0" class="ml-2" x-small fab icon rounded v-on="{ ...onMenu, ...onTooltip }" @click="showReview = false">
            <v-badge dot :color="hasReviews ? 'warning' : 'primary'" :value="hasMessages || hasReviews || false">
              <v-avatar :color="hasReviews ? 'warning' : 'grey'" size="28">
                <v-img  v-if="worker && worker.profilePicture" :src="worker.profilePicture" />
                <svg v-else version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                  <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                </svg>
              </v-avatar>
            </v-badge>
          </v-btn>
        </template>
        Messages
      </v-tooltip>
    </template>

    <v-app-bar dense top class="pl-3" max-height="45px">
      <v-tabs v-model="tab" height="45px">
        <v-tab>
          <v-badge avatar dot color="primary" :value="hasMessages"> Messages </v-badge>
        </v-tab>
        <v-tab>
          <v-badge avatar dot color="warning" :value="hasReviews"> Reviews </v-badge>
        </v-tab>
      </v-tabs>
      <v-btn absolute right small fab icon @click="closeChat()">
        <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
        </svg>
      </v-btn>
    </v-app-bar>

    <v-card rounded="0" v-if="chat">
      <v-tabs v-model="tab" height="0">
        <v-tab-item>
          <chat :messages="chat.messages"  :status="status" @deleteMessage="deleteMessage" />
        </v-tab-item>
        <v-tab-item >
          <review :reviews="chat.reviews"  :status="status" :hasReviews="hasReviews" @addReview="addReview()" @AprooveReview="AprooveReview" @deleteMessage="deleteReviewMessage" @deleteReview="deleteReview" />
        </v-tab-item>
      </v-tabs>
      <v-card-actions>
        <v-text-field :disabled="tab==0 && !hasReviews?true:false" v-model="msg" filled :placeholder="`type the ${tab==1?'message':'review note'}`" hide-details="true" dense @keydown.enter="tab == 0 ? addMessage() : AddReviewMessage()" @blur="msg = null" />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>

import Chat from '../menus/User.vue';
import Review from '../forms/Review.vue';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { mapState } from 'vuex';

import _ from 'lodash';

export default {
  components: { Chat, Review },
  name: 'ChatMenu',
  props: { node:Object, chat: Object },
  data() {
    return {
      statusTypes: [],
      progressChanged: false,
      statusModel: 0,
      tab: 0,
      loading: true,
      msg: null,
    };
  },
  async mounted() {
    // this.$listeners.getMessages();
  },
  computed: {
    ...mapState({
      user: (state) => _.cloneDeep(state.user.user),
    }),
    profile() {
      if (!this.user) return null;
      return this.user.metadata.profile;
    },
    worker() {
      if(!this.node.data.task)return;
      return this.node.data.task.workers[0];
    },
    hasMessages() {
      if (!this.chat) return;
      return this.chat.messages.lenght > 0 ? true:false;
    },
    hasReviews() {
      if (!this.chat) return;
      if (this.chat.reviews.lenght == 0) return false;
      return this.chat.reviews.filter((r) => r.aprooved == false).length > 0 ? true : false;
    },
    status() {
      return getStatusTypeByValue(this.node.data.task.status);
    },
  },
  methods: {
    // getIcon(name) {
    //   let iconIndex = 0;
    //   if (this.node.meta.options) {
    //     iconIndex = this.node.data.textype;
    //     name = this.node.meta.options[this.node.data.selected].name;
    //   }
    //   return iconTypes[name.toLowerCase()][iconIndex];
    // },
    
    closeChat() {
      this.$refs.chatMenu.isActive = false;
    },
  },
};
</script>
