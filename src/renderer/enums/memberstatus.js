const memberstatus = {
    INVITED: { value: 0, color: 'warning', text: 'Invited',message:'Invitation sent.' },
    RECEIVED: { value: 1, color: 'accent', text: 'Pending',message:'Pending acceptance.' },
    MEMBER: { value: 2, color: 'primary', text: 'Member' },
    BLOCKED: { value: 3, color: 'error', text: 'Blocked' },
    MISSING: { value: 4, color: 'error', text: 'Deleted' },
    QUIT: { value: 5, color: 'error', text: 'Quit' },
}

export default memberstatus;

export function getMemberStatusByValue(value) {
    return Object.values(memberstatus).find((t) => t.value == value)
}