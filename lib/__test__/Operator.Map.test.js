'use strict';

var _ = require('..');

describe('', function () {
    it('Podstawowy test', function () {

        var counter8 = new _.Value(44);

        var counter9 = counter8.asComputed().map(function (value) {
            return value + 1;
        });

        var counter10 = counter9.map(function (value) {
            return 'dsadsa ' + value;
        });

        var refreshCount = 0;

        var connection = counter10.connect(function () {
            refreshCount++;
        });

        expect(refreshCount).toBe(0);
        expect(connection.getValue()).toBe('dsadsa 45');

        counter8.setValue(334444);

        expect(refreshCount).toBe(1);
        expect(connection.getValue()).toBe('dsadsa 334445');

        counter8.setValue(6);

        expect(refreshCount).toBe(2);
        expect(connection.getValue()).toBe('dsadsa 7');

        connection.disconnect();
    });
});