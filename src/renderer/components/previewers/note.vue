<template>
    <v-sheet height="100%" width="100%" class="overflow-hidden">
      <v-card :color="status.color" class="pa-6 ma-0" style="width: 100%; height: 100%; overflow-y: auto;">
        <v-textarea :counter="max" :disabled="disabled" full-width ref="textarea" rows="16" :readonly="disabled" style="color:gray;line-height: 30px!important;font-size: 24px!important" type="text" placeholder="Type the note here." no-resize v-model="value" @keydown="onKeyDown" @keydown.tab.prevent @blur="setValue()" @keydown.esc="setValue()"> </v-textarea>
      </v-card>
    </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import _ from 'lodash';

export default {
  name: 'previewTypeNote',
  data() {
    return {
      editingTitle: false,
      updatedValue: null,
      max: 700,
    };
  },
  mounted() {
    eventBus.$emit('previewLoaded', false);
    this.updatedValue = this.value;
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
    }),
    task() {
      return this.auditingTask || this.previewingTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    value: {
      get() {
        console.log();
        return this.task.value;
      },
      set(value) {
        this.updatedValue = value;
      },
    },
    disabled() {
      return this.status.value == taskstate.PAUSED.value || this.status.value == taskstate.REPROVED.value ? true : false;
    },
  },
  methods: {
    setValue() {
      let entity = _.cloneDeep(this.previewingTask);
      entity.value = this.updatedValue;
      this.$store.dispatch('taskbox/UPDATE_TASK', entity);
    },
    onKeyDown(e) {
      if (e.keyCode !== 46 && e.keyCode !== 8 && this.updatedValue && this.updatedValue.length >= this.max) {
        e.preventDefault();
        return;
      }
    },
  },
};
</script>

<style scoped>
.theme--light.v-input input, .theme--light.v-input textarea {
    color: #545454;
}
</style>