// ===== CHALLENGE PAGE SCRIPT =====
// This file handles the Speed Challenge functionality with ZERO latency using Web Speech API
(() => {
  // ===== DOM ELEMENTS =====
  const pregameScreen = document.getElementById("pregameScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const timerValue = document.getElementById("timerValue");
  const liveWpm = document.getElementById("liveWpm");
  const streakCount = document.getElementById("streakCount");
  const currentPhoneticEl = document.getElementById("currentPhonetic");
  const userTranscript = document.getElementById("userTranscript");
  const feedbackFlash = document.getElementById("feedbackFlash");
  const highScoreValue = document.getElementById("highScoreValue");
  const startBtn = document.getElementById("startChallengeBtn");
  const endBtn = document.getElementById("endChallengeBtn");
  const listenBtn = document.getElementById("listenHintBtn");

  // ===== GAME STATE variables =====
  const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://pronounceright-1.onrender.com";

  let challengeWords = [];
  let currentIndex = 0;
  let correctCount = 0;
  let totalAttempts = 0;
  let currentStreak = 0;
  let highestStreak = 0;
  let challengeDuration = 60; // default to 60s
  let challengeDifficulty = "easy";
  let challengeTimer = null;
  let challengeStartTime = null;
  let isChallengeActive = false;
  let countdownInterval = null;
  let recognition = null;
  let wordsPronounced = [];
  let lastMatchedIndex = -1;
  let lastProcessedIndex = -1;
  let feedbackTimeout = null;

  // ===== INITIALIZATION =====
  function init() {
    if (startBtn) {
      startBtn.addEventListener("click", startChallenge);
    }

    if (endBtn) {
      endBtn.addEventListener("click", stopChallenge);
    }

    if (listenBtn) {
      listenBtn.addEventListener("click", () => {
        if (challengeWords[currentIndex]) {
          const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "english";
          speakWord(challengeWords[currentIndex].text, selectedLang);
        }
      });
    }

    if (!document.querySelector(".challenge-section")) {
      return; // Not on challenge page
    }

    initializeSettings();
    loadHighScore();
    setupRecentRunsToggle();
    renderChallengeHistory();
    console.log("[v0] Challenge page initialized with SpeechRecognition");
  }

  function initializeSettings() {
    // Duration buttons
    document.querySelectorAll(".duration-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".duration-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        challengeDuration = Number.parseInt(this.dataset.duration);
      });
    });

    // Difficulty buttons
    document.querySelectorAll(".difficulty-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".difficulty-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        challengeDifficulty = this.dataset.difficulty;
      });
    });
  }

  function loadHighScore() {
    const highScore = localStorage.getItem("pronunciationSpeedHighScore") || 0;
    if (highScoreValue) {
      highScoreValue.textContent = `${highScore} WPM`;
    }
  }

  function setupRecentRunsToggle() {
    const toggleBtn = document.getElementById("toggleRecentRunsBtn");
    const collapsePanel = document.getElementById("recentRunsCollapsePanel");
    if (!toggleBtn || !collapsePanel) return;

    // Reset inline max-height to avoid state mismatches
    collapsePanel.style.maxHeight = collapsePanel.classList.contains("expanded") 
      ? collapsePanel.scrollHeight + "px" 
      : "0px";

    toggleBtn.addEventListener("click", () => {
      const isExpanded = collapsePanel.classList.toggle("expanded");
      toggleBtn.classList.toggle("active");
      const textSpan = toggleBtn.querySelector("span");
      if (textSpan) {
        textSpan.textContent = isExpanded ? "Hide Recent Runs" : "Show Recent Runs";
      }

      if (isExpanded) {
        collapsePanel.style.maxHeight = collapsePanel.scrollHeight + "px";
      } else {
        collapsePanel.style.maxHeight = "0px";
      }
    });
  }

  function renderChallengeHistory() {
    const listEl = document.getElementById("challengeHistoryList");
    if (!listEl) return;

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem("pronounce_right_challenge_history")) || [];
    } catch (e) {
      console.error("Failed to parse challenge history", e);
      history = [];
    }

    if (!Array.isArray(history) || history.length === 0) {
      listEl.innerHTML = `
        <div class="challenge-history-placeholder">
          Complete challenges to track your records!
        </div>
      `;
      
      const collapsePanel = document.getElementById("recentRunsCollapsePanel");
      if (collapsePanel && collapsePanel.classList.contains("expanded")) {
        collapsePanel.style.maxHeight = collapsePanel.scrollHeight + "px";
      }
      return;
    }

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    const recent = history.slice(0, 10);
    listEl.innerHTML = recent
      .map(
        (run) => `
        <div class="challenge-history-item">
          <div class="challenge-history-meta">
            <div class="challenge-history-lang">${capitalize(run.language)} (${capitalize(run.difficulty)})</div>
            <div class="challenge-history-date">${run.date}</div>
          </div>
          <div class="challenge-history-stats">
            <div class="challenge-history-wpm">${run.wpm} WPM</div>
            <div class="challenge-history-acc">${run.accuracy}% Acc • ${run.duration}s</div>
          </div>
        </div>
      `
      )
      .join("");

    const collapsePanel = document.getElementById("recentRunsCollapsePanel");
    if (collapsePanel && collapsePanel.classList.contains("expanded")) {
      setTimeout(() => {
        collapsePanel.style.maxHeight = collapsePanel.scrollHeight + "px";
      }, 50);
    }
  }

  function speakWord(text, langKey) {
    if (window.speakTextWithGoogleTTS) {
      window.speakTextWithGoogleTTS(text, langKey);
    } else {
      if (!("speechSynthesis" in window)) return;
      const ttsMap = {
        english: "en-US",
        hindi: "hi-IN",
        marathi: "mr-IN",
        tamil: "ta-IN",
        telugu: "te-IN",
        kannada: "kn-IN",
        malayalam: "ml-IN",
        gujarati: "gu-IN",
        bengali: "bn-IN",
        punjabi: "pa-IN",
      };
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = ttsMap[langKey] || "en-US";
      const savedRate = localStorage.getItem("pronounce_right_speak_rate");
      utterance.rate = savedRate ? parseFloat(savedRate) : 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  function showFeedback(isCorrect) {
    if (!feedbackFlash) return;

    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }

    feedbackFlash.className =
      "feedback-flash " + (isCorrect ? "correct" : "incorrect");
    const icon = feedbackFlash.querySelector(".feedback-icon");
    const text = feedbackFlash.querySelector(".feedback-text");

    if (icon) icon.textContent = isCorrect ? "✓" : "✗";
    if (text) text.textContent = isCorrect ? "Correct!" : "Try again";

    feedbackFlash.classList.remove("hidden");

    feedbackTimeout = setTimeout(() => {
      feedbackFlash.classList.add("hidden");
    }, 800);
  }

  // ===== START CHALLENGE =====
  async function startChallenge() {
    if (isChallengeActive) return;
    if (startBtn) startBtn.disabled = true;

    isChallengeActive = true;
    pregameScreen?.classList.add("hidden");
    gameScreen?.classList.remove("hidden");
    resultsScreen?.classList.add("hidden");

    // Reset stats
    correctCount = 0;
    totalAttempts = 0;
    currentStreak = 0;
    highestStreak = 0;
    currentIndex = 0;
    wordsPronounced = [];
    lastMatchedIndex = -1;
    lastProcessedIndex = -1;
    feedbackTimeout = null;

    if (streakCount) streakCount.textContent = 0;
    const liveCorrectEl = document.getElementById("correctCount");
    if (liveCorrectEl) liveCorrectEl.textContent = 0;
    if (liveWpm) liveWpm.textContent = 0;
    if (userTranscript) userTranscript.textContent = "-";

    challengeStartTime = Date.now();

    const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "english";
    const languageMap = {
      english: "en",
      hindi: "hi",
      marathi: "mr",
      tamil: "ta",
      telugu: "te",
      kannada: "kn",
      malayalam: "ml",
      gujarati: "gu",
      bengali: "bn",
      punjabi: "pa",
    };
    const backendLang = languageMap[selectedLang] || "en";

    // Fetch 100 words dynamically from the database
    try {
      const response = await fetch(
        `${BASE_URL}/content?mode=word&difficulty=${challengeDifficulty}&language=${backendLang}&limit=100`,
      );
      if (!response.ok) throw new Error("Database fetch failed");
      const data = await response.json();
      challengeWords = data.words || [];
    } catch (e) {
      console.error("Error fetching challenge words:", e);
      alert("Failed to load challenge words. Make sure your FastAPI backend is running!");
      isChallengeActive = false;
      if (startBtn) startBtn.disabled = false;
      pregameScreen?.classList.remove("hidden");
      gameScreen?.classList.add("hidden");
      return;
    }

    if (challengeWords.length === 0) {
      alert("No words available in the database for this language/difficulty.");
      isChallengeActive = false;
      if (startBtn) startBtn.disabled = false;
      pregameScreen?.classList.remove("hidden");
      gameScreen?.classList.add("hidden");
      return;
    }

    // Render all words in the words container
    const container = document.getElementById("wordsContainer");
    if (container) {
      container.innerHTML = challengeWords
        .map(
          (word, idx) =>
            `<span class="challenge-word" id="challenge-word-${idx}">${word.text}</span>`
        )
        .join(" ");

      // Add click listeners to all spans to play phonetic hint on click
      container.querySelectorAll(".challenge-word").forEach((span, idx) => {
        span.addEventListener("click", () => {
          const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "english";
          speakWord(challengeWords[idx].text, selectedLang);
        });
      });
    }

    updateActiveWordHighlight();

    startTimer();
    startSpeechRecognition();
  }

  // ===== UPDATE HIGHLIGHT AND CENTER SCROLL =====
  function updateActiveWordHighlight() {
    // Remove active class from all spans
    document.querySelectorAll(".challenge-word").forEach((span, idx) => {
      span.classList.remove("active");
      if (idx === currentIndex) {
        span.classList.add("active");

        // Update phonetic guide
        if (currentPhoneticEl) {
          currentPhoneticEl.textContent = challengeWords[idx].phonetic || "";
        }

        // Center active word inside the display area container
        const containerArea = document.querySelector(".words-display-area");
        if (containerArea) {
          const activeTop = span.offsetTop;
          const containerHeight = containerArea.clientHeight;
          const wordHeight = span.offsetHeight;
          
          // Center scroll active word
          const desiredScrollTop = activeTop - containerHeight / 2 + wordHeight / 2;
          containerArea.scrollTo({
            top: desiredScrollTop,
            behavior: "smooth"
          });
        }
      }
    });
  }

  // ===== TIMER =====
  function startTimer() {
    let secondsLeft = challengeDuration;
    if (timerValue) timerValue.textContent = secondsLeft;

    countdownInterval = setInterval(() => {
      secondsLeft--;
      if (timerValue) timerValue.textContent = secondsLeft;

      if (secondsLeft <= 5) {
        timerValue?.parentElement?.classList.add("warning");
      }

      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    challengeTimer = setTimeout(() => {
      stopChallenge();
    }, challengeDuration * 1000);
  }

  // ===== SPEECH RECOGNITION ENGINE =====
  function startSpeechRecognition() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      isChallengeActive = false;
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "english";
    const langCodes = {
      english: "en-IN", // Switch to Indian English acoustic model for Indian names/accent recognition
      hindi: "hi-IN",
      marathi: "mr-IN",
      tamil: "ta-IN",
      telugu: "te-IN",
      kannada: "kn-IN",
      malayalam: "ml-IN",
      gujarati: "gu-IN",
      bengali: "bn-IN",
      punjabi: "pa-IN",
    };

    recognition.lang = langCodes[selectedLang] || "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      if (!isChallengeActive) return;
      const resultIndex = event.resultIndex;
      const result = event.results[resultIndex];
      const transcript = result[0].transcript.trim();

      // 1. If we already matched this result index, ignore it completely
      if (resultIndex <= lastMatchedIndex) {
        return;
      }

      const targetWord = challengeWords[currentIndex].text;
      const matchResult = evaluateMatch(targetWord, transcript);
      const accuracy = matchResult.accuracy;
      const isCorrect = matchResult.isCorrect;

      if (isCorrect) {
        lastMatchedIndex = resultIndex;
        evaluateSpeech(transcript, true, accuracy);
      } else if (result.isFinal && resultIndex > lastProcessedIndex) {
        lastProcessedIndex = resultIndex;
        evaluateSpeech(transcript, false, accuracy);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (isChallengeActive && event.error === "no-speech") {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };

    recognition.onend = () => {
      if (isChallengeActive) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  }

  // ===== EVALUATE SPEECH RESULT =====
  function evaluateSpeech(spokenText, isCorrect, accuracy) {
    if (!isChallengeActive || !challengeWords[currentIndex]) return;

    totalAttempts++;
    const targetWord = challengeWords[currentIndex].text;

    if (userTranscript) {
      userTranscript.textContent = spokenText;
    }

    console.log(`Evaluated: Target="${targetWord}", Spoken="${spokenText}", Accuracy=${accuracy}%`);

    wordsPronounced.push({
      word: targetWord,
      spoken: spokenText,
      accuracy: accuracy,
      success: isCorrect,
    });

    if (isCorrect) {
      correctCount++;
      currentStreak++;
      if (currentStreak > highestStreak) {
        highestStreak = currentStreak;
      }

      if (streakCount) streakCount.textContent = currentStreak;
      showFeedback(true);

      // Go to next word
      const activeSpan = document.getElementById(`challenge-word-${currentIndex}`);
      if (activeSpan) {
        activeSpan.classList.remove("incorrect");
        activeSpan.classList.add("correct");
      }

      currentIndex++;
      if (currentIndex >= challengeWords.length) {
        currentIndex = 0; // wrap around
      }
      updateActiveWordHighlight();
    } else {
      const activeSpan = document.getElementById(`challenge-word-${currentIndex}`);
      if (activeSpan) {
        activeSpan.classList.add("incorrect");
        activeSpan.classList.remove("incorrect-pulse");
        void activeSpan.offsetWidth; // trigger reflow
        activeSpan.classList.add("incorrect-pulse");
      }

      currentStreak = 0;
      if (streakCount) streakCount.textContent = currentStreak;
      showFeedback(false);
    }

    updateWPM();
  }

  function updateWPM() {
    const elapsedMinutes = (Date.now() - challengeStartTime) / 1000 / 60;
    const wpm = elapsedMinutes > 0 ? correctCount / elapsedMinutes : 0;

    if (liveWpm) {
      liveWpm.textContent = Math.round(wpm);
    }

    const liveCorrectEl = document.getElementById("correctCount");
    if (liveCorrectEl) {
      liveCorrectEl.textContent = correctCount;
    }
  }

  // ===== STOP CHALLENGE =====
  function stopChallenge() {
    if (startBtn) startBtn.disabled = false;
    isChallengeActive = false;

    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }

    clearTimeout(challengeTimer);
    clearInterval(countdownInterval);

    const elapsedSeconds = (Date.now() - challengeStartTime) / 1000;
    const elapsedMinutes = elapsedSeconds / 60;
    const finalWpmVal = elapsedMinutes > 0 ? correctCount / elapsedMinutes : 0;
    const wpmRounded = Math.round(finalWpmVal);

    // Update results screen DOM elements
    const finalWpmEl = document.getElementById("finalWpm");
    const totalCorrectEl = document.getElementById("totalCorrect");
    const totalAttemptsEl = document.getElementById("totalAttempts");
    const accuracyPercentEl = document.getElementById("accuracyPercent");
    const bestStreakEl = document.getElementById("bestStreak");
    const newHighScoreBanner = document.getElementById("newHighScore");
    const wordsSummaryList = document.getElementById("wordsSummaryList");

    if (finalWpmEl) finalWpmEl.textContent = wpmRounded;
    if (totalCorrectEl) totalCorrectEl.textContent = correctCount;
    if (totalAttemptsEl) totalAttemptsEl.textContent = totalAttempts;

    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    if (accuracyPercentEl) accuracyPercentEl.textContent = `${accuracy}%`;
    if (bestStreakEl) bestStreakEl.textContent = highestStreak;

    // Save to challenge history
    try {
      const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "english";
      const historyItem = {
        wpm: wpmRounded,
        accuracy: accuracy,
        duration: challengeDuration,
        difficulty: challengeDifficulty,
        language: selectedLang,
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      let history = JSON.parse(localStorage.getItem("pronounce_right_challenge_history")) || [];
      if (!Array.isArray(history)) {
        history = [];
      }
      history.unshift(historyItem);
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      localStorage.setItem("pronounce_right_challenge_history", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save challenge run history", e);
    }

    // High score check
    const previousHigh = parseFloat(
      localStorage.getItem("pronunciationSpeedHighScore") || 0,
    );

    if (wpmRounded > previousHigh) {
      localStorage.setItem("pronunciationSpeedHighScore", wpmRounded);
      if (newHighScoreBanner) newHighScoreBanner.classList.remove("hidden");
    } else {
      if (newHighScoreBanner) newHighScoreBanner.classList.add("hidden");
    }

    // Populate pronounced words summary
    if (wordsSummaryList) {
      if (wordsPronounced.length === 0) {
        wordsSummaryList.innerHTML = `<div class="no-words">No words attempted</div>`;
      } else {
        wordsSummaryList.innerHTML = wordsPronounced
          .map(
            (w) => `
            <div class="summary-word-item ${w.success ? 'correct' : 'incorrect'}">
              <span class="status-dot"></span>
              <span class="word-val">${w.word}</span>
              <span class="spoken-val">You said: "${w.spoken || '-'}" (${w.accuracy}%)</span>
            </div>
          `
          )
          .join("");
      }
    }

    alert(
      `Challenge finished!\nScore: ${correctCount}\nWPM: ${wpmRounded}`,
    );

    gameScreen?.classList.add("hidden");
    resultsScreen?.classList.remove("hidden");
  }

  function toDevanagari(char) {
    const code = char.charCodeAt(0);
    if (code >= 0x0900 && code <= 0x0D7F) {
      const offset = (code - 0x0900) % 0x0080;
      return String.fromCharCode(0x0900 + offset);
    }
    return char;
  }

  function transliterateIndicToEnglish(text) {
    if (!text) return "";
    const devanagariText = text.split('').map(toDevanagari).join('');
    
    const mapping = {
      // Independent vowels
      'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri', 
      'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
      // Consonants
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
      'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
      'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
      'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
      'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
      'ळ': 'l', 'क्ष': 'ksh', 'ज्ञ': 'gy',
      // Vowel signs (matras)
      'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 
      'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
      // Southern short vowels
      'ॆ': 'e', 'ॊ': 'o',
      // Malayalam/Tamil special letters (offset mapping)
      'ऱ': 'r', 'ऴ': 'l', 'ऩ': 'n',
      // Other signs
      'ं': 'n', 'ः': 'h', 'ँ': 'n', '्': ''
    };

    let result = '';
    for (let i = 0; i < devanagariText.length; i++) {
      const char = devanagariText[i];
      const nextChar = devanagariText[i + 1] || '';
      
      const isConsonant = (char >= 'क' && char <= 'ह') || char === 'ळ' || char === 'ऱ' || char === 'ऴ' || char === 'ऩ';
      
      let translit = mapping[char] || char;
      
      if (isConsonant) {
        const isNextHalant = nextChar === '्';
        const isNextMatra = nextChar in mapping && (nextChar.charCodeAt(0) >= 0x093E && nextChar.charCodeAt(0) <= 0x094C || nextChar === 'ॆ' || nextChar === 'ॊ');
        
        if (!isNextHalant && !isNextMatra && nextChar !== '' && nextChar !== ' ') {
          translit += 'a';
        }
      }
      
      result += translit;
    }
    
    return result
      .toLowerCase()
      .replace(/aa/g, 'a')
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u')
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function phoneticNormalize(text) {
    if (!text) return "";
    let str = text.toLowerCase();
    
    // Switch acoustic blends that STT engines mismatch under Indian accents
    str = str.replace(/tr/g, "sr"); // e.g. treya -> sreya
    
    // Simplify consonant sounds
    str = str.replace(/ee/g, "i")
             .replace(/oo/g, "u")
             .replace(/w/g, "v")
             .replace(/sh/g, "s")
             .replace(/ch/g, "s")
             .replace(/bh/g, "b")
             .replace(/dh/g, "d")
             .replace(/gh/g, "g")
             .replace(/kh/g, "k")
             .replace(/ph/g, "p")
             .replace(/th/g, "t")
             .replace(/jh/g, "j")
             .replace(/h/g, ""); // strip all 'h's for Indian name variations (e.g. ghoshal -> gosal, kohli -> koli)
             
    // Vowel invariance: strip all vowels to prevent accent mismatches
    str = str.replace(/[aeiouy]/g, "");
    
    // Clean non-alphanumeric
    str = str.replace(/[^a-z0-9]/g, "");
    
    return str.trim();
  }

  function calculateAccuracy(target, spoken) {
    if (!target || !spoken) return 0;
    const targetNorm = normalizeText(target);
    const spokenNorm = normalizeText(spoken);

    if (targetNorm === spokenNorm) return 100;

    // Direct English Phonetic Normalization (e.g. Arijit vs Arijeet, Bumrah vs Boomra)
    const targetPhoneticNorm = phoneticNormalize(target);
    const spokenPhoneticNorm = phoneticNormalize(spoken);
    if (targetPhoneticNorm === spokenPhoneticNorm) return 100;

    const targetPhonetic = transliterateIndicToEnglish(target);
    const spokenPhonetic = transliterateIndicToEnglish(spoken);

    if (targetPhonetic === spokenPhonetic) {
      return 100;
    }

    const distancePhonetic = levenshteinDistance(targetPhonetic, spokenPhonetic);
    const maxLenPhonetic = Math.max(targetPhonetic.length, spokenPhonetic.length);
    const accuracyPhonetic = maxLenPhonetic > 0 ? Math.round(((maxLenPhonetic - distancePhonetic) / maxLenPhonetic) * 100) : 0;

    const distance = levenshteinDistance(targetNorm, spokenNorm);
    const maxLength = Math.max(targetNorm.length, spokenNorm.length);
    const accuracy = maxLength > 0 ? Math.round(((maxLength - distance) / maxLength) * 100) : 0;

    // Levenshtein on phonetic normalized strings
    const distPhoneticNorm = levenshteinDistance(targetPhoneticNorm, spokenPhoneticNorm);
    const maxLenPhoneticNorm = Math.max(targetPhoneticNorm.length, spokenPhoneticNorm.length);
    const accuracyPhoneticNorm = maxLenPhoneticNorm > 0 ? Math.round(((maxLenPhoneticNorm - distPhoneticNorm) / maxLenPhoneticNorm) * 100) : 0;

    return Math.max(0, accuracy, accuracyPhonetic, accuracyPhoneticNorm);
  }

  const COMMON_SPEECH_ALIASES = {
    "shreya ghoshal": [
      "treya gashel",
      "treya garcia",
      "treya gosal",
      "shreya gosal",
      "shreya ghosal",
      "treya ghoshal",
      "shraya gosal",
      "sreya gosal",
      "trya gosal",
      "trey garcia"
    ],
    "joe root": ["joe roo", "joe route", "jo root", "jo roo", "joe rude"],
    "jasprit bumrah": ["jaspreet bumrah", "jasprit bumra", "just preet boomra", "justpreet bumrah", "just read boomra", "just paid block", "jaspreet bumra"],
    "virat kohli": ["virat koli", "we're at kohli", "we are at kohli", "we're at koli", "virat colley", "virat cole", "virat koly"],
    "arijit singh": ["arijeet singh", "our is it singh", "harjeet singh", "arijit sing", "arijeet sing", "our is it sing"],
    "sundar pichai": ["sundar pichai", "sunder pichai", "sundar piche", "sunder piche", "sunder picai", "sundar picai"],
    "nikola tesla": ["nicola tesla", "nicola tes", "nikola tes", "nikola tessla"],
    "mahatma gandhi": ["mahatma gandi", "mahatama gandhi", "mahatma gandy"],
    "dhoni": ["doni", "ms dhoni", "ms doni"],
    "sachin tendulkar": ["sachin tendulker", "sachin tendulkar", "sachin tendulcar"]
  };

  function evaluateMatch(targetPhrase, spokenPhrase) {
    if (!targetPhrase || !spokenPhrase) {
      return { isCorrect: false, accuracy: 0 };
    }

    const savedThreshold = localStorage.getItem("pronounce_right_accuracy_threshold");
    const accuracyThreshold = savedThreshold ? parseInt(savedThreshold, 10) : 70;

    const targetPhraseNorm = targetPhrase.toLowerCase().trim().replace(/\s+/g, " ");
    const spokenPhraseNorm = spokenPhrase.toLowerCase().trim().replace(/\s+/g, " ");

    // Check direct phrase-level aliases
    if (COMMON_SPEECH_ALIASES[targetPhraseNorm]) {
      const aliases = COMMON_SPEECH_ALIASES[targetPhraseNorm];
      if (aliases.includes(spokenPhraseNorm)) {
        return { isCorrect: true, accuracy: 100 };
      }
    }

    const targetWords = targetPhrase.trim().split(/\s+/);
    const spokenWords = spokenPhrase.trim().split(/\s+/);

    if (targetWords.length === 1) {
      const acc = calculateAccuracy(targetPhrase, spokenPhrase);
      return {
        isCorrect: acc >= accuracyThreshold,
        accuracy: acc
      };
    }

    let totalAccuracy = 0;
    let allWordsPassed = true;

    for (const tw of targetWords) {
      let maxWordAcc = 0;
      for (const sw of spokenWords) {
        const acc = calculateAccuracy(tw, sw);
        if (acc > maxWordAcc) {
          maxWordAcc = acc;
        }
      }
      totalAccuracy += maxWordAcc;
      if (maxWordAcc < accuracyThreshold) {
        allWordsPassed = false;
      }
    }

    const avgAccuracy = Math.round(totalAccuracy / targetWords.length);

    return {
      isCorrect: allWordsPassed && avgAccuracy >= accuracyThreshold,
      accuracy: avgAccuracy
    };
  }

  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\p{M}\s]/gu, "")
      .replace(/\s+/g, " ");
  }

  function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
        }
      }
    }

    return dp[m][n];
  }

  // ===== RESTART =====
  function restartChallenge() {
    if (resultsScreen) resultsScreen.classList.add("hidden");
    timerValue?.parentElement?.classList.remove("warning");
    startChallenge();
  }

  // ===== GO HOME =====
  function goToHome() {
    if (resultsScreen) resultsScreen.classList.add("hidden");
    if (pregameScreen) pregameScreen.classList.remove("hidden");
    loadHighScore();
    renderChallengeHistory();
  }

  // ===== EXPOSE GLOBAL FUNCTIONS =====
  window.startChallenge = startChallenge;
  window.restartChallenge = restartChallenge;
  window.goToHome = goToHome;

  // ===== INITIALIZE =====
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
