import { Value, ValueComputed } from '..';

describe('SwitchMap', () => {
    it('Podstawowy test', () => {

        const id = new Value(2);

        const record2 = new Value('data (id2)');
        const record3 = new Value('data (id3)');

        const switchMapFn = (id: number): ValueComputed<string> => {
            if (id === 2) {
                return record2.asComputed();
            }
            return record3.asComputed();
        }

        const out = id.asComputed().switchMap(switchMapFn);

        let refreshCount = 0;
        const outConnection = out.connect(() => {
            refreshCount++;
        });

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
    });
});