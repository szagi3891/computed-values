'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Timer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SafeIterate = require('./SafeIterate');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = exports.Timer = function () {
    function Timer(timeout) {
        var _this = this;

        _classCallCheck(this, Timer);

        this._timer = setTimeout(function () {
            var callbacks = _this._readyCallbacks;
            if (callbacks === null) {
                return;
            }

            _this._readyCallbacks = null;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _SafeIterate.copyFrom)(callbacks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callbackItem = _step.value;

                    callbackItem();
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
        }, timeout);

        this._readyCallbacks = [];
    }

    _createClass(Timer, [{
        key: 'onReady',
        value: function onReady(callback) {
            if (this._readyCallbacks) {
                this._readyCallbacks.push(callback);
                return;
            }

            callback();
        }
    }, {
        key: 'drop',
        value: function drop() {
            clearTimeout(this._timer);
        }
    }]);

    return Timer;
}();