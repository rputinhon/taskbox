<template>
  <v-sheet width="100%" height="calc(100vh - 60px)" class="pb-3" color="background">
    <v-card-title height="40px" class="text-subtitle-1" v-if="!searching">
      <v-list-item class="ma-0 pa-0" style="min-height: 30px; width: 100%">
        <v-list-item-icon class="pa-0 mr-1">
          <svg class="mx-1" style="pointer-events: none" width="23" height="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path :d="icon" fill="#0187f3" />
          </svg>
        </v-list-item-icon>

        <v-list-item-content class="text-left" style="min-width: 180px">
          <v-list-item-title> Templates </v-list-item-title>
          <v-list-item-subtitle>
            <v-tooltip bottom transition="none">
              <template v-slot:activator="{ on }">
                <v-list-item v-on="on" link class="ma-0 pa-0" style="min-height: 15px" @click="openFolder()">
                  <small v-on="on" style="font-size: 11px"> {{ folder }}</small>
                </v-list-item>
              </template>
              open folder
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="updateList()">
                <svg style="pointer-events: none" width="20" height="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path
                    d="m 28.140727,1.9592277 c -3.712435,2.1435384 -7.42487,4.2870767 -11.137305,6.4306152 3.712599,2.1430821 7.424944,4.2866031 11.137305,6.4300981 v -3.416329 c 3.85871,1.271454 6.94063,4.256307 8.315254,8.133354 1.522952,4.295395 0.728999,9.060692 -2.103747,12.630752 -1.100653,1.38662 -0.868828,3.402954 0.517798,4.503602 1.387027,1.100297 3.403417,0.86777 4.503599,-0.519348 4.200301,-5.293563 5.383573,-12.386901 3.125391,-18.755961 -2.258179,-6.36906 -7.645813,-11.1358729 -14.24254,-12.6012975 -0.03848,-0.00622 -0.07707,-0.011729 -0.115755,-0.016536 z M 9.612142,10.605212 c -4.8769639,5.256283 -6.4999034,12.76998 -4.2266155,19.570381 2.2732881,6.8004 8.0888365,11.82859 15.1463625,13.095325 0.06113,0.008 0.122479,0.01418 0.183968,0.0186 v 2.751254 c 3.712271,-2.143649 7.424796,-4.286861 11.137306,-6.430097 -3.712436,-2.143538 -7.424871,-4.287076 -11.137306,-6.430614 v 3.572907 c -4.326978,-1.1079 -7.819576,-4.329509 -9.250081,-8.608776 -1.5337477,-4.588111 -0.44303,-9.633235 2.847371,-13.179557 1.203571,-1.297811 1.12746,-3.325506 -0.170015,-4.529439 -1.400971,-1.1671185 -3.388026,-1.0259098 -4.53099,0.170016 z"
                    fill="grey"
                  />
                </svg>
              </v-btn>
            </template>
            refresh
          </v-tooltip>
        </v-list-item-action>

        <v-list-item-action class="mx-0 px-0">
          <v-tooltip bottom transition="none">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon x-small fab @click="searching = true">
                <svg style="pointer-events: none" width="26" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d=" m 22.121137,7.9380399 c -7.822717,0 -14.1953125,6.3725951 -14.1953125,14.1953121 0,7.822717 6.3725955,14.197266 14.1953125,14.197266 3.350703,0 6.433047,-1.173105 8.865234,-3.125 2.121511,2.137665 4.243856,4.274288 6.365235,6.412109 0.583525,0.58805 1.533022,0.593256 2.121094,0.0098 0.02338,-0.03229 0.04564,-0.06559 0.06641,-0.09961 0.03404,-0.02075 0.06735,-0.04301 0.09961,-0.06641 0.583525,-0.58805 0.580281,-1.537599 -0.0078,-2.121094 -2.136704,-2.124482 -4.276181,-4.245945 -6.416016,-6.367187 1.939424,-2.428166 3.103516,-5.501038 3.103516,-8.839844 0,-7.822717 -6.374549,-14.1953121 -14.197266,-14.1953121 z m 0,3.0000001 c 6.201398,0 11.197266,4.993914 11.197266,11.195312 0,6.201398 -4.995868,11.197266 -11.197266,11.197266 -6.201398,0 -11.195313,-4.995868 -11.195313,-11.197266 0,-6.201398 4.993915,-11.195312 11.195313,-11.195312 z" fill="grey" />
                </svg>
              </v-btn>
            </template>
            search
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-card-title>

    <v-card-title v-else style="height: 92px">
      <v-text-field v-model="search" autofocus rounded dense solo placeholder="search" hide-details="true">
        <template v-slot:append>
          <v-btn style="margin-right:-18px" color="primary" rounded x-small @click="(searching = false), (search = '')">close</v-btn>
        </template>
      </v-text-field>
    </v-card-title>

    <v-list class="my-0 py-0 mx-3" v-for="(template, t) in filteredList" :key="t" color="transparent">
      <template-item :template="template" :folder="folder" :isFile="template.extension" />
    </v-list>

    <empty :text="' '" :extraClass="'mb-12 mr-5'" :icon="icon" v-if="isEmpty" />
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import TemplateItem from './TemplateItem.vue';
import { ipcRenderer } from 'electron';
import store from '../../store';
import Empty from '../dialogs/Empty.vue';
import { eventBus } from '../../../main';

export default {
  name: 'TemplateList',
  components: {
    TemplateItem,
    Empty,
  },
  props: { clean: Boolean, folder: String },
  data() {
    return {
      loading: false,
      infiles: false,
      searching: false,
      search: '',
      icon: 'm 17.5625,9.8007813 c -0.06095,1.5059437 0.562363,2.5833647 1.076172,3.4179687 l -2.986328,-0.02734 c -3.872322,-0.03624 -7.0195315,3.149968 -7.0195315,7.00586 v 17.109375 c 0,3.855834 3.1500175,7.005859 7.0058595,7.005859 h 16.722656 c 3.855841,0 7.005859,-3.150026 7.005859,-7.005859 v -2.75 -0.01758 c -0.02414,-0.96789 -0.262931,-1.907709 -1.02539,-2.52539 -0.76246,-0.617681 -1.667045,-0.584494 -2.277344,-0.470703 C 35.454154,31.65676 34.956185,31.857418 34.548828,32 c -0.407357,0.142582 -0.742269,0.197266 -0.677734,0.197266 -1.816448,0 -3.230469,-1.414023 -3.230469,-3.230469 v -0.04297 c 0,-1.816443 1.414022,-3.230469 3.230469,-3.230469 h 0.0039 0.002 c -0.02591,1.28e-4 0.320388,0.05466 0.730469,0.181641 0.410081,0.126978 0.904404,0.302161 1.478515,0.410156 0.574112,0.107996 1.340572,0.211049 2.144532,-0.296875 0.803959,-0.507924 1.136718,-1.513001 1.136718,-2.40039 v -3.390625 c 0,-3.855838 -3.153017,-6.984874 -6.998046,-7.007813 l -3.542969,-0.02148 c 0.162408,-0.394901 0.361344,-0.837343 0.560547,-1.337891 0.233225,-0.586037 0.476562,-1.185296 0.476562,-1.9882811 0,-3.3838406 -2.77049,-6.1387551 -6.154297,-6.1542969 C 19.982731,3.6703882 17.539418,6.4922256 17.5625,9.8007813 Z M 23.708984,6.6875 c 1.773788,0 3.154297,1.3805118 3.154297,3.1542969 0,0.00549 -0.07755,0.4112231 -0.263672,0.8789061 -0.186123,0.467683 -0.445941,1.018391 -0.667968,1.591797 -0.222028,0.573406 -0.492315,1.127768 -0.361329,2.033203 0.06549,0.452718 0.346661,1.042718 0.820313,1.386719 0.473652,0.344001 0.987473,0.427 1.439453,0.429687 l 4.521484,0.02734 c 2.256921,0.01347 4.015625,1.761701 4.015625,4.007813 v 3.0625 c -0.251888,-0.06525 -0.520477,-0.14083 -0.873046,-0.25 -0.461906,-0.143026 -0.944342,-0.318952 -1.626954,-0.316407 -3.424094,0.0022 -6.226562,2.805897 -6.226562,6.230469 v 0.04297 c 0,3.425901 2.804566,6.230469 6.230469,6.230469 0.728719,0 1.214928,-0.207932 1.669922,-0.367188 0.357242,-0.125041 0.614616,-0.203502 0.841796,-0.265625 0.0065,0.0584 -0.01801,-0.04675 -0.01563,0.04883 v 2.69336 c 0,2.246104 -1.75975,4.005859 -4.005859,4.005859 H 15.638672 c -2.24611,0 -4.005859,-1.759756 -4.005859,-4.005859 V 20.197266 c 0,-2.246063 1.762869,-4.026722 3.992187,-4.00586 l 4.179687,0.03906 c 0.441138,0.0041 0.858778,-0.01668 1.353516,-0.253906 0.494738,-0.237222 1.00174,-0.891447 1.082031,-1.457032 0.160582,-1.131169 -0.297481,-1.559682 -0.585937,-2.072265 -0.576912,-1.025167 -1.122694,-2.093635 -1.101563,-2.5332035 l 0.002,-0.035156 v -0.037109 c 0,-1.7737838 1.380514,-3.1542969 3.154297,-3.1542969 z',
      templateList: [],
    };
  },
  mounted() {
    this.updateList();
  },
  computed: {
    ...mapState({
      myTemplates: (state) => state.templates.myTemplates,
    }),
    authenticated() {
      return store.getters['user/authenticated'];
    },
    filteredList() {
      if (!this.templates) return;
      return this.templates.filter((t) => t.name.toLowerCase().includes(this.search));
    },
    templates() {
      if (!this.myTemplates) return[];
      return this.myTemplates.fromRepository;
    },
    isEmpty() {
      if (!this.myTemplates) return true;
      if (this.infiles && this.myTemplates.fromFiles && this.myTemplates.fromFiles.length > 0) return false;
      else {
        if (this.myTemplates.fromRepository && this.myTemplates.fromRepository.length > 0) return false;
        else return true;
      }
    },
  },
  methods: {
    importTemplate() {
      ipcRenderer.invoke('app:import-Template').then(async (result) => {
        if (!result) return;
        else {
          let request = {
            name: result.data.title,
            subject: result.data.task.subject,
            description: result.data.task.description,
            data: result.data,
          };
          await this.$store.dispatch('templates/SAVE_TEMPLATE', request);
        }
      });
    },
    async updateList() {
      this.loading = true;
      eventBus.$emit('setWorking',true)
      this.$store.dispatch('templates/FETCH_ALL').then(() => {
        setTimeout(() => {
          this.loading = false;
          eventBus.$emit('setWorking',false)
        }, 700);
      });
    },
    async openFolder() {
      ipcRenderer.send('app:openFolder', this.folder);
    },
  },
};
</script>
