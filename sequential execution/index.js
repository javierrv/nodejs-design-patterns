const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const utilities = require('./utilities');

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);

  fs.exists(filename, exists => {
    if (exists) {
      return callback(null, filename, false);
    }

    // download
    requestWebsite(url, filename, err => {
      if (err) {
        return callback(err);
      }
      callback(null, filename, true);
    });
  });
};

// download
function requestWebsite(url, filename, callback) {
  console.log(`downloading ${url}`);
  request(url, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    // saveFile
    extractLinksFromBody(filename, body, err => {
      if (err) {
        return callback(err);
      }
      console.log(`downloaded and saved: ${url}`);
      callback(null, url); // url won't be considered after
    });
  });
}

// saveFile
function extractLinksFromBody(filename, body, callback) {
  const $ = cheerio.load(body);

  mkdirp(path.dirname(filename), err => {
    if (err) {
      return callback(err);
    }

    let stream = fs.createWriteStream(filename, {
      flags: 'a'
    });

    $('body').find('a').each((i, elem) => {
      if ($(elem).text() !== '') {
        stream.write($(elem).attr('href') + '\n');
      }
    });

    stream.end();
  });
}

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err);
  } else if (downloaded) {
    console.log(`Completed the download of ${filename}`);
  } else {
    console.log(`${filename} was already downloaded`);
  }
});

// executes a synchronous operation on each item in collection
// modifying it to create only a file with the links