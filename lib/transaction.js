'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var level = 0;
var refresh = new Set();

var transaction = exports.transaction = function transaction(funcToRun) {
    level++;
    funcToRun();
    level--;

    if (level === 0) {
        var toRefresh = refresh;
        refresh = new Set();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = toRefresh.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                item();
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
    }
};

var pushToRefresh = exports.pushToRefresh = function pushToRefresh(funcToRefresh) {
    if (level > 0) {
        refresh.add(funcToRefresh);
    } else {
        throw Error('The function can only be call in transcription mode.');
    }
};