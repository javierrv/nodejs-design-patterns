"use strict";

module.exports = function(callbackBasedApi) {
	return function promisified() {
		const args = [].slice.call(arguments); // arguments is a keyword
		return new Promise((resolve, reject) => {
			args.push(function(err, result) {
				if(err) {
					return reject(err);
				}
				if(arguments.length <= 2) {
					resolve(result);
				} else {
					resolve([].slice.call(arguments, 1));
				}
			});
			callbackBasedApi.apply(null, args);
		});
	}
};
