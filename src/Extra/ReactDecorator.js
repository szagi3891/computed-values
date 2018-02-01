export const ReactDecorator = (defComponent) => {
    return (...args) => {
        const inst = new decoratedComponent(...args);

        const refresh = () => {
            //Component.prototype.forceUpdate.call(inst);
            inst.forceUpdate();
        };

        let oldComponentWillUnmount = null;
        if (typeof inst.componentWillUnmount === 'function') {
            const oldComponentWillUnmount = inst.componentWillUnmount.bind(inst);
        }

        inst.componentWillUnmount = () => {
            catchSubscriptionsDisconnect(refresh);
            if (oldComponentWillUnmount) {
                oldComponentWillUnmount();
            }
        };

        const oldRender = inst.render.bind(inst);

        //$FlowFixMe
        inst.render = () => {
            return catchSubscriptions(refresh, () => oldRender());
        };

        return inst;
    };
};
