/*
 *  lib/split/index.js
 *
 *  David Janes
 *  Consensas
 *  2020-04-23
 */

"use strict"

module.exports = Object.assign(
    {},
    require("./compress"),
    require("./diff"),
    require("./hash"),
    require("./join"),
    require("./split"),
    require("./tag"),
    require("./tops"),
    {}
);
