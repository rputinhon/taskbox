<template>
  <v-tooltip bottom transition="none" z-index="1110">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu rounded="0" bottom offset-y z-index="1110" left light>
        <template v-slot:activator="{ on: menu }">
          <v-btn fab icon x-small v-on="{ ...menu, ...tooltip }" class="windowbar-button">
            <svg width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="#0187f3" />
            </svg>
          </v-btn>
        </template>
        <v-card>
          <v-list v-for="(action, a) in actions" :key="a" class="my-0 pa-1">
            <v-btn block x-small :color="action.color" @click="act(action)">
              {{ action.text }}
            </v-btn>
          </v-list>
        </v-card>
      </v-menu>
    </template>
    actions
  </v-tooltip>
</template>

<script>
export default {
  components: {},
  name: 'NotificationActionMenu',
  props: { actions: Array, targetId: String, notificationId: String },
  data() {
    return {};
  },
  methods: {
    act(args) {
      if (!this.targetId || !args.action) return;
      this.$store.dispatch('notification/UPDATE_STATUS', { id: this.notificationId, status: args.status }).then(() => {
        this.$store.dispatch(args.action, {
          id: this.targetId,
          invitation: this.notificationId,
        });
      });
    },
  },
};
</script>
