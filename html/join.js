/*
 *  lib/html/join.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")

const _join = parts => parts.map(part => `<${part.tag}${part.inner}>${part.remainder}`).join("");

/**
 */
const join = _.promise(self => {
    _.promise.validate(self, join)

    self.document = _join(self.parts)
})

join.method = "lib.html.join"
join.description = ``
join.requires = {
    parts: _.is.Array,
}
join.accepts = {
}
join.produces = {
    document: _.is.String,
}

/**
 */
exports.join = join
exports.join.join = _join
