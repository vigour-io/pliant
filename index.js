var path = require('path')
var log = require('npmlog')
var program = require('commander')
var Promise = require('promise')
var VObj = require('vigour-js/object')
var fs = require('vigour-fs')
var readJSON = Promise.denodeify(fs.readJSON)
var helpers = require('./helpers')

module.exports = exports = {}

exports.fn = function (fn, config) {
  return function (options) {
    var defaults = {}
    var env = {}
    var files
    var opts = new VObj({})
    // console.log("OPTS", options)
    if (!options) {
      options = {}
    }
    files = configure(config, defaults, env, void 0, options)
    return reduceFiles(files)
      .then(function (fileConf) {
        opts.merge(defaults)
        opts.merge(fileConf)
        opts.merge(env)
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
  var defaults = {}
  var env = {}
  var cli = {}
  var files
  var opts = new VObj({})
  var key
  var entry
  var getter
  var value

  program
    .usage('[options]')

  files = configure(config, defaults, env, cli)

  program.parse(process.argv)

  for (key in config.items) {
    entry = config.items[key].cli
    if (entry) {
      getter = helpers.resolveGetter(entry)
      value = program[getter]
      if (entry.indexOf('--no-') === 0) {
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
  reduceFiles(files)
    .then(function (fileConf) {
      opts.merge(defaults)
      opts.merge(fileConf)
      opts.merge(env)
      opts.merge(cli)
      return opts.raw
    })
    .then(factory(fn))
}

function configure (config, defaults, env, cli, options) {
  var key
  var entry
  var value
  var files
  if (cli && config.version) {
    program.version(config.version)
  }
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
          if (value === 'false') {
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
      if (process.env[config.files.env]) {
        files = process.env[config.files.env]
      }
    }
    if (options && options.configFiles) {
      files = options.configFiles
    }
  }
  if (cli) {
    program.option('-c, --files <paths>', 'Comma-separated list of paths to config files' +
      '\n\tconfig priority: defaults > *files* > env > cli')
  }
  return files
}

function reduceFiles (files) {
  files = (files)
    ? ((files.split) ? files.split(',') : files)
    : []
  return files.reduce(function (prev, curr, indx, arry) {
    return prev.then(function (res) {
      var filePath = path.isAbsolute(curr)
        ? curr
        : path.join(process.cwd(), curr)
      return (readJSON(filePath)
        .catch(function (reason) {
          log.error('The following config file cannot be read or parsed:', curr)
          throw reason
        })
        .then(function (obj) {
          res.merge(obj)
          return res
        })
      )
    })
  }, Promise.resolve(new VObj({})))
    .then(function (res) {
      return res.raw
    })
    .catch(function (reason) {
      log.error('Oops', reason, reason.stack)
    })
}

function set (obj, key, val) {
  var parts = key.split('.')
  var l = parts.length
  var i
  var ref = obj
  for (i = 0; i < l - 1; i += 1) {
    if (!ref[parts[i]]) {
      ref[parts[i]] = {}
    }
    ref = ref[parts[i]]
  }
  ref[parts[i]] = val
}
