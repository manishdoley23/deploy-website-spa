// import * as AWS from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as aws from "aws-sdk";
import fs from "fs";

// export const s3Client = new AWS.S3Client({
// 	region: process.env.S3_REGION!,
// 	credentials: {
// 		accessKeyId: process.env.S3_ACCESS!,
// 		secretAccessKey: process.env.S3_SECRET!,
// 	},
// });
// export const putObjectToS3 = async () => {
// 	// const file = fs.readFileSync(fileName);
// 	const command = new AWS.PutObjectCommand({
// 		Bucket: process.env.S3_BUCKET_NAME!,
// 		Key: "vercel",
// 	});
// 	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
// 	return url;
// };

// filname = "code/App.tsx"
// localFilePath = "/Users/manishdoley/Desktop/Folder/Course/Harkirat/build-vercel/dist/output/code/..."

const s3 = new aws.S3({
	accessKeyId: process.env.CLOUDFARE_ACCESS!,
	secretAccessKey: process.env.CLOUDFARE_SECRET!,
	endpoint: process.env.CLOUDFARE_ENDPOINT!,
});

export const uploadFile = async (filename: string, localFilePath: string) => {
	const content = fs.readFileSync(localFilePath);
	await s3
		.upload({
			Bucket: process.env.CLOUDFARE_BUCKET!,
			Body: content,
			Key: filename,
		})
		.promise();
};
