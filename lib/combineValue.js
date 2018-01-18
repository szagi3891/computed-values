'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.combineValueArr = exports.combineValue = undefined;

var _ValueComputed = require('./ValueComputed');

var _ValueConnection = require('./ValueConnection');

var _ValueSubscription = require('./ValueSubscription');

var combineValue = exports.combineValue = function combineValue(a, b, combine) {

    var connection = null;

    var subscription = new _ValueSubscription.ValueSubscription();

    subscription.onDown(function () {
        if (connection !== null) {
            connection.a.disconnect();
            connection.b.disconnect();
            connection = null;
        } else {
            throw Error('combineValue - disconnect - Incorrect code branch');
        }
    });

    var clearCache = function clearCache() {
        if (connection) {
            connection.result = null;
        } else {
            throw Error('combineValue - clearCache - Incorrect code branch');
        }
    };

    var notify = function notify() {
        clearCache();
        return subscription.notify();
    };

    var getConnection = function getConnection() {
        if (connection !== null) {
            return connection;
        }

        var newConnectA = a.bind();
        var newConnectB = b.bind();

        newConnectA.onNotify(notify);
        newConnectB.onNotify(notify);

        connection = {
            a: newConnectA,
            b: newConnectB,
            result: null
        };

        return connection;
    };

    var getResult = function getResult() {
        var connection = getConnection();

        if (connection.result === null) {
            var _result = combine(connection.a.getValue(), connection.b.getValue());
            connection.result = { value: _result };
            return _result;
        } else {
            return connection.result.value;
        }
    };

    return new _ValueComputed.ValueComputed(function () {
        return subscription;
    }, getResult);
};

//TODO - scalić w jeden te dwa operatory

var combineValueArr = exports.combineValueArr = function combineValueArr(arr, combine) {

    var connection = null;

    var subscription = new _ValueSubscription.ValueSubscription();

    subscription.onDown(function () {
        if (connection !== null) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = connection.arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var connectionItem = _step.value;

                    connectionItem.disconnect();
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

            connection = null;
        } else {
            throw Error('combineValue - disconnect - Incorrect code branch');
        }
    });

    var clearCache = function clearCache() {
        if (connection) {
            connection.result = null;
        } else {
            throw Error('combineValue - clearCache - Incorrect code branch');
        }
    };

    var notify = function notify() {
        clearCache();
        return subscription.notify();
    };

    var getConnection = function getConnection() {
        if (connection !== null) {
            return connection;
        }

        var newConnectArr = arr.map(function (item) {
            var localConnection = item.bind();
            localConnection.onNotify(notify);
            return localConnection;
        });

        connection = {
            arr: newConnectArr,
            result: null
        };

        return connection;
    };

    var getResult = function getResult() {
        var connection = getConnection();

        if (connection.result === null) {
            var arrArgs = connection.arr.map(function (connectionItem) {
                return connectionItem.getValue();
            });
            var _result2 = combine(arrArgs);
            connection.result = { value: _result2 };
            return _result2;
        } else {
            return connection.result.value;
        }
    };

    return new _ValueComputed.ValueComputed(function () {
        return subscription;
    }, getResult);
};