<template>
  <v-tooltip bottom transition="none">
    <template v-slot:activator="{ on: tooltip }">
      <v-btn v-on="{ ...tooltip }" class="ml-1 px-2" large elevation="0" outlined rounded color="primary" @click.stop="beCandidate()">
        task it
        <v-avatar size="35" color="grey" class="mr-2">
          <v-img :max-width="`${size ? size - 2 : 33}px`" :max-height="`${size ? size - 2 : 33}px`" v-if="user.profilePicture" :src="user.profilePicture" />
          <svg v-else width="30" height="30" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="white" />
          </svg>
        </v-avatar>
      </v-btn>
    </template>
    Click to be a candidate
  </v-tooltip>
</template>

<script>
import { eventBus } from '../../../main';
import { mapState } from 'vuex';

export default {
  name: 'BeCandidate',
  props: { task: String, disabled: Boolean, options: Array, size: Number },
  data() {
    return {
      hovering: false,
      candidats: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.profile,
      members: (state) => state.connection.members,
    }),
  },
  methods: {
    beCandidate() {
      this.$store.dispatch('task/CANDIDATE_TO_TASK', { task: this.task, member: this.user.id }).then((candidateList) => {
        this.$listeners.updateList(candidateList.map((c) => c.member));
      });
    },
    goToProfile(id) {
      console.log(id);
      eventBus.$emit('showProfile', id);
    },
  },
};
</script>
