const RULES = {
    SHOW: { value: 0 },
    PREVIEW: { value: 1 },
    INTERACT: { value: 2 },
    CREATE: { value: 3 },
    ADD: { value: 4 },
    EDIT: { value: 5 },
    DELETE: { value: 6 },
    AUDIT: { value: 7 },
    OPEN: { value: 8 },
    SAVE: { value: 9 },
    ALL: { value: 10 }
}

export function getRULEByValue(value) {
    return Object.entries(RULES).find((t) => t[1].value == value)[0];
}

export default RULES;