//@flow

import { Subscription } from '../Utils/Subscription';
import { Connection } from '../Connection';
import { ValueLayzy } from '../Utils/ValueLayzy';
import { Box } from '../Utils/Box';

class ResultValue<T, M> {
    _connection: Connection<T>;
    _mapFun: (value: T) => M;
    //TODO - Box argumentu ...
    _result: Box<M>;
    _isValid: bool;

    constructor(connection: Connection<T>, mapFun: (value: T) => M) {
        this._connection = connection;
        this._mapFun = mapFun;
        this._result = this._getResult();
        this._isValid = true;
    }

    _getResult(): Box<M> {
        const result = this._mapFun(this._connection.getValueBox().getValue());
        return new Box(result);
    }

    setAsNotValid() {
        this._isValid = false;
    }

    getResult(): Box<M> {
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

export const map = <T,M>(
    parentBind: () => Connection<T>,
    mapFun: (value: T) => M
): [() => Subscription, () => Box<M>] => {

    type InnerType = {
        subscription: Subscription,
        connection: Connection<T>,
        result: ResultValue<T, M>,
    };

    const state: ValueLayzy<InnerType> = new ValueLayzy({
        create: () => {
            const connection = parentBind();

            return ({
                subscription: new Subscription(),
                connection,
                result: new ResultValue(connection, mapFun)
            });
        },
        drop: (inner: InnerType) => inner.connection.disconnect()
    });

    state.onNew((stateInner: InnerType) => {
        stateInner.connection.onNotify(() => {
            stateInner.result.setAsNotValid();
            stateInner.subscription.notify();
        });
        stateInner.subscription.onDown(() => {
            state.clear();
        });
    });

    return [
        (): Subscription => state.getValue().subscription,
        (): Box<M> => state.getValue().result.getResult()
    ];
};
