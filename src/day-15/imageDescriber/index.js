const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
const cognitiveServiceKey = process.env.COGNITIVE_SERVICE_KEY
const cognitiveServiceEndpoint = process.env.COGNITIVE_SERVICE_ENDPOINT

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const fetch = require('node-fetch'); global.fetch = fetch;
const Unsplash = require('unsplash-js').default;
const toJson = require("unsplash-js").toJson;

const unsplash = new Unsplash({
    accessKey: unsplashAccessKey
});
const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': cognitiveServiceKey } }), cognitiveServiceEndpoint
);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let random = await unsplash.photos.getRandomPhoto()
        .then(toJson)
        .then(json => {
            return json;
        });

    if (random.urls.small) {
        let imageUrl = random.urls.small
        let visionResult = await computerVisionClient.describeImage(imageUrl);
        context.log(visionResult);

        let html = [];
        html.push("<img src='" + imageUrl + "' >");
        html.push("<p><b>Captions:</b> " + visionResult.captions[0].text + "</p>");

        // metadata: { width: 400, height: 600, format: 'Jpeg' }
        html.push("<p>");
        html.push("<b>Width:</b> " + visionResult.metadata.width + "<br />");
        html.push("<b>Height:</b> " + visionResult.metadata.height + "<br />");
        html.push("<b>format:</b> " + visionResult.metadata.format + "<br />");
        html.push("</p>");

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: html.join("\n"),
            headers: {
                "Content-Type": "text/html"
            }
        };
    }
    else {
        context.res = {
            status: 500,
            body: "Unable to get random picture"
        };
    }
};