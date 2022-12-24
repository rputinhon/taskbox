import LOD from '../../../enums/LOD';

const initialstate = {
    // actual root taskbox.
    root: null,
    // actual working taskbox.
    currentTaskBox: null,
    // Current TaskBox task
    // info about the taskbox tasks.
    taskBoxInfo: null,
    // List of the exposed outputs inside the taskbox.
    taskBoxInputs: null,

    // last working taskbox to show in the home screen.
    recent: {
        lastModifiedTasks: []
    },
    //changes
    hasChanges: false,

    // alalisis
    analysing: false,
    analisis: {},

    //due
    dueTracker: {},

    // BreadCrumb Data navigation
    breadCrumb: null,

    //MODALS
    previewingTask: null,
    auditingTask: null,
    taskInputs: [],
    taskOutputs: [],

    changingWorker: null,
    changingStatus: null,
    toTemplate: null,
    newStatus: null,

    loading: false,
    packList: [],
    fileList: [],
    LOD: LOD.LOW,

    // history stack
    backStack: [],
    changeStack: []
}

export default initialstate;