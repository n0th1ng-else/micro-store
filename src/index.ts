import type {
	WeakData,
	DataSubscriber,
	DataHandler,
	MinimalStoreApi
} from './types';
import { subscribeStore, unsubscribeStore, notifySubscribers } from './helpers';

export const writableStore = <D>(
	item: WeakData<D> = null
): MinimalStoreApi<D> => {
	let subscribers: Array<DataSubscriber<D>> = [];
	let storedVal = item;

	return {
		update(handler: DataHandler<D>): Promise<void> {
			return Promise.resolve()
				.then(() => handler(item))
				.then(changedValue => {
					storedVal = changedValue;
					notifySubscribers(changedValue, subscribers);
				});
		},
		subscribe(subscription: DataSubscriber<D>): void {
			subscribeStore(storedVal, subscribers, subscription);
		},
		unsubscribe(subscription: DataSubscriber<D>): void {
			subscribers = unsubscribeStore(subscribers, subscription);
		},
		unsubscribeAll(): void {
			subscribers = unsubscribeStore(subscribers);
		}
	};
};

export const freezableStore = <D>(
	item: WeakData<D> = null,
	freezeCount = 1
): MinimalStoreApi<D> => {
	const store = writableStore(item);
	let callCounter = 0;

	return {
		update(handler: DataHandler<D>): Promise<void> {
			callCounter = callCounter > freezeCount ? callCounter : callCounter + 1;
			if (callCounter > freezeCount) {
				return Promise.resolve();
			}
			return store.update(handler).then(() => {
				if (callCounter >= freezeCount) {
					store.unsubscribeAll();
				}
			});
		},
		subscribe(subscription: DataSubscriber<D>): void {
			store.subscribe(subscription);

			if (callCounter >= freezeCount) {
				store.unsubscribe(subscription);
			}
		},
		unsubscribe(subscription: DataSubscriber<D>): void {
			store.unsubscribe(subscription);
		},
		unsubscribeAll(): void {
			store.unsubscribeAll();
		}
	};
};

export const readableStore = <D>(
	item: WeakData<D> = null
): MinimalStoreApi<D> => {
	const freezeCount = 0;
	return freezableStore(item, freezeCount);
};
