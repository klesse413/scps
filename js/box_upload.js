// found online example to upload to box





// Requires JQuery and CORS enabled for the Origin you're testing from.
// Uncomment the next 4 lines to import JQuery
// var script= document.createElement('script');
// script.type= 'text/javascript';
// script.src= '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js';
// document.head.appendChild(script);

// Set up the multipart form using HTML5 FormData object
// https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData
var form = new FormData();

// The content of the file
var fileBody = '<p>hey!<p>';

// JS file-like object
var blob = new Blob([fileBody], { type: 'text/xml'});

// Add the file to the form
form.append('file', blob);

// Add the destination folder for the upload to the form
form.append('parent_id', '0');

var uploadUrl = 'https://upload.box.com/api/2.0/files/content';

// The Box OAuth 2 Header. Add your access token.
var headers = {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
};

$.ajax({
    url: uploadUrl,
    headers: headers,
    type: 'POST',
    // This prevents JQuery from trying to append the form as a querystring
    processData: false,
    contentType: false,
    data: form
}).complete(function ( data ) {
    // Log the JSON response to prove this worked
    console.log(data.responseText);
});