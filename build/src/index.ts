import path from "path";
import express from "express";
import cors from "cors";
import { createClient } from "redis";
import { simpleGit } from "simple-git";

import { generate, getAllPaths } from "./utils";
import { uploadFile } from "./aws-connect";

const app = express();
app.use(express.json());
app.use(cors());

const publisher = createClient();
publisher.on("error", (err) => console.log("Redis error:", err));

app.get("/api/status", async (req, res) => {
	const { id } = req.query;
	if (typeof id === "string") {
		const response = await publisher.hGet("status", id);
		res.json({
			status: response,
		});
	}
});

app.post("/api/send-url", async (req, res) => {
	const { repoUrl } = req.body;
	const id = generate();
	try {
		await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
		const files = getAllPaths(path.join(__dirname, `output/${id}`));
		for (const file of files) {
			await uploadFile(file.slice(__dirname.length + 1), file);
		}
		await publisher.lPush("build-queue", id);
		await publisher.hSet("status", id, "uploaded");
		res.json({
			id,
		});
	} catch (error) {
		res.send("Repo doesn't exist");
	}
});

app.listen(3000, async () => {
	await publisher
		.connect()
		.then(() => {
			console.log("Redis connected");
		})
		.catch((err) => {
			console.log("Error on redis connection:", err);
			throw new Error();
		});
	console.log("Server on port 3000");
});
