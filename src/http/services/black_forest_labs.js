const Promise = require('bluebird');
const axios = require('axios');
const http_get_json = require('@vbarbarosh/node-helpers/src/http_get_json');
const http_post_json = require('@vbarbarosh/node-helpers/src/http_post_json');
const urlmod = require('@vbarbarosh/node-helpers/src/urlmod');

const routes = [
    {req: 'POST /api/v1/black-forest-labs/image', fn: image}
];

async function image(req, res)
{
    console.log(`[black_forest_labs_image] ${JSON.stringify(req.body.prompt??'').slice(1, -1)}`.trim());

    if (Date.now()) {
        const xhr = await axios.get('https://picsum.photos/200', {
            maxRedirects: 0,
            validateStatus: () => true,
        });
        res.type('text').send(xhr.headers.location ?? xhr.config.url);
        return;
    }

    const headers = {
        'X-Key': process.env.BFL_KEY,
    };

    const params = {
        prompt: req.body.prompt ?? 'modern display case for goods with pedestal',
        seed: 42,
        aspect_ratio: '16:9',
        safety_tolerance: 2,
        output_format: 'jpeg',
        raw: false,
        image_prompt_strength: 0.1
    };

    // { id: 'e4ef6bcd-0757-4b6f-9796-33efc20c502b' }
    const tmp = await http_post_json('https://api.bfl.ml/v1/flux-pro-1.1-ultra', params, {headers});

    for (let wait = false, end_ms = Date.now() + 60000; Date.now() < end_ms; wait = true) {
        if (wait) {
            await Promise.delay(1000);
        }
        // {
        //   id: 'e4ef6bcd-0757-4b6f-9796-33efc20c502b',
        //   status: 'Ready',
        //   result: {
        //     sample: 'https://bfldeliverysc.blob.core.windows.net/results/daad67c51ade43178640e77975fbc401/sample.jpeg?se=2024-12-04T16%3A05%3A59Z&sp=r&sv=2024-11-04&sr=b&rsct=image/jpeg&sig=xxxxxxxxxxx',
        //     prompt: 'modern display case for goods'
        //   }
        // }
        const tmp2 = await http_get_json(urlmod('https://api.bfl.ml/v1/get_result', {id: tmp.id}), {headers});
        if (tmp2.result?.sample) {
            res.type('text').send(tmp2.result.sample);
            return;
        }
    }

    res.status(500).send('Timeout');
}

module.exports = {routes};
