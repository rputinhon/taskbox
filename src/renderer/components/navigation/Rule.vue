<template>
  <div v-if="!returnCondition && ALLOWRULE" :style="`display:${display || 'inline'}!important`">
    <slot />
  </div>
  <div v-else-if="returnCondition" :style="`display:${display || 'inline'}!important`">
    <slot :value="ALLOWRULE" />
  </div>
</template>
<script>
import { allowRule } from '../../store/modules/user/user';
export default {
  name: 'Rule',
  props: { rule: Object, returnCondition: Boolean, doc: Object, display: String },
  data() {
    return {
      allow: false,
    };
  },
  methods: {
    ALLOWRULE() {
      console.log(allowRule(this.rule, this.doc));
      return allowRule(this.rule, this.doc);
    },
  },
};
</script>
