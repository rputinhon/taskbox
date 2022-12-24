<template>
  <v-list-item class="inout my-0" style="min-height: 35px" :color="status.color" :class="(!flowing && 'disabled') || (connecting && 'connecting')" @click="preview()" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <io-item :size="25" :task="input" />
    <v-btn fab x-small class="ml-1" :outlined="!connecting && !connected" height="11" width="11" color="white" @click.stop="pickConnection($event, input, $el)"> </v-btn>
  </v-list-item>
</template>

<script>
import { createConnection } from '../NodeEditor/Components/IO/utils';
import { eventBus } from '../../../main';
import { getStatusTypeByValue } from '../../enums/taskstate';
// import { NodeView } from '../../libs/nodeview';
import IoItem from './IOItem.vue';

export default {
  components: { IoItem },
  name: 'StaticInput',
  props: { input: Object, taskbox: Object },
  data() {
    return {
      connecting: false,
      pickArea: null,
      hovering: false,
    };
  },
  async created() {
    // console.log(this.input);
    // this.connected = this.isconnected();

    eventBus.$on('updateExternalConnection', () => {
      this.removeConnectionPath();
    });

    // eventBus.$on('removeLastConnection', (request) => {
    //   if (request.input !== this.input.node) this.$store.commit('taskbox/REMOVE_EXTERNAL_CONNECTION', { conn: this.input, node: request.node });
    //   this.connected = this.isconnected();
    //   this.removeConnectionPath();
    // });

    // eventBus.$on('removeExternalConnection', (node) => {
    //   this.$store.commit('taskbox/REMOVE_EXTERNAL_CONNECTION', { conn: this.input, node: node });
    //   this.connected = this.isconnected();
    //   this.removeConnectionPath();
    //   NodeView.process();
    // });
  },
  watch: {
    data() {
      // NodeView.process();
    },
  },
  computed: {
    connected: {
      get() {
        return Object.values(this.$store.state.taskbox.root.tasks).find((t) => t.externalValue && t.externalValue == this.input.id);
      },
      set() {},
    },
    name() {
      if (!this.input) return 'not found';
      return this.input.title;
    },
    flowing() {
      if (!this.input) return false;
      return true;
    },
    extension() {
      if (!this.input) return false;
      return this.input.value && this.input.value.file ? this.input.value.file.extension : false;
    },
    status() {
      return getStatusTypeByValue(this.input ? this.input.status : 0);
    },
    data() {
      if (!this.input) return;
      return this.input.value;
    },
  },
  methods: {
    preview() {
      this.$store.commit('taskbox/PREVIEW_TASK', this.node.id);
    },
    isconnected() {
      return Object.keys(this.input.data.connections).length > 0 ? true : false;
    },
    pickConnection(e, item, el) {
      this.pickArea = createConnection(e, el, item);
      this.connecting = true;

      if (item) eventBus.$emit('connectFromExternalinput', item);

      this.pickArea.parent.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        this.removeConnectionPath();
      });
    },
    removeConnectionPath() {
      if (!this.pickArea) return;
      this.pickArea.connector.remove();
      // NodeView.connectingFromExtenal(null)
      this.connecting = false;
    },
  },
};
</script>

<style scoped>
.inout {
  overflow-wrap: break-word !important;
  max-width: 50px;
  word-break: break-all;
  padding-left: 8px;
  padding-right: 8px;
}

.inout:hover {
  max-width: max-content;
  padding-right: 0px;
}

.connecting {
  padding-right: 0px;
  max-width: max-content;
}

.connection .main-path {
  stroke-width: 6px !important;
  stroke-linecap: round;
}
</style>
