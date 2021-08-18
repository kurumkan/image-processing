# Storage
The service is connected to AWS S3 bucket.

Purpose:
- list files
- upload file
- get file
- delete file

## List files
On demand return a paginated list of files for a given user.

## Upload file
On request return a S3 url for uploading a file

## Get file
Parse original url and generate S3 url. If needed make request for transformation service.  

## Delete file
delete file
