'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueSubscription = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('./transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueSubscription = exports.ValueSubscription = function () {
    function ValueSubscription() {
        _classCallCheck(this, ValueSubscription);

        this._subscription = new Map();
        this._onDown = [];
    }

    _createClass(ValueSubscription, [{
        key: 'notify',
        value: function notify() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var item = _step.value;

                    (0, _transaction.transaction)(function () {
                        item();
                    });
                };

                for (var _iterator = this._subscription.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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
    }, {
        key: 'onDown',
        value: function onDown(callback) {
            this._onDown.push(callback);
        }
    }, {
        key: 'bind',
        value: function bind(notify) {
            var _this = this;

            var token = {};

            this._subscription.set(token, notify);

            return function () {
                _this._subscription.delete(token);

                if (_this._subscription.size === 0) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _this._onDown[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _item = _step2.value;

                            _item();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    _this._onDown = [];
                }
            };
        }
    }]);

    return ValueSubscription;
}();