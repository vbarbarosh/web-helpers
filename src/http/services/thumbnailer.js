const http_get_stream = require('@vbarbarosh/node-helpers/src/http_get_stream');
const sharp = require('sharp');
const stream = require('node:stream');

const routes = [
    {req: 'GET /thumbnailer', fn: thumbnailer},
];

async function thumbnailer(req, res)
{
    console.log(`[thumbnailer] 🖼️ ${req.method} ${req.url}`);

    const width = req.query.w ? +req.query.w : (req.query.h ? +req.query.h : 400);
    const height = req.query.h ? +req.query.h : width;

    const rs = await http_get_stream(req.query.u);
    const transform = sharp().resize({width, height, fit: 'inside', withoutEnlargement: true});
    await stream.promises.pipeline(rs, transform, res);
}

module.exports = {routes};
