import Rete from 'rete';
import ToggleControl from './ToggleFlow.vue';

export class ToggleFlow extends Rete.Control {
	constructor(emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = ToggleControl;
		this.props = { emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}