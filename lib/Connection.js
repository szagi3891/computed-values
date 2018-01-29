'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Connection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('./Utils/Subscription');

var _Box = require('./Utils/Box');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connection = exports.Connection = function () {
    function Connection(subscription, getValue) {
        var _this = this;

        _classCallCheck(this, Connection);

        this.disconnect = function () {
            _this._connect = true;
            _this._disconnect();
        };

        this._connect = true;
        this._getValue = getValue;
        this._notifyCallbacks = [];
        this._disconnect = subscription.bind(function () {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _this._notifyCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

                    callback();
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
        });
    }

    _createClass(Connection, [{
        key: 'onNotify',
        value: function onNotify(callback) {
            this._notifyCallbacks.push(callback);
        }
    }, {
        key: 'getValueBox',
        value: function getValueBox() {
            if (this._connect) {
                return this._getValue();
            }

            throw Error('Connection is disconnect');
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this.getValueBox().getValue();
        }
    }]);

    return Connection;
}();