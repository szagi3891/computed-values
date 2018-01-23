//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { Value } from '../Value';
import { ValueLayzy } from '../Utils/ValueLayzy';

export const create = <K>(
    initValue: K,
    fnCreate: (fnInner: ((setValue: K) => void)) => (() => void)
): [() => Subscription, () => K] => {

    type DataInnerType = {
        subscription: Subscription,
        value: K
    };

    const state: ValueLayzy<DataInnerType> = new ValueLayzy({
        create: () => {
            return {
                subscription: new Subscription(),
                value: initValue
            };
        },
        drop: null
    });

    state.onNew((stateInner) => {
        const unsubscribe = fnCreate((newValue: K) => {
            stateInner.value = newValue;
            stateInner.subscription.notify();
        });

        stateInner.subscription.onDown(() => {
            unsubscribe();
            state.clear();
        });
    });

    return [
        () => state.getValue().subscription,
        () => state.getValue().value
    ];
}