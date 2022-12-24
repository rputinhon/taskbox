<template>
  <v-container fill-height fluid class="pa-0 ma-0" style="background-color: white">
    <v-row justify="center" align="center">
      <v-card flat class="px-12 py-5" width="290px" min-height="280" >
        <v-card-title class="mb-5">
          <v-avatar class="mx-auto" v-if="serverReady" left size="80" style="overflow: visible">
            <v-img v-if="avatar" :src="avatar" />
            <svg v-else width="80" version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
              <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="grey" />
            </svg>
            <v-btn v-if="isRegister" absolute class="ml-16 mt-16" icon elevation="0" x-small @click="selectAvatar()">
              <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
                  fill="#353535"
                  style="pointer-events: none"
                />
              </svg>
            </v-btn>
          </v-avatar>
          <svg v-else class="mx-auto" width="60" height="60" version="1.1" viewBox="0 0 48 68" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient id="linearGradient995" x1="25.624" x2="26.147" y1="3.12" y2="37.774" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0067fb" offset="0" />
                <stop stop-color="#1d7aff" offset="1" />
              </linearGradient>
              <linearGradient id="linearGradient1369" x1="24.447" x2="24.97" y1="37.304" y2="54.435" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0066f9" offset="0" />
                <stop stop-color="#003d95" offset="1" />
              </linearGradient>
            </defs>
            <g transform="matrix(1.1572 0 0 1.1572 -3.7612 .87347)" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2.7391" y="12" width="42.5" height="42.5" ry="8.8587" fill="#0055ff" stop-color="#000000" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
              <rect x="2.7391" y="2.7508" width="42.5" height="35" ry="8.8587" fill="#0067fb" stop-color="#000000" stroke-width=".725" style="-inkscape-stroke: none; paint-order: fill markers stroke" />
              <path d="m33.24 11.238c-0.29629-0.08597-0.61513 0.01594-0.80664 0.25781l-0.01758-0.08398-9.7402 9.9883-4.584-4.5703c-0.29301-0.29136-0.76524-0.29483-1.0625-0.0078l-2.5449 2.4531c-0.30488 0.29464-0.3093 0.78191-0.0098 1.082l7.6699 7.668c0.2973 0.29768 0.77998 0.29678 1.0762-2e-3l12.914-13.002c0.29898-0.30065 0.2937-0.78793-0.01172-1.082l-2.6387-2.543-0.02148 0.03125c-0.06124-0.07698-0.13686-0.14133-0.22266-0.18945z" color="#000000" fill="#e6e6e6" style="-inkscape-stroke: none; paint-order: stroke fill markers" />
            </g>
          </svg>
        </v-card-title>
        <v-row align="center" justify="center">
          <validation-observer ref="observer">
            <v-form @submit.prevent>
              <validation-provider v-slot="{ errors }" name="Name" rules="required">
                <v-text-field autofocus v-model="username" :error-messages="errors" label="Username" color="accent" required></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Password" rules="required">
                <v-text-field v-model="password" :error-messages="errors" label="Password" color="accent" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" required :type="showPass ? 'text' : 'password'" @keydown.enter="!isRegister?login():null">
                  <template v-slot:append>
                    <v-btn icon small fab @click.stop="showPass = !showPass">
                      <svg width="40" height="40" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path transform="translate(7 7)" d="m 16.603318,10.487538 c -7.9688576,0 -12.5759362,6.291988 -12.5759362,6.291988 -0.3629984,0.492951 -0.2574995,1.186859 0.2356032,1.549652 0.4931123,0.362867 1.1870497,0.257087 1.5496527,-0.236219 0,0 2.2075366,-2.979893 6.1355373,-4.507971 -0.816027,1.03138 -1.304777,2.331789 -1.304777,3.741183 0,3.328517 2.724778,6.053293 6.053295,6.053293 3.328516,0 6.053296,-2.724776 6.053296,-6.053293 0,-1.398384 -0.481042,-2.689578 -1.285608,-3.717065 4.083388,1.52575 6.644462,4.444277 6.644462,4.444277 0.400809,0.463037 1.101219,0.51316 1.563877,0.111915 0.462633,-0.400754 0.512743,-1.100689 0.111915,-1.563258 0,0 -5.223496,-6.114513 -13.181326,-6.114513 z m 0.09337,3.192682 c 2.028098,0 3.645952,1.617855 3.645952,3.645951 0,2.028098 -1.617854,3.645953 -3.645952,3.645953 -2.028096,0 -3.645951,-1.617855 -3.645951,-3.645953 0,-2.028096 1.617855,-3.645951 3.645951,-3.645951 z" :fill="showPass ? '#0067fb' : '#bdbdbd'" />
                      </svg>
                    </v-btn>
                  </template>
                </v-text-field>
                <v-text-field v-if="isRegister" v-model="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" placeholder="confirm password" required @keydown.enter="isRegister ? register() : login()"></v-text-field>
              </validation-provider>
              <small class="red--text">{{ errorMessage }}</small>
            </v-form>
          </validation-observer>
        </v-row>
        <div class="text-center my-3">
          <v-fade-transition leave-absolute>
            <v-btn v-show="serverReady" block elevation="6" type="submit" class="mt-4 text--darken-4" color="primary" value="log in" @click="isRegister ? register() : login()">{{ isRegister ? stateObj.register.name : stateObj.login.name }}</v-btn>
          </v-fade-transition>
          <v-fade-transition leave-absolute>
            <v-btn block elevation="6" type="submit" class="mt-4 text--darken-4" color="secondary" value="log in" @click="workOffline()">continue offline</v-btn>
          </v-fade-transition>
        </div>
        <v-card-text v-show="serverReady" link class="secondary--text" v-on:click="isRegister = !isRegister">
          <a>{{ toggleMessage }}</a>
        </v-card-text>
        <!-- <small>Or use one of this services above</small> -->
      </v-card>
    </v-row>
    <v-progress-linear v-if="loading" style="z-index: 1001" color="primary" fixed bottom indeterminate />
  </v-container>
</template>

<script>
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate';
import { mapState } from 'vuex';
import { ipcRenderer, nativeImage } from 'electron';
import { profileModel } from '../store/models/ProfileModel';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});

extend('email', {
  ...email,
  message: 'Email must be valid',
});

export default {
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    ready:false,
    loading: false,
    authenticate: false,
    username: null,
    password: null,
    avatar: null,
    confirmPassword: null,
    isRegister: false,
    errorMessage: '',
    stateObj: {
      register: {
        name: 'Signup',
        message: 'Login',
      },
      login: {
        name: 'Login',
        message: 'Register',
      },
    },
    showPass: false,
  }),
  created() {
    // this.ready=false;
    // setTimeout(() => (this.ready = true), 3000);
    // this.resetForm();
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      serverReady: (state) => state.user.serverReady,
    }),
    toggleMessage: function () {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message;
    },
  },
  methods: {
    selectAvatar() {
      ipcRenderer.invoke('app:selectImage').then(async (avatar) => {
        if (avatar == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(avatar, { width: 256, height: 256 });
        this.avatar = clip.toDataURL();
      });
    },
    async workOffline() {
      this.$store.commit('user/WORK_OFFLINE');
    },
    async login() {
      if (!await this.$refs.observer.validate()) return;
      this.loading = true;
      this.$store
        .dispatch('user/LOGIN', { username: this.username, password: this.password })
        .then((response) => {
          if (response && response.error) {
            this.errorMessage = response.message;
            setTimeout(() => (this.loading = false), 1000);
          } else {
            this.errorMessage = '';
          }
            // this.resetForm();
        })
        .catch((error) => {
          this.errorMessage = error.message
          setTimeout(() => (this.loading = false), 1000);
          console.log(error);
        })
        .finally(() => {
          setTimeout(() => (this.loading = false)
          
          , 1000);
        });
    },
    async register() {
      if (!this.$refs.observer.validate()) return;

      this.loading = true;

      let profile = profileModel;
      profile.profilePicture = this.avatar;
      profile.username = this.username;

      if (this.password == this.confirmPassword) {
        this.$store
          .dispatch('user/SIGNUP', { username: this.username, password: this.password, profile: profile })
          .then((response) => {
            if (response.error) {
              this.errorMessage = response.message;
              this.loading = false;
            } else {
              this.errorMessage = '';
            }
          })
          .catch((error) =>{
              if(error.error=='conflict'){
                  this.errorMessage = 'username already in use!';
              }
          })
          .finally(() => {
            setTimeout(() => (this.loading = false), 1000);
          });
      } else {
        this.errorMessage = 'password did not match';
        this.loading=false;
      }
    },
    resetForm() {
      this.username = null;
      this.password = null;
      this.confirmPassword = null;
    },
  },
};
</script>
