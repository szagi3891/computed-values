//@flow
import { Value } from '../Value';
import { Computed } from '../Computed';
import { transaction } from '../transaction';

type PropsItem = {
    value: Value<mixed>,
    computed: Computed<mixed>,
};

export type PropsComputedInnerMap = Map<string, PropsItem>;

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

        const newItem = PropsComputed.newItem();
        this._data.set(name, newItem);

        return newItem.computed;
    }

    value<Key: string>(name: Key): $ElementType<T, Key> {
        return this.get(name).value();
    }

    static newItem(): PropsItem {
        const newValue = new Value();
        const newComputed = newValue.asComputed();
        return {
            value: newValue,
            computed: newComputed
        }
    }

    static setNewProps<T: {}>(data: PropsComputedInnerMap, props: T) {
        transaction(() => {
            for (const [key, value] of Object.entries(props)) {
                const item = data.get(key);
                if (item) {
                    PropsComputed.setValue(item, value);
                } else {
                    const newItem = PropsComputed.newItem();
                    PropsComputed.setValue(newItem, value);
                    data.set(key, newItem);
                }
            }
        });
    }
    
    static setValue(item: PropsItem, newValue: mixed) {
        const oldValue = item.value.value();
        if (oldValue !== newValue) {
            item.value.setValue(newValue);
        }
    }    
}