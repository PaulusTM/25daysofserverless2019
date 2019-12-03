const azure = require('azure-storage');
const uuid = require('uuid/v1');
const tableService = azure.createTableService();
const tableName = "secretSantaPictures";
const path = require('path');

tableService.createTableIfNotExists(tableName, function (error, result, response) {
    if (!error) {
        // result contains true if created; false if already exists
    }
});

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {

        // Github sends its webhook data in the body.
        githubData = JSON.parse(req.body.payload);
        commitData = githubData.commits;
        baseUrl = githubData.repository.html_url;
        branch = githubData.ref.split('/')[2]

        // Loop trough all the commits that are send to us
        commitData.forEach(function (commits) {
            files = commits.added;

            // Loop trough all the files
            files.forEach(function (file) {

                // store path if its an PNG image
                extension = path.extname(file);

                if (extension == '.png') {
                    context.log('need to save');
                    // https://github.com/dpnl87/25daysofserverless2019/blob/master/src/SecretSantaTrigger/pictures/doggies.png
                    var url = [baseUrl, 'blob', branch, file].join('/');
                    var item = {
                        PartitionKey: "Partition",
                        RowKey: uuid(),
                        Description: url
                    };

                    tableService.insertEntity(tableName, item, { echoContent: true }, function (error, result, response) {
                        if (!error) {
                            // This returns a 201 code + the database response inside the body
                            // Calling status like this will automatically trigger a context.done()
                            context.res.status(201).json(response);
                        } else {
                            // In case of an error we return an appropriate status code and the error returned by the DB
                            context.res.status(500).json({ error: error });
                        }
                    });
                } else {
                    context.log('Not an PNG image');
                }
            });
        });
    } 
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done;
    }
};