import Rete from 'rete';
import { NumControl } from '../../Controls/math/Number';
import InputNode_Default from "./InputNode_Default.vue"

import { mathsocket } from '../index';


export default class extends Rete.Component {
	constructor(args) {
		super("Number");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = InputNode_Default;
	}

	builder(node) {
		node.meta = this.type.meta;
		node.properties = this.type.properties;
		if (!node.data)
			node.data = this.type.data;
		var out1 = new Rete.Output("flowingData", "", mathsocket);
		return node
			.addControl(new NumControl(this.emitter, "flowingData"))
			.addOutput(out1);
	}

	worker(node, inputs, outputs) {
		let isConst = node.data.numberType == 0 ? true : false;
		let sign = node.data.flowingData.value < 0 ? '-' : '';
		if (node.data.flowingData.flowing) {
			let out = { value: node.data.flowingData.value, mutated: `${isConst ? sign + node.data.title || sign + node.name : node.data.flowingData.value || 0}` }
			node.data.value = out.value;
			node.data.flowingData.mutated = out.mutated;
			node.data.flowingData.id = node.id;
			outputs["flowingData"] = node.data.flowingData;
		}
	}
}
