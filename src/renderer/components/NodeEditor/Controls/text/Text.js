import Rete from 'rete';
import _textControl from './TextControl.vue'

export class TextControl extends Rete.Control {
	constructor(name,emitter, key, readonly = false) {
		super(key);
		this.render = "vue";
		this.component = _textControl;
		this.props = {name, emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}