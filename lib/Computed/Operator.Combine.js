'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.combine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Box = require('../Utils/Box');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResultValue = function () {
    //TODO - Box argumentu ...
    function ResultValue(connections, combine) {
        _classCallCheck(this, ResultValue);

        this._connections = connections;
        this._combine = combine;
        this._result = this._getResult();
        this._isValid = true;
    }

    _createClass(ResultValue, [{
        key: '_getResult',
        value: function _getResult() {
            return new _Box.Box(this._combine(this._connections.map(function (connectionItem) {
                return connectionItem.getValueBox().getValue();
            })));
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

var combine = exports.combine = function combine(bindArr, _combine) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var connections = bindArr.map(function (itemBind) {
                return itemBind();
            });

            return {
                subscription: new _Subscription.Subscription(),
                connections: connections,
                result: new ResultValue(connections, _combine)
            };
        },
        drop: function drop(stateInner) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = stateInner.connections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        }
    });

    state.onNew(function (stateInner) {
        stateInner.subscription.onDown(function () {
            state.clear();
        });

        var notify = function notify() {
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        };

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = stateInner.connections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var connectionItem = _step2.value;

                connectionItem.onNotify(notify);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    });

    return [function () {
        return state.getValue().subscription;
    }, function () {
        return state.getValue().result.getResult();
    }];
};