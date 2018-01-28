'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Value = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('./Utils/Subscription');

var _Computed = require('./Computed');

var _transaction = require('./transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Value = exports.Value = function () {
    function Value(value, funcConnect) {
        _classCallCheck(this, Value);

        this._value = value;
        this._subscription = new _Subscription.Subscription();

        if (funcConnect) {
            this._connect(funcConnect);
        }
    }

    _createClass(Value, [{
        key: '_connect',
        value: function _connect(funcConnect) {
            var _this = this;

            this._subscription.onUp(function () {
                var unsubscribe = funcConnect(function (value) {
                    _this.setValue(value);
                });

                var onDown = function onDown() {
                    unsubscribe();
                    _this._subscription.onDownRemove(onDown);
                };

                _this._subscription.onDown(onDown);
            });
        }
    }, {
        key: 'setValue',
        value: function setValue(newValue) {
            var _this2 = this;

            (0, _transaction.transaction)(function () {
                _this2._value = newValue;
                _this2._subscription.notify();
            });
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this._value;
        }
    }, {
        key: 'asComputed',
        value: function asComputed() {
            var _this3 = this;

            return new _Computed.Computed(function () {
                return _this3._subscription;
            }, function () {
                return _this3._value;
            });
        }
    }]);

    return Value;
}();