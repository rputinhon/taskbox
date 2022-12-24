<template>
  <v-card
    class="mt-16"
    elevation="0"
    min-height="550px"
    color="grey lighten-4"
    style="overflow: hidden; width: -webkit-fill-available; margin: 0px 28px"
  >
    <embed :src="file.path" width="500px" height="500px" />
  </v-card>
</template>

<script>

  export default {
    name: "previewTypePdf",
    props: ["file"],
  };
</script>