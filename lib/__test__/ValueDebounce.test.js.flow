import { ValueDebounce } from '../ValueDebounce';

describe('Debounce', () => {
    it('Basic', () => {

        jest.useFakeTimers();

        const data = new ValueDebounce(11, 500);

        const out = data.asComputed();

        let refresh = 0;
        const connection = out.connect(() => {
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
