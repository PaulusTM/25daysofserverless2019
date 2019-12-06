const uuid = require("uuid/v4");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const id = uuid();
    context.bindings.tableBinding = [];

    if (req.body.dishName && req.body.friendName) {

        context.bindings.tableBinding.push({
            PartitionKey: "Dish",
            RowKey: id,
            Name: req.body.friendName,
            Dish: req.body.dishName
        });

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    };

};