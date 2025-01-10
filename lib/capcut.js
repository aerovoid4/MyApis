const axios = require("axios");
const cheerio = require("cheerio");

async function searchTemplates(query) {
    try {
        const response = await axios.post('https://edit-api-sg.capcut.com/lv/v1/cc_web/replicate/search_templates',{
            'sdk_version': '86.0.0',
            'count': 20,
            'cursor': '0',
            'enter_from': 'workspace',
            'query': query,
            'scene': 1,
            'search_version': 2,
            'cc_web_version': 0
        },
        {
            headers: {
                'loc': 'va',
                'lan': 'id-ID',
                'pf': '7',
                'appvr': '5.8.0',
                'sign-ver': '1',
                'app-sdk-version': '48.0.0',
                'sign': 'd262d8431000a3f4af3d6c7fd95e265e',
                'device-time': '1731548575',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://www.capcut.com/id-id/templates'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error occurred while fetching templates:', error);
        throw new Error('Failed to fetch templates');
    }
};

module.exports = searchTemplates;