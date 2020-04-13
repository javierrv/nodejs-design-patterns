const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');
const utilities = require('./utilities');

function spider(url, nesting, callback) {
  request(url, (err, response, body) => {
    if (err) {
      callback(err);
    }
    if (!fs.existsSync('medium-level-' + nesting)) {
      utilities.extractLinksFromBody(body, nesting);
      createDirectories(nesting, callback);
    }
    callback(null, url);
  });
};

function createDirectories(nesting, callback) {
  const parentDirectory = './level-' + nesting + '-links';

  if(!fs.existsSync(parentDirectory)){
    fs.mkdirSync(parentDirectory);
  }

  if (fs.existsSync('medium-level-' + nesting)) {
    const rl = readline.createInterface({
      input: fs.createReadStream('medium-level-' + nesting),
      output: process.stdout,
      terminal: false
    });

    rl.on('line', line => {
      const lineCopy = line.split('\t');

      let dir = parentDirectory + '/' + lineCopy[0];

      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      spider(lineCopy[1], nesting - 1, err => {
        if (err) {
          return callback(err);
        }
      });
    });
  }
}

// spider(process.argv[2], 1, (err, url) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(`directories created for `, url);
// });

fs.rmdirSync('level-2-links');

// modify this to create a file with the urls

// spider(2)
// 1.- creates a file (medium-level-2)
  // link 2_1
  // link 2_2
  // link 2_3
// 2.- create directories for that file (level-2_1-links)
  // dir link 2_1
    // spider (1)
      // 1.- create a file (medium-level-1)
        // link 1_1
        // link 1_2
      // 2.- create directories for that file (level-1_1-links)
        // dir link 1_1
          // spider (0)
          // nextTick
        // dir link 1_2
          // spider (0)
          // nextTick
  // dir link 2_2
    // spider (1)
      // 1.- create a file (medium-level-1)
  // dir link 2_3
