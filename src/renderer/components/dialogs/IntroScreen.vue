<template>
  <v-container fluid fill-height style="position: absolute; z-index: 100; margin: 0; width: 100vw; height: 100vh; background-color: white">
    <v-row align="center" justify="center">
      <v-list-item>
        <v-img  src="img/logo_worm_128_flat.png" style="margin-right:10px" width="110" height="110" contain>
        </v-img>
      </v-list-item>
      <v-list-item>
        <v-img height="25" contain min-width="80px" width="80px" src="tlogobox_text.png" />
      </v-list-item>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'IntroScreen',
};
</script>
