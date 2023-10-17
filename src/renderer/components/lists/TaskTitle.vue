<template>
  <RULE :rule="rules.EDIT" :returnCondition="true" :doc="task">
    <task-subject :status="status" :task="task" :options="['popup','right']" />
    <v-list-item-title class="text-subtitle-2" slot-scope="allow" :class="extraClass || ''" style="width: fit-content" v-if="!editingTitle" @click.stop="allow.value && options.includes('edit') ? (editingTitle = true) : null">
      {{ task.title }}
      <small v-if="options.includes('progress')"> | {{ task.progress }}% </small>
    </v-list-item-title>
    <v-text-field v-else-if="options.includes('edit')" height="14px" autofocus dense hide-details="true" v-model="title" @keydown.enter="updateTitle()" @keydown.escape="editingTitle = false" @blur="updateTitle()" />
  </RULE>
</template>

<script>
import RULES from '../../enums/rules';
import RULE from '../navigation/Rule.vue';
import _ from 'lodash';
import TaskSubject from './TaskSubject.vue';
import { getStatusTypeByValue } from '../../enums/taskstate';

export default {
  name: 'TaskTitle',
  components: { RULE,TaskSubject },
  props: { task: Object, options: Array, extraClass: String },
  data() {
    return {
      editingTitle: false,
      updatedTitle: null,
    };
  },
  computed: {
    rules() {
      return RULES;
    },
    rev() {
      return (this.task.due.reviews && this.task.due.reviews.length) || null;
    },
    title: {
      get() {
        return this.task.title;
      },
      set(value) {
        this.updatedTitle = value.trim().length !== 0 ? value : this.task.title;
      },
    },
    status() {
      this.refreshkey;
      return getStatusTypeByValue(this.task.status || 0);
    },
  },
  methods: {
    updateTitle() {
      if (!this.updatedTitle || this.updatedTitle.trim().length == 0) return (this.editingTitle = false);
      let copy = _.cloneDeep(this.task);
      copy.title = this.updatedTitle;

      this.$store.dispatch('taskbox/UPDATE_TASK', copy).then(() => {
        this.editingTitle = false;
      });
    },
  },
};
</script>
