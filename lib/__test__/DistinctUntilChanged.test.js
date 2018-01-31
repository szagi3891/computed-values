'use strict';

var _Value = require('../Value');

var _Computed = require('../Computed');

describe('DistinctUntilChanged', function () {
    it('Where the internal type is comparable', function () {
        expect(1).toBe(1);

        var val = new _Value.Value(123);

        var out = val.asComputed().distinctUntilChanged();

        var refresh = 0;
        var connection = out.connect(function () {
            refresh++;
        });

        var valBox1 = connection.getValueBox();

        val.setValue(444);

        var valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(refresh).toBe(1);

        val.setValue(444);

        var valBox3 = connection.getValueBox();

        expect(valBox2 === valBox3).toBe(true);
        expect(valBox2.getValue() === valBox3.getValue()).toBe(true);
        expect(refresh).toBe(2);
    });

    it('Where the internal type is not comparable', function () {
        expect(1).toBe(1);

        var val = new _Value.Value({ tok: 123 });

        var out = val.asComputed().distinctUntilChanged();

        var refresh = 0;
        var connection = out.connect(function () {
            refresh++;
        });

        var valBox1 = connection.getValueBox();

        val.setValue({ tok: 444 });

        var valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(valBox1.getValue().tok !== valBox2.getValue().tok).toBe(true);
        expect(refresh).toBe(1);

        val.setValue({ tok: 444 });

        var valBox3 = connection.getValueBox();

        expect(valBox2 !== valBox3).toBe(true);
        expect(valBox2.getValue() !== valBox3.getValue()).toBe(true);
        expect(valBox2.getValue().tok === valBox3.getValue().tok).toBe(true);
        expect(refresh).toBe(2);
    });

    it('Where the internal type is not comparable and a comparative function is provided', function () {
        expect(1).toBe(1);

        var val = new _Value.Value({ tok: 123 });

        var out = val.asComputed().distinctUntilChanged(function (arg1, arg2) {
            return arg1.tok === arg2.tok;
        });

        var refresh = 0;
        var connection = out.connect(function () {
            refresh++;
        });

        var valBox1 = connection.getValueBox();

        val.setValue({ tok: 444 });

        var valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(valBox1.getValue().tok !== valBox2.getValue().tok).toBe(true);
        expect(refresh).toBe(1);

        val.setValue({ tok: 444 });

        var valBox3 = connection.getValueBox();

        expect(valBox2 === valBox3).toBe(true);
        expect(valBox2.getValue() === valBox3.getValue()).toBe(true);
        expect(valBox2.getValue().tok === valBox3.getValue().tok).toBe(true);
        expect(refresh).toBe(2);
    });
});