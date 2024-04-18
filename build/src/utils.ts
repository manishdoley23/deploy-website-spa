import fs from "fs";
import path from "path";

export function generate() {
	const subset = "fb3e6c4cf800759dc61ac75166d2503f";
	let id = "";
	const len = 5;
	for (let i = 0; i < len; ++i) {
		id += subset[Math.floor(Math.random() * subset.length)];
	}
	return id;
}

export function getAllPaths(folderPath: string) {
	let response: string[] = [];
	fs.readdirSync(folderPath).forEach((file) => {
		const fullFilePath = path.join(folderPath, file);
		if (fs.statSync(fullFilePath).isDirectory()) {
			response = response.concat(getAllPaths(fullFilePath));
		} else {
			response.push(fullFilePath);
		}
	});
	return response;
}

// export async function uploadFileToS3(fileName: string, localFilePath: string) {
// 	const fileContent = fs.readFileSync(fileName);
// 	const res = await s3
// 		.upload({
// 			Bucket: "vercel",
// 			Body: fileContent,
// 			Key: fileName,
// 		})
// 		.promise();
// 	console.log("res:", res);
// }
