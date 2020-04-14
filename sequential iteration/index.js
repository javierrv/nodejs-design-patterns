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
    if (!fs.existsSync('medium-level-' + nesting + '_' + (nesting - 1))) {
      createDirectories(body,nesting, callback);
    }
    callback(null, url);
  });
};

function createDirectories(body, nesting, callback) {
  if (nesting === 0) {
    console.log('nesting', nesting);
    return process.nextTick(callback);
  }

  utilities.extractLinksFromBody(body, nesting);

  const parentDirectory = './level-' + nesting + '_' + (nesting - 1) + '-links';

  if(!fs.existsSync(parentDirectory)){
    fs.mkdirSync(parentDirectory);
  }

  if (fs.existsSync('medium-level-' + nesting + '_' + (nesting - 1))) {
    const rl = readline.createInterface({
      input: fs.createReadStream('medium-level-' + nesting + '_' + (nesting - 1)),
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

spider(process.argv[2], 2, (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(`directories created for `, url);
});

// modify this to create a file with the urls

// spider(2)
// 1.- creates a file (medium-level-2_1)
  // link 2_1
  // link 2_2
  // link 2_3
// 2.- create directories for that file (level-2_1-links)
  // dir link 2_1
    // spider (1)
      // 1.- create a file (medium-level-1_0)
        // link 1_1
        // link 1_2
      // 2.- create directories for that file (level-1_0-links)
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
