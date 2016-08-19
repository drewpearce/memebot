# memebot
  This code uses DreamFactory, AWS S3 file service, and Slack to create you own image search and response service. To get started you will need to set up accounts at each of the serivces.

## AWS S3
  * Sign up for an s3 bucket. Store your images in it

## DreamFactory
  * Sign up for a free DreamFactory hosted account at https://www.dreamfactory.com/signup
  * Load the file name and path info into a sqlite (db) database
  * Create a V8JS scripting service called getmeme.
  ** Put the contents of getmeme.js in it.
  * Add an role for accessing your script and your db service
  * Add an App (API Key) with its default role set to the previously created role

## Slack
  * Create a slack account
  * Add a Slash command (for example /meme)
  * Have your slash command call https://{your dreamfactory url}/api/v2/getmeme?api_key={your api} using GET
