var lodash = require("lodash.min.js");
var s3BaseUrl = '' //input your s3 base url here (with trailing slash)
var params = event.request.parameters;
var regex = new RegExp(params.text, 'gi');
var filesList = platform.api.get("memebot?as_list=true&include_folders=false&include_files=true&full_tree=true&zip=false");
var matchList = [];

if (filesList.content.resource) {
    lodash._.each(filesList.content.resource, function( entry ) {
        if (entry.match(regex)) {
            matchList.push(entry);
        }
    });
    if (matchList.length !== 0) {
        if (matchList.length > 1) {
            var itemNo = Math.floor((Math.random() * matchList.length) + 0);
        } else {
            var itemNo = 0;
        }
        return {
            "response_type": "in_channel",
            "text": s3BaseUrl + matchList[itemNo]
        };
    } else {
        return 'no matches';
    }
} else {
    return 'no files';
}
