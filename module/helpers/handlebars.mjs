export default function registerHandlebarsHelpers() {
	/* -------------------------------------------- */
	/*  GENERAL HELPERS                             */
	/* -------------------------------------------- */
	Handlebars.registerHelper("concat", function() {
		let outStr = "";
		for (let arg in arguments) {
			if (typeof arguments[arg] != "object") {
				outStr += arguments[arg];
			}
		}
		return outStr;
	});

	Handlebars.registerHelper("toLowerCase", function(str) {
		return str.toLowerCase();
	});

	Handlebars.registerHelper("toUpperCase", function(str) {
		return str.toUpperCase();
	});

	Handlebars.registerHelper("subString", function(str, s, e) {
		return str.substring(s, e);
	});

	Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
		switch (operator) {
			case "==":
				// eslint-disable-next-line eqeqeq
				return v1 == v2 ? options.fn(this) : options.inverse(this);
			case "===":
				return v1 === v2 ? options.fn(this) : options.inverse(this);
			case "!=":
				// eslint-disable-next-line eqeqeq
				return v1 != v2 ? options.fn(this) : options.inverse(this);
			case "!==":
				return v1 !== v2 ? options.fn(this) : options.inverse(this);
			case "<":
				return v1 < v2 ? options.fn(this) : options.inverse(this);
			case "<=":
				return v1 <= v2 ? options.fn(this) : options.inverse(this);
			case ">":
				return v1 > v2 ? options.fn(this) : options.inverse(this);
			case ">=":
				return v1 >= v2 ? options.fn(this) : options.inverse(this);
			case "&&":
				return v1 && v2 ? options.fn(this) : options.inverse(this);
			case "||":
				return v1 || v2 ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	});

	Handlebars.registerHelper("math", function(
		lvalue,
		operator,
		rvalue,
		options
	) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);
		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue,
		}[operator];
	});
}
