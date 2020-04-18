"use strict";

const fs = require('fs');
const urlParse = require('url').parse;
const path = require('path');
const cheerio = require('cheerio');
const slug = require('slug');
const mkdirp = require('mkdirp');

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

module.exports.getLinkUrl = function getLinkUrl(currentUrl, element) {
  const link = urlResolve(currentUrl, element.attribs.href || "");
  const parsedLink = urlParse(link);
  const currentParsedUrl = urlParse(currentUrl);
  if(parsedLink.hostname !== currentParsedUrl.hostname
    || !parsedLink.pathname) {
    return null;
  }
  return link;
};

module.exports.getPageLinks = function getPageLinks(currentUrl, body) {
  return [].slice.call(cheerio.load(body)('a'))
    .map(function(element) {
      return module.exports.getLinkUrl(currentUrl, element);
    })
    .filter(function(element) {
      return !!element;
    });
};

// saveFile
module.exports.extractLinksFromBody = function(filename, body, callback) {
  const $ = cheerio.load(body);
  
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return callback(err);
    }

    let stream = fs.createWriteStream(filename, {
      flags: 'a'
    });

    $('body').find('a').each((i, elem) => {
      if ($(elem).text() !== '' && $(elem).attr('href').substring(0, 8) === 'https://') {
        // stream.write($(elem).text() + '\t' + $(elem).attr('href') + '\n');
        // stream.write(nesting + '_' + i + '\t' + $(elem).attr('href') + '\n');
        stream.write($(elem).attr('href') + '\n');
      }
    });

    stream.end();
  });
}
