// Removes the catch-all placeholder (static export needs at least one param) from out/.
import fs from "node:fs";
fs.rmSync("out/__placeholder", { recursive: true, force: true });
// version.txt lets CI confirm a deploy is live before pinging IndexNow.
const sha = process.env.AWS_COMMIT_ID || process.env.GITHUB_SHA || "";
fs.writeFileSync("out/version.txt", /^[0-9a-f]{40}$/.test(sha) ? sha : "unknown");
