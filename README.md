pliant
=======

```javascript
def → files → env → (cli | params) → fun (opt) { YOUR_CODE_HERE }
```



# Usage
Let's walk through an example. To see the full example code, see the example project [vigour-io/pliable](https://github.com/vigour-io/pliable)
## 1. Create a configuration file to list the options our script may use

[**config.js**](https://github.com/vigour-io/pliable/blob/master/config.js)
```js
var path = require('path')
var version = require('./package.json').version
module.exports = exports = {}

exports.version = version

/**
 * Give each option (item)
 * - `def`: a defaut value
 * - `env`: a name for its environment variable
 * - `cli`: a [commander option argument](https://www.npmjs.com/package/commander#option-parsing)
 * - `desc`: a description
 */
exports.items =
{ "server.port":
	{ def: 8000
	, env: "MY_SCRIPT_PORT"
	, cli: "-p, --port <port>"
	, desc: "Port on which server should listen for HTTP requests"
	}
, "server.gzip":
	{ def: true
	, env: "MY_SCRIPT_GZIP"
	, cli: "--no-gzip"
	, desc: "Whether to gzip resources"
	}
}

/**
 * We can also provide a default value and environment variable name for the files option
 * `{ cli: "-c, --files <paths>", desc: "Comma-separated list of paths to config files" }`
 */
exports.files =
{ def: null
,	env: "MY_APP_CONFIG_FILES"
}
```

## 2. Adhere to the pliant contract
We'll make the point of entry of our script a function which expects a single options argument

[**main.js**](https://github.com/vigour-io/pliable/blob/master/main.js)
```js
// Let's make a web server as an example
var express = require('express')
var compression = require('compression')
// Our main script should export a function expecting a single options argument
module.exports = exports = function (opts) {
	// This will be a simple web server
	var app = express()
	// Which may be configured not to gzip, but gzips by default
	if (opts.server.gzip) {
		app.use(compression())
	} else {
		console.warn("gzip deactivated")
	}
	// And which otherwise simply serves static files
	app.use(express.static('public'))
	// Let's have this server listen on the configured port
	var handle = app.listen(opts.server.port)
	console.log("Listening on port", opts.server.port)
	return handle
}
```

This sample script is a web server. For the sake of completeness, let's include an asset for it to serve:

[**public/index.html**](https://github.com/vigour-io/pliable/blob/master/public/index.html)
```html
<!DOCTYPE html>
<html>
	<body>
		<h1>I just got served</h1>
	</body>
</html>
```

## 3. Create a requireable module
We just have to pass our function and the config object to `pliant.fn`

[**index.js**](https://github.com/vigour-io/pliable/blob/master/index.js)
```js
var pliant = require('pliant')
	, main = require('./main.js')
	, config = require('./config.js')

module.exports = exports = pliant.fn(main, config)
```

## 4. Create an executable
We just have to specify `node` as the script runner and pass our function and the config object to `pliant.bin`

[**bin/index.js**](https://github.com/vigour-io/pliable/blob/master/bin/index.js)
```js
#!/usr/bin/env node
var pliant = require('pliant')
	, config = require("../config")
	, main = require('../main')

pliant.bin(main, config)
```

## 5. Now we can run our script and provide it with options in a variety of ways.

### We can require it and pass it an options object

[**test.js**](https://github.com/vigour-io/pliable/blob/master/test.js)
```js
var http = require('http')
var start = require('./index.js')

// We'll use the default port, but turn off gzipping
start({ server : { gzip: false } })
	.then(function (handle) {
		// Let's make a request on the default port to see if it works
		var req = http.request({ port: 8000 }
			, function (res) {
				if (res.statusCode === 200) {
					console.log("SUCCESS")
				} else {
					console.error("FAILURE")
				}
				// The return value of the script -the server handle, in this case- is available
				handle.close()
			})
		req.end()
	})
```

_Try it out_
```shell
$ node test.js
gzip deactivated
Listening on port 8000
SUCCESS
$
```

### We can call our executable from the command line and configure it via command line arguments
```shell
$ ./bin/index.js -p 8001
Listening on port 8001

```

### We can pass it a list of files to read configuration from.
`package.json` looks like a good candidate

[**package.json**](https://github.com/vigour-io/pliable/blob/master/package.json)
```json
{
  "version": "1.0.1",
  "main": "index.js",
  "bin": {
    "pliable": "bin/index.js"
  },
  "dependencies": {
    "compression": "^1.5.2",
    "express": "^4.13.2",
    "pliant": "git+ssh:git@github.com/vigour-io/pliant.git"
  },
  "scripts": {
    "start": "./bin/index.js -p 8001 --no-gzip",
    "test": "node test.js"
  },
  "server": {
    "port": 8004
  }
}

```
_Try it out_
```bash
$ ./bin/index.js -c package.json
Listening on port 8004

```

### We can configure it via environment variables
```bash
$ export MY_SCRIPT_GZIP=false
$ export MY_SCRIPT_PORT=8002
$ ./bin/index.js
gzip deactivated
Listening on port 8002

```

### Priority: defaults < files < environment variables < command line arguments
Let's look at the port, for example:

- Default value is 8000 (from `config.js`)
- File config makes it 8004 (from `package.json`)
- The environment makes it 8002 (from `MY_SCRIPT_PORT`)
- The `-p` command line argument can override all of the above

```bash
$ export MY_SCRIPT_GZIP=false
$ export MY_SCRIPT_PORT=8002
$ ./bin/index.js -p 8005
gzip deactivated
Listening on port 8005

```

## 6. Feedback
I'm looking for feedback on this project, feel free to open issues :)
