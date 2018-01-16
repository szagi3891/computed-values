"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var logError = exports.logError = function logError() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    console.error.apply(console.error, args);
};

var logInfo = exports.logInfo = function logInfo() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    console.info.apply(console.info, args);
};

var logGroup = exports.logGroup = function logGroup(name, toRun) {
    console.groupCollapsed(name);
    toRun();
    console.groupEnd();
};