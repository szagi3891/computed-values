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

            var state = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    return {
                        result: new _ValueLayzy.ValueLayzy({
                            create: function create() {
                                return mapFun(_this._getValue());
                            },
                            drop: null
                        }),
                        connection: _this.bind(),
                        subscription: new _ValueSubscription.ValueSubscription()
                    };
                },
                drop: function drop(inner) {
                    inner.connection.disconnect();
                }
            });

            state.onInicjalized(function (stateInner) {
                stateInner.connection.onNotify(function () {
                    stateInner.result.clear();
                    stateInner.subscription.notify();
                });
                stateInner.subscription.onDown(function () {
                    state.clear();
                });
            });

            return new ValueComputed(function () {
                return state.getValue().subscription;
            }, function () {
                return state.getValue().result.getValue();
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
                var conn = targetComputed.bind();
                conn.onNotify(function () {
                    subscription.notify();
                });
                return conn;
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
                var self = _this2.bind();
                self.onNotify(notify);
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
                                //TODO - robić podobnie z timerem
                                //odpalić timer bez callbacka, a potem się dopiero podpiąć callback
                            }, timeout);
                        },
                        drop: function drop(timerId) {
                            clearTimeout(timerId);
                        }
                    });

                    var connection = new _ValueLayzy.ValueLayzy({
                        create: function create() {
                            return _this3.bind();
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

                innerValue.connection.onInicjalized(function (connectionInner) {
                    connectionInner.onNotify(function () {
                        innerValue.timer.clear();
                        innerValue.timer.getValue();
                    });
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
        value: function bind() {
            return new _ValueConnection.ValueConnection(this._getSubscription, this._getValue);
        }
    }, {
        key: 'connect',
        value: function connect(onRefresh) {
            var connection = new _ValueConnection.ValueConnection(this._getSubscription, this._getValue);
            //TODO - w ValueConnection dodać metodę onRefresh
            var localOnRefresh = onRefresh;

            if (localOnRefresh) {
                connection.onNotify(function () {
                    (0, _transaction.pushToRefresh)(localOnRefresh);
                });
            }

            return connection;
        }
    }]);

    return ValueComputed;
}();