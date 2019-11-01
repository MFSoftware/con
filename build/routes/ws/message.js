"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(wsapi) {
  wsapi.on('new_message', function (data) {
    console.log('ok');
  });
};

exports["default"] = _default;