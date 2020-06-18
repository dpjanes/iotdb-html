/*
 *  lib/html/tops.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const tops = _.promise(self => {
    _.promise.validate(self, tops)

    self.partss = []
    let parts

    self.parts.forEach(part => {
        if ((part.level === 0) && (part.type !== "end")) {
            parts = []
            self.partss.push(parts)
        }

        parts.push(part)
    })
})

tops.method = "lib.html.tops"
tops.description = ``
tops.requires = {
    parts: _.is.Array,
}
tops.accepts = {
}
tops.produces = {
    partss: _.is.Array,
}

/**
 */
exports.tops = tops
