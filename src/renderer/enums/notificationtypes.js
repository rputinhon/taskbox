import { invitationStatus } from "../store/models/ConnectionModel";


const notificationtypes = {
    CONNECTION: {
        value: 0,
        HOST: { text: 'Waiting for acceptance.' },
        GUEST: {
            text: 'Is asking to be your friend.',
            actions: [
                { text: 'accept', color: 'primary', action: 'connection/CHANGE_STATUS', value: invitationStatus.ACCEPTED.value },
                { text: 'delete', color: 'error', action: 'connection/CHANGE_STATUS', value: invitationStatus.EXCLUDED.value }
            ]
        }
    },
    TASK_INVITE: {
        value: 1,
        HOST: { text: 'Waiting for acceptance.' },
        GUEST: {
            text: 'Is asking you to work on a task.',
            actions: [
                { text: 'accept', action: 'user/ACCEPT_TASK', color: 'primary' },
                { text: 'deny', action: 'user/DENY_TASK', color: 'error' }
            ]
        }
    },
}

export default notificationtypes;

export function getNotificationTypeByValue(value) {
    return Object.values(notificationtypes).find((t) => t.value == value)
}
