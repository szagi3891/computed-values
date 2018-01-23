//@flow

import { Subscription } from './Utils/Subscription';
import { Connection } from './Connection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';
import { ValueLayzy } from './Utils/ValueLayzy';

import { map } from './Operators/map';
import { debounceTime } from './Operators/debounceTime';
//import { delay } from './Operators/delay';
import { switchMap } from './Operators/switchMap';
import { combine } from './Operators/combine';
import { create } from './Operators/create';

const combineArray = <A,R>(
    arr: Array<Computed<A>>,
    combineFunc: ((arr: Array<A>) => R)
): Computed<R> => {

    const arrBind = arr.map(arrItem => (() => arrItem.bind()));

    const [getValueSubscription, getResult] = combine(arrBind, combineFunc);

    return new Computed(
        getValueSubscription,
        getResult
    );
}

export class Computed<T> {
    _getSubscription: () => Subscription;
    _getValue: () => T;

    constructor(getSubscription: () => Subscription, getValue: () => T) {
        this._getSubscription = getSubscription;
        this._getValue = getValue;
    }

    map<M>(mapFun: (value: T) => M): Computed<M> {
        const [getValueSubscription, getResult] = map(() => this.bind(), mapFun);

        return new Computed(
            getValueSubscription,
            getResult
        );
    }

    switchMap<K>(swithFunc: ((value: T) => Computed<K>)): Computed<K> {
        const [getValueSubscription, getResult] = switchMap(
            () => this.bind(),
            (value: T) => swithFunc(value).bind()
        );

        return new Computed(
            getValueSubscription,
            getResult
        );
    }

    debounceTime(timeout: number): Computed<T> {
        const [getValueSubscription, getResult] = debounceTime(() => this.bind(), timeout);

        return new Computed(
            getValueSubscription,
            getResult
        );
    }

    /*
    delay(timeout: number): Computed<T> {
        const [getValueSubscription, getResult] = delay(() => this.bind(), timeout);

        return new Computed(
            getValueSubscription,
            getResult
        );
    }
    */

    static of<K>(value: K): Computed<K> {
        const subscription = new Subscription();
        return new Computed(
            () => subscription,
            () => value
        );
    }

    static create<K>(initValue: K, fnCreate: (fnInner: ((setValue: K)=>void)) => (() => void)): Computed<K> {
        const [getValueSubscription, getResult] = create(initValue, fnCreate);

        return new Computed(
            getValueSubscription,
            getResult
        );
    }

    distinctUntilChanged(): Computed<T> {
        return this;

        //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    static combine<A, B, R>(
        a: Computed<A>,
        b: Computed<B>,
        combine: ((a: A, b: B) => R)
    ): Computed<R> {
        //$FlowFixMe
        return combineArray([a,b], (arr) => combine(...arr));
    }

    static combine3<A, B, C, R>(
        a: Computed<A>,
        b: Computed<B>,
        c: Computed<C>,
        combine: ((a: A, b: B, c: C) => R)
    ): Computed<R> {   
        //$FlowFixMe
        return combineArray([a,b,c], (arr) => combine(...arr));
    }

    static combineArray<A,R>(
        arr: Array<Computed<A>>,
        combineFunc: ((arr: Array<A>) => R)
    ): Computed<R> {
        return combineArray(arr, combineFunc);
    }

    getValueSnapshot(): T {
        const connection = this.bind();
        const value = connection.getValue();
        connection.disconnect();
        return value;
    }

    bind(): Connection<T> {
        return new Connection(
            this._getSubscription(),
            this._getValue
        );
    }

    connect(onRefresh: (() => void)): Connection<T> {
        const connection = new Connection(
            this._getSubscription(),
            this._getValue
        );
                                                    //TODO - w Connection dodać metodę onRefresh
        connection.onNotify(() => {
            pushToRefresh(onRefresh);
        });

        return connection;
    }
}

