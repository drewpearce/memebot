# memebot
## Version 0.4
  This code uses DreamFactory, AWS S3 file service, and Slack to create you own image search and response service. It will take input from a Slack slash command and search your S3 service for a file name that contains the string sent to the service, and returns the link to Slack to be displayed inline. To get started you will need to set up accounts at each of the services.

## AWS S3
* Sign up for an s3 bucket. Store your images in it. Make sure that you set your bucket to be accessible publicly, and that the credentials you use with DreamFactory have full access to the bucket.
* In the example code the bucket is named memebot. You can call it whatever you like, but be sure to update the code.

## DreamFactory
1.  Install DreamFactory using a Bitnami package, https://bitnami.com/stack/dreamfactory, or install from source: http://wiki.dreamfactory.com/DreamFactory/Installation
    * You will need to comment out some code to make this work with slack.
        * Locate the file in the installation directory app/Http/Middleware/AuthCheck.php
        * Locate and comment out these lines (lines 59-61 in DF 2.3.0)
 ```php
if (empty($token)) {
    $token = $request->input('token');
}
```
2. Add your S3 service to DreamFactory. In the JS code, the name of the service is memebot. You can call it anything you like, but be sure to update the code.
3. Create a new sqlite database service. Call it whatever you life, for example memedb. You will need to specifiy a db filename as well (created on service save,) for example memedb.sqlite.
    * Go to the Schema tab and select your new meme database from the dropdown menu.
        * Click upload JSON button.
        * Paste in the contents of memeDB.json here (Change the name of the table if you wish) and click Save.
4. Prepare the Files service.
    * Go to the Files tab and click on 'files.' Then add a new folder to hold temporary files (used when renaming files.) For example you might call it tmp.
    * Go to Services -> Files. Then go to config. Add the name of the folder created above as a public path (tmp) and set the folder on Disk to local.
5.  Create a V8JS scripting service called getmeme.
    * Put the contents of getMeme.js in it.
6. Create a V8JS scripting service called indexmemes.
    * Put the contents of indexMemes.js in it.
7. Create a PHP scripting service called uploadmemewithrename.
    * Put the contents of uploadMemeWithRename.php in it.
8. In each of these scripts there are a series of variables that must be update at the top of each script. Here are the examples and explanations.
    * getMeme.js
        * *baseURL* This is the base url for your s3 bucket. Include the trailing slash.
            * ex: https://s3.amazon.com/mymemes/)
        * *storageService* This is the DreamFactory name of your s3 storage service.
            * ex: s3
        * *dbService* This is the sqlite database service name created in step 3.
            * ex: memedb
        * *dbTable* This is the name of the table created in step 3.
            * ex: memes
        * *allowUpload* This is false by default. Set to true to allow upload.
        * *indexMemesService* This is the name of the service created in step 6.
            * ex: indexmemes
    * indexMemes.js
        * *storageService* This is the DreamFactory name of your s3 storage service.
            * ex: s3
        * *dbService* This is the sqlite database service name created in step 3.
            * ex: memedb
        * *dbTable* This is the name of the table created in step 3.
            * ex: memes
    * uploadMemeWithRename.php
        * *$storageService* This is the DreamFactory name of your s3 storage service.
            * ex: s3
        * *$tempStorageFilePath* This is the full path to the local files storage service.
            * ex: /var/www/mygreatapi.com/storage/app
        * *$tempStorageBaseURL* This is the public URL for the files service.
            * ex: https://mygreatapi.com/files
        * *$tempStorageService* Set this to files.
        * *$tempStorageFolder* This is the folder you created in step 4.
            * ex: tmp
9. Use your favorite rest client to call your indexmeme service once with no parameters in order to do an initial index on the storage service.
10. Add a Role for accessing your script and your db service
11. Add an App (API Key) with its default role set to the previously created role

## Slack
  * Create a slack account
  * Add a Slash command (for example /meme)
   * Add your own descriptions as desired
  * Have your slash command call http[s]://{your dreamfactory url}/api/v2/getmeme?api_key={your api} using GET
