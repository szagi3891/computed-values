'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PropsComputed = exports.PropsComputedData = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Value = require('../Value');

var _Computed = require('../Computed');

var _transaction = require('../transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createItem = function createItem() {
    var newValue = new _Value.Value();
    var newComputed = newValue.asComputed();
    return {
        value: newValue,
        computed: newComputed
    };
};

var setValue = function setValue(item, newValue) {
    var oldValue = item.value.value();
    if (oldValue !== newValue) {
        item.value.setValue(newValue);
    }
};

var PropsComputedData = exports.PropsComputedData = function () {
    function PropsComputedData(data) {
        _classCallCheck(this, PropsComputedData);

        this._data = data;
    }

    _createClass(PropsComputedData, [{
        key: 'setNewProps',
        value: function setNewProps(props) {
            var _this = this;

            (0, _transaction.transaction)(function () {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.entries(props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2),
                            key = _step$value[0],
                            _value = _step$value[1];

                        var item = _this._data.get(key);
                        if (item) {
                            setValue(item, _value);
                        } else {
                            var newItem = createItem();
                            setValue(newItem, _value);
                            _this._data.set(key, newItem);
                        }
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
            });
        }
    }], [{
        key: 'build',
        value: function build() {
            var map = new Map();
            return [new PropsComputedData(map), new PropsComputed(map)];
        }
    }]);

    return PropsComputedData;
}();

var PropsComputed = exports.PropsComputed = function () {
    function PropsComputed(data) {
        _classCallCheck(this, PropsComputed);

        this._data = data;
    }

    _createClass(PropsComputed, [{
        key: 'get',
        value: function get(name) {
            var item = this._data.get(name);
            if (item) {
                return item.computed;
            }

            var newItem = createItem();
            this._data.set(name, newItem);

            return newItem.computed;
        }
    }, {
        key: 'value',
        value: function value(name) {
            return this.get(name).value();
        }
    }]);

    return PropsComputed;
}();