<template>
  <v-card width="600" :style="(absolute && 'position:absolute;bottom:0px') || ''" class="mt-1 py-1 pa-3" outlined color="transparent">
    <v-sparkline show-labels :height="height || 80" :auto-draw-duration="800" color="grey" label-size="6" v-model="percent" :gradient="gradients[gradient]" :smooth="radius" :padding="padding" :line-width="width" :stroke-linecap="lineCap" :gradient-direction="gradientDirection" :fill="fill" :type="type" :auto-line-width="autoLineWidth" auto-draw>
      <template v-slot:label="item">
        <a style="width: 5px; pointer-events: all" class="label" @click="frameTask(item)" v-html="item.index + 1" />
      </template>
    </v-sparkline>
  </v-card>
</template>

<script>
import { NodeView } from '../../libs/nodeview';
import { mapState } from 'vuex';

const _gradients = [['#222'], ['#42b3f4'], ['green', 'yellow', 'orange', 'red'], ['red', 'orange', 'yellow', 'green'], ['purple', 'violet'], ['#00c6ff', '#f0f', 'ff0'], ['#f72047', 'ffd200', '#1feaea']];
export default {
  props: { filtered: Array, height: Number, absolute: Boolean },
  name: 'Analysis',
  data() {
    return {
      gradients: _gradients,
      autoLineWidth: false,
      width: 2,
      radius: 12,
      padding: 10,
      lineCap: 'round',
      gradient: 3,
      gradientDirection: 'bottom',
      fill: false,
      type: 'trend',
    };
  },
  mounted() {
    if (this.filtered) this.$store.commit('taskbox/ANALISE', this.filtered);
  },
  watch: {
    filtered(value) {
      if (value) this.$store.commit('taskbox/ANALISE', value);
    },
    analysing(value) {
      if (value !== false) {
        switch (value) {
          case 'tasks':
            this.gradientDirection = 'top';
            break;
          case 'progress':
            this.gradientDirection = 'bottom';
            break;
          case 'duration':
            this.gradientDirection = 'top';
            break;
          case 'reviews':
            this.gradientDirection = 'top';
            break;
          case 'pauses':
            this.gradientDirection = 'top';
            break;
          default:
            break;
        }
        // this.$store.commit('taskbox/ANALISE', this.filtered || undefined);
      }
    },
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      analisis: (state) => state.taskbox.analisis,
    }),
    percent() {
      let list = Object.values(this.analisis);
      return list.map((a) => {
        if (!a[this.analysing]) return 0;
        return !isNaN(a[this.analysing].value) ? a[this.analysing].value : 0;
      });
    },
    labels() {
      let list = Object.values(this.analisis);
      let labels = [];
      let count = 0;
      list.forEach(() => {
        labels.push(count.toString());
        count++;
      });
      return labels;
    },
  },
  methods: {
    frameTask(t) {
      NodeView.frameNode(Object.keys(this.filtered || this.analisis)[t.index]);
    },
  },
};
</script>

<style>
.label:hover {
  color: white !important;
  font-size: 15px !important;
}
</style>
