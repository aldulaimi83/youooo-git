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

/* Tabs for lessons page */
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

/* Storage keys */
const LESSONS_KEY = "youooo_git_v4_lessons";
const CHALLENGES_KEY = "youooo_git_v4_challenges";
const CERT_NAME_KEY = "youooo_git_v4_name";

/* Helpers */
function getStoredArray(key, size) {
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  const result = Array.from({ length: size }, (_, i) => !!saved[i]);
  return result;
}

function saveArray(key, values) {
  localStorage.setItem(key, JSON.stringify(values));
}

function getLessonChecks() {
  return document.querySelectorAll(".lesson-check");
}

function getChallengeChecks() {
  return document.querySelectorAll(".challenge-check");
}

/* Lessons page */
function initLessonsPage() {
  const lessonChecks = getLessonChecks();
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

  updateLessonLocks();
}

function updateLessonLocks() {
  const lessonChecks = getLessonChecks();
  const completed = [...lessonChecks].filter((item) => item.checked).length;

  const intermediateLock = document.getElementById("intermediateLock");
  const intermediateContent = document.getElementById("intermediateContent");
  const advancedLock = document.getElementById("advancedLock");
  const advancedContent = document.getElementById("advancedContent");

  if (intermediateLock && intermediateContent) {
    if (completed >= 4) {
      intermediateLock.classList.add("hidden");
      intermediateContent.classList.remove("locked");
    } else {
      intermediateLock.classList.remove("hidden");
      intermediateContent.classList.add("locked");
    }
  }

  if (advancedLock && advancedContent) {
    if (completed >= 8) {
      advancedLock.classList.add("hidden");
      advancedContent.classList.remove("locked");
    } else {
      advancedLock.classList.remove("hidden");
      advancedContent.classList.add("locked");
    }
  }
}

/* Challenges page */
function initChallengesPage() {
  const challengeChecks = getChallengeChecks();
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

/* Home page progress + badges */
function updateHomeProgress() {
  const progressPercent = document.getElementById("progressPercent");
  const progressFill = document.getElementById("progressFill");
  const lessonCount = document.getElementById("lessonCount");
  const challengeCount = document.getElementById("challengeCount");
  const badgeCount = document.getElementById("badgeCount");

  if (!progressPercent || !progressFill) return;

  const lessons = getStoredArray(LESSONS_KEY, 12);
  const challenges = getStoredArray(CHALLENGES_KEY, 6);

  const completedLessons = lessons.filter(Boolean).length;
  const completedChallenges = challenges.filter(Boolean).length;

  let earnedBadges = 0;

  const beginnerBadge = document.querySelector("#badge-beginner .badge-status");
  const branchingBadge = document.querySelector("#badge-branching .badge-status");
  const challengeBadge = document.querySelector("#badge-challenge .badge-status");
  const expertBadge = document.querySelector("#badge-expert .badge-status");

  if (beginnerBadge) {
    if (completedLessons >= 4) {
      beginnerBadge.textContent = "Unlocked";
      beginnerBadge.className = "badge-status unlocked";
      earnedBadges++;
    } else {
      beginnerBadge.textContent = "Locked";
      beginnerBadge.className = "badge-status locked";
    }
  }

  if (branchingBadge) {
    if (completedLessons >= 8) {
      branchingBadge.textContent = "Unlocked";
      branchingBadge.className = "badge-status unlocked";
      earnedBadges++;
    } else {
      branchingBadge.textContent = "Locked";
      branchingBadge.className = "badge-status locked";
    }
  }

  if (challengeBadge) {
    if (completedChallenges >= 3) {
      challengeBadge.textContent = "Unlocked";
      challengeBadge.className = "badge-status unlocked";
      earnedBadges++;
    } else {
      challengeBadge.textContent = "Locked";
      challengeBadge.className = "badge-status locked";
    }
  }

  if (expertBadge) {
    if (completedLessons === 12 && completedChallenges === 6) {
      expertBadge.textContent = "Unlocked";
      expertBadge.className = "badge-status unlocked";
      earnedBadges++;
    } else {
      expertBadge.textContent = "Locked";
      expertBadge.className = "badge-status locked";
    }
  }

  const totalTasks = 18;
  const doneTasks = completedLessons + completedChallenges;
  const percent = Math.round((doneTasks / totalTasks) * 100);

  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  if (lessonCount) lessonCount.textContent = completedLessons;
  if (challengeCount) challengeCount.textContent = completedChallenges;
  if (badgeCount) badgeCount.textContent = earnedBadges;
}

/* Certificate */
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
  initChallengesPage();
  updateHomeProgress();
  initCertificate();
});
