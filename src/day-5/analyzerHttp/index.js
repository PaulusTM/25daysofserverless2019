const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
const TranslatorTextAPIClient = require("@azure/cognitiveservices-translatortext");
const fetch = require('node-fetch');
const uuid = require("uuid/v4");

const subscription_key = process.env["TEXT_ANALYTICS_SUBSCRIPTION_KEY"];
const endpoint = process.env["TEXT_ANALYTICS_ENDPOINT"];

const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": subscription_key } });


async function getHttp(context) {
    context.log('calling HTTP service')
    return fetch('https://christmaswishes.azurewebsites.net/api/Wishes')
        .then(res => res.json());
}

async function sentimentAnalysis(docs) {
    const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);

    const input = {
        documents: [
            {
                id: "1",
                text: "This was a waste of my time. The speaker put me to sleep."
            }
        ]
    };


    const result = await textAnalyticsClient.sentiment({multiLanguageBatchInput: input});
    return result.documents;
}

async function languageAnalysis(doc) {
    const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(
        creds, "https://westeurope.api.cognitive.microsoft.com/text/analytics/v2.1/languages"
    );

    const input = {
        documents: [{
            id: uuid(),
            text: doc.message
        }]
    }
    // console.log(input);
    const result = await textAnalyticsClient.detectLanguage({
        languageBatchInput: input
    });

    output = result.map((x, i) => ({ id: i.toString(), language: x.detectedLanguage.language, text: x.translations[0].text }));
    console.log(output);
    return result.documents;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.bindings.tableBinding = [];

    const data = await getHttp(context);
    //context.log(data);

    // get whishes from https://christmaswishes.azurewebsites.net/api/Wishes
    // Put whishes into table storage

    data.forEach(async function (letter) {
        // context.log(letter);

        const language = await languageAnalysis(letter);
        // context.log(language);

        // const sent_result = await sentimentAnalysis(letter);
        // context.log(sent_result);



        // const sentiment = await textAnalyticsClient.sentiment({
        //     multiLanguageBatchInput: letter.message
        // });
        // context.log(sentiment);
    });

    // 

    // context.bindings.tableBinding.push({
    //     PartitionKey: "Letter",
    //     RowKey: uuid(),
    //     Name: data.who,
    //     Message: data.message
    // });

    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }
};