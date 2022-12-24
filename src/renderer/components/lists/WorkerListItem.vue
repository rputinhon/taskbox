<template>
  <v-list-item class="mx-0 pl-1 pr-3">
    <v-list-item-avatar class="mr-2">
      <v-img :src="member.avatar" />
    </v-list-item-avatar>
    <v-list-item-title v-html="member.name" />

    <v-btn-toggle v-show="selected" mandatory v-model="selectedCredential" rounded color="grey" background-color="grey" multiple dense active-class="active">
      <v-btn width="70" v-for="(type, t) in types" :key="t" :outlined="t !== type" small @click.stop>
        <small class="text-caption" :class="selectedCredential.includes(t) ? 'white--text' : ''">
          {{ type }}
        </small>
      </v-btn>
    </v-btn-toggle>
  </v-list-item>
</template>

<script>
export default {
  name: 'WorkerListItem',
  props: { member: Object, index: Number,selected:Boolean },
  data() {
    return {
      selectedCredential: [0],
      types: ['worker', 'auditor'],
    };
  },
};
</script>

<style scoped>
.active {
  background-color: #ff1966 !important;
  color: white;
}
</style>
