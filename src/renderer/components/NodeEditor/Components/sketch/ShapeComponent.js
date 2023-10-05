import Rete from 'rete';
import ShapeNode_Default from "./ShapeNode_Default.vue"
import { shapesocket } from '../index';
import store from '../../../../store';
import { isTaskCanceled } from '../../../../store/modules/task/task';
// import { NodeView } from '../../../../libs/nodeview';


export default class ShapeComponent extends Rete.Component {

	constructor(args) {
		super("Shape");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = ShapeNode_Default;
	}

	builder(node) {
		node.meta = this.type.meta;
		node.properties = this.type.properties;
		if (!node.data)
			node.data = this.type.data;

		let out = new Rete.Output("flowingData", "", shapesocket);

		return node
			.addOutput(out);
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
