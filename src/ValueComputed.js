//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';
//import { ValueLayzy } from './ValueLayzy';

export class ValueComputed<T> {
    _getSubscription: () => ValueSubscription;
    _getValue: () => T;

    constructor(getSubscription: () => ValueSubscription, getValue: () => T) {
        this._getSubscription = getSubscription;
        this._getValue = getValue;
    }

    /*
    map<M>(mapFun: (value: T) => M): ValueComputed<M> {

        type InnerType = {
            result: Val<M>,
            parent: ValueConnection<T>,
            subscription: ValueSubscription,
        };

        const inner: ValueLayzy<InnerType> = new Val(
            (): InnerType => {
                const result = new Val(
                    () => mapFun(this._getValue())
                );

                const subscription = new ValueSubscription();

                const parent = this.bind(() => {
                    result.clear();
                    subscription.notify();
                });

                return {
                    result,
                    parent,
                    subscription
                };
            },
            (inner: InnerType) => {
                inner.parent.disconnect();
            }
        );

        inner.onInicjalized((innerValue: InnerType) => {
            innerValue.onDown(() => {
                inner.clear();
            });
        });

       return new ValueComputed(
            (): ValueSubscription => inner.getValue().subscription,
            getResult: (): M => inner.getValue().result.getValue()
       );
    }
    */

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
        type ConnectionDataType = {
            parent: ValueConnection<T>,
            result: null | { value: M }
        };

        let connection: null | ConnectionDataType = null;

        const subscription = new ValueSubscription();
        
        subscription.onDown(() => {
            if (connection !== null) {
                connection.parent.disconnect();
                connection = null;
            } else {
                throw Error('Map - disconnect - Incorrect code branch');
            }
        });

        const clearCache = () => {
            if (connection) {
                connection.result = null;
            } else {
                throw Error('Map - clearCache - Incorrect code branch')
            }
        };

        const notify = () => {
            clearCache();
            subscription.notify();
        };

        const getConnection = (): ConnectionDataType => {
            if (connection !== null) {
                return connection;
            }

            const newConnect = this.bind(notify);

            connection = {
                parent: newConnect,
                result: null
            };

            return connection;
        };

        const getResult = (): M => {
            const connection = getConnection();

            if (connection.result === null) {
                const result = mapFun(this._getValue());
                connection.result = { value: result };
                return result;
            } else {
                return connection.result.value;
            }
        };

        return new ValueComputed(
            () => subscription,
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
            return targetComputed.bind(() => {
                subscription.notify();
            });
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
            const self = this.bind(notify);

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
        let connection: null | ValueConnection<T> = null;
        let timer: TimeoutID | null = null;

        const clearConnection = () => {
            if (connection !== null) {
                connection.disconnect();
                connection = null;

                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }
            } else {
                throw Error('Switch - disconnect - Incorrect code branch');
            }
        };

        const subscription = new ValueSubscription();
        subscription.onDown(clearConnection);

        const notify = () => {
            if (connection !== null) {
                if (timer !== null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(() => {
                    subscription.notify();
                    timer = null;
                }, timeout);
            } else {
                throw Error('Switch - notify - Incorrect code branch');
            }
        };


        const getConnection = (): ValueConnection<T> => {
            if (connection !== null) {
                return connection;
            }

            const newConnect = this.bind(notify);
            connection = newConnect;
            return connection;
        };

        const getResult = (): T => {
            return getConnection().getValue();
        };

        return new ValueComputed(
            () => subscription,
            getResult
        );
    }

    distinctUntilChanged(): ValueComputed<T> {
        return this;

        //TODO - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    bind(notify: () => void): ValueConnection<T> {
        const disconnect = this._getSubscription().bind(notify);
        return new ValueConnection(
            () => this._getValue(),
            disconnect
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        const disconnect = this._getSubscription().bind(
            () => {
                if (onRefresh) {
                    pushToRefresh(onRefresh);
                }
            }
        );

        return new ValueConnection(
            () => this._getValue(),
            disconnect
        );
    }
}

