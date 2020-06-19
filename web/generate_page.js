/*
 *  web/generate_page.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-20
 */

"use strict"

const _ = require("iotdb-helpers")

const swig = require("swig")

const fs = require("fs")
const path = require("path")

const logger = require("../logger")(__filename)

const _xd = {}

/**
 *  Caching version to see if templates exist.
 *  Using the sync version plus caches saves
 *  lots of coding
 */
const _file_exists = p => {
    const exists = _xd[p]
    if (_.is.Boolean(exists)) {
        return exists
    }

    try {
        _xd[p] = fs.statSync(p).isFile()
    }
    catch (x) {
        _xd[p] = false
    }

    return _xd[p]
}

/**
 *  This will find a HTML template, preferring localized versions
 */
const _find_template = (self, page, languages, extension) => {
    for (let li = 0; li < languages.length; li++) {
        const p = path.join(self.web$cfg.dynamic, `${page}.${languages[li]}.${extension}`)
        if (_file_exists(p)) {
            return p
        }
    }

    return path.join(self.web$cfg.dynamic, `${page}.${extension}`)
}

/**
 *  Dynamically generate a page
 */
const generate_page = _.promise(self => {
    _.promise.validate(self, generate_page)

    logger.trace({
        method: generate_page.method,
        ip: self.request ? self.request.connection.remoteAddress : null,
    }, "called")

    let extension = "html"
    let page = self.page
    if (page.match(/[.]txt$/)) {
        extension = "txt"
        page = page.substring(0, page.length - 4)
    }

    const template_file = _find_template(self, page, _.d.list(self.locale, "languages", []), extension)
    const template_paramd = _.d.clone(self)

    if (self.request)  {
        template_paramd.url = self.request.url

        if (self.request.csrfToken) {
            template_paramd._csrf = self.request.csrfToken()
        }
    }

    const options = {
        locals: template_paramd,
        filename: template_file,
    }

    if (self.web$safe) {
        options.autoescape = false
    }

    /*
    self.document = swig.render(fs.readFileSync(template_file, "utf-8"), options)

    // const compiled = swig.compileFile(template_file, options)
    // self.document = swig.run(compiled, {})
    */
    self.document = swig.renderFile(template_file, template_paramd)
    self.document_media_type = extension === "html" ? "text/html" : "text/plain"
    self.document_encoding = null
})

generate_page.method = "web.generate_page"
generate_page.requires = {
    page: _.is.String,
    web$cfg: {
        dynamic: _.is.String,
    },
}
generate_page.accepts = {
    request: _.is.Object,
    web$safe: _.is.Boolean,
}
generate_page.produces = {
    document: _.is.String,
    document_media_type: _.is.String,
    document_encoding: _.is.String,
}
generate_page.params = {
    page: _.p.normal,
}
generate_page.p = _.p(generate_page)

/**
 *  API
 */
exports.generate_page = generate_page
