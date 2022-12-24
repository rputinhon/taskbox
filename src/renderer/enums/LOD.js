const LODTYPES = {
    HIGH: 0.3,
    MEDIUM: 0.16,
    LOW: 0.08,
    VERYLOW: 0.01,
}

export default LODTYPES;

export function getLODTypeByValue(factor) {
    let LOD = LODTYPES.HIGH;
    if (factor < LODTYPES.HIGH && factor >= LODTYPES.MEDIUM) {
        LOD = LODTYPES.MEDIUM;
    }
    else {
        if (factor < LODTYPES.MEDIUM && factor >= LODTYPES.LOW) {
            LOD = LODTYPES.LOW
        }
        else {
            if (factor < LODTYPES.LOW)
                LOD = LODTYPES.VERYLOW;
            else
                LOD = LODTYPES.HIGH;
        }
    }

    return LOD;
}