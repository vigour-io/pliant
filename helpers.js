module.exports = exports = {}

exports.resolveGetter = function (str) {
    var match
    var curr
    var i
    var val
    match = str.match(/--[a-zA-Z0-9]+(-[a-zA-Z][a-zA-Z0-9]*)*/)
    val = match[0].slice(2)
    if (val.indexOf("no-") === 0) {
        val = val.slice(3)
    }
    match = val.match(/-([a-zA-Z])/g)
    if (match) {
        i = 0
        while (curr = match[i++]) {
            val = val.replace(curr, curr.slice(1).toUpperCase())
        }
    }
    return val
}