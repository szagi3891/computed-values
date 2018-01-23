'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.switchMap = undefined;

var _Subscription = require('../Utils/Subscription');

var _Connection = require('../Connection');

var _Value = require('../Value');

var _ValueLayzy = require('../Utils/ValueLayzy');

var switchMap = exports.switchMap = function switchMap(bindSelf, swithFunc) {

    var getNewTarget = function getNewTarget(self) {
        return swithFunc(self.getValue());
    };

    var state = new _ValueLayzy.ValueLayzy({
        create: function create() {
            var self = bindSelf();
            return {
                subscription: new _Subscription.Subscription(),
                self: self,
                target: getNewTarget(self)
            };
        },
        drop: function drop(conn) {
            conn.self.disconnect();
            conn.target.disconnect();
        }
    });

    state.onNew(function (innerState) {
        innerState.self.onNotify(function () {
            var newTarget = getNewTarget(innerState.self);

            newTarget.onNotify(function () {
                innerState.subscription.notify();
            });

            innerState.target.disconnect();
            innerState.target = newTarget;

            innerState.subscription.notify();
        });

        innerState.target.onNotify(function () {
            innerState.subscription.notify();
        });

        innerState.subscription.onDown(function () {
            state.clear();
        });
    });

    return [function () {
        return state.getValue().subscription;
    }, function () {
        return state.getValue().target.getValue();
    }];
};