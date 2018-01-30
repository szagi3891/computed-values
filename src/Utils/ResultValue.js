//@flow
import { Connection } from '../Connection';
import { Box } from '../Utils/Box';

export class ResultValue<T, R> {
    _connection: Array<Connection<T>>;
    _mapFun: (value: Array<T>) => R;
    _args: Array<Box<T>>;
    _result: Box<R>;
    _isValid: bool;

    constructor(connection: Array<Connection<T>>, mapFun: (value: Array<T>) => R) {
        this._connection = connection;
        this._mapFun = mapFun;

        const args = this._getArgs();
        const result = this._getResult(args);

        this._args = args;
        this._result = result;
        this._isValid = true;
    }

    _getArgs(): Array<Box<T>> {
        return this._connection.map(item => item.getValueBox());
    }

    _getResult(args: Array<Box<T>>): Box<R> {
        const argsInner: Array<T> = args.map(item => item.getValue());
        const result = this._mapFun(argsInner);
        return new Box(result);
    }

    _argsEq<K>(argsPrev: Array<Box<K>>, argsNext: Array<Box<K>>): bool {
        return argsPrev === argsNext;
    }

    setAsNotValid() {
        this._isValid = false;
    }

    getResult(): Box<R> {
        if (this._isValid) {
            return this._result;
        }

        const newArgs = this._getArgs();
        if (this._argsEq(this._args, newArgs)) {
            this._isValid = true;
            return this._result;
        }

        const result = this._getResult(newArgs);

        this._isValid = true;
        this._args = newArgs;
        this._result = result;
        this._isValid = true;

        return result;
    }
}
