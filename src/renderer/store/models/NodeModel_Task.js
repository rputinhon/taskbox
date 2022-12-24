import { AbstractDBModel } from "./AbstractDBModel"
import { dataModel } from './DataModel'

const _nodeModel = {
    name: 'Task',
    inputs: { in: { connections: [] } },
    outputs: { flowingData: { connections: [] } },
    position: [0, 0],
    data: {
        flowingData: dataModel,
    },
}

export const nodeModelTask = Object.assign(_nodeModel, AbstractDBModel);
