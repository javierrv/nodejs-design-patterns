const fs = require('fs');
const readline = require('readline');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');
const utilities = require('./utilities');

function spider(url, nesting, callback) {
  const filename = utilities.urlToFilename(url);

  fs.readFile(filename, 'utf8', (err, body) => {
    if (err) {
      if (err.code !== 'ENOENT') {  // enoent means not existence
        return callback(err);
      }
      // only handles error type for unexistence
      return requestWebsite(url, filename, (err, body) => { // why return?
        if (err) {
          return callback(err);
        }
        // spiderLinks
      });
    }
    // spiderLinks
  });

  // fs.exists(filename, exists => {
  //   if (exists) {
  //     return callback(null, filename, false);
  //   }

  //   // download
  //   requestWebsite(url, filename, err => {
  //     if (err) {
  //       return callback(err);
  //     }
  //     callback(null, filename, true);
  //   });
  // });
};

// download
function requestWebsite(url, filename, callback) {
  console.log(`downloading ${url}`);
  request(url, (err, response, body) => {
    if (err) {
      return callback(err);
    }
    // saveFile
    utilities.extractLinksFromBody(filename, body, err => {
      if (err) {
        return callback(err);
      }
      console.log(`downloaded and saved ${url}`);
      callback(null, url); // url is not longer considered
    });

    // if (!fs.existsSync('medium-level-' + nesting + '_' + (nesting - 1))) {
    //   createDirectories(body,nesting, callback);
    // }
    // callback(null, url);
  });
}

function spiderLinks(currentUrl, body, nesting, callback) { // this needs to be a similar spiderLinks, old createDirectories
  if (nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);

  function iterate(index) {
    if (index === links.length) {
      return callback();
    }

    spider(links[index], nesting - 1, err => {
      if (err) {
        return callback(err);
      }
      iterate(index + 1);
    }); 
  }

  iterate(0);

  // utilities.extractLinksFromBody(body, nesting);

  // const parentDirectory = './level-' + nesting + '_' + (nesting - 1) + '-links';

  // if(!fs.existsSync(parentDirectory)){
  //   fs.mkdirSync(parentDirectory);
  // }

  // if (fs.existsSync('medium-level-' + nesting + '_' + (nesting - 1))) {
  //   const rl = readline.createInterface({
  //     input: fs.createReadStream('medium-level-' + nesting + '_' + (nesting - 1)),
  //     output: process.stdout,
  //     terminal: false
  //   });

  //   rl.on('line', line => {
  //     const lineCopy = line.split('\t');

  //     let dir = parentDirectory + '/' + lineCopy[0];

  //     if(!fs.existsSync(dir)){
  //       fs.mkdirSync(dir);
  //     }

  //     spider(lineCopy[1], nesting - 1, err => {
  //       if (err) {
  //         return callback(err);
  //       }
  //     });
  //   });
  // }
}

spider(process.argv[2], 1, (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(`directories created for `, url);
});
