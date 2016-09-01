<<<<<<< HEAD
var lodash = require("lodash.min.js");
var s3BaseUrl = '' //input your s3 base url here (with trailing slash)
=======
//system vars
var s3BaseUrl = 'https://s3.amazonaws.com/memebot/' //input your s3 base url here (with trailing slash)

//libraries
var lodash = require("lodash.min.js"); //lodash each used for looping

//input vars
>>>>>>> origin/develop
var params = event.request.parameters;
var textIn = params.text.split(' ');

//data vars
var filesList = platform.api.get("memebot?as_list=true&include_folders=false&include_files=true&full_tree=true&zip=false");
var matchList = [];
var termCount = 0;

//response var
var response = {};

if (filesList.content.resource) {
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
    matchLength1 = matchList.length;
    if (matchList[matchLength1-1].length !== 0) {
        if (matchList[matchLength1-1].length > 1) {
            var itemNo = Math.floor((Math.random() * matchList[matchLength1-1].length) + 0);
        } else {
            var itemNo = 0;
        }
<<<<<<< HEAD
        return {
            "response_type": "in_channel",
            "text": s3BaseUrl + matchList[itemNo]
        };
=======
        response.response_type = 'in_channel';
        response.text = s3BaseUrl + matchList[matchLength1-1][itemNo];
>>>>>>> origin/develop
    } else {
        response.text = 'No files matched your query.';
    }
} else {
    response.text = 'No files were found in your storage service.';
}

return response;
