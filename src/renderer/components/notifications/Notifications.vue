<template>
  <v-expansion-panels v-if="notificationList.length > 0">
    <v-expansion-panel>
      <v-expansion-panel-header class="text-center pr-0">
        <v-card-title class="my-0 py-0 mx-0 px-0">
          <svg style="pointer-events: none; transform: rotate(90deg)" width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path d="m 13.349538,14.548979 9.024248,9.327129 -9.064666,8.904228 c -0.456758,0.448892 -0.470557,1.180664 -0.03104,1.646452 l 4.692425,4.858866 c 0.451174,0.477732 1.206203,0.493271 1.676614,0.03448 L 34.312947,24.924838 c 0.466697,-0.455364 0.473839,-1.203429 0.01609,-1.667826 L 19.682287,8.3225147 c -0.460596,-0.468702 -1.215881,-0.469211 -1.676997,-0.0011 l -4.661419,4.5716023 c -0.510333,0.564832 -0.469429,1.187136 0.0056,1.655926 z" fill="grey" />
          </svg>
          <v-badge inline color="error" dot value="true" class="ml-2"> {{ notificationList.length }} notifications </v-badge>
        </v-card-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list v-for="(notification, i) in notificationList" :key="i">
          <v-list-item v-if="notification.member">
            <v-list-item-avatar class="mr-4" color="grey" size="30">
              <v-img v-if="notification.member.profilePicture" :src="notification.member.profilePicture" />
              <svg version="1.1" height="30px" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
              </svg>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-left" v-html="notification.member.username" />
              <v-list-item-subtitle class="text-left"> {{ notification.type.messageTo }} </v-list-item-subtitle>
            </v-list-item-content>
            <notification-action-menu :actions="notification.type.actions" :targetId="notification.member.id" :notificationId="notification.id" />
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { memberRepository } from '../../store/modules/user/profileRepository';
import { mapState } from 'vuex';
import memberstatus from '../../enums/memberstatus';
import { getNotificationTypeByValue } from '../../enums/notificationtypes';
import NotificationActionMenu from '../menus/NotificationActionMenu.vue';
import notificationstatus, { getNotificationStatusByValue } from '../../enums/notificationstatus';

export default {
  components: { NotificationActionMenu },
  name: 'Notifications',
  props: {},
  data() {
    return {
      loading: false,
      refreshKey: 0,
      memberList: [],
    };
  },
  mounted() {
    this.getMembers();
  },
  watch: {
    notifications() {
      this.getMembers();
    },
  },
  computed: {
    ...mapState({
      notificationsReceived: (state) => state.notification.notificationsReceived,
      profile: (state) => state.user.profile,
      session: (state) => state.user.session.authenticated,
      people: (state) => state.user.members,
      invitations: (state) => state.invitation.invitations,
      toMeInvitations: (state) => state.invitation.toMe,
      fromMeInvitations: (state) => state.invitation.fromMe,
    }),
    members() {
      return this.people.filter((p) => p.status == memberstatus.MEMBER.value);
    },
    notificationList() {
      this.refreshKey;
      return this.notificationsReceived.filter(n=>n.status<notificationstatus.ACCEPTED.value).map((n) => {
        return {
          id:n.id,
          member: this.member(n.from),
          type: getNotificationTypeByValue(n.notificationType),
          status:getNotificationStatusByValue(n.status)
        };
      });
    },
  },
  methods: {
    member(id) {
      console.log(this.memberList);
      return this.memberList.find((m) => m.id == id);
    },
    async getMembers() {
      this.memberList.splice(0, this.memberList.lenght);
      memberRepository.getList([this.profile.id].concat(this.notificationsReceived.map((n) => n.from)), ['_id', 'data.id', 'data.username', 'data.profilePicture']).then((members) => {
        this.memberList = members;
        this.refreshKey++;
      });
    },
  },
};
</script>

<style scoped>
.message {
  min-height: 30px !important;
  max-height: 100px !important ;
}
</style>
