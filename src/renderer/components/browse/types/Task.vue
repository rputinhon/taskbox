<template>
  <v-card v-if="task" height="450" class="overflow-y-auto overflow-x-hidden" flat color="transparent" @click.prevent>
    <v-layout column justify-center align-center style="height: auto" class="pa-0 px-3">
      <small style="font-size: 12px" class="grey--text"
        ><b class="primary--text"> {{ status.text }} </b> | {{ task.progress }}%
      </small>
      <candidate-list style="direction: rtl" :post="post" v-if="open" :options="['status', 'avatarList', 'action']" />
      <subject :task="task" :options="['thumbnail', 'readOnly', 'progress']" :thumbSize="245" />
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { getPostTypeByValue } from '../../../store/models/PostModel';
import _ from 'lodash';
import Subject from '../../lists/Subject.vue';
import { getStatusTypeByValue } from '../../../enums/taskstate';
import CandidateList from '../CandidateList.vue';
import { isTaskOpen } from '../../../store/modules/task/task';

export default {
  components: { Subject, CandidateList },
  name: 'PostTask',
  props: { post: Object, task: Object },
  data() {
    return {
      creatingPost: null,
    };
  },
  mounted() {
    this.creatingPost = _.cloneDeep(this.post);
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    open() {
      return isTaskOpen(this.task);
    },
    postType() {
      return getPostTypeByValue(this.creatingPost.postType);
    },
  },
  methods: {},
};
</script>
