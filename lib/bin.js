var _set = require('lodash/object/set')
var Obs = require('./observable')
var core = require('./core')

module.exports = exports = function (config, fn, observable) {
  var program = require('commander')
  var def = {}
  var env = {}
  var cli = {}

  if (config.version) {
    program.version(config.version)
  }
  program
    .usage('[options]')
  program.option('-c, --files <paths>',
    'Comma-separated list of paths to config files' +
    '\n\tconfig priority: defaults > *files* > env > cli')

  var files = core.prep(config, def, env, null, cli, program)

  program.parse(process.argv)

  exports.parseCliArgs(config, cli, program)
  if (program.files) {
    files = program.files
  }

  return core.readConfigFiles(files)
    .then(function (fileConfig) {
      var opt = new Obs(def)
      // console.log('default', def)
      opt.set(fileConfig.convert({ plain: true }))
      opt.set(env)
      opt.set(cli)
      return fn((observable) ? opt : opt.convert({ plain: true }))
    })
}

exports.parseCliArgs = function (config, cli, program) {
  var entry
  var getter
  var value
  for (var key in config.items) {
    entry = config.items[key].cli
    if (entry) {
      getter = exports.resolveGetter(entry)
      value = program[getter]
      if (entry.indexOf('--no-') === 0) {
        if (!value) {
          _set(cli, key, value)
        }
      } else {
        if (value) {
          _set(cli, key, value)
        }
      }
    }
  }
}

exports.resolveGetter = function (str) {
  var match
  var curr
  var i
  var val
  match = str.match(/--[a-zA-Z0-9]+(-[a-zA-Z][a-zA-Z0-9]*)*/)
  val = match[0].slice(2)

  if (val.indexOf('no-') === 0) {
    val = val.slice(3)
  }
  match = val.match(/-([a-zA-Z])/g)
  if (match) {
    i = 0
    curr = match[i]
    while (curr) {
      val = val.replace(curr, curr.slice(1).toUpperCase())
      i += 1
      curr = match[i]
    }
  }
  return val
}
