import Rete from 'rete';
import { ToggleFlow } from '../../Controls/flow/ToggleFlow';
import SimpleFlow from "./SimpleFlow.vue"

import { anysocket } from '../index';

export default class extends Rete.Component {
	constructor(args) {
		super("Flow");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = SimpleFlow;
	}

	builder(node) {
		node.meta = this.type.meta;
		node.properties = this.type.properties;
		if (!node.data)
			node.data = this.type.data;

		var in1 = new Rete.Input("a", "", anysocket, false);
		var out1 = new Rete.Output("flowingData", "", anysocket);

		return node
			.addInput(in1)
			.addControl(new ToggleFlow(this.emitter, "flowingData"))
			.addOutput(out1);
	}

	worker(node, inputs, outputs) {
		// if (node.inputs['a'].connections.length > 0) {
		// 	let _input = this.emitter.nodes
		// 		.find(n => n.id == node.inputs['a'].connections[0].node);
		// 	if (_input !== undefined) {
		// 		node.data.task.status = _input.data.task.status
		// 	}


		// }
		if(node.data.flowingData.flowing){
			let out = inputs['a'][0];
			if(out)
			out.flowing=node.data.flowingData.flowing;
			outputs["flowingData"] = out;
		}

	}
}
