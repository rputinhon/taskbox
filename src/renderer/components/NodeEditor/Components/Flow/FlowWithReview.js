import Rete from 'rete';
// import { ReviewFlow } from '../../Controls/flow/ReviewFlow';
import FlowReview from "./FlowReview.vue"

import { anysocket } from '../index';

export default class extends Rete.Component {
	constructor(args) {
		super("Review Flow");
		this.type = args.type;
		this.meta = args.meta;
		this.emitter = args.emitter;
		this.data.component = FlowReview;
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
			// .addControl(new ReviewFlow(this.emitter, "flowingData"))
			.addOutput(out1);
	}

	worker(node, inputs, outputs) {

        let out = inputs['a'][0];
        
        // if (node.inputs['a'].connections.length>0) {
        //     let _input = this.emitter.nodes
        //     .find(n => n.id == node.inputs['a'].connections[0].node);
		// 	if(_input && out)
        //     Object.assign(out,{name: _input.name,title:_input.data.title, task: _input.data.task});   
			
		// }
		// this.emitter.nodes
		// 	.find(n => n.id == node.id)
		// 	.controls.get("flowingData")
		// 	.setValue(out);

		if(node.data.flowingData.flowing){
			// if(out)
			// out.flowing=node.data.flowingData.flowing;

			outputs["flowingData"] = out;
		}

	}
}
