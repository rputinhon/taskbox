import { AbstractDBModel } from "./AbstractDBModel"
import { dataModel } from "./DataModel";

const _taskBoxModel = {
    id: '',
    name: 'TaskBox',
    inputs: { in: { connections: [] } },
    outputs: { flowingData: { connections: [] } },
    position: [0, 0],
    data: {
        flowingData: dataModel,
        id: 'taskbox@0.1.0',
        comments: [],
        nodes: {},
        lastview: {
            zoom: 1,
            pos: {
                x: 0,
                y: 0,
            }
        },
    },
}

export const taskBoxModel = Object.assign(_taskBoxModel, AbstractDBModel);