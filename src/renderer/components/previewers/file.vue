<template>
  <v-container fluid class="py-0 px-0 mx-0" style="width: 100%; height: 100%; overflow: hidden">
    <component v-if="componentType" :showToolsBar="showToolsBar" :inTask="inTask" v-bind:is="componentType" :fullscreen="fullscreen" :fileExist="fileExist" :mime="mime && mime" @closePreview="$emit('closePreview')"> </component>
  </v-container>
</template>

<script>
import { fileTypes, getFileType, getPreviewerType } from '../../fixtures/fileTypes';
import { mapState } from 'vuex';

export default {
  name: 'previewTypeDefault',
  props: { fullscreen: Boolean, inTask: Object,showToolsBar:Boolean  },
  components: {},
  data() {
    return {
      fileExist: true,
      mime: undefined,
      previewerType: 'nofile',
      componentType: null,
    };
  },
  async mounted() {
    await this.getComponentType();
  },
  watch: {
    async previewingTask() {
      this.getComponentType();
    },
  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
    }),
    task() {
      return this.inTask || this.previewingTask;
    },
    file() {
      if (!this.task.value) return false;
      return this.task.value.file;
    },
  },
  methods: {
    async getComponentType() {
      this.previewerType = 'nofile';
      this.componentType = null;

      if (this.task && this.file) {
        let type = getFileType(this.file.extension);
        if (type) this.mime = type.mime;
        let forceCategory = fileTypes[this.file.extension.split('.')[1]];
        if (type.info) this.previewerType = forceCategory.category ? getPreviewerType(forceCategory) : type.info.previewerType;
        else this.previewerType = 'nopreview';
      }
      this.componentType = () => import(`./filetype/${this.previewerType}.vue`);
      // this.reviews = await this.getReviews();
    },
  },
  beforeDestroy() {
    // if (this.userProfile.appSettings[1].value) {
    //   if (this.status.value > 0 && this.status.value < 2) {
    //     this.$store.commit('taskbox/pauseTask', this.node.data.task);
    //   }
    // }
  },
};
</script>

<style scoped>
.sd {
  filter: brightness(0.5);
}
</style>
