<template>
  <LOD :lod="!disableLod ? LODTYPE.MEDIUM : 0.00001">
    <worker-avatar v-if="task" :task="task" :size="size || 60" :max="max || 5" :justify="justify" :ExtraClass="ExtraClass" :ExtraStyle="ExtraStyle" />
  </LOD>
</template>

<script>
import LODTYPES from '../../../enums/LOD';
import store from '../../../store';
import LOD from '../../navigation/Lod.vue';
import WorkerAvatar from './WorkerAvatar.vue';
export default {
  components: { WorkerAvatar, LOD },
  name: 'Worker',
  props: { task: Object,options:Array, size: Number, max: Number, justify: String, ExtraClass: String, ExtraStyle: String, disableLod: Boolean },
  data() {
    return {
      hasReviews: false,
    };
  },
  async created() {
  },
  computed: {
    LODTYPE() {
      return LODTYPES;
    },
    lod() {
      return store.state.taskbox.LOD || LODTYPES.HIGH;
    },
  },
  methods: {
    notify(value) {
      this.hasReviews = value;
    },
    toggleFlowing() {
      // store.commit('taskbox/toggleDataFlowing', this.node);
    },
    showReviewDialog() {
      // eventBus.$emit('review', this.node);
    },
  },
};
</script>
