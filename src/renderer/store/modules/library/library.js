import { blockTypesFixtures } from "../../../fixtures/blockTypes"
import { categoryTypesFixture } from "../../../fixtures/categoryTypes"
import { libraryRepository } from './libraryRepository';
import store from "../.."
import { libraryModel, blockLibrary } from "../../models/LibraryModel";
import apistate from "../../../enums/apistate";

const state = () => {
    return {
        library: null
    }
}

const getters = {
    library: state => state.library,
}

const actions = {
    async FETCH_LIBRARY({ commit }) {
        try {
            const response = await libraryRepository.find('library');
            if (response.blockLibrary.blocktypes !== blockTypesFixtures ||
                response.categoryLibrary !== categoryTypesFixture) {
                commit("SET_LIBRARY", response)
                commit('UPDATE_BLOCKTYPES')
                // await dispatch('UPDATE_LIBRARY')
            }

            commit("SET_LIBRARY", response)
            return response;
        } catch (error) {
            store.commit('SET_ERROR_STATE', error)
        }
    },
    async CREATE_LIBRARY({ commit }) {

        let library = { ...libraryModel };
        library.blockLibrary = { ...blockLibrary };
        library.categoryLibrary = categoryTypesFixture;
        library.blockLibrary.blocktypes = blockTypesFixtures;
        library.blockLibrary.description = 'List of all registered block types'

        library.id = 'library';

        //////// CREATE A NEW LIBRARY IN THE DB ////////
        try {
            return libraryRepository.save(library).then(response => {
                commit("SET_LIBRARY", response)
                return response;

            })
        } catch (error) {
            store.commit('SET_ERROR_STATE', error)
        }
    },
    async UPDATE_LIBRARY({ commit }) {

        store.commit('SET_API_STATE', apistate.SAVING);
        try {

            let data = store.getters['library/library'];

            let response = await libraryRepository.saveOrUpdate({
                id: 'library',
                rev: data.rev,
                dataToSave: data
            })
            commit("SET_LIBRARY", JSON.parse(JSON.stringify(response)));

            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    }
}

const mutations = {
    UPDATE_BLOCKTYPES: (state) => {
        Object.assign(state.library.blockLibrary.blocktypes, blockTypesFixtures);
        Object.assign(state.library.categoryLibrary, categoryTypesFixture);
    },
    SET_LIBRARY: (state, library) => {
        state.library = library;
    },
    GET_BLOCK_TYPE: (state, name) => {
        return state.library.blockLibrary.blocktypes.find(type => type.name === name);
    }

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


