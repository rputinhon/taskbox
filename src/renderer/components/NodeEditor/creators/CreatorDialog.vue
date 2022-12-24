<template>
  <v-dialog overlay-opacity="0.9" width="400px" v-model="open" persistent light>
    <v-card width="400px">
      <v-card-text>
        <component v-if="creatorComponent" v-bind:is="creatorComponent" :type="type" @close="$emit('close')" @closeAndSave="closeAndSave"> </component>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import _ from 'lodash';

export default {
  name: 'creatorDialog',
  props: { showCreate: Boolean, type: {}, task:{} },
  components: {},
  data: () => ({
    open: false,
  }),
  watch: {
    showCreate(value) {
      return (this.open = value);
    },
  },
  computed: {
    creatorComponent() {
      if (!this.type) return;
      let type = this.type.creator;
      return () => import(`./${type}.vue`);
    },
  },
  methods: {
    async closeAndSave(file) {

       let entity = _.cloneDeep(this.task);

        entity.title = file.name;
        entity.value = { file: file };

        this.$store.dispatch('taskbox/UPDATE_TASK', entity).then(()=>{
          this.$store.dispatch('taskbox/GET_FILE_LIST');
          this.$listeners.close();
        })

    },
  },
};
</script>
