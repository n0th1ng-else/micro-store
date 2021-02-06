import type { WeakData, DataSubscriber } from './types';

export function notifySubscribers<D>(
	item: WeakData<D>,
	subscriptions: Array<DataSubscriber<D>>
): void {
	subscriptions.forEach(subscription => subscription(item));
}

export function subscribeStore<D>(
	item: WeakData<D>,
	subscriptions: Array<DataSubscriber<D>>,
	subscription: DataSubscriber<D>
): void {
	subscriptions.push(subscription);
	notifySubscribers(item, [subscription]);
}

export function unsubscribeStore<D>(
	subscriptions: Array<DataSubscriber<D>>,
	subscription?: DataSubscriber<D>
): Array<DataSubscriber<D>> {
	if (!subscription) {
		const emptySubscribers: Array<DataSubscriber<D>> = [];
		return emptySubscribers;
	}
	return subscriptions.filter(handler => handler !== subscription);
}
