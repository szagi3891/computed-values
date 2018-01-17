//@flow

type CallbacksType<G> = {
    create: () => G,
    drop: null | ((val:G) => void)
};

export class ValueLayzy<G> {
    _callbacks: CallbacksType<G>;
    _value: null | { value: G};
    _onInicjalized: Array<(value: G) => void>;

    constructor(callbacks: CallbacksType<G>) {
        this._callbacks = callbacks;
        this._value = null;
        this._onInicjalized = [];
    }

    getValue(): G {
        const val = this._value;
        if (val) {
            return val.value;
        }

        const newValue = this._callbacks.create();

        for (const callbackInit of this._onInicjalized) {
            callbackInit(newValue);
        }

        this._value = { value: newValue };
        return newValue;
    }

    clear() {
        if (this._value) {
            const drop = this._callbacks.drop;

            if (drop) {
                drop(this._value.value);
            }
        }
        this._value = null;
    }

    onInicjalized(callback: (data: G) => void) {
        this._onInicjalized.push(callback);
    }
}