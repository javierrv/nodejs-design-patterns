"use strict";

const fs = require('fs');
const urlParse = require('url').parse;
const slug = require('slug');
const path = require('path');
const cheerio = require('cheerio');

module.exports.urlToFilename = function urlToFilename(url) {
  const parsedUrl = urlParse(url);
  const urlPath = parsedUrl.path.split('/')
    .filter(function(component) {
      return component !== '';
    })
    .map(function(component) {
      return slug(component, { remove: null });
    })
    .join('/');
  let filename = path.join(parsedUrl.hostname, urlPath);
  if(!path.extname(filename).match(/htm/)) {
    filename += '.html';
  }
  return filename;
};

module.exports.extractLinksFromBody = function(body, nesting) {
  const $ = cheerio.load(body);
  let links = [];
  
  let stream = fs.createWriteStream('medium-level-' + nesting + '_' +(nesting - 1), {
    flags: 'a'
  });

  $('body').find('a').each((i, elem) => {
    if ($(elem).text() !== '' && $(elem).attr('href').substring(0, 8) === 'https://') {
      // stream.write($(elem).text() + '\t' + $(elem).attr('href') + '\n');
      stream.write(nesting + '_' + i + '\t' + $(elem).attr('href') + '\n');
      links.push($(elem).attr('href'));
    }
  });

  stream.end();
  return links;
}