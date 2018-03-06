'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.catchSubscriptionsPush = exports.catchSubscriptions = exports.catchSubscriptionsDisconnect = undefined;

var _Connection = require('../Connection');

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

var groupConnectionRefresh = function groupConnectionRefresh(connections, onRefresh) {

    var getValues = function getValues() {
        return connections.map(function (connItem) {
            return connItem.getValueBox();
        });
    };

    var initValues = getValues();

    var shouldRefresh = function shouldRefresh() {
        var newValues = getValues();

        if (initValues.length !== newValues.length) {
            return true;
        }

        var max = initValues.length;

        for (var i = 0; i < max; i++) {
            if (initValues[i] !== newValues[i]) {
                return true;
            }
        }

        return false;
    };

    var refresh = function refresh() {
        if (subs.has(onRefresh) && shouldRefresh()) {
            onRefresh();
        }
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = connections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var connItem = _step.value;

            connItem.onNotify(refresh);
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

    var isUnsub = false;

    return function () {
        if (isUnsub !== false) {
            return;
        }

        isUnsub = true;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = connections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;

                item.disconnect();
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
    };
};

var catchSubscriptionsDisconnect = exports.catchSubscriptionsDisconnect = function catchSubscriptionsDisconnect(refreshFunction) {
    var unsub = subs.get(refreshFunction);

    if (unsub) {
        unsub();
    }
};

var catchSubscriptions = exports.catchSubscriptions = function catchSubscriptions(refreshFunction, toExec) {
    catchStack.push([]);

    var resultExec = toExec();

    var connections = catchStack.pop();

    var unsub = groupConnectionRefresh(connections, refreshFunction);
    catchSubscriptionsDisconnect(refreshFunction);
    subs.set(refreshFunction, unsub);

    return resultExec;
};

var catchSubscriptionsPush = exports.catchSubscriptionsPush = function catchSubscriptionsPush(connection) {
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