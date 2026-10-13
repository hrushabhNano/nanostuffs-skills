import { query } from "@anthropic-ai/claude-agent-sdk";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

// Usage: npm run pr-description -- [baseBranch]
// Run it from inside the git repo you want described (default base: main).
const base = process.argv[2]?.trim() || "main";

function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

let branch: string;
try {
  branch = git("branch", "--show-current");
} catch {
  console.error("Not a git repository. Run this from inside the repo you want described.");
  process.exit(1);
}
if (!branch) {
  console.error("No current branch (detached HEAD). Check out a branch first.");
  process.exit(1);
}

const slug = branch.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const outFile = `pr-drafts/${slug}.md`;

let resultText = "";

for await (const message of query({
  prompt: `Write a pull request description for the current branch (${branch}) compared with ${base}.
Use the pr-description skill for the format and rules.
Inspect the changes with read-only git commands only. Do not change anything in the repo.
Return only the finished description as markdown, followed by any open items.`,
  options: {
    cwd: process.cwd(),                       // the repo being described
    settingSources: ["project", "user"],      // find skills in .claude/skills/ or ~/.claude/skills/
    skills: ["pr-description"],               // only this skill is allowed
    allowedTools: [                           // read-only: no Write, no Edit, no general Bash
      "Read", "Grep", "Glob",
      "Bash(git branch:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git status:*)",
      "Bash(git merge-base:*)",
      "Bash(git rev-parse:*)",
    ],
    maxTurns: 20,
  },
})) {
  if (message.type === "result") {
    if (message.subtype === "success") {
      resultText = message.result;
      console.log(`Done (cost $${message.total_cost_usd.toFixed(3)})`);
    } else {
      console.error(`Agent stopped early: ${message.subtype}`);
      process.exit(1);
    }
  }
}

if (!resultText) {
  console.error("No output received from the agent.");
  process.exit(1);
}

// The agent has no write access; the script saves the draft itself.
mkdirSync("pr-drafts", { recursive: true });
writeFileSync(outFile, resultText + "\n");
console.log(`Saved: ${outFile}`);
