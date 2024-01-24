<template>
  <v-tabs v-model="messageTab" height="0px" background-color="#eeeeee">
    <v-tab-item tabindex="01" >
      <v-card-text style="min-height: 540px; height: 610px;background-color:#eeeeee" class="pa-2 py-4 overflow-x-hidden">
        <v-list v-for="(member, m) in members" :key="m" class="my-0 py-0" color="transparent">
          <v-list-item link style="text-align: left" @click="selectedMember = member">
            <v-badge dot color="warning" left offset-x="35" offset-y="10" :value="hasUnreadMessages(member.lastMessage)">
              <member-item :size="30" :id="member.member" :options="['status']" :status="lastMessageStatus(member.lastMessage)" :subtitle="member.lastMessage ? member.lastMessage.text : null" @statusAction="'';" />
            </v-badge>
          </v-list-item>
        </v-list>
        <empty
          v-if="isEmpty"
          :size="90"
          :extraClass="'mb-0 mr-2'"
          :text="'no members'"
          :icon="'m 9.7554768,1.9197794 c -5.2488448,0 -9.47435701,4.2255121 -9.47435701,9.4743566 v 10.826213 c 0,4.497199 0.87137051,6.433385 1.94975171,10.882023 0.608895,2.511693 2.0803879,4.665348 4.6648315,4.665348 2.5844434,0 3.853265,-2.211636 4.664831,-4.665348 l 0.465605,-1.407665 h 17.938958 c 5.248843,0 9.474356,-4.225512 9.474356,-9.474358 V 11.394136 c 0,-5.2488445 -4.225513,-9.4743566 -9.474356,-9.4743566 z M 10.851017,13.780554 A 3.367596,3.367596 0 0 1 14.21877,17.14779 3.367596,3.367596 0 0 1 10.851017,20.515543 3.367596,3.367596 0 0 1 7.4837808,17.14779 3.367596,3.367596 0 0 1 10.851017,13.780554 Z m 9.009269,0 a 3.367596,3.367596 0 0 1 3.367753,3.367236 3.367596,3.367596 0 0 1 -3.367753,3.367753 3.367596,3.367596 0 0 1 -3.367236,-3.367753 3.367596,3.367596 0 0 1 3.367236,-3.367236 z m 8.995833,0 a 3.367596,3.367596 0 0 1 3.367755,3.367236 3.367596,3.367596 0 0 1 -3.367755,3.367753 3.367596,3.367596 0 0 1 -3.367236,-3.367753 3.367596,3.367596 0 0 1 3.367236,-3.367236 z'"
        />
      </v-card-text>
    </v-tab-item>
    <v-tab-item tabindex="02">
      <v-app-bar width="100%" height="55px" elevation="2" style="z-index: 10">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on }">
            <v-btn class="ml-2" v-on="on" elevation="0" x-small fab @click="selectedMember = undefined" style="z-index: 200 !important">
              <svg style="transform: rotate(270deg)" width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" fill="#0067fb" />
              </svg>
            </v-btn>
          </template>
          Back
        </v-tooltip>
        <v-list-item v-if="selectedMember">
          <member-item :id="selectedMember.member" :align="'center'" :options="['reversed', 'username']" />
        <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab :loading="loading" @click="refresh()">
                <svg style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path
                    d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                    fill="grey"
                  />
                </svg>
              </v-btn>
            </template>
            refresh
          </v-tooltip>
        </v-list-item>
      </v-app-bar>
      <v-layout column align-center justify-start style="height: 510px;">
        <v-card-text style="width: 100%; height: auto; height: 100%" ref="messages" class="pa-3 overflow-y-auto">
          <v-fade-transition hide-on-leave leave-absolute>
            <div v-if="!loading" key="0">
              <v-list v-for="(message, i) in messageList" :key="i" class="py-0 my-0" color="transparent">
                <v-list-item :key="i" class="mt-0 pb-0 py-0 px-0 message" style="min-height: 15px !important; align-items: flex-end" :style="!isGuest(message.member) ? 'direction:ltr' : 'direction:rtl'">
                  <member-item v-show="chunkMessage(i, message.member)" :id="message.member" :size="25" :options="['onlyAvatar']" />
                  <v-card hover class="message" color="primary" width="fit-content" max-width="250px" height="fit-content" :class="!chunkMessage(i, message.member) ? 'mx-8' : 'root mx-2 mb-3'" @mouseenter="hovering = i" @mouseleave="hovering = null">
                    <v-list-item-content class="py-0">
                      <v-card-text class="text-caption px-2 text-left" style="color: white; padding: 5px 5px; direction: ltr">
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
            </div>
          </v-fade-transition>
        </v-card-text>
      </v-layout>
      <v-app-bar width="100%" bottom class="px-3" height="45" style="z-index: 15">
        <v-avatar size="28" color="grey">
          <v-img :max-width="'26px'" :max-height="'26px'" v-if="profile.profilePicture" :src="profile.profilePicture" />
          <svg v-else width="30" height="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="white" />
          </svg>
        </v-avatar>
        <v-text-field :loading="loading" ref="msg" class="ml-2" :placeholder="`type the message`" hide-details="true" dense @keydown.esc="msg = null" @Blur.esc="msg = null" @keydown.enter="sendMessage()"> </v-text-field>
      </v-app-bar>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { connectionStatus, getConnectionStatusByValue, getMessageStatusTypeByValue, messageStatus } from '../../store/models/ConnectionModel';
import { memberRepository } from '../../store/modules/user/profileRepository';
import Empty from '../dialogs/Empty.vue';
import MemberItem from '../lists/MemberItem.vue';

export default {
  name: 'Chat',
  props: { show: Boolean },
  components: {
    MemberItem,
    Empty,
  },
  data() {
    return {
      loading: false,
      isActive: false,
      showMessages: false,
      hovering: null,
      messageList: [],
      selectedMember: null,
      messageTab: 0,
      search: '',
    };
  },
  mounted() {
    // if (this.hasMessages) this.playSound();
  },
  watch: {
    selectedMember(value) {
      if (value) {
        this.messageTab = 1;
        this.getMessages(value, true);
      } else this.messageTab = 0;
    },
    async searchMember(value) {
      // if (this.memberItems.length > 0) return;
      if (this.loading && !value) return;
      this.loading = true;

      await memberRepository
        .search(value)
        .then((res) => {
          this.$nextTick(() => {
            this.memberItems = res;
          });
        })
        .catch((err) => {
          this.$store.commit('SET_ERROR_STATE', err);
        })
        .finally(() => (this.loading = false));
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
      members: (state) => state.connection.members,
      invitations: (state) => state.connection.invitations,
    }),
    hasMessages() {
      if (!this.members) return false;
      return this.members.filter((m) => m.lastMessage && m.lastMessage.status !== messageStatus.READ.value && !this.isHost(m.lastMessage.member)).length;
    },
    isEmpty() {
      return this.members.length == 0 ? true : false;
    },
  },
  methods: {
    refresh(){
      this.getMessages(this.selectedMember, true);
    },
    close() {
      this.$refs.chat.isActive = false;
    },
    getInvition(id) {
      return this.invitations.find((c) => c.host == id);
    },
    isInvition(id) {
      return this.invitations.find((c) => c.host == id) ? true : false;
    },
    isHost(id) {
      return id == this.profile.id;
    },
    isGuest(id) {
      return id !== this.profile.id ? true : false;
    },
    hasUnreadMessages(lastMessage) {
      return lastMessage && lastMessage.status !== messageStatus.READ.value && !this.isHost(lastMessage.member) ? true : false;
    },
    lastMessageStatus(message) {
      return message && this.isHost(message.member) ? getMessageStatusTypeByValue(message.status) : null;
    },
    statusAction(action, value) {
      if (!action) return;
      this.$store.dispatch(action, value);
    },
    chunkMessage(i, member) {
      return (i + 1 < this.messageList.length && member !== this.messageList[i + 1].member) || i == this.messageList.length - 1 ? true : false;
    },
    connectionStatus(member) {
      if (this.invited.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.INVITED.value);
      if (this.members.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.ACCEPTED.value);
      if (this.blocked.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.BLOCKED.value);
      if (this.canceled.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.CANCELED.value);
      return getConnectionStatusByValue(connectionStatus.UNEXISTENT.value);
    },
    accept(connection) {
      this.loading = true;
      this.$store.dispatch('connection/ACCEPT', connection).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    getMessages(value, reload) {
      if (!value || !value.connection) return;
      if (reload) this.loading = true;
      this.$store.dispatch('connection/GET_MESSAGES', value.connection).then((response) => {
        this.messageList.splice(0, this.messageList.length);
        this.$nextTick(() => {
          this.messageList = response || [];
          this.loading = false;
          setTimeout(() => {
            this.scrollToEnd();
          }, 100);
        });
      });
    },
    sendMessage() {
      if (this.$refs.msg.initialValue == '' || !this.$refs.msg.initialValue) return;
      this.$store.dispatch('connection/SEND_MESSAGE', { connection: this.selectedMember.connection, message: this.$refs.msg.initialValue }).then((message) => {
        this.$refs.msg.reset();
        this.$refs.msg.blur();
        this.messageList.push(message);
        setTimeout(() => {
          this.scrollToEnd();
        }, 0);
      });
    },
    deleteMessage(index) {
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
      if (textfield)
        setTimeout(() => {
          this.$refs.msg.focus();
        }, 100);
    },
    goToMemberArea() {
      eventBus.$emit('showProfile', this.profile.id);
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
