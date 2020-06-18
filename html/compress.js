/*
 *  lib/html/compress.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const compress = _.promise(self => {
    _.promise.validate(self, compress)

    self.parts.forEach(part => {
        part.remainder = part.remainder
            .replace(/\s+/gm, " ")
    })
})

compress.method = "lib.html.compress"
compress.description = ``
compress.requires = {
    parts: _.is.Array,
}
compress.accepts = {
}
compress.produces = {
    parts: _.is.Array,
}

/**
 */
exports.compress = compress
