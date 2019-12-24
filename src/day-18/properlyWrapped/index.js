const cognitiveServiceKey = process.env.COGNITIVE_SERVICE_KEY
const cognitiveServiceEndpoint = process.env.COGNITIVE_SERVICE_ENDPOINT
const slack_web_hook = process.env.SLACK_WEBHOOK_URL;

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const _ = require('underscore');
const axios = require("axios");
const headers = { 'Content-Type': 'application/json' };

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': cognitiveServiceKey } }), cognitiveServiceEndpoint
);

// Format tags for display
function formatTags(tags) {
    return tags.map(tag => (`${tag.name}`));
}

module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");

    let requiredTags = [
        'box',
        'gift wrapping',
        'ribbon',
        'present'
    ];

    let visionResult = (await computerVisionClient.analyzeImage(context.bindingData.uri, { visualFeatures: ['Tags'] })).tags;
    let resultTags = formatTags(visionResult);
    context.log(resultTags);

    // create new array with values present in requiredTags & resultTags
    foundTags = _.intersection(requiredTags, resultTags)

    // compare the requiredTags and the foundTags array to see if all the tags have been found.
    let same = (_.difference(requiredTags, foundTags).length == 0)

    if (same) {
        context.log("GOED");

        let payload = {
            text: ":white_check_mark: " + context.bindingData.blobTrigger + " is wrapped OK! ",
            username: "wrapbot",
            icon_emoji: ":santa:"
        }
        await axios.post(slack_web_hook, payload, { 'Content-Type': 'application/json' });
    }
    else {
        context.log("FOUT");

        let payload = {
            text: ":red_circle: " + context.bindingData.blobTrigger + " is NOT wrapped ok! ",
            username: "wrapbot",
            icon_emoji: ":santa:"
        }

        await axios.post(slack_web_hook, payload, { 'Content-Type': 'application/json' });
    };

};