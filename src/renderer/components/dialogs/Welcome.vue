<template>
  <v-row align="center" justify="center" style="width: 100vw; height: 100vh" v-if="offlineUserProfile">
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1"> Welcome to TaskBox </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="accent" :complete="e1 > 2" step="2"> Register </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step color="success" :complete="e1 > 3" step="3"> Done </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1" class="mb-6 pa-0">
          <v-card flat class="pa-12" height="380px" width="550px" style="background-image: url('img/background.png'); background-size: cover">
            <v-list-item class="text-center">
              <v-list-item-title class="mt-2">
                <svg width="120" height="120" version="1.1" viewBox="0 0 48 68" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#004fc1" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#0067fb" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="6.2223" y="6" width="35.534" height="28.534" ry="7.6733" fill="#424242" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".64364" style="opacity: 0.3; -inkscape-stroke: none; paint-order: fill markers stroke" />
                  <path d="m32.848 12.855c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" color="#000000" fill="#e6e6e6" stroke-linecap="round" stroke-linejoin="round" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
                </svg>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="mt-0">
              <v-list-item-content>
                <v-list-item-title> Welcome to TaskBox </v-list-item-title>
                <v-list-item-subtitle> A great way to keep your tasks organized. </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-btn color="primary" @click="e1 = 2"> next </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2" class="mb-6 pa-0">
          <v-card flat class="pa-12" height="380px" width="550px" style="background-image: url('img/background2.png'); background-size: cover">
            <div v-if="isOnline()">
              <v-card-subtitle class="ma-0 pa-0"> By registering you can unlock team working features. </v-card-subtitle>
              <!-- <v-row class="pt-0">
                <v-col cols="3">
                  <v-avatar size="100" color="grey">
                    <svg width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                      <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                    </svg>
                  </v-avatar>
                </v-col>
                <v-col cols="9" class="pr-16">
                  <validation-observer ref="observer">
                    <v-form @submit.prevent="doRegister()">
                      <validation-provider v-slot="{ errors }" name="Email" rules="required">
                        <v-text-field v-model="email" type="e-mail" :error-messages="errors" label="e-mail" color="accent" required outlined filled dense></v-text-field>
                      </validation-provider>
                      <validation-provider v-slot="{ errors }" name="Password" rules="required">
                        <v-text-field v-model="password" :error-messages="errors" label="Password" color="accent" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPass = !showPass" required outlined filled dense :type="showPass ? 'text' : 'password'"></v-text-field>
                        <v-text-field v-model="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" placeholder="confirm password" required outlined filled dense></v-text-field>
                        <div class="red--text">{{ errorMessage }}</div>
                        <div class="text-left ml-15 mb-3">
                          <v-btn width="150" elevation="6" type="submit" class="mt-4 text--darken-4" color="primary" value="log in">Register</v-btn>
                        </div>
                      </validation-provider>
                    </v-form>
                  </validation-observer>
                </v-col>
              </v-row>
              <small>Or use one of these services</small> -->

              <v-toolbar flat class="text-center mt-3">
                <v-list-item-title class="text-center">
                  <v-btn fab small elevation="0" class="mx-1" color="primary" @click.stop="logingWithFacebook()"> FB </v-btn>
                  <v-btn fab small elevation="0" class="mx-1" color="success"> GG </v-btn>
                  <v-btn fab small elevation="0" class="mx-1" color="error"> IN </v-btn>
                </v-list-item-title>
              </v-toolbar>
            </div>
            <div v-else>
              <v-list-item class="text-center">
                <v-list-item-title class="mt-1">
                  <svg width="120" height="120" version="1.1" viewBox="0 0 48 68" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#EC407A" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                    <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#FA4081" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                    <rect x="6.2223" y="6" width="35.534" height="28.534" ry="7.6733" fill="#424242" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".64364" style="opacity: 0.3; -inkscape-stroke: none; paint-order: fill markers stroke" />
                    <path transform="matrix(0.58 0 0 0.65 9.2 7)" d="M 22.28125,5.3554688 C 21.395562,5.3239069 20.497766,5.632634 19.794922,6.2871094 18.389234,7.5960601 18.312143,9.7818119 19.621094,11.1875 l 12.912109,13.867188 c 0.874674,0.864499 1.971988,1.687749 3.033203,1.707031 h 8.09961 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.521484 c 0,-1.771858 -1.427361,-3.199219 -3.199218,-3.199219 H 37.152344 L 24.695312,6.4609375 C 24.040837,5.7580935 23.166938,5.3870306 22.28125,5.3554688 Z M 5.1992188,19.923828 C 3.4273614,19.923828 2,21.35119 2,23.123047 V 23.5625 c 0,1.771857 1.4273614,3.199219 3.1992188,3.199219 h 6.4667972 c 1.771857,0 3.199218,-1.427362 3.199218,-3.199219 v -0.439453 c 0,-1.771857 -1.427361,-3.199219 -3.199218,-3.199219 z" color="#000000" fill="#e6e6e6" stroke-linecap="round" stroke-linejoin="round" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
                  </svg>
                </v-list-item-title>
              </v-list-item>
              <v-card rounded="lg">
                <v-list-item class="mt-0 pt-0">
                  <v-list-item-content>
                    <v-list-item-subtitle> You are not online, but you still can work offline. </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-row class="pt-0">
                    <v-col cols="3">
                      <v-btn x-large icon @click="selectAvatar()">
                        <v-avatar size="60" color="grey">
                          <svg v-if="!avatar" width="40" height="40" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
                            <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
                          </svg>
                          <v-img v-else :src="`data:image/png;base64,${avatar}`" />
                        </v-avatar>
                      </v-btn>
                      <div class="mt-2" style="font-size: 12px">click to select</div>
                    </v-col>
                    <v-col cols="9" class="pr-16 py-5">
                      <validation-observer ref="observer">
                        <validation-provider v-slot="{ errors }" name="username" rules="required">
                          <v-text-field type="text" :error-messages="errors" v-model="offlineUserProfile.username" label="username" color="accent" required outlined filled dense></v-text-field>
                        </validation-provider>
                        <!-- <div class="red--text">{{ errorMessage }}</div> -->
                        <div class="text-left ml-7 mb-3">
                          <v-btn :disabled="!offlineUserProfile.username" width="150" elevation="6" type="submit" class="mt-4 text--darken-4" color="primary" value="log in" @click="submit()">Register</v-btn>
                        </div>
                      </validation-observer>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-card>
            </div>
          </v-card>
          <!-- <v-btn color="accent" @click="e1 = 3"> Continue </v-btn> -->
        </v-stepper-content>
        <v-stepper-content step="3" class="mb-6 pa-0">
          <v-card flat class="pa-12" height="380px" width="550px" style="background-image: url('img/background3.png'); background-size: cover">
            <v-list-item class="text-center">
              <v-list-item-title class="mt-4">
                <svg width="120" height="120" version="1.1" viewBox="0 0 48 68" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#3fc03fff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#4CAF50" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
                  <rect x="6.2223" y="6" width="35.534" height="28.534" ry="7.6733" fill="#424242" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".64364" style="opacity: 0.3; -inkscape-stroke: none; paint-order: fill markers stroke" />
                  <path d="m32.848 12.855c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" color="#000000" fill="#e6e6e6" stroke-linecap="round" stroke-linejoin="round" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
                </svg>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="mt-3">
              <v-list-item-content>
                <v-list-item-title> Ready to Start! </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-btn color="success" @click="goToWorkspace()"> start </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-row>
</template>

<script>
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate';
// import { mapActions } from "vuex";

setInteractionMode('eager');

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});

extend('email', {
  ...email,
  message: 'Email must be valid',
});

import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';

export default {
  name: 'Welcome',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      e1: 1,
      email: '',
      username: '',
      avatar: undefined,
      password: null,
      loading: false,
      confirmPassword: '',
      isRegister: false,
      errorMessage: '',
      stateObj: {
        register: {
          name: 'Signup',
          message: 'Already have an Account? login.',
        },
        login: {
          name: 'Login',
          message: 'Signup',
        },
      },
      showPass: false,
    };
  },
  watch: {
    loading(val) {
      if (!val) return;
      setTimeout(() => (this.loading = false), 3000);
    },
  },
  async created() {
    // this.$store.dispatch('user/GET_OFFLINE_USER');
  },
  async mounted() {

    // this.avatar = this.offlineUserProfile.profilePicture;
  },
  computed: {
    ...mapState({
      offlineUserProfile: (state) => state.user.profile,
    }),
    toggleMessage: function () {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message;
    },
  },
  methods: {
    async goToWorkspace() {
      this.$listeners.init();
      // this.offlineUserProfile.firstTime = false;
      // await this.$store.dispatch('user/UPDATE_OFFLINE_PROFILE', this.offlineUserProfile);
    },
    isOnline() {
      return navigator.onLine ? true : false;
    },
     logingWithFacebook() {
       ipcRenderer.invoke('fb-authenticate').then(async (response)=>{
        console.log(response);
      }).catch((error)=>{
        console.error(error);
      }).finally((
        )=>{
        this.e1 = 3;
      })
    },
    selectAvatar() {
      ipcRenderer.invoke('app:selectImage').then((avatar) => {
        if (avatar == undefined) return;
        console.log(avatar);
        this.offlineUserProfile.profilePicture = avatar[0];
        this.avatar = avatar;
      });
    },
    async doLogin() {
      const { username, password } = this;

      if (!username || !password) return;

      try {
        this.loading = true;
        await this.login({ username, password });
        this.loading = false;
      } catch (error) {
        if (error.status === 401) this.errorMessage = 'username or password are incorrect!';
      }
    },
    doRegister() {
      const { username, password, confirmPassword } = this;

      if (username == '' || password == '' || confirmPassword == '') return;

      if (password == confirmPassword) {
        try {
          this.register({ username, password });
        } catch (error) {
          this.errorMessage = error.reason;
        }
      } else {
        this.errorMessage = 'password did not match';
      }
    },
    async submit() {
      if (!this.offlineUserProfile.username) return;
      
      this.e1 = 3;
    },
    resetForm() {
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
    },
  },
};
</script>

