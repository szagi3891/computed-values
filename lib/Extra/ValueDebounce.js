'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ValueDebounce = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Computed = require('../Computed');

var _Value = require('../Value');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueDebounce = exports.ValueDebounce = function () {
    function ValueDebounce(initValue, timeout) {
        _classCallCheck(this, ValueDebounce);

        this._value = new _Value.Value(initValue);
        this._timeout = timeout;
        this._timer = null;
    }

    _createClass(ValueDebounce, [{
        key: 'setValue',
        value: function setValue(newValue) {
            var _this = this;

            if (this._timer !== null) {
                clearTimeout(this._timer);
            }

            this._timer = setTimeout(function () {
                _this._value.setValue(newValue);
            }, this._timeout);
        }
    }, {
        key: 'asComputed',
        value: function asComputed() {
            return this._value.asComputed();
        }
    }]);

    return ValueDebounce;
}();