'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueComputed = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ValueSubscription = require('./ValueSubscription');

var _ValueConnection = require('./ValueConnection');

var _transaction = require('./transaction');

var _Value = require('./Value');

var _ValueLayzy = require('./ValueLayzy');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueComputed = exports.ValueComputed = function () {
    function ValueComputed(getSubscription, getValue) {
        _classCallCheck(this, ValueComputed);

        this._getSubscription = getSubscription;
        this._getValue = getValue;
    }

    _createClass(ValueComputed, [{
        key: 'map',
        value: function map(mapFun) {
            var _this = this;

            var inner = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    var result = new _ValueLayzy.ValueLayzy({
                        create: function create() {
                            return mapFun(_this._getValue());
                        },
                        drop: null
                    });

                    var subscription = new _ValueSubscription.ValueSubscription();

                    var parent = _this.bind(function () {
                        result.clear();
                        subscription.notify();
                    });

                    return {
                        result: result,
                        parent: parent,
                        subscription: subscription
                    };
                },
                drop: function drop(inner) {
                    inner.parent.disconnect();
                }
            });

            inner.onInicjalized(function (innerValue) {
                innerValue.subscription.onDown(function () {
                    inner.clear();
                });
            });

            return new ValueComputed(function () {
                return inner.getValue().subscription;
            }, function () {
                return inner.getValue().result.getValue();
            });
        }
    }, {
        key: 'switchMap',
        value: function switchMap(swithFunc) {
            var _this2 = this;

            var connection = null;

            var clearConnection = function clearConnection() {
                if (connection !== null) {
                    connection.self.disconnect();
                    connection.target.disconnect();
                    connection = null;
                } else {
                    throw Error('Switch - disconnect - Incorrect code branch');
                }
            };

            var subscription = new _ValueSubscription.ValueSubscription();
            subscription.onDown(clearConnection);

            var getTargetBySelf = function getTargetBySelf(self) {
                var targetComputed = swithFunc(self.getValue());
                return targetComputed.bind(function () {
                    subscription.notify();
                });
            };

            var notify = function notify() {
                if (connection !== null) {
                    var newTarget = getTargetBySelf(connection.self);
                    connection.target.disconnect();
                    connection.target = newTarget;
                } else {
                    throw Error('Switch - notify - Incorrect code branch');
                }

                subscription.notify();
            };

            var getNewConnection = function getNewConnection() {
                var self = _this2.bind(notify);

                return {
                    self: self,
                    target: getTargetBySelf(self)
                };
            };

            var getConnection = function getConnection() {
                if (connection !== null) {
                    return connection;
                }

                var newConnect = getNewConnection();
                connection = newConnect;
                return connection;
            };

            var getResult = function getResult() {
                var connection = getConnection();
                return connection.target.getValue();
            };

            return new ValueComputed(function () {
                return subscription;
            }, getResult);
        }
    }, {
        key: 'debounceTime',
        value: function debounceTime(timeout) {
            var _this3 = this;

            var inner = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    var subscription = new _ValueSubscription.ValueSubscription();

                    var timer = new _ValueLayzy.ValueLayzy({
                        create: function create() {
                            return setTimeout(function () {
                                subscription.notify();
                            }, timeout);
                        },
                        drop: function drop(timerId) {
                            clearTimeout(timerId);
                        }
                    });

                    var connection = new _ValueLayzy.ValueLayzy({
                        create: function create() {
                            return _this3.bind(function () {
                                timer.clear();
                                timer.getValue();
                            });
                        },
                        drop: function drop(conn) {
                            conn.disconnect();
                        }
                    });

                    return {
                        subscription: subscription,
                        timer: timer,
                        connection: connection
                    };
                },
                drop: function drop(inner) {
                    inner.timer.clear();
                    inner.connection.clear();
                }
            });

            inner.onInicjalized(function (innerValue) {
                innerValue.subscription.onDown(function () {
                    inner.clear();
                });
            });

            return new ValueComputed(function () {
                return inner.getValue().subscription;
            }, function () {
                return inner.getValue().connection.getValue().getValue();
            });
        }
    }, {
        key: 'distinctUntilChanged',
        value: function distinctUntilChanged() {
            return this;

            //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    }, {
        key: 'bind',
        value: function bind(notify) {
            var _this4 = this;

            var disconnect = this._getSubscription().bind(notify);
            return new _ValueConnection.ValueConnection(function () {
                return _this4._getValue();
            }, disconnect);
        }
    }, {
        key: 'connect',
        value: function connect(onRefresh) {
            var _this5 = this;

            var disconnect = this._getSubscription().bind(function () {
                if (onRefresh) {
                    (0, _transaction.pushToRefresh)(onRefresh);
                }
            });

            return new _ValueConnection.ValueConnection(function () {
                return _this5._getValue();
            }, disconnect);
        }
    }]);

    return ValueComputed;
}();