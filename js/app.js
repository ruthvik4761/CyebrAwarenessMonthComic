/* =========================================================
   ALTER DOMUS CYBERSECURITY GRAND PRIX
   Data + game logic
   Images: assets/images/page-01.jpg ... page-14.jpg
   Audio:  assets/audio/bgm.mp3  (see assets/audio/README.md)
   ========================================================= */

const TIMELINE = [
  { type: "slide", img: "assets/images/page-01.jpg" },
  { type: "slide", img: "assets/images/page-02.jpg" },
  { type: "slide", img: "assets/images/page-03.jpg" },
  { type: "slide", img: "assets/images/page-04.jpg" },
  { type: "slide", img: "assets/images/page-05.jpg" },
  { type: "slide", img: "assets/images/page-06.jpg" },
  { type: "slide", img: "assets/images/page-07.jpg" },
  {
    type: "question",
    q: {
      id: "Q1",
      qimg: "assets/images/page-08.jpg",
      eyebrow: "8:52 AM — Race Day",
      prompt: "Eight minutes on the clock. An email lands: \u201cURGENT — Verify Your Alter Domus Credentials Before 9AM.\u201d The logo looks right. The sender looks familiar. Your cursor is already moving toward the link.",
      question: "What do you do?",
      options: [
        "Click the link — it looks official and the deadline feels real",
        "Ignore it and delete it without telling anyone",
        "Pause, check the sender domain carefully, and report it to the security team",
        "Forward it to a colleague to ask if they got the same one"
      ],
      correct: 2,
      win_text: "You take the four extra seconds. The domain is off by one letter. Security flags it before it spreads.",
      lesson: "Check the sender domain. Hover before you click. When something feels urgent, that's exactly when to slow down."
    }
  },
  {
    type: "question",
    q: {
      id: "Q2",
      qimg: "assets/images/page-09.jpg",
      eyebrow: "Mid-morning — a Teams message just buzzed",
      prompt: "\u201cHey, I've been locked out and I need to submit this in ten minutes — can I use your login just this once?\u201d You know this person. Two years working together. Your password field is already open in another tab.",
      question: "What do you do?",
      options: [
        "Share it — they're a trusted colleague and it's an emergency",
        "Say no, and help them contact IT support to restore their own access",
        "Share just your username, not your password",
        "Tell them to wait until tomorrow when IT is less busy"
      ],
      correct: 1,
      win_text: "You tell them no — and stay on the line while IT restores their own access properly. Ninety seconds slower. Zero risk.",
      lesson: "Never share credentials, not even once, not even for someone you trust. Point them to IT — that's not unhelpful, that's the job."
    }
  },
  {
    type: "question",
    q: {
      id: "Q3",
      qimg: "assets/images/page-10.jpg",
      eyebrow: "Mid-afternoon — client portfolio review",
      prompt: "A client's financial data won't format the way you need it to. A free AI assistant online says it can clean up the spreadsheet in seconds — for free, right now, no approval needed. You copy the client's confidential financial data and open the chat window.",
      question: "Is this okay?",
      options: [
        "Yes — it's just formatting help, and you'll delete the chat afterward",
        "No — confidential client data should never go into an unsanctioned public AI tool. Use an approved internal tool instead",
        "It's fine as long as you remove the client's name first",
        "Yes — the AI company probably doesn't keep the data anyway"
      ],
      correct: 1,
      win_text: "You close the tab and use the approved internal tool instead. AI Security would have flagged the upload to an unsanctioned service anyway — but you never gave it the chance. The client's data never leaves the building.",
      lesson: "AI Security should catch a risky upload to an unsanctioned AI service, and Data Security/DLP should catch sensitive client data trying to leave the organization. But the fastest defense is the one before both of those: don't paste client data into a tool that isn't approved."
    }
  },
  {
    type: "question",
    q: {
      id: "Q6",
      qimg: "assets/images/page-11.jpg",
      eyebrow: "End of day — closing your laptop",
      prompt: "One last notification: \u201cPlease update your password as a post-race precaution.\u201d You've known this password for three years. Your fingers are already typing it from memory.",
      question: "Is that the right call?",
      options: [
        "Yes — it's a strong password and you remember it, so it's fine to reuse",
        "No — reused passwords are a risk even if strong. Use a password manager to create and store a new unique one",
        "Yes — as long as you add a number to the end, it's different enough",
        "Not sure — just change it back after a few days when things calm down"
      ],
      correct: 1,
      win_text: "You open the password manager instead and let it generate something you'll never have to remember. Fresh credential, zero history.",
      lesson: "A password that has ever appeared in a breach is already compromised, no matter how strong it looks. Use a password manager. Every account, a unique password."
    }
  },
  { type: "slide", img: "assets/images/page-12.jpg" },
  { type: "slide", img: "assets/images/page-13.jpg" },
  { type: "slide", img: "assets/images/page-14.jpg" }
];

/* ============ game state & wiring ============ */
const slidesEl = document.getElementById('slides');
const nextZone = document.getElementById('next-zone');
const trackFill = document.getElementById('track-fill');
const trackCar = document.getElementById('track-car');
let idx = 0;
let score = 0;
let startTime = null;
const POINTS_PER_QUESTION = 250;
const TOTAL_QUESTIONS = TIMELINE.filter(t => t.type === 'question').length;
const MAX_SCORE = POINTS_PER_QUESTION * TOTAL_QUESTIONS;

/* ---- background music ---- */
const bgm = document.getElementById('bgm');
let musicOn = true;
bgm.volume = 0.35;

function initAudio() {
  if (musicOn) {
    bgm.play().catch(() => { /* autoplay may be blocked until a user gesture; ignored */ });
  }
}

function toggleMusic() {
  musicOn = !musicOn;
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = musicOn ? '🔊' : '🔇';
  bgm.muted = !musicOn;
  if (musicOn && bgm.paused) {
    bgm.play().catch(() => {});
  }
}

function pct(i) { return TIMELINE.length <= 1 ? 0 : (i / (TIMELINE.length - 1)) * 100; }

function updateTrack() {
  const p = pct(idx);
  trackFill.style.width = p + '%';
  trackCar.style.left = p + '%';
}

function clearSlides() { slidesEl.innerHTML = ''; }

function renderSlide(item) {
  clearSlides();
  nextZone.classList.remove('hidden');
  const div = document.createElement('div');
  div.className = 'slide active';
  const img = document.createElement('img');
  img.src = item.img;
  div.appendChild(img);
  slidesEl.appendChild(div);
}

function renderQuestion(item) {
  nextZone.classList.add('hidden');
  clearSlides();
  const q = item.q;

  const wrap = document.createElement('div');
  wrap.className = 'qwrap';

  const bg = document.createElement('img');
  bg.className = 'bg';
  bg.src = q.qimg;
  wrap.appendChild(bg);

  const panel = document.createElement('div');
  panel.className = 'qpanel';
  panel.innerHTML = `
    <div class="q-eyebrow">${q.eyebrow}</div>
    <div class="q-prompt">${q.prompt}</div>
    <div class="q-question">${q.question}</div>
    <div class="q-options"></div>
  `;
  const optWrap = panel.querySelector('.q-options');
  q.options.forEach((text, i) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = String.fromCharCode(65 + i) + ') ' + text;
    b.onclick = () => answer(item, i, b, optWrap);
    optWrap.appendChild(b);
  });
  wrap.appendChild(panel);
  slidesEl.appendChild(wrap);
}

function answer(item, i, btnEl, optWrap) {
  const q = item.q;
  const buttons = optWrap.querySelectorAll('.opt');
  buttons.forEach(b => b.disabled = true);
  const correct = i === q.correct;
  btnEl.classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    buttons[q.correct].classList.add('correct');
  }
  if (correct) {
    score += POINTS_PER_QUESTION;
  }

  setTimeout(() => showFeedback(item, correct), 550);
}

function showFeedback(item, correct) {
  const q = item.q;
  clearSlides();
  const wrap = document.createElement('div');
  wrap.className = 'feedback show';

  const bg = document.createElement('img');
  bg.className = 'bg';
  bg.src = q.qimg;
  wrap.appendChild(bg);

  const panel = document.createElement('div');
  panel.className = 'fpanel ' + (correct ? 'win' : 'neutral');

  if (correct) {
    panel.innerHTML = `
      <div class="f-title win">🏁 CORRECT — +${POINTS_PER_QUESTION} PTS</div>
      <div class="f-text">${q.win_text}</div>
      <div class="f-buttons">
        <button class="btn primary" id="continue-btn">CONTINUE →</button>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div class="f-title neutral">⚠️ NOT QUITE — +0 PTS</div>
      <div class="f-lesson">${q.lesson}</div>
      <div class="f-buttons">
        <button class="btn primary" id="continue-btn">CONTINUE →</button>
      </div>
    `;
  }
  wrap.appendChild(panel);
  slidesEl.appendChild(wrap);

  document.getElementById('continue-btn').onclick = () => advance();
}

function render() {
  updateTrack();
  const item = TIMELINE[idx];
  if (item.type === 'slide') { renderSlide(item); }
  else { renderQuestion(item); }
}

function advance() {
  if (idx < TIMELINE.length - 1) {
    idx++;
    render();
  } else {
    finish();
  }
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m + ':' + String(s).padStart(2, '0');
}

function finish() {
  nextZone.classList.add('hidden');
  clearSlides();
  const elapsed = startTime ? (Date.now() - startTime) : 0;
  const timeStr = formatTime(elapsed);
  const wrap = document.createElement('div');
  wrap.className = 'feedback show';
  wrap.style.background = 'radial-gradient(circle at 50% 30%,#1a1a1e,#000 75%)';
  const panel = document.createElement('div');
  panel.className = 'fpanel win';
  panel.innerHTML = `
    <div class="f-title win">🏁 YOU CROSSED THE FINISH LINE</div>
    <div class="f-text">You didn't just watch the race — you were part of the team that ran it.</div>
    <div class="f-scoreboard">
      <div class="f-stat"><span class="f-stat-label">FINAL SCORE</span><span class="f-stat-value">${score} / ${MAX_SCORE}</span></div>
      <div class="f-stat"><span class="f-stat-label">RACE TIME</span><span class="f-stat-value">${timeStr}</span></div>
    </div>
    <div class="f-buttons">
      <button class="btn ghost" id="restart-btn">🔁 RUN IT AGAIN</button>
    </div>
  `;
  wrap.appendChild(panel);
  slidesEl.appendChild(wrap);
  document.getElementById('restart-btn').onclick = () => { idx = 0; score = 0; startTime = Date.now(); render(); };
}

nextZone.addEventListener('click', () => {
  advance();
});

document.getElementById('start-btn').onclick = () => {
  document.getElementById('start').classList.add('hidden');
  startTime = Date.now();
  initAudio();
  render();
};

document.getElementById('mute-btn').onclick = () => {
  toggleMusic();
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    if (!nextZone.classList.contains('hidden')) advance();
  }
});
