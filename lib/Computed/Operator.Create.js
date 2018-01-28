'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _ValueLayzy = require('./ValueLayzy');

var create = exports.create = function create(initValue, fnCreate) {

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            return {
                subscription: new _Subscription.Subscription(),
                value: initValue
            };
        },
        drop: null
    });

    state.onNew(function (stateInner) {
        var unsubscribe = fnCreate(function (newValue) {
            stateInner.value = newValue;
            stateInner.subscription.notify();
        });

        stateInner.subscription.onDown(function () {
            unsubscribe();
            state.clear();
        });
    });

    return [function () {
        return state.getValue().subscription;
    }, function () {
        return state.getValue().value;
    }];
};