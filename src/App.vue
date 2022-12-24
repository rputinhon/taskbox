<template>
  <div id="app">
    <v-fade-transition leave-absolute>
      <intro-screen v-show="loading" />
    </v-fade-transition>
    <AppLayout>
      <router-view />
      <v-progress-linear v-if="loading" style="z-index: 1001" color="primary" fixed bottom indeterminate />
    </AppLayout>
  </div>
</template>

<script>
import IntroScreen from './renderer/components/dialogs/IntroScreen.vue';
export default {
  components: { IntroScreen },
  name: 'App',
  data() {
    return {
      loading: true,
    };
  },
  async created() {
    this.$store
      .dispatch('app/INIT_APP')
      .then(() => {
        this.$store
          .dispatch('user/INIT')
          .then(() => {
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
        throw error;
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
}
::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 2px;
}
::-webkit-scrollbar-track {
  background: rgba(100, 100, 100, 0.5);
  border-radius: 4px;
}
</style>
