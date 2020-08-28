// sequential execution
const utilities = require('./utilities');

const request = utilities.promisify(require('request'));
const mkdirp = utilities.promisify(require('mkdirp'));
const fs = require('fs');
const readFile = utilities.promisify(fs.readFile);
const writeFile = utilities.promisify(fs.writeFile);
const path = require('path');

function spider(url, nesting) {
	let filename = utilities.urlToFilename(url);
	return readFile(filename, 'utf8')
		.then(
			(body) => console.log('filename exists'),
			(err) => {
				if (err.code !== 'ENOENT') {
					throw err;
				}

				return download(url, filename)
					.then(body => console.log('filename didnt exist'));
			}
		);
}

function download(url, filename) {
	console.log(`downloading ${url}`);
	let body;
	return request(url)
		.then(response => {
			body = response.body;
			return mkdirp(path.dirname(filename));
		})
		.then(() => writeFile(filename, body))
		.then(() => {
			console.log(`downloaded and saved: ${url}`);
			return body;
		});
}

spider(process.argv[2], 2)
	.then(() => console.log('download complete'))
	.catch(err => console.log(err));