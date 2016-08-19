var params = event.request.parameters;
var apiCall = 'db/_table/memes?filter=name%20LIKE%20%25'+params.text+'%25';
var search = platform.api.get(apiCall);
var randItem = Math.floor((Math.random() * search.content.resource.length) + 0);
return {
    "response_type": "in_channel",
    "text": "https://s3.amazonaws.com/memebot/" + search.content.resource[randItem].path
    };
