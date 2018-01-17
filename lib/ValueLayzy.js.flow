//@flow

type CallbacksType<G> = {
    createValue: () => G,
    onDown: null | ((val:G) => void)
};

class Val<G> {
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

        const createValue = this._callbacks.createValue;
        const newValue: G = createValue();

        for (const callbackInit of this._onInicjalized) {
            callbackInit(newValue);
        }

        this._value = { value: newValue };
        return newValue;
    }

    clear() {
        if (this._value) {
            const onDown = this._callbacks.onDown;

            if (onDown) {
                onDown(this._value.value);
            }
        }
        this._value = null;
    }

    onInicjalized(callback: (data: G) => void) {
        this._onInicjalized.push(callback);
    }
}