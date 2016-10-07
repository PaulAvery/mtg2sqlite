import * as fs from 'fs-extra';
import * as path from 'path';
import * as fetch from 'node-fetch';
import * as crypto from 'crypto';
import * as cheerio from 'cheerio';

import promise from './promise';

const cacheDir = path.join(process.cwd(), 'cache');

/** Convert a url to the cachepath on disk */
function urlToPath(url: string) {
	const segments = 3;

	let pth = '';
	let hash = crypto.createHash('sha256').update(url).digest('hex');

	for(let i = 0; i < segments; i++) {
		pth += '/' + hash[0];
		hash = hash.slice(1);
	}

	return cacheDir + pth + '/' + hash;
}

/** Get the given page from the on-disk cache */
async function getFromDisk(url: string) {
	let pth = urlToPath(url);
	let html = await promise<NodeJS.ErrnoException, string>(cb => fs.readFile(pth, 'utf8', cb));

	return cheerio.load(html);
}

/** Get the given url from the web and save it to the cache */
async function getFromWeb(url: string) {
	let pth = urlToPath(url);
	let res = await fetch(url);

	if(!res.ok) {
		throw new Error(`Request to ${url} failed: [${res.status}] ${res.statusText}`);
	}

	let html = await res.text();
	await promise(cb => fs.outputFile(pth, html, cb));

	return cheerio.load(html);
}

/** Get a cheerio object of the given url. Uses cache if possible */
export async function getPage(url: string) {
	try {
		return await getFromDisk(url);
	} catch(e) {
		return await getFromWeb(url);
	}
};

/** Clear out the entire cache */
export async function clearCache() {
	await promise(cb => fs.remove(cacheDir, cb));
};
