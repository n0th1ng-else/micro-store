import { WeakData, DataSubscription, DataSubscriber, DataHandler } from './types';

export function notify<D>(item: WeakData<D>, subscriptions: Array<DataSubscription<D>>): void {
	subscriptions.forEach(handler => {
		handler.subscription(item);
	});
}

export function subscribeStore<D>(
	item: WeakData<D>,
	subscriptions: Array<DataSubscription<D>>,
	subscription: DataSubscriber<D>
): void {
	const subscriber: DataSubscription<D> = {
		subscription
	};

	subscriptions.push(subscriber);
	notify(item, [subscriber]);
}

export function unsubscribeStore<D>(
	subscriptions: Array<DataSubscription<D>>,
	subscription?: DataSubscriber<D>
): Array<DataSubscription<D>> {
	if (!subscription) {
		const emptySubscribers: Array<DataSubscription<D>> = [];
		return emptySubscribers;
	}
	return subscriptions.filter(handler => handler.subscription !== subscription);
}

export function updateStore<D>(
	item: WeakData<D>,
	subscriptions: Array<DataSubscription<D>>,
	handler: DataHandler<D>
): Promise<void> {
	return Promise.resolve()
		.then(() => handler(item))
		.then(change => {
			item = change;
			notify(item, subscriptions);
		});
}
