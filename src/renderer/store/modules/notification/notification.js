import { notificationRepository } from './notificationRepository';
import store from '../..';
import _ from 'lodash';
import { box64, taskDone64 } from '../../../../main/icons';

const { ipcRenderer } = require('electron');

// {
//     value: false,
//     message: 'There are unreaded Messages',
//     push: true,
//     unread: [],
// }

const state = () => {
    return {
        notificationsSent: [],
        notificationsReceived: [],
    }
}

const getters = {
}

const actions = {
    async FETCH_UNSOLVED({ commit }, id) {

        notificationRepository.fetchUnsolved(id).then(notifications => {
            commit('NOTIFIED', notifications)
        })

    },
    async NOTIFY({ dispatch }, notification) {

        return notificationRepository.save(notification).then((notification) => {
            // local
            if (store.state.app.appSettings[3].value && notification.notificationType.local)
                dispatch('NOTIFY_LOCAL', { title: notification.notificationType.title, body: notification.notificationType.message })

            return notification;
        })

    },
    UPDATE_STATUS({ dispatch }, request) {
        notificationRepository.find(request.id).then(response => {
            if (!response) return;
            let copy = _.cloneDeep(response)
            copy.status = request.status;
            notificationRepository.saveOrUpdate(copy).then(() => {
                return dispatch('FETCH_UNSOLVED');
            })
        })
    },
    NOTIFY_TASK_DONE({ dispatch }, entity) {
        // local
        // if (store.state.app.appSettings[1].value) 
        dispatch('NOTIFY_LOCAL', { icon: entity.thumbnail !== '' ? entity.thumbnail :  entity.type !== 'taskbox' ? taskDone64 : box64, title: entity.title, body: `${entity.taskType == 'taskbox' ? 'Taskbox Done!' : 'Task Done!'}` })

    },
    NOTIFY_MESSAGE({ dispatch }, message) {
        // local
        // if (store.state.app.appSettings[1].value) 
        const profile = store.state.user.profile;
        dispatch('NOTIFY_LOCAL', { icon: profile.profilePicture, title: profile.username, body: message })

    },
    NOTIFY_LOCAL({ commit }, request) {
        if (store.state.app.appSettings.find(s => s.label == 'Local Notifications').value) {
            ipcRenderer.send('app:notify', { icon: request.icon || null, title: request.title, body: request.body })
            commit('NOTIFIED');
        }
    },
}

const mutations = {
    NOTIFIED() {
        // let profileId = store.state.user.user.metadata.profileId;
        // state.notificationsReceived = notifications.filter(n => n.to == profileId);
        // state.notificationsSent = notifications.filter(n => n.from == profileId);
    },
    UPDATE_MESSAGES(state, notifications) {
        Object.assign(state.messages, notifications);
    },
    UPDATE_MEMBERS(state, value) {
        state.members.hasPendingMembers.value = value;
    },
    UPDATE_INVITATIONS(state, value) {
        state.invitations.hasPendingInvitations.value = value;
    },
    UPDATE_TASKS(state, notifications) {
        Object.assign(state.tasks, notifications);
    },

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


