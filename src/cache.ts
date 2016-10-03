const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');
const cheerio = require('cheerio');

const cacheDir = path.join(process.cwd(), 'cache');

function urlToPath(url) {
	const segments = 3;

	let pth = '';
	let hash = crypto.createHash('sha256').update(url).digest('hex');

	for(let i = 0; i < segments; i++) {
		pth += '/' + hash[0];
		hash = hash.slice(1);
	}

	return cacheDir + pth + '/' + hash;
}

function* getFromDisk(url) {
	let pth = urlToPath(url);
	let html = yield cb => fs.readFile(pth, 'utf8', cb);

	return cheerio.load(html);
}

function* getFromWeb(url) {
	let pth = urlToPath(url);
	let res = yield fetch(url);

	if(!res.ok) {
		throw new Error(`Request to ${url} failed: [${res.status}] ${res.statusText}`);
	}

	let html = yield res.text();
	yield cb => fs.outputFile(pth, html, cb);

	return cheerio.load(html);
}

exports.getPage = function* (url) {
	try {
		return yield getFromDisk(url);
	} catch(e) {
		return yield getFromWeb(url);
	}
};

exports.clearCache = function* () {
	return yield cb => fs.remove(cacheDir, cb);
};
