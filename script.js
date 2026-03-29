/* Mobile nav */
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

/* Lesson tabs */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    const targetPanel = document.getElementById(button.dataset.tab);
    if (targetPanel) targetPanel.classList.add("active");
  });
});

/* Progress tracker */
const lessonChecks = document.querySelectorAll(".lesson-check");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const markAllCompleteBtn = document.getElementById("markAllComplete");
const resetProgressBtn = document.getElementById("resetProgress");

function updateProgress() {
  const total = lessonChecks.length;
  const completed = [...lessonChecks].filter((item) => item.checked).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;

  localStorage.setItem(
    "youooo_git_progress_v3",
    JSON.stringify([...lessonChecks].map((item) => item.checked))
  );
}

function loadProgress() {
  const saved = JSON.parse(localStorage.getItem("youooo_git_progress_v3") || "[]");
  lessonChecks.forEach((item, index) => {
    item.checked = !!saved[index];
  });
  updateProgress();
}

lessonChecks.forEach((item) => {
  item.addEventListener("change", updateProgress);
});

markAllCompleteBtn.addEventListener("click", () => {
  lessonChecks.forEach((item) => {
    item.checked = true;
  });
  updateProgress();
});

resetProgressBtn.addEventListener("click", () => {
  lessonChecks.forEach((item) => {
    item.checked = false;
  });
  updateProgress();
});

loadProgress();

/* Searchable command dictionary */
const commandSearch = document.getElementById("commandSearch");
const commandList = document.getElementById("commandList");
const commandDisplay = document.getElementById("commandDisplay");

const commands = [
  {
    name: "git init",
    text: `> git init

Creates a new Git repository in the current folder.

Use it when:
- starting a brand new project
- turning an existing folder into a Git repo`
  },
  {
    name: "git status",
    text: `> git status

Shows:
- active branch
- staged files
- modified files
- untracked files

This is one of the most important daily Git commands.`
  },
  {
    name: "git add .",
    text: `> git add .

Stages all modified and new files for the next commit.

Safer single-file version:
git add filename`
  },
  {
    name: 'git commit -m "message"',
    text: `> git commit -m "message"

Creates a snapshot of staged changes.

Good examples:
- "Fix mobile nav"
- "Add certificate section"`
  },
  {
    name: "git log --oneline",
    text: `> git log --oneline

Shows a short compact commit history.

Useful for:
- finding commit IDs
- reading recent work
- checking timeline`
  },
  {
    name: "git branch feature-x",
    text: `> git branch feature-x

Creates a new branch named feature-x.

Branches help isolate work from main.`
  },
  {
    name: "git switch feature-x",
    text: `> git switch feature-x

Moves you to another branch.

Create and switch in one line:
git switch -c feature-x`
  },
  {
    name: "git merge feature-x",
    text: `> git merge feature-x

Merges the selected branch into the current branch.

Common use:
switch to main, then merge feature branch into it.`
  },
  {
    name: "git remote add origin URL",
    text: `> git remote add origin URL

Connects your local repository to a remote repository.

Example:
git remote add origin https://github.com/username/repo.git`
  },
  {
    name: "git push -u origin main",
    text: `> git push -u origin main

Uploads commits to GitHub and sets upstream tracking.`
  },
  {
    name: "git pull origin main",
    text: `> git pull origin main

Downloads and merges the latest changes from the remote repository.`
  },
  {
    name: "git stash",
    text: `> git stash

Temporarily stores unfinished local changes.

Useful when:
- you need to switch branches
- you are not ready to commit yet`
  },
  {
    name: "git stash pop",
    text: `> git stash pop

Restores the latest stashed work and removes it from stash list.`
  },
  {
    name: "git rebase main",
    text: `> git rebase main

Moves your current branch commits on top of the latest main.

Benefit:
cleaner history

Warning:
be careful rebasing shared branches`
  },
  {
    name: "git revert abc123",
    text: `> git revert abc123

Creates a new commit that reverses commit abc123.

This is safer than rewriting shared history.`
  },
  {
    name: "git reset --hard HEAD~1",
    text: `> git reset --hard HEAD~1

Moves history back by one commit and discards local changes.

Warning:
this can permanently remove work`
  }
];

function renderCommands(filter = "") {
  commandList.innerHTML = "";
  const filtered = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!filtered.length) {
    commandList.innerHTML = `<div class="card">No command found.</div>`;
    return;
  }

  filtered.forEach((cmd, index) => {
    const button = document.createElement("button");
    button.className = "command-btn";
    button.textContent = cmd.name;

    button.addEventListener("click", () => {
      document.querySelectorAll("#commandList .command-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
      commandDisplay.textContent = cmd.text;
    });

    commandList.appendChild(button);

    if (index === 0 && !filter) {
      button.classList.add("active");
      commandDisplay.textContent = cmd.text;
    }
  });
}

commandSearch.addEventListener("input", (e) => {
  renderCommands(e.target.value);
});

renderCommands();

/* Exam */
const answerButtons = document.querySelectorAll(".answer-btn");
const checkExamBtn = document.getElementById("checkExam");
const resetExamBtn = document.getElementById("resetExam");
const examResult = document.getElementById("examResult");
const examBreakdown = document.getElementById("examBreakdown");

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.closest(".question");
    question.querySelectorAll(".answer-btn").forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

checkExamBtn.addEventListener("click", () => {
  const questions = document.querySelectorAll(".question");
  let score = 0;
  let details = [];

  questions.forEach((question, index) => {
    const selected = question.querySelector(".answer-btn.selected");
    if (selected && selected.classList.contains("correct")) {
      score++;
      details.push(`Question ${index + 1}: Correct`);
    } else {
      details.push(`Question ${index + 1}: Incorrect`);
    }
  });

  examResult.textContent = `Your score: ${score} / ${questions.length}`;

  if (score === questions.length) {
    examResult.textContent += " — Perfect score.";
  } else if (score >= 5) {
    examResult.textContent += " — Great job.";
  } else if (score >= 3) {
    examResult.textContent += " — Good start, keep practicing.";
  } else {
    examResult.textContent += " — Review the lessons and try again.";
  }

  examBreakdown.textContent = details.join("\n");
});

resetExamBtn.addEventListener("click", () => {
  answerButtons.forEach((btn) => btn.classList.remove("selected"));
  examResult.textContent = "";
  examBreakdown.textContent = "";
});

/* Certificate */
const studentName = document.getElementById("studentName");
const updateCertificate = document.getElementById("updateCertificate");
const certificateName = document.getElementById("certificateName");
const downloadCertificate = document.getElementById("downloadCertificate");
const certificatePreview = document.getElementById("certificatePreview");

updateCertificate.addEventListener("click", () => {
  const name = studentName.value.trim();
  certificateName.textContent = name || "Your Name";
});

downloadCertificate.addEventListener("click", () => {
  const name = certificateName.textContent.trim() || "Your Name";

  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1400, 900);
  gradient.addColorStop(0, "#143a66");
  gradient.addColorStop(1, "#0b1524");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1400, 900);

  ctx.strokeStyle = "#82c4ff";
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1320, 820);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, 1260, 760);

  ctx.fillStyle = "#b7dbff";
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Youooo Academy", 700, 150);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 58px Arial";
  ctx.fillText("Certificate of Completion", 700, 250);

  ctx.fillStyle = "#c9d7e6";
  ctx.font = "32px Arial";
  ctx.fillText("This certifies that", 700, 345);

  ctx.fillStyle = "#ffd79a";
  ctx.font = "bold 60px Arial";
  ctx.fillText(name, 700, 440);

  ctx.fillStyle = "#c9d7e6";
  ctx.font = "32px Arial";
  ctx.fillText("has successfully completed", 700, 530);

  ctx.fillStyle = "#9bd0ff";
  ctx.font = "bold 42px Arial";
  ctx.fillText("Youooo Git: Beginner to Expert", 700, 610);

  ctx.fillStyle = "#c9d7e6";
  ctx.font = "28px Arial";
  ctx.fillText("Issued by Youooo Academy", 700, 720);

  const link = document.createElement("a");
  link.download = "youooo-git-certificate.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
