"use strict";

module.exports = (function () {
  const addon = require("./build/Release/filemonopolist");
  return addon.FileMonopolist;
})();
