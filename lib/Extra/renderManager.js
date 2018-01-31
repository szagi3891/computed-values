'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pushConnection = exports.catchSubscriptions = exports.disconnect = undefined;

var _Connection = require('../Connection');

var _groupConnectionRefresh = require('../Extra/groupConnectionRefresh');

/*
componentWillUnmount() {
    disconnect(this._refresh);
}

_refresh = () => {
    this.forceUpdate();
}

constructor(props) {
    super(props);
    const oldRender = this.render.bind(this);
    this.render = () => catchSubscriptions(this._refresh, () => {
        return oldRender();
    });
}
*/

var isSSR = typeof window === 'undefined';

var catchStack = [];
var subs = new Map();

var disconnect = exports.disconnect = function disconnect(refreshFunction) {
    var unsub = subs.get(refreshFunction);

    if (unsub) {
        unsub();
    }
};

var catchSubscriptions = exports.catchSubscriptions = function catchSubscriptions(refreshFunction, toExec) {
    catchStack.push([]);

    toExec();

    var connections = catchStack.pop();

    var unsub = (0, _groupConnectionRefresh.groupConnectionRefresh)(connections, refreshFunction);
    disconnect(refreshFunction);
    subs.set(refreshFunction, unsub);
};

var pushConnection = exports.pushConnection = function pushConnection(connection) {
    if (isSSR) {
        connection.disconnect();
    } else {
        if (catchStack.length > 0) {
            catchStack[catchStack.length - 1].push(connection);
        } else {
            connection.disconnect();
        }
    }
};