'use strict';

var _ValueDebounce = require('../ValueDebounce');

describe('Debounce', function () {
    it('Basic', function () {

        jest.useFakeTimers();

        var data = new _ValueDebounce.ValueDebounce(11, 500);

        var out = data.asComputed();

        var refresh = 0;
        var connection = out.connect(function () {
            refresh++;
        });

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        data.setValue(333);

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(333);

        data.setValue(444);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(333);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(333);

        data.setValue(555);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(333);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(333);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(2);
        expect(connection.getValue()).toBe(555);

        connection.disconnect();
    });
});