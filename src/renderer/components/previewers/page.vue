<template>
  <v-responsive width="100%" ref="image" style="align-items: center" class="pa-0 ma-0">
    <v-menu rounded="0" bottom left  offset-y transition="none" :close-on-content-click="false">
      <template v-slot:activator="{ on: onMenu }">
        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn left fab fixed x-small v-on="{ ...onMenu, ...onTooltip }"> {{ pagetypes[pagetype].name }} </v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-card class="mx-auto" max-width="400">
        <v-list-item>
          <v-list-item-title>Page types</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item-group v-model="pagetype" active-class="border" color="primary" multiple>
          <v-list-item v-for="(item, i) in pagetypes" :key="i">
            {{ item.name }} - {{ item.w }} x {{item.h}}
          </v-list-item>
        </v-list-item-group>
      </v-card>
    </v-menu>
    <v-progress-linear absolute top color="primary" indeterminate v-if="loading" />
    <v-card class="mt-5 mx-auto my-4" :width="pagetypes[pagetype].w" :min-height="pagetypes[pagetype].h" :max-height="pagetypes[pagetype].h" :height="pagetypes[pagetype].h" elevation="8">
      <!-- cabeçalho -->
      <v-card-title> cabeçalho </v-card-title>
      <v-textarea ref="textarea" auto-grow :min-height="pagetypes[pagetype].h" :style="`padding:${pagetypes[pagetype].my}px ${pagetypes[pagetype].mx}px!important;`" solo style="border-color: transparent" class="text" type="text" :loading="loading" placeholder="Type the text here." no-resize flat v-model="content" @keydown.tab.prevent> </v-textarea>
      <v-card-actions> RODAÉ </v-card-actions>
      <!-- rodapé   -->
    </v-card>
  </v-responsive>
</template>

<script>
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
      // await this.$store.dispatch('content/UPDATE_CONTENT', { id: this.content.data.flowingData.value, data: this.data });
    },
  },
};
</script>

<style>
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
