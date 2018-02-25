//@flow
import { Value } from '../Value';
import { Computed } from '../Computed';
import { transaction } from '../transaction';

type PropsItem = {
    value: Value<mixed>,
    computed: Computed<mixed>,
};

type PropsComputedInnerMap = Map<string, PropsItem>;

const createItem = (): PropsItem => {
    const newValue = new Value();
    const newComputed = newValue.asComputed();
    return {
        value: newValue,
        computed: newComputed
    };
};
    
const setValue = (item: PropsItem, newValue: mixed) => {
    const oldValue = item.value.getValueSnapshot();
    if (oldValue !== newValue) {
        item.value.setValue(newValue);
    }
};

export class PropsComputedData<T: {}> {
    _data: PropsComputedInnerMap;

    constructor(data: PropsComputedInnerMap) {
        this._data = data;
    }

    static build(): [PropsComputedData<T>, PropsComputed<T>] {
        const map = new Map();
        return [
            new PropsComputedData(map),
            new PropsComputed(map)
        ];
    }

    setNewProps<T: {}>(props: T) {
        transaction(() => {
            for (const [key, value] of Object.entries(props)) {
                const item = this._data.get(key);
                if (item) {
                    setValue(item, value);
                } else {
                    const newItem = createItem();
                    setValue(newItem, value);
                    this._data.set(key, newItem);
                }
            }
        });
    }
}

export class PropsComputed<T: {}> {
    _data: PropsComputedInnerMap;

    constructor(data: PropsComputedInnerMap) {
        this._data = data;
    }

    get<Key: string>(name: Key): Computed<$ElementType<T, Key>> {
        const item = this._data.get(name);
        if (item) {
            return item.computed;
        }

        const newItem = createItem();
        this._data.set(name, newItem);

        return newItem.computed;
    }

    value<Key: string>(name: Key): $ElementType<T, Key> {
        return this.get(name).value();
    }
}