'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceTime = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _Value = require('../Value');

var _ValueLayzy = require('../Utils/ValueLayzy');

var _Timer = require('../Utils/Timer');

var debounceTime = exports.debounceTime = function debounceTime(parentBind, timeout) {

    var inner = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var subscription = new _Subscription.Subscription();

            var connection = parentBind();

            var timer = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    return new _Timer.Timer(timeout);
                },
                drop: function drop(timer) {
                    return timer.drop();
                }
            });

            return {
                subscription: subscription,
                connection: connection,
                timer: timer,
                value: connection.getValue()
            };
        },
        drop: function drop(inner) {
            inner.timer.clear();
            inner.connection.disconnect();
        }
    });

    inner.onNew(function (innerValue) {
        innerValue.subscription.onDown(function () {
            inner.clear();
        });

        innerValue.timer.onNew(function (timer) {
            timer.onReady(function () {
                innerValue.value = innerValue.connection.getValue();
                innerValue.subscription.notify();
            });
        });

        innerValue.connection.onNotify(function () {
            innerValue.timer.reset();
        });
    });

    return [function () {
        return inner.getValue().subscription;
    }, function () {
        return inner.getValue().value;
    }];
};