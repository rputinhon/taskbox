import Rete from 'rete';
import { textsocket } from '..';

import TextNode_Default from "./TextNode_Default.vue"


export default class extends Rete.Component {
	constructor(args) {
        super("Text");
        this.type = args.type;
        this.data.component = TextNode_Default; // Vue.js component, not required
    }

    builder(node) {
        node.meta = this.type.meta;
        if(!node.data.title)
        node.data.title=this.type.data.title;
        // var in1 = new Rete.Input("in", "", anysocket, true);
        var out1 = new Rete.Output("flowingData", "", textsocket);
        return node
            // .addInput(in1)
            .addOutput(out1);
    }

    async worker(node, inputs, outputs) {
        if (node.data.task.flowing) {
            outputs["flowingData"] = node.data.flowingData?node.data.flowingData.file : '';
        }
    }
}
