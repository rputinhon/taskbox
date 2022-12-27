<template>
  <v-sheet width="100%" class="windowbar-button overflow-hidden" color="grey lighten-2">
    <v-card-title class="text-subtitle-1 py-0" v-if="!searching">
      <v-list-item class="ma-0 pa-0" style="min-height: 40px; width: 100%">
        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> Roots </v-list-item-title>
        </v-list-item-content>
        <v-btn v-show="!searching" rounded x-small color="primary" class="mr-2" @click="newProject()"> new </v-btn>
        <task-sort v-if="false" :show="!searching" @update="updateSort" />
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="updateList()">
                <svg style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path
                    d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                    fill="grey"
                  />
                </svg>
              </v-btn>
            </template>
            refresh
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="searching = true">
                <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
            search
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-card-title>
    <v-card-title v-else class="py-0" style="height: 56px">
      <v-text-field v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append >
          <v-btn style="margin-right:-18px" color="primary" rounded x-small @click="(searching = false), (search = '')">close</v-btn>
        </template>
      </v-text-field>
    </v-card-title>
    <v-row class="px-6 pb-6" style="margin: 0px; width: 100%">
      <v-col v-for="(root, r) in filteredRoots" :key="r" cols="4" :sm="sm" :md="md" :lg="lg" :xl="xl" class="ma-0 my-1 pa-0">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on }">
            <v-card v-on="on" class="py-1 pb-3 px-2 mx-0" :color="!isOpen(root.id) ? 'transparent' : ''" hover :flat="!isOpen(root.id)" @click="openRoot(root.id)" @mouseover="hovering = root.id" @mouseleave="hovering = null" style="border: 2px solid #0187f3">
              <!-- <v-btn rounded x-small color="grey" absolute left top v-if="root.createdBy == 'offline'"> off </v-btn> -->
              <task-box-menu :hide="hovering !== root.id" :taskbox="root" :options="['thumbnail', 'delete', 'absolute', 'right']" />
              <div class="pa-0 mx-1 my-0">
                <svg  version="1.1" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(.34139 0 0 .34139 -8.5743 -59.818)">
                    <path d="m76.781 178.69c-8.9402 0.0545-18.945 3.0151-25.223 7.8928l-15.842 12.308c-3.5719 2.7752-5.3375 5.7089-5.3964 8.3673l-0.0258 1.6772v57.679h0.0396c0.13482 3.4095 3.1213 6.3251 8.7954 7.7947l42.732 11.067c10.262 2.6576 25.262-0.43892 33.633-6.9426l15.839-12.308c3.5262-2.7397 5.1603-5.6234 5.2805-8.2432l0.0422-1e-3 0.0913-59.258-0.0132 0.0164c-1e-3 -3.512-3.007-6.5268-8.8131-8.0305l-42.731-11.069c-2.5654-0.66441-5.4268-0.96847-8.4068-0.95031z" 
                    :fill="status(root.status).color" stroke-width="2.6384" />
                    <path d="m76.781 178.69c-8.9402 0.0545-18.945 3.0151-25.223 7.8928l-15.491 12.097c-6.2641 4.3386-5.8203 8.4888-5.7725 10.255-0.09826 4.0056 5.0536 6.7343 8.835 7.7947 12.599 3.5329 42.732 11.067 42.732 11.067 10.262 2.6576 23.182 0.74982 31.553-5.7538l17.919-13.496c3.5262-2.7397 5.6503-5.7787 5.4764-9.226-0.30655-6.0753-5.1602-7.4949-9.2388-8.6115l-42.381-11.069c-2.5654-0.66441-5.4268-0.96847-8.4068-0.95031z" 
                    style="filter:brightness(1.1)"
                    :fill="status(root.status).color" stroke-width="2.6384" />
                  </g>
                    <path transform="scale(0.25) translate(28 80)" :d="status(root.status).icon" fill="white"/>
                </svg>
                <v-list-item-content class="pa-0 ma-0 my-2">
                  <v-text-field autofocus v-if="editingTitle" v-model="root.title" dense hide-details="true" @keydown.enter="updateTitle()" @keydown.esc="editingTitle = false" @blur="editingTitle = false" />
                  <v-list-item-subtitle v-else class="text-center" style="cursor: pointer">
                    {{ root.title }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-progress-linear class="px-0" height="12px" rounded bottom :color="status(root.status).color" :value="root.progress">
                  <small style="font-size: 10px"> {{ root.progress || 0 }}% </small>
                </v-progress-linear>
              </div>
              <v-card-actions class="py-0 my-0"> </v-card-actions>
            </v-card>
          </template>
          Open: {{ root.title }}
        </v-tooltip>
      </v-col>
    </v-row>
    <empty v-show="isEmpty" :loading="loading" :size="100" :extraClass="''" :text="'empty'" :icon="icon" />
  </v-sheet>
</template>

<script>
import Empty from './Empty.vue';
import TaskSort from '../menus/TaskSort.vue';

import { mapState } from 'vuex';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import TaskBoxMenu from '../menus/TaskBoxMenu.vue';
import { eventBus } from '../../../main';
import apistate from '../../enums/apistate';

export default {
  name: 'Roots',
  components: {
    TaskSort,
    Empty,
    TaskBoxMenu,
  },
  props: {
    sm: Number,
    md: Number,
    lg: Number,
    xl: Number,
    options: Array,
  },
  data() {
    return {
      sortModel: 0,
      hovering: false,
      taskTab: 0,
      priority: [],
      search: '',
      editingTitle: false,
      loading: true,
      refreshing: false,
      searching: false,
      checkingInvitation: false,
      displayMode: 0,
      refreshKey: 0,
      icon: 'm 21.454744,3.5828806 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.8900701,11.239299 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 L 23.379756,44.05664 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 44.177101,9.8505477 43.03812,8.7077146 40.837524,8.1377851 L 24.641314,3.9431282 C 23.668977,3.6913041 22.584282,3.576034 21.454778,3.5829173 Z M 21.640477,5.55286 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 l 5.868296,1.5161893 -13.91,10.7510777 -6.8307416,-1.782339 C 7.7561209,15.930631 6.890686,15.202106 6.6931847,14.333415 6.8401002,13.649554 7.350863,12.922022 8.2447385,12.227511 L 14.181317,7.8864302 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.365143,2.0588434 7.805645,2.2060601 c 1.49195,0.3863975 2.35794,1.1105085 2.559676,1.9749195 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.872008,-1.818194 z m 10.545713,8.1531766 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 9.0960934,37.741273 C 7.6214911,37.358386 6.7587125,36.647266 6.5442135,35.795982 6.5332755,35.481773 6.5223775,35.167563 6.5114795,34.853354 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759408,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 26.014939 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z m -8.340974,3.007211 c -0.08912,2.18e-4 -0.177472,0.03172 -0.246378,0.092 l -0.0015,-0.03977 -5.422647,3.846922 -1.812746,-2.43181 c -0.115953,-0.155094 -0.3404,-0.191874 -0.504457,-0.08264 l -1.404197,0.933272 c -0.168288,0.11217 -0.208794,0.334735 -0.09044,0.494315 l 3.03138,4.078486 c 0.11748,0.158308 0.346956,0.194247 0.511468,0.07953 l 7.1699,-4.990706 c 0.165966,-0.11536 0.202683,-0.338638 0.08109,-0.495874 l -1.051003,-1.359755 -0.01248,0.01325 c -0.02295,-0.03978 -0.05353,-0.0753 -0.09044,-0.103698 -0.0502,-0.02301 -0.104023,-0.03366 -0.157495,-0.03353 z',
      displayTypes: [
        { cols: 4, name: 'Small Icon', icon: 'M 6.8665634,6.5042546 V 19.004255 H 19.366563 V 6.5042546 Z m 15.9999996,0 V 19.004255 H 35.366562 V 6.5042546 Z M 6.8665634,22.504255 V 35.004256 H 19.366563 V 22.504255 Z m 15.9999996,0 V 35.004256 H 35.366562 V 22.504255 Z' },
        { cols: 12, name: 'List', icon: 'M 4.9864359,5.9083071 V 13.292585 H 37.23253 V 5.9083071 Z m 0.01416,11.2485359 V 24.54112 H 37.24669 v -7.384277 z m 0,11.059081 v 7.384279 H 37.24669 v -7.384279 z' },
      ],
    };
  },
  created() {
    eventBus.$on('updateTaskList', () => {
      this.refreshKey++;
    });
  },
  mounted() {
    // this.priority = this.roots;
  },
  watch: {
    apiState(value) {
      if (value == apistate.LOADING) this.loading = true;
      if (value == apistate.DONE) this.loading = false;
      // else
      //   setTimeout(() => {
      //     this.loading = false;
      //   }, 700);
    },
    isEmpty() {
      // if(this.loading)
      this.loading = false;
      this.refreshing = false;
    },
  },
  computed: {
    ...mapState({
      recent: (state) => state.taskbox.recent,
      root: (state) => state.taskbox.root,
      roots: (state) => state.user.roots,
      members: (state) => state.user.members,
      profile: (state) => state.user.profile,
      // loading:(state) => state.taskbox.loading,
      apiState: (state) => state.apiState,
    }),
    isEmpty() {
      return !this.filteredRoots.length;
    },
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    hasInvitations() {
      return false;
    },
    filteredRoots() {
      this.refreshKey;
      let sort = this.sortModel;
      return this.roots
        .filter((t) => (t.title ? t.title.toLowerCase().includes(this.search) : t))
        .sort(function (a, b) {
          if (a.title > b.title) return !sort ? 1 : -1;
          if (a.title < b.title) return !sort ? -1 : 1;
          return 0;
        });
    },
  },
  methods: {
    newProject() {
      eventBus.$emit('newProject');
    },
    openRoot(id) {
      if (this.root && this.root.id == id) return;
      this.$store.dispatch('taskbox/OPEN_TASKBOX', { deeper: false, id: id, isRoot: true }).then(() => {
        // this.$store.commit('app/TOGGLE_MEMBER_AREA', false);
      });
    },
    getMember(id) {
      // console.log(this.members);
      return this.members.find((m) => m.member == id);
    },
    isOpen(id) {
      return this.$store.getters['taskbox/currentTaskBoxId'] == id ? true : false;
    },
    updateSort(value) {
      this.sortModel = value;
    },
    updateList() {
      eventBus.$emit('setWorking',true)
      this.refreshing = true;
      this.$store.dispatch('user/GET_TASKS', { member: null }).then(() => {
        setTimeout(() => {
          this.refreshing = false;
          eventBus.$emit('setWorking',false)
        }, 1000);
      });
    },
    filteredList(list) {
      if (!list) return [];
      return list
        .filter((t) => t.title.toLowerCase().includes(this.search))
        .sort(function (a, b) {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        });
    },
    status(s) {
      return getStatusTypeByValue(s);
    },
    completed(status) {
      return status.value == taskstate.DONE.value ? true : false;
    },
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
  padding-bottom: 10px !important;
}
.theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
  color: rgb(199, 199, 199) !important;
  font-size: 16px;
  position: absolute;
  right: 10px;
  top: 30px;
  margin-right: 10px;
}
</style>

<style scoped>
.mytasks {
  background-color: #e0e0e0;
  overflow-y: auto;
  overflow-x: hidden;
}

.draggableitem {
  overflow: visible;
  padding: 0px;
  margin: 3px 0px;
  border: 2px solid transparent;
}

.ghost {
  background: rgb(187, 187, 187) !important;
  background-blend-mode: multiply;
  opacity: 0.3;
  pointer-events: none;
  /* border: 2px solid #bebebe; */
}
.drag {
  cursor: grabbing !important;
  background: rgba(255, 255, 255, 1) !important;
  box-shadow: -5px 8px 15px rgba(0, 0, 0, 0.3) !important;
  position: absolute;
  transform: rotateZ(-1deg);
  opacity: 1 !important;
}
</style>
