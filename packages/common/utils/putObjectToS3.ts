import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppErrorCodes } from "@wotm/utils";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

// Create an Amazon S3 service client object.

let s3Client: any = null;
if (process.env.NODE_ENV == "development") {
  s3Client = new S3Client({
    region: "ap-southeast-1",
    credentials: {
      accessKeyId: `${process.env.ACCESS_KEY_ID}`,
      secretAccessKey: `${process.env.SECRET_KEY_ID}`,
    },
  });
} else {
  s3Client = new S3Client({
    region: "ap-southeast-1",
  });
}

async function putObjectToS3(
  uuid: string,
  profileImage: string | Buffer,
  bucket: string
) {
  console.log("put to S3");
  console.log(`${process.env.PROFILE_S3_BUCKET}`);
  try {
    let buf: Buffer;
    if (!Buffer.isBuffer(profileImage)) {
      buf = Buffer.from(
        profileImage.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
    } else {
      buf = profileImage;
    }
    const data = {
      Bucket: bucket,
      Key: uuid,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
    const result = await s3Client.send(new PutObjectCommand(data));
    console.log(`result is ${result}`);
    return result;
  } catch (err) {
    console.log(err);
    throw AppErrorCodes.S3_PUT_OBJECT_ERROR;
  }
}

/**
 *
 * @param key The s3 object key.
 * @param allowedFolders To get the signed url for `key`, its top-level folder must be included here.
 * @returns The signed url
 */
async function getS3SignedUrl(
  key: string,
  allowedFolders: string[],
  bucket: string
) {
  try {
    // Only allow access to objects in allowedFolders.
    const parentFolder = key.split("/")[0];
    if (!allowedFolders.includes(parentFolder))
      throw new Error(`Not allowed to access object in ${parentFolder}`);

    const command: any = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });
    console.log(`url is ${url}`);
    return url;
  } catch (err) {
    console.log(err);
    throw AppErrorCodes.S3_Get_OBJECT_ERROR;
  }
}

export { putObjectToS3, getS3SignedUrl };
