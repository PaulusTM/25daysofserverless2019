const redis = require("redis");
const bluebird = require("bluebird");
const Gists = require('gists');
const gists = new Gists({});
const showdown = require('showdown');

const redis_hostname = process.env.REDIS_CACHE_HOSTNAME;
const redis_auth_key = process.env.REDIS_CACHE_KEY;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(6380, redis_hostname, {
    auth_pass: redis_auth_key,
    tls: { servername: redis_hostname }
});

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.id) {
        let id = req.query.id;

        // Check if we have cached data
        var html = await client.getAsync(id);

        if (!html) {
            // Not cached, try to retrieve from gist
            context.log('not cached');

            let html = null;
            let res = await gists.get(id);

            if (res.body && res.body.files) {
                let converter = new showdown.Converter();
                let fileEntries = Object.entries(res.body.files);
                let fileData = fileEntries[0][1];

                if (fileData.content) {
                    html = converter.makeHtml(fileData.content);

                    if (html) {
                        // save in redis
                        await client.setAsync(id, html);
                        // output HTML
                        context.res = {
                            status: 200,
                            body: html,
                            headers: {
                                "Content-Type": "text/html"
                            }
                        };
                    }
                };
            };
        };

        if (html) {
            context.log('from cache')

            context.res = {
                status: 200,
                body: html,
                headers: {
                    "Content-Type": "text/html"
                }
            };
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a card id"
        };
    }
};