var path = require('path')
var Promise = require('promise')
var _set = require('lodash/object/set')
var fs = require('vigour-fs')
var readJSON = Promise.denodeify(fs.readJSON)
var Obs = require('./observable')

module.exports = exports = {}

exports.prep = function (config, def, env, params, cli, program) {
  var defVal
  var envName
  var envVal
  for (var key in config.items) {
    // default values
    defVal = config.items[key].def
    if (defVal) {
      _set(def, key, defVal)
    }

    // environment variables
    envName = config.items[key].env
    if (envName) {
      envVal = process.env[envName]
      if (envVal) {
        if (envVal === 'false') {
          envVal = false
        }
        _set(env, key, envVal)
      }
    }

    // cli arguments
    if (cli && config.items[key].cli) {
      program.option(config.items[key].cli, config.items[key].desc)
    }
  }

  var files
  if (config.files) {
    // ... defined in defaults
    if (config.files.def) {
      files = config.files.def
    }

    // ... defined in environment variables
    if (config.files.env) {
      if (process.env[config.files.env]) {
        files = process.env[config.files.env]
      }
    }
  }

  // ... defined in params
  if (params && params.configFiles) {
    files = params.configFiles
  }

  return files
}

exports.readConfigFiles = function (files) {
  if (!files) {
    files = []
  }
  // accept comma-separated strings
  if (typeof files === 'string') {
    files = files.split(',')
  }

  return files.reduce(function (prev, curr, indx, arry) {
    return prev.then(function (res) {
      var filePath = path.isAbsolute(curr)
        ? curr
        : path.join(process.cwd(), curr)
      return (readJSON(filePath)
        .then(function (obj) {
          res.set(obj)
          return res
        })
      )
    })
  }, Promise.resolve(new Obs({})))
}
