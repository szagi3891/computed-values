import { Timer } from '../Utils/Timer';

//https://facebook.github.io/jest/docs/en/timer-mocks.html

describe('Timer', () => {
    it('Basic', () => {

        jest.useFakeTimers();

        const timer = new Timer(1000);

        let count = 0;
        const aaa = () => {
            count++;
        }

        expect(count).toBe(0);

        timer.onReady(aaa);

        expect(count).toBe(0);

        jest.advanceTimersByTime(600);
        expect(count).toBe(0);
        jest.advanceTimersByTime(600);
        expect(count).toBe(1);
    });

    it('Subscription after run', () => {

        jest.useFakeTimers();

        const timer = new Timer(1000);

        let count = 0;
        const aaa = () => {
            count++;
        }

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
