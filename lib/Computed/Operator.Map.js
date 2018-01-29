'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.map = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Box = require('../Utils/Box');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResultValue = function () {
    //TODO - Box argumentu ...
    function ResultValue(connection, mapFun) {
        _classCallCheck(this, ResultValue);

        this._connection = connection;
        this._mapFun = mapFun;
        this._result = this._getResult();
        this._isValid = true;
    }

    _createClass(ResultValue, [{
        key: '_getResult',
        value: function _getResult() {
            var result = this._mapFun(this._connection.getValueBox().getValue());
            return new _Box.Box(result);
        }
    }, {
        key: 'setAsNotValid',
        value: function setAsNotValid() {
            this._isValid = false;
        }
    }, {
        key: 'getResult',
        value: function getResult() {
            if (this._isValid) {
                return this._result;
            }

            var result = this._getResult();

            this._isValid = true;
            this._result = result;
            this._isValid = true;

            return result;
        }
    }]);

    return ResultValue;
}();

var map = exports.map = function map(parentBind, mapFun) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var connection = parentBind();

            return {
                subscription: new _Subscription.Subscription(),
                connection: connection,
                result: new ResultValue(connection, mapFun)
            };
        },
        drop: function drop(inner) {
            return inner.connection.disconnect();
        }
    });

    state.onNew(function (stateInner) {
        stateInner.connection.onNotify(function () {
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        });
        stateInner.subscription.onDown(function () {
            state.clear();
        });
    });

    return [function () {
        return state.getValue().subscription;
    }, function () {
        return state.getValue().result.getResult();
    }];
};