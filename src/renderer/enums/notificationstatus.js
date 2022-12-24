const notificationstatus = {
    SENT: { value: 0, text: 'Sent', color: 'warning' },
    RECEIVED: { value: 1, text: 'Received', color: 'primary' },
    READ: { value: 2, text: 'Thinking', color: 'success' },
    ACCEPTED: { value: 3, text: 'Solved', color: 'success' },
    DENIED: { value: 4, text: 'Denied', color: 'error' }
}
export default notificationstatus;

export function getNotificationStatusByValue(value) {
    return Object.values(notificationstatus).find((t) => t.value == value)
}