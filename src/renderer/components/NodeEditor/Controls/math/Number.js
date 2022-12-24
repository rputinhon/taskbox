import Rete from 'rete';
import NumberControl from './NumberControl.vue'

export class NumControl extends Rete.Control {
	constructor(emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = NumberControl;
		this.props = { emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}