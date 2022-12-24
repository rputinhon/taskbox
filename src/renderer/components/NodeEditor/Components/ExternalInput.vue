<template>
  <v-chip v-if="externalInput"  :style="`border:1px solid #252525);z-index:${hoverSocket==index?-1:-index-2}`" link class="nodeIO" :color="status.color" @mouseenter="ishoverSocket(index)" @mouseleave="hoverSocket = null">
    <RULE :rule="rules.DELETE" :returnCondition="false">
      <template slot:apend>
        <v-tooltip top transition="none" v-if="hoverSocket==index">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn v-on="tooltip" class="text-h6 mr-1" x-small icon @click="$emit('remove', externalInput.id)"> x </v-btn>
          </template>
          remove
        </v-tooltip>
      </template>
    </RULE>
    <v-tooltip top transition="none">
      <template v-slot:activator="{ on: tooltip }">
        <span v-on="tooltip">
          {{ externalInput.title }}
        </span>
      </template>
      <span v-text="'flowing ?'" />
    </v-tooltip>
  </v-chip>
</template>

<script>
import { eventBus } from '../../../../main';
import { getStatusTypeByValue } from '../../../enums/taskstate';
import RULE from '../../navigation/Rule.vue';
import RULES from '../../../enums/rules';

export default {
  components: { RULE },
  name: 'ExternalInput',
  props: {  externalInput: Object, index: Number },
  data() {
    return {
      hoverSocket:null
    };
  },
  computed: {
    status() {
      return getStatusTypeByValue(this.externalInput ? this.externalInput.status : 0);
    },
    rules() {
      return RULES;
    },
  },
  methods: {
    removeExternalInput() {
      eventBus.$emit('removeExternalConnection', this.node);
    },
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
  },
};
</script>

<style scoped>
.nodeIO {
  opacity: 1;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
  color: white;
  position: fixed;
  padding-right: 40px;
  margin-top: 2px;
  right: 226px;
  height: 33px !important;
  z-index: -1;
}
</style>