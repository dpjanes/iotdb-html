/*
 *  web/page.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-20
 */

"use strict"

const _ = require("iotdb-helpers")

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
const _find_template = (self, pagename, languages, extension) => {
    for (let li = 0; li < languages.length; li++) {
        const p = path.join(self.web$cfg.folder, `${pagename}.${languages[li]}.${extension}`)
        if (_file_exists(p)) {
            return p
        }
    }

    return path.join(self.web$cfg.folder, `${pagename}.${extension}`)
}

/**
 *  Dynamically generate a page
 */
const page = _.promise(self => {
    _.promise.validate(self, page)

    logger.trace({
        method: page.method,
        ip: self.request ? self.request.connection.remoteAddress : null,
    }, "called")

    let extension = "html"
    let pagename = self.page
    if (pagename.match(/[.]txt$/)) {
        extension = "txt"
        pagename = pagename.substring(0, pagename.length - 4)
    }

    const template_file = _find_template(self, pagename, _.d.list(self.locale, "languages", []), extension)
    const template_paramd = _.d.clone(self)

    if (self.request)  {
        template_paramd.url = self.request.url

        if (self.request.csrfToken) {
            template_paramd._csrf = self.request.csrfToken()
        }
    }

    /*
    const options = {
        locals: template_paramd,
        filename: template_file,
    }

    if (self.web$safe) {
        options.autoescape = false
    }

    self.document = swig.renderFile(template_file, template_paramd)
    */

    self.document = self.web$cfg.render(template_file, template_paramd)
    self.document_media_type = extension === "html" ? "text/html" : "text/plain"
    self.document_encoding = null
})

page.method = "web.page"
page.description = `
    web$cfg.folder is where to locate template files

    web$cfg.render is a function to render a template file.
    It should take two arguments, a path to the template file,
    and a set of parameters
`
page.requires = {
    page: _.is.String,
    web$cfg: {
        folder: _.is.String,
        render: _.is.Function,
    },
}
page.accepts = {
    request: _.is.Object,
    web$safe: _.is.Boolean,
}
page.produces = {
    document: _.is.String,
    document_media_type: _.is.String,
    document_encoding: _.is.String,
}
page.params = {
    page: _.p.normal,
}
page.p = _.p(page)

/**
 *  API
 */
exports.page = page
