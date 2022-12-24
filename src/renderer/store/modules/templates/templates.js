import { templatesRepository } from './templatesRepository';
import store from "../.."
import apistate from "../../../enums/apistate";
import { templateModel } from '../../models/TemplateModel';
import { ipcRenderer } from 'electron';


const state = () => {
    return {
        myTemplates: []
    }
}

const getters = {
    myTemplates: state => state.myTemplates
}

const actions = {
    async FETCH_ALL({ commit,dispatch }) {
        store.commit('SET_API_STATE', apistate.LOADING);
        try {
            let files = await dispatch('GET_TEMPLATE_FILES');
            let response = await templatesRepository.getAll();
            commit("SUCCESS_FETCH_ALL", {fromRepository:response,fromFiles:files});
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
            store.commit('SET_API_STATE', apistate.DONE);
        }
    },
    async DELETE_TEMPLATE({ commit }, id) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {
            let template = await templatesRepository.find(id);
            if (template) {
                let response = await templatesRepository.delete(template);
                commit("SUCCESS_DELETE_TEMPLATE")
                return response;
            }
            return null
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async SAVE_TEMPLATE({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {
            let newTemplate = Object.assign({}, templateModel);
            newTemplate.name = request.name;    
            newTemplate.description = request.description;
            newTemplate.data = request.data;

            let response = await templatesRepository.save(newTemplate)

            commit("SUCCESS_ADD_TEMPLATE")
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async GET_TEMPLATE_FILES() {
        let list = await ipcRenderer.invoke('app:getTemplateList')
        return list;
    },
    // async UPDATE_TEMPLATE({ commit },request) {
    //     store.commit('SET_API_STATE', apistate.SAVING);
    //     try {
    //         let template = await templatesRepository.find(request.id)
    //         let response = await templatesRepository.saveOrUpdate(request.template)

    //         commit("SUCCESS_UPDATE_TEMPLATE")
    //         return response;

    //     } catch (error) {
    //         store.commit('SET_ERROR_STATE', error.message);
    //     }
    // }
}

const mutations = {
    SUCCESS_FETCH_ALL: (state, templates) => {
        state.myTemplates = templates;
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_ADD_TEMPLATE: async () => {
        await store.dispatch('templates/FETCH_ALL');
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_DELETE_TEMPLATE: async () => {
        await store.dispatch('templates/FETCH_ALL');
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_UPDATE_TEMPLATE: () => {
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


