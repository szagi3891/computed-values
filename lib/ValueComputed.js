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

            var connection = null;

            var subscription = new _ValueSubscription.ValueSubscription();

            subscription.onDown(function () {
                if (connection !== null) {
                    connection.parent.disconnect();
                    connection = null;
                } else {
                    throw Error('Map - disconnect - Incorrect code branch');
                }
            });

            var clearCache = function clearCache() {
                if (connection) {
                    connection.result = null;
                } else {
                    throw Error('Map - clearCache - Incorrect code branch');
                }
            };

            var notify = function notify() {
                clearCache();
                subscription.notify();
            };

            var getConnection = function getConnection() {
                if (connection !== null) {
                    return connection;
                }

                var newConnect = _this.bind(notify);

                connection = {
                    parent: newConnect,
                    result: null
                };

                return connection;
            };

            var getResult = function getResult() {
                var connection = getConnection();

                if (connection.result === null) {
                    var _result = mapFun(_this._getValue());
                    connection.result = { value: _result };
                    return _result;
                } else {
                    return connection.result.value;
                }
            };

            return new ValueComputed(function () {
                return subscription;
            }, getResult);
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

            var connection = null;
            var timer = null;

            var clearConnection = function clearConnection() {
                if (connection !== null) {
                    connection.disconnect();
                    connection = null;

                    if (timer !== null) {
                        clearTimeout(timer);
                        timer = null;
                    }
                } else {
                    throw Error('Switch - disconnect - Incorrect code branch');
                }
            };

            var subscription = new _ValueSubscription.ValueSubscription();
            subscription.onDown(clearConnection);

            var notify = function notify() {
                if (connection !== null) {
                    if (timer !== null) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(function () {
                        subscription.notify();
                        timer = null;
                    }, timeout);
                } else {
                    throw Error('Switch - notify - Incorrect code branch');
                }
            };

            var getConnection = function getConnection() {
                if (connection !== null) {
                    return connection;
                }

                var newConnect = _this3.bind(notify);
                connection = newConnect;
                return connection;
            };

            var getResult = function getResult() {
                return getConnection().getValue();
            };

            return new ValueComputed(function () {
                return subscription;
            }, getResult);
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