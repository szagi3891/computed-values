'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Value = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscription = require('./Subscription');

var _ValueComputed = require('./ValueComputed');

var _transaction = require('./transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Value = exports.Value = function () {
    function Value(value) {
        _classCallCheck(this, Value);

        this._value = value;
        this._subscription = new _Subscription.Subscription();
    }

    /*
    static create<K>(initValue: K, funcBuild: (disconnect: (()=> void) => void): Value<T> {
        const val = new Value(initValue);
         //this._subscription = new Subscription(() => {});
    }
     const structure$: ValueObservable<StructureType | null> = ValueObservable.create(null, next => {
        const unsub = database.ref('structure').on('value', snap => {
            if (snap) {
                next(ValidateStructureType(JSON.parse(snap.val())));
            }
        });
    
        //$ FlowFixMe
        return () => unsub();
    });
    */

    _createClass(Value, [{
        key: 'setValue',
        value: function setValue(newValue) {
            var _this = this;

            (0, _transaction.transaction)(function () {
                _this._value = newValue;
                _this._subscription.notify();
            });
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            return this._value;
        }
    }, {
        key: 'update',
        value: function update(fnUpdate) {
            var _this2 = this;

            (0, _transaction.transaction)(function () {
                _this2._value = fnUpdate(_this2._value);
                _this2._subscription.notify();
            });
        }
    }, {
        key: 'asComputed',
        value: function asComputed() {
            var _this3 = this;

            return new _ValueComputed.ValueComputed(function () {
                return _this3._subscription;
            }, function () {
                return _this3._value;
            });
        }
    }]);

    return Value;
}();