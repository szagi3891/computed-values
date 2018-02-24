import { catchSubscriptionsDisconnect, catchSubscriptions } from './RenderManager';

export const ReactDecorator = (ReactComponent) => {
    return (...args) => {
        const inst = new ReactComponent(...args);

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
