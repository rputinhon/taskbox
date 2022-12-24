<template>
  <v-menu rounded="0" left offset-y light :close-on-content-click="true" @click.stop>
    <template v-slot:activator="{ on: menu }">
      <v-btn v-on="{ ...menu }" x-small icon fab>
        <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M 12 20.345703 A 3.6551981 3.6551981 0 0 0 8.3457031 24 A 3.6551981 3.6551981 0 0 0 12 27.654297 A 3.6551981 3.6551981 0 0 0 15.654297 24 A 3.6551981 3.6551981 0 0 0 12 20.345703 z M 24 20.345703 A 3.6551981 3.6551981 0 0 0 20.345703 24 A 3.6551981 3.6551981 0 0 0 24 27.654297 A 3.6551981 3.6551981 0 0 0 27.654297 24 A 3.6551981 3.6551981 0 0 0 24 20.345703 z M 36 20.345703 A 3.6551981 3.6551981 0 0 0 32.345703 24 A 3.6551981 3.6551981 0 0 0 36 27.654297 A 3.6551981 3.6551981 0 0 0 39.654297 24 A 3.6551981 3.6551981 0 0 0 36 20.345703 z " fill="grey" />
        </svg>
      </v-btn>
    </template>
    <v-card class="mx-auto" max-width="400">
      <v-list>
        <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn text block small @click.stop="blockMember()"> Block </v-btn>
        </v-list-item>
        <v-list-item link style="min-height: 40px; height: 40px">
          <v-btn text block small @click.stop="deleteMember()"> Delete </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'MemberMenu',
  props: { id: String },
  methods: {
    blockMember() {
      console.log('blocked');
    },
    deleteMember() {
      this.$store.dispatch('user/DELETE_MEMBER', this.member.id);
      console.log('deleted');
    },
  },
};
</script>
