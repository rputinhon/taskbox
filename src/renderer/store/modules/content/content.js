import { contentRepository } from './contentRepository';
import store from "../.."
import apistate from "../../../enums/apistate";
import { contentModel } from '../../models/ContentModel';


const state = () => {
    return {
    }
}

const getters = {
}

const actions = {
    async FETCH_CONTENT({ commit }, id) {
        store.commit('SET_API_STATE', apistate.LOADING);

        try {
            let content = await contentRepository.find(id);
            commit("SUCCESS_FETCH_CONTENT");
            return content;
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async SAVE_CONTENT({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {
            let newContent = Object.assign({},contentModel);
            newContent.type = request.type;
            let result = await contentRepository.save(newContent);
            commit("SUCCESS_SAVE_CONTENT");
           return result;
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async UPDATE_CONTENT({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {
            let content = await contentRepository.find(request.id)
            content.data = request.data;
            await contentRepository.saveOrUpdate(content);
    
            commit("SUCCESS_UPDATE_CONTENT");
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async DELETE_CONTENT({ commit }, id) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {

            let content = await contentRepository.find(id)
            await contentRepository.delete(content);
            commit("SUCCESS_DELETE_CONTENT");
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    }
}

const mutations = {
    SUCCESS_FETCH_CONTENT() {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_SAVE_CONTENT() {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_UPDATE_CONTENT() {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_DELETE_CONTENT() {
        store.commit('SET_API_STATE', apistate.DONE);
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


