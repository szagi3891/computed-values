'use strict';

var _Timer = require('../Utils/Timer');

//https://facebook.github.io/jest/docs/en/timer-mocks.html

describe('Timer', function () {
    it('Basic', function () {

        jest.useFakeTimers();

        var timer = new _Timer.Timer(1000);

        var count = 0;
        var aaa = function aaa() {
            count++;
        };

        expect(count).toBe(0);

        timer.onReady(aaa);

        expect(count).toBe(0);

        jest.advanceTimersByTime(600);
        expect(count).toBe(0);
        jest.advanceTimersByTime(600);
        expect(count).toBe(1);
    });

    it('Subscription after run', function () {

        jest.useFakeTimers();

        var timer = new _Timer.Timer(1000);

        var count = 0;
        var aaa = function aaa() {
            count++;
        };

        expect(count).toBe(0);

        expect(count).toBe(0);

        jest.advanceTimersByTime(600);
        expect(count).toBe(0);
        jest.advanceTimersByTime(600);
        expect(count).toBe(0);

        timer.onReady(aaa);
        expect(count).toBe(1);
    });
});