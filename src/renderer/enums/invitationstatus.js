const invitationstatus = {
    INVITED: { value: 0, text: 'Invited' },
    ACCEPTED: { value: 1, text: 'Member' },
    BLOCKED: {
        value: 2,
        text: 'Blocked',
        actions: [
            { text: 'UnBlock', color: 'primary', action: 'connection/UNBLOCK' }
        ]
    },
    CANCELED: { value: 3 },
    UNEXISTENT: {
        value: 4,
        actions: [
            { text: 'Invite', color: 'primary', action: 'connection/CREATE' }
        ]
    }
}

export function getInvitationStatusByValue(value) {

    return Object.values(invitationstatus).find((t) => t.value == value)
}

export default invitationstatus;