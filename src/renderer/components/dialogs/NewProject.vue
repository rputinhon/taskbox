<template>
  <v-row justify="center" align="center">
    <v-dialog v-model="isOpen" style="z-index: 11" max-width="350" persistent>
      <v-card rounded="lg" class="pa-3 py-6">
        <v-img class="my-6">
          <svg  width="70" height="70" version="1.1" viewBox="-5 -6 48 48" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(.34139 0 0 .34139 -8.5743 -59.818)">
              <path d="m76.781 178.69c-8.9402 0.0545-18.945 3.0151-25.223 7.8928l-15.842 12.308c-3.5719 2.7752-5.3375 5.7089-5.3964 8.3673l-0.0258 1.6772v57.679h0.0396c0.13482 3.4095 3.1213 6.3251 8.7954 7.7947l42.732 11.067c10.262 2.6576 25.262-0.43892 33.633-6.9426l15.839-12.308c3.5262-2.7397 5.1603-5.6234 5.2805-8.2432l0.0422-1e-3 0.0913-59.258-0.0132 0.0164c-1e-3 -3.512-3.007-6.5268-8.8131-8.0305l-42.731-11.069c-2.5654-0.66441-5.4268-0.96847-8.4068-0.95031z" fill="#047dff" stroke-width="2.6384" />
              <path d="m74.781 237.89a4.1032 4.4694 0 0 0-2.8968 1.3188l-12.792 14.024-4.9628-5.204a4.1032 4.4694 0 0 0-5.8012 0.11832 4.1032 4.4694 0 0 0 0.10863 6.321l7.8727 8.2554a4.1036 4.4699 0 0 0 5.7563-0.0693l15.641-17.143a4.1032 4.4694 0 0 0-0.01907-6.321 4.1032 4.4694 0 0 0-2.9062-1.3005z" color="#000000" fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7305" />
              <path d="m76.781 178.69c-8.9402 0.0545-18.945 3.0151-25.223 7.8928l-15.491 12.097c-6.2641 4.3386-5.8203 8.4888-5.7725 10.255-0.09826 4.0056 5.0536 6.7343 8.835 7.7947 12.599 3.5329 42.732 11.067 42.732 11.067 10.262 2.6576 23.182 0.74982 31.553-5.7538l17.919-13.496c3.5262-2.7397 5.6503-5.7787 5.4764-9.226-0.30655-6.0753-5.1602-7.4949-9.2388-8.6115l-42.381-11.069c-2.5654-0.66441-5.4268-0.96847-8.4068-0.95031z" fill="#049bff" stroke-width="2.6384" />
            </g>
          </svg>
        </v-img>
        <v-card-subtitle> Create a new TaskBox Project </v-card-subtitle>
        <v-card-text class="text-center py-2">
          <v-text-field rounded dense ref="name" autofocus v-model="name" required label="Name" placeholder="Name" outlined flat> </v-text-field>
          <v-autocomplete rounded :items="items" :search-input.sync="search" :label="subject || 'Task'" hide-no-data outlined dense ref="subject" placeholder="ex: Car, Project, House ..."> </v-autocomplete>
          <v-textarea  dense required v-model="description" ref="description" height="80px" no-resize placeholder="Description" filled flat> </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn small rounded elevation="2" color="error" @click="clear()"> clear </v-btn>
          <v-spacer></v-spacer>
          <v-btn small rounded elevation="2" color="secondary" @click="clear(), $emit('close')"> cancel </v-btn>
          <v-btn x-small fab elevation="2" color="primary" @click="addProject()">
            <svg width="35" height="35" version="1.1" viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg">
              <path d="m32.848 12.855c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" :fill="'#fafafa'" stop-color="#000000" style="paint-order: fill markers stroke" />
            </svg>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { taskObjectRepository } from '../../store/modules/taskObjects/taskObjectsRepository';

export default {
  name: 'NewProject',
  props: { open: Boolean, taskbox: {} },
  data() {
    return {
      isOpen: false,
      isLoading: false,
      subject: null,
      name: null,
      description: null,
      descriptionLimit: 60,
      search: null,
      searchFilter: '',
      entries: [],
    };
  },
  watch: {
    open(value) {
      this.isOpen = value;
    },
    searching(value) {
      if (value == false) {
        this.searchFilter = '';
        this.$refs.searchbar.blur();
      }
    },
    async search(value) {
      if (value !== null) this.subject = value;
      if (this.items.length > 0) return;
      if (this.isLoading) return;
      this.isLoading = true;

      await taskObjectRepository
        .findAll()
        .then((res) => {
          this.entries = res;
        })
        .catch((err) => {
          this.$store.commit('SET_ERROR_STATE', err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    items() {
      return this.entries.map((entry) => {
        return entry.name;
      });
    },
  },
  methods: {
    clear() {
      this.subject = null;
      this.name = null;
      this.description = null;
    },
    async addProject() {
      let request = {
        title: this.name,
        subject: this.subject,
        // label: this.label,
        description: this.description,
        type: 'taskbox',
      };

      if (this.name == '' || !this.name) return;
      if (this.subject == '' || !this.subject) return;
      // if (this.label == '' || !this.label) return;
      if (this.description == '' || !this.description) return;

      await this.$store.dispatch('taskbox/CREATE_ROOT', request);

      this.name = null;
      this.subject = null;
      // this.label = 'my projects';
      this.description = null;
      this.$listeners.close();
    },
  },
};
</script>
