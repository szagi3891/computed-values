'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subscription = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../transaction');

var _EventEmitter = require('./EventEmitter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = exports.Subscription = function () {
    function Subscription() {
        _classCallCheck(this, Subscription);

        this._subscription = new _EventEmitter.EventEmitter();
        this._up = new _EventEmitter.EventEmitter();
        this._down = new _EventEmitter.EventEmitter();
    }

    _createClass(Subscription, [{
        key: 'notify',
        value: function notify(param) {
            var _this = this;

            (0, _transaction.transaction)(function () {
                _this._subscription.emit(param);
            });
        }
    }, {
        key: 'onUp',
        value: function onUp(callback) {
            return this._up.on(callback);
        }
    }, {
        key: 'onDown',
        value: function onDown(callback) {
            return this._down.on(callback);
        }
    }, {
        key: 'onDownRemove',
        value: function onDownRemove(callback) {
            this._down.remove(callback);
        }
    }, {
        key: 'bind',
        value: function bind(notify) {
            var _this2 = this;

            var unsubscribeNotify = this._subscription.on(notify);

            if (this._subscription.count() === 1) {
                this._up.emit();
            }

            return function () {
                unsubscribeNotify();

                if (_this2._subscription.count() === 0) {
                    _this2._down.emit();
                }
            };
        }
    }]);

    return Subscription;
}();