'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValueConnection = exports.ValueConnection = function () {
    function ValueConnection(getValue, disconnect) {
        var _this = this;

        _classCallCheck(this, ValueConnection);

        this.disconnect = function () {
            _this._connect = true;
            _this._disconnect();
        };

        this._connect = true;
        this._getValue = getValue;
        this._disconnect = disconnect;
    }

    _createClass(ValueConnection, [{
        key: 'getValue',
        value: function getValue() {
            if (this._connect) {
                return this._getValue();
            }

            throw Error('Połączenie jest rozłączone');
        }
    }]);

    return ValueConnection;
}();