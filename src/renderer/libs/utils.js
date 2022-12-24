
const parallel = require('run-parallel');
const path = require('path');

export function getMutatedNode(node) {
	return {
		'id': node.id,
		'name': node.name,
		'data': node.data,
		'inputs': reduceIO(node.inputs),
		'outputs': reduceIO(node.outputs),
		'position': node.position,
	};
}

export function hexToRgba(hex) {
	let c;
	if (/^([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split('');
		if (c.length == 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = '0x' + c.join('');
		return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.2)';
	}
	throw new Error('Bad hex')
}

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	} else {
		obj[key] = value;
	}

	return obj;
}

export function _objectSpread(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i] != null ? arguments[i] : {};
		var ownKeys = Object.keys(source);

		if (typeof Object.getOwnPropertySymbols === 'function') {
			ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
				return Object.getOwnPropertyDescriptor(source, sym).enumerable;
			}));
		}

		ownKeys.forEach(function (key) {
			_defineProperty(target, key, source[key]);
		});
	}

	return target;
}

export const findNodeById = (editor, id) => {
	const key = Object.keys(editor.nodes).find(node => editor.nodes[node].id === id)
	return editor.nodes[key]
}

export function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

export function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

		return arr2;
	}
}

function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
	if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
	var _arr = [];
	var _n = true;
	var _d = false;
	var _e = undefined;

	try {
		for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);

			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) console.error(_e);
		}
	}

	return _arr;
}

function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

export function arrayToKeyValue(array) {
	let obj = {};
	array.forEach((item) => {
		obj[item.id] = item
	})
	return obj;
}

export var reduceIO = function reduceIO(list) {
	return Array.from(list).reduce(function (obj, _ref) {
		var _ref2 = _slicedToArray(_ref, 2),
			key = _ref2[0],
			io = _ref2[1];

		obj[key] = io.toJSON();
		return obj;
	}, {});
};

export function isEventHandleable(event) {
	if (event.dataTransfer.items || event.dataTransfer.types) {
		// Only add "drag" class when `items` contains items that are able to be
		// handled by the registered listeners (files vs. text)
		const items = Array.from(event.dataTransfer.items)
		const types = Array.from(event.dataTransfer.types)

		let fileItems
		let textItems
		if (items.length) {
			fileItems = items.filter(item => { return item.kind === 'file' })
			textItems = items.filter(item => { return item.kind === 'string' })
		} else if (types.length) {
			// event.dataTransfer.items is empty during 'dragover' in Safari, so use
			// event.dataTransfer.types as a fallback
			fileItems = types.filter(item => item === 'Files')
			textItems = types.filter(item => item.startsWith('text/'))
		} else {
			return false
		}

		if (fileItems.length === 0 && textItems.length === 0) return false

		return true
	}
	return false
}

export function processItems(items, cb) {
	// Handle directories in Chrome using the proprietary FileSystem API
	items = Array.from(items).filter(item => {
		return item.kind === 'file'
	})

	if (items.length === 0) {
		cb(null, [], [])
	}

	parallel(items.map(item => {
		return cb => {
			processEntry(item.webkitGetAsEntry(), cb)
		}
	}), (err, results) => {
		// This catches permission errors with file:// in Chrome
		if (err) {
			cb(err)
			return
		}

		const entries = results.flat(Infinity)

		const files = entries.filter(item => {
			return item.isFile;
		})

		const directories = entries.filter(item => {
			return item.isDirectory
		})

		cb(null, files, directories)
	})
}

function processEntry(entry, cb) {
	let entries = []

	if (entry.isFile) {
		entry.file(file => {
			file.fullPath = entry.fullPath // preserve path for consumer
			file.isFile = true
			file.isDirectory = false
			file.extension = path.extname(file.name)
			cb(null, file)
		}, err => {
			cb(err)
		})
	} else if (entry.isDirectory) {
		const reader = entry.createReader()
		readEntries(reader)
	}

	function readEntries(reader) {
		reader.readEntries(currentEntries => {
			if (currentEntries.length > 0) {
				entries = entries.concat(Array.from(currentEntries))
				readEntries(reader) // continue reading entries until `readEntries` returns no more
			} else {
				doneEntries()
			}
		})
	}

	function doneEntries() {
		parallel(entries.map(entry => {
			return cb => {
				processEntry(entry, cb)
			}
		}), (err, results) => {
			if (err) {
				cb(err)
			} else {
				results.push({
					name: entry.name,
					path: entry.fullPath,
					isFile: false,
					isDirectory: true
				})
				cb(null, results)
			}
		})
	}
}
