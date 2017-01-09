//system vars
var baseURL = ''; //input your s3 base url here (with trailing slash)
var storageService = ''; //input the name of your storage service
var dbService = ''; //input the name of your database service (file index)
var dbTable = ''; //input the name of your database table
var dbPath = dbService + '/_table/' + dbTable;
var allowUpload = false; //change to true to allow uploading via slack.
var uploadMemeWithRenameService = ''; //the name of the service that allows uploading with renaming
var indexMemesService = ''; //the name of the service that does the indexing.

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
  if (terms.length === 1) {
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

function uploadFile(inputs) {
  var uploadResponseBuild = {};
  var filePost = {};
  var newFilePath;

  if (allowUpload !== true) {
    uploadResponseBuild.text = 'File upload is not enabled for this instance.';
  } else {
    if (inputs[2]) {
      filePost = platform.api.get(uploadMemeWithRenameService + '?url=' + inputs[1] + '&filename=' + inputs[2]);
      newFilePath = filePost.content.post.content.path;
      if (filePost.content.success === true) {
        filePost.status_code = 201;
      } else {
        filePost.status_code = 500;
      }
    } else {
      filePost = platform.api.post(storageService + '?url=' + inputs[1], null);
      newFilePath = filePost.content.path;
    }

    if (filePost.status_code == 201) {
      uploadResponseBuild.text = 'Your file was successfully uploaded. It is now located at ' + baseURL + newFilePath;
      var indexNewItem = platform.api.get(indexMemesService + '?command=newItem&path=' + newFilePath);
      if (indexNewItem.content.success === false) {
        uploadResponseBuild.text = uploadResponseBuild.text + '  BUT the file was not indexed. Please let an administrator know.';
      }
    } else {
      uploadResponseBuild.text = 'File upload unsuccessful.';
    }
  }

  return uploadResponseBuild;
}

if (textIn[0] == 'upload') {
  response = uploadFile(textIn);
} else {
  var matches = searchMemes(textIn);

  if (matches.content.resource.length < 1) {
    response.text = 'No files matched your query.';
  } else if (matches.content.resource.length == 1) {
    response.response_type = 'in_channel';
    response.text = baseURL + matches.content.resource[0].path;
  } else {
    response = selectMeme(matches.content.resource);
  }
}

return response;
