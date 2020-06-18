/*
 *  lib/html/tag.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const tag = _.promise(self => {
    _.promise.validate(self, tag)

    const levels = []

    self.parts.forEach(part => {
        while (levels.length <= (part.level + 1)) {
            levels.push(0)
        }

        switch (part.type) {
        case "end":
            levels[part.level + 1] = 0
            break

        case "uni":
        case "start":
            if (part.inner.match(/\btag\b/)) {
                levels[part.level] += 1
                part.code = levels.slice(0, part.level + 1).join(".")
                part.inner = part.inner.replace(/\btag\b/, `tag="${part.code}"`)
            }
            break
        }
    })
})

tag.method = "lib.html.tag"
tag.description = ``
tag.requires = {
    parts: _.is.Array,
}
tag.accepts = {
}
tag.produces = {
    parts: _.is.Array,
}

/**
 */
exports.tag = tag
