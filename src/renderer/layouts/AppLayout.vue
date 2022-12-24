<template>
  <component :is="layout" id="main">
    <slot />
  
    <error :message="errorMessage" :show="showError" />
  </component>
</template>

<script>
import Error from '../components/dialogs/Error.vue';
import { mapState } from 'vuex';

const defaultLayout = 'AppLayoutWorkspace';

export default {
  name: 'AppLayout',
  components: { Error },
  data: () => ({
    loading: true,
    showError: null,
    maximized: false,
    firstTime: null,
  }),
  async created() {},
  watch: {
    showError(value) {
      return value !== null ? (this.showError = true) : (this.showError = false);
    },
  },
  computed: {
    ...mapState({
      errorMessage: (state) => state.errorState,
    }),
    layout() {
      const layout = this.$route.meta.layout || defaultLayout;
      return () => import(`./${layout}.vue`);
    },
  },
};
</script>

<style scoped>
#main {
  background: #121213;
}
</style>
