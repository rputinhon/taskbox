<template>
  <v-card rounded="lg" width="100%" hover class="my-2" v-if="member">
    <v-list-item class="mx-0">
      <v-list-item-avatar left class="my-0 py-0">
        <v-avatar left size="40" rounded="lg" color="primary">
          <v-img v-if="member.avatar" :src="member.avatar" />
          <svg v-else width="23" height="23" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.25) translate(1 1)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
          </svg>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-left"> {{ member.name }} </v-list-item-title>
        <v-list-item-subtitle v-if="!isFromMe && isMember" class="text-left"> You're part of the team as: </v-list-item-subtitle>
        <v-list-item-subtitle v-if="!isFromMe && !isMember" class="text-left">Is asking you to join his team. </v-list-item-subtitle>
      </v-list-item-content>
      <v-chip link :color="invitation.status.color" v-if="isMember">
        <v-list-item-avatar size="25" class="ma-0 pa-0" style="top: -2px; left: -5px">
          <v-img v-if="profile.profilePicture" :src="profile.profilePicture" />
        </v-list-item-avatar>
        {{ invitation.status.text }}
      </v-chip>
      <v-btn v-else-if="!isFromMe" small right color="primary" rounded @click="join()"> join </v-btn>
      <v-btn v-else rounded :color="invitation.status.color" class="my-auto">
        {{ invitation.status.text }}
      </v-btn>
      <v-list-item-icon>
        <v-menu rounded="0" right offset-x light nudge-right="15" :close-on-content-click="false">
          <template v-slot:activator="{ on: menu }">
            <v-btn class="my-auto" v-on="{ ...menu }" fab x-small icon right>
              <svg width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="grey" />
              </svg>
            </v-btn>
          </template>
          <v-card class="mx-auto" max-width="400">
            <v-list>
              <v-list-item v-if="invitation.status.value > 1" link @click="leaveInvitation()">
                <v-list-item-title class="text-center" v-text="'Leave'"></v-list-item-title>
              </v-list-item>
              <v-list-item link @click="blockInvitation()">
                <v-list-item-title class="text-center" v-text="'Block'"></v-list-item-title>
              </v-list-item>
              <v-list-item link @click="cancelInvitation()">
                <v-list-item-title class="text-center" v-text="'Delete'"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-list-item-icon>
    </v-list-item>
  </v-card>
</template>

<script>
import memberstatus from '../../enums/memberstatus';
import { memberRepository } from '../../store/modules/user/profileRepository';
export default {
  name: 'InvitationItem',
  props: { invitation: Object, invitator: String, profile: Object },
  data() {
    return {
      member: null,
    };
  },
  mounted() {
    this.getMember();
  },
  computed: {
    isMember() {
      return this.invitation.status.value == memberstatus.MEMBER.value ? true : false;
    },
    isFromMe() {
      return this.invitation.invitator == this.invitator ? true : false;
    },
  },
  methods: {
    async getMember() {
      this.member = await this.$store.dispatch('user/GET_MEMBER', this.isFromMe ? this.invitation.invited : this.invitation.invitator);
    },
    async join() {
      if (!this.isMember) await this.$store.dispatch('invitation/JOIN_TEAM', { id: this.invitation.id });
    },
    async getInvitator(id) {
      let member = await memberRepository.find(id);
      if (member)
        return {
          id: member.id,
          avatar: member.profilePicture,
          name: member.username,
        };
    },
    async leaveInvitation() {
      if (!this.invitation.id) return;
      this.$store.dispatch('invitation/CHANGE_INVITE_STATUS', { id: this.invitation.id, status: memberstatus.QUIT });
    },
    async blockInvitation() {
      if (!this.invitation.id) return;
      this.$store.dispatch('invitation/CHANGE_INVITE_STATUS', { id: this.invitation.id, status: memberstatus.BLOCKED });
    },
    async cancelInvitation() {
      if (!this.invitation.id) return;
      this.$store.dispatch('invitation/DELETE_INVITATION', this.invitation.id);
    },
  },
};
</script>
