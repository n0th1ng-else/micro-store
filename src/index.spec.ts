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
					.mockImplementationOnce(data => expect(data).toBeNull())
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
					.mockImplementationOnce(data => expect(data).toBe(initial))
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
					.mockImplementationOnce(data => expect(data).toBeNull())
					.mockImplementationOnce(data => {
						expect(data).toBe('test');
						done();
					});

				store.subscribe(handler);

				store.update(() => Promise.resolve('test'));
			});

			it('bubbles error in case async update failed', done => {
				const store = writableStore<string>();
				const handler = jest
					.fn()
					.mockImplementationOnce(data => expect(data).toBeNull())
					.mockImplementationOnce(() =>
						done.fail(new Error('handler must not be called!'))
					);

				store.subscribe(handler);

				store
					.update(() => Promise.reject(new Error('Something went wrong')))
					.then(
						() => done.fail(new Error('should be the error')),
						error => {
							expect(error.message).toBe('Something went wrong');
							done();
						}
					);
			});

			it('store with any apppropriate value using async function with old val', done => {
				const initial = 'my';
				const val = 'test';
				const store = writableStore<string>(initial);

				const handler = jest
					.fn()
					.mockImplementationOnce(data => expect(data).toBe(initial))
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
				.then(() => expect(handler.mock.calls.length).toBe(1));
		});
	});

	describe('readable', () => {
		it('can not change the value even if null', done => {
			const store = readableStore<string>();

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBeNull())
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler);

			store.update(() => 'new value').then(() => done());
		});

		it('can not change the value', done => {
			const initial = 'my';
			const val = 'test';
			const store = readableStore<string>(initial);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler);

			store.update(() => val).then(() => done());
		});
	});

	describe('freezable', () => {
		it('can change value once', done => {
			const initial = 'my';
			const val = 'test';
			const store = freezableStore<string>(initial);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(data => expect(data).toBe(val))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler);

			store
				.update(() => val)
				.then(() => store.update(() => 'another one'))
				.then(() => done());
		});

		it('never changes value when freezed', done => {
			const initial = 'my';
			const val = 'test';
			const store = freezableStore<string>(initial);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(data => expect(data).toBe(val))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler);

			store
				.update(() => val)
				.then(() => store.update(() => 'another one'))
				.then(() => store.update(() => 'all new'))
				.then(() => done());
		});

		it('can change value only twice as set in param', done => {
			const initial = 'my';
			const second = 'test';
			const final = 'value';
			const updateCount = 2;
			const store = freezableStore<string>(initial, updateCount);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(data => expect(data).toBe(second))
				.mockImplementationOnce(data => expect(data).toBe(final))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler);

			store
				.update(() => second)
				.then(() => store.update(() => final))
				.then(() => store.update(() => 'extra value'))
				.then(() => done());
		});

		it('can exec a new subscriber only once with last value', done => {
			const initial = 'my';
			const second = 'test';
			const final = 'value';
			const updateCount = 2;
			const store = freezableStore<string>(initial, updateCount);

			const handler = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(final))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store
				.update(() => second)
				.then(() => store.update(() => final))
				.then(() => store.subscribe(handler))
				.then(() => store.update(() => 'extra value'))
				.then(() => done());
		});

		it('can unsubscribe all handlers', done => {
			const initial = 'my';
			const second = 'test';
			const store = freezableStore<string>(initial);

			const handler1 = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(() =>
					done.fail(new Error('handler must not be called!'))
				);

			const handler2 = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(() =>
					done.fail(new Error('handler must not be called!'))
				);

			store.subscribe(handler1);
			store.subscribe(handler2);

			store.unsubscribeAll();

			store.update(() => second).then(() => done());
		});

		it('can unsubscribe specific handler', done => {
			const initial = 'my';
			const second = 'test';
			const store = freezableStore<string>(initial);

			const handler1 = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(data => expect(data).toBe(second))
				.mockImplementationOnce(() =>
					done.fail(new Error('handler must not be called!'))
				);

			const handler2 = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBe(initial))
				.mockImplementationOnce(() =>
					done.fail(new Error('handler must not be called!'))
				);

			store.subscribe(handler1);
			store.subscribe(handler2);

			store.unsubscribe(handler2);

			store.update(() => second).then(() => done());
		});

		it('can get null as the initial value', done => {
			const second = 'test';
			const store = freezableStore<string>();

			const handler1 = jest
				.fn()
				.mockImplementationOnce(data => expect(data).toBeNull())
				.mockImplementationOnce(data => expect(data).toBe(second))
				.mockImplementationOnce(() =>
					done.fail(new Error('store can not be changed!'))
				);

			store.subscribe(handler1);

			store.update(() => second).then(() => done());
		});
	});
});
