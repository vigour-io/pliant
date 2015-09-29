var core = require('./core')
var Obs = require('./observable')

module.exports = exports = function (config, fn, observable) {
  return function (params) {
    if (!params) {
      params = {}
    }

    var def = {}
    var env = {}

    var files = core.prep(config, def, env, params)
    return core.readConfigFiles(files)
      .then(function (fileConfig) {
        var opt = new Obs(def)
        opt.set(fileConfig.convert({ plain: true }))
        opt.set(env)
        opt.set(params)
        return fn(observable ? opt : opt.convert({ plain: true }))
      })
  }
}
