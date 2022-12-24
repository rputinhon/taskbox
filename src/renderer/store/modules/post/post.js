import { postRepository } from './postRepository';
import store from "../.."
import apistate from "../../../enums/apistate";
import { checkModel, postModel, postType } from '../../models/PostModel';
import _ from 'lodash';
import { messageModel } from '../../models/ConnectionModel';

const state = () => {
    return {
        posts: [],
        personal: [],
        opentasks: [],
        previewingPost: null,
        creatingPost: null
    }
}

const getters = {

}

const actions = {
    async FETCH({ commit, state }, args) {

        postRepository.search(null, { limit: 8, skip: args.clear ? 0 : state.posts.length || 0 }).then((posts) => {
            if (!args.search)
                commit("SUCCESS_FETCH_POSTS", { posts: posts, clear: args.clear })
            else
                return posts;
        })

    },
    async FETCH_PERSONAL({ commit, state }, args) {

        postRepository.getPersonalPosts(args.member, { limit: 8, skip: args.clear ? 0 : state.personal.length }).then((posts) => {
            commit("SUCCESS_FETCH_POSTS_PERSONAL", { posts: posts, clear: args.clear })
        })
    },
    async FETCH_ALL({ commit }, request) {
        store.commit('SET_API_STATE', apistate.LOADING);
        try {

            let response = await postRepository.fetch(request);

            commit("SUCCESS_FETCH_ALL")

            store.commit('SET_API_STATE', apistate.DONE);
            return response;

        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async GET_POST({ commit }, id) {
        store.commit('SET_API_STATE', apistate.LOADING);
        try {
            let post = await postRepository.find(id);
            commit("SUCCESS_GET_POST");
            return post;
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async GET_FIELD({ commit }, args) {
        return postRepository.getField(args.task, args.field).then(response => {
            commit('SUCCESS_GET_POST');
            return response;
        }).catch((error) => {
            console.log(error);
        })
    },
    async SAVE({ dispatch }, post) {
        store.commit('SET_API_STATE', apistate.SAVING);
        try {
            postRepository.saveOrUpdate(post).then((result) => {
                dispatch('FETCH_PERSONAL', { filter: null, member: result.createdBy, clear: true });
            });
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async DELETE({ commit, dispatch }, id) {
        return new Promise(res => {
            postRepository.find(id).then((post) => {
                if (post)
                    postRepository.delete(post).then(() => {
                        dispatch('FETCH', { filter: null, clear: true }).then(() => {
                            dispatch('FETCH_PERSONAL', { filter: null, member: post.createdBy, clear: true }).then(() => {
                                res(commit("SUCCESS_DELETE_POST", post))
                            })
                        })
                    })
            })
        })
    },
    async PREVIEW_POST({ commit }, id) {
        try {
            postRepository.find(id).then((result) => {
                if (result)
                    commit('PREVIEW_POST', result);
            });
        } catch (error) {
            store.commit('SET_ERROR_STATE', error.message);
        }
    },
    async ADD_COMMENT({ commit }, args) {
        const host = store.state.user.user.metadata.profileId;
        if (!host || !args.post || !args.message.trim().length) return;

        return new Promise(res => {
            postRepository.find(args.post).then((response) => {
                if (!response) return;
                let comment = Object.assign({}, messageModel);
                comment.member = host;
                comment.text = args.message;
                comment.createdAt = new Date().toISOString();
                response.messages.push(comment);
                postRepository.saveOrUpdate(response).then(() => {
                    commit('SUCCESS_ADD_COMMENT', comment)
                    res(comment);
                })
            })
        })
    },
    async DELETE_COMMENT({ commit }, args) {
        const host = store.state.user.user.metadata.profileId;
        if (!host || !args.post || !args.index) return;

        new Promise(res => {
            postRepository.find(args.connection).then((response) => {
                if (!response) return;
                let comments = _.cloneDeep(response).messages;
                comments.splice(args.index, 1);
                response.messages = comments;
                postRepository.saveOrUpdate(response).then(() => {
                    res(commit('SUCCESS_DELETE_COMMENT'));
                })
            })
        })
    },
    async CHECK({ commit }, args) {

        return new Promise(response => {
            postRepository.find(args.post).then((post) => {

                if (post && !post.checks.find(c => c.member == args.member)) {
                    let check = Object.assign({}, checkModel);
                    check.member = args.member;
                    check.createdAt = new Date().toISOString();
                    let copy = _.cloneDeep(post);
                    copy.checks.push(check)
                    postRepository.saveOrUpdate(copy).then((resp) => {
                        commit("SUCCESS_UPDATE_POST", copy)
                        response(resp.checks)
                    })
                }
                else
                    response([]);


            })
        })
    },
    async CANCEL_TASK_CANDIDATE({ commit }, args) {

        return new Promise(response => {
            postRepository.find(args.post).then((post) => {
                if (!post)
                    response([]);
                let copy = _.cloneDeep(post);

                let candidate = copy.data.candidats.find(c => c.member == args.member);
                if (!candidate) return;

                let index = copy.data.candidats.indexOf(candidate);
                copy.data.candidats.splice(index, 1)

                postRepository.saveOrUpdate(copy).then((resp) => {
                    commit("SUCCESS_UPDATE_POST", copy)
                    response(resp.checks)
                })

            })
        })
    }
}

const mutations = {
    SUCCESS_FETCH_POSTS_PERSONAL(state, args) {
        if (!args.clear) {
            state.personal = state.personal.concat(args.posts);
        } else {
            state.personal = args.posts;
        }
        state.opentasks = args.posts.filter(p => p.postType == postType.TASK.value).map(post => { return { [post.task]: post.data.candidats } });
    },
    SUCCESS_FETCH_POSTS(state, args) {
        if (!args.clear) {
            state.posts = state.posts.concat(args.posts);
        } else {
            state.posts = args.posts;
        }
    },
    CLEAR(state) {
        state.posts.splice(0, state.posts.length);
    },
    CLEAR_PERSONAL(state) {
        state.personal.splice(0, state.personal.length);
    },
    SUCCESS_FETCH_ALL: () => {
        // // console.log'SUCCESS FETCHING ALL OBJECTS');
        store.commit('SET_API_STATE', apistate.DONE);
    },
    OPEN_POST_CREATOR(state, args) {
        state.creatingPost = Object.assign({}, postModel);
        if (args)
            Object.assign(state.creatingPost, args);
    },
    UPDATE_CREATING_POST(state, post) {
        state.creatingPost = post;
    },
    CHANGE_POST_TYPE(state, type) {
        state.creatingPost.postType = type;
    },
    CLOSE_POST_CREATOR(state) {
        state.creatingPost = null;
    },
    SUCCESS_ADD_COMMENT() {
    },
    SUCCESS_DELETE_COMMENT() {
    },
    SUCCESS_GET_POST: () => {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_ADD_POST: () => {
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_DELETE_POST() {
    },
    PREVIEW_POST: (state, post) => {
        state.previewingPost = post;
    },
    CLOSE_PREVIEW_POST: (state) => {
        state.previewingPost = null;
    },
    SUCCESS_UPDATE_POST(state, post) {
        let p = state.posts.find(p => p.id == post.id);
        if (post) {
            let index = state.posts.indexOf(p);
            state.posts[index] = post;
            // eventBus.$emit('updatePost', post)
        }
    },

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


