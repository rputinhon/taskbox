<template>
  <v-list-item light :ripple="false" color="transparent" v-if="options && !options.includes('onlyAvatar') && member" :class="extraClass ? extraClass : ''" class="ma-0 pa-0 my-auto" :style="options && options.includes('reversed') ? `direction:rtl;min-height: ${height || 50}px !important;height: ${height || 50}px !important` : `direction:ltr;min-height: ${height || 50}px !important;height: ${height || 50}px !important`">
    <v-list-item-avatar :size="size || '28'" left class="my-0 py-0 overflow-visible">
      <v-tooltip :disabled="!options.includes('hover')" bottom transition="none">
        <template v-slot:activator="{ on: tooltip }">
          <v-avatar v-on="{ ...tooltip }" :size="size || '28'" color="grey" @click.prevent="busEvent && doBusEvent(member.id)">
            <v-img light :max-width="`${size - 2}px` || '26px'" :max-height="`${size - 2}px` || '26px'" v-if="member.profilePicture" :src="member.profilePicture" />
            <svg v-else width="30" height="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
              <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="white" />
            </svg>
          </v-avatar>
        </template>
        {{ member.username }}
      </v-tooltip>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title style="line-height: normal" :class="`ma-0 pa-0 text-h6 black--text text-${align || 'left'}`">
        {{ member.username }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="subtitle" class="text-left">
        <svg v-if="status" width="15" height="15" version="1.1" viewBox="0 0 48 30" xmlns="http://www.w3.org/2000/svg">
          <path :d="status.icon" :fill="status.color" />
        </svg>
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <div v-if="options.includes('connectionActions')">
      <v-list-item-action v-for="(action, a) in connectionStatus(member.id).actions" :key="a">
        <v-btn :ripple="false" v-if="!isMember(member.id) && !invitating(member.id)" x-small :depressed="!action.action" :color="action.color" @click.stop="connectionAction(action.action, member.id)"> {{ action.text }} </v-btn>
        <v-btn v-else-if="!isMember(member.id)" :ripple="false" x-small color="accent" @click="accept(invitation(member.id).id)"> accept </v-btn>
      </v-list-item-action>
    </div>
  </v-list-item>
  <v-btn elevation="0" :loading="loading" v-else-if="member" fab :style="hovering ? 'z-index:10!important' : ''" :width="`${size - 2}px` || '26px'" :height="`${size - 2}px` || '26px'" color="secondary" class="my-0 py-0 overflow-visible" @click="doBusEvent(member.id)" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <v-tooltip :disabled="!options.includes('hover')" bottom transition="none">
      <template v-slot:activator="{ on: tooltip }">
        <v-avatar v-on="{ ...tooltip }" :size="size || '28'" color="grey">
          <v-img :max-width="`${size - 2}px` || '26px'" :max-height="`${size - 2}px` || '26px'" v-if="member && member.profilePicture" :src="member.profilePicture" />
          <svg v-else width="30" height="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="white" />
          </svg>
          <svg v-if="iconOver" style="position: absolute; transform: scale(0.3)" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path :d="iconOver.icon" :fill="iconOver.color" />
          </svg>
        </v-avatar>
      </template>
      {{ member.username }}
    </v-tooltip>
  </v-btn>
</template>

<script>
import { memberRepository } from '../../store/modules/user/profileRepository';
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import _ from 'lodash';
import store from '../../store';
import { connectionStatus, getConnectionStatusByValue } from '../../store/models/ConnectionModel';

export default {
  name: 'MemberItem',
  props: { id: String,iconOver:Object, options: Array, size: Number, subtitle: String, align: String, badge: Object, status: Object, extraClass: String, height: Number, busEvent: String },
  data() {
    return {
      loadedMember: null,
      hovering: false,
      loading: true,
    };
  },
  mounted() {
    if (this.id) this.getMember();
    else
      setTimeout(() => {
        this.loading = false;
      }, 700);
  },
  watch: {
    id() {
      this.getMember();
    },
  },
  computed: {
    ...mapState({
      connectionList: (state) => state.connection.list,
      invited: (state) => state.connection.invited,
      members: (state) => state.connection.members,
      blocked: (state) => state.connection.blocked,
      canceled: (state) => state.connection.canceled,
      invitations: (state) => state.connection.invitations,
    }),
    profile() {
      return store.state.user.profile;
    },
    member() {
      return _.cloneDeep(this.loadedMember || (!this.loading && this.profile));
    },
    type() {
      return this.isInvitation ? 'guest' : 'host';
    },
  },
  methods: {
    invitating(id) {
      let value = this.invitations.find((i) => i.host == id);
      return value;
    },
    getInvition(id) {
      return this.invitations.find((c) => c.host == id);
    },
    accept(connection) {
      this.loading = true;
      this.$store.dispatch('connection/ACCEPT', connection).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    isInvition(id) {
      return this.invitations.find((c) => c.host == id) ? true : false;
    },
    isMember(member) {
      return this.members.map((e) => e.member).includes(member);
    },
    connectionAction(action, value) {
      console.log(action);
      if (!action) return;
      this.loading = true;
      this.$store.dispatch(action, value).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    connectionStatus(member) {
      if (this.invited.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.INVITED.value);
      if (this.members.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.ACCEPTED.value);
      if (this.blocked.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.BLOCKED.value);
      if (this.canceled.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.CANCELED.value);
      return getConnectionStatusByValue(connectionStatus.UNEXISTENT.value);
    },
    doBusEvent(value) {
      if (!this.busEvent) return;
      eventBus.$emit(this.busEvent, value);
    },
    memberType(id) {
      let invited = this.invitations.find((i) => i.guest == this.profile.id && i.host == id);
      return invited ? 'guest' : 'host';
    },
    async getMember() {
      memberRepository.get(this.id, ['_id', 'data.id', 'data.username', 'data.profilePicture']).then((member) => {
        this.loadedMember = member;
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    async blockMember() {},
    async removeMember() {},
  },
};
</script>
