/** Small utility function to get a promise from a callback taking function */
export default function<E, T>(fn: (cb: (e?: E | null, d?: T) => any) => any) {
	return new Promise<T>((resolve, reject) => {
		fn((e?: E, d?: T) => {
			if(e) {
				reject(e);
			} else {
				resolve(d);
			}
		});
	});
}
