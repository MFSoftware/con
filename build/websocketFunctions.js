"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  sendAll: function sendAll(clients, message) {
    for (var i = 0; i < clients.length; i++) {
      clients[i][1].send(message);
    }
  }
};
exports["default"] = _default;