<template>
    <v-sheet height="100%" width="100%" class="overflow-hidden">
      <v-card :color="status.color" class="pa-6 ma-0" style="width: 100%; height: 100%; overflow-y: auto;">
      </v-card>
    </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import { eventBus } from '../../../main';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import _ from 'lodash';
import * as THREE from 'three';

export default {
  name: 'previewTypeNote',
  data() {
    return {
      editingTitle: false,
      updatedValue: null,
      max: 700,
    };
  },
  mounted() {
    eventBus.$emit('previewLoaded', false);
    
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );

    // animation

    function animation( time ) {

      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;

      renderer.render( scene, camera );

    }

  },
  computed: {
    ...mapState({
      previewingTask: (state) => state.taskbox.previewingTask,
      auditingTask: (state) => state.taskbox.auditingTask,
    }),
    task() {
      return this.auditingTask || this.previewingTask;
    },
    status() {
      return getStatusTypeByValue(this.task.status || 0);
    },
    value: {
      get() {
        console.log();
        return this.task.value;
      },
      set(value) {
        this.updatedValue = value;
      },
    },
    disabled() {
      return this.status.value == taskstate.PAUSED.value || this.status.value == taskstate.REPROVED.value ? true : false;
    },
  },
  methods: {
    setValue() {
      let entity = _.cloneDeep(this.previewingTask);
      entity.value = this.updatedValue;
      this.$store.dispatch('taskbox/UPDATE_TASK', entity);
    },
    onKeyDown(e) {
      if (e.keyCode !== 46 && e.keyCode !== 8 && this.updatedValue && this.updatedValue.length >= this.max) {
        e.preventDefault();
        return;
      }
    },
  },
};
</script>

<style scoped>
.theme--light.v-input input, .theme--light.v-input textarea {
    color: #545454;
}
</style>