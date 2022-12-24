<template>
  <v-card ref="post" hover height="auto" class="overflow-visible" @click="openPost()">
    <v-card-title class="py-3">
      <v-list-item style="min-width: auto; min-height: 30px !important" class="pa-0 ma-0">
        <v-list-item-avatar class="mr-3 pa-0">
          <v-avatar color="transparent" @click.stop="goToProfile(post.createdBy)">
            <member-item :id="post.createdBy" :options="['onlyAvatar', 'hover']" :size="35" />
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content class="py-0 my-0">
          <v-list-item-title class="text-h6 ma-0 pa-0 text-left" style="line-height: 1 !important">
            {{ post.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-left my-0 py-0">
            <small class="grey--text">{{ date(post.createdAt, 'DD/MM/YY HH:mm:ss') }}</small>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon class="my-auto py-0">
          <svg class="mr-2" style="pointer-events: none" width="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="icon" :fill="color" />
          </svg>
        </v-list-item-icon>
        <v-list-item-icon v-if="isMe(post.createdBy)" class="mx-0 mr-2 my-auto py-0">
          <post-menu :post="clone(post)" />
        </v-list-item-icon>
      </v-list-item>
    </v-card-title>
    <v-card flat rounded="0" min-height="450px" light>
      <component v-bind:is="componentType" :post="post" :task="task" @mounted="loading = false"> </component>
    </v-card>
    <v-system-bar align="center" justify="center" height="70" class="px-4">
      <v-spacer> </v-spacer>
      <post-comments v-if="false" :post="post" />
      <check :post="post" />
    </v-system-bar>
  </v-card>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { getPostTypeByValue, postType } from '../../store/models/PostModel';
import MemberItem from '../lists/MemberItem.vue';
import PostMenu from '../menus/PostMenu.vue';
import Check from './Check.vue';
import PostComments from './PostComments.vue';
import _ from 'lodash';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { taskRepository } from '../../store/modules/task/taskRepository';

export default {
  name: 'Post',
  props: { post: Object },
  components: { MemberItem, Check, PostComments, PostMenu },
  data() {
    return {
      loading: true,
      componentType: null,
      postTypeModel: 0,
      status: 0,
      task: null,
    };
  },
  mounted() {
    if (this.postType) {
      this.postTypeModel = this.postType.value;
      this.getComponentType(this.postType.componentType);
      if (this.isTask) {
        this.getTask(this.post.data.task);
      }
    }
  },
  watch: {
    postType(value) {
      if (value) this.getComponentType(value.componentType);
    },
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    icon() {
      return this.isTask ? this.status.icon : this.postType.icon;
    },
    color() {
      return this.isTask ? this.status.color : '#0187f3';
    },
    postType() {
      if (!this.post) return;
      return getPostTypeByValue(this.post.postType);
    },
    isTask() {
      return this.postType.value == postType.TASK.value;
    },
    isCandidate() {
      return this.candidats.includes(this.member.id);
    },
    candidats() {
      return this.post.data.candidats ? this.post.data.candidats.map((c) => c.member) : [];
    },
  },
  methods: {
    clone(post) {
      return _.cloneDeep(post);
    },
    date(date) {
      return moment(date).from();
    },
    isMe(id) {
      return id == this.member.id ? true : false;
    },
    openPost() {
      this.$store.commit('post/PREVIEW_POST', this.post);
    },
    changePostType(value) {
      this.$store.commit('post/CHANGE_POST_TYPE', value);
    },
    getComponentType(name) {
      this.componentType = () => import(`./types/${name}.vue`);
    },
    save() {
      this.$store.dispatch('post/SAVE', this.post);
    },
    close() {
      this.componentType = null;
      this.postTypeModel = 0;
      this.$store.commit('post/CLOSE_POST_CREATOR');
    },
    goToProfile(id) {
      this.$store.dispatch('user/GET_PROFILE', id).then((profile) => {
        this.$store.commit('app/SET_USER_FEED', profile);
        this.$store.commit('app/SET_MAIN_TAB', 1);
      });
    },
    async getTask(id) {
      taskRepository.find(id).then((task) => {
        if (task) {
          this.task = task;
          this.status = getStatusTypeByValue(task.status || 0);
        } else {
          let copy = _.cloneDeep(this.post);
          if (!copy.archived) Object.assign(copy, { archived: false });
          copy.archived = true;
          this.$store.dispatch('post/SAVE', copy);
        }
      });
    },
  },
};
</script>

<style>
/* ::-webkit-scrollbar {
  width: 0px !important;
  height: 5px !important;
}
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0px;
}
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 0px;
} */
</style>
