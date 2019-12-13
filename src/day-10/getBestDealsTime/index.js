const Twitter = require('twitter-lite');

const consumerKey = process.env.TWITTER_CONSUMER_KEY
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.IsPastDue) {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);

    const api = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret
    });

    const response = await api.getBearerToken();
    const app = new Twitter({
        bearer_token: response.access_token
    });

    const search = await app.get("search/tweets", {
        q: "#christmasdeals"
    });
    const maxId = search.search_metadata.max_id_str

    context.bindings.tableBinding = [];
    search.statuses.forEach(function (tweet) {
        let tweetText = tweet.text;
        let tweetId = tweet.id_str;
        context.log(tweet);

        context.bindings.tableBinding.push({
            PartitionKey: "Tweet",
            RowKey: tweetId,
            Text: tweetText
        });

    });

};