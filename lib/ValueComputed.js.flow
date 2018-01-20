//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';
import { ValueLayzy } from './ValueLayzy';

import { map } from './operators/map';
import { debounceTime } from './operators/debounceTime';
//import { switchMap } from './operators/switchMap';

export class ValueComputed<T> {
    _getSubscription: () => ValueSubscription;
    _getValue: () => T;

    constructor(getSubscription: () => ValueSubscription, getValue: () => T) {
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
        type ConnectionDataType = {
            subscription: ValueSubscription,
            self: ValueConnection<T>,
            target: ValueConnection<K>,
        };

        const getNewTarget = (self: ValueConnection<T>): ValueConnection<K> =>
            swithFunc(self.getValue()).bind();

        const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
            create: (): ConnectionDataType => {
                const self = this.bind();
                return {
                    subscription: new ValueSubscription(),
                    self,
                    target: getNewTarget(self)
                }
            },
            drop: (conn: ConnectionDataType) => {
                conn.self.disconnect();
                conn.target.disconnect();
            }
        });

        state.onNew((innerState: ConnectionDataType) => {
            innerState.self.onNotify(() => {
                const newTarget = getNewTarget(innerState.self);

                newTarget.onNotify(() => {
                    innerState.subscription.notify();
                });

                innerState.target.disconnect();
                innerState.target = newTarget;

                innerState.subscription.notify();
            });

            innerState.target.onNotify(() => {
                innerState.subscription.notify();
            });

            innerState.subscription.onDown(() => {
                state.clear();
            })
        });

        return new ValueComputed(
            () => state.getValue().subscription,
            (): K => state.getValue().target.getValue()
        );
    }

    debounceTime(timeout: number): ValueComputed<T> {
        const [getValueSubscription, getResult] = debounceTime(() => this.bind(), timeout);

        return new ValueComputed(
            getValueSubscription,
            getResult
        );
    }

    distinctUntilChanged(): ValueComputed<T> {
        return this;

        //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

