/*
 *  lib/html/hash.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")

const crypto = require("crypto")

const _safe = v => v.replace(/=/g, "").replace(/\//g, '_').replace(/[+]/g, '-');

/**
 */
const hash = _.promise(self => {
    _.promise.validate(self, hash)

    // nothing has a parent or a hash
    self.parts.forEach(part => {
        part.parent = null
        part.hash = null
    })

    // identify closest parent
    self.parts.forEach((start, startx) => {
        if (!start.code) {
            return
        }

        let endx = startx
        for (; endx < self.parts.length; endx++) {
            const end = self.parts[endx]
            end.parent = start.code

            if (((end.type === "end") || (end.type === "uni")) && (end.level === start.level)) {
                break
            }
        }
    })

    // build hash summary
    self.hashed = {}

    // hash to the closest parent
    self.parts.forEach((start, startx) => {
        if (!start.code) {
            return
        }

        const hasher = crypto.createHash("md5")

        let endx = startx
        for (; endx < self.parts.length; endx++) {
            const end = self.parts[endx]

            // this tracks number of children
            hasher.update('\0') 

            if (end.parent === start.code) {
                hasher.update(end.tag)
                hasher.update(end.inner)
                hasher.update(end.remainder)
            }

            if (((end.type === "end") || (end.type === "uni")) && (end.level === start.level)) {
                break
            }
        }

        start.hash = _safe(hasher.digest("base64"))
        self.hashed[start.code] = start.hash
    })
})

hash.method = "lib.html.hash"
hash.description = ``
hash.requires = {
    parts: _.is.Array,
}
hash.accepts = {
}
hash.produces = {
    parts: _.is.Array,
    hashed: _.is.Dictionary,
}

/**
 */
exports.hash = hash
