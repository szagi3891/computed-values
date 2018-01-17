"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueLayzy = exports.ValueLayzy = function () {
    function ValueLayzy(callbacks) {
        _classCallCheck(this, ValueLayzy);

        this._callbacks = callbacks;
        this._value = null;
        this._onInicjalized = [];
    }

    _createClass(ValueLayzy, [{
        key: "getValue",
        value: function getValue() {
            var val = this._value;
            if (val) {
                return val.value;
            }

            var newValue = this._callbacks.create();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._onInicjalized[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callbackInit = _step.value;

                    callbackInit(newValue);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._value = { value: newValue };
            return newValue;
        }
    }, {
        key: "clear",
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
        key: "onInicjalized",
        value: function onInicjalized(callback) {
            this._onInicjalized.push(callback);
        }
    }]);

    return ValueLayzy;
}();