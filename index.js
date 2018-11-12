const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

const CODES = {
	// modifiers
	reset: [0, 0],
	bold: [1, 22],
	dim: [2, 22],
	italic: [3, 23],
	underline: [4, 24],
	inverse: [7, 27],
	hidden: [8, 28],
	strikethrough: [9, 29],

	// colors
	black: [30, 39],
	red: [31, 39],
	green: [32, 39],
	yellow: [33, 39],
	blue: [34, 39],
	magenta: [35, 39],
	cyan: [36, 39],
	white: [37, 39],
	gray: [90, 39],

	// background colors
	bgBlack: [40, 49],
	bgRed: [41, 49],
	bgGreen: [42, 49],
	bgYellow: [43, 49],
	bgBlue: [44, 49],
	bgMagenta: [45, 49],
	bgCyan: [46, 49],
	bgWhite: [47, 49]
};

let $ = {
	enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0'
};

function link(key, txt) {
	let str = txt == null ? '' : txt+'';
	this.keys.includes(key) || this.keys.push(key);
	return $.enabled && str ? run(this.keys, str) : str || this;
}

function chain(key) {
	let k, ctx={ keys:[key] };
	for (k in CODES) {
		ctx[k] = link.bind(ctx, k);
	}
	return ctx;
}

function run(arr, str) {
	let i=0, tmp;
	for (; i < arr.length;) {
		tmp = CODES[ arr[i++] ];
		str = tmp.open + str.replace(tmp.rgx, tmp.open) + tmp.close;
	}
	return str;
}

for (let key in CODES) {
	CODES[key] = {
		open: `\x1b[${CODES[key][0]}m`,
		close: `\x1b[${CODES[key][1]}m`,
		rgx: new RegExp(`\\x1b\\[${CODES[key][1]}m`, 'g')
	};

	$[key] = txt => {
		let str = txt == null ? '' : txt+'';
		return $.enabled && str ? run([key], str) : str || chain(key);
	};
}

module.exports = $;
