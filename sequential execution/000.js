const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const cheerio = require('cheerio');

function spider(url, callback) {
  request(url, (err, response, body) => {
    const $ = cheerio.load(body);
    const a = $('a');
    console.log(a.text());
    callback(null, url);
  });
};

spider(process.argv[2], (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(url);
});


// find links in a website then it prints all the its titles
// node index http://www.facebook.com