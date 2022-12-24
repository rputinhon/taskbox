import Rete from 'rete';
import _ExternalInput from './ExternalInput.vue'

export class ExternalInput extends Rete.Control {
	constructor(name,emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = _ExternalInput;
		this.props = {name, emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}