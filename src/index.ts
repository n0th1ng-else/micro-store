import { WeakData, DataSubscription, DataSubscriber, DataHandler } from './types';
import { updateStore, subscribeStore, unsubscribeStore } from './helpers';

export const writableStore = <D>(item: WeakData<D> = null) => {
	let subscribers: Array<DataSubscription<D>> = [];

	return {
		update(handler: DataHandler<D>): Promise<void> {
			return updateStore(item, subscribers, handler);
		},
		subscribe(subscription: DataSubscriber<D>): void {
			return subscribeStore(item, subscribers, subscription);
		},
		unsubscribe(subscription: DataSubscriber<D>): void {
			subscribers = unsubscribeStore(subscribers, subscription);
		},
		unsubscribeAll(): void {
			subscribers = unsubscribeStore(subscribers);
		}
	};
};

export const freezableStore = <D>(item: WeakData<D> = null, freezeCount = 1) => {
	const store = writableStore(item);
	let callCounter = 0;

	return {
		update(handler: DataHandler<D>): Promise<void> {
			callCounter++;
			if (callCounter > freezeCount) {
				store.unsubscribeAll();
				return Promise.resolve();
			}
			return store.update(handler);
		},
		subscribe(subscription: DataSubscriber<D>): void {
			store.subscribe(subscription);

			if (callCounter > freezeCount) {
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

export const readableStore = <D>(item: WeakData<D> = null) => {
	const freezeCount = 0;
	const store = freezableStore(item, freezeCount);
	return store;
};
