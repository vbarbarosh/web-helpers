const http = require('node:http');

const routes = [
    {req: 'GET /api/v1/docker/containers.json', fn: docker_containers_list},
    {req: 'POST /api/v1/docker/containers/{uid}/down', fn: docker_containers_down},
    {req: 'POST /api/v1/docker/containers/{uid}/up', fn: docker_containers_up},
];

async function docker_containers_list(req, res)
{
    res.send(await api_docker_containers());
}

async function docker_containers_down(req, res)
{
}

async function docker_containers_up(req, res)
{
}

// https://docs.docker.com/reference/api/engine/version/v1.39/#tag/Container/operation/ContainerList
async function api_docker_containers()
{
    const options = {
        method: 'GET',
        path: '/containers/json?all=true',
        socketPath: '/var/run/docker.sock',
    };
    return new Promise(function (resolve, reject) {
        const req = http.request(options, async function (res) {
            try {
                const chunks = await res.toArray();
                const json = Buffer.concat(chunks).toString();
                resolve(JSON.parse(json));
            }
            catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
        req.end();
    });
}

module.exports = {routes};
