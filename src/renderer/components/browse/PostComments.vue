<template>
  <v-tooltip bottom transition="none">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu rounded="0" ref="bragmenu" right light :close-on-content-click="false" min-width="350">
        <template v-slot:activator="{ on: menu }">
          <v-btn right class="mx-1 mr-3" fab v-on="{ ...tooltip, ...menu }" icon x-small elevation="0" color="#eeeeee">
            <v-badge color="transparent" left offset-x="10" bottom offset-y="25" :value="hasComments" :content="commentsCount" />
            <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m 11.261719,7.7539062 c -3.0683087,0 -5.5390627,2.4707548 -5.5390628,5.5390628 v 17.167969 c 0,2.367414 1.4733254,4.374399 3.5546876,5.169921 2.2665232,2.646367 4.5316522,5.293927 6.7968752,7.941407 C 18.235316,41.048982 20.395001,38.52449 22.554688,36 h 14.36914 c 3.068308,0 5.53711,-2.470755 5.53711,-5.539062 V 13.292969 c 0,-3.068308 -2.468802,-5.5390628 -5.53711,-5.5390628 z M 16.25,14.964844 h 15.5 c 0.97378,0 1.757813,0.784033 1.757812,1.757812 0,0.97378 -0.784032,1.757813 -1.757812,1.757813 h -15.5 c -0.97378,0 -1.757815,-0.784033 -1.757812,-1.757813 0,-0.973779 0.784032,-1.757812 1.757812,-1.757812 z m 0,5.246094 h 15.5 c 0.97378,0 1.757813,0.784032 1.757812,1.757812 0,0.97378 -0.784032,1.757812 -1.757812,1.757812 h -15.5 c -0.97378,0 -1.757812,-0.784032 -1.757812,-1.757812 0,-0.97378 0.784032,-1.757812 1.757812,-1.757812 z m -0.08008,5.248046 h 6.550781 c 0.929517,0 1.679688,0.748218 1.679688,1.677735 v 0.158203 c 0,0.929517 -0.750171,1.677734 -1.679688,1.677734 h -6.550781 c -0.929517,0 -1.677736,-0.748217 -1.677734,-1.677734 v -0.158203 c 0,-0.929517 0.748217,-1.677735 1.677734,-1.677735 z"
                :fill="'#0187f3'"
              />
            </svg>
          </v-btn>
        </template>
        <v-card v-if="post" class="overflow-y-hidden">
          <v-layout fill-height column align-center justify-end style="height: 300px">
            <v-card color="background" height="100%" width="100%" ref="messages" class="pa-3 overflow-y-auto">
              <v-fade-transition hide-on-leave leave-absolute>
                <div v-if="!loading" key="0">
                  <v-list v-for="(message, i) in post.messages" :key="i" class="py-0 my-0" color="transparent">
                    <v-list-item :key="i" class="mt-0 pb-0 py-0 px-0 message" style="min-height: 15px !important; align-items: flex-end" :style="!isGuest(message.member) ? 'direction:ltr' : 'direction:rtl'">
                      <member-item v-show="chunkMessage(i, message.member)" :id="message.member" :size="25" :options="['onlyAvatar']" />
                      <v-card hover class="message" color="background" width="fit-content" max-width="200px" :class="!chunkMessage(i, message.member) ? 'mx-8' : 'root mx-2 mb-3'" @mouseenter="hovering = i" @mouseleave="hovering = null">
                        <v-list-item-content class="py-0">
                          <v-card-text class="text-caption px-2 text-left" style=" padding: 5px 5px; direction: ltr">
                            {{ message.text }}
                            <v-tooltip bottom transition="none" v-if="!isGuest(message.member) && hovering == i">
                              <template v-slot:activator="{ on: onTooltip }">
                                <v-btn icon x-small bottom rounded v-on="onTooltip" @click="deleteMessage(i)" height="19">
                                  <svg width="15" height="15" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z" fill="#fafafa" stop-color="#000000" style="paint-order: fill markers stroke" />
                                  </svg>
                                </v-btn>
                              </template>
                              Delete
                            </v-tooltip>
                          </v-card-text>
                        </v-list-item-content>
                      </v-card>
                    </v-list-item>
                  </v-list>
                  <empty v-show="!hasComments" :text="'no comments'" :icon="' '" />
                </div>
              </v-fade-transition>
            </v-card>
          </v-layout>
          <v-app-bar width="100%" bottom class="px-3" height="45" style="z-index: 15">
            <v-avatar size="28" color="grey">
              <v-img :max-width="'26px'" :max-height="'26px'" v-if="profile.profilePicture" :src="profile.profilePicture" />
              <svg v-else width="30" height="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="white" />
              </svg>
            </v-avatar>
            <v-text-field autofocus filled outlined :loading="loading" ref="msg" class="ml-2" :placeholder="`Add a Comment...`" hide-details="true" dense @keydown.enter="addComment()"> </v-text-field>
          </v-app-bar>
        </v-card>
      </v-menu>
    </template>
    Toggle Comments
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex';
import Empty from '../dialogs/Empty.vue';
import MemberItem from '../lists/MemberItem.vue';

export default {
  name: 'PostComments',
  components: {
    MemberItem,
    Empty,
  },
  props: {
    post: Object,
  },
  data() {
    return {
      loading: false,
      showMessages: false,
      messageList: [],
      hovering:false
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    hasComments() {
      return this.commentsCount > 0 ? true : false;
    },
    commentsCount() {
      return this.post.messages.length;
    },
    isEmpty() {
      return this.members.length == 0 ? true : false;
    },
  },
  methods: {
    isHost(id) {
      return id == this.profile.id;
    },
    isGuest(id) {
      return id !== this.profile.id ? true : false;
    },
    chunkMessage(i, member) {
      return (i + 1 < this.post.messages.length && member !== this.post.messages[i + 1].member) || i == this.post.messages.length - 1 ? true : false;
    },
    addComment() {
      this.$store.dispatch('post/ADD_COMMENT', { post: this.post.id, message: this.$refs.msg.initialValue }).then((message) => {
        console.log(message);
        this.$refs.msg.reset();
        this.$refs.msg.blur();
        this.post.messages.push(message);
        setTimeout(() => {
          this.scrollToEnd();
        }, 0);
      });
    },
    deleteComment(index) {
      if (!this.selectedMember.connection) return;
      this.$store.dispatch('connection/DELETE_MESSAGE', { connection: this.selectedMember.connection, index: index }).then(() => {
        this.$refs.msg.blur();
        this.getMessages(this.selectedMember, false);
      });
    },
    scrollToEnd() {
      const container = this.$refs.messages;
      if (container) container.scrollTop = container.scrollHeight;
      const textfield = this.$refs.msg;
      if (textfield) this.$refs.msg.focus();
    },
  },
};
</script>

<style scoped>
.message {
  text-align: left;
  margin: 0px;
  margin-bottom: 2px;
  padding-top: 0px;
  padding-bottom: 0px;
  min-height: 30px !important;
  max-height: 100px !important;
  border-radius: 10px;
}

.chunk {
  margin-left: 18px;
  margin-right: 18px;
}

.root {
  border-radius: 10px;
  border-end-start-radius: 0px !important;
}
</style>
