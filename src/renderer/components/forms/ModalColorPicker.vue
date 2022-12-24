<template>
  <v-row justify="center" align="center">
    <v-dialog
    light
      v-model="show"
      persistent
      width="auto"
      retain-focus
    >
      <v-card class="pa-5">
        <v-color-picker
          v-model="frame.color.rgba"
          hide-inputs
        >
        </v-color-picker>
        <v-card-actions class="my-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" fab small @click="$emit('closePickColor')">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name:'ModalColorPicker',
    props:['show','frame'],
    data: () => ({
    }),
  }
</script>
