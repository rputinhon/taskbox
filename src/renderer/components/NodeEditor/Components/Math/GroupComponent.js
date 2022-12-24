import Rete from 'rete';
import OptionNode_Default from "./OptionNode_Default.vue"
import { mathsocket } from '../index';


export default class FormulaComponent extends Rete.Component {
    constructor(args) {
		super("Group");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = OptionNode_Default;
	}

	builder(node) {
		node.meta = this.type.meta;
		if(!node.data)
        node.data=this.type.data;
		var inp1 = new Rete.Input("in", "", mathsocket,true);
		var out = new Rete.Output("flowingData", "", mathsocket);

		return node
			.addInput(inp1)
			.addOutput(out);
	}

	worker(node, inputs, outputs) {
        let groupTypes = ['(.)','{.}','[.]'];
        let groupSymbol = groupTypes[node.data.flowingData].split('.');
        let formula = `${groupSymbol[0]}${inputs.in[0][1] || ''}${groupSymbol[1]}`;

		if(node.data.flowingData.flowing){
		outputs["flowingData"] = [inputs.in[0][0],formula];
        }
	}
}

