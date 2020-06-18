/*
 *  lib/html/split.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")
const assert = require("assert")

/**
 */
const split = _.promise(self => {
    _.promise.validate(self, split)

    let level = 0
    let reg = /<([\/a-zA-Z0-9]+)([^>]*)>([^<]*)/mg
    let result

    self.parts = []

    while ((result = reg.exec(self.document)) !== null) {
        const tag = result[1]
        const inner = result[2]
        const remainder = result[3]

        let part
        if (tag.startsWith("/")) {
            level--

            part = {
                type: "end",
                level: level,
                tag: tag,
                inner: inner,
                remainder: remainder,
            }
        } else if (inner.endsWith("/")) {
            part = {
                type: "uni",
                level: level,
                tag: tag,
                inner: inner,
                remainder: remainder,
            }
        } else {
            part = {
                type: "start",
                level: level,
                tag: tag,
                inner: inner,
                remainder: remainder,
            }

            level++
        }

        self.parts.push(part)
    }

    if (level !== 0) {
        console.log("###")
        self.parts.forEach(part => console.log("#", part.tag, part.level, part.type))
        console.log("###")
    }
    assert.ok(level === 0)
})

split.method = "lib.html.split"
split.description = ``
split.requires = {
    document: _.is.String,
}
split.accepts = {
}
split.produces = {
    parts: _.is.Array,
}

/**
 */
exports.split = split
