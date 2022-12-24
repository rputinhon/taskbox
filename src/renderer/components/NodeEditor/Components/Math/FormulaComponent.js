import Rete from 'rete';
import IconWithValueNode_Default from "./IconWithValueNode_Default.vue"
import { mathsocket } from '../index';

import { StringPreview } from '../../Controls/text/String';

export default class FormulaComponent extends Rete.Component {
    constructor(args) {
		super("Formula");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = IconWithValueNode_Default;
	}

	getExternalInputData(node, key) {

		let input = this.emitter.inputs.find(einput => einput.data.exposedTo[node.id] && einput.data.exposedTo[node.id].includes(key))

		let _node = this.emitter.nodes.find(n => n.id == node.id);
		if (input) {
			_node && _node.vueContext.updateExternalInput(input, key)
			return input.data.flowingData;
		}
		else{
			// _node && _node.vueContext.removeExternalInput(key)
			return undefined;
		}


	}
	getInput(node, key) {

		let exposed = node.inputs[key].connections[0].data.exposed;
		if (exposed && exposed.length > 0) {

			let taskboxId = node.inputs[key].connections[0].node;
			let taskbox = this.emitter.nodes
				.find(n => n.id == taskboxId);
			let _node = Object.values(taskbox.data.nodes).find(n => n.id == exposed[0].id);
			return _node.data.flowingData;
		}
		else return undefined;
	}

	builder(node) {
		node.meta = this.type.meta;
		if(!node.data)
        node.data=this.type.data;
		var inp1 = new Rete.Input("a", "", mathsocket);
		var out = new Rete.Output("flowingData", "", mathsocket);

		return node
			.addInput(inp1)
            .addControl(new StringPreview(node.name,this.emitter, "flowingData", true))
			.addOutput(out);
	}

	worker(node, inputs, outputs) {

		let in1 = inputs["a"].length ? this.getInput(node, 'a') || inputs['a'][0] : this.getExternalInputData(node, 'a');
		
        let formula = in1?`${in1.mutated}`:'no formula';
        this.emitter.nodes
			.find(n => n.id == node.id)
			.controls.get("flowingData")
			.setValue(`$$${formula}$$`);

		if(node.data.flowingData.flowing){
			// ((a + b) \cdot (a + b) \over c)
            // x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}
			let out = {value:in1 && in1.value,mutated:formula}
			node.data.flowingData.mutated=formula;
			outputs["flowingData"] = out;
        }
	}
}

