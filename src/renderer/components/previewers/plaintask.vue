<template>
    <v-sheet>
        <v-card-text v-if="content.data" class="text-h3 pa-16">
          {{content.data.task.subject}}
        </v-card-text>
        <v-card-text v-else class="text-h2 text--grey">
        ...
        </v-card-text>
    </v-sheet>
</template>


<script>
  export default {
    name: "previewTypeTask",
    props: ["content"],
  };
</script>