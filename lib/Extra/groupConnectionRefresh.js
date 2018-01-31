'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupConnectionRefresh = undefined;

var _Connection = require('../Connection');

var groupConnectionRefresh = exports.groupConnectionRefresh = function groupConnectionRefresh(connections, onRefresh) {

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
        if (shouldRefresh()) {
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