<template>
  <v-dialog v-model="isOpen" max-width="400" persistent @keydown.escape="$emit('close')" @keydown.enter="yes()">
    <v-card class="pa-5" v-if="dataReady">
      <v-card-title class="text-h5 text-center" style="display: block">
        <svg style="pointer-events: none" width="45" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path
            d="M 7.8834844,12.654189 C 4.7030622,15.50337 4.0907038,15.840062 2.8539021,18.557003 l -2.0978909,4.812611 c -0.69347361,1.591232 0.22320854,2.355498 2.0104793,1.087534 l 3.2728698,-2.321258 0.010166,13.216403 h 0.012874 c 0.044418,1.132245 1.028397,2.100345 2.8974732,2.588362 l 14.0760515,3.675208 c 3.380215,0.882555 8.321676,-0.145793 11.078974,-2.305545 l 5.217619,-4.087134 c 1.161549,-0.909822 1.699832,-1.867291 1.739432,-2.737278 l 0.01355,-6.79e-4 0.0054,-3.698434 4.985875,-4.07347 c 1.486748,-1.214828 1.862063,-3.394397 0.769771,-4.97861 L 43.700379,15.17146 c -0.625936,-0.90783 -1.593535,-1.416179 -2.58577,-1.457104 l 0.0014,-0.907872 -0.0047,0.0054 C 41.110703,11.64569 40.120858,10.6444 38.20833,10.145048 L 24.132304,6.4698031 C 15.729887,4.9270849 14.621607,8.0061843 7.8834844,12.654189 Z M 23.468919,8.3570377 35.293915,11.227076 c 1.296646,0.338548 2.195868,0.953177 2.224602,1.730353 0.02271,0.614478 -0.566937,1.242386 -1.347771,1.854 l -5.553717,4.350136 c -2.151019,1.684857 -4.28075,2.029463 -6.917721,1.340964 L 19.819296,19.489457 V 8.221779 c 1.051637,-0.2378544 2.52124,-0.1386104 3.649623,0.1352587 z M 8.3900087,19.183437 c 0,0 9.6113683,2.230904 14.6459193,3.545406 2.069715,0.540393 4.723511,0.361711 7.104093,-0.351809 -0.381249,1.076915 -0.273574,2.304113 0.41131,3.29744 l 3.146158,4.562587 c 1.092293,1.584214 3.226051,1.955334 4.712798,0.740508 l 0.385239,-0.307461 c 0.0396,1.297919 0.167044,2.338013 -1.541612,3.497145 l -5.553716,3.767577 c -2.15102,1.684869 -5.299712,1.90461 -7.936681,1.216108 L 10.136887,35.924384 C 8.8553157,35.588913 8.4282693,35.011356 8.3957671,34.242877 8.2200215,28.268139 8.3900304,19.183437 8.3900304,19.183437 Z m 19.8743803,6.40258 c -0.891648,0 -1.609331,0.723521 -1.609331,1.62242 v 9.779943 c 0,0.898899 0.717683,1.6231 1.609331,1.6231 0.891646,0 1.60933,-0.724201 1.60933,-1.6231 v -9.779943 c 0,-0.898899 -0.717684,-1.62242 -1.60933,-1.62242 z"
            fill="#0057ff"
          />
        </svg>
      </v-card-title>

      <v-list-item-content v-if="!deleting">
        <span class="text-center">
          Delete <b>"{{ project.title }}" ?</b>
        </span>
      </v-list-item-content>
      <v-list-item-content v-else>
        <v-list-item-subtitle class="caption error--text" v-text="`Deleting ${project.title} ...`"> </v-list-item-subtitle>
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-progress-linear :color="deleting ? 'error' : 'grey'" class="my-2" indeterminate />
        </v-row>
      </v-list-item-content>

      <v-card-actions v-if="project.info">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> {{ project.info.Count }} task{{ project.info.Count !== 1 ? 's' : '' }} {{ project.info.DoneCount }} done {{ project.info.IncompleteCount > 0 ? project.info.IncompleteCount + ' to go' : '' }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-actions>
      <v-card-actions class="mt-3">
        <v-row class="py-3" align="center" justify="center" style="width: 100%">
          <v-btn :disabled="deleting" small class="mx-1" color="secondary" @click="close()"> cancel </v-btn>
          <!-- <v-btn small class="mx-1" color="secondary" @click="skip()"> no </v-btn> -->
          <v-btn :disabled="deleting" small class="mx-1" color="error" @click="deleteItem()"> Delete</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDeleteProject',
  props: { open: Boolean, projectId: String },
  data() {
    return {
      isOpen: false,
      deleting: false,
    };
  },
  watch: {
    open(value) {
      this.isOpen = value;
    },
  },
  computed: {
    project() {
      return this.$store.state.taskbox.rootTaskBoxes.find((p) => p.id == this.projectId);
    },
    dataReady() {
      return this.projectId && this.project ? true : false;
    },
  },
  methods: {
    async deleteProject() {
      return new Promise((res) => {
        this.$store
          .dispatch('taskbox/DELETE_PROJECT', this.projectId)
          .then(() => {
            setTimeout(res, 1000);
          })
          .catch((error) => {
            console.log(error);
            setTimeout(res, 1000);
          });
      });
    },
    async deleteItem() {
      this.deleting = true;
      await this.deleteProject();
      this.deleting = false;
      this.close();
    },
    async close() {
      this.$listeners.close();
    },
  },
};
</script>
