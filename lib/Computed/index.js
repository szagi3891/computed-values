'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Computed = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _transaction = require('../transaction');

var _Value = require('../Value');

var _Box = require('../Utils/Box');

var _Operator = require('./Operator.Map');

var _Operator2 = require('./Operator.SwitchMap');

var _Operator3 = require('./Operator.Combine');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _combineArray = function _combineArray(arr, combineFunc) {

    var arrBind = arr.map(function (arrItem) {
        return function () {
            return arrItem.bind();
        };
    });

    var _combine = (0, _Operator3.combine)(arrBind, combineFunc),
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

            var _map2 = (0, _Operator.map)(function () {
                return _this.bind();
            }, mapFun),
                _map3 = _slicedToArray(_map2, 2),
                getValueSubscription = _map3[0],
                getResult = _map3[1];

            return new Computed(getValueSubscription, getResult);
        }

        /*
        switch<T: Computed<K>>(): Computed<K> { ---> T przy założeniu że T to Computed<K>
            const [getValueSubscription, getResult] = switchMap(
                () => this.bind(),
                (value: T) => value.bind()
            );
             return new Computed(
                getValueSubscription,
                getResult
            );
        }
        */

    }, {
        key: 'switchMap',
        value: function switchMap(swithFunc) {
            var _this2 = this;

            var _switchMap2 = (0, _Operator2.switchMap)(function () {
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
        key: 'distinctUntilChanged',
        value: function distinctUntilChanged() {
            return this;

            //TODO - do zaimplementowania
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

            connection.onNotify(function () {
                (0, _transaction.pushToRefresh)(onRefresh);
            });

            return connection;
        }
    }], [{
        key: 'of',
        value: function of(value) {
            return new _Value.Value(value).asComputed();
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