<template>
  <v-sheet>
    <canvas id="3dModelViewer" width="600px" height="100%"> </canvas>
  </v-sheet>
</template>

<script>
var THREE = require('three');
var FBXLoader = require('three-fbx-loader');
let renderer, cube, scene, camera, geometry, material;
export default {
  name: 'preview3dModel',
  props: { node: {}, file: {}, mime: String },
  mounted() {
    this.$nextTick(()=>{

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 600 / 500, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3dModelViewer'), alpha: true, antialias: true });
      renderer.setSize(600, 500);
  
      geometry = new THREE.BoxGeometry(1, 1, 1);
      material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      
      const loader = new FBXLoader();
      loader.load('T-Rex.fbx', function (object3d) {
        console.log(object3d);
        scene.add(object3d);
      });
  
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
  
      camera.position.z = 5;
  
      renderer.render(scene, camera);
      // requestAnimationFrame(this.animate);
    })
  },
  methods: {
    animate() {
      cube.rotation.z += 0.01;
      cube.rotation.y += 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(this.animate);
    },
  },
};
</script>
