import taskstate from "../../enums/taskstate";
import { iconTypes } from "../../fixtures/iconTypes";

export const taskBoxInfo = {
    Total: {
        icon: iconTypes['task'][0],
        color: '#1070ff',
        name: 'Tasks',
        value: 0
    },
    Done: {
        icon: taskstate.DONE.icon,
        color: taskstate.DONE.color,
        name: taskstate.DONE.text,
        value: 0
    },
    Incomplete: {
        icon: iconTypes['task'][3],
        color: taskstate.UNSTARTED.color,
        name: 'Incomplete',
        value: 0
    },
    Unstarted: {
        icon: taskstate.UNSTARTED.icon,
        color: taskstate.UNSTARTED.color,
        name: taskstate.UNSTARTED.text,
        value: 0
    },
    Started: {
        icon: taskstate.STARTED.icon,
        color: taskstate.STARTED.color,
        name: taskstate.STARTED.text,
        value: 0
    },
    Reviewing: {
        icon: taskstate.REVIEWING.icon,
        color: taskstate.REVIEWING.color,
        name: taskstate.REVIEWING.text,
        value: 0
    },
    Paused: {
        icon: taskstate.PAUSED.icon,
        color: taskstate.PAUSED.color,
        name: taskstate.PAUSED.text,
        value: 0
    },
    Canceled: {
        icon: taskstate.REPROVED.icon,
        color: taskstate.REPROVED.color,
        name: taskstate.REPROVED.text,
        value: 0
    },
    Open: {
        icon: iconTypes['members'][1],
        color: '#1070ff',
        name: 'Open',
        value: 0
    },
    Boxes: {
        icon: iconTypes['taskbox'][0],
        color: '#1070ff',
        name: 'Boxes',
        value: 0
    },
    Members: {
        icon: iconTypes['members'][0],
        color: '#1070ff',
        name: 'Members',
        value: 0
    },
    Progress: 0,
}

