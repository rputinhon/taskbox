<template>
  <v-menu ref="datetime" offset-y z-index="100" top :close-on-content-click="false" v-if="task">
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip top transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-btn  style="border-radius: 0px; pointer-events: all" class="windowbar-button ma-0 pa-0" :disabled="type == 'plannedToStartAt' ? started : completed" v-on="{ ...onMenu, ...onTooltip }" elevation="0" height="100%" min-width="10px" :width="hovering ? '50px' : '10px'" :color="hovering || hasDue ? dueColor : 'rgba(100,100,100,0.1)'" @mouseenter="hovering = true" @mouseleave="hovering = false">
            <small class="mt-0 my-auto" v-if="hovering">
            {{dueDate}}
            </small>
            
            <svg v-if="hasDue && !isLate"  version="1.1" width="18" viewBox="-30 0 150 150" xmlns="http://www.w3.org/2000/svg">
               <rect x="24" y="0" width="48" height="48" ry="24" fill="white" />
            </svg>
          </v-btn>
        </template>
        set due
      </v-tooltip>
    </template>

    <v-card color="background" class="pa-0">
      <v-fade-transition leave-absolute hide-on-leave>
        <v-date-picker v-if="!istime" locale="pt" v-model="datepicker" @change="istime = true" />
        <v-time-picker v-else format="24hr" ampm-in-title scrollable v-model="timepicker" />
      </v-fade-transition>

      <v-spacer class="my-2">
        <v-btn text small @click="istime = false" :color="istime ? 'dark' : 'primary'"><b class="dark--text" v-text="'due in: ' + date"></b></v-btn> |
        <v-btn text small @click="istime = true" :color="!istime ? 'dark' : 'primary'"><b class="dark--text" v-text="' at: ' + timepicker + ' hs'"></b></v-btn>
      </v-spacer>

      <v-card-actions>
        <v-spacer>
          <v-btn elevation="2" color="secondary" x-small @click="close()"> cancel </v-btn>
          <v-btn v-if="hasDue" class="ml-2" elevation="2" color="accent" x-small @click="setnodue()"> clear </v-btn>
          <v-btn elevation="2" class="ml-2" color="primary" x-small @click="setdue()"> ok </v-btn>
          <v-menu v-if="hasDue" ref="extend" offset-x z-index="100" right>
            <template v-slot:activator="{ on: onMenu }">
              <v-tooltip top transition="none">
                <template v-slot:activator="{ on: onTooltip }">
                  <v-btn x-small class="ml-2" color="warning" v-on="{ ...onMenu, ...onTooltip }" elevation="0">+</v-btn>
                </template>
                extend
              </v-tooltip>
            </template>
            <v-card flat max-width="120">
              extend by
              <v-divider></v-divider>
              <v-list v-for="(time, t) in types" :key="t" class="my-0 py-0">
                <v-list-item class="my-0 py-0" link @click="addTime(t)" style="min-height: 33.2px">
                  <v-list-item-subtitle class="text-subtitle-1">
                    {{ time.value + ' ' + time.text }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-spacer>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import moment from 'moment';
import store from '../../store';
import { dueTypes } from '../../store/models/TaskModel';

export default {
  name: 'DateTimePicker',
  props: { task: Object, type: String, dueColor: String,  started: Boolean, completed: Boolean, isLate: Boolean },
  data() {
    return {
      hovering: false,
      istime: false,
      datepicker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      timepicker: moment().format('HH:mm'),
      types: [
        { text: 'minute', value: 1 },
        { text: 'minutes', value: 5 },
        { text: 'minutes', value: 10 },
        { text: 'minutes', value: 20 },
        { text: 'hour', value: 1 },
        { text: 'hours', value: 2 },
        { text: 'hours', value: 4 },
        { text: 'hours', value: 6 },
        { text: 'day', value: 1 },
        { text: 'week', value: 1 },
        { text: 'month', value: 1 },
      ],
    };
  },
  created() {},
  computed: {
    duetype() {
      return dueTypes[this.type];
    },
    date() {
      return moment(this.datepicker).format('DD/MM/YY');
    },
    hasDue() {
      return this.task.due[this.type];
    },
    dueDate() {
      return this.hasDue ? moment(this.task.due[this.type]).format('DD/MM HH:mm') : 'due';
    },
  },
  methods: {
    setdue() {
      let date = new Date(`${this.datepicker} ${this.timepicker}`).toISOString();
      store.commit(`task/${dueTypes[this.type].function}`, { entity: this.task, date: date });

      if (this.$refs.extend.isActive) this.$refs.extend.isActive = false;
      if (this.$refs.datetime.isActive) this.$refs.datetime.isActive = false;
    },
    setnodue() {
      store.commit(`task/${dueTypes[this.type].function}`, { entity: this.task, date: null });
      this.$refs.extend.isActive = false;
      this.$refs.datetime.isActive = false;
    },
    addTime(t) {
      this.$store.commit('task/ADD_EXTRA_TIME', { entity: this.task, time: this.types[t] });
      this.$refs.extend.isActive = false;
      this.$refs.datetime.isActive = false;
    },
    close() {
      this.$refs.extend.isActive = false;
      this.$refs.datetime.isActive = false;
    },
  },
};
</script>

<style>
.v-picker__title {
  height: 100px !important;
}
</style>

<style scoped>
.v-menu__content {
  overflow: hidden;
}

.v-toolbar__content,
.v-toolbar__extension {
  padding: 0px !important;
}
.v-application .pb-3 {
  padding-bottom: 0px !important;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 0px;
}
.v-messages__message {
  text-align: center;
}
</style>
