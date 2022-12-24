<template>
  <v-dialog v-if="post" :scrollable="false" :fullscreen="false" overlay-opacity="0.9" width="512px" class="overflow-hidden" style="min-width: auto" v-model="show" light>
    <v-card ref="post" hover height="auto" class="overflow-visible">
      <v-card-title class="py-3">
        <v-list-item style="min-width: auto; min-height: 30px !important" class="pa-0 ma-0">
          <v-list-item-avatar class="mr-3 pa-0">
            <v-tooltip bottom transition="none">
              <template v-slot:activator="{ on }">
                <v-avatar v-on="on" color="transparent" @click.stop="goToProfile(post.createdBy)">
                  <member-item :id="post.createdBy" :options="['onlyAvatar']" :size="35" />
                </v-avatar>
              </template>
              go to profile
            </v-tooltip>
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
            <post-menu :post="post" />
          </v-list-item-icon>
        </v-list-item>
      </v-card-title>
      <v-card flat rounded="0" min-height="450px" light>
        <component v-bind:is="componentType" :task="task" :post="post" @mounted="loading = false"> </component>
      </v-card>
      <v-system-bar align="center" justify="center" height="70" class="px-4">
        <post-comments v-if="false" :post="post" />
        <v-spacer> </v-spacer>
        <check :post="post" />
      </v-system-bar>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { getPostTypeByValue, postType, shareWith } from '../../store/models/PostModel';
import MemberItem from '../lists/MemberItem.vue';
import Check from './Check.vue';
import _ from 'lodash';
import PostComments from './PostComments.vue';
import moment from 'moment';
import PostMenu from '../menus/PostMenu.vue';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { taskRepository } from '../../store/modules/task/taskRepository';

export default {
  components: { MemberItem, Check, PostComments, PostMenu },
  name: 'PostPreview',
  data() {
    return {
      componentType: null,
      postTypeModel: 0,
      showComments: false,
      show: false,
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
    show(value) {
      if (!value) this.close();
    },
    post(value) {
      if (value) this.show = true;
    },
    postType(value) {
      if (value) {
        this.postTypeModel = value.value;
        this.getComponentType(value.componentType);
        if (this.isTask) this.getTaskStatus();
      }
    },
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
      post: (state) => _.cloneDeep(state.post.previewingPost),
    }),
    isTask() {
      return this.postType.value == postType.TASK.value;
    },
    icon() {
      return this.isTask ? this.status.icon : this.postType.icon;
    },
    color() {
      return this.isTask ? this.status.color : '#0187f3';
    },
    shareTypes() {
      return Object.values(shareWith);
    },
    postType() {
      if (!this.post) return;
      return getPostTypeByValue(this.post.postType);
    },
  },
  methods: {
    date(date) {
      return moment(date).from();
    },
    isMe(id) {
      return id == this.member.id ? true : false;
    },
    getTaskStatus() {
      this.$store.dispatch('task/GET_FIELD', { task: this.post.data.task, field: 'status' }).then((status) => {
        this.status = getStatusTypeByValue(status || 0);
      });
    },
    getComponentType(name) {
      this.componentType = () => import(`./types/${name}.vue`);
    },
    save() {
      this.$store.dispatch('post/SAVE', this.post);
    },
    close() {
      this.$store.commit('post/CLOSE_PREVIEW_POST');
    },
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
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
