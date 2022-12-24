<template>
  <div v-show="DISPLAYLOD()" style="display: contents;">
    <slot />
  </div>
</template>
<script>
import LODTYPES from '../../enums/LOD';
import store from '../../store';
export default {
  name: 'Lod',
  props: { lod: Number},
  computed:{
    LODTYPE() {
      return LODTYPES;
    },
    currentLOD() {
      return store.state.taskbox.LOD || LODTYPES.HIGH;
    },
  },
  methods: {
    DISPLAYLOD() {
     return this.currentLOD >=  this.lod?true:false;
   },
  },
};
</script>
