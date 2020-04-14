const request = require('request');
const fs = require('fs');
const utilities = require('./utilities');
const cheerio = require('cheerio');

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);

  fs.exists(filename, exists => {
    if (exists) {
      return callback(null, filename);
    }

    request(url, (err, response, body) => {
      if (err) {
        callback(err);
      }

      extractLinksFromBody(body);
      callback(null, url);
    });
  });
};

function extractLinksFromBody(body) {
  const $ = cheerio.load(body);

  let stream = fs.createWriteStream('medium', {
    flags: 'a'
  });

  $('body').find('a').each((i, elem) => {
    if ($(elem).text() !== '') {
      stream.write($(elem).attr('href') + '\n');
    }
  });

  stream.end();
}

spider(process.argv[2], (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(`directories created for `, url);
});

// executes a synchronous operation on each item in collection
// modifying it to create only a file with the links