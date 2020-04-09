const request = require('request');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');

function spider(url, callback) {
  request(url, (err, response, body) => {
    if (err) {
      callback(err);
    }
    if (!fs.existsSync('medium')) {
      extractLinksFromBody(body);
    } else {
      createDirectories();
    }
    callback(null, url);
  });
};

function extractLinksFromBody(body) {
  const $ = cheerio.load(body);
  
  let stream = fs.createWriteStream('medium', {
    flags: 'a'
  });

  $('body').find('a').each((i, elem) => {
    if ($(elem).text() !== '') { 
      stream.write($(elem).text() + '\t' + $(elem).attr('href') + '\n');
    }
  });

  stream.end();
}

function createDirectories() {
  const parentDirectory = './links';

  if(!fs.existsSync(parentDirectory)){
    fs.mkdirSync(parentDirectory);
  }

  if (fs.existsSync('medium')) {
    const rl = readline.createInterface({
      input: fs.createReadStream('medium'),
      output: process.stdout,
      terminal: false
    });

    rl.on('line', line => {
      const lineCopy = line.split('\t');

      let dir = parentDirectory + '/' + lineCopy[0];

      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      // call spiderLinks
    });
  }
}

spider(process.argv[2], (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(`directories created for `, url);
});

// modify this to create a file with the urls