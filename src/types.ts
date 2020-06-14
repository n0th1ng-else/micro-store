export type WeakData<D> = D | null;

export type DataHandler<D> = (
	item: WeakData<D>
) => WeakData<D> | Promise<WeakData<D>>;

export type DataSubscriber<D> = (item: WeakData<D>) => void;

export interface MinimalStoreApi<D> {
	update(handler: DataHandler<D>): Promise<void>;
	subscribe(subscription: DataSubscriber<D>): void;
	unsubscribe(subscription: DataSubscriber<D>): void;
	unsubscribeAll(): void;
}
