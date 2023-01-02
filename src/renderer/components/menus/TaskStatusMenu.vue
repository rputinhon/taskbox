<template>
  <v-tooltip bottom transition="none" v-if="task" :disabled="options.includes('readonly')">
    <template v-slot:activator="{ on: onTooltip }">
      <v-menu rounded="lg" left bottom offset-y light :disabled="options.includes('readonly')" nudge-top="11" transition="none" :close-on-content-click="false" @click="checkHasPost()">
        <template v-slot:activator="{ on: onMenu }">
          <RULE :rule="rules.EDIT" :doc="task" :returnCondition="true">
            <v-btn v-on="{ ...onMenu, ...onTooltip }" :loading="loading" slot-scope="allow" :width="size || 'auto'" :height="size || '30px'" class="windowbar-button" rounded :disabled="!allow.value" :class="extraClass && extraClass" :left="options.includes('left')" :elevation="options.includes('flat') ? 0 : 2" :fab="options.includes('fab') && !reviewing" :icon="options.includes('icon') || loading" :absolute="options.includes('absolute')" :outlined="options.includes('outlined') && !taskDone && !reviewing" :color="loading ? 'primary' : 'transparent'" :right="options.includes('right')" :x-small="!options.includes('small')" :style="extraStyle && extraStyle" @mouseenter="hovering = true" @mouseleave="hovering = false">
              <small class="mx-1" :style="`font-size:11px;color:${!options.includes('white') ? status.color : 'white'}`" v-if="started && !taskDone && !reviewing && !reproved">{{ task.progress }}%</small>
              <svg  :width="size ? size : 26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path  :d="workers.length || isTaskBox ? status.icon : noWorkersIcon" 
                :fill="!options.includes('white') ? status.color : '#fafafa'" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
              </svg>
            </v-btn>
          </RULE>
        </template>
        <v-card rounded="lg" min-width="350" max-height="600" class="pa-1 py-2 my-0 overflow-hidden">
          <v-btn-toggle rounded mandatory v-model="taskStatus" @change="updateStatus()">
            <v-item-group v-for="(item, i) in statusTypes" :key="i" class="my-auto">
              <v-tooltip v-if="item" bottom transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn :disabled="disabledByStatus(i)" icon v-on="onTooltip" v-show="!hideItems.includes(i) && !hiddenByStatus(i)">
                    <svg width="30" height="30" version="1.1" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
                      <path :d="item.icon" :fill="i == task.status ? item.color : 'grey'" :opacity="disabledByStatus(i) ? 0.3 : 1" />
                    </svg>
                  </v-btn>
                </template>
                Set {{ task.name == 'TaskBox' ? ' TaskBox ' : 'Task ' }}status to {{ item.text }}
              </v-tooltip>
            </v-item-group>
          </v-btn-toggle>
          <!-- <small v-else-if="options.includes('reviews')" class="grey--text">Solve Open Reviews</small> -->
          <v-list-item class="my-0" v-if="options.includes('progress')">
            <v-list-item-content class="py-0">
              <v-list-item-subtitle class="py-0">
                <v-slider v-if="!isTaskBox && !isAudition && started && !taskDone && !reviewing" :label="`${task.progress}%`" style="z-index: 20" class="my-5 py-0" :thumb-label="true" :thumb-color="status.color" :disabled="isDisabled" hide-details="true" v-model="progress" :thumb-size="20" @click.stop @change="updateProgress()"> </v-slider>
                <v-progress-linear v-else rounded height="20" :color="status.color" :value="task.progress">
                  <small> {{ task.progress }}%</small>
                </v-progress-linear>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-menu v-if="hasReviews || reviewing && false" rounded="0" top left offset-x light :close-on-content-click="false">
              <template v-slot:activator="{ on: menu }">
                <v-btn v-on="{ ...menu }" depressed x-small class="auditionBit auditing" :color="reviewStatus.color"> rev </v-btn>
              </template>
              <v-card flat class="mx-auto" max-width="400" color="background">
                <review :task="task" :allowAddReview="false" />
              </v-card>
            </v-menu>

            <!-- <v-btn v-if="taskDone && options.includes('reviews')" :elevation="0" class="ml-2 px-1" x-small color="warning" @click="addReview()"> + rev</v-btn> -->
          </v-list-item>

          <v-list-item v-if="open && hasPost">
            <v-list-item-content>
              <v-list-item-title>
                <v-spacer><small class="primary--text">candidats</small></v-spacer>
              </v-list-item-title>
              <v-list-item-subtitle>
                <candidate-list :task="task" :options="['avatarList']" />
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="authenticated && options.includes('workers')">
            <v-list-item-content class="pb-0">
              <!-- <small class="primary--text mr-2" style="text-transform: lowercase"> workers </small> -->
              <v-list-item-title style="height: 45px">
                <v-btn class="pl-2 pr-0" color="background" depressed block rounded @click.prevent>
                  <small v-if="workers.length == 0" style="margin-left:80px;color: grey">select task workers</small>
                  <avatar-list :size="30" :concat="3" :max="8" :list="workers" />
                  <v-tooltip bottom transition="fade">
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-menu rounded="lg" ref="memberpicker" min-width="210" right top :close-on-content-click="false">
                        <template v-slot:activator="{ on: onMenu }">
                          <v-btn fixed icon right v-on="{ ...onMenu, ...onTooltip }" rounded x-small width="35" elevation="0" class="px-1 ml-3 mr-3" min-width="20" color="primary">
                            <svg height="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
                                :fill="'#0187f3'"
                              />
                            </svg>
                            +
                          </v-btn>
                        </template>
                        <member-picker @select="setWorkers" :multiple="!isAudition" :list="workers" />
                      </v-menu>
                    </template>
                    add/remove workers
                  </v-tooltip>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-menu>
    </template>
    status
  </v-tooltip>
</template>

<script>
import AvatarList from '../lists/AvatarList.vue';
import CandidateList from '../browse/CandidateList.vue';
import MemberPicker from '../forms/MemberPicker.vue';
// import ReviewItem from '../forms/ReviewItem.vue';
import Review from '../forms/Review.vue';
import RULE from '../navigation/Rule.vue';
import RULES from '../../enums/rules';

import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { postRepository } from '../../store/modules/post/postRepository';
import { postType } from '../../store/models/PostModel';
import { eventBus } from '../../../main';
import store from '../../store';
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  name: 'TaskStatusMenu',
  props: { task: Object, extraClass: String, options: Array, extraStyle: String, size: Number },
  components: {
    AvatarList,
    CandidateList,
    MemberPicker,
    RULE,
    Review,
    // ReviewItem,
  },
  data() {
    return {
      hovering: false,
      statusTypes: [],
      selectedRev: 0,
      showReviews: true,
      loading: false,
      updatedprogress: 0,
      updatedstatus: 0,
      refreshkey: 0,
      hasPost: false,
      noWorkersIcon:'m 23.813529,3.1491611 c -11.391229,0 -20.6643692,9.2731399 -20.6643692,20.6643699 0,11.39123 9.2731402,20.662308 20.6643692,20.662308 11.391231,0 20.662311,-9.271078 20.662311,-20.662308 0,-11.39123 -9.27108,-20.6643699 -20.662311,-20.6643699 z m 0,3.5295 c 9.48367,0 17.132801,7.6511899 17.132801,17.1348699 0,9.48368 -7.649131,17.132806 -17.132801,17.132806 -9.48368,0 -17.1348691,-7.649126 -17.1348691,-17.132806 0,-9.48368 7.6511891,-17.1348699 17.1348691,-17.1348699 z m 0.15606,4.4694899 c -4.18707,0 -7.61555,3.42848 -7.61555,7.61556 v 0.002 c 0.002,1.56563 0.50239,3.04401 1.3534,4.28501 -3.27884,0.95487 -5.735559,3.86958 -5.735559,7.44761 v 2.23035 c 9e-5,0.901 0.72991,1.63133 1.6309,1.63143 h 20.419429 c 0.900981,-1e-4 1.630811,-0.73043 1.630911,-1.63143 v -2.23035 c 0,-3.48316 -2.321911,-6.35678 -5.467891,-7.39283 0.87703,-1.25293 1.39789,-2.74861 1.39992,-4.33979 v -0.002 c 0,-4.18708 -3.42847,-7.61555 -7.61556,-7.61556 z m 0,3.26234 v 5.3e-4 c 2.42296,0 4.35155,1.92798 4.35271,4.35063 -0.002,1.73696 -1.02544,3.29826 -2.61896,3.98942 -1.61808,0.70637 -1.1175,3.12167 0.64802,3.12695 h 1.42058 c 2.5867,0 4.61833,2.0332 4.61833,4.62039 v 0.59893 h -17.15554 v -0.59893 c 0,-2.58719 2.03161,-4.62039 4.61832,-4.62039 h 1.73529 c 1.7667,-0.003 2.26924,-2.42011 0.65009,-3.12695 -1.59287,-0.69089 -2.61849,-2.25125 -2.62154,-3.98735 v -0.003 c 9e-4,-2.42265 1.92976,-4.35064 4.3527,-4.35064 z'
    };
  },
  created() {
    this.statusTypes = Object.values(taskstate);
    eventBus.$on('updateTaskItem', (id) => {
      if (id == this.task.id) this.refreshkey++;
    });
  },
  mounted() {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    this.checkHasPost();
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    hasReviews() {
      return (this.task.auditors && Object.values(this.task.auditors).filter((a) => a.reviews.length).length) || false;
    },
    hasOpenReviews() {
      return true;
    },
    reviews() {
      console.log(Object.values(this.task.auditors));
      return (this.task.auditors && Object.values(this.task.auditors)[0].reviews) || [];
    },
    revNumber() {
      return 0;
    },
    isAudition() {
      return this.task.taskType == 'audition' ? true : false;
    },
    status() {
      this.refreshkey;
      return getStatusTypeByValue(this.task.status || 0);
    },
    isTaskBox() {
      return this.task.taskType == 'taskbox';
    },
    hideItems() {
      if (this.taskDone) {
        if (this.isTaskBox) return [1, 2, 3, 4, 5];
        else return [1, 2, 3, 4, 6];
      }
      if (this.working || this.paused) {
        if (this.isTaskBox) return [2];
        else return [2];
      }

      if (this.reviewing) {
        if (this.isTaskBox) return [2];
        else return [0, 1, 2];
      }

      return this.isTaskBox ? [2] : [];
    },
    isDisabled() {
      if (!this.status) return;
      return !this.started || !this.hasWorkers || this.open || this.reproved || this.paused || this.reviewing || this.taskDone ? true : false;
    },
    hasWorkers() {
      return this.task.workers.length > 0 ? true : false;
    },
    open() {
      if (!this.status) return;
      return false // this.status.value == taskstate.OPEN.value ? true : false;
    },
    started() {
      if (!this.status) return;
      return this.status.value !== taskstate.UNSTARTED.value ? true : false;
    },
    working() {
      if (!this.status) return;
      return this.status.value == taskstate.STARTED.value ? true : false;
    },
    reviewing() {
      if (!this.status) return;
      return this.status.value == taskstate.REVIEWING.value ? true : false;
    },
    paused() {
      if (!this.status) return;
      return this.status.value == taskstate.PAUSED.value ? true : false;
    },
    reproved() {
      if (!this.status) return;
      return this.status.value == taskstate.REPROVED.value ? true : false;
    },
    taskDone() {
      if (!this.status) return;
      return this.status.value == taskstate.DONE.value ? true : false;
    },
    progress: {
      get() {
        return this.task.progress;
      },
      set(value) {
        this.updatedprogress = value;
      },
    },
    taskStatus: {
      get() {
        return this.task.status;
      },
      set(value) {
        this.updatedstatus = value;
      },
    },
    rules() {
      return RULES;
    },
    workers() {
      return this.task.workers.map((w) => w.profile).filter((w) => w !== undefined);
    },
  },
  methods: {
    reviewItems(auditor) {
      return this.task.auditors && this.task.auditors[auditor] && _.cloneDeep(this.task.auditors[auditor]).reviews;
    },
    drop(value) {
      console.log(value);
    },
    createPost() {
      this.$store.commit('post/OPEN_POST_CREATOR', { postType: this.isAudition ? postType.AUDITION.value : postType.TASK.value, data: { task: this.task.id } });
      setTimeout(() => {
        this.checkHasPost();
      }, 700);
    },
    goToPost() {
      if (this.hasPost) this.$store.dispatch('post/PREVIEW_POST', this.task.id);
    },
    checkHasPost() {
      postRepository.exist(this.task.id).then((response) => {
        this.hasPost = response;
      });
    },
    setWorkers(list) {
      this.$store.commit('task/SET_WORKERS', { task: this.task, workers: list.filter((w) => w !== undefined) });
      this.$refs.memberpicker.isActive = false;
    },
    disabledByStatus(s) {
      return this.open && s < taskstate.OPEN.value ? true : false;
    },
    hiddenByStatus(s) {
      return (!this.started && (s == 0 || (s > 1 && s < 4))) || (s == 6 && !this.authenticated) ? true : false;
    },
    updateProgress() {
      this.loading = true;
      this.$nextTick(() => {
        let copy = _.cloneDeep(this.task);
        copy.progress = this.updatedprogress;
        store.commit('task/UPDATE_TASK_PROGRESS', copy);
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
    async updateStatus() {
      if (this.statusTypes[this.updatedstatus].value == this.status.value) return;

      this.loading = true;
      this.$nextTick(() => {
        if (this.isTaskBox) this.$store.commit('taskbox/CONFIRM_STATUS', { task: this.task, status: this.statusTypes[this.updatedstatus] });
        else store.commit(`task/${this.statusTypes[this.updatedstatus].function}`, this.task);

        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    },
  },
};
</script>

<style>
.statusButton {
  z-index: 3;
  text-transform: lowercase !important;
}
</style>
