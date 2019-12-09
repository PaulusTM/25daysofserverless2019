const qs = require("querystring");
const Octokit = require("@octokit/rest");
const octokit = new Octokit({
    auth: process.env["GITHUB_PAT"]
});

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        const formValues = qs.parse(req.body);
        const jsonData = JSON.parse(formValues.payload);

        if (jsonData.action != 'opened'){
            context.res = {
                status: 400,
                body: "action is not valid."
            };
            context.done;
        }

        const owner = jsonData.repository.owner.login;
        const repo = jsonData.repository.name;
        const issue_number = jsonData.issue.number;
        const submitter = jsonData.issue.user.login;
        const body = "Thank you @" + submitter + " you for submitting this issue. We will get back to you shortly!";

        const reply = await octokit.issues.createComment({
            owner,
            repo,
            issue_number,
            body
        });
        context.log(reply);
    }
    else {
        context.res = {
            status: 400,
            body: "No playload send in body"
        };
        context.done;
    }

};