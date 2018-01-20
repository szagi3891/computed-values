//@flow

import { Subscription } from './Subscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';
import { ValueLayzy } from './ValueLayzy';

import { map } from './operators/map';
import { debounceTime } from './operators/debounceTime';
import { switchMap } from './operators/switchMap';
import { combine } from './operators/combine';

const combineArray = <A,R>(
    arr: Array<ValueComputed<A>>,
    combineFunc: ((arr: Array<A>) => R)
): ValueComputed<R> => {

    const arrBind = arr.map(arrItem => (() => arrItem.bind()));

    const [getValueSubscription, getResult] = combine(arrBind, combineFunc);

    return new ValueComputed(
        getValueSubscription,
        getResult
    );
}

export class ValueComputed<T> {
    _getSubscription: () => Subscription;
    _getValue: () => T;

    constructor(getSubscription: () => Subscription, getValue: () => T) {
        this._getSubscription = getSubscription;
        this._getValue = getValue;
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
        const [getValueSubscription, getResult] = map(() => this.bind(), mapFun);

        return new ValueComputed(
            getValueSubscription,
            getResult
        );
    }

    switchMap<K>(swithFunc: ((value: T) => ValueComputed<K>)): ValueComputed<K> {
        const [getValueSubscription, getResult] = switchMap(
            () => this.bind(),
            (value: T) => swithFunc(value).bind()
        );

        return new ValueComputed(
            getValueSubscription,
            getResult
        );
    }

    debounceTime(timeout: number): ValueComputed<T> {
        const [getValueSubscription, getResult] = debounceTime(() => this.bind(), timeout);

        return new ValueComputed(
            getValueSubscription,
            getResult
        );
    }

    static of<K>(value: K): ValueComputed<K> {
        const subscription = new Subscription();
        return new ValueComputed(
            () => subscription,
            () => value
        );
    }

    static create<K>(initValue: K, fnCreate: (fnInner: ((setValue: K)=>void)) => (() => void)): ValueComputed<K> {
        
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

        return new ValueComputed(
            () => state.getValue().subscription,
            () => state.getValue().value
        );
    }

    distinctUntilChanged(): ValueComputed<T> {
        return this;

        //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    static combine<A, B, R>(
        a: ValueComputed<A>,
        b: ValueComputed<B>,
        combine: ((a: A, b: B) => R)
    ): ValueComputed<R> {
        //$FlowFixMe
        return combineArray([a,b], (arr) => combine(...arr));
    }

    static combine3<A, B, C, R>(
        a: ValueComputed<A>,
        b: ValueComputed<B>,
        c: ValueComputed<C>,
        combine: ((a: A, b: B, c: C) => R)
    ): ValueComputed<R> {   
        //$FlowFixMe
        return combineArray([a,b,c], (arr) => combine(...arr));
    }

    static combineArray<A,R>(
        arr: Array<ValueComputed<A>>,
        combineFunc: ((arr: Array<A>) => R)
    ): ValueComputed<R> {
        return combineArray(arr, combineFunc);
    }

    bind(): ValueConnection<T> {
        return new ValueConnection(
            this._getSubscription(),
            this._getValue
        );
    }

    connect(onRefresh: (() => void)): ValueConnection<T> {
        const connection = new ValueConnection(
            this._getSubscription(),
            this._getValue
        );
                                                    //TODO - w ValueConnection dodać metodę onRefresh
        connection.onNotify(() => {
            pushToRefresh(onRefresh);
        });

        return connection;
    }
}

