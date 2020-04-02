const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const cheerio = require('cheerio');

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  fs.exists(filename, exists => {
    if(exists) {
      return callback(null);
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
  const links = $('a');

  links.each((i, elem) => {
    console.log($(this).text());
  });

  Object.values(links).forEach((link, index) => {
    // console.log(link.attribs && JSON.parse(JSON.stringify(link.attribs)).href ? index : '');
    const dir = './' + (link.attribs && JSON.parse(JSON.stringify(link.attribs)).href ? index : '');

    // if(!fs.existsSync(dir)){
    //   fs.mkdirSync(dir);
    // }
  });
}

spider(process.argv[2], (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(url);
});
