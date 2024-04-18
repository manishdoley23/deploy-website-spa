import { createClient } from "redis";
import { downloadFromS3 } from "./aws-connect";

const subscriber = createClient();
subscriber.connect();

(async () => {
	while (1) {
		const response = await subscriber.brPop("build-queue", 0);
		console.log(response?.element);

		await downloadFromS3(`output/${response?.element}`);
	}
})();
