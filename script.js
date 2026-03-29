const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("show");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("show");
  });
});

/* Tabs */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    const target = document.getElementById(button.dataset.tab);
    if (target) target.classList.add("active");
  });
});

/* Command Explorer */
const commandData = {
  "git init": `> git init

Creates a new Git repository in the current folder.

Use it when:
- starting a new project
- turning an existing folder into a tracked Git repository`,

  "git status": `> git status

Shows:
- current branch
- modified files
- staged files
- untracked files

It is one of the most useful daily Git commands.`,

  "git add .": `> git add .

Stages all changed and new files for the next commit.

Safer option for one file:
git add filename`,

  'git commit -m "message"': `> git commit -m "message"

Creates a commit from staged changes.

Best practice:
Use clear messages like:
- "Fix mobile menu"
- "Add certificate section"`,

  "git log --oneline": `> git log --oneline

Displays commit history in compact form.

Useful for:
- seeing recent work
- finding commit IDs
- understanding project history`,

  "git branch feature-x": `> git branch feature-x

Creates a new branch called feature-x.

Why use branches?
- isolate work
- protect main
- build features safely`,

  "git switch feature-x": `> git switch feature-x

Switches to another branch.

Also useful:
git switch -c feature-x
This creates and switches in one step.`,

  "git merge feature-x": `> git merge feature-x

Merges changes from feature-x into the current branch.

Common flow:
1. switch to main
2. merge feature branch
3. push main`,

  "git remote add origin URL": `> git remote add origin URL

Connects your local project to a remote repository such as GitHub.

Example:
git remote add origin https://github.com/username/repo.git`,

  "git push -u origin main": `> git push -u origin main

Uploads your local commits to the remote repository.

- origin = remote name
- main = branch
- -u = remembers upstream branch`,

  "git pull origin main": `> git pull origin main

Downloads and merges the latest changes from GitHub into your local branch.

Use this before starting new work on shared repositories.`,

  "git stash": `> git stash

Temporarily saves uncommitted changes.

Useful when:
- you need to switch branches
- you need a clean working directory
- you're not ready to commit yet`,

  "git stash pop": `> git stash pop

Restores the latest stashed changes and removes them from stash list.`,

  "git rebase main": `> git rebase main

Moves your current branch commits on top of main.

Benefit:
Cleaner history.

Warning:
Be careful rebasing shared branches.`,

  "git revert abc123": `> git revert abc123

Creates a new commit that reverses the changes from commit abc123.

This is the safer undo method for shared history.`,

  "git reset --hard HEAD~1": `> git reset --hard HEAD~1

Moves branch history back by one commit and discards changes.

Warning:
This can permanently remove work.
Use carefully.`
};

const commandButtons = document.querySelectorAll(".command-btn");
const commandDisplay = document.getElementById("commandDisplay");

commandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    commandButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const command = button.dataset.command;
    commandDisplay.textContent = commandData[command] || "No explanation found.";
  });
});

/* Final Exam */
const answerButtons = document.querySelectorAll(".answer-btn");
const checkExamBtn = document.getElementById("checkExam");
const resetExamBtn = document.getElementById("resetExam");
const examResult = document.getElementById("examResult");

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.closest(".question");
    question.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
  });
});

checkExamBtn.addEventListener("click", () => {
  const questions = document.querySelectorAll(".question");
  let score = 0;

  questions.forEach((question) => {
    const selected = question.querySelector(".answer-btn.selected");
    if (selected && selected.classList.contains("correct")) {
      score++;
    }
  });

  examResult.textContent = `Your score: ${score} / ${questions.length}`;

  if (score === questions.length) {
    examResult.textContent += " — Excellent, you passed with a perfect score.";
  } else if (score >= 4) {
    examResult.textContent += " — Good job, you are on the right track.";
  } else {
    examResult.textContent += " — Keep studying and try again.";
  }
});

resetExamBtn.addEventListener("click", () => {
  answerButtons.forEach((btn) => btn.classList.remove("selected"));
  examResult.textContent = "";
});

/* Certificate */
const studentNameInput = document.getElementById("studentName");
const updateCertificateBtn = document.getElementById("updateCertificate");
const certificateName = document.getElementById("certificateName");

updateCertificateBtn.addEventListener("click", () => {
  const name = studentNameInput.value.trim();
  certificateName.textContent = name || "Your Name";
});
