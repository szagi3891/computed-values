'use strict';

var _ = require('..');

describe('SwitchMap', function () {
    it('Podstawowy test', function () {

        var id = new _.Value(2);

        var record2 = new _.Value('data (id2)');
        var record3 = new _.Value('data (id3)');

        var switchMapFn = function switchMapFn(id) {
            if (id === 2) {
                return record2.asComputed();
            }
            return record3.asComputed();
        };

        var out = id.asComputed().switchMap(switchMapFn);

        var refreshCount = 0;
        var refreshFunc = function refreshFunc() {
            refreshCount++;
        };

        var outConnection = out.connect(refreshFunc);
        var outConnection0000 = out.connect(refreshFunc);

        expect(refreshCount).toBe(0);
        expect(outConnection.getValue()).toBe('data (id2)');

        record3.setValue('3 - kjdasjkdkajs');

        expect(refreshCount).toBe(0);
        expect(outConnection.getValue()).toBe('data (id2)');

        id.setValue(3);

        expect(refreshCount).toBe(1);
        expect(outConnection.getValue()).toBe('3 - kjdasjkdkajs');

        record3.setValue('bla bla bla');

        expect(refreshCount).toBe(2);
        expect(outConnection.getValue()).toBe('bla bla bla');

        record2.setValue('nowa nowa nowa');

        expect(refreshCount).toBe(2);
        expect(outConnection.getValue()).toBe('bla bla bla');

        id.setValue(2);

        expect(refreshCount).toBe(3);
        expect(outConnection.getValue()).toBe('nowa nowa nowa');

        outConnection.disconnect();
        outConnection0000.disconnect();

        var refreshCount2 = 0;
        var refreshFunc2 = function refreshFunc2() {
            refreshCount2++;
        };

        var outConnection2 = out.connect(refreshFunc2);
        var outConnection3 = out.connect(refreshFunc2);

        expect(refreshCount).toBe(3);
        expect(refreshCount2).toBe(0);
        expect(outConnection2.getValue()).toBe('nowa nowa nowa');

        record2.setValue('hhh');

        expect(refreshCount).toBe(3);
        expect(refreshCount2).toBe(1);
        expect(outConnection2.getValue()).toBe('hhh');
        expect(outConnection3.getValue()).toBe('hhh');
    });

    it('Test notyfikacji na starcie', function () {

        var id = new _.Value(2);

        var record2 = new _.Value('data (id2)');
        var record3 = new _.Value('data (id3)');

        var out = id.asComputed().switchMap(function (id) {
            if (id === 2) {
                return record2.asComputed();
            }
            return record3.asComputed();
        });

        var refreshCount = 0;
        var outConnection = out.connect(function () {
            refreshCount++;
        });

        expect(refreshCount).toBe(0);
        expect(outConnection.getValue()).toBe('data (id2)');

        record2.setValue('hhh');

        expect(refreshCount).toBe(1);
        expect(outConnection.getValue()).toBe('hhh');
    });
});