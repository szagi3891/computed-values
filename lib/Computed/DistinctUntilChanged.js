'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DistinctUntilChanged = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Box = require('../Utils/Box');

var _ResultValue = require('../Utils/ResultValue');

var defaultIsEqual = function defaultIsEqual(arg1, arg2) {
    return arg1 === arg2;
};

var DistinctUntilChanged = exports.DistinctUntilChanged = function DistinctUntilChanged(parentBind, isEqual) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var connection = parentBind();

            var getResult = function getResult(arg) {
                return arg[0];
            };
            var resultIsEqual = isEqual === null ? defaultIsEqual : isEqual;
            var result = new _ResultValue.ResultValue([connection], getResult, resultIsEqual);

            return {
                subscription: new _Subscription.Subscription(),
                connection: connection,
                result: result
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