/* global describe, it, expect, before, afterEach */
var program = require('commander')
var cloneDeep = require('lodash/lang/cloneDeep')
var argv = cloneDeep(process.argv)
var env = cloneDeep(process.env)
var fn = require('../../lib/fn')
var bin = require('../../lib/bin')
var path = require('path')
var pkgPath = path.join(__dirname, '..', 'data', 'config.json')
var pkg = require(pkgPath)
var fileVal = pkg.vigour.plastic.surgeon
var defVal = 'Default'
var envVal = 'VIGOUR_PLASTIC_SURGEON'
var cliVal = '-s, --surgeon <name>'
var desVal = 'Name your Surgeon !! :D'
var speedEnv = 'VIGOUR_SPEED'
var speedCli = '--no-speed'
var speedDes = 'Uncomfortable? Use --no-speed to slow things down'
var cliArg = 'cliArg'
var config = {
  items: {
    'vigour.plastic.surgeon': {
      def: defVal,
      env: envVal,
      cli: cliVal,
      des: desVal
    },
    'vigour.speed': {
      def: true,
      env: speedEnv,
      cli: speedCli,
      des: speedDes
    }
  }
}
var configWithFiles = cloneDeep(config)
configWithFiles.files = {
  def: pkgPath
}
var newEnv = 'Environment'
var newParam = 'Parameter'

function resetEverything () {
  process.argv = cloneDeep(argv)
  process.env[envVal] = ''
  process.env[speedEnv] = ''
  program.surgeon = void 0
  program.speed = true
}

describe('fn', function () {
  before(resetEverything)
  afterEach(resetEverything)
  describe('observable', function () {
    it('should call function'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts).to.exist
      }, true)
      return main()
    })

    it('should provide defaults'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(defVal)
        expect(opts.vigour.speed.$val).to.equal(true)
      }, true)
      return main()
    })

    it('files override defaults'
    , function () {
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(fileVal)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
      return main()
    })

    it('environment variables override defaults'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newEnv)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
      return main()
    })

    it('environment variables override files'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newEnv)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
      return main()
    })

    it('parameters override defaults'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newParam)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: false
        }
      })
    })

    it('parameters override environment variables'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newParam)
        expect(opts.vigour.speed.$val).to.equal(true)
      }, true)

      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: true
        }
      })
    })

    it('parameters override files'
    , function () {
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newParam)
        expect(opts.vigour.speed.$val).to.equal(true)
      }, true)

      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: true
        }
      })
    })
  })

  describe('normal', function () {
    it('should call function'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts).to.exist
      })
      return main()
    })

    it('should provide defaults'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(defVal)
        expect(opts.vigour.speed).to.equal(true)
      })
      return main()
    })

    it('files override defaults'
    , function () {
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(fileVal)
        expect(opts.vigour.speed).to.equal(false)
      })
      return main()
    })

    it('environment variables override defaults'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newEnv)
        expect(opts.vigour.speed).to.equal(false)
      })
      return main()
    })

    it('environment variables override files'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newEnv)
        expect(opts.vigour.speed).to.equal(false)
      })
      return main()
    })

    it('parameters override defaults'
    , function () {
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newParam)
        expect(opts.vigour.speed).to.equal(false)
      })
      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: false
        }
      })
    })

    it('parameters override environment variables'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      var main = fn(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newParam)
        expect(opts.vigour.speed).to.equal(true)
      })

      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: true
        }
      })
    })

    it('parameters override files'
    , function () {
      var main = fn(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newParam)
        expect(opts.vigour.speed).to.equal(true)
      })

      return main({
        vigour: {
          plastic: {
            surgeon: newParam
          },
          speed: true
        }
      })
    })
  })
})

describe('bin', function () {
  before(resetEverything)
  afterEach(resetEverything)
  describe('observable', function () {
    it('should call function'
    , function () {
      return bin(config, function (opts) {
        expect(opts).to.exist
      }, true)
    })

    it('should provide defaults'
    , function () {
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(defVal)
        expect(opts.vigour.speed.$val).to.equal(true)
      }, true)
    })

    it('files override defaults'
    , function () {
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(fileVal)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
    })

    it('environment variables override defaults'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newEnv)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
    })

    it('environment variables override files'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(newEnv)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
    })

    it('cli arguments override defaults'
    , function () {
      process.argv.push('--surgeon=' + cliArg)
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(cliArg)
        expect(opts.vigour.speed.$val).to.equal(true)
      }, true)
    })

    it('short cli arguments and `--no`-prefixed arguments work as expected'
    , function () {
      process.argv.push('-s', cliArg)
      process.argv.push('--no-speed')
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(cliArg)
        expect(opts.vigour.speed.$val).to.equal(false)
      }, true)
    })

    it('cli arguments override environment variables'
    , function () {
      process.env[envVal] = newEnv
      process.argv.push('-s', cliArg)
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(cliArg)
      }, true)
    })

    it('cli arguments override files'
    , function () {
      process.argv.push('-s', cliArg)
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon.$val).to.equal(cliArg)
      }, true)
    })
  })

  describe('normal', function () {
    it('should call function'
    , function () {
      return bin(config, function (opts) {
        expect(opts).to.exist
      })
    })

    it('should provide defaults'
    , function () {
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(defVal)
        expect(opts.vigour.speed).to.equal(true)
      })
    })

    it('files override defaults'
    , function () {
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(fileVal)
        expect(opts.vigour.speed).to.equal(false)
      })
    })

    it('environment variables override defaults'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newEnv)
        expect(opts.vigour.speed).to.equal(false)
      })
    })

    it('environment variables override files'
    , function () {
      process.env[envVal] = newEnv
      process.env[speedEnv] = 'false'
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(newEnv)
        expect(opts.vigour.speed).to.equal(false)
      })
    })

    it('cli arguments override defaults'
    , function () {
      process.argv.push('--surgeon=' + cliArg)
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(cliArg)
        expect(opts.vigour.speed).to.equal(true)
      })
    })

    it('short cli arguments and `--no`-prefixed arguments work as expected'
    , function () {
      process.argv.push('-s', cliArg)
      process.argv.push('--no-speed')
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(cliArg)
        expect(opts.vigour.speed).to.equal(false)
      })
    })

    it('cli arguments override environment variables'
    , function () {
      process.env[envVal] = newEnv
      process.argv.push('-s', cliArg)
      return bin(config, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(cliArg)
      })
    })

    it('cli arguments override files'
    , function () {
      process.argv.push('-s', cliArg)
      return bin(configWithFiles, function (opts) {
        expect(opts.vigour.plastic.surgeon).to.equal(cliArg)
      })
    })
  })
})
