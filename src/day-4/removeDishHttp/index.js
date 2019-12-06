// Remove is not possible yet with new binding, have to use old ways
const azure = require("azure-storage");
const tableService = azure.createTableService();
const tableName = "dishesTable";

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const id = req.params.id;
    if (!id) {
        context.res = {
            status: 404,
            body: JSON.stringify({ message: "'id' is a required parameter" })
        };
        context.done();
    }

    const key = {
        PartitionKey: "Dish",
        RowKey: id
    };

    tableService.deleteEntity(tableName, key, (err, result, response) => {
        if (err) {
            return callback(err);
        }
    });

};