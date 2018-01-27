import { Value } from '../Value';
import { Computed } from '../Computed';

describe('Combine Value', () => {
    it('Basic', () => {
        const val1 = new Value('11');
        const val2 = new Value('22');

        const result = Computed.combine(
            val1.asComputed(),
            val2.asComputed(),
            (val1, val2) => `rr ${val1} tt ${val2} yy`
        );

        let refresh = 0;
        const connection = result.connect(() => {
            refresh++;
        });

        expect(refresh).toBe(0);
        expect(connection.getValue()).toBe('rr 11 tt 22 yy');
        expect(result.getValueSnapshot()).toBe('rr 11 tt 22 yy');

        val1.setValue('33');

        expect(refresh).toBe(1);
        expect(connection.getValue()).toBe('rr 33 tt 22 yy');
        expect(result.getValueSnapshot()).toBe('rr 33 tt 22 yy');

        val2.setValue('44');

        expect(refresh).toBe(2);
        expect(connection.getValue()).toBe('rr 33 tt 44 yy');
        expect(result.getValueSnapshot()).toBe('rr 33 tt 44 yy');

        connection.disconnect();

        expect(result.getValueSnapshot()).toBe('rr 33 tt 44 yy');
    });
});
