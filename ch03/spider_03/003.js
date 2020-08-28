const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);
  fs.readFile(filename, 'utf8', (err, body) => {
    if(err) {
      if(err.code !== 'ENOENT') { // enoent means not existence
        return callback(err);
      }
      // only handles error type for unexistence
      return download(url, filename, (err, body) => {
        if(err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }
    spiderLinks(url, body, nesting, callback); // if file doesn't exists is never executed
  });
}

function spiderLinks(currentUrl, body, nesting, callback) { // this callback is from spider call
  if(nesting === 0) {
    return process.nextTick(callback); // return makes after writeFile to continue the iteration?
  }
  const links = utilities.getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(callback);
  }

  let completed = 0, hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return callback(err);
    }
    if (++completed === links.length && !hasErrors) {
      return callback();
    }
  }

  links.forEach(link => {
    spider(link, nesting - 1, done);
  });
}

function download(url, filename, callback) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if(err) {
      return callback(err);
    }
    saveFile(filename, body, err => {
      if(err) {
        return callback(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      callback(null, body); // body is not longer used
    });
  });
}


function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), err => { // inside directories map the url
    if(err) {
      return callback(err);
    }
    fs.writeFile(filename, contents, callback);
  });
}

spider(process.argv[2], 2, (err, filename, downloaded) => {
  if(err) {
    console.log(err);
  } else if(downloaded){
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
