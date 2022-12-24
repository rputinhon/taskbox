<template>
  <v-row justify="center">
    <v-dialog v-model="choosing" scrollable max-width="400px" persistent light>
      <v-card v-if="droppingConn" >
        <v-card-title class="my-0 py-0">
          <v-list-item-icon class="mr-0 pr-0">
            <svg  width="38" height="38" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path  d="M 24,5.8925781 C 21.669477,6.5192873 19.431256,7.4955304 17.13811,8.2637827 13.599886,9.5352302 10.061662,10.806678 6.5234375,12.078125 5.3762767,12.774835 5.2269296,14.260409 4.6193636,15.388966 3.679185,17.597849 2.7390063,19.806732 1.7988277,22.015615 1.2307054,24.50009 3.9425225,24.0394 5.3131135,23.417573 c 0.480666,0.06902 0.089379,1.326253 0.216183,1.877482 0,3.074822 0,6.149644 0,9.224466 0.2167716,1.641443 2.0545414,1.655374 3.2557615,2.224815 4.902377,1.76165 9.804753,3.523301 14.70713,5.284951 1.340299,0.190342 2.547407,-0.667693 3.815762,-1.004143 4.799999,-1.740961 9.623297,-3.425071 14.408705,-5.201632 1.197697,-0.800906 0.614946,-2.385073 0.754048,-3.590802 0,-1.993587 0,-3.987173 0,-5.98076 1.071992,-0.56014 2.384344,-0.771912 3.236449,-1.659598 0.695242,-1.230119 -0.33702,-2.488794 -0.624785,-3.699319 -0.859506,-2.480301 -1.817587,-4.942367 -2.615564,-7.434048 -0.04835,-1.494187 -1.776155,-1.561978 -2.81934,-2.040536 C 34.600913,9.6057887 29.554362,7.7931288 24.507812,5.9804688 Z m 0,3.09375 C 28.177734,10.48763 32.355469,11.988932 36.533203,13.490234 32.355469,14.992187 28.177734,16.494141 24,17.996094 24,14.992839 24,11.989583 24,8.9863281 Z M 8.5292969,15.623047 c 4.6100261,1.656901 9.2200521,3.313802 13.8300781,4.970703 0.31132,1.301579 0.05922,2.685196 0.140625,4.020252 0,4.624759 0,9.249519 0,13.874279 -4.656901,-1.673828 -9.313802,-3.347656 -13.9707031,-5.021484 0,-5.947917 0,-11.895833 0,-17.84375 z M 39.470703,27.537109 c 0,1.976563 0,3.953125 0,5.929688 -4.656901,1.673828 -9.313802,3.347656 -13.970703,5.021484 0,-2.453776 0,-4.907552 0,-7.361328 0.161036,1.525095 1.909784,1.876814 3.019617,1.098773 3.650362,-1.562872 7.300724,-3.125745 10.951086,-4.688617 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
          </v-list-item-icon>
          <v-list-item-content class="text-center">
        <!-- <v-list-item-title >
            {{droppingConn.output.node.data.title}}
        </v-list-item-title> -->
          <v-list-item-subtitle class="text-caption">
            Compatible Outputs
          </v-list-item-subtitle>
          </v-list-item-content>
          <v-btn small right fab icon @click="close()">
            <svg  width="28" height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path  d="m 9.9609375,9.9609375 c -0.5807703,0.6159875 -0.6020259,1.5698495 0,2.1718745 L 21.828125,24 9.9609375,35.867188 c -0.6020259,0.602025 -0.6020259,1.569849 0,2.171874 0.6020255,0.602026 1.5698495,0.602026 2.1718745,0 L 24,26.171875 35.867188,38.039062 c 0.602025,0.602026 1.569849,0.602026 2.171874,0 0.602026,-0.602025 0.602026,-1.569849 0,-2.171874 L 26.171875,24 38.039062,12.132812 c 0.602026,-0.602025 0.602026,-1.569849 0,-2.1718745 -0.602025,-0.6020259 -1.569849,-0.6020259 -2.171874,0 L 24,21.828125 12.132812,9.9609375 c -0.819477,-0.65109 -1.591104,-0.6159873 -2.1718745,0 z" fill="#bdbdbd" stop-color="#000000" style="paint-order: fill markers stroke" />
          </svg>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px" class="pa-1">
          <v-list-item-group v-model="selected" @change="updateConnection()" :multiple="isMultiple()">
            <v-list-item
              v-for="(conn, c) in exposedConnections"
              :key="c"
              style="text-align: left"
            >
              <v-list-item-icon v-if="conn">
                <svg
                  width="30"
                  height="30"
                  version="1.1"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  
                  <path
                    :d="getIcon(conn)"
                    :fill="conn.meta.color"
                  />
                </svg>
              </v-list-item-icon>
              <v-list-item-content v-if="conn">
                <v-list-item-title>
                  {{ conn.data.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ conn.meta.category }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action >
                <v-chip small v-if="selected == c" color="primary" >
                  connected
                </v-chip>
                <v-chip small v-else> connect </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <!-- <v-btn v-if="multiple()" small class="px-2 mr-1" color="grey" @click="selected = undefined">
            clear
          </v-btn>
          <v-btn v-if="multiple()" small class="px-6 mr-1" color="primary" @click="selectAll()">
            All
          </v-btn> -->
          <v-spacer></v-spacer>
           <v-btn small class="px-2 mr-1" @click="close()">
            cancel
          </v-btn>
          <v-btn small class="px-2 mr-1" color="primary" @click="submit()">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { iconTypes } from "../../fixtures/iconTypes";
  import { NodeView } from '../../libs/nodeview';
  import { nextTick } from 'process';
  import { getStatusTypeByValue } from '../../enums/taskstate';
import { eventBus } from '../../../main';


  // import { getSocketByNodeName } from "../NodeEditor/Components/index"
  export default {
    name: "ChooseConnection",
    props: ["open", "droppingConn"],
    data() {
      return {
        choosing: false,
        exposedConnections:[],
        selected: undefined,
        outputs: [],
      };
    },
    watch: {
      open(value) {
        this.choosing = value;
        if(value)
          this.getExposedConnections();
      },
    },
    methods: {
      status(){
        return getStatusTypeByValue(this.droppingConn.output.node.data.task.status);
      },
      updateConnection(){
        
        },
      isMultiple(){
        // // console.logthis.droppingConn);
        return this.droppingConn.input.multipleConnections;
      },
        getExposedConnections(){
          this.selected=undefined;
          // let targetType = this.droppingConn.input.socket;
          nextTick(async()=>{
            this.exposedConnections = this.droppingConn.output.data.nodes 
          })
        },
      async submit(){
        if(this.selected == undefined) return this.close();
       
        let inputs = [];

        (typeof(this.selected)==Array)?this.selected.forEach(index => {
          inputs.push(this.exposedConnections[index]);
          }):inputs.push(this.exposedConnections[this.selected]);


        NodeView.connectExposedNode(this.droppingConn, inputs,this.droppingConn.output.isExternal);
          
        
        this.$listeners.close();
      },
      close(){
        eventBus.$emit('updateExternalConnection');
        if(this.droppingConn.output.isExternal)
        this.droppingConn.input.removeConnection();
        else
        NodeView.removeConnection(this.droppingConn);
        this.exposedConnections = [];
        this.$listeners.close();
      },
      getIcon(node) {
        if(!node)return;
        let name = node.name;

        if (node.meta.options)
          name = node.meta.options[node.data.selected].name;

        return iconTypes[name.toLowerCase()];
      },
      selectAll() {
        // for (let i = 0; i <= this.connections.length; i++) {
        //   if (!this.selected.includes(i)) this.selected.push(i);
        // }
      },
    },
  };
</script>
