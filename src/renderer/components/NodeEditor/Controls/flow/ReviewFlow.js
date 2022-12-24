import Rete from 'rete';
import ReviewFlowControl from './ReviewFlow.vue';

export class ReviewFlow extends Rete.Control {
	constructor(emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = ReviewFlowControl;
		this.props = { emitter, ikey: key, readonly };
	}

	setValue(val) {
        // console.log(val);
		this.vueContext.data = val;
	}
}