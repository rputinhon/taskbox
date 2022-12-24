<template>
  <v-toolbar elevation="0" height="30px" class="px-3">
    <v-spacer></v-spacer>
    <a class="mx-1">+32</a>
    <v-avatar v-for="(member, m) in 10" size="20" color="grey" :key="m" />
    <v-avatar color="grey" size="20"> <span style="font-size: 10px; color: white">ME</span></v-avatar>
  </v-toolbar>
</template>

<script>
export default {
  name: 'MemberList',
};
</script>
