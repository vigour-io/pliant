var path = require('path')
var program = require('commander')
var Promise = require('promise')
var VObj = require('vigour-js/object')
var fs = require('vigour-fs')
var readJSON = Promise.denodeify(fs.readJSON)
var helpers = require('./helpers')
var defaults = {}
var files
var opts = new VObj({})

module.exports = exports = {}

exports.fn = function (fn, config) {
	configure(config)
	return function (options) {
		if (!options) {
			options = {}
		}
		return reduceFiles()
			.then(function (fileConf) {
				opts.merge(defaults)
				opts.merge(fileConf)
				opts.merge(options)
				return opts.raw
			})
			.then(factory(fn))
	}
}

function factory (fn) {
	return function (opts) {
		// console.log("Options", JSON.stringify(opts, null, 2))
		return fn(opts)
	}
}

exports.bin = function (fn, config) {
	var env = {}
	var cli = {}
	var key
	var entry
	var getter
	var value

	program.version("1.0.0") // TODO
		.usage("[options]")

	configure(config, env, cli)

	program.parse(process.argv)

	for (key in config.items) {
		entry = config.items[key].cli
		if (entry) {
			getter = helpers.resolveGetter(entry)
			value = program[getter]
			if (entry.indexOf("--no-") === 0) {
				if (!value) {
					set(cli, key, value)
				}
			} else {
				if (value) {
					set(cli, key, value)
				}
			}
		}
	}
	if (program.files) {
		files = program.files
	}
	reduceFiles()
		.then(function (fileConf) {
			opts.merge(defaults)
			opts.merge(fileConf)
			opts.merge(env)
			opts.merge(cli)
			return opts.raw
		})
		.then(factory(fn))
}

function reduceFiles () {
	files = (files)
		? ((files.slit) ? files.split(",") : files)
		: []
	return files.reduce(function (prev, curr, indx, arry) {
		return prev.then(function (res) {
			return (readJSON(path.isAbsolute(curr)
					? curr
					: path.join(process.cwd(), curr))
				.then(function (obj) {
					res.merge(obj)
					return res
				}
				, function (reason) {
					log.warn("Can't read file", curr)
					return res
				})
				.catch(function (reason) {
					reason.filePath = curr
					log.error("Can't parse or merge", curr)
				})
			)
		})
	}, Promise.resolve(new VObj({})))
		.then(function (res) {
			return res.raw
		})
		.catch(function (reason) {
			log.error("Oops", reason, reason.stack)
		})
}

function configure (config, env, cli) {
	var key
	var entry
	var value
	for (key in config.items) {
		entry = config.items[key].def
		if (entry) {
			set(defaults, key, entry)
		}

		if (env) {
			entry = config.items[key].env
			if (entry) {
				value = process.env[entry]
				if (value) {
					if (value === "false") {
						value = false
					}
					set(env, key, value)
				}
			}
		}

		if (cli) {
			entry = config.items[key].cli
			if (entry) {
				program.option(entry, config.items[key].desc)
			}
		}
	}
	if (config.files) {
		if (config.files.def) {
			files = config.files.def
		}
		if (config.files.env) {
			if (process.env[config.files.env])
			files = process.env[config.files.env]
		}
	}
	if (cli) {
		program.option("-c, --files <paths>", "Comma-separated list of paths to config files\
			config priority: defaults > *files* > env > cli")
	}
}

function set (obj, key, val, tag) {
	var parts = key.split(".")
		, l = parts.length
		, i
		, ref = obj
	if (tag) {
		tags[key] = tag
	}	
	for (i = 0; i < l - 1; i += 1) {
		if (!ref[parts[i]]) {
			ref[parts[i]] = {}
		}
		ref = ref[parts[i]]
	}
	ref[parts[i]] = val
}