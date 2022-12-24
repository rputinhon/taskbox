import Rete from 'rete';

import AuditionNode_Default from "./AuditionNode_Default.vue"
import { anysocket } from '../index';
import store from '../../../../store';
import { isTaskCanceled, isTaskOpen } from '../../../../store/modules/task/task';
// import { updateAuditionProgress } from '../../../../store/modules/task/task';



export default class extends Rete.Component {
    constructor(args) {
        super("Audition");
        this.type = args.type;
        this.data.component = AuditionNode_Default; // Vue.js component, not required
        this.emitter = args.emitter;
    }

    builder(node) {
        if (!Object.keys(node.data).length)
            node.data = this.type.data;

        var in1 = new Rete.Input("in", "", anysocket, true);
        var out1 = new Rete.Output("flowingData", "", anysocket);
        return node
            .addInput(in1)
            .addOutput(out1);
    }


    async worker(node, inputs, outputs) {

        let task = await store.dispatch('task/FIND_TASK', node.id);

        let _node =
            this.emitter.nodes
                .find(n => n.id == node.id)

        if (!task) return;

        if (_node && task && task.externalValue)
            _node.vueContext.externalInputs = task.externalValue.map(id => {
                if (store.state.taskbox.taskBoxInputs[id]) {
                    return store.state.taskbox.taskBoxInputs[id]
                }
            }).filter(e => e !== undefined);

        if (!outputs["flowingData"])
            Object.assign(outputs, { flowingData: {} })

        if (!outputs["flowingData"]["bus"])
            Object.assign(outputs.flowingData, { bus: {} })

        if (inputs.in)
            inputs.in.map(input => {
                Object.assign(outputs["flowingData"]["bus"], input)
            });

        if (!isTaskCanceled(task) && !isTaskOpen(task)) {
            Object.assign(outputs["flowingData"]["bus"], { [node.id]: task.value })
            outputs["flowingData"][node.id] = task.value;
        }


    }
}
