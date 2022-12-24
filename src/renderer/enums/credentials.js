import RULES from "./rules";

// range field represents the range of taskboxes that the user can interact, inside the root.
const CREDENTIALS = {
    WORKER: {
        name: 'worker', value: 0, rules: [
            RULES.OPEN,
            RULES.PREVIEW,
            RULES.SHOW,
            RULES.SAVE,
            RULES.INTERACT,
            RULES.EDIT
        ], tasks: [], range: null, deepness: null, expires: null, description: 'Work on defined tasks'
    },
    GUEST: {
        name: 'guest', value: 1, rules: [
            RULES.PREVIEW,
            RULES.SHOW,
            RULES.INTERACT
        ], tasks: [], range: null, expires: null, deepness: null, description: 'Only preview defined tasks.'
    },
    ARCHITECT: {
        name: 'architect', value: 2, rules: [
            RULES.SAVE,
            RULES.ADD,
            RULES.CREATE,
            RULES.DELETE,
            RULES.EDIT,
            RULES.INTERACT,
            RULES.OPEN,
            RULES.PREVIEW,
            RULES.SHOW
        ], tasks: [], range: [null,null], expires: null, deepness: 0, description: 'Add or edit tasks including taskboxes inside the defined range.'
    },
    AUDITOR: {
        name: 'auditor', value: 3, rules: [
            RULES.INTERACT,
            RULES.OPEN,
            RULES.PREVIEW,
            RULES.SHOW,
            RULES.AUDIT
        ], tasks: [], range: null, expires: null, deepness: null, description: 'To aproove or ask reviews over defined tasks.'
    },
    MASTER: {
        name: 'admin', value: 4, rules: [
            RULES.ALL
        ], tasks: null, range: [Infinity, Infinity], expires: null, deepness: Infinity, description: 'The administrator have access to all features.'
    },
}

export function getCredentialTypeByValue(value) {
    return Object.values(CREDENTIALS).find((t) => t.value == value);
}

export default CREDENTIALS;