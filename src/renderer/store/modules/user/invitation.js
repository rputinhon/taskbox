import { invitationRepository } from './connectionRepository';
import { invitationModel, invitationStatus, invitationTypes } from '../../models/ConnectionModel';
import memberstatus from '../../../enums/memberstatus';
import store from "../.."
// import memberModel from '../../models/MemberModel';

const state = () => {
    return {
        invitations: [],
        fromMe: [],
        toMe: [],
    }
}

const getters = {

}

const actions = {
    async FETCH_ALL({ commit }) {
        const user = store.state.user.user;
        return new Promise((resolve, reject) => {
            try {
                invitationRepository.getAll(user.profileId).then(response => {
                    commit('SUCCESS_GET_INVITATIONS', response);
                    resolve(response)
                });
            } catch (error) {
                reject(error)
            }
        });
    },
    async GET_INVITATION({ commit }, id) {
        try {
            let result = await invitationRepository.find(id);
            commit('SUCCESS_GET_INVITATION')
            return result
        } catch (error) {
            console.log(error);
        }
    },
    async GET_CONNECTION_STATUS({ state, dispatch }, invited) {
        dispatch('FETCH_ALL').then(() => {
            const user = store.state.user.user;
            return state.invitations.filter(i => i.invitationType == invitationTypes.CONNECTION.value && (i.invitator == user.metadata.profileId || i.invited == invited));
        })

    },
    async INVITE_MEMBER({ dispatch }, invited) {
        const user = store.state.user.user;

        if (!user)
            return console.log('You\'re not logged in.');

        if (isMember(invited))
            return console.log('Already member.');
        else {
            if (await isInvited(user.metadata.profileId, invited))
                return console.log('Member already invited.');
        }

        return new Promise((resolve, reject) => {
            try {

                let newInvitation = Object.assign({}, invitationModel);
                newInvitation.invitationType = invitationTypes.CONNECTION.value;
                newInvitation.status = invitationStatus.INVITED.value;
                newInvitation.invited = invited;
                newInvitation.invitor = user.metadata.profileId;

                invitationRepository.save(newInvitation).then(() => {
                    resolve(dispatch('FETCH_ALL'));
                })

            } catch (error) {
                reject(error)
            }
        });

    },
    async ACCEPT_INVITATION({ dispatch }, id) {

        new Promise((resolve, reject) => {
            try {

                dispatch('CHANGE_INVITE_STATUS', { id: id, status: memberstatus.MEMBER.value }).then(() => {
                    resolve();
                })

            } catch (error) {
                reject(error)
            }
        });

    },
    async CHANGE_INVITE_STATUS({ commit, dispatch }, request) {
        try {
            const user = store.state.user.user;

            let invitation = await invitationRepository.find(request.id);
            console.log(invitation);
            invitation.status = request.status;
            let result = await invitationRepository.saveOrUpdate(invitation).then(() => {
                if (invitation.status == memberstatus.MEMBER.value && invitation.invited == user.metadata.profileId) {
                    store.dispatch('user/ADD_MEMBER', { id: invitation.invitator, status: invitation.status }).then(() => {
                        dispatch('FETCH_ALL');
                    })
                }
            })
            commit('SUCCESS_CHANGE_STATUS')
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async INVITE_FOR_TASK({ state, dispatch }, request) {
        let invitation = state.invitations.find(i => i.invited == request.worker.profile);
        if (invitation) {
            if (invitation.tasks.find(t => t.id == request.task.id)) return console('task already requested');

            invitationRepository.find(invitation.id).then((invitation) => {
                invitation.tasks.push(request);
                invitationRepository.saveOrUpdate(invitation).then(() => {
                    dispatch('FETCH_ALL');
                    store.dispatch('user/GET_MEMBERS');
                })
            })

        }
    },
    async DELETE_INVITATION({ dispatch }, id) {
        try {
            let invitation = await invitationRepository.find(id);
            if (invitation) {
                await invitationRepository.delete(invitation).then(() => {
                    dispatch('FETCH_ALL');
                })
            }
        } catch (error) {
            console.log(error);
        }
    },
}

export async function isInvited(invitor, invited) {
    return new Promise(resolve => {
        invitationRepository.isInvited(invitor, invited).then((response) => {
            resolve(response);
        })
    })
}

export function isMember(id) {
    let isMember = false;
    let members = store.state.user.members;
    members.forEach(member => {
        if (member.id == id && member.status == memberstatus.INVITED.value)
            return isMember = true;
    })
    return isMember;
}

const mutations = {
    SUCCESS_GET_INVITATIONS(state, invitations) {
        const user = store.state.user.user;
        state.invitations = invitations;
        state.toMe = invitations.filter(i => i.invited == user.metadata.profileId);
        state.fromMe = invitations.filter(i => i.invitor == user.metadata.profileId);
    },
    SUCCESS_CHANGE_STATUS() { },
    SUCCESS_INVITE_MEMBER() { },
    SUCCESS_GET_INVITATION() { },
    SUCCESS_CHECK_INVITATION() { },
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


