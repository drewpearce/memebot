# memebot
## Version 0.2
  This code uses DreamFactory, AWS S3 file service, and Slack to create you own image search and response service. It will take input from a Slack slash command and search your S3 service for a file name that contains the string sent to the service, and returns the link to Slack to be displayed inline. To get started you will need to set up accounts at each of the serivces.

## AWS S3
  * Sign up for an s3 bucket. Store your images in it. Make sure that you set your bucket to be accessible publicly, and that the credentials you use with DreamFactory have full access to the bucket.
  * In the example code the bucket is named memebot. You can call it whatever you like, but be sure to update the code.

## DreamFactory
  * Install DreamFactory using a Bitnami package, https://bitnami.com/stack/dreamfactory, or install from source: http://wiki.dreamfactory.com/DreamFactory/Installation
  * You will need to comment out some code to make this work with slack.
   * Locate the file in the installation directory app/Http/Middleware/AuthCheck.php
   * Locate and comment out these lines (lines 59-61 in DF 2.3.0)
 ```php
if (empty($token)) {
    $token = $request->input('token');
}
```
  * Add your S3 service to DreamFactory. In the JS code, the name of the service is memebot. You can call it anything you like, but be sure to update the code.
  * Create a V8JS scripting service called getmeme.
   * Put the contents of getmeme.js in it.
  * Add a Role for accessing your script and your db service
   * You'll want to allow GET access via API on your script service (getmeme.)
   * You'll want to allow GET access via Script on your S3 service (memebot,) all components.
  * Add an App (API Key) with its default role set to the previously created role

## Slack
  * Create a slack account
  * Add a Slash command (for example /meme)
   * Add your own descriptions as desired
  * Have your slash command call http[s]://{your dreamfactory url}/api/v2/getmeme?api_key={your api} using GET
