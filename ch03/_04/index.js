// race conditions

const spidering = new Map();
function spider(url, nesting, callback) {
	if (spidering.has(url)) {
		return process.nextTick(callback);
	}
	spidering.set(url, true);
}