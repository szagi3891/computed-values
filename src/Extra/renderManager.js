//@flow

import { Connection } from '../Connection';
import { groupConnectionRefresh } from '../Extra/groupConnectionRefresh';

/*
componentWillUnmount() {
    disconnect(this._refresh);
}

_refresh = () => {
    this.forceUpdate();
}

constructor(props) {
    super(props);
    const oldRender = this.render.bind(this);
    this.render = () => catchSubscriptions(this._refresh, () => {
        return oldRender();
    });
}
*/

const isSSR = typeof window === 'undefined';

let catchStack = [];
const subs: Map<() => void, () => void> = new Map();

export const disconnect = (refreshFunction: () => void) => {
    const unsub = subs.get(refreshFunction);

    if (unsub) {
        unsub();
    }
};

export const catchSubscriptions = (refreshFunction: () => void, toExec: () => void) => {
    catchStack.push([]);

    toExec();

    const connections = catchStack.pop();

    const unsub = groupConnectionRefresh(connections, refreshFunction);
    disconnect(refreshFunction);
    subs.set(refreshFunction, unsub);
};

export const pushConnection = (connection: Connection<mixed>) => {
    if (isSSR) {
        connection.disconnect();
    } else {
        if (catchStack.length > 0) {
            catchStack[catchStack.length-1].push(connection);
        } else {
            connection.disconnect();
        }
    }
};
