//system vars
var baseURL = ''; //input your s3 base url here (with trailing slash)
var storageService = ''; //input the name of your storage service

//libraries
var lodash = require("lodash.min.js"); //lodash each used for looping

//input vars
var params = event.request.parameters;
var textIn = params.text.split(' ');

//data vars
var filesList = platform.api.get(storageService + "?as_list=true&include_folders=false&include_files=true&full_tree=true&zip=false"); //gets a list of all files
var matchList = [];
var termCount = 0;

//response var
var response = {};

function selectMeme(files) {
    var itemNo = lodash._.random(0, files.length-1);
    response.response_type = 'in_channel';
    response.text = baseURL + files[itemNo];
}

if (filesList.content.resource) {
    if (textIn[0] === '') {
        selectMeme(filesList.content.resource, false);
    } else {
        lodash._.each(textIn, function( term ) {
            matchList[termCount] = [];
            var regex = new RegExp(term, 'gi');
            if (termCount === 0) {
                lodash._.each(filesList.content.resource, function( entry ) {
                    if (entry.match(regex)) {
                        matchList[termCount].push(entry);
                    }
                });
            } else {
                lodash._.each(matchList[termCount-1], function( entry ) {
                    if (entry.match(regex)) {
                        matchList[termCount].push(entry);
                    }
                });
            }
            termCount = termCount + 1;
        });
        if (matchList[matchList.length-1].length !== 0) {
            selectMeme(matchList[matchList.length-1]);
        } else {
            response.text = 'No files matched your query.';
        }
    }
} else {
    response.text = 'No files were found in your storage service.';
}

return response;