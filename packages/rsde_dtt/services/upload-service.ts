import dotenv from 'dotenv'
import aws from 'aws-sdk'

dotenv.config()

const region = "ap-southeast-1"
const bucketName = "rsde-dtt-lta-tp"
const accessKeyId = process.env.S3_AccessKeyID
const secretAccessKey = process.env.S3_SecretAccessKey

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export async function generateUploadURL(fileName:string) {
  const params = ({
    Bucket: bucketName,
    Key: fileName,
    Expires: 60
  })
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}

export async function getSignedFileURL(fileName:string) {
  let params = ({})
  if(fileName.includes('.pdf')){
    params = ({
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
      ResponseContentType: 'application/pdf'
    })
  }
  else{
    params = ({
      Bucket: bucketName,
      Key: fileName,
      Expires: 60
    })
  }

  const url = await s3.getSignedUrlPromise('getObject', params);
  return url;
}

export async function deleteS3File(fileName: string) {
  const params = ({
    Bucket: bucketName,
    Key: fileName
  })

  s3.deleteObject(params, function(err, data) {
    if (data) {
      console.log("File deleted successfully");         
  }
  else {
      console.log("Check if you have sufficient permissions : "+err);                                
  }
  });
}