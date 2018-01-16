'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Value = require('../Value');

var _ValueComputed = require('../ValueComputed');

var _Log = require('./Log');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isSSR = typeof window === 'undefined';

var BaseComponent = exports.BaseComponent = function (_React$Component) {
    _inherits(BaseComponent, _React$Component);

    _createClass(BaseComponent, [{
        key: 'componentDidCatch',
        value: function componentDidCatch(error, info) {
            (0, _Log.logError)('componentDidCatch -> ', error, info);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this._propsValue.setValue(nextProps);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._connections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    }]);

    function BaseComponent(props) {
        _classCallCheck(this, BaseComponent);

        var _this = _possibleConstructorReturn(this, (BaseComponent.__proto__ || Object.getPrototypeOf(BaseComponent)).call(this));

        _this._refresh = function () {
            _this.forceUpdate();
        };

        _this._connections = [];

        _this._propsValue = new _Value.Value(props);
        _this.propsComputed = _this._propsValue.asComputed();

        var oldRender = _this.render.bind(_this);

        //$FlowFixMe
        _this.render = function () {

            var old_connections = _this._connections;
            _this._connections = [];

            var renderOut = oldRender();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = old_connections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    item();
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

            return renderOut;
        };
        return _this;
    }

    _createClass(BaseComponent, [{
        key: 'getFromComputed',
        value: function getFromComputed(computed) {
            var connection = computed.connect(this._refresh);

            if (isSSR) {
                connection.disconnect();
            } else {
                this._connections.push(connection.disconnect);
            }

            return connection.getValue();
        }
    }]);

    return BaseComponent;
}(React.Component);