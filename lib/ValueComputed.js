'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueComputed = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ValueSubscription = require('./ValueSubscription');

var _ValueConnection = require('./ValueConnection');

var _transaction = require('./transaction');

var _Value = require('./Value');

var _ValueLayzy = require('./ValueLayzy');

var _map4 = require('./operators/map');

var _debounceTime4 = require('./operators/debounceTime');

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

            var _map2 = (0, _map4.map)(function () {
                return _this.bind();
            }, mapFun),
                _map3 = _slicedToArray(_map2, 2),
                getValueSubscription = _map3[0],
                getResult = _map3[1];

            return new ValueComputed(getValueSubscription, getResult);
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

            var _debounceTime2 = (0, _debounceTime4.debounceTime)(function () {
                return _this3.bind();
            }, timeout),
                _debounceTime3 = _slicedToArray(_debounceTime2, 2),
                getValueSubscription = _debounceTime3[0],
                getResult = _debounceTime3[1];

            return new ValueComputed(getValueSubscription, getResult);
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