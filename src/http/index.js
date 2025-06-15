#!/usr/bin/env node

require('@dotenvx/dotenvx').config();

const amx = require('@vbarbarosh/express-helpers/src/amx');
const body_parser = require('body-parser');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const express = require('express');
const express_params = require('@vbarbarosh/express-helpers/src/express_params');
const express_run = require('@vbarbarosh/express-helpers/src/express_run');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');

cli(main);

async function main()
{
    const app = express();

    await require('./services/s3').init();

    app.use(express.static(fs_path_resolve(__dirname, '../..')));
    app.use(body_parser.json());

    express_routes(app, [
        {req: 'GET /', fn: echo},
        ...require('./services/black_forest_labs').routes,
        ...require('./services/docker').routes,
        ...require('./services/mongo').routes,
        ...require('./services/s3').routes,
        ...require('./services/snippets').routes,
        ...require('./services/thumbnailer').routes,
        ...require('./services/mysql').routes,
        {req: 'ALL *', fn: page404},
    ]);

    app.use(function (error, req, res, next) {
        if (res.headersSent) {
            return next(error);
        }
        console.log('[error]', error);
        res.status(500).json({message: error.message, stack: error.stack, raw: error});
    });

    await express_run(app);
}

async function echo(req, res)
{
    res.status(200).send(express_params(req));
}

async function page404(req, res)
{
    res.status(404).send(`Page not found: ${req.path}`);
}

function express_routes(app, routes)
{
    for (let i = 0, end = routes.length; i < end; ++i) {
        const route = routes[i];
        const [method, path] = route.req.split(' ');
        const fn = route.fn.default || route.fn; // allow require('./api/api_articles_get')
        if (route.middleware) {
            app[method.toLowerCase()](path, route.middleware, amx((req, res) => fn(req, res, route, routes)));
        }
        else {
            app[method.toLowerCase()](path, amx((req, res) => fn(req, res, route, routes)));
        }
    }
    return app;
}
