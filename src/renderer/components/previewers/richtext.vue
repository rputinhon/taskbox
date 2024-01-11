<template>
  <v-responsive width="100%" ref="image" style="align-items: center" class="pa-0 ma-0">
    <v-progress-linear absolute top color="primary" indeterminate v-if="loading" />
    <v-card id="editorjs" class="mt-5 mx-auto my-4" :width="pagetypes[pagetype].w" :min-height="pagetypes[pagetype].h" :max-height="pagetypes[pagetype].h" :height="pagetypes[pagetype].h" elevation="8"> </v-card>
  </v-responsive>
</template>

<script>

// import EditorJS from '@editorjs/editorjs'
// import _ from 'lodash'

export default {
  name: 'previewTypeDefault',
  props: { content: String },
  data() {
    return {
      loading: false,
      pagetype: 0,
      pagetypes: [
        {
          name: 'A4',
          lineheight: 1.5,
          mx: 20,
          my: 20,
          w: '210mm',
          h: '297mm',
        },
        {
          name: 'US Letter',
          lineheight: 1.5,
          mx: 20,
          my: 20,
          w: '215,9mm',
          h: '279,4mm',
        },
      ],
    };
  },
  async mounted() {

  // var editor = EditorJS({
  //   loader:false,
  //   tools: {}
  //   });
  //   let data = await editor.save();
  //   console.log(data);

    // this.loading = true;
    // await this.$store
    //   .dispatch('content/FETCH_CONTENT', this.content.data.flowingData.value)
    //   .then((result) => {
    //     this.data = result.data;
    //   })
    //   .catch(() => {})
    //   .finally(() => {
    //     this.loading = false;
    //   });
  },
  methods: {
    async save() {
    },
  },
};
</script>

<style>
.cdx-loader {
  display: none !important;
}

.codex-editor_loader {
  display: none !important;
}

.v-input textarea {
  padding-top: 10px;
  padding-bottom: 5px;
  padding-right: 10px !important;
  margin: 5px 5px;
  text-align: justify !important;
  font-weight: 100;
  line-height: 18px;
  font-size: 14px !important;
}
</style>
