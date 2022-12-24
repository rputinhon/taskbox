<template>
  <v-list-item color="red" class="pa-0 ma-0" style="width: fit-content" :style="`heigth:${size}`" @click.stop>
    <v-list class="py-0" v-for="(member, m) in list" :key="m" :style="`${concat && m > 0 && m < max + 1 ? `margin-left:-${concat}px` : ''};background-color:transparent;`">
      <member-item  v-if="m < max && !excluded(member)" :iconOver="Audition && getStatus(member)" :id="member" :options="['onlyAvatar', 'bordered', 'hover']" :align="'left'" :size="size || 30" :height="size || 35" :busEvent="avatarClick ? 'showProfile' : ''" />
      <v-menu v-else-if="m < max + 1 && !excluded(member)" rounded="0" transition="none" class="overflow-hidden" bottom offset-y light open-on-hover>
        <template v-slot:activator="{ on: menu }">
          <v-avatar :size="size || 30" class="pa-3" style="pointer-events: all;cursor:pointer" color="grey darken-1" v-on="{ ...menu }">
            <span class="white--text text-h4" :style="`font-size:auto!important`">{{ hiddenMembers }} +</span>
          </v-avatar>
        </template>
        <v-card max-height="300">
          <v-list class="px-3" v-for="member in concatCandidats()" :key="member">
            <v-list-item link style="min-height: 35px !important">
              <member-item  :id="member" :options="['username']" :align="'left'" :size="35" :height="35" :busEvent="avatarClick ? 'showProfile' : ''" />
            </v-list-item>
            <v-avatar v-if="!hasMembers" size="30" color="grey darken-1">
              <small class="white--text">?</small>
            </v-avatar>
          </v-list>
        </v-card>
      </v-menu>
    </v-list>
  </v-list-item>
</template>

<script>
import MemberItem from '../lists/MemberItem.vue';
import _ from 'lodash';
import store from '../../store';
import { getAuditionStatusByValue } from '../../enums/auditionstatus';

export default {
  name: 'AvatarList',
  props: { list: Array, Audition: Object, concat: Number, max: Number, exclude: Array, size: Number, avatarClick: String },
  components: { MemberItem },
  data() {
    return {
      hovering: false,
      loading: false,
    };
  },
  computed: {
    user() {
      return store.state.user.profile;
    },
    hiddenMembers() {
      return Math.abs(this.max - this.membersCount);
    },
    hasMembers() {
      return this.membersCount > 0 ? true : false;
    },
    membersCount() {
      return this.list.length;
    },
  },
  methods: {
    getStatus(member){
      return getAuditionStatusByValue(this.Audition[member].status || 0);
    },
    excluded(member) {
      if (!this.exclude) return false;
      return this.exclude.includes(member) ? true : false;
    },
    concatCandidats() {
      let copy = _.cloneDeep(this.list);
      return copy.splice(this.max, this.list.length);
    },
  },
};
</script>
