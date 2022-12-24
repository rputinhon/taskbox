<template>
  <v-row justify="center">
    <v-dialog v-model="libraryDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" rounded absolute left bottom large color="accent">
          <v-icon>mdi-book</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Block Type to Library
        </v-card-title>

        <v-card-text>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <validation-provider
                v-slot="{ errors }"
                name="name"
                rules="required|max:10"
              >
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :error-messages="errors"
                  label="Name"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="type"
                rules="required|max:10"
              >
                <v-text-field
                  v-model="name"
                  :counter="10"
                  :error-messages="errors"
                  label="Type"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="description"
                rules="required|max:100"
              >
                <v-text-field
                  v-model="name"
                  :counter="100"
                  :error-messages="errors"
                  label="Description"
                  required
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="select"
                rules="required"
              >
                <v-select
                  v-model="select"
                  :items="categories"
                  :error-messages="errors"
                  label="Category"
                  data-vv-name="select"
                  required
                ></v-select>
              </validation-provider>
              <v-btn color="primary" class="ma-2" dark @click="dialog2 = true">
                add Category
              </v-btn>
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="checkbox"
              >
                <v-checkbox
                  v-model="checkbox"
                  :error-messages="errors"
                  value="1"
                  label="Option"
                  type="checkbox"
                  required
                ></v-checkbox>
              </validation-provider>
              <v-card-actions>
                <v-divider></v-divider>
                <v-spacer></v-spacer>
                <v-btn
                  class="mr-4"
                  type="submit"
                  :disabled="invalid"
                  @click="dialog = false"
                >
                  submit
                </v-btn>
                <v-btn @click="clear">
                  clear
                </v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addCategoryDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Dialog 2
        </v-card-title>

        <v-card-actions>
          <v-btn color="primary" text @click="dialog2 = false">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { required, digits, email, max, regex } from "vee-validate/dist/rules";
  import {
    extend,
    ValidationObserver,
    ValidationProvider,
    setInteractionMode,
  } from "vee-validate";

  setInteractionMode("eager");

  extend("digits", {
    ...digits,
    message: "{_field_} needs to be {length} digits. ({_value_})",
  });

  extend("required", {
    ...required,
    message: "{_field_} can not be empty",
  });

  extend("max", {
    ...max,
    message: "{_field_} may not be greater than {length} characters",
  });

  extend("regex", {
    ...regex,
    message: "{_field_} {_value_} does not match {regex}",
  });

  extend("email", {
    ...email,
    message: "Email must be valid",
  });

  export default {
    props: ["libraryOpen"],
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data: () => ({
      libraryDialog: false,
      addCategoryDialog: false,
      name: "",
      type: "",
      description: "",
      category: null,
      categories: [],
      compatiblewith: [],
      isactive: false,
    }),
    watch: {
      libraryOpen(val) {
        this.settings = val;
      },
    },
    methods: {
      submit() {
        this.$refs.observer.validate();
      },
      clear() {
        this.name = "";
        this.phoneNumber = "";
        this.email = "";
        this.select = null;
        this.checkbox = null;
        this.$refs.observer.reset();
      },
    },
  };
</script>
