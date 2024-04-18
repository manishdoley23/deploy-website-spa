import * as aws from "aws-sdk";
import fs from "fs";
import path from "path";

const s3Client = new aws.S3({
	accessKeyId: process.env.CLOUDFARE_ACCESS,
	secretAccessKey: process.env.CLOUDFARE_SECRET,
	endpoint: process.env.CLOUDFARE_ENDPOINT,
});

export async function downloadFromS3(prefix: string) {
	const { Contents } = await s3Client
		.listObjectsV2({
			Bucket: process.env.CLOUDFARE_BUCKET!,
			Prefix: prefix,
		})
		.promise();

	if (Contents !== undefined) {
		const downloadedContent = Contents.map(async (item) => {
			return new Promise<void>((resolve, reject) => {
				if (!item.Key) {
					reject(new Error("Key not found"));
					return;
				}

				const outPath = path.join(__dirname, item.Key);
				const outputDir = path.dirname(outPath);
				if (!fs.existsSync(outputDir)) {
					fs.mkdirSync(outputDir, { recursive: true });
				}

				const outFile = fs
					.createWriteStream(outPath)
					.on("error", (err) => reject(err));

				const s3ReadStream = s3Client
					.getObject({
						Bucket: process.env.CLOUDFARE_BUCKET!,
						Key: item.Key!,
					})
					.createReadStream()
					.on("error", (err) => reject(err));

				s3ReadStream.pipe(outFile).on("finish", () => resolve());
			});
		});
		console.log("Awaiting...");

		try {
			await Promise.all(downloadedContent);
			console.log("done");
		} catch (error) {
			console.log("error:", error);
		}
	}
}
