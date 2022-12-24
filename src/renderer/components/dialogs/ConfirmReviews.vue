<template>
  <v-dialog v-model="isOpen" max-width="370" persistent @keydown.escape="$emit('close')" @keydown.enter="yes()">
    <v-card class="pa-5">
      <v-card-title class="text-h5 text-center" style="display: block"> This task has reviews </v-card-title>

      <v-card-text> Do you want to set then Done? </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" text class="mr-4" @click="$emit('close')"> cancel </v-btn>
        <v-btn color="primary " text class="mr-4" @click="yes()"> yes </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { eventBus } from '../../../main';

export default {
  props: { open: Boolean, nodeId: String },
  data() {
    return {
      isOpen: false,
      changing: false,
    };
  },
  watch: {
    open(value) {
      this.isOpen = value;
    },
  },
  methods: {
    submit(event, args) {
      if (!event) return;
      eventBus.$emit(event, args);
      this.confirm.open = false;
    },
    cancel(event) {
      if (!event) return (this.confirm.open = false);
      eventBus.$emit(event);
      this.confirm.open = false;
    },
  },
};
</script>
