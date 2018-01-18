'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueConnection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ValueSubscription = require('./ValueSubscription');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueConnection = exports.ValueConnection = function () {
    function ValueConnection(getSubscription, getValue) {
        var _this = this;

        _classCallCheck(this, ValueConnection);

        this.disconnect = function () {
            _this._connect = true;
            _this._disconnect();
        };

        this._connect = true;
        this._getSubscription = getSubscription;
        this._getValue = getValue;
        this._disconnect = getSubscription().bind(function () {
            return _this._notify();
        });
        this._notifyCallbacks = [];
    }

    _createClass(ValueConnection, [{
        key: 'onNotify',
        value: function onNotify(callback) {
            this._notifyCallbacks.push(callback);
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            if (this._connect) {
                return this._getValue();
            }

            throw Error('Połączenie jest rozłączone');
        }
    }, {
        key: '_notify',
        value: function _notify() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._notifyCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        }
    }]);

    return ValueConnection;
}();