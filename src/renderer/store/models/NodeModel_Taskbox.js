import { AbstractDBModel } from "./AbstractDBModel"
import { dataModel } from './DataModel'

const _nodeModel = {
    name: 'TaskBox',
    inputs: { in: { connections: [] } },
    outputs: { flowingData: { connections: [] } },
    position: [0, 0],
    data: {
        comments: [],
        id: 'taskbox@0.1.0',
        flowingData: dataModel,
        lastview: {
            zoom: 1,
            pos: {
                x: 0,
                y: 0,
            }
        },
        nodes:{}
    },
}

export const nodeModelTaskBox = Object.assign(_nodeModel, AbstractDBModel);
