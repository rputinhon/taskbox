<template>
    <v-sheet>
      <v-card-subtitle v-if="content.data">
          {{ content.data.flowingData.mutated}}
      </v-card-subtitle>
        <v-card-text v-if="content.data" class="text-h2 pa-16">
          {{ content.data.flowingData.value}}
        </v-card-text>
        <v-card-text v-else class="text-h2 text--grey">
        ...
        </v-card-text>
    </v-sheet>
</template>


<script>
  export default {
    name: "previewTypeString",
    props: ["content"],
  };
</script>