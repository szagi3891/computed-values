'use strict';

var _Value = require('../Value');

var _ValueComputed = require('../ValueComputed');

describe('Combine Value', function () {
    it('Basic', function () {
        var val1 = new _Value.Value(0);
        var val2 = new _Value.Value(2);

        var sum = _ValueComputed.ValueComputed.combine(val1.asComputed(), val2.asComputed(), function (val1, val2) {
            return val1 + val2;
        });

        var refresh = 0;
        var connection = sum.connect(function () {
            refresh++;
        });

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(2);

        val2.setValue(10);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(10);

        val1.setValue(5);

        expect(refresh).toBe(2);
        expect(connection.getValue()).toBe(15);
    });
});