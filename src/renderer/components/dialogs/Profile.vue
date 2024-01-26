<template>
  <v-menu rounded="lg" offset-y bottom left nudge-right="50" :close-on-click="true" :close-on-content-click="false" @click.stop @blur.capture="isActive = false">
    <template v-slot:activator="{ on: onMenu }">
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on: onTooltip }">
          <v-badge style="z-index:1" color="warning" left offset-x="36" bottom offset-y="17" :value="hasMessages" dot />
          <v-btn fab :icon="!authenticated" v-on="{ ...onMenu, ...onTooltip }" class="windowbar-button" elevation="0" height="30" width="30" x-small>
            <member-item v-if="authenticated" :size="28" :options="['onlyAvatar', 'bordered']" />
            <svg v-else width="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="m 9.8872518,9.9461628 c -0.7040827,0 -1.2707237,0.5671572 -1.2707237,1.2712402 v 2.965194 c 0,0.704083 0.566641,1.27124 1.2707237,1.27124 H 37.737748 c 0.704083,0 1.270722,-0.567157 1.270722,-1.27124 v -2.965194 c 0,-0.704083 -0.566639,-1.2712402 -1.270722,-1.2712402 z m 0,11.1125002 c -0.7040827,0 -1.2707237,0.567157 -1.2707237,1.27124 v 2.965194 c 0,0.704083 0.566641,1.271239 1.2707237,1.271239 H 37.737748 c 0.704083,0 1.270722,-0.567156 1.270722,-1.271239 v -2.965194 c 0,-0.704083 -0.566639,-1.27124 -1.270722,-1.27124 z m 0,10.583334 c -0.7040827,0 -1.2707237,0.567155 -1.2707237,1.271238 v 2.965196 c 0,0.704083 0.566641,1.271238 1.2707237,1.271238 H 37.737748 c 0.704083,0 1.270722,-0.567155 1.270722,-1.271238 v -2.965196 c 0,-0.704083 -0.566639,-1.271238 -1.270722,-1.271238 z" fill="grey" />
            </svg>
          </v-btn>
        </template>
        Messages
      </v-tooltip>
    </template>

    <v-card min-width="450px" max-width="450px" min-height="450px" height="650px" color="background" style="overflow: hidden">
      <v-app-bar class="pa-0 ma-0" height="40" flat color="white">
        <v-tabs class="pa-0 ma-0" hide-slider v-model="memberTab" height="40">
          <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-2 windowbar-button">
            <v-badge color="warning" left offset-x="35" bottom offset-y="17" :value="hasMessages" dot />
            <svg height="28" version="1.1" viewBox="-5 -5 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                :style="memberTab !== 0 && 'filter: grayscale(1)!important;'"
                d="m 9.7554768,1.9197794 c -5.2488448,0 -9.47435701,4.2255121 -9.47435701,9.4743566 v 10.826213 c 0,4.497199 0.87137051,6.433385 1.94975171,10.882023 0.608895,2.511693 2.0803879,4.665348 4.6648315,4.665348 2.5844434,0 3.853265,-2.211636 4.664831,-4.665348 l 0.465605,-1.407665 h 17.938958 c 5.248843,0 9.474356,-4.225512 9.474356,-9.474358 V 11.394136 c 0,-5.2488445 -4.225513,-9.4743566 -9.474356,-9.4743566 z M 10.851017,13.780554 A 3.367596,3.367596 0 0 1 14.21877,17.14779 3.367596,3.367596 0 0 1 10.851017,20.515543 3.367596,3.367596 0 0 1 7.4837808,17.14779 3.367596,3.367596 0 0 1 10.851017,13.780554 Z m 9.009269,0 a 3.367596,3.367596 0 0 1 3.367753,3.367236 3.367596,3.367596 0 0 1 -3.367753,3.367753 3.367596,3.367596 0 0 1 -3.367236,-3.367753 3.367596,3.367596 0 0 1 3.367236,-3.367236 z m 8.995833,0 a 3.367596,3.367596 0 0 1 3.367755,3.367236 3.367596,3.367596 0 0 1 -3.367755,3.367753 3.367596,3.367596 0 0 1 -3.367236,-3.367753 3.367596,3.367596 0 0 1 3.367236,-3.367236 z"
                :fill="'#049cff'"
              />
            </svg>
          </v-tab>
          <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-3 windowbar-button">
            <v-badge color="primary" left offset-x="35" bottom offset-y="17" :value="hasTasks" dot />
            <svg version="1.1" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path :style="memberTab !== 1 && 'filter:grayscale(1)'" d="m 27.869099,7.3592406 c -0.0059,0.00582 -0.01175,0.011671 -0.01757,0.017571 L 15.712736,19.593636 11.775508,15.802653 c -2.3844606,-2.296403 -6.2323023,-2.22586 -8.5291946,0.15813 -2.29821147,2.38477 -2.2261004,6.2341 0.1596802,8.531262 v 0.0021 l 8.2170694,7.910114 c 2.359122,2.270783 6.1547,2.228842 8.463049,-0.09354 L 36.41018,15.884818 C 38.744077,13.536056 38.731785,9.6851501 36.38279,7.3514891 36.35686,7.3260311 36.33015,7.3013871 36.30269,7.2775921 33.709749,5.197852 30.043786,5.30006 27.869096,7.3592411 Z" :fill="'#0187f3'" />
            </svg>
          </v-tab>
          <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-2 windowbar-button">
            <v-badge color="primary" left offset-x="35" bottom offset-y="17" :value="hasInvitations" dot />
            <svg height="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                :style="memberTab !== 2 && 'filter:grayscale(1)'"
                d="m 15.799846,15.472064 c -4.691982,0 -8.5338938,3.841912 -8.5338938,8.533895 v 0.0024 c 0.00219,1.754435 0.5627167,3.410711 1.5163438,4.801357 -3.6742287,1.070006 -6.4272008,4.336342 -6.4272008,8.345839 v 2.499468 c 1.012e-4,1.009635 0.8185463,1.82808 1.8281816,1.828182 H 27.064112 c 1.009635,-1.02e-4 1.82808,-0.818547 1.828181,-1.828182 v -2.499468 c 0,-3.903169 -2.601925,-7.122957 -6.127265,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691983 -3.841912,-8.533895 -8.533895,-8.533895 z m 0,3.656364 c 2.715126,0 4.876234,2.160358 4.877532,4.87515 -0.0024,1.946412 -1.149412,3.695969 -2.935089,4.470476 -1.813196,0.791537 -1.252392,3.498107 0.726036,3.504015 h 1.592518 c 2.898623,0 5.175087,2.278293 5.175087,5.177466 v 0.671286 H 6.0114583 v -0.671286 c 0,-2.899173 2.276462,-5.177466 5.1750867,-5.177466 h 1.944823 c 1.979735,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784948,-0.774191 -2.93405,-2.522646 -2.937469,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162408,-4.875151 4.877531,-4.875151 z M 32.552465,6.5167582 c -4.691983,0 -8.533894,3.8419118 -8.533894,8.5338938 v 0.0024 c 0.0022,1.754435 0.562715,3.41071 1.516342,4.801357 -0.350673,0.102122 -0.688913,0.230476 -1.02121,0.371349 0.356126,1.002958 0.552263,2.078543 0.552263,3.199317 v 0.0024 c -1.89e-4,0.15345 -0.01133,0.305013 -0.01905,0.457045 0.821177,-0.545753 1.813396,-0.86172 2.89224,-0.86172 h 1.944823 c 1.979736,-0.0033 2.5428,-2.711944 0.728416,-3.504015 -1.784947,-0.774191 -2.93405,-2.522643 -2.937468,-4.468095 v -0.0024 c 0.0013,-2.714792 2.162407,-4.875151 4.877531,-4.875151 2.715125,0 4.876233,2.160359 4.877531,4.875151 -0.0024,1.946412 -1.149412,3.695969 -2.935088,4.470476 -1.813197,0.791537 -1.252392,3.498107 0.726035,3.504014 h 1.592518 c 2.898624,0 5.175086,2.278295 5.175086,5.177468 V 28.87157 H 24.704133 c 1.798049,0.972797 2.691769,1.930582 3.984864,3.656363 h 15.127726 c 1.009635,-1.01e-4 1.82808,-0.818546 1.828181,-1.828181 v -2.499467 c 0,-3.903169 -2.601925,-7.122957 -6.127264,-8.283948 0.982787,-1.404003 1.566434,-3.080197 1.568713,-4.863248 v -0.0024 c 0,-4.691982 -3.841911,-8.5338938 -8.533894,-8.5338938 z"
                :fill="'#0187f3'"
              />
            </svg>
          </v-tab>
          <v-tab :style="`min-width: 50px;max-width:50px;`" class="pa-2 windowbar-button">
            <svg height="28" version="1.1" viewBox="0 -5 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                :style="memberTab !== 3 && 'filter:grayscale(1)'"
                d="m 8.9624917,-0.40566 c -5.14645,0 -9.35137003,4.20492 -9.35137003,9.35137 v 21.79608 c 0,5.14645 4.20492003,9.35137 9.35137003,9.35137 H 30.758572 c 5.14645,0 9.35136,-4.20492 9.35136,-9.35137 V 8.94571 c 0,-5.14645 -4.20491,-9.35137 -9.35136,-9.35137 z m 0,3.84525 H 30.758572 c 3.08251,0 5.50612,2.42362 5.50612,5.50612 v 21.79608 c 0,3.08251 -2.42361,5.50612 -5.50612,5.50612 H 8.9624917 c -3.08251,0 -5.50613,-2.42361 -5.50613,-5.50612 V 8.94571 c 0,-3.0825 2.42362,-5.50612 5.50613,-5.50612 z M 20.036742,6.83835 c -4.69198,0 -8.53384,3.84186 -8.53384,8.53384 v 0.002 c 0.002,1.75443 0.56256,3.41112 1.51619,4.80177 -3.6742303,1.07001 -6.4270003,4.33625 -6.4270003,8.34574 v 2.49959 c 10e-5,1.00964 0.81816,1.82769 1.82779,1.8278 H 31.301172 c 1.00963,-1.1e-4 1.82769,-0.81816 1.8278,-1.8278 V 28.5217 c 0,-3.90317 -2.60194,-7.12325 -6.12728,-8.28424 0.98279,-1.40401 1.56662,-3.08022 1.5689,-4.86327 v -0.002 c 0,-4.69198 -3.84186,-8.53384 -8.53385,-8.53384 z m 0,3.6561 c 2.71513,0 4.87593,2.16037 4.87723,4.87515 -0.002,1.94641 -1.14903,3.69602 -2.93471,4.47053 -1.81319,0.79154 -1.25237,3.49827 0.72605,3.50418 h 1.59216 c 2.89862,0 5.17539,2.27829 5.17539,5.17746 v 0.67128 h -19.22466 v -0.67128 c 0,-2.89917 2.27677,-5.17746 5.17539,-5.17746 h 1.94458 c 1.97974,-0.003 2.54303,-2.71211 0.72864,-3.50418 -1.78495,-0.77419 -2.93438,-2.52249 -2.9378,-4.46794 v -0.003 c 10e-4,-2.71479 2.16261,-4.87515 4.87773,-4.87515 z"
                :fill="'#0187f3'"
              />
            </svg>
          </v-tab>
          
        </v-tabs>
        <v-progress-linear v-if="working" indeterminate top fixed class="mt-10" />
      </v-app-bar>

      <v-tabs hide-slider v-model="memberTab" height="0" background-color="#eeeeee">
        <v-tab-item tabindex="0" style="overflow: hidden !important">
          <div class="mx-0" :style="`width:100%;overflow-y: auto !important;`">
            <v-layout align-center justify-start column>
              <chat />
            </v-layout>
          </div>
        </v-tab-item>
        <v-tab-item tabindex="1" eager style="overflow: hidden !important">
          <div class="mx-0" :style="`min-height: auto;max-height: 610px;width:100%;overflow-y: auto !important;`">
            <v-layout align-center justify-start column fill-height>
              <tasks-pannel :group="false" :height="'610px'" :icon="'m 27.869099,7.3592406 c -0.0059,0.00582 -0.01175,0.011671 -0.01757,0.017571 L 15.712736,19.593636 11.775508,15.802653 c -2.3844606,-2.296403 -6.2323023,-2.22586 -8.5291946,0.15813 -2.29821147,2.38477 -2.2261004,6.2341 0.1596802,8.531262 v 0.0021 l 8.2170694,7.910114 c 2.359122,2.270783 6.1547,2.228842 8.463049,-0.09354 L 36.41018,15.884818 C 38.744077,13.536056 38.731785,9.6851501 36.38279,7.3514891 36.35686,7.3260311 36.33015,7.3013871 36.30269,7.2775921 33.709749,5.197852 30.043786,5.30006 27.869096,7.3592411 Z'" :title="'Personal Tasks'" :subtitle="`${TaskDoneCount} of ${TaskTotalCount - TaskCanceledCount} task(s) done.`" :taskboxList="myTaskboxes" :filtering="filtering" :taskList="filteredList(myTasks, 'title', { value: filter, field: 'status' })" :refreshing="refreshing" @refresh="getTasks(true)" @mounting="setMounting" />
            </v-layout>
          </div>
        </v-tab-item>
        <v-tab-item tabindex="2" style="overflow: hidden !important">
          <div class="mx-0" :style="`width:100%;overflow-y: auto !important;`">
            <v-layout align-center justify-start column fill-height>
              <connections :height="'610px'" />
            </v-layout>
          </div>
        </v-tab-item>
        <v-tab-item tabindex="3" style="overflow: hidden !important">
          <div class="mx-0" :style="`min-height: auto;max-height: 610px;width:100%;overflow-y: auto !important;background-color:rgb(245 245 245)`">
            <v-layout align-center justify-start column>
              <v-app-bar  elevation="2" height="100" width="100%" :src="profile.coverPicture" class="pa-0 ma-0">
                <member-item  :size="90" :options="['bordered','session']" :align="'left'" :id="profile.id" :subtitle="session.text" :session="session" :extraClass="'ma-6'" />
                <v-btn  absolute left style="margin-top: 50px" fab x-small @click="selectAvatar()">
                  <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
                      fill="#353535"
                      style="pointer-events: none"
                    />
                  </svg>
                </v-btn>
                <v-btn class="windowbar-button ma-0 mt-6" absolute top right  fab x-small @click="selectCover()">
                  <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
                      fill="#353535"
                      style="pointer-events: none"
                    />
                  </svg>
                </v-btn>
              </v-app-bar>
              <v-form @submit.prevent="" @keydown.tab.prevent class="pa-5 ma-0">
                <v-row class="pa-1">
                  <v-col cols="6">
                    <v-text-field label="First Name" outlined dense hide-details="true" v-model="profile.firstName" @blur="updateProfile()" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Last Name" outlined dense hide-details="true" v-model="profile.lastName" @blur="updateProfile()" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field label="email" type="email" outlined dense hide-details="true" v-model="profile.email" @blur="updateProfile()" />
                  </v-col>
                </v-row>
              </v-form>
              <v-card-title class="text-subtitle-1 py-0 my-0">
                <v-list-item>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :loading="working" rounded small @click="saveProfile()"> save </v-btn>
                  <v-btn small rounded class="ml-2 windowbar-button" color="error" @dblclick.stop @click.stop="signout()"> signout </v-btn>
                </v-list-item>
              </v-card-title>
            </v-layout>
          </div>
        </v-tab-item>
        
      </v-tabs>
    </v-card>
  </v-menu>
</template>

<script>
import MemberItem from '../lists/MemberItem.vue';
import Chat from '../forms/Chat.vue';
import TasksPannel from '../lists/TasksPannel.vue';
import Connections from '../lists/Connections.vue';
import taskstate, { getStatusTypeByValue } from '../../enums/taskstate';
import { connectionStatus, getConnectionStatusByValue, messageStatus } from '../../store/models/ConnectionModel';
import { eventBus } from '../../../main';
import { ipcRenderer, nativeImage } from 'electron';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  components: { MemberItem, Chat, TasksPannel, Connections },
  name: 'Profile',
  props: { profileId: String },
  data() {
    return {
      loading: false,
      working: false,
      filtering: false,
      refreshing: false,
      searching: false,
      saving: false,
      search: null,
      refreshkey: 0,
      memberTab: 0,
    };
  },
  created() {
    eventBus.$on('setWorking', (value) => {
      this.working = value;
    });

    eventBus.$on('updateTasks', () => {
      this.refreshkey++;
    });
  },
  watch: {
    loading(value) {
      this.working = value;
    },
    // authenticated(value) {
    //   if (!value) this.memberTab = 0;
    // },
  },
  computed: {
    ...mapState({
      filter: (state) => state.app.taskFilter,
      analysing: (state) => state.taskbox.analysing,
      currentMainTab: (state) => state.app.mainTab,
      currentTaskBox: (state) => state.taskbox.currentTaskBox,
      taskBoxInfo: (state) => state.taskbox.taskBoxInfo,
      // current user info
      session: (state) => state.user.session.authenticated,
      profile: (state) => _.cloneDeep(state.user.profile),
      // tasks
      tasks: (state) => state.user.tasks,
      taskboxes: (state) => state.user.taskboxes,
      // myAuditions: (state) => state.user.auditions,
      // members lists
      members: (state) => state.connection.members,
      blocked: (state) => state.connection.blocked,
      canceled: (state) => state.connection.canceled,
      invited: (state) => state.connection.invited,
      invitations: (state) => state.connection.invitations,
    }),
    authenticated() {
      return this.$store.getters['user/authenticated'];
    },
    hasMessages() {
      if (!this.members) return false;
      return this.members.filter((m) => m.lastMessage && m.lastMessage.status !== messageStatus.READ.value && !this.isHost(m.lastMessage.member)).length;
    },
    myTasks() {
      this.refreshkey;
      return this.tasks;
    },
    myTaskboxes() {
      this.refreshkey;
      return this.taskboxes;
    },
    TaskDoneCount() {
      return this.myTasks.filter((t) => t.status == taskstate.DONE.value).length;
    },
    TaskCanceledCount() {
      return this.myTasks.filter((t) => t.status == taskstate.REPROVED.value).length;
    },
    TaskTotalCount() {
      return this.myTasks.length;
    },
    AuditionDoneCount() {
      return 0; // this.myAuditions.filter((t) => t.status == taskstate.DONE.value).length;
    },
    AuditionCanceledCount() {
      return 0; // this.myAuditions.filter((t) => t.status == taskstate.CANCELED.value).length;
    },
    AuditionTotalCount() {
      return 0; // this.myAuditions.length;
    },
    taskcount() {
      return (this.taskBoxInfo && this.taskBoxInfo.Incomplete.value) || 0;
    },
    hasTasks() {
      if (!this.myTasks) return false;
      return this.myTasks.filter((t) => t.status < taskstate.DONE.value).length;
    },
    hasInvitations() {
      if (!this.invited || !this.invitations) return false;
      return this.invited.concat(this.invitations).length;
    },
    status() {
      return getStatusTypeByValue(this.currentTaskBox.status);
    },
  },
  methods: {
    isHost(id) {
      return id == this.profile.id;
    },
    updateProfile() {
      this.$store.commit('user/SET_PROFILE', this.profile);
    },
    signout() {
      this.$store
        .dispatch('user/LOGOUT')
        .then(() => {
          this.$store.commit('app/SET_MAIN_TAB', 0);
        })
        .catch((error) => console.log(error));
    },
    saveProfile() {
      this.working = true;
      this.$store
        .dispatch('user/UPDATE_PROFILE', this.profile)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setTimeout(() => {
            this.working = false;

          }, 700);
        });
    },
    selectAvatar() {
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (avatar) => {
        if (avatar == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(avatar[0], { width: 128, height: 128 });
        this.profile.profilePicture = clip.toDataURL();
        this.saveProfile();
      });
    },
    selectCover() {
      ipcRenderer.invoke('app:selectImage', { multiple: false }).then(async (cover) => {
        if (cover == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(cover[0], { width: 512, height: 128 });
        this.profile.coverPicture = clip.toDataURL();
        this.saveProfile();
      });
    },
    showTaskBox() {
      if (this.currentMainTab !== 0) this.$store.commit('app/SET_MAIN_TAB', 0);
    },
    setMounting(value) {
      this.mounting = value;
    },
    signin() {
      this.$store.commit('app/TOGGLE_LOGIN_WINDOW', true);
    },
    filteredList(list, field, filter) {
      let searchResult = this.search ? list.filter((item) => item[field] && item[field].toLowerCase().includes(this.search)) : list.filter((item) => filter.value.includes(item[filter.field]));
      if (!filter) return searchResult;
      else {
        if (!this.searching) return searchResult.filter((item) => filter.value.includes(item[filter.field]));
        else return searchResult;
      }
    },
    refresh() {
      switch (this.memberTab) {
        case 0:
          this.getTasks();
          break;
        case 1:
          this.getTasks();
          break;
        case 2:
          this.getConnections();
          break;
        default:
          break;
      }
    },
    // Tasks
    async getTasks(refreshing) {
      this.loading = true;
      this.refreshing = refreshing;
      this.$store.dispatch('user/GET_TASKS', { member: null }).then(() => {
        setTimeout(() => {
          this.loading = false;
          this.refreshing = false;
        }, 1000);
      });
    },
    updateFilter(value) {
      this.filtering = true;
      this.filter = value;
      setTimeout(() => {
        this.filtering = false;
      }, 700);
    },
    // People
    getInvition(id) {
      return this.invitations.find((c) => c.host == id);
    },
    isInvition(id) {
      return this.invitations.find((c) => c.host == id) ? true : false;
    },
    isMember(member) {
      return this.members.map((e) => e.member).includes(member);
    },
    statusAction(action, value) {
      if (!action) return;
      this.loading = true;
      this.$store.dispatch(action, value).then(() => {
        setTimeout(() => {
          this.$refs.searchbar.blur();
          this.searching = false;
          this.loading = false;
        }, 700);
      });
    },
    accept(connection) {
      this.loading = true;
      this.$store.dispatch('connection/ACCEPT', connection).then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
    connectionStatus(member) {
      if (this.invited.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.INVITED.value);
      if (this.members.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.ACCEPTED.value);
      if (this.blocked.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.BLOCKED.value);
      if (this.canceled.map((e) => e.member).includes(member)) return getConnectionStatusByValue(connectionStatus.CANCELED.value);
      return getConnectionStatusByValue(connectionStatus.UNEXISTENT.value);
    },
    getConnections() {
      this.loading = true;
      this.$store.dispatch('connection/GET_ALL').then(() => {
        setTimeout(() => {
          this.loading = false;
        }, 700);
      });
    },
  },
};
</script>
