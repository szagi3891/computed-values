import { Value } from '../Value';
import { Computed } from '../Computed';

describe('DistinctUntilChanged', () => {
    it('Where the internal type is comparable', () => {
        expect(1).toBe(1);

        const val = new Value(123);

        const out = val.asComputed().distinctUntilChanged();

        let refresh = 0;
        const connection = out.connect(() => {
            refresh++;
        });

        const valBox1 = connection.getValueBox();

        val.setValue(444);

        const valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(refresh).toBe(1);

        val.setValue(444);

        const valBox3 = connection.getValueBox();

        expect(valBox2 === valBox3).toBe(true);
        expect(valBox2.getValue() === valBox3.getValue()).toBe(true);
        expect(refresh).toBe(2);
    });

    it('Where the internal type is not comparable', () => {
        expect(1).toBe(1);

        const val = new Value({tok: 123});

        const out = val.asComputed().distinctUntilChanged();

        let refresh = 0;
        const connection = out.connect(() => {
            refresh++;
        });

        const valBox1 = connection.getValueBox();

        val.setValue({tok: 444});

        const valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(valBox1.getValue().tok !== valBox2.getValue().tok).toBe(true);
        expect(refresh).toBe(1);

        val.setValue({tok: 444});

        const valBox3 = connection.getValueBox();

        expect(valBox2 !== valBox3).toBe(true);
        expect(valBox2.getValue() !== valBox3.getValue()).toBe(true);
        expect(valBox2.getValue().tok === valBox3.getValue().tok).toBe(true);
        expect(refresh).toBe(2);
    });

    it('Where the internal type is not comparable and a comparative function is provided', () => {
        expect(1).toBe(1);

        const val = new Value({tok: 123});

        const out = val.asComputed().distinctUntilChanged((arg1, arg2) => arg1.tok === arg2.tok);

        let refresh = 0;
        const connection = out.connect(() => {
            refresh++;
        });

        const valBox1 = connection.getValueBox();

        val.setValue({tok: 444});

        const valBox2 = connection.getValueBox();

        expect(valBox1 !== valBox2).toBe(true);
        expect(valBox1.getValue() !== valBox2.getValue()).toBe(true);
        expect(valBox1.getValue().tok !== valBox2.getValue().tok).toBe(true);
        expect(refresh).toBe(1);

        val.setValue({tok: 444});

        const valBox3 = connection.getValueBox();

        expect(valBox2 === valBox3).toBe(true);
        expect(valBox2.getValue() === valBox3.getValue()).toBe(true);
        expect(valBox2.getValue().tok === valBox3.getValue().tok).toBe(true);
        expect(refresh).toBe(2);
    });
});
