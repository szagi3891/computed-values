//@flow

import { ValueComputed } from './ValueComputed';
import { ValueConnection } from './ValueConnection';
import { Subscription } from './Subscription';
import { ValueLayzy } from './ValueLayzy';
import { combine } from './operators/combine';

export const combineValue = <A, B, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    combine: ((a: A, b: B) => R)
): ValueComputed<R> => {
    //$FlowFixMe
    return combineValueArray([a,b], (arr) => combine(...arr));
}

export const combineValue3 = <A, B, C, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    c: ValueComputed<C>,
    combine: ((a: A, b: B, c: C) => R)
): ValueComputed<R> => {   
    //$FlowFixMe
    return combineValueArray([a,b,c], (arr) => combine(...arr));
}

export const combineValueArray = <A,R>(
    arr: Array<ValueComputed<A>>,
    combineFunc: ((arr: Array<A>) => R)
): ValueComputed<R> => {

    const arrBind = arr.map(arrItem => (() => arrItem.bind()));

    const [getValueSubscription, getResult] = combine(arrBind, combineFunc);

    return new ValueComputed(
        getValueSubscription,
        getResult
    );
};