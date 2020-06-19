/*
 *  lib/html/diff.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

const _ = require("iotdb-helpers")
const web = require("..")

/**
 */
const diff = _.promise((self, done) => {
    const _extract = code => {
        const results = []

        self.parts.forEach((start, startx) => {
            if (start.code !== code) {
                return
            }

            let endx = startx
            for (; endx < self.parts.length; endx++) {
                const end = self.parts[endx]
                results.push(end)

                if (((end.type === "end") || (end.type === "uni")) && (end.level === start.level)) {
                    break
                }
            }
        })

        return web.html.join.join(results)
    }

    _.promise(self)
        .validate(diff)

        .then(web.html.hash)
        .make(sd => {
            sd.diff = {}

            // things that have changed from the original
            _.mapObject(sd.hashed, (new_hash, code) => {
                if (self.hashed[code] === new_hash) {
                    return
                }

                sd.diff[code] = _extract(code)
            })

            _.keys(self.hashed)
                .filter(code => !sd.hashed[code])
                .forEach(code => {
                    sd.diff[code] = null
                })

            _.keys(sd.diff)
                .forEach(match => {
                    match = match + "."

                    _.keys(sd.diff)
                        .filter(key => key.startsWith(match))
                        .forEach(key => {
                            delete sd.diff[key]
                        })
                })
        })

        .end(done, self, diff)
})

diff.method = "lib.html.diff"
diff.description = ``
diff.requires = {
    parts: _.is.Array,
    hashed: _.is.Dictionary,
}
diff.accepts = {
}
diff.produces = {
    diff: _.is.Dictionary,
    hashed: _.is.Dictionary,
}

/**
 */
exports.diff = diff
