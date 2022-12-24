<template>
    <v-date-picker
      v-model="picker"
      year-icon="mdi-calendar-blank"
      prev-icon="mdi-skip-previous"
      next-icon="mdi-skip-next"
    >
    </v-date-picker>
</template>

<script>
  export default {
    data: () => ({
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }),
  }
</script>
