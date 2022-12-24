import Vue from 'vue'
import VueRouter from 'vue-router'
// import userstatus from '../enums/userstatus';
// import store from '../store';

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  //   meta: {
  //     layout: 'AppLayoutDefault',
  //   }
  // },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: () => import(/* webpackChunkName: "taskbox" */ '../views/Home.vue'),
  //   meta: {
  //     layout: 'AppLayoutWorkspace',
  //   }
  // },
  {
    path: '/taskbox',
    name: 'TaskBox',
    component: () => import(/* webpackChunkName: "taskbox" */ '../views/TaskBox.vue'),
    meta: {
      layout: 'AppLayoutWorkspace',
    }
  },
  // {
  //   path: '/profile/:id',
  //   name: 'Profile',
  //   component: () => import(/* webpackChunkName: "taskbox" */ '../views/Profile.vue'),
  //   meta: {
  //     layout: 'AppLayoutWorkspace',
  //   }
  // },
  { path: '*', redirect: '/taskbox' },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes
})

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/taskbox'];
//   const authRequired = !publicPages.includes(to.path);
//   const serverReady = store.getters["user/serverReady"];
//   const session = store.getters["user/session"];
//   const authenticated = session && session.authenticated.value == userstatus.NONAUTHENTICATED.value ? false : true

//   if (serverReady) {
//     if (authRequired) {
//       if (!authenticated && to.path !== 'login')
//         next('/login');
//       else
//         next();
//     } else {
//       next();
//     }
//   } else
//     next();
// });

export default router
