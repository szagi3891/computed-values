//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { pushToRefresh } from '../transaction';
import { Value } from '../Value';
import { Box } from '../Utils/Box';

import { map } from './Operator.Map';
import { switchMap } from './Operator.SwitchMap';
import { combine } from './Operator.Combine';

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
    switch<T: Computed<K>>(): Computed<K> { ---> T przy założeniu że T to Computed<K>
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

    distinctUntilChanged(): Computed<T> {
        return this;

        //TODO - do zaimplementowania
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

        connection.onNotify(() => {
            pushToRefresh(onRefresh);
        });

        return connection;
    }
}

