'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ReactDecorator = exports.ReactDecorator = function ReactDecorator(defComponent) {
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var inst = new (Function.prototype.bind.apply(decoratedComponent, [null].concat(args)))();

        var refresh = function refresh() {
            //Component.prototype.forceUpdate.call(inst);
            inst.forceUpdate();
        };

        var oldComponentWillUnmount = null;
        if (typeof inst.componentWillUnmount === 'function') {
            var _oldComponentWillUnmount = inst.componentWillUnmount.bind(inst);
        }

        inst.componentWillUnmount = function () {
            catchSubscriptionsDisconnect(refresh);
            if (oldComponentWillUnmount) {
                oldComponentWillUnmount();
            }
        };

        var oldRender = inst.render.bind(inst);

        //$FlowFixMe
        inst.render = function () {
            return catchSubscriptions(refresh, function () {
                return oldRender();
            });
        };

        return inst;
    };
};