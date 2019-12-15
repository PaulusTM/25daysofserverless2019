const uuid = require('uuid/v4');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body.description && req.body.name && req.body.address && req.body.type) {

        let wish = ({ description, name, address, type } = req.body);
        wish.id = uuid();

        context.bindings.wishDocument = JSON.stringify(wish);

        context.res = {
            status: 200,
            body: wish
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a valid wish"
        };
    }
};
