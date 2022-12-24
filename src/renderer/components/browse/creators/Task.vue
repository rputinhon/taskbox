<template>
  <v-card v-if="creatingPost" :ripple="false">
    <v-card height="450" :ripple="false" class="overflow-y-auto overflow-x-hidden" flat color="grey" @click.stop>
      <v-fade-transition hide-on-leave leave-absolute>
        <v-tabs v-model="selected" height="0px" color="grey">
          <v-tab-item tabindex="01" class="px-6 ma-0" style="min-height: 450px; background: transparent">
            <v-list-item-title v-if="unDoneTasks.length > 0" class="ma-2 pa-0 text-center"> Select the Task </v-list-item-title>
            <v-row no-gutters align="start" class="pt-6" style="min-height: auto; width: 100%">
              <!-- <v-list-item-group v-model="selectedTask" style="min-height: auto; width: 512px" color="primary"> -->
              <v-list-item :disabled="hasPost(task.id)" style="height: 57px" class="ma-0 pa-1" v-for="(task, t) in unDoneTasks" :key="t">
                <v-list-item-icon class="my-auto" v-if="!hasPost(task.id)">
                  <v-btn :color="selectedTask == t ? 'primary' : 'white'" fab x-small @click="selectTask(t)">
                    <svg height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <path d="m 35.590286,9.5800382 c -0.573351,0.01831 -1.09936,0.296418 -1.47461,0.6855468 L 19.728957,25.017538 13.340285,18.648397 c -0.832238,-0.827545 -2.202573,-0.838692 -3.046875,-0.02344 l -3.9433589,3.802734 h -0.002 c -0.865194,0.836135 -0.877305,2.249903 -0.02734,3.101563 v 0.002 L 18.209379,37.415973 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013673,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815988 -0.98915,-0.6237838 -1.5625,-0.6054688 z" fill="white" />
                    </svg>
                  </v-btn>
                </v-list-item-icon>
                <v-card width="100%" flat rounded="lg" color="transparent" @click.prevent>
                  <task-item :task="task" :options="['worker', 'readOnly']" />
                </v-card>
                <v-overlay style="pointer-events: none; border-radius: 10px" absolute color="primary" v-if="hasPost(task.id)">
                  <v-list-item>
                    <v-list-item-title> Posted </v-list-item-title>
                    <svg width="45" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <path
                        d="m 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z"
                        fill="white"
                      />
                    </svg>
                  </v-list-item>
                </v-overlay>
              </v-list-item>
              <!-- </v-list-item-group> -->
              <empty v-if="unDoneTasks.length == 0" :text="'no open tasks'" :icon="' '" :extraClass="'mt-16'" />
            </v-row>
          </v-tab-item>
          <v-tab-item style="height: 450px; background: transparent" class="overflow-y-auto overflow-x-hidden">
            <v-layout column justify-center align-center style="height: auto" class="pa-0 px-3">
              <subject v-if="task" :task="task" :options="[]" :thumbSize="250" />
              <v-btn fab absolute class="mt-9" left top small color="primary" @click="selectedTask = undefined">
                <svg style="transform: rotate(270deg)" width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 22.966798,6.7363314 7.5429688,21.365234 c -0.6010104,0.57054 -0.6254989,1.520341 -0.054688,2.121094 0.5703357,0.599718 1.5186313,0.62419 2.1191407,0.05469 L 22.5,11.314453 c -0.02774,9.845939 -0.07332,19.692771 -0.111328,29.539063 -0.0032,0.828429 0.665711,1.502629 1.49414,1.505859 0.03936,-0.0063 0.07845,-0.01407 0.117188,-0.02344 0.03874,0.0094 0.07783,0.01718 0.117188,0.02344 0.828429,-0.0032 1.497382,-0.67743 1.49414,-1.505859 C 25.583091,31.007145 25.520345,21.16084 25.5,11.314453 l 12.892578,12.226563 c 0.600509,0.569502 1.548805,0.54503 2.119141,-0.05469 0.570811,-0.600753 0.546323,-1.550554 -0.05469,-2.121094 L 25.033203,6.7363281 c -0.779462,-0.7392901 -1.326249,-0.7020057 -2.066405,3.3e-6 z" fill="white" />
                </svg>
              </v-btn>
            </v-layout>
          </v-tab-item>
        </v-tabs>
      </v-fade-transition>
    </v-card>
    <v-toolbar class="pa-0 pr-2 my-1" height="55px" elevation="0">
      <v-spacer></v-spacer>
      <v-btn class="mx-2" small right color="secondary" @click="$emit('close')"> cancel </v-btn>
      <v-btn small right color="primary" :disabled="!selected" :loading="loading" @click="beforePost()"> post! </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script>
import taskstate from '../../../enums/taskstate';
import TaskItem from '../../lists/TaskItem.vue';
import Subject from '../../lists/Subject.vue';
import Empty from '../../dialogs/Empty.vue';

import { ipcRenderer, nativeImage } from 'electron';
import { getPostTypeByValue } from '../../../store/models/PostModel';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name: 'PostTask',
  components: {
    TaskItem,
    Subject,
    Empty,
  },
  data() {
    return {
      loading: false,
      creatingPost: null,
      selectedTask: null,
      selected: 0,
      refreshKey: 0,
    };
  },
  watch: {
    selectedTask(value) {
      if (value !== undefined) {
        this.selected = 1;
        if (this.unDoneTasks[value]) {
          this.creatingPost.data.task = this.unDoneTasks[value].id;
          this.creatingPost.id = this.creatingPost.data.task;
          this.creatingPost.title = this.unDoneTasks[value].title;
        }
      } else {
        this.selected = 0;
        this.creatingPost.id = undefined;
        this.creatingPost.data.task = undefined;
      }
    },
  },
  mounted() {
    this.creatingPost = _.cloneDeep(this.post);
    if (!this.creatingPost.data) {
      this.creatingPost.data = {};
      Object.assign(this.creatingPost.data, { task: undefined });
    } else {
      let index = this.unDoneTasks.indexOf(this.unDoneTasks.find((t) => t.id == this.creatingPost.data.task));
      this.selectTask(index);
    }
  },
  computed: {
    ...mapState({
      post: (state) => _.cloneDeep(state.post.creatingPost),
      opentasks: (state) => _.cloneDeep(state.post.opentasks),
      member: (state) => state.user.profile,
      // tasks
      myTasks: (state) => state.user.tasks,
      myTaskboxes: (state) => state.user.taskboxes,
    }),
    task() {
      return this.unDoneTasks[this.selectedTask];
    },
    unDoneTasks() {
      return this.myTasks.filter((t) => t.status < taskstate.DONE.value || t.status == taskstate.OPEN.value );
    },
    postType() {
      return getPostTypeByValue(this.creatingPost.postType);
    },
  },
  methods: {
    selectTask(index) {
      this.selectedTask = index;
    },
    hasPost(id) {
      return this.opentasks.includes(id);
    },
    deleteImage() {
      this.creatingPost.image = null;
    },
    selectImage() {
      this.loading = true;
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (files) => {
        nativeImage.createThumbnailFromPath(files[0], { width: 512, height: 512 }).then((clip) => {
          this.creatingPost.image = clip.toDataURL();
          this.refreshKey++;
        });

        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },

    beforePost() {
      let copy = _.cloneDeep(this.task);
      copy.workers = [];
      this.$store
        .dispatch('taskbox/UPDATE_TASK', copy)
        .then(() => {
          this.$listeners.save(this.creatingPost);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.v-item--active {
  opacity: 1 !important;
  background-color: aliceblue !important;
}
</style>
