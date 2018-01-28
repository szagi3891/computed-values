'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueLayzy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmitter = require('../Utils/EventEmitter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueLayzy = exports.ValueLayzy = function () {
    function ValueLayzy(callbacks) {
        _classCallCheck(this, ValueLayzy);

        this._callbacks = callbacks;
        this._value = null;
        this._onNew = new _EventEmitter.EventEmitter();
    }

    _createClass(ValueLayzy, [{
        key: 'getValue',
        value: function getValue() {
            var val = this._value;
            if (val) {
                return val.value;
            }

            var newValue = this._callbacks.create();
            this._value = { value: newValue };

            this._onNew.emit(newValue);

            return newValue;
        }
    }, {
        key: 'clear',
        value: function clear() {
            if (this._value) {
                var _drop = this._callbacks.drop;

                if (_drop) {
                    _drop(this._value.value);
                }
            }
            this._value = null;
        }
    }, {
        key: 'onNew',
        value: function onNew(callback) {
            return this._onNew.on(callback);
        }
    }]);

    return ValueLayzy;
}();