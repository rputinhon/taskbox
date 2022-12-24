<template>
  <v-card hover :loading="false" class="mx-auto mt-2" fab v-if="entity">
    <v-progress-linear rounded class="progressbar" :color="status.color" :buffer-value="entity.task.progress" />
    <v-list-item class="pl-2">
      <v-list-item-icon class="ml-2 mr-3" style="z-index: 10">
        <svg class="multiply" width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path :d="getIcon(entity.node)" :fill="'grey'" />
        </svg>
      </v-list-item-icon>
      <v-list-item-content class="px-0">
        <task-title :entity="entity" :options="[]" />
        <task-subject :entity="entity" :options="['small']" />
      </v-list-item-content>
      <v-spacer></v-spacer>
      <worker :entity="entity" :options="['post']" :disableLod="true" :max="1" :size="27" :ExtraClass="'mr-6'" :ExtraStyle="''" :justify="'end'" />
      <v-btn v-if="post && !creating" :elevation="expanded ? 0 : 2" :color="expanded ? 'primary' : 'white'" fab x-small @click.stop="expanded = !expanded">
        <svg width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z"
            :fill="!expanded ? '#0187f3' : 'white'"
          />
        </svg>
      </v-btn>
    </v-list-item>
    <v-card>
      <v-progress-linear v-if="loading" color="primary" height="5" indeterminate></v-progress-linear>
      <div v-if="post && (expanded || creating)" v-bind="post">
        <v-card flat color="grey" rounded="0">
            <v-btn style="z-index: 10" class="mb-8" absolute left bottom fab icon elevation="0" x-small @click="selectImage()">
              <svg width="30" height="30" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m 20.253155,11.647161 c -0.668734,0 -1.206806,0.539349 -1.206806,1.208082 v 2.57452 H 14.45921 c -3.408135,0 -6.1515177,2.680389 -6.1515177,6.011042 v 8.900992 c 0,3.330653 2.7433827,6.011042 6.1515177,6.011042 h 19.08158 c 3.408134,0 6.151518,-2.680389 6.151518,-6.011042 v -8.900992 c 0,-2.910725 -2.095667,-5.324701 -4.898739,-5.887169 v -0.621921 c 0,-0.331006 -0.266649,-0.597655 -0.597656,-0.597655 h -1.943659 c -0.331007,0 -0.597657,0.266649 -0.597657,0.597655 v 0.498048 h -3.308819 v -2.57452 c 0,-0.668733 -0.538072,-1.208082 -1.206806,-1.208082 z m 1.694636,1.529898 h 3.561674 c 0.534987,0 0.965445,0.430457 0.965445,0.965444 v 1.085487 c 0,0.534987 -0.430458,0.966722 -0.965445,0.966722 h -3.561674 c -0.534986,0 -0.965444,-0.431735 -0.965444,-0.966722 v -1.085487 c 0,-0.534987 0.430458,-0.965444 0.965444,-0.965444 z M 24,17.718224 A 8.1730769,8.1730769 0 0 1 32.173077,25.891301 8.1730769,8.1730769 0 0 1 24,34.064378 8.1730769,8.1730769 0 0 1 15.826923,25.891301 8.1730769,8.1730769 0 0 1 24,17.718224 Z m 0,1.689528 A 6.4831359,6.4831359 0 0 0 17.516451,25.891301 6.4831359,6.4831359 0 0 0 24,32.37485 6.4831359,6.4831359 0 0 0 30.483549,25.891301 6.4831359,6.4831359 0 0 0 24,19.407752 Z"
                  fill="white"
                  style="pointer-events: none"
                />
              </svg>
            </v-btn>
          <v-img v-if="post.image" height="200" :src="post.image">
          </v-img>
          <svg v-else style="max-height: 256px" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m 35.589844,9.5800781 c -0.573351,0.018314 -1.09936,0.2964182 -1.47461,0.6855469 L 19.728516,25.017578 13.339844,18.648437 C 12.507606,17.820892 11.137271,17.809745 10.292969,18.625 l -3.9433596,3.802734 h -0.00195 c -0.8651932,0.836135 -0.8773048,2.249903 -0.027344,3.101563 v 0.002 L 18.208984,37.416016 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013672,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815986 -0.98915,-0.6237833 -1.5625,-0.6054689 z m 0.06445,1.9980469 c -0.0039,1.25e-4 0.03782,-0.01158 0.171875,0.105469 0.0018,0.0016 1.32e-4,3.45e-4 0.002,0.002 l 4.058594,3.912109 c 0.0798,0.07683 0.08021,0.171302 0.002,0.25 v 0.002 L 19.873047,36 c -0.07744,0.07811 -0.172347,0.07971 -0.25,0.002 V 36 L 7.7363281,24.117187 c -0.077774,-0.07793 -0.076039,-0.173169 0.00195,-0.25 l 3.9433598,-3.802734 c 0.0771,-0.07444 0.172045,-0.07362 0.248047,0.002 l 7.818359,7.796875 15.804687,-16.207031 0.002,-0.002 c 0.08804,-0.0913 0.103575,-0.0763 0.09961,-0.07617 z"
              fill="#fafafa"
            />
          </svg>
        </v-card>

        <v-card-title>
          <v-btn v-if="creating" absolute left top small color="secondary" class="mr-16" @click.stop="(creating = false), (post = null)"> cancel </v-btn>
          <v-btn absolute right top small color="primary" @click="postAction()"> {{ post.postStatus.text }} </v-btn>
          <v-btn v-if="!creating" absolute left top small color="error" @click="deletePost()"> delete </v-btn>

          <v-avatar color="grey" size="27" class="mr-3">
            <v-img v-if="creating" :src="profile.profilePicture" />
            <!-- <v-img v-else-if="!creating && getMember(post.member).avatar" :src="getMember(post.member).avatar" /> -->
            <svg v-else version="1.1" viewBox="0 0 10.583 10.583" xmlns="http://www.w3.org/2000/svg">
              <path transform="scale(.26458)" d="m20 2.5625a17.437 17.437 0 0 0-17.438 17.438 17.437 17.437 0 0 0 4.8223 12.031v-4.2383c0-2.915 2.3467-5.2617 5.2617-5.2617h3.9492v-0.66602a7.6903 7.6903 0 0 1-4.2871-6.8887 7.6903 7.6903 0 0 1 7.6895-7.6914 7.6903 7.6903 0 0 1 7.6914 7.6914 7.6903 7.6903 0 0 1-4.7539 7.0996v0.45508h4.416c2.915 0 5.2617 2.3467 5.2617 5.2617v4.2402a17.437 17.437 0 0 0 4.8242-12.033 17.437 17.437 0 0 0-17.438-17.438z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.1284" style="-inkscape-stroke: none; font-variation-settings: normal; paint-order: fill markers stroke" />
            </svg>
          </v-avatar>
          <svg class="mr-3" style="pointer-events: none" width="32" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path
              d="m 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z"
              fill="#0187f3"
            />
          </svg>
          <v-text-field v-if="creating" dense hide-details="true" v-model="post.title" />
          <div v-else>{{ post.title }}</div>
          <v-spacer> </v-spacer>
          <v-select label="visibility" :items="shared" v-model="post.visible" dense hide-details="true" style="max-width: 120px">
            <template v-slot:append>
              <svg width="28" version="1.1" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
                <path d="m 16.603318,10.487538 c -7.9688576,0 -12.5759362,6.291988 -12.5759362,6.291988 -0.3629984,0.492951 -0.2574995,1.186859 0.2356032,1.549652 0.4931123,0.362867 1.1870497,0.257087 1.5496527,-0.236219 0,0 2.2075366,-2.979893 6.1355373,-4.507971 -0.816027,1.03138 -1.304777,2.331789 -1.304777,3.741183 0,3.328517 2.724778,6.053293 6.053295,6.053293 3.328516,0 6.053296,-2.724776 6.053296,-6.053293 0,-1.398384 -0.481042,-2.689578 -1.285608,-3.717065 4.083388,1.52575 6.644462,4.444277 6.644462,4.444277 0.400809,0.463037 1.101219,0.51316 1.563877,0.111915 0.462633,-0.400754 0.512743,-1.100689 0.111915,-1.563258 0,0 -5.223496,-6.114513 -13.181326,-6.114513 z m 0.09337,3.192682 c 2.028098,0 3.645952,1.617855 3.645952,3.645951 0,2.028098 -1.617854,3.645953 -3.645952,3.645953 -2.028096,0 -3.645951,-1.617855 -3.645951,-3.645953 0,-2.028096 1.617855,-3.645951 3.645951,-3.645951 z" fill="grey" />
              </svg>
            </template>
          </v-select>
        </v-card-title>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <div class="grey--text ms-4">4.5 (413)</div>
          </v-row>

          <v-text-field v-if="editing" label="task subject" v-model="post.subject" dense hide-details="true" />
          <div class="my-2 text-subtitle-1" v-else>
            <v-list-item>
              <v-list-item-icon class="mx-2">
                <svg width="28" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m 35.589844,9.5800781 c -0.573351,0.018314 -1.09936,0.2964182 -1.47461,0.6855469 L 19.728516,25.017578 13.339844,18.648437 C 12.507606,17.820892 11.137271,17.809745 10.292969,18.625 l -3.9433596,3.802734 h -0.00195 c -0.8651932,0.836135 -0.8773048,2.249903 -0.027344,3.101563 v 0.002 L 18.208984,37.416016 c 0.844091,0.843029 2.243864,0.839554 3.083985,-0.0078 l 20.013672,-20.148437 0.002,-0.002 c 0.846531,-0.853423 0.831086,-2.267619 -0.03516,-3.101562 l -4.105468,-3.955078 -0.01563,-0.01563 c -0.432247,-0.3815986 -0.98915,-0.6237833 -1.5625,-0.6054689 z m 0.06445,1.9980469 c -0.0039,1.25e-4 0.03782,-0.01158 0.171875,0.105469 0.0018,0.0016 1.32e-4,3.45e-4 0.002,0.002 l 4.058594,3.912109 c 0.0798,0.07683 0.08021,0.171302 0.002,0.25 v 0.002 L 19.873047,36 c -0.07744,0.07811 -0.172347,0.07971 -0.25,0.002 V 36 L 7.7363281,24.117187 c -0.077774,-0.07793 -0.076039,-0.173169 0.00195,-0.25 l 3.9433598,-3.802734 c 0.0771,-0.07444 0.172045,-0.07362 0.248047,0.002 l 7.818359,7.796875 15.804687,-16.207031 0.002,-0.002 c 0.08804,-0.0913 0.103575,-0.0763 0.09961,-0.07617 z"
                    fill="grey"
                  />
                </svg>
              </v-list-item-icon>
              <v-text-field v-if="creating" dense hide-details="true" v-model="post.subject" />
              <v-list-item-subtitle v-else class="text-left">
                {{ post.subject }}
              </v-list-item-subtitle>
            </v-list-item>
          </div>

          <v-textarea filled v-if="creating" label="task full description" v-model="post.fullDescription" no-resize outlined dense hide-details="true" />
          <div v-else>{{ post.fullDescription }}</div>
          <!-- <div>{{ entity.task.fullDescription }}</div> -->
          <!-- <v-rating :value="4.5" color="amber" dense half-increments readonly size="18"></v-rating> -->
        </v-card-text>
      </div>
      <v-btn v-else-if="!post" style="text-transform: lowercase" class="py-3 text-subtitle-1" @click.stop="creating = true">
        <svg class="mx-2" width="23" version="1.1" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m 36.555909,6.1598943 c -0.923124,0 -1.771677,0.3781629 -2.388484,0.9803019 -0.0205,0.014811 -0.06006,0.037025 -0.07648,0.050126 -6.604547,5.2693008 -8.57756,6.7716148 -10.262422,7.3008468 -0.84243,0.264616 -1.537377,0.28659 -2.797245,0.191202 -1.259868,-0.09539 -2.995715,-0.324954 -5.480286,-0.447001 -1.462287,-0.07183 -2.714418,0.709783 -3.407027,1.851567 h -0.419613 c -2.2034145,0 -4.0390297,1.837165 -4.0390297,4.04058 v 3.466972 c 0,2.203414 1.8356152,4.03903 4.0390297,4.03903 h 0.257349 c 0.416655,0.854318 1.123387,1.557226 2.021065,1.902208 0.01073,0.142484 0.03247,0.285994 0.0677,0.429948 l 2.117184,8.650118 c 0.143222,0.585264 0.385095,1.208969 0.908471,1.791105 0.523375,0.582139 1.435966,1.058852 2.359029,1.058852 h 1.531173 c 0.923064,0 1.710815,-0.323175 2.36368,-0.928108 0.652865,-0.604944 1.183541,-1.731748 0.904338,-2.872695 L 22.27255,29.567768 c 2.436474,0.205933 4.26679,0.75986 5.756754,1.53479 2.600974,1.352809 3.457494,2.997478 5.548499,5.798611 0.577619,1.031851 1.707157,1.748216 2.978113,1.748216 1.84023,0 3.383774,-1.50136 3.383772,-3.288689 V 9.5235131 9.4485831 c 0,-1.6069275 -1.248847,-2.9787836 -2.838069,-3.2401122 -0.173289,-0.032533 -0.354592,-0.053201 -0.545703,-0.048576 z m -5.16e-4,1.978174 c 0.747633,0 1.349269,0.584886 1.349271,1.3110308 V 35.360696 c 0,0.726144 -0.601638,1.311031 -1.349271,1.311031 -0.747639,0 -1.349791,-0.584887 -1.349791,-1.311031 V 9.4490991 c 0,-0.326845 0.126331,-0.6214661 0.328663,-0.8505939 0.198353,-0.1940309 0.485561,-0.3788643 0.914157,-0.4501018 0.03589,-0.00276 0.07033,-0.010335 0.106971,-0.010335 z M 33.170586,10.66763 V 33.008383 C 29.757694,28.897716 25.701186,26.6161 15.452287,27.757026 14.413444,27.87267 13.565581,26.91558 13.565581,25.870319 v -7.750948 c 0,-1.045261 0.842705,-1.93799 1.886706,-1.886707 9.078319,0.445946 6.923084,2.978761 17.718299,-5.565034 z m -21.6023,7.425903 c -6.1e-5,0.0089 -0.0015,0.01749 -0.0015,0.02635 v 7.508068 C 10.510915,25.547941 9.6841639,24.671437 9.6841639,23.594489 V 20.127 c 0,-1.077486 0.8275461,-1.954251 1.8841221,-2.033467 z M 19.818945,29.4794 c 0.127768,-0.0011 0.248117,0.0021 0.373104,0.0026 7.39e-4,0.003 0.0019,0.0058 0.0026,0.0088 l 2.116667,8.649602 c 0.174591,0.713455 -0.590994,1.326018 -1.325501,1.326018 H 19.45566 c -0.734507,0 -1.150909,-0.612563 -1.3255,-1.326018 l -2.063957,-8.434628 c 1.3704,-0.141727 2.620036,-0.216797 3.752742,-0.226343 z"
            :fill="'#0187f3'"
          />
        </svg>
        Create a post for this open Task
      </v-btn>
    </v-card>
  </v-card>
</template>

<script>
import { eventBus } from '../../../main';
import { getStatusTypeByValue } from '../../enums/taskstate';
import { iconTypes } from '../../fixtures/iconTypes';
import { getFileType } from '../../fixtures/fileTypes';
import { postModel, postStatus, shareWith } from '../../store/models/PostModel';
import Worker from '../NodeEditor/Components/Worker.vue';
import _ from 'lodash';
import { mapState } from 'vuex';
import { ipcRenderer, nativeImage } from 'electron';
import TaskTitle from './TaskTitle.vue';
import TaskSubject from './TaskSubject.vue';

export default {
  name: 'TaskItem',
  props: { entity: Object, analisis: Object, hide: Array },
  components: {
    Worker,
    TaskTitle,
    TaskSubject,
  },
  data() {
    return {
      editing: false,
      creating: false,
      expanded: false,
      loading: false,
      post: null,
      creatingPost: _.cloneDeep(postModel),
    };
  },
  mounted() {
    this.getPost();
  },
  watch: {
    creating(value) {
      if (value) {
        this.creatingPost.title = this.entity.task.title;
        this.creatingPost.subject = this.entity.task.subject;
        this.creatingPost.fullDescription = this.entity.task.fullDescription;
        this.post = this.creatingPost;
      }
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.user.profile,
    }),
    task() {
      return this.entity.task;
    },
    node() {
      return this.entity.node;
    },
    status() {
      return getStatusTypeByValue(this.task.status);
    },
    shared() {
      return Object.values(shareWith);
    },
  },
  methods: {
    selectImage() {
      ipcRenderer.invoke('app:selectImage').then(async (image) => {
        if (image == undefined) return;
        let clip = await nativeImage.createThumbnailFromPath(image, { width: 512, height: 512 });
        this.post.image = clip.toDataURL();
      });
    },
    async postAction() {
      this.post.id = this.entity.id;
      this.post.postStatus = postStatus.POSTED;
      this.post.member = this.profile.id;
      this.$store.dispatch('post/SAVE_POST', this.post).then((response) => {
        this.post = response;
        this.creating = false;
      });
    },
    async getPost() {
      this.loading = true;
      this.$store.dispatch('post/GET_POST', this.entity.id).then((post) => {
        this.post = post;
        this.loading = false;
      });
    },
    deletePost() {
      this.$store.dispatch('post/DELETE_POST', this.post).then(() => {
        this.post = null;
      });
    },
    openContent() {
      if (this.entity.type == 'taskbox') {
        this.$store.dispatch('taskbox/OPEN_TASKBOX', { id: this.entity.id, deeper: false });
      } else {
        console.log(this.entity.task.title);
        this.$store.commit('taskbox/PREVIEW_TASK', this.entity.id);
      }
    },
    file() {
      if (!this.task.data.value) return false;
      return this.task.data.value.file;
    },
    fileIcon(extension) {
      return getFileType(extension).info.icon;
    },
    getIcon(node) {
      let name = node.name;

      if (name == 'File') return this.fileIcon((node.data.flowingData.value && node.data.flowingData.value.file.extension) || null);

      return iconTypes[name.toLowerCase()][0] || 'm32.588 13.54 3.5541 3.4281-17.399 17.518-10.335-10.332 3.4281-3.3055 6.9072 6.8868z';
    },
    getIconByName(name) {
      return iconTypes[name][0];
    },
    frameNode(task) {
      eventBus.$emit('frameNode', task.id);
    },
    changeStatus(newStatus) {
      eventBus.$emit('confirmChangeStatus', [this.task, newStatus]);
    },
  },
};
</script>

<style scoped>
.taskitem {
  width: -webkit-fill-available;
}
.disabledByStatus {
  pointer-events: none !important;
  cursor: auto !important;
  opacity: 0.4 !important;
}
.taskitem:hover {
  background-color: rgba(158, 174, 243, 0.075);
}
.taskitemcontent {
  z-index: 1;
}

.progressbar {
  height: 100% !important;
  position: absolute;
}
</style>
