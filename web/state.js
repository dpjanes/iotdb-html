/*
 *  web/state.js
 *
 *  David Janes
 *  Consensas
 *  2020-05-01
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const state_get = _.promise((self, done) => {
    _.promise(self)
        .validate(state_get)

        .make(sd => {
            sd.request.session.stated = sd.request.session.stated || {}
            sd.state = _.d.clone(sd.request.session.stated[sd.tab_id] || {})
        })

        .end(done, self, state_get)
})

state_get.method = "lib.web.state.get"
state_get.description = ``
state_get.requires = {
    request: {
        session: _.is.Object,
    },
    tab_id: _.is.String,
}
state_get.accepts = {
}
state_get.produces = {
    state: _.is.Dictionary,
}
state_get.params = {
    tab_id: _.p.normal,
}
state_get.p = _.p(state_get)

/**
 */
const state_set = _.promise((self, done) => {
    _.promise(self)
        .validate(state_set)

        .make((sd, sdone) => {
            sd.request.session.reload(() => {
                const now = new Date().getTime()

                sd.request.session.stated = sd.request.session.stated || {}
                sd.request.session.stated[sd.tab_id] = sd.state    
                sd.state.touched = now
                sd.state.tab_id = sd.tab_id
    
                const size = _.size(sd.request.session.stated)
                if (size > 2) {
                    const max = (size > 4 ? 5 : 30) * 60 * 1000
                    let oldest = null
    
                    _.values(sd.request.session.stated)
                        .filter(state => (now - state.touched) > max)
                        .forEach(state => {
                            if (!oldest) {
                                oldest = state
                            } else if (state.touched < oldest.touched) {
                                oldest = state
                            }
                        })
    
                    if (oldest) {
                        delete sd.request.session.stated[oldest.tab_id]
                    }
                }

                delete sd.request.session.state
    
                sd.request.session.save(() => sdone(null, sd))
            })
        })
        
        .end(done, self, state_set)
})

state_set.method = "lib.web.state.set"
state_set.description = ``
state_set.requires = {
    state: _.is.Dictionary,
    request: {
        session: _.is.Object,
    },
    tab_id: _.is.String,
}
state_set.accepts = {
}
state_set.produces = {
}
state_set.params = {
    tab_id: _.p.normal,
}
state_set.p = _.p(state_set)

/**
 */
exports.state = {
    get: state_get,
    set: state_set,
}
