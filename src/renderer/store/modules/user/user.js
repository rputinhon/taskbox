/* eslint-disable */

import { profileModel } from "../../models/ProfileModel.js";

import CREDENTIALS, { getCredentialTypeByValue } from "../../../enums/credentials.js";
import RULES from "../../../enums/rules.js";

import apistate from "../../../enums/apistate.js";
import store from '../../index'
import userstatus from "../../../enums/userstatus.js";
import { memberRepository } from "./profileRepository.js";
import { NodeView } from "../../../libs/nodeview.js";
import { DueTracker } from "../../../libs/dueTracker.js";
import { taskRepository } from "../task/taskRepository.js";
// import { hasDueEnd, isTaskDone } from "../task/task.js";
import { eventBus } from "../../../../main.js";
import { nextTick } from "process";


const state = () => {
    return {
        user: initialState,
        profile: profileModel,
        followers: [],
        usingCredential: null,
        session: {
            authenticated: userstatus.NONAUTHENTICATED,
            access_token: null
        },

        tasks: [],
        taskboxes: [],
        auditions: [],
        roots: [],

        serverReady: false,
    }
}

const initialState = {
    _id: 'offline',
    metadata: {
        profileId: 'offline',
        name: 'offline',
        credentials: [CREDENTIALS.MASTER],
    },
};

const getters = {
    user: state => state.user,
    serverReady: state => state.serverReady,
    session: state => state.session,
    profile: state => state.profile,
    lastProject: state => state.profile.remember.lastProject,
    authenticated: state => state.session.authenticated == userstatus.AUTHENTICATED ? true : false
};

const actions = {
    async INIT({ commit, dispatch, state }) {
        return new Promise((resolve) => {

            if (state.session.authenticated.value == userstatus.AUTHENTICATED.value)
                resolve();


            store.getters['app/remoteDB'].taskbox().info().then((response) => {
                if (response.adapter)
                    commit('SET_SERVER_READY', true);
                else
                    commit('SET_SERVER_READY', false);
            }).catch(() => {
                commit('SET_SERVER_READY', false);
            })

            dispatch('GET_USER').then(async response => {

                if (response.userCtx.name) {
                    new Promise((resolve) => {
                        store.getters['app/remoteDB'].taskbox()
                            .getUser(response.userCtx.name).then(async (user) => {
                                if (user)
                                    resolve(dispatch('WORK_ONLINE', user));

                                else
                                    resolve(dispatch('WORK_OFFLINE'))

                            }).catch((error) => {
                                console.log(error);
                                resolve(dispatch('WORK_OFFLINE'))
                            })
                    })
                }
                else {
                    resolve(dispatch('WORK_OFFLINE'))
                }

            }).catch((error) => {
                commit('SET_SERVER_READY', false);
                console.log(error);
                resolve(dispatch('WORK_OFFLINE'))
            })
        })
    },
    async SIGNUP({ dispatch }, request) {
        var ajaxOpts = {
            ajax: {
                headers: {
                    Authorization: 'Basic ' + window.btoa('admin' + ':' + 'admin')
                }
            }
        };

        store.getters['app/remoteDB'].taskbox()
            .logIn('admin', 'admin', ajaxOpts)
            .then(async () => {

                return new Promise((resolve, reject) => {

                    dispatch('CREATE_PROFILE', request.profile).then((profile) => {

                        store.getters['app/remoteDB'].taskbox()
                            .signup(request.username, request.password, {
                                metadata: {
                                    profile: profile,
                                    metadata: {
                                        profileId: profile.id,
                                        connections: []
                                    }
                                },
                                roles: ['worker']
                            }).then((signupresponse) => {
                                dispatch('LOGIN', { username: request.username, password: request.password }).then(() => {
                                    resolve(console.log(signupresponse));
                                });
                            }).catch((error) => {
                                reject(console.log(error))
                            })

                    }).catch((error) => reject(console.log(error)))
                })
            })


    },
    async LOGIN({ dispatch, commit, state }, user) {

        return new Promise((resolve) => {

            var ajaxOpts = {
                ajax: {
                    headers: {
                        Authorization: 'Basic ' + window.btoa(user.username + ':' + user.password)
                    }
                }
            };

            if (state.session.authenticated.value == userstatus.AUTHENTICATED.value)
                resolve();


            store.getters['app/remoteDB'].taskbox()
                .logIn(user.username, user.password, ajaxOpts)
                .then(async (response) => {
                    commit('SET_SERVER_READY', response.ok);
                    if (response.name) {

                        store.getters['app/remoteDB'].taskbox()
                            .getUser(response.name).then((user) => {
                                if (user){
                                    store.commit('taskbox/SUCCESS_CLOSE_ROOT');
                                    dispatch('WORK_ONLINE', user).then(() => {
                                        resolve(response);
                                    });
                                }

                                else
                                    dispatch('WORK_OFFLINE').then(() => {
                                        resolve(response);
                                    })
                            })
                            .catch((error) => {
                                console.log(error);
                                dispatch('WORK_OFFLINE').then(() => {
                                    resolve(error);
                                })
                            })
                    }
                    else {
                        dispatch('WORK_OFFLINE').then(() => {
                            resolve();
                        })
                    }

                }).catch((error) => {
                    console.log(error);
                    dispatch('WORK_OFFLINE').then(() => {
                        resolve(error);
                    })
                })
        })

    },
    async LOGOUT({ dispatch }) {

        return new Promise(resolve => {
            store.getters['app/remoteDB'].taskbox()
                .logOut().then(() => {
                    store.commit('taskbox/SUCCESS_CLOSE_ROOT');
                    resolve(dispatch("WORK_OFFLINE"));
                })
        });

    },
    async GET_USER({ commit }) {
        return new Promise((resolve, reject) => {
            return store.getters['app/remoteDB'].taskbox()
                .getSession().then(async (res) => {
                    resolve(res);
                }).catch((err) => {
                    if (err.name === 'not_found') {
                        // typo, or you don't have the privileges to see this user
                        console.error("typo, or you don't have the privileges to see this user");
                    } else {
                        commit('SET_SERVER_READY', false);
                        // some other error
                        reject(err);
                    }
                })
        });

    },
    async WORK_ONLINE({ dispatch, commit }, user) {
        commit('SUCCESS_CLEAR_TASKS');
        memberRepository.find(user.metadata.profileId).then((onlineprofile) => {
            if (!onlineprofile) {
                let profile = Object.assign({}, profileModel);

                if (user.metadata.profileId) {
                    Object.assign(profile, user.profile);
                    profile.id = user.metadata.profileId;
                    profile.rev = '';
                }


                profile.username = user.name;

                dispatch('CREATE_PROFILE', profile).then((profile) => {
                    let metadata = _.cloneDeep(user.metadata);
                    metadata.profileId = profile.id
                    dispatch('UPDATE_USER', { user: user, metadata: metadata })
                        .then(() => {
                            commit('SET_SESSION', {
                                user: user,
                                profile: profile,
                                session: {
                                    authenticated: userstatus.AUTHENTICATED,
                                    access_token: null
                                }
                            })
                        })
                })
                    .catch((error) => {
                        console.log(error);
                        dispatch('WORK_OFFLINE')
                    })

            }
            else {
                commit('SET_SESSION', {
                    user: user,
                    profile: onlineprofile,
                    session: {
                        authenticated: userstatus.AUTHENTICATED,
                        access_token: null
                    }
                })
            }
        })
    },
    async WORK_OFFLINE({ commit }) {
        commit('SUCCESS_CLEAR_TASKS');
        memberRepository.find('offline').then((offlineprofile) => {

            commit('INIT_SESSION', {
                profile: offlineprofile,
                session: {
                    authenticated: userstatus.NONAUTHENTICATED,
                    access_token: null
                }
            })
        })
    },
    async UPDATE_USER({ state, commit }, request) {
        return new Promise(resolve => {
            store.getters['app/remoteDB'].taskbox().putUser(request.user.name, {
                metadata: {
                    profile: state.profile,
                    metadata: {
                        ...request.metadata
                    }
                },
            }).then((response) => {
                commit("SUCCESS_UPDATE_USER", response);
                resolve();
            })

        });
    },
    // PROFILE
    async CREATE_PROFILE({ state }, profile) {
        return new Promise((resolve, reject) => {
            memberRepository.saveOrUpdate(profile).then((response) => {
                resolve(response)

            }).catch((error) => reject(console.log(error)))
        })
    },
    async UPDATE_PROFILE({ dispatch, state, commit }, profile) {

        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve, reject) => {
            if (!state.user.metadata.profileId) return;
            memberRepository.find(state.user.metadata.profileId).then((_profile) => {

                if (!_profile) reject();
                let rev = _profile.rev;
                let updatedProfile = Object.assign({}, profile);
                updatedProfile.rev = rev;
                memberRepository.saveOrUpdate(updatedProfile).then((response) => {
                    commit('SET_PROFILE', updatedProfile);
                    dispatch('UPDATE_USER', { user: state.user, metadata: state.user.metadata })
                    resolve(response);
                }).catch((error) => {
                    reject(error)
                }).finally(() => {
                    resolve();
                })
            })
        });

    },
    async GET_FOLLOWERS({ commit }, id) {

        memberRepository.getFollowers(id).then((response => {
            commit('SUCCESS_SET_FOLLOWERS', response);
        }))

    },


    async FOLLOW({ state, dispatch }, member) {
        let profile = _.cloneDeep(state.profile);
        if (!profile.following)
            Object.assign(profile, { following: [] })

        if (profile.following.includes(member)) return;
        profile.following.push(member);
        dispatch('UPDATE_PROFILE', profile)
    },
    async UNFOLLOW({ state, dispatch }, member) {
        let profile = _.cloneDeep(state.profile);
        if (!profile.following) return;
        if (!profile.following.includes(member)) return;
        let index = profile.following.indexOf(member);
        profile.following.splice(index, 1);
        dispatch('UPDATE_PROFILE', profile)
    },
    async GET_PROFILE({ commit }, id) {

        return new Promise((resolve, reject) => {
            try {
                memberRepository.find(id).then((response => {
                    resolve(response);
                }))
            } catch (error) {
                reject(error);
            }
        })

    },

    // Get user personal tasks
    async GET_TASKS({ state, commit }, request) {

        const currentUser = state.user.metadata.profileId;
        if (!request.member)
            request.member = currentUser;

        return new Promise((resolve, reject) => {

            taskRepository.getUserTasks(request).then(async (response) => {
                resolve(commit('SUCCESS_SET_TASKS', response))
            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })

        })
    },
    async ACCEPT_TASK() {

    }

};

export const credentialExpired = function (credential) {
    return credential.expires && credential.expires <= Date.now() ? true : false;
}

export const taskHasCredential = function (TASKID) {
    let user = store.state.user.user;
    return user.metadata.credentials.find(credential => credential.tasks.includes(TASKID)) ? true : false;
}


export const allowRule = function (RULE, doc) {

    if (!RULE) return;

    let user = store.state.user.user;

    if (user.metadata.profileId == 'offline')
        return true;

    if (doc) {

        if (doc.createdBy == user.metadata.profileId || doc.createdBy == 'offline' || !doc.workers)
            return true;

        let worker = doc.workers.find(w => w.profile == user.metadata.profileId);

        if (worker && worker.credentials.map((c) => { return getCredentialTypeByValue(c).rules.includes(RULE.value) ? true : false }))
            return true;

    }

    return false;

}

const mutations = {
    SET_SERVER_READY(state, value) {
        state.serverReady = value;
        // if (!value && state.session.authenticated.value == userstatus.AUTHENTICATED.value)
        //     store.dispatch('user/LOGOUT');
    },
    SET_PROFILE(state, profile) {
        state.profile = profile;
        // store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_UPDATE_USER() {
    },
    async INIT_SESSION(state, request) {


        // if (state.root && state.root.createdBy !== 'offline'){
        //    store.commit('taskbox/SUCCESS_CLOSE_ROOT');
        // }

        state.user = initialState;
        state.profile = request.profile;
        state.session.authenticated = request.session.authenticated;
        nextTick(() => {
            store.dispatch('connection/GET_ALL', state.profile.id).then(() => {
                store.dispatch('connection/SET_MESSAGES_RECEIVED').then(() => {
                    store.dispatch('user/GET_TASKS', {
                        member: state.profile.id
                    }).then(async () => {
                        await store.dispatch('taskbox/GET_FILE_LIST');
                        await store.dispatch('taskbox/GET_PACK_LIST');
                        await store.dispatch('templates/FETCH_ALL');
                        store.commit('post/CLEAR');
                        store.commit('post/CLEAR_PERSONAL');
                    }).catch(error=>{
                        console.log(error);
                    }).finally(()=>{
                        // store.commit('SET_API_STATE', apistate.DONE);
                    })
                })
            })
        })

        if (state.profile.appSettings)
            store.commit('app/UPDATE_SETTINGS', state.profile.appSettings)
    },
    async SET_SESSION(state, request) {

        state.user = request.user;
        state.profile = request.profile;
        state.session.authenticated = request.session.authenticated;

        if (state.serverReady) {
            store.commit('app/SYNC');
            if (state.profile.profilePicture)
                window.localStorage.setItem(state.user.name, state.profile.profilePicture);
        }

        if (state.profile.appSettings)
            store.commit('app/UPDATE_SETTINGS', state.profile.appSettings)

        nextTick(() => {
            store.dispatch('connection/GET_ALL').then(() => {
                store.dispatch('user/GET_TASKS', {
                    member: state.profile.id
                }).then(async () => {
                    await store.dispatch('taskbox/GET_FILE_LIST');
                    await store.dispatch('taskbox/GET_PACK_LIST');
                    await store.dispatch('templates/FETCH_ALL');

                    store.dispatch('user/GET_FOLLOWERS', state.profile.id);

                    if (state.profile.remember.recent)
                        store.commit('taskbox/SET_RECENT', state.profile.remember.recent);

                    if (store.state.taskbox.root)
                        NodeView.updateNodes();

                    if (state.profile.appSettings[0]) {
                        if (allowRule(RULES.OPEN)) {
                            if (state.user.profile.remember.lastProject.lastRoot.id)
                                store.dispatch('taskbox/FETCH_ROOT', state.user.profile.remember.lastProject.lastRoot.id).then(() => {
                                })
                        }
                    }

                    // store.dispatch('notification/FETCH_UNSOLVED', state.profile.id)
                }).catch((error) => console.log(error))
            })
        })
    },
    SUCCESS_SET_FOLLOWERS(state, followers) {
        state.followers = followers;
    },
    SUCCESS_ADD_ROOT(state, roots) {
        state.user.metadata.roots = roots;
    },
    SUCCESS_ADD_CONNECTION(state, connectionId) {
        state.user.metadata.connections.push(connectionId);
    },
    SET_MEMBERS(state, members) {
        state.members.splice(0, state.members.length);
        state.members = members;
    },
    SUCCESS_UPDATE_TASK(state, task) {
        if (state.tasks.find(t => t.id == task.id))
            Object.assign(state.tasks.find(t => t.id == task.id),task);
    },
    SUCCESS_CLEAR_TASKS(state) {
        state.tasks = [];
        state.taskboxes = [];
        state.roots = [];
        eventBus.$emit('updateTaskList');
        DueTracker.clear();
        store.commit('SET_API_STATE', apistate.LOADING);
    },
    SUCCESS_SET_TASKS(state, response) {
        state.tasks = response.tasks;
        state.auditions = response.auditions;
        state.taskboxes = response.taskboxes;
        state.roots = response.roots;
        // state.tasks.forEach(task => {
        //     if (task.due && !isTaskDone(task) && hasDueEnd(task))
        //         DueTracker.track(task)
        // })
        // DueTracker.update(1000);

        store.commit('SET_API_STATE', apistate.DONE);
    },
    UPDATE_SETTINGS(state, settings) {
        state.profile.appSettings = settings;
        store.dispatch('user/UPDATE_PROFILE', state.profile)
    },
    UPDATE_DISPLAY_SETTINGS(state, settings) {
        state.profile.displaySettings = settings;
        store.dispatch('user/UPDATE_PROFILE', state.profile)
    },
    UPDATE_RECENT(state, recent) {
        state.profile.remember.recent = recent;
        store.dispatch('user/UPDATE_PROFILE', state.profile)
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
