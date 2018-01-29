//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Box } from '../Utils/Box';

class ResultValue<T, R> {
    _connections: Array<Connection<T>>;
    _combine: (arr: Array<T>) => R;
    //TODO - Box argumentu ...
    _result: Box<R>;
    _isValid: bool;

    constructor(connections: Array<Connection<T>>, combine: ((arr: Array<T>) => R)) {
        this._connections = connections;
        this._combine = combine;
        this._result = this._getResult();
        this._isValid = true;
    }

    _getResult(): Box<R> {
        return new Box(
            this._combine(
                this._connections.map(
                    connectionItem => connectionItem.getValueBox().getValue()
                )
            )
        );
    }

    setAsNotValid() {
        this._isValid = false;
    }

    getResult(): Box<R> {
        if (this._isValid) {
            return this._result;
        }

        const result = this._getResult();

        this._isValid = true;
        this._result = result;
        this._isValid = true;

        return result;
    }
}

export const combine = <A,R>(
    bindArr: Array<() => Connection<A>>,
    combine: ((arr: Array<A>) => R)
): [() => Subscription, () => Box<R>] => {

    type ConnectionDataType = {
        subscription: Subscription,
        connections: Array<Connection<A>>,
        result: ResultValue<A, R>
    };

    const state: ValueLayzy<ConnectionDataType> = new ValueLayzy({
        create: () => {
            const connections = bindArr.map(itemBind => itemBind());

            return {
                subscription: new Subscription(),
                connections: connections,
                result: new ResultValue(connections, combine)
            };
        },
        drop: (stateInner) => {
            for (const connectionItem of stateInner.connections) {
                connectionItem.disconnect();
            }
        }
    });

    state.onNew((stateInner) => {
        stateInner.subscription.onDown(() => {
            state.clear();
        });

        const notify = () => {
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        };

        for (const connectionItem of stateInner.connections) {
            connectionItem.onNotify(notify);
        }
    });

    return [
        () => state.getValue().subscription,
        (): Box<R> => state.getValue().result.getResult()
    ];
}

