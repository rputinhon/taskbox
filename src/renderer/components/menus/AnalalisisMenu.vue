<template>
  <v-card color="transparent" flat width="100%" style="pointer-events: none">
    <v-btn-toggle mandatory borderless v-model="type" group rounded color="transparent" style="pointer-events: all !important">
      <v-btn class="windowbar-button" height="20" v-for="(type, t) in types" :key="t" :outlined="t !== type" small>
        <span :style="t == selected ? 'color:#fafafa!important' : ''" class="text-caption">
          {{ type }}
        </span>
      </v-btn>
    </v-btn-toggle>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AnalisisMenu',
  data() {
    return {
      types: ['progress', 'duration', 'reviews', 'pauses', 'tasks'],
    };
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      analisis: (state) => state.taskbox.analisis,
    }),
    selected() {
      return this.types.indexOf(this.analysing);
    },
    type: {
      get() {
        return this.types.indexOf(this.analysing);
      },
      set(value) {
        this.$store.commit('taskbox/CHANGE_ANALISIS', this.types[value]);
      },
    },
  },
};
</script>

<style scoped>
.theme--dark.v-btn {
  color: #656565 !important;
}
.theme--light.v-btn--active:hover::before,
.theme--light.v-btn--active::before {
  color: #353535 !important;
}
</style>
