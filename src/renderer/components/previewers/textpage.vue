<template>
  <v-card class="mt-16" elevation="0" min-height="550px" color="grey lighten-4" style="overflow: hidden; width: -webkit-fill-available; margin: 0px 25px">
    <v-textarea type="text" :loading="loading" placeholder="Type the text here." class="text" dense hide-details="true" no-resize height="500px" outlined v-model="data" @keydown.tab.prevent> </v-textarea>
    <v-card-actions class="pa-0 my-3">
      <v-spacer></v-spacer>
      <v-btn color="primary" small @click="save()"> save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'previewTypeDefault',
  props: ['content'],
  data() {
    return {
      data: '',
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await this.$store
      .dispatch('content/FETCH_CONTENT', this.content.data.flowingData.value)
      .then((result) => {
        this.data = result.data;
      })
      .catch(() => {})
      .finally(() => {this.loading=false});
  },
  methods: {
    async save() {
      await this.$store.dispatch('content/UPDATE_CONTENT', { id: this.content.data.flowingData.value, data: this.data });
    },
  },
};
</script>

<style >
 .v-input textarea{
  padding-top: 10px;
  padding-bottom: 5px;
  padding-right: 10px !important;
  margin: 5px 5px;
  text-align: justify !important;
  font-weight: 100;
  line-height: 18px;
  font-size: 14px!important;
}
</style>
