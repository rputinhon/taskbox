<template>

    <v-snackbar rounded="pill"  color="error" outlined right top v-model="snackbar" :multi-line="multiLine">

      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn icon color="error" fab  v-bind="attrs" @click="cleanError">
          <svg  width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path  d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
        </v-btn>
      </template>

    </v-snackbar>

</template>

<script>

export default {
    props: ["message", "show"],
    data: () => ({
      multiLine: true,
      snackbar:false
    }),
    watch:{
        snackbar(value){
            if(value==false)
            this.cleanError()
        },
        show(value){
            return this.snackbar=value;
        }
    },
    methods:{
        cleanError(){
            this.snackbar=false;
            this.$store.commit('SET_ERROR_STATE',null);
        }
    }
  };
</script>
