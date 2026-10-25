// Status update agent
// Reads the last N days of git history from any project repo and writes a
// client status update using the client-status-update skill from this repo.
//
// Run:  npx tsx agents/status-update-agent/agent.ts <path-to-project-repo> [days]
// Needs: ANTHROPIC_API_KEY in the environment.

import { execFileSync } from "node:child_process";
import { basename, resolve } from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";

const [repoArg, daysArg = "7"] = process.argv.slice(2);
const days = Number(daysArg);
if (!repoArg || !Number.isInteger(days) || days < 1) {
  console.error("Usage: npx tsx agents/status-update-agent/agent.ts <path-to-project-repo> [days]");
  process.exit(1);
}

const repo = resolve(repoArg);
const git = (...args: string[]) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }).trim();

// Git is read here, not by the agent, so the agent needs no shell access.
let commits: string;
let merges: string;
try {
  const since = `${days} days ago`;
  commits = git("log", `--since=${since}`, "--no-merges", "--date=short", "--format=%ad %s%n%b");
  merges = git("log", `--since=${since}`, "--merges", "--format=%s");
} catch {
  console.error(`Not a git repository: ${repo}`);
  process.exit(1);
}
if (!commits) {
  console.error(`No commits in ${repo} in the last ${days} days.`);
  process.exit(1);
}

const project = basename(repo);
const date = new Date().toISOString().slice(0, 10);
const outFile = `status/${project.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${date}.md`;

const prompt = `
Write a client status update for the project "${project}" covering the last ${days} days.

1. Use the client-status-update skill, email format.
2. The git history is below. You may read the project's README in ${repo} to name
   modules in client language, but do not read source files.
3. Anything you cannot confirm from the history (environments, client blockers,
   dates) goes in as "to confirm" for the sender to fill in.
4. Save the update to ${outFile}.

Commits (date, subject, body):
${commits}

Merged pull requests:
${merges || "(none)"}
`;

for await (const message of query({
  prompt,
  options: {
    cwd: process.cwd(),                // repo root that holds .claude/skills/
    settingSources: ["project"],       // load skills from .claude/skills/
    skills: ["client-status-update"],  // only this skill is allowed
    additionalDirectories: [repo],     // read access to the project repo
    tools: ["Read", "Write", "Skill"], // the only tools available (no Bash)
    allowedTools: ["Read", "Write"],   // run these without permission prompts
    maxTurns: 15,
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "tool_use") console.log(`→ ${block.name}`);
    }
  }
  if (message.type === "result") {
    if (message.subtype === "success") {
      console.log(`\nDone: ${outFile}`);
      console.log(`Cost: $${message.total_cost_usd.toFixed(3)}`);
    } else {
      console.error(`Agent stopped: ${message.subtype}`);
    }
  }
}
