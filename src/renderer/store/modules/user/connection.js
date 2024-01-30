import { connectionRepository } from './connectionRepository';
import { connectionStatus, messageModel, messageStatus } from '../../models/ConnectionModel';
import store from "../.."
import _ from 'lodash';


const state = () => {
    return {
        // List of all connections
        list: [],
        // People by status connection Fields: [connection,member]
        invited: [],
        blocked: [],
        canceled: [],
        // Pending connection invitations
        invitations: [],
        // Pending task invitations
        sharingTasks: [],
        sharingAuditions: [],
        // members
        members: [],
        // shared connection actions tracking
        membersActions: []
    }
}

const getters = {

}

const actions = {
    async CREATE({ dispatch }, guest) {

        const host = store.state.user.user.metadata.profileId;

        if (!host) return;

        connectionRepository.connected(host, guest).then((status) => {
            if (status == false)
                new Promise((resolve, reject) => {
                    connectionRepository.create(host, guest).then(() => {
                        resolve(dispatch('GET_ALL'));
                    })
                        .catch(error => {
                            console.log(error)
                            reject(error)
                        })
                })
            else
                console.log('Connection Exist');
        })


    },
    async GET_ALL({ commit }, idList) {
        const host = store.state.user.user.metadata.profileId;
        if (!host) return;

        return new Promise((resolve, reject) => {
            try {
                connectionRepository.getAll(host, idList).then(response => {
                    commit('SUCCESS_GET_CONNECTIONS', response);
                    resolve(response)
                });
            } catch (error) {
                reject(error)
            }
        });
    },
    async GET({ commit }, id) {
        try {
            let result = await connectionRepository.search(id);
            commit('SUCCESS_GET_CONNECTION')
            return result
        } catch (error) {
            console.log(error);
        }
    },
    async ACCEPT({ dispatch }, id) {
        return new Promise(res => {
            connectionRepository.find(id).then((response) => {
                let connection = _.cloneDeep(response);
                connection.status = connectionStatus.ACCEPTED.value;

                connectionRepository.saveOrUpdate(connection).then(() => {
                    res(dispatch('GET_ALL'))
                })
            })
        })
    },
    async CANCEL({ dispatch, state }, id) {
        let invitation = _.cloneDeep(state.list.find(c => c.id == id));
        if (!invitation) return;
        invitation.status = connectionStatus.CANCELED.value;
        new Promise(res => {
            connectionRepository.saveOrUpdate(invitation).then(() => {
                res(dispatch('GET_ALL'));
            })
        })
    },
    async DELETE({ dispatch }, id) {
        new Promise(res => {
            connectionRepository.find(id).then(connection => {
                if (connection)
                    connectionRepository.delete(connection).then(() => {
                        res(dispatch('GET_ALL'));
                    })
                else
                    res();
            })

        })
    },
    async GET_MESSAGES({ dispatch }, id) {
        let messages = await dispatch('SET_MESSAGES_READ', id);
        return messages;
    },
    async GET_LAST_MESSAGES({ state }) {
        return await connectionRepository.getConnectionsLastMessage(state.members.map(m => m.connection)).then(messages => {

            console.log(messages);
            // Object.keys(messages).forEach(connection=>{
            //     // dispatch('SET_ALL_MESSAGES',{connection:connection.id,status:messageStatus.RECEIVED.value,member:messages[connection].member})
            // })
            return messages;
        })
    },
    async SEND_MESSAGE({ state, commit }, args) {
        const host = store.state.user.user.metadata.profileId;
        let connection = state.list.find(m => m.id == args.connection)
        if (!host || !args.connection || !args.message.trim().length || !connection || connection.status != connectionStatus.ACCEPTED.value) return;

        return new Promise(res => {
            connectionRepository.find(args.connection).then((response) => {
                let message = Object.assign({}, messageModel);
                message.member = host;
                message.text = args.message;
                message.createdAt = new Date().toISOString();
                response.messages.push(message);
                connectionRepository.saveOrUpdate(response).then(() => {
                    commit('SUCCESS_SET_LAST_MESSAGE', { connection: args.connection, message: message })
                    res(message);
                })
            })
        })
    },
    async DELETE_MESSAGE({ dispatch, state }, args) {
        const host = store.state.user.user.metadata.profileId;
        let connection = state.list.find(m => m.id == args.connection)
        if (!host || !args.connection || !connection || connection.status !== connectionStatus.ACCEPTED.value) return;

        new Promise(res => {
            connectionRepository.find(args.connection).then((response) => {
                let messages = _.cloneDeep(response).messages;
                messages.splice(args.index, 1);
                response.messages = messages;
                connectionRepository.saveOrUpdate(response).then(() => {
                    res(dispatch('GET_ALL'));
                })
            })
        })
    },
    async SET_MESSAGES_RECEIVED({ dispatch, state }) {
        const host = store.state.user.profile.id;
        state.members.map(member => {
            if (member.lastMessage &&
                member.lastMessage.member !== host &&
                member.lastMessage.status == messageStatus.SENT.value)
                new Promise(resolve => {
                    dispatch('SET_ALL_MESSAGES', { connection: member.connection, status: messageStatus.RECEIVED.value }).then(() => {
                        resolve();
                    })
                })
        })
    },
    async SET_MESSAGES_READ({ dispatch, state }, id) {
        let member = state.members.find(m => m.connection == id);
        if (member)
            return await dispatch('SET_ALL_MESSAGES', { connection: id, status: messageStatus.READ.value }).then((response) => {
                return response;
            })
        else {
            return await connectionRepository.getMessages(id).then(messages => {
                return messages;
            })
        }
    },
    async SET_ALL_MESSAGES({ commit }, args) {
        const host = store.state.user.profile.id;

        if (!host || !args.connection || !args.status) return;

        return new Promise(resolve => {
            connectionRepository.find(args.connection).then((response) => {
                let messages = _.cloneDeep(response).messages;
                let hasChanges = false;
                messages.map(message => {
                    if (message.status !== args.status && message.member !== host) {
                        message.status = args.status;
                        hasChanges = true;
                    }
                });
                if (hasChanges) {
                    response.messages = messages;
                    return connectionRepository.saveOrUpdate(response).then((connection) => {
                        commit('SUCCESS_SET_LAST_MESSAGE', { connection: args.connection, message: connection.messages[connection.messages.length - 1] })
                        resolve(connection.messages);
                    })
                } else {
                    commit('SUCCESS_SET_LAST_MESSAGE', { connection: args.connection, message: response.messages[response.messages.length - 1] })
                    resolve(response.messages);
                }
            })
        })
    },



}

export function getConnection(id, member) {

    let conn = null;

    if (id)
        conn = store.state.connection.list.find(c => c.id == id);
    if (conn)
        return conn
    else {
        if (member)
            conn = store.state.connection.list.find(c => c.guest == member);
        if (conn)
            return conn
        else {
            return store.state.connection.list.find(c => c.host == member);
        }
    }

}

export async function connectionExist(state, guest) {
    const host = store.state.user.user.metadata.profileId;
    if (!host) return false;

    return new Promise(resolve => {
        connectionRepository.connected(host, guest).then((response) => {
            resolve(response);
        })
    })
}


const mutations = {
    SUCCESS_GET_CONNECTIONS(state, connections) {
        let user = store.state.user.user.metadata.profileId;
        state.list = connections;
        state.invited = connections.filter(c => c.host == user && c.status == connectionStatus.INVITED.value).map(c => { return { member: c.guest, connection: c.id } });
        state.members = connections.filter(c => c.host == user && c.status == connectionStatus.ACCEPTED.value).map(c => { return { member: c.guest, connection: c.id, lastMessage: c.lastMessage } })
            .concat(connections.filter(c => c.guest == user && c.status == connectionStatus.ACCEPTED.value).map(c => { return { member: c.host, connection: c.id, lastMessage: c.lastMessage } }))
        state.blocked = connections.filter(c => c.host == user && c.status == connectionStatus.BLOCKED.value).map(c => { return { member: c.guest, connection: c.id } });
        state.canceled = connections.filter(c => c.host == user && c.status == connectionStatus.CANCELED.value).map(c => { return { member: c.guest, connection: c.id } });
        state.invitations = connections.filter(c => c.guest == user && c.status == connectionStatus.INVITED.value);
        store.dispatch('connection/SET_MESSAGES_RECEIVED');
    },
    SUCCESS_GET_CONNECTION() { },
    SUCCESS_GET_MESSAGES() { },
    SUCCESS_SET_LAST_MESSAGE(state, args) {
        state.members.find(m => m.connection == args.connection).lastMessage = args.message;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


