'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.map = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _Value = require('../Value');

var _ValueLayzy = require('../ValueLayzy');

var map = exports.map = function map(parentBind, mapFun) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var connection = parentBind();

            return {
                subscription: new _Subscription.Subscription(),
                connection: connection,
                result: new _ValueLayzy.ValueLayzy({
                    create: function create() {
                        return mapFun(connection.getValue());
                    },
                    drop: null
                })
            };
        },
        drop: function drop(inner) {
            return inner.connection.disconnect();
        }
    });

    state.onNew(function (stateInner) {
        stateInner.connection.onNotify(function () {
            stateInner.result.clear();
            stateInner.subscription.notify();
        });
        stateInner.subscription.onDown(function () {
            state.clear();
        });
    });

    return [function () {
        return state.getValue().subscription;
    }, function () {
        return state.getValue().result.getValue();
    }];
};