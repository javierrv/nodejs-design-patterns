const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

function spider(url, nesting, callback) {
  request(url, (err, response, body) => {
    if (err) {
      callback(err);
    }
    if (!fs.existsSync('medium-level-' + nesting)) {
      extractLinksFromBody(body, nesting);
    } else {
      createDirectories(nesting, callback);
    }
    callback(null, url);
  });
};

function extractLinksFromBody(body, nesting) {
  const $ = cheerio.load(body);
  
  let stream = fs.createWriteStream('medium-level-' + nesting, {
    flags: 'a'
  });

  $('body').find('a').each((i, elem) => {
    if ($(elem).text() !== '' && $(elem).attr('href').substring(0, 8) === 'https://') { 
      stream.write($(elem).text() + '\t' + $(elem).attr('href') + '\n');
    }
  });

  stream.end();
}

function createDirectories(nesting, callback) {
  if (nesting === 0) {
    return process.nextTick(callback);
  }

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

spider(process.argv[2], 1, (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(`directories created for `, url);
});

// modify this to create a file with the urls