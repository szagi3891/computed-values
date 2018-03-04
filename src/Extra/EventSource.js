//@flow

import { ValueLayzy } from '../Utils/ValueLayzy';
import { Subscription } from '../Utils/Subscription';

export class EventSource<T> {
    _state: ValueLayzy<Subscription<T>>;

    constructor(funcCreate?: ((trigger: ((value: T) => void)) => (() => void))) {
        this._state = new ValueLayzy({
            create: () => new Subscription(),
            drop: null
        });

        const funcCreateLocal = funcCreate;

        if (funcCreateLocal) {
            this._state.onNew((subscription: Subscription<T>) => {
                const unsubscribe = funcCreateLocal((value: T) => {
                    subscription.notify(value);
                });

                subscription.onDown(() => {
                    unsubscribe();
                    this._state.clear();
                });
            });
        }
    }

    trigger(param: T) {
        this._state.getValue().notify(param);
    }

    subscribe(func: (param: T) => void): (() => void) {
        return this._state.getValue().bind(func);
    }

    map<K>(funcMap: ((param:T) => K)): EventSource<K> {
        return new EventSource(trigger => {
            return this.subscribe((value) => {
                trigger(funcMap(value));
            });
        });
    }

    static merge<K>(...params: Array<EventSource<K>>): EventSource<K> {
        return new EventSource((trigger: ((value: K)=>void)): (()=>void) => {

            const subList = params.map((eventItem: EventSource<K>): (()=>void) => {
                return eventItem.subscribe(trigger);
            });

            return () => {
                for (const item of subList) {
                    item();
                }
            }
        });
    }
}
