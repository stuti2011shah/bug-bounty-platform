import bcrypt from "bcrypt";
import Bug from "../models/Bug.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function buildBugTitle() {
  const areas = ["Auth", "UI", "API", "Upload", "Profile", "Bounties", "Submissions", "Routing", "Search"];
  const issues = [
    "crashes",
    "shows wrong status",
    "allows duplicate submissions",
    "doesn't save",
    "returns 500 intermittently",
    "renders blank page",
    "fails on slow network",
    "accepts invalid input",
    "incorrectly marks as closed",
    "breaks on refresh",
  ];
  const contexts = [
    "on mobile",
    "when logged out",
    "after login",
    "after refresh",
    "with long titles",
    "with large payload",
    "when multiple tabs are open",
    "when attachment is added",
  ];
  return `${pick(areas)} ${pick(issues)} ${pick(contexts)}`;
}

function buildBugDescription() {
  const steps = [
    "Open the bug list and click into a bug.",
    "Try creating a submission with multiple proof links.",
    "Refresh the page and observe the state.",
    "Log out and attempt the same action again.",
    "Navigate between Bugs and Create Bug quickly.",
  ];
  const observed = [
    "The status badge doesn't update until hard refresh.",
    "A request returns 401 even with a valid token.",
    "The page flashes and loses form state.",
    "The server accepts a negative bounty amount (should not).",
    "The UI shows stale data after approval.",
  ];
  const expected = [
    "Status should update immediately after the API returns.",
    "User should remain authenticated across refresh.",
    "Validation errors should be shown inline.",
    "A closed bug should block new submissions.",
    "Approved submission should be highlighted and bug closed.",
  ];

  return [
    "### Steps to reproduce",
    ...shuffle(steps).slice(0, randInt(3, 5)).map((s, i) => `${i + 1}. ${s}`),
    "",
    "### Observed",
    `- ${pick(observed)}`,
    "",
    "### Expected",
    `- ${pick(expected)}`,
  ].join("\n");
}

function buildSubmissionFix() {
  const fixes = [
    "Add server-side validation and return a clear 400 error message.",
    "Fix client state update after mutation and re-fetch the bug details.",
    "Ensure auth token is attached to requests and handle 401 by logging out.",
    "Prevent duplicate submissions by enforcing a unique index and checking before create.",
    "Normalize status transitions (OPEN → IN_REVIEW → CLOSED) in one place.",
  ];
  const extras = [
    "Added tests for edge cases.",
    "Improved error handling and user messaging.",
    "Verified on mobile and desktop layouts.",
    "Added loading states for slow networks.",
  ];
  return `${pick(fixes)}\n\nNotes: ${pick(extras)}`;
}

function buildProofLinks() {
  const links = [
    "https://github.com/example/repro-steps",
    "https://gist.github.com/example/fix-diff",
    "https://example.com/log1.txt",
    "https://example.com/logs3.txt",
    "https://example.com/logs.txt",
  ];
  return shuffle(links).slice(0, randInt(1, 3));
}

async function ensureDemoUsers() {
  const demo = [
    { name: "Admin", email: "admin@demo.com", role: "admin", password: "password123" },
    { name: "Stuti", email: "stuti@demo.com", role: "user", password: "password123" },
    { name: "Priti", email: "priti@demo.com", role: "user", password: "password123" },
    { name: "Jay", email: "jay@demo.com", role: "user", password: "password123" },
  ];

  const users = [];
  for (const u of demo) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      existing = await User.create({
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash,
        totalWon: 0,
        winsCount: 0,
      });
    } else {
      // keep stable _id for tokens; normalize display fields and reset rewards each run
      existing.name = u.name;
      existing.role = u.role;
      existing.totalWon = 0;
      existing.winsCount = 0;
      await existing.save();
    }
    users.push(existing);
  }

  return users;
}

export async function seedDevDatabase() {
  const users = await ensureDemoUsers();

  // Always refresh dataset for nicer UI demos
  await Submission.deleteMany({});
  await Bug.deleteMany({});

  const BUG_COUNT = randInt(10, 16);
  const bugs = [];

  for (let i = 0; i < BUG_COUNT; i++) {
    const creator = pick(users);
    const bountyAmount = randInt(100, 5000);

    // Create bug initially OPEN; we may update status later after submissions
    const bug = await Bug.create({
      creator: creator._id,
      title: buildBugTitle(),
      description: buildBugDescription(),
      bountyAmount,
      status: "OPEN",
      rewarded: false,
      winner: null,
      winningSubmission: null,
    });

    bugs.push(bug);
  }

  // Submissions + some closed bugs with winners
  for (const bug of bugs) {
    const possibleSubmitters = users.filter((u) => String(u._id) !== String(bug.creator));
    const submissionCount = randInt(0, Math.min(4, possibleSubmitters.length));
    const chosen = shuffle(possibleSubmitters).slice(0, submissionCount);

    const createdSubs = [];
    for (const submitter of chosen) {
      const sub = await Submission.create({
        bug: bug._id,
        submitter: submitter._id,
        fixDescription: buildSubmissionFix(),
        proofLinks: buildProofLinks(),
        status: "PENDING",
      });
      createdSubs.push(sub);
    }

    if (createdSubs.length > 0) {
      bug.status = "IN_REVIEW";
      await bug.save();
    }

    // Randomly close some bugs that have submissions
    const shouldClose = createdSubs.length > 0 && Math.random() < 0.35;
    if (shouldClose) {
      const winnerSub = pick(createdSubs);

      await Submission.updateMany({ bug: bug._id }, { status: "REJECTED" });
      winnerSub.status = "APPROVED";
      await winnerSub.save();

      bug.status = "CLOSED";
      bug.rewarded = true;
      bug.winner = winnerSub.submitter;
      bug.winningSubmission = winnerSub._id;
      await bug.save();

      await User.findByIdAndUpdate(winnerSub.submitter, {
        $inc: { totalWon: bug.bountyAmount, winsCount: 1 },
      });
    }
  }

  return {
    usersSeeded: users.length,
    bugsSeeded: bugs.length,
  };
}

