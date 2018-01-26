'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.delay = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _Value = require('../Value');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Timer = require('../Utils/Timer');

var _transaction = require('../transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerList = function () {
    function TimerList() {
        _classCallCheck(this, TimerList);

        this._timers = new Map();
    }

    _createClass(TimerList, [{
        key: 'clear',
        value: function clear() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._timers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var timerId = _step.value;

                    clearTimeout(timerId);
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

            this._timers = new Map();
        }
    }, {
        key: 'createNew',
        value: function createNew(timeout, callback) {
            var _this = this;

            var token = {};

            var timerId = setTimeout(function () {
                _this._timers.delete(token);
                callback();
            }, timeout);

            this._timers.set(token, timerId);
        }
    }]);

    return TimerList;
}();

var delay = exports.delay = function delay(parentBind, timeout) {

    var inner = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var subscription = new _Subscription.Subscription();

            var connection = parentBind();

            var timers = new TimerList();

            return {
                connection: connection,
                subscription: subscription,
                timers: timers,
                value: connection.getValue()
            };
        },
        drop: function drop(inner) {
            inner.connection.disconnect(), inner.timers.clear();
        }
    });

    inner.onNew(function (innerValue) {
        innerValue.subscription.onDown(function () {
            inner.clear();
        });

        innerValue.connection.onNotify(function () {

            console.info('NOTIFY');

            //Pobrać wartość z parenta możemy pobrać w momencie gdy sieć znajduje się w trybie "wyliczania"
            (0, _transaction.pushToRefresh)(function () {
                var valueSnapshot = innerValue.connection.getValue();

                innerValue.timers.createNew(timeout, function () {
                    innerValue.value = valueSnapshot;
                    innerValue.subscription.notify();
                });
            });
        });
    });

    return [function () {
        return inner.getValue().subscription;
    }, function () {
        return inner.getValue().value;
    }];
};