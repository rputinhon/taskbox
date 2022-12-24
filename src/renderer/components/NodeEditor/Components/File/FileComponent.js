import Rete from 'rete';

import FileNode_Default from "./FileNode_Default.vue"
import { anysocket } from '../index';
import store from '../../../../store';
import { isTaskCanceled } from '../../../../store/modules/task/task';
// import store from '../../../../store';



export default class extends Rete.Component {
    constructor(args) {
        super("File");
        this.type = args.type;
        this.data.component = FileNode_Default; // Vue.js component, not required
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

        if (_node && task && task.externalValue && store.state.taskbox.taskBoxInput && store.state.taskbox.taskBoxInputs[task.externalValue])
            _node.vueContext.externalInputs = store.state.taskbox.taskBoxInputs[task.externalValue];

        if (!outputs["flowingData"])
            Object.assign(outputs, { flowingData: {} })

        if (!outputs["flowingData"]["bus"])
            Object.assign(outputs.flowingData, { bus: {} })

        if (inputs.in)
            inputs.in.map(input => {
                Object.assign(outputs["flowingData"]["bus"], input)
            });

            // && !isTaskOpen(task)
        if (!isTaskCanceled(task)) {
            Object.assign(outputs["flowingData"]["bus"], { [node.id]: task.value })
            outputs["flowingData"][node.id] = task.value;
        }

    }
}
