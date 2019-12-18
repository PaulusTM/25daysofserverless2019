const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const accessTokenKey = process.env.TWITTER_ACCESS_TOKEN_KEY;
const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const Twitter = require('twitter-lite');
const util = require('util');

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);

    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${util.inspect(message)}`);

        if (message.temperature > 30) {
            let temp = Math.round(message.temperature);
            let tweet = "Temperature report for Skippy! The temperature around the IoT device is: " + temp + " #25daysofserverless";
            context.log(tweet);

            const api = new Twitter({
                consumer_key: consumerKey,
                consumer_secret: consumerSecret,
                access_token_key: accessTokenKey,
                access_token_secret: accessTokenSecret
            });

            api.post("statuses/update", { status: tweet })
                .then(function (msg) {
                    console.log(msg);
                })
                .catch(function (error) {
                    throw error;
                })

        }
    });
};