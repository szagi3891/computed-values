'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ResultValue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Connection = require('../Connection');

var _Box = require('../Utils/Box');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResultValue = exports.ResultValue = function () {
    function ResultValue(connection, mapFun, isEqual) {
        _classCallCheck(this, ResultValue);

        this._connection = connection;
        this._mapFun = mapFun;
        this._isEqual = isEqual;

        var args = this._getArgs();
        var result = this._getResult(args);

        this._args = args;
        this._result = result;
        this._isValid = true;
    }

    _createClass(ResultValue, [{
        key: '_getArgs',
        value: function _getArgs() {
            return this._connection.map(function (item) {
                return item.getValueBox();
            });
        }
    }, {
        key: '_getResult',
        value: function _getResult(args) {
            var argsInner = args.map(function (item) {
                return item.getValue();
            });
            var result = this._mapFun(argsInner);
            return new _Box.Box(result);
        }
    }, {
        key: '_argsEq',
        value: function _argsEq(argsPrev, argsNext) {
            if (argsPrev.length !== argsNext.length) {
                return false;
            }

            var max = argsPrev.length;
            for (var i = 0; i < max; i++) {
                var prevItem = argsPrev[i];
                var nextItem = argsNext[i];
                if (prevItem !== nextItem) {
                    return false;
                }
            }

            return true;
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

            var newArgs = this._getArgs();
            if (this._argsEq(this._args, newArgs)) {
                this._isValid = true;
                return this._result;
            }

            var result = this._getResult(newArgs);

            var isEqual = this._isEqual;
            if (isEqual && isEqual(this._result.getValue(), result.getValue())) {
                this._isValid = true;
                return this._result;
            }

            this._isValid = true;
            this._args = newArgs;
            this._result = result;
            this._isValid = true;

            return result;
        }
    }]);

    return ResultValue;
}();