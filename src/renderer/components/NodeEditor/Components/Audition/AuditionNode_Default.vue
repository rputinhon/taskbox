<template>
  <div :class="selected()" class="nodeBase" :style="`height: ${size}px !important;width:${calcWidth - (size / 2 - 5)}px;`">
    <v-row no-gutters class="nodeBody" style="height: 200px !important" :style="`height: ${size}px !important;width:${calcWidth - 10}px;margin-top:-5px!important`">
      <v-col align-self="center" cols="1">
        <div class="input" v-for="input in inputs()" :key="input.key" @mouseenter="ishoverSocket(input.key)" @mouseleave="hoverSocket = null">
          <Socket v-socket:input="input" type="input" :socket="input.socket" style="background: grey !important"></Socket>
          <external-input v-for="(ext, e) in externalInputs" :index="e" :externalInput="ext" @remove="removeExternalinput" :key="e" />
        </div>
      </v-col>
      <v-col align-self="center" cols="10">
        <v-row align="center" justify="center">
          <svg :id="`id:${node.id}`" :name="node.name" style="pointer-events: all" class="categoryIcon" :style="`width:${calcWidth}px;height: ${size}px !important;`" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect :x="`${-calcWidth / 2}`" y="-0.1" :width="calcWidth - 20" :height="48" :ry="size / 2" :fill="`transparent`" />
          </svg>
          <div class="control">
            <avatar-list :list="auditors || []" :concat="size / 3" :size="size" :max="3" />
          </div>
          <v-menu rounded="0" ref="memberpicker" right offset-x light nudge-top="12" nudge-left="0" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn fixed right v-on="on" v-bind="attrs" fab small class="px-1 ml-3 mr-3" color="primary">
                <svg height="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
                    :fill="'white'"
                  />
                </svg>
              </v-btn>
            </template>
            <member-picker @select="setAuditors" :multiple="true" :list="auditors || []" />
          </v-menu>
        </v-row>
      </v-col>
      <v-col align-self="center" cols="1">
        <div class="output" v-for="output in outputs()" :key="output.key" @mouseenter="ishoverSocket(output.key)" @mouseleave="hoverSocket = null" style="margin-right: 40px">
          <Socket v-socket:output="output" type="output" :socket="output.socket" style="background: grey !important"></Socket>
        </div>
      </v-col>
    </v-row>
    <div class="control" v-for="control in controls()" v-control="control" :key="control.key"></div>
    <LOD :lod="LODTYPE.MEDIUM" v-if="showLabel">
      <div class="title">
        <span> Audition</span>
      </div>
    </LOD>
  </div>
</template>

<script>
import LODTYPES from '../../../../enums/LOD';
import store from '../../../../store';
import VueRenderPlugin from 'rete-vue-render-plugin';
import ExternalInput from '../ExternalInput.vue';
import LOD from '../../../navigation/Lod.vue';
import { NodeView } from '../../../../libs/nodeview';
import MemberPicker from '../../../forms/MemberPicker.vue';
import AvatarList from '../../../lists/AvatarList.vue';

export default {
  name: 'AuditionNode_Default',
  extends: VueRenderPlugin.Node,
  components: {
    ExternalInput,
    LOD,
    MemberPicker,
    AvatarList,
  },
  data() {
    return {
      editingTitle: false,
      updatedTitle: '',
      hoverSocket: null,
      externalInputs: null,
      refreshkey: 0,
      size: 190,
    };
  },
  mounted() {
    this.update();
  },
  computed: {
    auditors() {
      this.refreshkey;
      return this.node.data.auditors || null;
    },
    LODTYPE() {
      this.refreshkey;
      return LODTYPES;
    },
    showLabel() {
      if (!store.state.app.displaySettings) return false;
      return store.state.app.displaySettings[1].value;
    },
    calcWidth() {
      this.refreshkey;
      let auditorsCount = this.node.data.auditors ? this.node.data.auditors.length : 1;
      if (auditorsCount > 3) auditorsCount = 4;
      return this.size * auditorsCount - (this.size / 3) * auditorsCount + this.size;
    },
  },
  methods: {
    update() {
      this.refreshkey++;
    },
    setAuditors(list) {
      NodeView.setDataToNode(this.node.id, {auditors:list});
      this.$refs.memberpicker.isActive = false;
    },
    removeExternalinput(id) {
      store.commit('task/REMOVE_EXTERNAL_VALUE', { task: this.task, inputId: id });
    },
    // IO data
    ishoverSocket(key) {
      this.hoverSocket = key;
    },
  },
};
</script>

<style scoped>
.output {
  left: 50px !important;
}
</style>
