<template>
  <v-list-item :disabled="options.includes('readOnly')" class="pa-0 ma-0" color="transparent" v-if="task">
    <v-card width="100%" flat :color="!open ? 'white' : 'background'" :ripple="false" style="z-index: 1" class="px-0 overflow-hidden" @click="showdetails = !showdetails" @mouseover="hovering = true" @mouseleave="hovering = false">
      <v-progress-linear class="progressbar" :color="color" background-opacity="0.7" :buffer-value="analysing == false ? value : 100" />
      <v-list-item class="px-2" style="z-index: 10">
        <task-subject v-show="options.includes('subject') && analysing == false" :status="status" :task="task" :options="['popup']" />
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn class="mx-1" v-show="hasPost || open" v-on="{ ...onTooltip }" small icon color="primary" @click.stop="hasPost ? goToPost() : createPost()">
              <svg height="27" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  v-if="hasPost"
                  d="m 9.7869993,2.6106933 c -1.8983042,0 -3.426664,1.5283599 -3.4266642,3.4266641 V 41.587642 c 2e-7,1.898303 1.52836,3.426663 3.4266642,3.426663 H 37.838001 c 1.898304,0 3.426664,-1.52836 3.426664,-3.426663 V 6.0373574 c 0,-1.8983042 -1.52836,-3.4266641 -3.426664,-3.4266641 z M 11.153324,5.385201 A 1.8749999,1.8749999 0 0 1 13.028662,7.2600218 1.8749999,1.8749999 0 0 1 11.153324,9.1353597 1.8749999,1.8749999 0 0 1 9.2785032,7.2600218 1.8749999,1.8749999 0 0 1 11.153324,5.385201 Z m 17.263029,10.640177 c 0.110985,-0.0035 0.227248,0.04081 0.338481,0.13901 l 1.594218,1.53634 c 0.18455,0.177648 0.187873,0.47206 0.0072,0.653707 l -7.802613,7.855851 c -0.178973,0.180509 -0.470465,0.180889 -0.65009,0.001 l -4.634342,-4.63279 c -0.180971,-0.181313 -0.178,-0.475693 0.0062,-0.653707 l 1.537374,-1.48208 c 0.179596,-0.173431 0.464789,-0.171383 0.641821,0.0047 l 2.769856,2.761071 5.884911,-6.034257 c 0.0903,-0.09363 0.195977,-0.145286 0.306959,-0.148828 z M 13.562996,34.26044 h 20.499007 c 0.508505,0 0.917773,0.409268 0.917773,0.917774 0,0.508505 -0.409268,0.917773 -0.917773,0.917773 H 13.562996 c -0.508505,0 -0.917773,-0.409268 -0.917773,-0.917773 0,-0.508506 0.409268,-0.917774 0.917773,-0.917774 z m 4.538224,3.773414 h 11.42256 c 0.508505,0 0.917773,0.409268 0.917773,0.917773 0,0.508505 -0.409268,0.917774 -0.917773,0.917774 H 18.10122 c -0.508504,0 -0.917773,-0.409269 -0.917773,-0.917774 0,-0.508505 0.409269,-0.917773 0.917773,-0.917773 z"
                  :fill="'#0187f3'"
                />
                <path
                  v-else
                  d="m 9.7869993,2.6106933 c -1.8983042,0 -3.426664,1.5283599 -3.4266642,3.4266641 V 41.587642 c 2e-7,1.898303 1.52836,3.426663 3.4266642,3.426663 H 37.838001 c 1.898304,0 3.426664,-1.52836 3.426664,-3.426663 V 6.0373574 c 0,-1.8983042 -1.52836,-3.4266641 -3.426664,-3.4266641 z M 18.314127,14.348995 h 1.389063 c 0.338351,0 0.610815,0.27246 0.610815,0.610815 v 3.672127 h 3.672128 c 0.338351,0 0.610815,0.272463 0.610815,0.610816 v 1.389579 c 0,0.338353 -0.272464,0.610299 -0.610815,0.610299 h -3.672128 v 3.672644 c 0,0.338348 -0.272464,0.610298 -0.610815,0.610298 h -1.389063 c -0.338351,0 -0.610815,-0.27195 -0.610815,-0.610298 v -3.672644 h -3.672644 c -0.338352,0 -0.610299,-0.271946 -0.610299,-0.610299 v -1.389579 c 0,-0.338353 0.271947,-0.610816 0.610299,-0.610816 h 3.672644 V 14.95981 c 0,-0.338355 0.272464,-0.610815 0.610815,-0.610815 z m 14.709696,6.601147 c 0.06672,-0.0016 0.129669,0.0057 0.190169,0.01705 0.554829,0.09123 0.990637,0.570182 0.990637,1.131197 v 0.02584 9.020121 c 0,0.623994 -0.538342,1.148766 -1.180806,1.148766 -0.443714,0 -0.838586,-0.250574 -1.040247,-0.610815 -0.730009,-0.977931 -1.028779,-1.551874 -1.936832,-2.024165 -0.520176,-0.270545 -1.159076,-0.463995 -2.009695,-0.535885 l 0.691946,2.8267 c 0.09747,0.398325 -0.08782,0.791848 -0.315743,1.003041 -0.227928,0.211198 -0.503013,0.324011 -0.825273,0.324011 H 27.05313 c -0.541042,-0.0104 -0.991051,-0.446527 -1.1405,-0.994772 l -0.73949,-3.01997 c -0.0123,-0.05025 -0.01956,-0.100629 -0.02325,-0.150379 -0.313398,-0.120444 -0.560437,-0.365781 -0.7059,-0.664043 h -0.08992 c -0.769256,2e-6 -1.409733,-0.64048 -1.409733,-1.409732 V 25.82633 c 0,-0.769259 0.640477,-1.410766 1.409733,-1.410766 h 0.146761 c 0.241804,-0.398622 0.679077,-0.671523 1.189591,-0.646472 0.867414,0.04261 1.473217,0.123289 1.91306,0.156579 0.439846,0.0333 0.682578,0.02572 0.976686,-0.06666 0.588219,-0.184763 1.276948,-0.709581 3.582728,-2.549198 0.0057,-0.0045 0.01966,-0.01247 0.02687,-0.01757 0.215339,-0.210215 0.511776,-0.342098 0.834057,-0.342098 z"
                  :fill="color"
                />
              </svg>
            </v-btn>
          </template>
          {{ hasPost ? 'Show Publication' : 'Publicate as Open Task' }}
        </v-tooltip>
        <task-icon :task="task" :color="completed || (analysing !== 'progress' && analysing !== false) ? 'white' : undefined" :extraClass="'my-auto'" />
        <v-list-item-content class="px-0">
          <task-title v-show="analysing == false || hovering" :task="task" :options="['reviews', analysing !== false && 'progress', 'edit']" />
          <v-list-item-subtitle style="min-width: fit-content" class="text-left" v-show="analysing !== false && !hovering">
            {{ analisisText }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <candidate-list v-if="open && hasCandidats" :task="task" :options="['avatarList']" />
        <task-status-menu v-if="options.includes('status')" :extraClass="'mx-3'" :options="[hasReviews && 'reviews', 'progress', 'workers', 'fab', 'icon', 'flat', completed || (hasReviews && progress==100) ? 'white' : '']" :task="task" />
        <task-menu v-if="false && options.includes('menu')" :extraClass="'mx-3'" :task="task" :options="['icon', 'fab']" />
        <v-tooltip bottom transition="none" v-if="hasReviews || reviewing">
          <template  v-slot:activator="{ on: tooltip }">
            <v-menu rounded="0" ref="revisionmenu" z-index="2000" top right offset-x light :close-on-content-click="false">
              <template v-slot:activator="{ on: menu }">
                <v-btn tile class="px-0 white--text" height="48px" min-width="48px" v-on="{ ...tooltip, ...menu }" depressed :style="reviewStatus.value == 2 && 'border:2px solid #f7ab39'" :color="reviewStatus.color"> rev </v-btn>
              </template>
              <v-card flat class="mx-auto" max-width="400" color="background">
                <review :task="task" :allowAddReview="true" />
              </v-card>
            </v-menu>
          </template>
          Show Reviews
        </v-tooltip>
      </v-list-item>
      <v-list-item v-if="false" style="min-height:15px;margin-top:-5px!important;z-index:50" class="my-1">
      <due-control  :showDetails="false" :task="task" />
      </v-list-item>
    </v-card>
    <v-list-item-icon v-if="authenticated && options.includes('audit')" :class="auditing && 'ml-3'" class="mx-0 px-0 my-0">
      <flow-task-menu :task="task" :status="status" :options="['tile']" />
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
import DueControl from '../dialogs/DueControl.vue';
import TaskStatusMenu from '../menus/TaskStatusMenu.vue';
import TaskMenu from '../menus/TaskMenu.vue';
import TaskSubject from './TaskSubject.vue';
import TaskTitle from './TaskTitle.vue';
import TaskIcon from './TaskIcon.vue';

import { eventBus } from '../../../main';
import { taskModel } from '../../store/models/TaskModel';
import { mapGetters, mapState } from 'vuex';
import FlowTaskMenu from '../menus/FlowTaskMenu.vue';
import CandidateList from '../browse/CandidateList.vue';
import { postType } from '../../store/models/PostModel';
import { postRepository } from '../../store/modules/post/postRepository';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import Review from '../forms/Review.vue';
import reviewstatus from '../../enums/reviewstatus';

export default {
  name: 'TaskItem',
  props: { task: Object, options: Array, priority: Number, auditing: Boolean },
  components: {
    CandidateList,
    DueControl,
    FlowTaskMenu,
    TaskStatusMenu,
    TaskMenu,
    TaskSubject,
    TaskTitle,
    TaskIcon,
    Review,
  },
  data() {
    return {
      hasPost: false,
      showdetails: false,
      hovering: false,
      worker: null,
      chat: null,
      updatedSubject: '',
      refreshkey: 0,
    };
  },
  created() {
    eventBus.$on('updateTaskItem', (id) => {
      if (id == this.task.id) this.refreshkey++;
    });
  },
  mounted() {
    // this.checkHasPost();
  },
  watch: {
    status() {
      // this.checkHasPost();
    },
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      analisis: (state) => state.taskbox.analisis,
    }),
    ...mapGetters({
      currentTaskBox: 'taskbox/currentTaskBox',
      currentTaskBoxTasks: 'taskbox/currentTaskBoxTasks',
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    node() {
      this.refreshkey;
      if (!this.currentTaskBox) return;
      return this.currentTaskBox.data.nodes[this.task.id];
    },
    hasWorker() {
      return this.task.workers.length > 0 ? true : false;
    },
    subject: {
      get() {
        this.refreshkey;
        return this.task.subject;
      },
      set(value) {
        this.updatedSubject = !value.trim().isEmpty() ? value : taskModel.subject;
      },
    },
    value() {
      this.refreshkey;
      return this.analysing && this.analisis[this.task.id] ? this.analisis[this.task.id][this.analysing].percentage : this.task.progress;
    },
    color() {
      this.refreshkey;
      return this.analysing && this.analisis[this.task.id] ? this.analisis[this.task.id][this.analysing].color : this.status.color;
    },
    hasReviews() {
      return this.task.auditors && Object.values(this.task.auditors).filter((a) => a.reviews.length > 0).length;
    },
    reviewStatus() {
      if (!this.task.auditors) return reviewstatus.OPEN;

      let items = [];
      Object.values(this.task.auditors).forEach((element) => {
        element.reviews.forEach((item) => {
          items.push(item);
        });
      });

      if (items.filter((r) => r.status == reviewstatus.REFUSED.value || r.status == reviewstatus.OPEN.value).length) return reviewstatus.OPEN;
      if (items.filter((r) => r.status == reviewstatus.PARCIALLYAPROVED.value).length) return reviewstatus.PARCIALLYAPROVED;
      return reviewstatus.APROVED;
    },
    analisisText() {
      return this.analysing && this.analisis[this.task.id] ? this.analisis[this.task.id][this.analysing].text : '';
    },
    isTaskBox() {
      return this.task.type == 'taskbox' ? true : false;
    },
    hasAuditors() {
      return this.task.auditors && this.task.auditors.lenght;
    },
    status() {
      this.refreshkey;
      return getStatusTypeByValue(this.task.status || 0);
    },
    hasDue() {
      return this.task.due.plannedToEndAt ? true : false;
    },
    taskable() {
      this.refreshkey;
      return this.task.taskable;
    },
    hasCandidats() {
      return this.task.candidats && this.task.candidats.length ? true : false;
    },
    open() {
      return false// this.status.value == taskstate.OPEN.value ? true : false;
    },
    started() {
      return this.status.value > 0 ? true : false;
    },
    unstarted() {
      return this.status.value == taskstate.UNSTARTED.value ? true : false;
    },
    reviewing() {
      return this.status.value == taskstate.REVIEWING.value ? true : false;
    },
    completed() {
      return this.status.value == taskstate.DONE.value ? true : false;
    },
    taskInfo() {
      return { taskCount: null };
    },

    lastReview() {
      if (!this.hasReviews) return false;
      return this.task.due.reviews[this.task.due.reviews.length - 1];
    },
  },
  methods: {
    createPost() {
      this.$store.commit('post/OPEN_POST_CREATOR', { postType: postType.TASK.value, data: { task: this.task.id } });
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
        this.refreshkey++;
      });
    },
    frameNode(task) {
      eventBus.$emit('frameNode', task.id);
    },
    changeStatus(newStatus) {
      eventBus.$emit('confirmChangeStatus', [this.task, newStatus]);
    },
    openPost() {
      this.$store.dispatch('post/PREVIEW_POST', this.task.id);
    },
  },
};
</script>

<style scoped>
.rev {
  transform: rotate(-90deg);
}

.taskitem {
  width: -webkit-fill-available;
}

.auditing {
  border-radius: 4px 0px 0px 4px !important;
  border-right: 2px dashed rgb(75, 75, 75, 0.3) !important;
}

.disabledByStatus {
  pointer-events: none !important;
  cursor: auto !important;
  opacity: 0.4 !important;
}

.taskitem:hover {
  background-color: rgba(158, 174, 243, 1);
}

.taskitemcontent {
  z-index: 1;
}

.progressbar {
  height: 100% !important;
  z-index: 0;
  pointer-events: none;
  position: absolute;
}
</style>
