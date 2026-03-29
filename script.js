const LESSONS_KEY = "youooo_git_v5_lessons";
const CHALLENGES_KEY = "youooo_git_v5_challenges";
const EXAM_KEY = "youooo_git_v5_exam_passed";
const CERT_NAME_KEY = "youooo_git_v5_name";

/* Mobile nav */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("show");
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("show");
    });
  });
}

/* Helpers */
function getStoredArray(key, size) {
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  return Array.from({ length: size }, (_, i) => !!saved[i]);
}

function saveArray(key, values) {
  localStorage.setItem(key, JSON.stringify(values));
}

function isExamPassed() {
  return localStorage.getItem(EXAM_KEY) === "true";
}

function setExamPassed(value) {
  localStorage.setItem(EXAM_KEY, value ? "true" : "false");
}

/* Lessons page */
function initLessonsPage() {
  const lessonChecks = document.querySelectorAll(".lesson-check");
  const lessonBlocks = document.querySelectorAll(".lesson-block");
  const sideLinks = document.querySelectorAll(".side-link");

  if (!lessonChecks.length) return;

  const saved = getStoredArray(LESSONS_KEY, lessonChecks.length);

  lessonChecks.forEach((check, index) => {
    check.checked = saved[index];
    check.addEventListener("change", () => {
      const values = [...lessonChecks].map((item) => item.checked);
      saveArray(LESSONS_KEY, values);
      updateLessonLocks();
    });
  });

  sideLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const targetBlock = document.getElementById(targetId);
      if (!targetBlock) return;

      if (targetBlock.classList.contains("is-locked")) return;

      sideLinks.forEach((btn) => btn.classList.remove("active"));
      lessonBlocks.forEach((block) => block.classList.remove("active"));

      button.classList.add("active");
      targetBlock.classList.add("active");
      targetBlock.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  updateLessonLocks();
}

function updateLessonLocks() {
  const lessonChecks = document.querySelectorAll(".lesson-check");
  if (!lessonChecks.length) return;

  const completed = [...lessonChecks].filter((item) => item.checked).length;
  const lessonBlocks = document.querySelectorAll(".locked-lesson");
  const sideLinks = document.querySelectorAll(".side-link");

  lessonBlocks.forEach((block) => {
    const unlockAt = Number(block.dataset.unlock || "0");
    const shouldUnlock = completed >= unlockAt;

    if (shouldUnlock) {
      block.classList.remove("is-locked");
    } else {
      block.classList.add("is-locked");
    }
  });

  sideLinks.forEach((button) => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    if (target.classList.contains("is-locked")) {
      button.disabled = true;
      button.style.opacity = "0.45";
      button.style.cursor = "not-allowed";
    } else {
      button.disabled = false;
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }
  });

  const currentActive = document.querySelector(".lesson-block.active");
  if (currentActive && currentActive.classList.contains("is-locked")) {
    const firstUnlocked = document.querySelector(".lesson-block:not(.is-locked)");
    const firstSide = document.querySelector('.side-link:not([disabled])');

    document.querySelectorAll(".lesson-block").forEach((block) => block.classList.remove("active"));
    document.querySelectorAll(".side-link").forEach((btn) => btn.classList.remove("active"));

    if (firstUnlocked) firstUnlocked.classList.add("active");
    if (firstSide) firstSide.classList.add("active");
  }
}

/* Dictionary page */
const commandData = [
  {
    name: "git init",
    text: `> git init

Creates a new Git repository in the current folder.

Use it when:
- starting a new project
- turning an existing folder into a Git repo`
  },
  {
    name: "git status",
    text: `> git status

Shows:
- current branch
- modified files
- staged files
- untracked files`
  },
  {
    name: "git add .",
    text: `> git add .

Stages all changed files for the next commit.`
  },
  {
    name: 'git commit -m "message"',
    text: `> git commit -m "message"

Creates a commit from staged changes.

Good examples:
- "Fix mobile menu"
- "Add lesson page"`
  },
  {
    name: "git log --oneline",
    text: `> git log --oneline

Shows commit history in a short readable form.`
  },
  {
    name: "git switch -c feature-x",
    text: `> git switch -c feature-x

Creates a new branch and switches to it immediately.`
  },
  {
    name: "git merge feature-x",
    text: `> git merge feature-x

Merges the selected branch into the current branch.`
  },
  {
    name: "git remote add origin URL",
    text: `> git remote add origin URL

Connects your local project to a remote repository such as GitHub.`
  },
  {
    name: "git push -u origin main",
    text: `> git push -u origin main

Uploads your local commits and sets upstream tracking.`
  },
  {
    name: "git pull origin main",
    text: `> git pull origin main

Downloads and merges the latest changes from the remote repository.`
  },
  {
    name: "git stash",
    text: `> git stash

Temporarily stores unfinished local changes.`
  },
  {
    name: "git stash pop",
    text: `> git stash pop

Restores the latest stashed work and removes it from the stash list.`
  },
  {
    name: "git rebase main",
    text: `> git rebase main

Moves your current branch commits on top of updated main.

Benefit:
- cleaner history

Warning:
- be careful on shared branches`
  },
  {
    name: "git revert abc123",
    text: `> git revert abc123

Creates a new commit that reverses an older commit safely.`
  },
  {
    name: "git reset --hard HEAD~1",
    text: `> git reset --hard HEAD~1

Moves history back and discards local changes.

Warning:
- can permanently remove work`
  },
  {
    name: "git branch",
    text: `> git branch

Lists or creates branches depending on usage.`
  }
];

function initDictionaryPage() {
  const commandSearch = document.getElementById("commandSearch");
  const commandList = document.getElementById("commandList");
  const commandDisplay = document.getElementById("commandDisplay");

  if (!commandSearch || !commandList || !commandDisplay) return;

  function renderCommands(filter = "") {
    commandList.innerHTML = "";

    const filtered = commandData.filter((cmd) =>
      cmd.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (!filtered.length) {
      commandList.innerHTML = '<div class="card">No command found.</div>';
      commandDisplay.textContent = "No command found.";
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

      if (index === 0) {
        button.classList.add("active");
        commandDisplay.textContent = cmd.text;
      }
    });
  }

  commandSearch.addEventListener("input", (e) => {
    renderCommands(e.target.value);
  });

  renderCommands();
}

/* Challenges page */
function initChallengesPage() {
  const challengeChecks = document.querySelectorAll(".challenge-check");
  if (!challengeChecks.length) return;

  const saved = getStoredArray(CHALLENGES_KEY, challengeChecks.length);

  challengeChecks.forEach((check, index) => {
    check.checked = saved[index];
    check.addEventListener("change", () => {
      const values = [...challengeChecks].map((item) => item.checked);
      saveArray(CHALLENGES_KEY, values);
    });
  });
}

/* Exam page */
function initExamPage() {
  const answerButtons = document.querySelectorAll(".answer-btn");
  const checkExamBtn = document.getElementById("checkExam");
  const resetExamBtn = document.getElementById("resetExam");
  const examResult = document.getElementById("examResult");
  const examBreakdown = document.getElementById("examBreakdown");
  const examPassBox = document.getElementById("examPassBox");

  if (!answerButtons.length || !checkExamBtn || !resetExamBtn) return;

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
    examBreakdown.textContent = details.join("\n");

    if (score >= 6) {
      examResult.textContent += " — Passed. Certificate unlocked.";
      setExamPassed(true);
      if (examPassBox) examPassBox.classList.remove("hidden");
    } else {
      examResult.textContent += " — Not passed yet. You need 6 / 8 or higher.";
      setExamPassed(false);
      if (examPassBox) examPassBox.classList.add("hidden");
    }
  });

  resetExamBtn.addEventListener("click", () => {
    answerButtons.forEach((btn) => btn.classList.remove("selected"));
    examResult.textContent = "";
    examBreakdown.textContent = "";
    setExamPassed(false);
    if (examPassBox) examPassBox.classList.add("hidden");
  });

  if (isExamPassed() && examPassBox) {
    examPassBox.classList.remove("hidden");
  }
}

/* Home page progress + badges + certificate */
function updateHomeProgress() {
  const progressPercent = document.getElementById("progressPercent");
  const progressFill = document.getElementById("progressFill");
  const lessonCount = document.getElementById("lessonCount");
  const challengeCount = document.getElementById("challengeCount");
  const badgeCount = document.getElementById("badgeCount");
  const examStatus = document.getElementById("examStatus");

  if (!progressPercent || !progressFill) return;

  const lessons = getStoredArray(LESSONS_KEY, 12);
  const challenges = getStoredArray(CHALLENGES_KEY, 6);

  const completedLessons = lessons.filter(Boolean).length;
  const completedChallenges = challenges.filter(Boolean).length;
  const passedExam = isExamPassed();

  let earnedBadges = 0;

  const starter = document.getElementById("badge-starter");
  const branch = document.getElementById("badge-branch");
  const challenge = document.getElementById("badge-challenge");
  const certified = document.getElementById("badge-certified");

  function unlockBadge(element, unlocked) {
    if (!element) return false;
    if (unlocked) {
      element.textContent = "Unlocked";
      element.className = "badge-status unlocked";
      return true;
    } else {
      element.textContent = "Locked";
      element.className = "badge-status locked";
      return false;
    }
  }

  if (unlockBadge(starter, completedLessons >= 4)) earnedBadges++;
  if (unlockBadge(branch, completedLessons >= 8)) earnedBadges++;
  if (unlockBadge(challenge, completedChallenges >= 3)) earnedBadges++;
  if (unlockBadge(certified, passedExam)) earnedBadges++;

  const totalTasks = 19; // 12 lessons + 6 challenges + 1 exam
  const doneTasks = completedLessons + completedChallenges + (passedExam ? 1 : 0);
  const percent = Math.round((doneTasks / totalTasks) * 100);

  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  if (lessonCount) lessonCount.textContent = completedLessons;
  if (challengeCount) challengeCount.textContent = completedChallenges;
  if (badgeCount) badgeCount.textContent = earnedBadges;
  if (examStatus) examStatus.textContent = passedExam ? "Yes" : "No";

  const lockedBox = document.getElementById("certificateLockedBox");
  const unlockedBox = document.getElementById("certificateUnlockedBox");

  if (lockedBox && unlockedBox) {
    if (passedExam) {
      lockedBox.classList.add("hidden");
      unlockedBox.classList.remove("locked");
    } else {
      lockedBox.classList.remove("hidden");
      unlockedBox.classList.add("locked");
    }
  }
}

function initCertificate() {
  const studentNameInput = document.getElementById("studentName");
  const updateCertificateBtn = document.getElementById("updateCertificate");
  const certificateName = document.getElementById("certificateName");
  const downloadCertificateBtn = document.getElementById("downloadCertificate");

  if (!certificateName) return;

  const savedName = localStorage.getItem(CERT_NAME_KEY);
  if (savedName) {
    certificateName.textContent = savedName;
    if (studentNameInput) studentNameInput.value = savedName;
  }

  if (updateCertificateBtn && studentNameInput) {
    updateCertificateBtn.addEventListener("click", () => {
      const name = studentNameInput.value.trim() || "Your Name";
      certificateName.textContent = name;
      localStorage.setItem(CERT_NAME_KEY, name);
    });
  }

  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener("click", () => {
      if (!isExamPassed()) return;

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
  }
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  initLessonsPage();
  initDictionaryPage();
  initChallengesPage();
  initExamPage();
  updateHomeProgress();
  initCertificate();
});
