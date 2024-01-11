<template>
  <v-toolbar flat :color="'transparent'" height="30" class="windowbar-button">
    <v-fade-transition hide-on-leave leave-absolute group>
      <v-list-item v-if="analysing == false && hasSelection()" key="0" class="mr-0 pr-0">
        <v-tooltip v-if="!selecting" bottom transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab v-bind="attrs" v-on="on" icon @click="boxit()">
              <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 23.999999,5.8916056 a 1.50015,1.50015 0 0 0 -0.507812,0.087891 L 6.5234372,12.077153 a 1.5,1.5 0 0 0 -0.875,0.873047 1.5,1.5 0 0 0 -0.029297,0.0332 1.5,1.5 0 0 0 0.00391,0.07226 1.5,1.5 0 0 0 -0.083984,0.41211 1.5,1.5 0 0 0 -0.00977,0.02148 V 34.5205 a 1.50015,1.50015 0 0 0 0.9941406,1.41211 l 16.9687502,6.097656 a 1.50015,1.50015 0 0 0 0.230469,0.03516 1.5,1.5 0 0 0 0.271484,0.04297 1.50015,1.50015 0 0 0 0.294922,-0.04492 1.5,1.5 0 0 0 0.21875,-0.0332 L 41.478515,35.93262 a 1.50015,1.50015 0 0 0 0.992188,-1.41211 V 13.48926 a 1.50015,1.50015 0 0 0 -0.0039,-0.03125 1.5,1.5 0 0 0 -0.02148,-0.224609 1.50015,1.50015 0 0 0 -0.0059,-0.04102 1.5,1.5 0 0 0 -0.191407,-0.486328 1.50015,1.50015 0 0 0 -0.04297,-0.06445 1.5,1.5 0 0 0 -0.154297,-0.193359 1.50015,1.50015 0 0 0 -0.0078,-0.0059 1.5,1.5 0 0 0 -0.208984,-0.179687 1.50015,1.50015 0 0 0 -0.0059,-0.002 1.5,1.5 0 0 0 -0.216797,-0.125 1.50015,1.50015 0 0 0 -0.06055,-0.02734 1.5,1.5 0 0 0 -0.07227,-0.03125 L 24.507812,5.9794962 a 1.50015,1.50015 0 0 0 -0.507813,-0.087891 z m 0,3.09375 4.154297,1.4921884 -12.18164,4.630859 -4.50586,-1.619141 z m 6.613282,2.3769534 5.919922,2.126953 -12.533204,4.50586 -5.568359,-2.001954 z M 8.5292962,15.622075 22.499999,20.643559 v 17.84375 L 8.5292962,33.465825 Z m 30.9414068,0 v 17.84375 L 25.499999,38.487309 V 20.641606 Z"
                  :fill="!hasFramable() ? 'rgba(0,0,0,0.26)' : '#1070ff'"
                  stop-color="#000000"
                  style="paint-order: fill markers stroke"
                />
              </svg>
            </v-btn>
          </template>
          <span>pack selection in a taskBox</span>
        </v-tooltip>
        <v-tooltip v-else bottom transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab v-bind="attrs" v-on="on" icon @click.stop="unboxit()" :disabled="!readyToUnpack">
              <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 24,5.8925781 C 21.669477,6.5192873 19.431256,7.4955304 17.13811,8.2637827 13.599886,9.5352302 10.061662,10.806678 6.5234375,12.078125 5.3762767,12.774835 5.2269296,14.260409 4.6193636,15.388966 3.679185,17.597849 2.7390063,19.806732 1.7988277,22.015615 1.2307054,24.50009 3.9425225,24.0394 5.3131135,23.417573 c 0.480666,0.06902 0.089379,1.326253 0.216183,1.877482 0,3.074822 0,6.149644 0,9.224466 0.2167716,1.641443 2.0545414,1.655374 3.2557615,2.224815 4.902377,1.76165 9.804753,3.523301 14.70713,5.284951 1.340299,0.190342 2.547407,-0.667693 3.815762,-1.004143 4.799999,-1.740961 9.623297,-3.425071 14.408705,-5.201632 1.197697,-0.800906 0.614946,-2.385073 0.754048,-3.590802 0,-1.993587 0,-3.987173 0,-5.98076 1.071992,-0.56014 2.384344,-0.771912 3.236449,-1.659598 0.695242,-1.230119 -0.33702,-2.488794 -0.624785,-3.699319 -0.859506,-2.480301 -1.817587,-4.942367 -2.615564,-7.434048 -0.04835,-1.494187 -1.776155,-1.561978 -2.81934,-2.040536 C 34.600913,9.6057887 29.554362,7.7931288 24.507812,5.9804688 Z m 0,3.09375 C 28.177734,10.48763 32.355469,11.988932 36.533203,13.490234 32.355469,14.992187 28.177734,16.494141 24,17.996094 24,14.992839 24,11.989583 24,8.9863281 Z M 8.5292969,15.623047 c 4.6100261,1.656901 9.2200521,3.313802 13.8300781,4.970703 0.31132,1.301579 0.05922,2.685196 0.140625,4.020252 0,4.624759 0,9.249519 0,13.874279 -4.656901,-1.673828 -9.313802,-3.347656 -13.9707031,-5.021484 0,-5.947917 0,-11.895833 0,-17.84375 z M 39.470703,27.537109 c 0,1.976563 0,3.953125 0,5.929688 -4.656901,1.673828 -9.313802,3.347656 -13.970703,5.021484 0,-2.453776 0,-4.907552 0,-7.361328 0.161036,1.525095 1.909784,1.876814 3.019617,1.098773 3.650362,-1.562872 7.300724,-3.125745 10.951086,-4.688617 z"
                  :fill="!readyToUnpack ? 'rgba(0,0,0,0.26)' : '#1070ff'"
                  stop-color="#000000"
                  style="paint-order: fill markers stroke"
                />
              </svg>
            </v-btn>
          </template>
          <span>split taskBox</span>
        </v-tooltip>

        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab v-bind="attrs" v-on="on" icon :disabled="disabled || !hasFramable()" @click.stop="addGroup()">
              <svg width="18" height="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 10.90625 0 C 4.8642974 0 0 4.8642974 0 10.90625 L 0 37.09375 C 0 43.135703 4.8642974 48 10.90625 48 L 37.09375 48 C 43.135703 48 48 43.135703 48 37.09375 L 48 10.90625 C 48 4.8642974 43.135703 0 37.09375 0 L 10.90625 0 z M 12.335938 4.5527344 L 35.664062 4.5527344 C 39.975997 4.5527344 43.447266 8.0238976 43.447266 12.335938 L 43.447266 35.664062 C 43.447266 39.975997 39.976101 43.447266 35.664062 43.447266 L 12.335938 43.447266 C 8.0240015 43.447266 4.5527344 39.976101 4.5527344 35.664062 L 4.5527344 12.335938 C 4.5527344 8.0240015 8.0238976 4.5527344 12.335938 4.5527344 z M 16.232422 8.7460938 C 14.713687 8.7460938 13.492188 9.9695464 13.492188 11.488281 C 13.492188 13.007016 14.713687 14.228516 16.232422 14.228516 L 31.767578 14.228516 C 33.286313 14.228516 34.507812 13.007016 34.507812 11.488281 C 34.507812 9.9695464 33.286313 8.7460938 31.767578 8.7460938 L 16.232422 8.7460938 z "
                  :fill="!hasFramable() ? 'rgba(0,0,0,0.26)' : '#1070ff'"
                  stop-color="#000000"
                  style="paint-order: fill markers stroke"
                />
              </svg>
            </v-btn>
          </template>
          <span>Group Selected</span>
        </v-tooltip>

        <v-tooltip bottom transition="none">
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="disabled || !hasSelection()" fab v-bind="attrs" v-on="on" icon @click.stop="deleteSelected()">
              <svg width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z"
                  :fill="hasSelection() ? (shift ? '#ff5555' : '#1070ff') : 'rgba(0,0,0,0.26)'"
                  stop-color="#000000"
                  style="paint-order: fill markers stroke"
                />
              </svg>
            </v-btn>
          </template>
          <span>Delete Selected {{ shift ? ' (force)' : '' }}</span>
        </v-tooltip>
      </v-list-item>
    </v-fade-transition>
    <v-list-item class="mx-0 pl-0">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab v-bind="attrs" v-on="on" x-small icon :disabled="disabled">
            <svg v-if="selecting" width="25" height="25" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 12.887695,7.9667971 0.324219,12.6445319 0.322266,12.644531 7.679687,-4.699219 7.355469,11.476562 5.826172,-3.734374 -7.279297,-11.353516 7.996094,-4.894531 -11.111328,-6.041016 z" :fill="disabled ? 'rgba(0,0,0,0.26)' : '#bdbdbd'" stop-color="#000000" style="paint-order: fill markers stroke" />
            </svg>
            <svg v-else width="18" height="18" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m 17.529297,6.3496094 c -0.28482,-3.546e-4 -0.59337,0.033323 -0.927735,0.1074218 -2.32285,0.5147672 -2.137302,3.0263927 -1.736328,4.7949218 1.255555,4.225224 2.776852,8.621198 3.978647,13.53592 0,0 0.746508,3.171384 0.411097,4.656107 -2.887789,-2.953147 -8.374262,-6.366353 -11.2817897,-2.036903 -1.2921296,1.869072 4.2035297,4.182328 5.4704547,5.632379 10.207398,11.363152 14.459845,13.632522 22.861559,10.408681 5.830514,-2.237241 5.842325,-9.770732 5.378395,-14.395403 -0.637576,-6.355659 -1.095642,-10.767838 -4.808742,-10.505662 -1.144833,0.08084 -1.43553,0.718343 -1.43553,0.718343 -0.863016,-1.868598 -3.782428,-1.999235 -4.692507,-0.900271 -0.640128,-0.863645 -1.605398,-1.003749 -2.680409,-1.003816 -2.331743,0.326126 -3.394762,1.519688 -3.394531,3.394531 0.0022,0.194626 0.02116,0.388701 0.05664,0.580079 -0.101887,-0.126374 -0.211722,-0.413089 -0.330078,-0.84961 L 20.943359,9.546875 C 20.365445,8.0439475 19.523035,6.3520916 17.529297,6.3496094 Z"
                :fill="disabled ? 'rgba(0,0,0,0.26)' : '#bdbdbd'"
                stop-color="#000000"
                style="paint-order: fill markers stroke"
              />
            </svg>
          </v-btn>
        </template>
        <span>Mode (ctrl)</span>
      </v-tooltip>
      <v-tooltip  top transition="none">
      <template v-slot:activator="{ on, attrs }">
        <v-btn  class="ml-2 windowbar-button" :color="analysing !== false ? 'error' : 'rgba(0,0,0,0.3)'" v-on="on" elevation="0" height="20" width="20" v-bind="attrs" x-small fab @click="toggleAnalisis()" @mouseover.prevent>
          <svg style="pointer-events: none !important" width="20" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 26.25,11.744141 c -1.06005,0.196305 -1.897801,0.886739 -2.513672,1.726562 -0.61587,0.839824 -1.070946,1.861359 -1.464844,3.005859 -0.787794,2.289001 -1.315457,5.094488 -1.83789,7.808594 -0.522434,2.714106 -1.045153,5.342115 -1.703125,7.111328 -0.328986,0.884607 -0.700916,1.54137 -1.003907,1.863282 -0.30299,0.321911 -0.389572,0.345564 -0.667968,0.302734 -0.887825,-0.136589 -1.607472,-0.742172 -2.265625,-1.828125 -0.658154,-1.085953 -1.163673,-2.588955 -1.503906,-4.095703 -0.680467,-3.013496 -0.734376,-5.980469 -0.734375,-5.980469 a 1.1825,1.1825 0 0 0 -1.203125,-1.162109 1.1825,1.1825 0 0 0 -1.16211,1.201172 c 0,0 0.04562,3.153226 0.792969,6.46289 0.373672,1.654832 0.915466,3.36257 1.787109,4.800781 0.871644,1.438212 2.165865,2.668096 3.929688,2.939454 1.047428,0.161142 2.083322,-0.311221 2.75,-1.019532 0.666677,-0.70831 1.10994,-1.616581 1.498047,-2.660156 0.776212,-2.087149 1.285666,-4.773562 1.808593,-7.490234 0.522928,-2.716673 1.054571,-5.458074 1.751953,-7.484375 0.348692,-1.013151 0.742724,-1.840397 1.134766,-2.375 0.392043,-0.534604 0.722296,-0.742121 1.039063,-0.800781 0.317538,-0.0588 0.614944,0.0077 1.082031,0.353515 0.467087,0.345766 1.020266,0.977435 1.560547,1.816406 1.080561,1.677944 2.121098,4.147348 2.984375,6.66211 1.726553,5.029523 2.789062,10.230468 2.789062,10.230468 a 1.1825,1.1825 0 0 0 1.394531,0.921875 1.1825,1.1825 0 0 0 0.921875,-1.394531 c 0,0 -1.07716,-5.305276 -2.86914,-10.52539 C 33.648932,19.524708 32.584002,16.933431 31.3125,14.958984 30.676749,13.971761 29.993164,13.131405 29.171875,12.523438 28.350586,11.91547 27.309279,11.547978 26.25,11.744141 Z"
              stroke-width="2"
              :stroke="'#fafafa'"
              :fill="'#fafafa'"
            />
          </svg>
        </v-btn>
      </template>
      toggle analisis
    </v-tooltip>
    </v-list-item>
  </v-toolbar>
</template>

<script>
import { eventBus } from '../../../main';
import { NodeView } from '../../libs/nodeview';
import { mapState } from 'vuex';
export default {
  name: 'ToolsBar',
  props: { disabled: Boolean },
  data() {
    return {
      comments: [],
      searching: false,
      selecting: false,
      selected: [],
      deletingNodes: [],
      openDeleteConfirm: false,
      shift: false,
    };
  },
  created() {
    eventBus.$on('commentselected', (comment) => {
      if (comment == null) return (this.comments = []);
      this.comments.push(comment);
    });

    eventBus.$on('selected', (nodes) => {
      this.selected = nodes;
    });

    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  },
  computed: {
    ...mapState({
      analysing: (state) => state.taskbox.analysing,
      library: (state) => state.library.library,
    }),
    readyToUnpack() {
      return this.selected.length == 1 && this.selected[0].name == 'TaskBox' && !this.disabled ? true : false;
    },
    readyToPack() {
      return this.selected.length > 0 && !this.disabled ? true : false;
    },
  },
  methods: {
    toggleAnalisis() {
      this.$store.commit('taskbox/CHANGE_ANALISIS', this.analysing == false ? 'progress' : false);
      this.$store.commit('taskbox/ANALISE');
    },
    addGroup() {
      NodeView.addGroup();
    },
    isTaskBox() {
      let selected = this.selected;
      if (!selected) return false;
      return selected.length == 1 && selected[0].name == 'TaskBox' ? true : false; //&& Object.keys(this.selected[0].data.nodes).length > 0
    },
    async boxit() {
      NodeView.boxit();
    },
    unboxit() {
      NodeView.unboxit(this.selected[0]);
    },
    hasSelection() {
      let selected = this.selected;
      if (!selected) return false;
      return selected.length > 0 || this.comments.length > 0 ? true : false;
    },
    hasFramable() {
      let selected = this.selected;
      if (!selected) return false;
      return selected.length > 0 && this.comments.length == 0 ? true : false;
    },
    deleteSelected(shift) {
      NodeView.deleteSelected(shift);
      this.comments.splice(0, this.comments.length);
    },
    keyup() {
      this.selecting = false;
      this.shift = false;
      NodeView.ctrlKeyPressed(false);
    },
    keydown(e) {
      if (this.showPreview || this.disabled) return;

      if (e.shiftKey) {
        this.shift = true;
      }

      if (e.ctrlKey) {
        NodeView.ctrlKeyPressed(true);
        this.selecting = true;
        if (e.shiftKey) this.selecting = false;
      }

      if (e.key === 'd') {
        if (e.ctrlKey) {
          e.preventDefault();
          if (this.selected.list)
            this.selected.list.forEach((element) => {
              NodeView.duplicateNode(element);
            });
        }
      }

      if (e.key === 'a') {
        if (e.ctrlKey) {
          e.preventDefault();
          NodeView.selectAll();
        }
      }

      if (e.key === 'b') {
        if (e.ctrlKey) {
          e.preventDefault();
          // NodeView.boxit();
          // if (e.shiftKey) NodeView.unboxit();
        }
      }

      if (e.key === 's') {
        if (e.ctrlKey) {
          e.preventDefault();
          NodeView.saveTaskBox(true);
        }
      }

      if (e.key === 'Delete' && this.selected.length>0) {
        e.preventDefault();

        this.deleteSelected(e.shiftKey);
      }

      if (e.key === 'f' && e.ctrlKey) eventBus.$emit('search');

      if (e.key === 'Escape') NodeView.clearSelection();
    },
  },
};
</script>
