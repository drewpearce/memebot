//system vars
var storageService = '';
var dbService = '';
var dbTable = '';
var dbPath = dbService + '/_table/' + dbTable;

//libraries
var lodash = require('lodash.min.js');

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

return insertRecords;
