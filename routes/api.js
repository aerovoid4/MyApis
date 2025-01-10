
__path = process.cwd();
require('../settings');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const secure = require('ssl-express-www');
const path = require('path');
const { performance } = require('perf_hooks');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const request = require('request');
const fetch = require('node-fetch');
const yts = require('yt-search');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const ip = require('ip');
const useragent = require('useragent');
const { format } = require('date-fns');
const router = express.Router();

const googleAuth = require('../lib/googleAuth');
const { processTime, webApi, getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, getTime, formatDate, formatp, jsonformat, acakAngka } = require('../lib/myfunc');
const tiktokSearchVideo = require('../lib/tiktok');
const saveTube = require('../lib/savetube');
const savePin = require('../lib/savepin');
const otakuDesu = require('../lib/otakudesu');
const GDrive = require('../lib/drive');
const searchTemplates = require('../lib/capcut');
const BukaLapak = require('../lib/bukalapak');
const PlayStore = require('../lib/playstore');
const HariLibur = require('../lib/harilibur');
const quotesAnime = require('../lib/quotesAnime');
const hentai = require('../lib/hentai');
const pinterest = require('../lib/pinterest');
const gempa = require('../lib/bmkg');

router.post('/send', (req, res) => {
    const { name, message } = req.body;
    //const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ip.address() || '0.0.0.0';
    //const agent = useragent.parse(req.headers['user-agent']);
    //const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const emailContent = `
<html>
<head>
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #303030;
            color: #fefefe;
            padding: 25px;
        }
        .container {
            background-color: rgba(0, 0, 0, 0.9);
            padding: 15px;
            border-radius: 15px;
            max-width: 300px;
            width: 100%;
        }
        h1 {
            color: #fefefe;
            font-size: 27px;
            font-weight: 600;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            background: #2b2b2b;
            border-radius: 5px;
            padding: 25px;
            margin-bottom: 15px;
            text-align: center;
        }
        .message h2 {
            font-size: 20px;
            color: #fefefe;
            margin: 0 0 10px 0;
            text-align: center;
        }
        .message p {
            font-size: 18px;
            color: #ddd;
            margin: 0;
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #ddd;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚴💨</h1>

        <div class="message">
            <h2>${name || 'Anonim'}</h2>
            <p>${message}</p>
        </div>

        <div class="footer">Pesan di atas adalah anonim 😉</div>
    </div>
</body>
</html>
    `.trim();
    googleAuth.sendMail({
        from: process.env.EMAIL,
        to: process.env.OWNER_EMAIL,
        subject: '🚴💨',
        html: emailContent
    },
    (err, info) => {
        if (err) {
            console.error('Error saat mengirim email:', err);
            return res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
        }
        res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
    });
});

router.get('/data', (req, res) => {
    const data = {
        jumlahUser: acakAngka(1, 100),
        jumlahPengikut: acakAngka(1, 2000),
        jumlahMoney: acakAngka(500, 50000),
        jumlahVistor: acakAngka(1, 400)
    }
    res.json(data);
});

router.get('/status', async (req, res) => {
    try {
        const now = new Date();
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
        const ipData = await fetch('https://api.ipify.org/?format=json').then(response => response.json());
        const uptime = process.uptime();
        const speed = `${performance.now().toFixed(2)}ms`;
        const status = {
            status: 200,
            creator: ownerName,
            memory: `${memoryUsage}MB / ${totalMemory}MB`,
            port: 3000,
            ip: ipData.ip,
            time: now.toLocaleTimeString(),
            uptime: `${Math.floor(uptime / 60)} minutes`,
            speed,
            info: {
                owner: ownerName,
                name: webName,
                version: versionNumber
            },
        };

        res.json(status);
    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/cekapikey', (req, res) => {
    const apikey = req.query.apikey;
    if (!apikey) {
        return res.json({
            status: false,
            message: 'Masukkan parameter apikey'
        });
    }
    if (global.listkey.includes(apikey)) {
        return res.json({
            status: true,
            message: 'API key valid'
        });
    } else {
        return res.json({
            status: false,
            message: 'API key tidak valid'
        });
    }
});

router.get('/openai', (req, res) => {
    res.status(410).json({
        status: 410,
        creator: ownerName,
        message: 'This feature is no longer available. Please contact the administrator for more information.',
    });
});

router.get('/mora', async (req, res) => {
    try {
        const query = req.query.query || 'Hai, perkenalkan dirimu Mora!';
        const username = req.query.username || ownerName;
        const jsonData = await fetchJson(`https://api.vreden.my.id/api/mora?query=${encodeURIComponent(query)}&username=${encodeURIComponent(username)}`);
        res.json({
            status: 200,
            creator: ownerName,
            result: jsonData.result || "Hello! Is there anything I can help you with?",
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/simi', async (req, res) => {
    try {
        const query = req.query.query || 'Hai, perkenalkan dirimu Simi-simi!';
        const level = req.query.level || '1';
        const jsonData = await fetchJson(`https://skizoasia.xyz/api/simi?apikey=${XznKey}&text=${encodeURIComponent(query)}&level=1`);
        res.json({
            status: 200,
            creator: ownerName,
            result: jsonData.data || "Hello! Is there anything I can help you with?",
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/imdb', async (req, res) => {
    const query = req.query.query || 'One Piece';
    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(query)}&plot=full`);
        res.json({
            status: 200,
            creator: ownerName,
            result: response.data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/playstore', async (req, res) => {
    const query = req.query.query || 'Genshin Impact';
    try {
        const response = await PlayStore(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/capcut', async (req, res) => {
    const query = req.query.query || 'Jedag Jedug Terbaru';
    try {
        const response = await searchTemplates(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/tiktok-search', async (req, res) => {
    const query = req.query.query || 'Khaby Lame';
    try {
        const response = await tiktokSearchVideo(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/tiktok', (req, res) => {
    res.status(410).json({
        status: 410,
        creator: ownerName,
        message: 'This feature is no longer available. Please contact the administrator for more information.',
    });
});

router.get('/pinterest', async (req, res) => {
    const query = req.query.query || 'Anime Icon';
    try {
        const result = await pinterest(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/yts', async (req, res) => {
    const query = req.query.query || 'Anime AMV 4K';
    try {
        const response = await yts(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/bukalapak', async (req, res) => {
    const query = req.query.query || 'iPhone 15 Pro Max';
    try {
        const response = await BukaLapak(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/gimage', async (req, res) => {
    const query = req.query.query || 'Baby Shark';

    try {
        const response = await GoogleImage(query);
        res.json({
            status: 200,
            creator: ownerName,
            result: response,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/savetube', async (req, res) => {
    const url = req.query.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const type = req.query.type || 'audio';
    try {
        const result = await saveTube.dl(url, "3", type);
        res.json({
            status: 200,
            creator: ownerName,
            result: result.link,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/drive', async (req, res) => {
    const url = req.query.url || 'https://drive.google.com/file/d/1uqWUKDltwdRO2ragy85RQt9dpmCo-Y9R/view?usp=drivesdk';

    try {
        const data = await GDrive(url);
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/savepin', async (req, res) => {
    const url = req.query.url || 'https://pin.it/12m4JT950';
    try {
        const data = await savePin(url);
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/harilibur', async (req, res) => {
    try {
        const data = await HariLibur();
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/gempa', async (req, res) => {
    try {
        const data = await gempa();
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/quotes-anime', async (req, res) => {
    try {
        const data = await quotesAnime();
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/hentai', async (req, res) => {
    const apikey = req.query.apikey;

    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }

    try {
        const data = await hentai();
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get('/otakudesu', async (req, res) => {
    try {
        const data = await otakuDesu.ongoing();
        res.json({
            status: 200,
            creator: ownerName,
            result: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            creator: ownerName,
            message: 'Data tidak ditemukan! ☹️',
        });
    }
});

router.get("/waifu", async (req, res, next) => {
    const result = await fetchJson('https://api.waifu.pics/sfw/waifu');
    const requestSettings = {
        url: result.url,
        method: "GET",
        encoding: null,
    };
    request(requestSettings, function (error, response, body) {
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

router.get("/neko", async (req, res, next) => {
    const result = await fetchJson('https://api.waifu.pics/sfw/neko');
    const requestSettings = {
        url: result.url,
        method: "GET",
        encoding: null,
    };
    request(requestSettings, function (error, response, body) {
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

router.get("/shinobu", async (req, res, next) => {
    const result = await fetchJson('https://api.waifu.pics/sfw/shinobu');
    const requestSettings = {
        url: result.url,
        method: "GET",
        encoding: null,
    };
    request(requestSettings, function (error, response, body) {
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

router.get("/megumin", async (req, res, next) => {
    const result = await fetchJson('https://api.waifu.pics/sfw/megumin');
    const requestSettings = {
        url: result.url,
        method: "GET",
        encoding: null,
    };
    request(requestSettings, function (error, response, body) {
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

router.get("/nsfw-waifu", async (req, res, next) => {
    const apikey = req.query.apikey;
    const url = req.query.q;
    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }
    try {
        const result = await fetchJson('https://api.waifu.pics/nsfw/waifu');
        const requestSettings = {
            url: result.url,
            method: "GET",
            encoding: null,
        };
        request(requestSettings, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.set("Content-Type", "image/png");
            res.send(body);
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

router.get("/nsfw-neko", async (req, res, next) => {
    const apikey = req.query.apikey;
    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }
    try {
        const result = await fetchJson('https://api.waifu.pics/nsfw/neko');
        const requestSettings = {
            url: result.url,
            method: "GET",
            encoding: null,
        };
        request(requestSettings, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.set("Content-Type", "image/png");
            res.send(body);
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

router.get("/nsfw-trap", async (req, res, next) => {
    const apikey = req.query.apikey;
    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }
    try {
        const result = await fetchJson('https://api.waifu.pics/nsfw/trap');
        const requestSettings = {
            url: result.url,
            method: "GET",
            encoding: null,
        };
        request(requestSettings, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.set("Content-Type", "image/png");
            res.send(body);
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

router.get("/nsfw-blowjob", async (req, res, next) => {
    const apikey = req.query.apikey;
    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }
    try {
        const result = await fetchJson('https://api.waifu.pics/nsfw/blowjob');
        const requestSettings = {
            url: result.url,
            method: "GET",
            encoding: null,
        };
        request(requestSettings, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.set("Content-Type", "image/png");
            res.send(body);
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

router.get("/hentai-video", async (req, res, next) => {
    const apikey = req.query.apikey;
    if (!apikey) {
        return res.json({ creator: ownerName, status: false, message: 'Ini adalah fitur premium, dapatkan Apikey untuk mengakses fitur ini.' });
    }
    if (!global.listkey.includes(apikey)) {
        return res.json({ status: false, message: 'API key tidak valid' });
    }
    try {
        const result = await hentai();
        const requestSettings = {
            url: result[0].video_1,
            method: "GET",
            encoding: null,
        };
        request(requestSettings, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: 'Terjadi kesalahan' });
            }
            res.set("Content-Type", "video/mp4");
            res.send(body);
        });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
});

router.get("/welcome-card", async (req, res) => {
    const background = req.query.background || 'https://files.catbox.moe/4qzjtc.jpg';
    const text1 = req.query.text1 || '+62 856-5554-8594';
    const text2 = req.query.text2 || 'Sekolah Menjadi Anime';
    const text3 = req.query.text3 || 'Member 320';
    const avatar = req.query.avatar || 'https://files.catbox.moe/5v7syi.png';

    const BASE_URL = `https://api.popcat.xyz/welcomecard?background=${background}&text1=${text1}&text2=${text2}&text3=${text3}&avatar=${avatar}`;
    const requestSettings = {
        url: BASE_URL,
        method: "GET",
        encoding: null,
    };

    request(requestSettings, (error, response, body) => {
        if (error) {
            return res.status(500).json({
                status: 500,
                creator: ownerName,
                message: 'Data tidak ditemukan! ☹️',
            });
        }
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

router.get("/brat", async (req, res) => {
    const q = req.query.q || 'Hai, jangan lupa sholat, makan, minum, mandi dan jaga kesehatan kamu ya...';

    const BASE_URL = `https://siputzx-bart.hf.space/?q=${encodeURIComponent(q)}`;
    const requestSettings = {
        url: BASE_URL,
        method: "GET",
        encoding: null,
    };

    request(requestSettings, (error, response, body) => {
        if (error) {
            return res.status(500).json({
                status: 500,
                creator: ownerName,
                message: 'Data tidak ditemukan! ☹️',
            });
        }
        res.set("Content-Type", "image/png");
        res.send(body);
    });
});

module.exports = router;
