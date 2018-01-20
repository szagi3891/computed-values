import { Value, ValueComputed } from '..';

class Source {
    _callback: Map<mixed, (data: K) => void>;

    constructor() {
        this._callback = new Map();
    }

    bind(func: (data: K) => void): (() => void) {
        const token = {};

        this._callback.set(token, func);

        return () => {
            this._callback.delete(token);
        }
    }

    emit(value: K) {
        for (const callback of this._callback.values()) {
            callback(value);
        }
    }
}

describe('SwitchMap', () => {
    it('Podstawowy test', () => {

        const source = new Source();

        const out = ValueComputed.create(2, (setValue) => {

            const unsub = source.bind((nextValue: number) => {
                setValue(nextValue);
            });

            return () => {
                unsub();
            };
        });

        let refreshCount = 0;
        const refresh = () => {
            refreshCount++;
        };
        const outConnect = out.connect(refresh);

        expect(refreshCount).toBe(0);
        expect(outConnect.getValue()).toBe(2);

        source.emit(10);


        expect(refreshCount).toBe(1);
        expect(outConnect.getValue()).toBe(10);

        outConnect.disconnect();
        expect(refreshCount).toBe(1);

        let refreshCount2 = 0;
        const refresh2 = () => {
            refreshCount2++;
        };

        const out2 = out.connect(refresh2);

        expect(refreshCount).toBe(1);
        expect(refreshCount2).toBe(0);
        expect(out2.getValue()).toBe(2);

        source.emit(12);

        expect(refreshCount).toBe(1);
        expect(refreshCount2).toBe(1);
        expect(out2.getValue()).toBe(12);

    });

    it('ValueComputed.of', () => {
        const aa = ValueComputed.of(33);

        const connect = aa.connect(() => {   
        });

        expect(connect.getValue()).toBe(33);
    })
});
