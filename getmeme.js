//system vars
var baseURL = ''; //input your s3 base url here (with trailing slash)
var storageService = ''; //input the name of your storage service
var dbService = ''; //input the name of your database service (file index)
var dbTable = ''; //input the name of your database table
var dbPath = dbService + '/_table/' + dbTable;

//libraries
var lodash = require("lodash.min.js"); //lodash each used for looping

//input vars
var params = event.request.parameters;
var textIn = params.text.split(' ');

//response var
var response = {};

function selectMeme(files) {
    var itemNo = lodash._.random(0, files.length-1);
    var responseBuild = {};
    responseBuild.response_type = 'in_channel';
    responseBuild.text = baseURL + files[itemNo].path;
    return responseBuild;
}

function searchMemes (terms) {
  var searchOptions = {};
  searchOptions.parameters = {};
  searchOptions.parameters.fields = 'path';
  if (terms.length === 0) {
    searchOptions.parameters.filter = "(path like '%" + terms[0] + "%')";
  } else {
    searchOptions.parameters.filter = '';

    lodash._.each(terms, function(term, index) {
      if (index === terms.length - 1) {
        searchOptions.parameters.filter = searchOptions.parameters.filter + "(path like '%" + term + "%')";
      } else {
        searchOptions.parameters.filter = searchOptions.parameters.filter + "(path like '%" + term + "%') AND ";
      }
    });
  }

  var searchResults = platform.api.get(dbPath, null, searchOptions);

  return searchResults;
}

var matches = searchMemes(textIn);

if (matches.content.resource.length < 1) {
  response.text = 'No files matched your query.';
} else if (matches.content.resource.length == 1) {
  response.response_type = 'in_channel';
  response.text = baseURL + matches.content.resource[0].path;
} else {
  response = selectMeme(matches.content.resource);
}

return response;
