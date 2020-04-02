const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const cheerio = require('cheerio');

function spider(url, callback) {
  request(url, (err, response, body) => {
    console.log(extractLinksFromBody(body));
    callback(null, url);
  });
};

function extractLinksFromBody(body) {
  const $ = cheerio.load(body);
  const links = $('a');

  const result = Object.values(links).map((link) => {
    return link.attribs ? JSON.parse(JSON.stringify(link.attribs)).href : '';
  });

  return result;
}

spider(process.argv[2], (err, url) => {
  if (err) {
    console.log(err);
  }
  console.log(url);
});
