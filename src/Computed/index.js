//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { pushToRefresh } from '../transaction';
import { Value } from '../Value';
import { Box } from '../Utils/Box';
import { catchSubscriptionsPush } from '../Extra/renderManager';

import { map } from './Map';
import { switchMap } from './SwitchMap';
import { combine } from './Combine';
import { DistinctUntilChanged } from './DistinctUntilChanged';

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
    _getValue: () => Box<T>;

    constructor(getSubscription: () => Subscription, getValue: () => Box<T>) {
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

    /*
    switch<T: Computed<K>>(): Computed<K> { ---> Where T: Computed<K>
        const [getValueSubscription, getResult] = switchMap(
            () => this.bind(),
            (value: T) => value.bind()
        );

        return new Computed(
            getValueSubscription,
            getResult
        );
    }
    */

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

    static of<K>(value: K): Computed<K> {
        return new Value(value).asComputed();
    }

    distinctUntilChanged(compare?: (arg1: T, arg2: T) => bool): Computed<T> {
        const isEqual = compare ? compare : null;

        const [getValueSubscription, getResult] = DistinctUntilChanged(
            () => this.bind(),
            isEqual
        );

        return new Computed(
            getValueSubscription,
            getResult
        );
    }

    select<K>(
        mapFun: (value: T) => K,
        compare?: (arg1: K, arg2: K) => bool
    ): Computed<K> {
        return this.map(mapFun).distinctUntilChanged(compare);
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

    value(): T {
        const connection = self.bind();
        const value = connection.getValue();
    
        catchSubscriptionsPush(connection);

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

        connection.onNotify(() => {
            pushToRefresh(onRefresh);
        });

        return connection;
    }
}

