'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Computed = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Subscription = require('./Utils/Subscription');

var _Connection = require('./Connection');

var _transaction = require('./transaction');

var _Value = require('./Value');

var _ValueLayzy = require('./Utils/ValueLayzy');

var _map4 = require('./Operators/map');

var _debounceTime4 = require('./Operators/debounceTime');

var _delay4 = require('./Operators/delay');

var _switchMap4 = require('./Operators/switchMap');

var _combine4 = require('./Operators/combine');

var _create4 = require('./Operators/create');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _combineArray = function _combineArray(arr, combineFunc) {

    var arrBind = arr.map(function (arrItem) {
        return function () {
            return arrItem.bind();
        };
    });

    var _combine = (0, _combine4.combine)(arrBind, combineFunc),
        _combine2 = _slicedToArray(_combine, 2),
        getValueSubscription = _combine2[0],
        getResult = _combine2[1];

    return new Computed(getValueSubscription, getResult);
};

var Computed = function () {
    function Computed(getSubscription, getValue) {
        _classCallCheck(this, Computed);

        this._getSubscription = getSubscription;
        this._getValue = getValue;
    }

    _createClass(Computed, [{
        key: 'map',
        value: function map(mapFun) {
            var _this = this;

            var _map2 = (0, _map4.map)(function () {
                return _this.bind();
            }, mapFun),
                _map3 = _slicedToArray(_map2, 2),
                getValueSubscription = _map3[0],
                getResult = _map3[1];

            return new Computed(getValueSubscription, getResult);
        }
    }, {
        key: 'switchMap',
        value: function switchMap(swithFunc) {
            var _this2 = this;

            var _switchMap2 = (0, _switchMap4.switchMap)(function () {
                return _this2.bind();
            }, function (value) {
                return swithFunc(value).bind();
            }),
                _switchMap3 = _slicedToArray(_switchMap2, 2),
                getValueSubscription = _switchMap3[0],
                getResult = _switchMap3[1];

            return new Computed(getValueSubscription, getResult);
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

            return new Computed(getValueSubscription, getResult);
        }
    }, {
        key: 'delay',
        value: function delay(timeout) {
            var _this4 = this;

            var _delay2 = (0, _delay4.delay)(function () {
                return _this4.bind();
            }, timeout),
                _delay3 = _slicedToArray(_delay2, 2),
                getValueSubscription = _delay3[0],
                getResult = _delay3[1];

            return new Computed(getValueSubscription, getResult);
        }
    }, {
        key: 'distinctUntilChanged',
        value: function distinctUntilChanged() {
            return this;

            //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    }, {
        key: 'getValueSnapshot',
        value: function getValueSnapshot() {
            var connection = this.bind();
            var value = connection.getValue();
            connection.disconnect();
            return value;
        }
    }, {
        key: 'bind',
        value: function bind() {
            return new _Connection.Connection(this._getSubscription(), this._getValue);
        }
    }, {
        key: 'connect',
        value: function connect(onRefresh) {
            var connection = new _Connection.Connection(this._getSubscription(), this._getValue);
            //TODO - w Connection dodać metodę onRefresh
            connection.onNotify(function () {
                (0, _transaction.pushToRefresh)(onRefresh);
            });

            return connection;
        }
    }], [{
        key: 'of',
        value: function of(value) {
            var subscription = new _Subscription.Subscription();
            return new Computed(function () {
                return subscription;
            }, function () {
                return value;
            });
        }
    }, {
        key: 'create',
        value: function create(initValue, fnCreate) {
            var _create2 = (0, _create4.create)(initValue, fnCreate),
                _create3 = _slicedToArray(_create2, 2),
                getValueSubscription = _create3[0],
                getResult = _create3[1];

            return new Computed(getValueSubscription, getResult);
        }
    }, {
        key: 'combine',
        value: function combine(a, b, _combine3) {
            //$FlowFixMe
            return _combineArray([a, b], function (arr) {
                return _combine3.apply(undefined, _toConsumableArray(arr));
            });
        }
    }, {
        key: 'combine3',
        value: function combine3(a, b, c, combine) {
            //$FlowFixMe
            return _combineArray([a, b, c], function (arr) {
                return combine.apply(undefined, _toConsumableArray(arr));
            });
        }
    }, {
        key: 'combineArray',
        value: function combineArray(arr, combineFunc) {
            return _combineArray(arr, combineFunc);
        }
    }]);

    return Computed;
}();

exports.Computed = Computed;