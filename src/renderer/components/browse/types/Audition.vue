<template>
  <v-card v-if="currentTask" height="450" class="overflow-y-auto overflow-x-hidden" flat color="transparent" @click.prevent>
    <v-layout column justify-center align-center style="height: auto" class="pa-0 px-3">
      <small v-if="true" style="font-size:12px" class="grey--text">status:<b class="primary--text"> Selecting Candidats </b></small>
      <candidate-list style="direction:rtl" :post="post" v-if="true" :options="['status', 'avatarList', 'action']"/>
      <v-btn v-else disabled icon fab left top>
        <svg :width="24" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path :d="status.icon" :fill="status.color" />
        </svg>
        <small :style="`color:${status.color}`">
          {{ status.text }}
        </small>
      </v-btn>
      <subject :task="currentTask" :options="['thumbnail','readOnly']" :thumbSize="250" />
    </v-layout>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { getPostTypeByValue } from '../../../store/models/PostModel';
import _ from 'lodash';
import Subject from '../../lists/Subject.vue';
import { taskRepository } from '../../../store/modules/task/taskRepository';
import { getStatusTypeByValue } from '../../../enums/taskstate';
import CandidateList from '../CandidateList.vue';

export default {
  components: { Subject, CandidateList },
  name: 'PostTask',
  props: { post: Object },
  data() {
    return {
      creatingPost: null,
      currentTask: null,
    };
  },
  mounted() {
    this.creatingPost = _.cloneDeep(this.post);
    this.getTask(this.post.data.task);
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    status(){
      return getStatusTypeByValue(this.currentTask.status)
    }, 
    postType() {
      return getPostTypeByValue(this.creatingPost.postType);
    },
  },
  methods: {
    async getTask(id) {
      if (this.task) this.currentTask = this.task;
      else {
        taskRepository.find(id).then((task) => {
          this.currentTask = task;
        });
      }
    },
  },
};
</script>
