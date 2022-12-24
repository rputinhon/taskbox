<template>
  <v-app id="inspire">
    <window-bar />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script>
import WindowBar from '../components/dialogs/WindowBar.vue';

export default {
  name: 'AppLayoutDefault',
  components: {
    WindowBar,
  },
};
</script>

<style scoped>
#inspire {
  overflow: hidden !important;
  background: white !important;
  margin: 0px !important;
}

.v-input__slot {
  max-height: 30px;
}
</style>
