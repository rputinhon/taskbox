import Vue from 'vue'
import Vuex from 'vuex'
import apistate from '../enums/apistate';

// Modules
import app from "./modules/app/app";
import categories from "./modules/categories/categories"
import content from "./modules/content/content";
import connection from "./modules/user/connection";
import library from './modules/library/library';
import notification from './modules/notification/notification';
import post from "./modules/post/post";
import task from './modules/task/task';
import taskbox from './modules/taskbox/taskbox';
import taskObjects from "./modules/taskObjects/taskObjects";
import templates from './modules/templates/templates'
import user from "./modules/user/user";


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    apiState: apistate.INIT,
    debugMode: false,
    errorState: null,
  },
  getters: {
    apiState: state => state.apiState,
    errorState: state => state.errorState
  },
  mutations: {
    SET_API_STATE(state, apiState) {
      state.apiState = apiState;
    },
    SET_ERROR_STATE(state, errorState) {
      state.errorState = errorState;
    },
  },
  actions: {
  },
  modules: {
    app,
    categories,
    content,
    connection,
    library,
    notification,
    post,
    task,
    taskbox,
    taskObjects,
    templates,
    user
  },
  strict: process.env.NODE_ENV !== "production"
})

export default store;
