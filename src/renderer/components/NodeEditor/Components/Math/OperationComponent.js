import Rete from 'rete';
import MathNode_Default from "./MathNode_Default.vue"
import { mathsocket } from '../index';
import { StringPreview } from '../../Controls/text/String';
// import { NodeView } from '../../../../libs/nodeview';


export default class OperationComponent extends Rete.Component {

	constructor(args) {
		super("Operation");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = MathNode_Default;
	}

	getExternalInputData(node, key) {

		let input = this.emitter.inputs.find(einput => einput.data.flowingData.connections.find(c => c && (c.node == node.id && c.key == key)))

		if (input) {

			if (input.data.flowingData.flowing && input.data.flowingData.parentflowing) {

				let data = input.data;
				let conn = data.flowingData.connections.find(c => c && (c.node == node.id && c.key == key)).data;

				if (conn)
					data = input.data.nodes.find(n => n.id == conn).data;

				return data.flowingData;
			}
			else
				return undefined
		}
		else
			return undefined;

	}

	getInput(node, key) {

		let exposed = node.inputs[key].connections[0].data.exposed;
		if (exposed && exposed.length > 0) {
			if (node.inputs[key].connections[0].data.flowingData.flowing && node.inputs[key].connections[0].data.flowingData.parentflowing) {
				let taskboxId = node.inputs[key].connections[0].node;
				let taskbox = this.emitter.nodes
					.find(n => n.id == taskboxId);
				let _node = Object.values(taskbox.data.nodes).find(n => n.id == exposed[0].id);
				return _node.data.flowingData;
			}
		}

	}

	builder(node) {
		node.meta = this.type.meta;
		node.properties = this.type.properties;
		if (!node.data)
			node.data = this.type.data;

		let inp1 = new Rete.Input("a", "", mathsocket);
		let inp2 = new Rete.Input("b", "", mathsocket);
		let out = new Rete.Output("flowingData", "", mathsocket);

		return node
			.addInput(inp1)
			.addInput(inp2)
			.addControl(new StringPreview(node.name, this.emitter, "flowingData", true))
			.addOutput(out);
	}


	async worker(node, inputs, outputs) {
		// // console.lognode,inputs);

		let in1 = inputs["a"].length ? this.getInput(node, 'a') || inputs['a'][0] : this.getExternalInputData(node, 'a');
		let in2 = inputs["b"].length ? this.getInput(node, 'b') || inputs['b'][0] : this.getExternalInputData(node, 'b');
		let symboltex = ''

		if (this.type.meta.options[node.data.selected].tex)
			symboltex = this.type.meta.options[node.data.selected].tex[node.data.textype || 0];

		let Operation = Operations[this.type.meta.options[node.data.selected || 0].name](in1, in2, symboltex);

		this.emitter.nodes
			.find(n => n.id == node.id)
			.controls.get("flowingData")
			.setValue(Operation.value);

		if (node.data.flowingData.flowing) {
			node.data.flowingData.value = Operation.value;
			node.data.flowingData.mutated = Operation.mutated;

			outputs["flowingData"] = node.data.flowingData;
		}
	}
}

let Operations = {
	'add': function (in1, in2) {
		let n1 = in1 ? in1.value || 0 : 0;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: n1 + n2, mutated: `${in1 && in1.mutated || 0} + ${in2 && in2.mutated || 0}` };
	},
	'subtract': function (in1, in2) {
		let n1 = in1 ? in1.value || 0 : 0;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: n1 - n2, mutated: `${in1 && in1.mutated || 0} - ${in2 && in2.mutated || 0}` };
	},
	'multiply': function (in1, in2, symbol) {
		let n1 = in1 ? in1.value || 0 : 0;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: n1 * n2, mutated: `${in1 && in1.mutated || 0} ${symbol} ${in2 && in2.mutated || 0}` };
	},
	'divide': function (in1, in2) {
		let n1 = in1 ? in1.value || 0 : 0;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: n2 != 1 ? n1 / n2 : 1, mutated: `${in1 && in1.mutated || 1} \\over ${in2 && in2.mutated || 1}` };
		// return { result: n2 != 1 ? n1 / n2 : 1, formula: `${in1 ? in1[1] : 1} \\over ${in2 ? in2[1] : 1}` };
	},
	'root': function (in1, in2) {
		let n1 = in1 ? in1.value || 2 : 2;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: Math.sqrt(n2), mutated: `\\sqrt[${n1 || ''}]{${in2 && in2.mutated}}` };
	},
	'powerto': function (in1, in2) {
		let n1 = in1 ? in1.value || 2 : 2;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: Math.pow(n2, n1), mutated: `${in2 && in2.mutated}^{${in1 && in1.mutated}}` };
	},
	'log': function (in1, in2) {
		let n1 = in1 ? in1.value || 2 : 2;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: Math.log(n2) / Math.log(n1), mutated: `\\log_{${in2 && in2.mutated}}{${in1 && in1.mutated}}` };
	},
	'percent': function (in1, in2) {
		let n1 = in1 ? in1.value || 0 : 0;
		let n2 = in2 ? in2.value || 0 : 0;
		return { value: n2 * (n1 / 100), mutated: `${in2 && in2.mutated}%` };
	},
	'invert': function (in1) {
		let n1 = in1 ? in1.value || 0 : 0;
		let result = n1 * (-1);
		return { value: result, formula: `${result < 0 ? '-' : ''}{${in1 && in1.mutated}}` };
	},
}

