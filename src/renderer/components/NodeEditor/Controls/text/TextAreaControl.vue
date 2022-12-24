<template>
    <div style="position:absolute;bottom:45px;left:33px;width:200px">
        <v-list-item class="text-center">
          <v-textarea
            no-resize
            height="60px"
            hide-details="true"
            v-model="node.data.task.subject"
            required
            @keydown.escape="changeAction()"
            @blur="changeAction()"
            @dblclick.stop
            @pointermove.stop
          >
          </v-textarea>
        </v-list-item>
    </div>
</template>

<script lang="js">

  export default {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'change'],

    data: () => ({
      value: 0,
    }),

    mounted() {
      this.value = this.getData(this.ikey);
    },

    methods: {
      changes(e) {
        // console.loge);
        // this.value = e;
        this.update();
      },

      update() {
        if (this.ikey) this.putData(this.ikey, this.value);
        setTimeout(() => this.emitter.trigger("process"), 1000);
      },
    },
  };
</script>