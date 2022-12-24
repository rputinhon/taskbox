<template>
  <v-row v-if="post && options" no-gutters justify="center" align="center" class="overflow-y-auto overflow-x-hidden" :style="`word-break:keep-all;font-size:${options.fontsize}px;text-align: ${options.textalign}!important;line-height:${options.fontsize}px; max-height: 450px; font-weight: 700; min-height: 450px;background:${options.backgroundColor}`">
    <v-col @click.prevent class="pa-10 overflow-hidden" width="100%" height="auto" style="height: auto">
      <span :style="`color:${options.fontcolor}!important`">
        <b v-show="options.capitalEffect" :style="`font-size: ${100}px;margin-right: -30px;`">{{ cap }} </b>
        {{ text }}
      </span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PostHistory',
  props: { post: Object },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    options() {
      return this.post.data.options;
    },
    cap() {
      return this.post.subject.slice(0, 1);
    },
    text() {
      return !this.options.capitalEffect ? this.post.subject : this.post.subject.slice(1, this.post.subject.length);
    },
  },
};
</script>
