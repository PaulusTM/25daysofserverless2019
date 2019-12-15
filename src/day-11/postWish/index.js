const axios = require("axios");
const slack_web_hook = process.env.SLACK_WEBHOOK_URL;
const headers = { 'Content-Type': 'application/json' };

module.exports = async function (context, documents) {
    if (!!documents && documents.length > 0) {
        context.log('Document Id: ', documents[0].id);

        let wishData = ({ description, name, address, type } = documents[0]);

        let payload = {
            text: wishData.name + " likes to get " + wishData.description + " in " + wishData.address,
            username: "wishbot",
            icon_emoji: ":santa:"
        }

        const response = await axios.post(slack_web_hook, payload, headers);
    }
}
