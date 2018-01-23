'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('..');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Source = function () {
    function Source() {
        _classCallCheck(this, Source);

        this._callback = new Map();
    }

    _createClass(Source, [{
        key: 'bind',
        value: function bind(func) {
            var _this = this;

            var token = {};

            this._callback.set(token, func);

            return function () {
                _this._callback.delete(token);
            };
        }
    }, {
        key: 'emit',
        value: function emit(value) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._callback.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

                    callback(value);
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
    }]);

    return Source;
}();

describe('SwitchMap', function () {
    it('Podstawowy test', function () {

        var source = new Source();

        var out = _.Computed.create(2, function (setValue) {

            var unsub = source.bind(function (nextValue) {
                setValue(nextValue);
            });

            return function () {
                unsub();
            };
        });

        var refreshCount = 0;
        var refresh = function refresh() {
            refreshCount++;
        };
        var outConnect = out.connect(refresh);

        expect(refreshCount).toBe(0);
        expect(outConnect.getValue()).toBe(2);

        source.emit(10);

        expect(refreshCount).toBe(1);
        expect(outConnect.getValue()).toBe(10);

        outConnect.disconnect();
        expect(refreshCount).toBe(1);

        var refreshCount2 = 0;
        var refresh2 = function refresh2() {
            refreshCount2++;
        };

        var out2 = out.connect(refresh2);

        expect(refreshCount).toBe(1);
        expect(refreshCount2).toBe(0);
        expect(out2.getValue()).toBe(2);

        source.emit(12);

        expect(refreshCount).toBe(1);
        expect(refreshCount2).toBe(1);
        expect(out2.getValue()).toBe(12);
    });

    it('Computed.of', function () {
        var aa = _.Computed.of(33);

        var connect = aa.connect(function () {});

        expect(connect.getValue()).toBe(33);
    });
});