'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventSource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Subscription = require('../Utils/Subscription');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventSource = exports.EventSource = function () {
    function EventSource(funcCreate) {
        var _this = this;

        _classCallCheck(this, EventSource);

        this._state = new _ValueLayzy.ValueLayzy({
            create: function create() {
                return new _Subscription.Subscription();
            },
            drop: null
        });

        var funcCreateLocal = funcCreate;

        if (funcCreateLocal) {
            this._state.onNew(function (subscription) {
                var unsubscribe = funcCreateLocal(function (value) {
                    subscription.notify(value);
                });

                subscription.onDown(function () {
                    unsubscribe();
                    _this._state.clear();
                });
            });
        }
    }

    _createClass(EventSource, [{
        key: 'trigger',
        value: function trigger(param) {
            this._state.getValue().notify(param);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(func) {
            return this._state.getValue().bind(func);
        }
    }, {
        key: 'map',
        value: function map(funcMap) {
            var _this2 = this;

            return new EventSource(function (trigger) {
                return _this2.subscribe(function (value) {
                    trigger(funcMap(value));
                });
            });
        }
    }], [{
        key: 'merge',
        value: function merge() {
            for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
                params[_key] = arguments[_key];
            }

            return new EventSource(function (trigger) {

                var subList = params.map(function (eventItem) {
                    return eventItem.subscribe(trigger);
                });

                return function () {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = subList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var item = _step.value;

                            item();
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
                };
            });
        }
    }]);

    return EventSource;
}();