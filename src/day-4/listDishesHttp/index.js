module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const data = context.bindings.tableBinding
    const mapped_response = {
        entries: data.map(entry => {
            return {
                id: entry["RowKey"],
                dish: entry["Dish"],
                name: entry["Name"]
            };
        })
    };

    context.res = {
        status: 200,
        body: JSON.stringify(mapped_response)
    };
    context.done();
};