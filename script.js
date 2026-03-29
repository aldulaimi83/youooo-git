const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

const commandInfo = {
  init: `> git init

Creates a new Git repository in the current folder.

Use it when:
- Starting a new project
- Turning an existing folder into a Git project`,

  status: `> git status

Shows:
- Modified files
- Staged files
- Current branch
- Untracked files`,

  add: `> git add .

Stages all changed files for the next commit.

Tip:
Use "git add filename" to stage only one file.`,

  commit: `> git commit -m "message"

Creates a saved snapshot of staged changes.

Best practice:
Write clear commit messages like:
- "Add login page"
- "Fix navbar bug"`,

  branch: `> git branch feature-x

Creates a new branch named feature-x.

Branches let you work safely without affecting main.`,

  switch: `> git switch feature-x

Moves you to another branch.

Modern alternative:
git checkout feature-x`,

  merge: `> git merge feature-x

Combines the selected branch into your current branch.

Usually done after finishing a feature.`,

  push: `> git push -u origin main

Uploads your local commits to GitHub.

- origin = remote name
- main = branch name`,

  pull: `> git pull origin main

Downloads changes from GitHub and merges them into your local branch.`,

  stash: `> git stash

Temporarily saves your uncommitted work so you can switch tasks.`,

  rebase: `> git rebase main

Replays your branch changes on top of main for a cleaner history.

Use carefully on shared branches.`,

  revert: `> git revert abc123

Creates a new commit that undoes commit abc123 safely.`
};

const commandButtons = document.querySelectorAll(".command-btn");
const terminalOutput = document.getElementById("terminalOutput");

commandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.dataset.command;
    terminalOutput.textContent = commandInfo[command] || "Command info not found.";
  });
});

const quizButtons = document.querySelectorAll(".quiz-btn");

quizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parent = button.parentElement;
    parent.querySelectorAll(".quiz-btn").forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

document.getElementById("checkQuiz").addEventListener("click", () => {
  const questions = document.querySelectorAll(".question");
  let score = 0;

  questions.forEach((question) => {
    const selected = question.querySelector(".quiz-btn.selected");
    if (selected && selected.dataset.correct === "true") {
      score++;
    }
  });

  document.getElementById("quizResult").textContent =
    `Your score: ${score} / ${questions.length}`;
});

document.getElementById("updateCertificate").addEventListener("click", () => {
  const name = document.getElementById("studentName").value.trim();
  document.getElementById("studentNamePreview").textContent =
    name || "Your Name";
});
