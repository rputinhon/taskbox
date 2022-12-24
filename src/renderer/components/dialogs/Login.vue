<template>
  <v-dialog v-model="showLoginWindow" max-width="290" overlay-opacity="0.9" persistent @keydown.escape="$emit('close')">
    <v-card flat class="px-12 py-5" width="290px" min-height="280">
      <v-card-title class="mb-5">
        <v-avatar class="mx-auto" v-if="avatar || isRegister" left size="80" style="overflow: visible">
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
        <v-avatar class="mx-auto" size="80" tile v-else>
          <v-img :src="'img/logo_worm_128_flat.png'" />
        </v-avatar>
      </v-card-title>
      <v-row align="center" justify="center">
        <validation-observer ref="observer">
          <v-form @submit.prevent>
            <validation-provider v-slot="{ errors }" name="Name" rules="required">
              <v-text-field autofocus v-model="username" :error-messages="errors" label="Username" color="accent" required @blur="getUser()"></v-text-field>
            </validation-provider>
            <validation-provider v-slot="{ errors }" name="Password" rules="required">
              <v-text-field v-model="password" :error-messages="errors" label="Password" color="accent" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" required :type="showPass ? 'text' : 'password'" @keydown.enter="!isRegister ? login() : null">
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
      <div class="text-center my-5">
        <v-fade-transition leave-absolute>
          <v-btn rounded :disabled="!serverReady" :block="serverReady" elevation="6" type="submit" class="mt-4 text--darken-4" color="primary" value="log in" @click="isRegister ? register() : login()">{{ isRegister ? stateObj.register.name : stateObj.login.name }}</v-btn>
        </v-fade-transition>
          <v-btn rounded :loading="retrying" v-if="!serverReady" color="error" outlined class="mt-4 ml-1" @click="retry()">
           ! reconnect
          </v-btn>
        <v-fade-transition leave-absolute>
          <v-btn rounded block elevation="6" type="submit" class="mt-4 text--darken-4" color="secondary" value="log in" @click="workOffline()">continue offline</v-btn>
        </v-fade-transition>
      </div>
      <v-card-text v-show="serverReady" link class="secondary--text" v-on:click="isRegister = !isRegister">
        <a>{{ toggleMessage }}</a>
      </v-card-text>
      <!-- <small>Or use one of this services above</small> -->
      <v-progress-linear v-if="loading" color="primary" absolute bottom indeterminate />
    </v-card>
  </v-dialog>
</template>

<script>
import { required, email } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate';
import { mapState } from 'vuex';
import { ipcRenderer, nativeImage } from 'electron';
import { profileModel } from '../../store/models/ProfileModel';

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
    ready: false,
    loading: false,
    retrying:false,
    isOpen: false,
    authenticate: false,
    username: null,
    password: null,
    avatar: null,
    confirmPassword: null,
    isRegister: false,
    errorMessage: '',
    stateObj: {
      register: {
        name: 'Register',
        message: 'Signin',
      },
      login: {
        name: 'Signin',
        message: 'Register',
      },
    },
    showPass: false,
    defaultHost: 'http://localhost:5984',
      url: '',
  }),
  watch: {
    showLoginWindow(value) {
      if (value) this.resetForm();
    },
  },
  created() {
    // this.ready=false;
    // setTimeout(() => (this.ready = true), 3000);
    // this.resetForm();
    this.url = window.localStorage.getItem('host') || this.defaultHost;
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      showLoginWindow: (state) => state.app.showLoginWindow,
      serverReady: (state) => state.user.serverReady,
    }),
    toggleMessage: function () {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message;
    },
  },
  methods: {
    getUser() {
      this.avatar = window.localStorage.getItem(this.username);
    },
    selectAvatar() {
      ipcRenderer.invoke('app:selectImage',{multiple:false}).then(async (avatar) => {
        if (avatar == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(avatar[0], { width: 128, height: 128 });
        this.avatar = clip.toDataURL();
      });
    },
    async workOffline() {
      this.resetForm();
      this.$store.commit('app/TOGGLE_LOGIN_WINDOW', false);
    },
    saveHost() {
      window.localStorage.setItem('host', this.url);
      this.$store.commit('app/INIT_SERVER', this.url);
    },
    retry() {
      this.retrying=true;
      setTimeout(() => {
        this.url=this.defaultHost;
        this.saveHost();
        this.retrying=false;
      }, 2000);
    },
    async login() {
      if (!(await this.$refs.observer.validate())) return;
      this.loading = true;
      this.$store
        .dispatch('user/LOGIN', { username: this.username, password: this.password })
        .then((response) => {
          setTimeout(() => (this.loading = false), 500);
          if (response && response.error) {
            this.errorMessage = response.message;
          } else {
            setTimeout(() => {
              this.$store.commit('app/TOGGLE_LOGIN_WINDOW', false);
            }, 500);
            this.errorMessage = '';
          }
          // this.resetForm();
        })
        .catch((error) => {
          this.errorMessage = error.message;
          setTimeout(() => (this.loading = false), 500);
        })
        .finally(() => {});
    },
    async register() {
      if (!this.$refs.observer.validate()) return;

      this.loading = true;

      let profile = Object.assign({}, profileModel);
      profile.profilePicture = this.avatar;
      profile.username = this.username;

      if (this.password == this.confirmPassword) {
        this.$store
          .dispatch('user/SIGNUP', { username: this.username, password: this.password, profile: profile })
          .then((response) => {
            setTimeout(() => (this.loading = false), 500);
            if (response && response.error) {
              this.errorMessage = response.message;
            } else {
              setTimeout(() => {
                this.$store.commit('app/TOGGLE_LOGIN_WINDOW', false);
              }, 500);
              this.errorMessage = '';
            }
          })
          .catch((error) => {
            if (error.error == 'conflict') {
              this.errorMessage = 'username already in use!';
            }
          });
      } else {
        this.errorMessage = 'password did not match';
        this.loading = false;
      }
    },
    resetForm() {
      if (this.$refs.observer) this.$refs.observer.reset();

      this.avatar = null;
      this.username = null;
      this.password = null;
      this.confirmPassword = null;
      this.isRegister = false;
    },
  },
};
</script>
