'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.combine = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Box = require('../Utils/Box');

var _ResultValue = require('../Utils/ResultValue');

var combine = exports.combine = function combine(bindArr, _combine) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var connections = bindArr.map(function (itemBind) {
                return itemBind();
            });

            return {
                subscription: new _Subscription.Subscription(),
                connections: connections,
                result: new _ResultValue.ResultValue(connections, _combine, null)
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