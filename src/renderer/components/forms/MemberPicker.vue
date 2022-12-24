<template>
  <v-card width="210" max-height="400px" min-height="300" class="overflow-y-auto" color="grey lighten-2">
    <v-app-bar absolute height="30">
      <v-btn x-small class="mx-2" width="93px" color="secondary" @click="(many = []), (single = null)"> clear </v-btn>
      <v-btn x-small color="primary" width="93px" @click="setWorkers()"> ok </v-btn>
    </v-app-bar>
    <v-list-item-group v-model="selection" :multiple="multiple" class="mt-8 pa-1 ma-0 overflow-y-auto" active-class="selectedMember">
      <member-item v-for="member in memberList" :key="member" :size="30" :id="member" :options="['username']" :extraClass="'px-2'" :height="38" :align="'left'" />
    </v-list-item-group>
  </v-card>
</template>

<script>
import store from '../../store';
import MemberItem from '../lists/MemberItem.vue';
export default {
  components: { MemberItem },
  name: 'MemberPicker',
  props: { list: Array, multiple: Boolean },
  data() {
    return {
      single: 0,
      many: [],
    };
  },
  mounted() {
    if (this.multiple) this.many = this.list.map((i) => this.memberList.indexOf(i));
    else this.single = this.memberList.indexOf(this.list[0]);
  },
  computed: {
    profile() {
      return store.state.user.profile;
    },
    members() {
      return store.state.connection.members;
    },
    memberList() {
      return this.members.map((m) => m.member).concat([this.profile.id]);
    },
    selection: {
      get() {
        return this.multiple ? this.many : this.single;
      },
      set(value) {
        this.multiple ? (this.many = value) : (this.single = value);
      },
    },
  },
  methods: {
    setWorkers() {
      this.$listeners.select(this.getSelection());
    },
    getSelection() {
      if (this.multiple) return this.selection.map((s) => this.memberList[s]).filter((s) => s !== undefined);
      else return this.selection !== undefined ? [this.memberList[this.selection]] : [];
    },
    isSelected(id) {
      return this.list.includes(id);
    },
  },
};
</script>

<style scoped>
.selectedMember {
  background-color: #0187f3 !important;
}
</style>
