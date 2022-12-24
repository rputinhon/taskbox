import { taskObjectRepository } from './taskObjectsRepository';
import store from "../.."
import apistate from "../../../enums/apistate";
import { taskObjectModel } from '../../models/TaskObjectModel';

const state = () => {
    return {
    }
}

const getters = {
}

const actions = {
    async FETCH_ALL({ commit }) {
        store.commit('SET_API_STATE', apistate.LOADING);
        try {

            let response = await taskObjectRepository.findAll();
            commit("SUCCESS_FETCH_ALL")
            store.commit('SET_API_STATE', apistate.DONE);
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async GET_SUBJECT({commit},id) {
        store.commit('SET_API_STATE', apistate.LOADING);
        try {
            let subject = await taskObjectRepository.find(id);
            commit("SUCCESS_GET_SUBJECT");
            return subject;
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async SAVE_TASK_SUBJECT({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {

            let newObject = Object.assign({}, taskObjectModel);
            newObject.name = request.subject;
            newObject.category = request.category;
            newObject.description = request.description || '';

            let response = await taskObjectRepository.saveOrUpdate(newObject);

            commit("SUCCESS_ADD_SUBJECT")
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    }
}

const mutations = {
    SUCCESS_FETCH_ALL: () => {
        // // console.log'SUCCESS FETCHING ALL OBJECTS');
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_GET_SUBJECT: () => {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_ADD_SUBJECT: () => {
        store.commit('SET_API_STATE', apistate.DONE);
    },

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


