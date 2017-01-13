//system vars
var storageService = '';
var dbService = '';
var dbTable = '';
var dbPath = dbService + '/_table/' + dbTable;
var response = {};

//libraries
var lodash = require('lodash.min.js');

if (event.request.parameters.command  && event.request.parameters.command == 'newItem') {
    if (event.request.parameters.path) {
        var newItemPayload = {"resource":[{"path":event.request.parameters.path}]};
        var newItem = platform.api.post(dbPath, newItemPayload);

        if (newItem.status_code === 200) {
            response.success = true;
            response.message = 'File successfully indexed.';
        } else {
            response.success = false;
            response.message = 'File indexing failed.'
        }
    } else {
        response.success = false;
        response.message = 'No file path was provided';
    }
} else {
    //data vars
    var filesListOptions = {};
    filesListOptions.parameters = {};
    filesListOptions.parameters.as_list = true;
    filesListOptions.parameters.include_folders = false;
    filesListOptions.parameters.include_files = true;
    filesListOptions.parameters.full_tree = true;
    filesListOptions.parameters.zip = false;

    var filesList = platform.api.get(storageService, null, filesListOptions);

    var payload = {};
    payload.resource = [];

    lodash._.each(filesList.content.resource, function (file) {
        var record = {"path":file};
        payload.resource.push(record);
    });

    var insertRecords = platform.api.post(dbPath, payload);
    response = insertRecords;
}

return response;
