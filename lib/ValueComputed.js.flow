//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';
import { ValueLayzy } from './ValueLayzy';

import { map } from './operators/map';
import { debounceTime } from './operators/debounceTime';

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
            self: ValueConnection<T>,
            target: ValueConnection<K>,
        };

        let connection: null | ConnectionDataType = null;

        const clearConnection = () => {
            if (connection !== null) {
                connection.self.disconnect();
                connection.target.disconnect();
                connection = null;
            } else {
                throw Error('Switch - disconnect - Incorrect code branch');
            }
        };

        const subscription = new ValueSubscription();
        subscription.onDown(clearConnection);

        const getTargetBySelf = (self: ValueConnection<T>): ValueConnection<K> => {
            const targetComputed = swithFunc(self.getValue());
            const conn = targetComputed.bind();
            conn.onNotify(() => {
                subscription.notify();
            });
            return conn;
        };

        const notify = () => {
            if (connection !== null) {
                const newTarget = getTargetBySelf(connection.self);
                connection.target.disconnect();
                connection.target = newTarget;
            } else {
                throw Error('Switch - notify - Incorrect code branch');
            }

            subscription.notify();
        };

        const getNewConnection = (): ConnectionDataType => {
            const self = this.bind();
            self.onNotify(notify);
            return {
                self,
                target: getTargetBySelf(self)
            };
        };

        const getConnection = (): ConnectionDataType => {
            if (connection !== null) {
                return connection;
            }

            const newConnect = getNewConnection();
            connection = newConnect;
            return connection;
        };

        const getResult = (): K => {
            const connection = getConnection();
            return connection.target.getValue();
        };

        return new ValueComputed(
            () => subscription,
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

    distinctUntilChanged(): ValueComputed<T> {
        return this;

        //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    bind(): ValueConnection<T> {
        return new ValueConnection(
            this._getSubscription,
            this._getValue
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        const connection = new ValueConnection(
            this._getSubscription,
            this._getValue
        );
                                                    //TODO - w ValueConnection dodać metodę onRefresh
        const localOnRefresh = onRefresh;

        if (localOnRefresh) {
            connection.onNotify(() => {
                pushToRefresh(localOnRefresh);
            })
        }

        return connection;
    }
}

