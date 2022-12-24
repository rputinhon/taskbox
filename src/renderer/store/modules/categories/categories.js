import { categoryRepository } from './categoryRepository';
import store from "../.."
import apistate from "../../../enums/apistate";
import { categoryModel } from '../../models/CategoryModel';

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

            let response = await categoryRepository.findAll();
            commit("SUCCESS_FETCH_ALL")
            store.commit('SET_API_STATE', apistate.DONE);
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async SAVE_CATEGORY({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {

            let newCategory = Object.assign({}, categoryModel);
            newCategory.name = request.name;
            newCategory.parent = request.parent || null;

            let response = await categoryRepository.saveOrUpdate(newCategory)

            commit("SUCCESS_ADD_CATEGORY")
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
    SUCCESS_ADD_CATEGORY: () => {
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


