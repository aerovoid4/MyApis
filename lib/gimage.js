const axios = require("axios");
const cheerio = require("cheerio");
const fetch = require('node-fetch');

async function GoogleImage(query) {
    const response = await fetch(`https://www.google.com/search?q=${query}&tbm=isch`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        },
    });
    const data = await response.text();
    const $ = cheerio.load(data);
    const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
    const matches = $.html().matchAll(pattern);
    const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));
    return [...matches]
    .map(({
        groups
    }) => decodeUrl(groups?.url))
    .filter((v) => /.*\.jpe?g|png$/gi.test(v));
};

module.exports = GoogleImage;