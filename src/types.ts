export type WeakData<D> = D | null;

export type DataHandler<D> = (item: WeakData<D>) => WeakData<D> | Promise<WeakData<D>>;

export type DataSubscriber<D> = (item: WeakData<D>) => void;

export interface DataSubscription<D> {
	subscription: DataSubscriber<D>;
}
