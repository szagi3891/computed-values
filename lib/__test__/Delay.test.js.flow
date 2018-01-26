import { Value } from '../Value';

describe('Debounce', () => {
    it('Basic', () => {

        jest.useFakeTimers();

        const data = new Value(11);

        const out = data.asComputed().delay(500);

        let refresh = 0;
        const connection = out.connect(() => {
            refresh++;
        });

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        data.setValue(22);

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe(11);

        data.setValue(33);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe(22);

        jest.advanceTimersByTime(300);

        expect(refresh).toBe(2);
        expect(connection.getValue()).toBe(33);
    });
});