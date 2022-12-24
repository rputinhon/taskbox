
import apistate from "../../../enums/apistate";
import store from '../..';
import { taskboxDB } from "../../config/pouchdb";
import _ from 'lodash';
import { memberRepository } from "../user/profileRepository";
import { profileModel } from "../../models/ProfileModel";

const state = () => ({
    search: null,
    showLoginWindow: false,
    showTasks: false,
    showMainMenu: false,
    showMemberArea: true,
    userFeed: null,
    mainTab: 0,
    memberTab: 0,
    taskFilter: [0, 1, 2, 3, 5, 6],
    server: {
        DB: null,
        info: null,
        syncInfo: null,
        status: null,
    },
    displaySettings: [
        {
            type: 'switch',
            label: 'Thumbnails',
            description: 'Show Thumbnails if taskBoxes have it.',
            value: false
        },
        {
            type: 'switch',
            label: 'Labels',
            description: 'Show The Task Labels.',
            value: true
        },
    ],
    appSettings: [
        {
            type: 'switch',
            label: 'Remember Me',
            description: 'Opens the last Taskbox project you was working on.',
            value: true
        },
        // {
        //     type: 'switch',
        //     label: 'Pause Task When Close',
        //     description: 'when you close the preview window, this option pauses the task you are working on automatically.',
        //     value: false
        // },
        // {
        //     type: 'switch',
        //     label: 'Data Flowing Control',
        //     description: 'This option let\'s you to take control of the data Flowing over each task.',
        //     value: false
        // },
        {
            type: 'switch',
            label: 'Local Notifications',
            description: 'Show local notifications about your tasks and messages.',
            value: true
        }

    ],
    serverSettings: [
        {
            type: 'input',
            label: 'Server Host',
            description: 'Server address to replicate your data with couchDB',
            value: 'http://localhost:5984'
        },
        {
            type: 'switch',
            label: 'Work with a Remote Server',
            description: 'This Option let you replicate your data in a pre-configured provided server.',
            value: true
        },
    ]
});

const getters = {
    remoteDB: state => _.cloneDeep(state.server.DB),
    // taskboxApp: state => state.taskboxApp,
    // version: state => state.version,
    // editorversion: state => state.editorversion,
    // offlineUserProfile: state => state.offlineUserProfile,
    syncDb: state => state.serverSettings[1].value && state.serverSettings[0].value,
    syncADDRESS: state => state.serverSettings[0].value
};

const actions = {
    async INIT_APP({ commit }) {

        store.commit('SET_API_STATE', apistate.LOADING);
        // let profile = null;
        // let app = null;
        if (!window.localStorage.getItem('host'))
            window.localStorage.setItem('host', 'http://localhost:5984')
        let DB = new taskboxDB(window.localStorage.getItem('host'))
        // CREATE THE PUBLIC LIBRARY (NODE TYPES)
        await store.dispatch("library/FETCH_LIBRARY").then((result) => {
            if (!result) {
                store.dispatch("library/CREATE_LIBRARY")
                    .then(() => {
                    })
                    .catch((error) => {
                        console.log(error);
                        store.commit('SET_ERROR_STATE', error.message);
                    })
                    .finally(() => {
                        commit("SUCCESS_SET_APP", DB);
                    })
            }
        })
            .catch((error) => {
                store.commit('SET_ERROR_STATE', error.message);
            })
            .finally(() => {

                // initDB(state.serverSettings[0].value).then(() => {
                // syncDB(state.serverSettings[0].value);
                commit("SUCCESS_SET_APP", DB);

                // })
            })

        let offlineUser = await memberRepository.find('offline');
        if (!offlineUser) {
            offlineUser = { ...profileModel };
            offlineUser.id = 'offline';
            await memberRepository.save(offlineUser);
        }

        //     // APP
        //     appRepository.find('taskbox').then(async (response) => {

        //         if (response == undefined) {

        //             let userProfile = Object.assign({}, profileModel);
        //             let response = await profileRepository.save(userProfile);

        //             app = { ...appModel };
        //             app.id = response.id;
        //             app.name = 'taskBox';

        //             app.version = pkg.version;
        //             app.editorversion = pkg.eversion;

        //             appRepository.save(app)
        //                 .then(() => { })
        //                 .catch((error) => {
        //                     store.commit('SET_ERROR_STATE', error.message);
        //                 })
        //                 .finally(async () => {
        //                     // profile = await store.dispatch('user/GET_OFFLINE_USER');
        //                 })
        //         }
        //         else {
        //             app = response;

        //             // if (!app.offlineUser) {
        //             // }
        //             // profile = await store.dispatch('user/GET_OFFLINE_USER');

        //         }
        //     })
        //         .catch((error) => {
        //             store.commit('SET_ERROR_STATE', error.message);
        //         }).finally(async () => {

        //             commit("SUCCESS_SET_APP", app);

        //         })


    },
}

const mutations = {
    async SUCCESS_SET_APP(state, DB) {
        state.server.DB = DB;
    },
    async INIT_SERVER(state, host) {
        store.commit('user/SET_SERVER_READY', false)
        state.server.DB.taskbox().destroy();
        state.server.DB = new taskboxDB(host)
        state.server.DB.host = host;
        state.server.DB.taskbox().getSession().then(() => {
            store.commit('user/SET_SERVER_READY', true)
            state.server.DB.sync();
        }).catch(() => {
            store.commit('user/SET_SERVER_READY', false)
            store.dispatch('user/LOGOUT');
        })
    },
    SYNC(state) {
        state.server.DB.sync();
    },
    UPDATE_SETTINGS(state, settings) {
        let count = 0
        state.appSettings.map(s => {
            s.value = settings[count];
            count++
        });
    },
    SET_APP_SETTINGS(state, args) {
        state.appSettings = args;
        store.commit('user/UPDATE_SETTINGS', state.appSettings)
    },
    SET_SERVER_SETTINGS(state, args) {
        state.serverSettings = args;
    },
    SET_SYNC_STATUS(state, args) {
        state.server.info = args.info;
        state.server.syncInfo = args.syncInfo;
        state.server.status = null;
    },
    SET_DISPLAY_SETTINGS(state, args) {
        state.displaySettings = args;
    },
    SUCCESS_UPDATE_APP() {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SEARCH(state, value) {
        state.search = value;
    },
    SET_MEMBER_TAB(state, value) {
        state.memberTab = value;
    },
    SET_MAIN_TAB(state, value) {
        state.mainTab = value;
    },
    SET_USER_FEED(state, value) {
        state.userFeed = value;
    },
    SET_TASK_FILTER(state, value) {
        state.taskFilter = value;
    },
    TOGGLE_MEMBER_AREA(state, value) {
        state.showMemberArea = value !== undefined ? value : !state.showMemberArea;
    },
    TOGGLE_MAIN_MENU(state, value) {
        state.showMainMenu = value !== undefined ? value : !state.showMainMenu;
    },
    TOGGLE_TASKS(state, value) {
        state.showTasks = value !== undefined ? value : !state.showTasks;
    },
    TOGGLE_LOGIN_WINDOW(state, value) {
        state.showLoginWindow = value !== undefined ? value : !state.showLoginWindow;
    },
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


