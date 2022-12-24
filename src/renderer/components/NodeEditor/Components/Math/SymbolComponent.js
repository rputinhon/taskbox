import Rete from 'rete';
import OptionNode_Default from "./OptionNode_Default.vue"
import { mathsocket } from '../index';


export default class SymbolComponent extends Rete.Component {
    constructor(args) {
		super("Symbol");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = OptionNode_Default;
	}

	builder(node) {
		node.meta = this.type.meta;
		if (!node.data)
			node.data= this.type.data;
		let inp1 = new Rete.Input("a", "", mathsocket);
        let inp2 = new Rete.Input("b", "", mathsocket);
		let out = new Rete.Output("flowingData", "", mathsocket);

		return node
			.addInput(inp1)
            .addInput(inp2)
			.addOutput(out);
	}

	worker(node, inputs, outputs) {
        let in1 = inputs["a"].length && inputs["a"][0]; 
        let in2 = inputs["b"].length && inputs["b"][0]; 
        let formula = `{${(in1 && in1[1]) || in2[0]}} ${this.type.meta.options[node.data.selected].tex} {${(in2 && in2[1]) || in1[0]}}`;
		if (node.data.flowingData.flowing)
			outputs["flowingData"] = [in1[0],formula];
	}
}
