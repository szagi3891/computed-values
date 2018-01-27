'use strict';

var _Value = require('../Value');

var _Computed = require('../Computed');

describe('Combine Value', function () {
    it('Basic', function () {
        var val1 = new _Value.Value('11');
        var val2 = new _Value.Value('22');

        var result = _Computed.Computed.combine(val1.asComputed(), val2.asComputed(), function (val1, val2) {
            return 'rr ' + val1 + ' tt ' + val2 + ' yy';
        });

        var refresh = 0;
        var connection = result.connect(function () {
            refresh++;
        });

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe('rr 11 tt 22 yy');
        expect(result.getValueSnapshot()).toBe('rr 11 tt 22 yy');

        val1.setValue('33');

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe('rr 33 tt 22 yy');
        expect(result.getValueSnapshot()).toBe('rr 33 tt 22 yy');

        val2.setValue('44');

        expect(refresh).toBe(2);
        expect(connection.getValue()).toBe('rr 33 tt 44 yy');
        expect(result.getValueSnapshot()).toBe('rr 33 tt 44 yy');

        connection.disconnect();

        expect(result.getValueSnapshot()).toBe('rr 33 tt 44 yy');
    });
});