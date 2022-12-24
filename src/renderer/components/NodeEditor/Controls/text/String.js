import Rete from 'rete';
import _StringPreview from './StringPreview.vue'

export class StringPreview extends Rete.Control {
	constructor(name,emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = _StringPreview;
		this.props = {name, emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}