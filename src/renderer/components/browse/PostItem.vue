<template>
  <v-list-item v-if="post" link style="min-width: auto; min-height: 30px !important" class="pa-0 ma-0" @click="openPost()">
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
    <svg class="mr-2" style="pointer-events: none" width="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path :d="postType.icon" fill="#0187f3" />
    </svg>
  </v-list-item>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import { getPostTypeByValue } from '../../store/models/PostModel';
import MemberItem from '../lists/MemberItem.vue';

export default {
  name: 'PostItem',
  props: { post: Object },
  components: { MemberItem },
  data() {
    return {
      loading: true,
      componentType: null,
      postTypeModel: 0,
    };
  },
  mounted() {
    if (this.postType) {
      this.postTypeModel = this.postType.value;
      this.getComponentType(this.postType.componentType);
    }
  },
  computed: {
    ...mapState({
      member: (state) => state.user.profile,
    }),
    postType() {
      if (!this.post) return;
      return getPostTypeByValue(this.post.postType);
    },
  },
  methods: {
    date(date) {
      return moment(date).from();
    },
    getComponentType(name) {
      this.componentType = () => import(`./types/${name}.vue`);
    },
    goToProfile(id) {
      eventBus.$emit('showProfile', id);
    },
  },
};
</script>
