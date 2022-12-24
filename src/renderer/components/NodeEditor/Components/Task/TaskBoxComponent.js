import Rete from 'rete';
import TaskBoxNode_Default from './TaskBoxNode_Default.vue'
import { anysocket } from '../index';
import store from '../../../../store';
import { NodeView } from '../../../../libs/nodeview';
import { isTaskCanceled } from '../../../../store/modules/task/task';

export default class extends Rete.Component {
    constructor(args) {
        super("TaskBox");
        this.type = args.type;
        this.data.component = TaskBoxNode_Default;
        this.emitter = args.emitter;
    }


    async builder(node) {

        if (node.data == {})
            node.data = this.type.data;

        var in1 = new Rete.Input("in", "", anysocket, true);
        var out1 = new Rete.Output("flowingData", "", anysocket);

        return node
            .addInput(in1)
            .addOutput(out1);
    }

    async getExternalInput(node, key) {
        let taskbox = store.getters['taskbox/workingTaskbox'];

        if (!taskbox && taskbox.inputs.in) return null;
        let _node =
            this.emitter.nodes
                .find(n => n.id == node.id)

        let conn = taskbox.inputs.in ? taskbox.inputs.in.connections.find(c => c.data && Object.keys(c.data.connections).includes(node.id) && c.data.connections[node.id].keys.includes(key)) : null;
        if (conn) {

            let data = await store.dispatch('taskbox/FIND_NODE', conn);

            if (_node) {
                _node.vueContext.externalInputs = data;
            }

            return data;
            // return data;

        }
        else {
            _node.vueContext.externalInputs = null;
            NodeView.updateNode(node.id);
        }

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
