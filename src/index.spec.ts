import { writableStore, readableStore, freezableStore } from '.';

describe('Store tests', () => {
	describe('writable', () => {
		describe('should create', () => {
			it('empty store item', done => {
				const store = writableStore();
				store.subscribe(data => {
					expect(data).toBeNull();
					done();
				});
			});

			it('store item with value', done => {
				const store = writableStore<number>(10);
				store.subscribe(data => {
					expect(data).toBe(10);
					done();
				});
			});
		});

		describe('should update', () => {
			it('store with any apppropriate value', done => {
				const store = writableStore<string>();

				const handler = jest
					.fn()
					.mockImplementationOnce(data => {
						expect(data).toBeNull();
					})
					.mockImplementationOnce(data => {
						expect(data).toBe('test');
						done();
					});

				store.subscribe(handler);

				store.update(() => 'test');
			});

			it('store with any apppropriate value using the old one', done => {
				const initial = 'my';
				const val = 'test';
				const store = writableStore<string>(initial);

				const handler = jest
					.fn()
					.mockImplementationOnce(data => {
						expect(data).toBe(initial);
					})
					.mockImplementationOnce(data => {
						expect(data).toBe(`${initial} ${val}`);
						done();
					});

				store.subscribe(handler);

				store.update(old => `${old} ${val}`);
			});

			it('store with any apppropriate value using async function', done => {
				const store = writableStore<string>();
				const handler = jest
					.fn()
					.mockImplementationOnce(data => {
						expect(data).toBeNull();
					})
					.mockImplementationOnce(data => {
						expect(data).toBe('test');
						done();
					});

				store.subscribe(handler);

				store.update(() => Promise.resolve('test'));
			});

			it('store with any apppropriate value using async function with old val', done => {
				const initial = 'my';
				const val = 'test';
				const store = writableStore<string>(initial);

				const handler = jest
					.fn()
					.mockImplementationOnce(data => {
						expect(data).toBe(initial);
					})
					.mockImplementationOnce(data => {
						expect(data).toBe(`${initial} ${val}`);
						done();
					});

				store.subscribe(handler);

				store.update(old => Promise.resolve(`${old} ${val}`));
			});
		});

		it('should not call handler if unsubscribed', () => {
			const initial = 'my';
			const val = 'test';
			const store = writableStore<string>(initial);

			const handler = jest.fn();

			store.subscribe(handler);
			store.unsubscribe(handler);

			return store
				.update(old => Promise.resolve(`${old} ${val}`))
				.then(() => {
					expect(handler.mock.calls.length).toBe(1);
				});
		});
	});

	describe('readable', () => {
		it('can not change the value even if null', done => {
			const store = readableStore<string>();

			const handler = jest
				.fn()
				.mockImplementationOnce(data => {
					expect(data).toBeNull();
				})
				.mockImplementationOnce(() => {
					done.fail(new Error('store can not be changed!'));
				});

			store.subscribe(handler);

			store.update(() => 'new value').then(() => done());
		});

		it('can not change the value', done => {
			const initial = 'my';
			const val = 'test';
			const store = readableStore<string>(initial);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => {
					expect(data).toBe(initial);
				})
				.mockImplementationOnce(() => {
					done.fail(new Error('store can not be changed!'));
				});

			store.subscribe(handler);

			store.update(() => val).then(() => done());
		});
	});
});
