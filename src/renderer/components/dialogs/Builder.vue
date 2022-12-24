<template>
  <v-sheet width="91%" height="100vh" class="py-6">
    <v-row>
      <v-col cols="2">
        <v-btn fab small outlined color="error">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="8">
        <v-select
          label="Node Types"
          rounded
          dense
          :items="getTypesNames"
          solo-inverted
          v-model="selectedType"
          mandatory
        />
      </v-col>
      <v-col cols="2">
        <v-btn fab small outlined color="primary" @click="addNewType()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <pre
          v-if="selectedType"
          style="height:100vh;text-align:left;overflow:scroll"
          contenteditable="true"
        >
                    <code @blur="submit()" >
                    {{nodeType}}
                    </code>
                  </pre>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
  import { mapState } from "vuex";
  import { blockTypesFixtures } from "../../fixtures/blockTypes";
  import { eventBus } from "../../../main";
  import store from "../../store";
  export default {
    name:"Builder",
    data() {
      return {
        notifications: false,
        selectedType: 0,
      };
    },
    watch: {
      selected(value) {
        return this.nodeTypes.map((t) => t.name).indexOf(value);
      },
    },
    computed: {
      ...mapState({
        libraryItems: (state) => state.library.library,
      }),
      nodeTypes() {
        if (!this.libraryItems) return;
        return this.libraryItems.blockLibrary.blocktypes;
      },
      nodeType() {
        if (!this.nodeTypes) return;
        return JSON.stringify(
          this.nodeTypes.find((t) => t.name === this.selectedType),
          null,
          2
        );
      },
      getTypesNames() {
        if (!this.nodeTypes) return;
        return this.nodeTypes.map((t) => t.name);
      },
    },
    methods: {
       async addNewType() {
        let type = Object.assign({},blockTypesFixtures[0]);
        type.name = 'newType';
        this.nodeTypes.push(type);
        await store.commit("library/SET_LIBRARY", this.libraryItems);
      },
      async c() {
        await store.dispatch("library/UPDATE_LIBRARY", this.libraryItems);
        eventBus.$emit("registerComponents");
      },
    },
  };
</script>
