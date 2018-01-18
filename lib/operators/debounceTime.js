'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceTime = undefined;

var _ValueSubscription = require('../ValueSubscription');

var _ValueConnection = require('../ValueConnection');

var _Value = require('../Value');

var _ValueLayzy = require('../ValueLayzy');

var debounceTime = exports.debounceTime = function debounceTime(parentBind, timeout) {

    var inner = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var subscription = new _ValueSubscription.ValueSubscription();

            var timer = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    return setTimeout(function () {
                        subscription.notify();
                        //TODO - robić podobnie z timerem
                        //odpalić timer bez callbacka, a potem się dopiero podpiąć callback
                    }, timeout);
                },
                drop: function drop(timerId) {
                    return clearTimeout(timerId);
                }
            });

            var connection = new _ValueLayzy.ValueLayzy({
                create: function create() {
                    return parentBind();
                },
                drop: function drop(conn) {
                    return conn.disconnect();
                }
            });

            return {
                subscription: subscription,
                timer: timer,
                connection: connection
            };
        },
        drop: function drop(inner) {
            inner.timer.clear();
            inner.connection.clear();
        }
    });

    inner.onNew(function (innerValue) {
        innerValue.subscription.onDown(function () {
            inner.clear();
        });

        innerValue.connection.onNew(function (connectionInner) {
            connectionInner.onNotify(function () {
                innerValue.timer.clear();
                innerValue.timer.getValue();
            });
        });
    });

    return [function () {
        return inner.getValue().subscription;
    }, function () {
        return inner.getValue().connection.getValue().getValue();
    }];
};