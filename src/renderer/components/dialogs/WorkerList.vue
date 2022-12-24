<template>
  <v-dialog v-if="dataReady" v-model="changingWorker" scrollable max-width="450px" persistent light>
    <v-card class="px-2">
      <v-card-title class="my-0 py-0">
        <v-list-item-icon class="mr-0 pr-0">
          <svg width="38" height="38" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path :d="getIcon(node.name)" fill="#2c88ff" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-list-item-icon>
        <v-list-item-content class="text-center">
          <v-list-item-title>
            <task-subject :entity="changingWorker" :options="['popup', 'icon']" />
            {{ task.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">Select Workers </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn small right fab icon @click="close()">
          <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-btn>
      </v-card-title>
      <v-autocomplete class="mx-1" rounded v-model="invitingMember" dense hide-no-data autofocus item-text="name" item-value="name" :items="memberItems" :search-input.sync="searchMember" hide-details="true" solo-inverted ref="members" placeholder="Search for people">
        <template v-slot:item="data">
          <v-list-item-avatar>
            <v-img :src="data.item.avatar" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.name" />
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn :color="isInvited(data.item.id).color || 'accent'" class="mt-2" x-small :text="isInvited(data.item.id) && true" @click="!isInvited(data.item.id) && inviteMember()" v-text="isInvited(data.item.id).text || 'Invite to Team'"></v-btn>
          </v-list-item-icon>
        </template>
        <template v-slot:append>
          <v-btn color="primary" rounded x-small @click="doSearch(searchMember)">search</v-btn>
        </template>
      </v-autocomplete>
      <v-card-text style="height: 400px" class="px-1 mt-1">
        <v-card-title class="text-left text-subtitle-2 ma-1 pa-0">
          My Team:
        </v-card-title>
        <v-list-item-group v-model="selectedWorker" :multiple="true">
          <v-list-item v-for="(member, m) in members" :key="m" :class="selectedWorker.includes(m) ? 'primary' : ''" class="pl-3 pr-0 mx-0" style="text-align: left;border-radius:5px!important">
            <v-list-item-icon v-if="selectedWorker.includes(m)" class="mr-3 my-auto">
              <svg width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 35.590286,9.5800382 c -0.573351,0.01831 -1.09936,0.296418 -1.47461,0.6855468 L 19.728957,25.017538 13.340285,18.648397 c -0.832238,-0.827545 -2.202573,-0.838692 -3.046875,-0.02344 l -3.9433589,3.802734 h -0.002 c -0.865194,0.836135 -0.877305,2.249903 -0.02734,3.101563 v 0.002 L 18.209379,37.415973 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013673,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815988 -0.98915,-0.6237838 -1.5625,-0.6054688 z" fill="white" stop-color="#000000" style="paint-order: fill markers stroke" />
              </svg>
            </v-list-item-icon>
            <worker-list-item :selected="selectedWorker.includes(m)" :index="m" :member="member" />
          </v-list-item>
        </v-list-item-group>
      </v-card-text>
      <v-divider></v-divider>
      <!-- <v-card-actions class="text-center">
          <v-switch class="my-auto mx-auto" inset color="primary" v-model="notify" label="Notify Workers Now" dense hide-details="true"/>
      </v-card-actions> -->
      <v-card-actions class="my-2">
        <v-btn absolute left :outlined="selectedWorker.length !== 0" small fab color="secondary" @click="selectedWorker = []">
          <svg version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 20.353212,30.787077 q 0,-1.935949 0.517754,-3.4667 0.517753,-1.53075 1.260618,-2.61128 0.742864,-1.080529 1.95846,-2.521236 0.967974,-1.125551 1.508239,-1.890926 0.540265,-0.787887 0.900441,-1.710839 0.382688,-0.945464 0.382688,-2.048504 v -0.02251 q 0,-1.530751 -0.765375,-2.363659 Q 25.373173,13.296003 24,13.296003 q -1.350663,0 -2.116038,0.945463 -0.742864,0.922952 -0.765375,2.61128 v 0.02251 h -6.393134 v -0.02251 q 0.112555,-2.971457 1.238107,-5.064983 1.125552,-2.1160371 3.151545,-3.2190778 2.048504,-1.1030408 4.862384,-1.1030408 2.926434,0 5.01996,0.9904856 2.093527,0.9904855 3.174056,2.881413 1.103041,1.868415 1.103041,4.524718 v 0.02251 q 0,1.733349 -0.495243,3.129034 -0.472731,1.395684 -1.193085,2.453702 -0.697842,1.035508 -1.868416,2.408681 -1.10304,1.328151 -1.733349,2.228593 -0.607798,0.900441 -1.035508,2.093526 -0.42771,1.170574 -0.42771,2.588769 z m 0.02251,3.579255 h 6.168024 v 6.168023 h -6.168024 z"
              :fill="selectedWorker.length !== 0 ? '#353535' : 'white'"
            />
          </svg>
        </v-btn>
        <span class="ml-14" v-if="selectedWorker.length !== 0"> Set as Open Task </span>
        <span class="ml-14" v-else> No Workers (Open Task) </span>
        <v-spacer></v-spacer>
        <v-btn small class="px-2 mr-1" color="secondary" rounded @click="close()"> cancel </v-btn>
        <v-btn small class="px-2 mr-1" color="primary" rounded @click="saveMemberChange()"> ok </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CREDENTIALS from '../../enums/credentials';
import store from '../../store';
import _ from 'lodash';
import WorkerListItem from '../lists/WorkerListItem.vue';
import TaskSubject from '../lists/TaskSubject.vue';
import { memberRepository } from '../../store/modules/user/profileRepository';

export default {
  components: { WorkerListItem, TaskSubject },
  name: 'WorkerList',
  props: { open: Boolean },
  data() {
    return {
      selectedWorker: [],
      notify: false,
      choosing: false,
      searching: false,
      inviting: false,
      search: null,
      searchMember: '',
      memberItems: [],
      invitingMember: null,
    };
  },
  async mounted() {
    if (!this.dataReady) return;
    let listId = this.task.workers.map((w) => w.profile);
    listId.forEach((id) => {
      let index = this.members.indexOf(this.members.find((m) => m.member == id));
      this.selectedWorker.push(index);
    });
  },
  watch: {
    searchMember(value) {
      this.doSearch(value)
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
      user: (state) => state.user.user,
      members: (state) => state.user.members,
      invitations: (state) => _.cloneDeep(state.invitation.invitations),
      library: (state) => state.library.library,
    }),
    ...mapGetters({
      changingWorker: ['taskbox/changingWorker'],
    }),
    dataReady() {
      return this.changingWorker ? true : false;
    },
    task() {
      return this.changingWorker.task;
    },
    node() {
      return this.changingWorker.node;
    },
    credentials() {
      return Object.keys(CREDENTIALS);
    },
  },
  methods: {
    async doSearch(value) {
      // if (this.memberItems.length > 0) return;
      if (this.isLoading) return;
      this.isLoading = true;

      await memberRepository
        .search(value ? value.trim() : '')
        .then((res) => {
          this.$nextTick(() => {
            this.memberItems = res;
          });
        })
        .catch((err) => {
          this.$store.commit('SET_ERROR_STATE', err);
        })
        .finally(() => (this.isLoading = false));
    },
    getIcon(name) {
      if (!name) return;
      let type = this.library.blockLibrary.blocktypes.find((t) => t.name == name);
      return type.meta.typeicon;
    },
    updateCredential(value) {
      console.log(value);
    },
    saveMemberChange() {
      let workers = [];
      let count = 0;
      this.members.forEach((member) => {
        if (this.selectedWorker.includes(count)) {
          let worker = { profile: member.member, credentials: Object.values(CREDENTIALS)[this.credential] };
          workers.push(worker);
        }
        count++;
      });

      let entity = _.cloneDeep(this.changingWorker);
      entity.task.workers = workers;

      store.commit('taskbox/UPDATE_TASK', entity);

      // workers.forEach(async (worker) => {
      //   let task = {
      //     id: this.changingWorker.id,
      //     root: this.changingWorker.root,
      //     taskbox: this.changingWorker.taskbox,
      //     title: this.task.title,
      //     description: this.task.subject,
      //   };

      //   // store.dispatch('invitation/INVITE_FOR_TASK', { worker: worker, task: task });
      // });
      // eventBus.$emit('updateWorkers');
      this.close();
    },
    close() {
      store.commit('taskbox/CLOSE_WORKER_WINDOW');
    },
    isInvited() {
      return false;
      // let invitation = this.invitations.find((i) => i.invited == id);
      // return invitation ? invitation.status : false;
    },
    inviteMember() {
      this.invitingMember = null;
      this.$refs.members.blur();
      this.$store.dispatch('invitation/INVITE_MEMBER', this.memberItems[0].id).then(() => {
        this.updateList();
      });
    },
    async updateList() {
      this.loading = true;
      this.$store.dispatch('user/GET_MEMBERS').then(() => {
        this.$store.dispatch('invitation/FETCH_ALL').then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
      });
    },
  },
};
</script>

<style scoped>
.active {
  background-color: #d43dfa !important;
  color: white;
}
</style>
