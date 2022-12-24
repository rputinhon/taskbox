import taskstate from "../../enums/taskstate";
import { AbstractDBModel } from "./AbstractDBModel";

export const messageStatus = {
    SENT: { value: 0, icon: taskstate.UNSTARTED.icon, color: 'grey' },
    RECEIVED: { value: 1, icon: taskstate.DONE.icon, color: taskstate.STARTED.color },
    READ: { value: 2, icon: taskstate.DONE.icon, color: '#0fc153' },
    DELETED: { value: 3, icon: 'm 22.697259,6.2148445 c -1.70345,0 -3.113282,1.4117847 -3.113282,3.1152344 v 1.2187501 h -7.261718 c -0.734301,0 -1.324219,0.591871 -1.324219,1.326172 v 3.921875 c 0,0.7343 0.589918,1.324218 1.324219,1.324218 h 0.578125 c -6.69e-4,0.02955 -0.0039,0.05818 -0.0039,0.08789 v 20.761719 c 0,2.113675 1.700778,3.814453 3.814454,3.814453 h 14.578124 c 2.113676,0 3.814454,-1.700778 3.814454,-3.814453 V 17.208986 c 0,-0.02972 -0.0032,-0.05834 -0.0039,-0.08789 h 0.578125 c 0.734301,0 1.324219,-0.589918 1.324219,-1.324219 v -3.921876 c 0,-0.734301 -0.589918,-1.326172 -1.324219,-1.326172 H 28.416023 V 9.3300789 C 28.416009,7.6266292 27.006177,6.2148445 25.302727,6.2148445 Z m 0,2.5 h 2.605468 c 0.361694,0 0.613282,0.2535403 0.613282,0.6152344 V 10.548829 H 22.083977 V 9.3300789 c 0,-0.3616941 0.251588,-0.6152344 0.613282,-0.6152344 z', color: taskstate.REPROVED.color },
}

export function getMessageStatusTypeByValue(value) {
    return Object.values(messageStatus).find(s => s.value == value);
}

export const invitationStatus = {
    INVITED: { value: 0 },
    ACCEPTED: { value: 1 },
    EXCLUDED: { value: 2 },
    CANCELED: { value: 3 },
}

export const sharingTaskModel = {
    status: invitationStatus.INVITED.value,
    host: '',
    guest: '',
    createdAt: '',
    updatedAt: ''
}

export const messageModel = {
    member: '',
    text: '',
    status: messageStatus.SENT.value,
    actions: [],
    createdAt: '',
    updatedAt: ''
}



export const connectionMemberAction = {
    TYPEING: { value: 0 },
    WORKING: { value: 1 },
}

export const connectionStatus = {
    INVITED: {
        value: 0,
        text: 'Invited',
        message: 'Member Invited.',
        actions: [
            { text: 'Invited', color: 'warning' }
        ]
    },
    ACCEPTED: {
        value: 1,
        text: 'Member',
        message: 'Member',
        actions: [
            { text: 'Member', color: 'primary' }
        ]
    },
    BLOCKED: {
        value: 2,
        text: 'Blocked',
        message: '',
        actions: [
            { text: 'UnBlock', color: 'primary', action: 'connection/UNBLOCK' }
        ]
    },
    CANCELED: {
        value: 3,
        text: 'Canceled',
        message: '',
        actions: []
    },
    UNEXISTENT: {
        value: 4,
        text: 'Invite',
        message: '',
        actions: [
            { text: 'Invite', color: 'primary', action: 'connection/CREATE' }
        ]
    },
}

export function getConnectionStatusByValue(value) {

    return Object.values(connectionStatus).find((t) => t.value == value)
}

export const _connectionModel = {
    type: 'connection',
    id: '',
    host: '',
    guest: '',
    status: connectionStatus.INVITED.value,
    messages: [],
    sharingTasks: {},
    sharingAuditions: {},
}

export const connectionModel = Object.assign(_connectionModel, AbstractDBModel);