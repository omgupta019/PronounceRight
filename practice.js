// ===== PRACTICE PAGE - ISOLATED SCOPE =====
(() => {
  // ===== STATE VARIABLES =====
  let currentDifficulty = "easy";
  let difficultyMode = "adaptive"; // adaptive or manual
  let currentMode = "word";

  // Normalization maps for category keys
  const CATEGORY_MAP = {
    "cricket-players": "cricket",
    "cricket": "cricket",
    "tennis-players": "tennis",
    "tennis": "tennis",
    "hollywood-stars": "hollywood",
    "hollywood": "hollywood",
    "celebrity": "hollywood",
    "celebrities": "hollywood",
    "film-directors": "directors",
    "directors": "directors",
    "world-leaders": "leaders",
    "leaders": "leaders",
    "tech-leaders": "tech",
    "tech": "tech",
    "business": "tech",
    "football": "football",
    "musicians": "musicians",
    "scientists": "scientists",
    "common": "common"
  };

  const CATEGORY_DISPLAY_NAMES = {
    "cricket": "Cricket Players",
    "tennis": "Tennis Players",
    "hollywood": "Hollywood Stars",
    "directors": "Film Directors",
    "leaders": "World Leaders",
    "tech": "Tech Leaders",
    "football": "Football Players",
    "musicians": "Musicians",
    "scientists": "Scientists",
    "common": "Common Words"
  };

  let currentCategory = "common";

  let isRecording = false;
  let recordingStartTime = null;
  let sessionStartTime = Date.now();
  let sessionResults = [];
  try {
    const saved = localStorage.getItem("pronounce_right_practice_results");
    if (saved) {
      sessionResults = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load session results:", e);
  }

  document.addEventListener("change", (e) => {
    if (e.target.id === "categorySelect") {
      currentCategory = CATEGORY_MAP[e.target.value.toLowerCase()] || e.target.value;
      loadContent();
    }
  });

  // ===== LOAD CONTENT FUNCTION =====
  async function loadContent() {
    const displayText = document.getElementById("displayText");
    const phoneticText = document.getElementById("phoneticText");
    const scoringDashboard = document.getElementById("scoringDashboard");

    if (!displayText) return;

    displayText.textContent = "Loading...";
    if (scoringDashboard) {
      scoringDashboard.classList.add("hidden"); // ✅ NOW SAFE
    }
    if (phoneticText) phoneticText.style.display = "none";

    const modeLabel = document.getElementById("modeLabel");
    if (modeLabel) {
      modeLabel.textContent = `${currentMode.toUpperCase()} MODE`;
    }

    const difficultyIndicator = document.getElementById("difficultyIndicator");
    if (difficultyIndicator) {
      const modeStr = difficultyMode === "adaptive" ? " (ADAPTIVE)" : "";
      difficultyIndicator.textContent = `Difficulty: ${currentDifficulty.toUpperCase()}${modeStr}`;
    }

    const contentCounter = document.getElementById("contentCounter");
    if (contentCounter) {
      contentCounter.textContent = difficultyMode === "adaptive" ? "Adaptive Mode" : "Manual Mode";
    }

    const tabs = document.querySelectorAll(".difficulty-tab");
    tabs.forEach(btn => {
      btn.classList.remove("active");
      const targetValue = difficultyMode === "adaptive" ? "adaptive" : currentDifficulty;
      if (btn.dataset.difficulty === targetValue) {
        btn.classList.add("active");
      }
    });

    const selectedLang = window.getSelectedLanguage
      ? window.getSelectedLanguage()
      : "english";

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

    const BASE_URL = "http://127.0.0.1:8000";

    try {
      const response = await fetch(
        `${BASE_URL}/content?category=${currentCategory}&mode=${currentMode}&difficulty=${currentDifficulty}&language=${backendLang}`,
      );
      if (!response.ok) {
        throw new Error("Server error");
      }
      const data = await response.json();
      if (!data || !data.text) {
        if (difficultyMode === "adaptive") {
          if (currentDifficulty === "hard") currentDifficulty = "medium";
          else if (currentDifficulty === "medium") currentDifficulty = "easy";

          displayText.textContent = "Adjusting difficulty...";

          if (currentDifficulty === "easy") {
            displayText.textContent = "No content available in database.";
            return;
          }

          setTimeout(loadContent, 500);
          return;
        } else {
          displayText.textContent =
            "No content available for selected difficulty.";
          return;
        }
      }

      displayText.textContent = data.text;
      
      // Auto-play pronunciation if enabled in settings
      if (localStorage.getItem("pronounce_right_autoplay") === "true") {
        setTimeout(speakText, 500);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      displayText.textContent = "Server error.";
    }
  }
  // ===== RECORDING FUNCTIONS =====

  let mediaRecorder;
  let audioChunks = [];
  let currentStream;

  async function startRecording() {
    const recordBtn = document.getElementById("recordBtn");
    const feedback = document.getElementById("feedbackText");
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      currentStream = stream;

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      recordingStartTime = Date.now();
      isRecording = true;

      recordBtn.textContent = "⏹ Stop";
      recordBtn.classList.add("recording");

      if (feedback) {
        feedback.textContent = "Recording...";
        feedback.className = "feedback-text";
      }
    } catch (error) {
      alert("Microphone permission denied.");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }

    const recordBtn = document.getElementById("recordBtn");

    recordBtn.innerHTML = "<span>🎤 Start Recording</span>";

    recordBtn.classList.remove("recording");

    isRecording = false;
  }
  async function sendAudioToBackend(audioBlob) {
    const displayText = document.getElementById("displayText");
    const feedback = document.getElementById("feedbackText");

    if (!displayText) return;

    const expectedText = displayText.textContent;

    if (!expectedText || expectedText.trim() === "") {
      feedback.textContent = "No text to analyze.";
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob);

    try {
      const selectedLang = window.getSelectedLanguage
        ? window.getSelectedLanguage()
        : "english";

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

      feedback.textContent = "Analyzing pronunciation...";
      feedback.className = "feedback-text";

      const BASE_URL = "http://127.0.0.1:8000";

      const startTime = performance.now();
      const response = await fetch(
        `${BASE_URL}/analyze?expected_text=${encodeURIComponent(expectedText)}&language=${backendLang}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      const endTime = performance.now();
      const latencySec = ((endTime - startTime) / 1000).toFixed(2);

      displayBackendResult(result, latencySec, expectedText);

      feedback.textContent = "Analysis complete!";
      feedback.className = "feedback-text success";
    } catch (error) {
      console.error("Backend error:", error);
      feedback.textContent = "Server error. Make sure backend is running.";
      feedback.className = "feedback-text error";
    }
  }

  function phoneticNormalize(text) {
    if (!text) return "";
    let norm = text.toLowerCase().trim();
    norm = norm.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    norm = norm.replace(/[aeiouy]/g, "");
    norm = norm.replace(/tr/g, "sr");
    norm = norm.replace(/ch/g, "s");
    norm = norm.replace(/sh/g, "s");
    norm = norm.replace(/w/g, "v");
    norm = norm.replace(/h/g, "");
    let deduplicated = "";
    for (let i = 0; i < norm.length; i++) {
      if (norm[i] !== norm[i - 1]) {
        deduplicated += norm[i];
      }
    }
    return deduplicated;
  }

  function isPhoneticMatch(word1, word2) {
    if (!word1 || !word2) return false;
    const norm1 = phoneticNormalize(word1);
    const norm2 = phoneticNormalize(word2);
    if (norm1 === norm2) return true;
    if (norm1.includes(norm2) && norm1.length - norm2.length <= 2) return true;
    if (norm2.includes(norm1) && norm2.length - norm1.length <= 2) return true;
    return false;
  }

  function computeWordDiff(expectedText, transcriptText) {
    const expectedWords = expectedText.split(/\s+/);
    const transcriptWords = (transcriptText || "").split(/\s+/).map(w => 
      w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").toLowerCase()
    ).filter(w => w !== "");

    let transcriptIndex = 0;
    return expectedWords.map(word => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").toLowerCase();
      if (!cleanWord) {
        return { original: word, match: true, isPunctuation: true };
      }

      let foundIndex = -1;
      for (let i = transcriptIndex; i < Math.min(transcriptIndex + 4, transcriptWords.length); i++) {
        if (isPhoneticMatch(cleanWord, transcriptWords[i])) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        transcriptIndex = foundIndex + 1;
        return { original: word, match: true };
      } else {
        return { original: word, match: false };
      }
    });
  }

  function displayBackendResult(result, latencySec = "0.0", originalExpectedText = "") {
    const scoringDashboard = document.getElementById("scoringDashboard");
    const accuracyValue = document.getElementById("accuracyValue");
    const accuracyProgress = document.getElementById("accuracyProgress");
    const wpmValue = document.getElementById("wpmValue");

    const latencyBadge = document.getElementById("practiceLatencyBadge");
    const latencyText = document.getElementById("practiceLatencyText");
    const wordDiffContainer = document.getElementById("practiceWordDiffContainer");
    const wordDiffText = document.getElementById("practiceWordDiffText");
    const transcriptHeard = document.getElementById("practiceTranscriptHeard");
    const askCoachBtn = document.getElementById("practiceAskCoachBtn");

    scoringDashboard.classList.remove("hidden");

    const accuracy = result.accuracy;

    accuracyValue.textContent = Math.round(accuracy) + "%";

    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (accuracy / 100) * circumference;
    accuracyProgress.style.strokeDasharray = circumference;
    accuracyProgress.style.strokeDashoffset = offset;

    wpmValue.textContent = result.wpm;

    // 1. Display Latency Badge
    if (latencyBadge && latencyText) {
      latencyText.textContent = `Latency: ${latencySec}s | Model: Local (Whisper)`;
      latencyBadge.classList.remove("hidden");
    }

    // 2. Display Word Diff
    if (wordDiffContainer && wordDiffText && transcriptHeard) {
      const targetPhrase = result.expected_text || originalExpectedText;
      const diffResults = computeWordDiff(targetPhrase, result.transcript);
      
      wordDiffText.innerHTML = diffResults.map(item => {
        if (item.isPunctuation) return item.original;
        const cls = item.match ? "correct" : "incorrect";
        return `<span class="diff-word ${cls}">${item.original}</span>`;
      }).join(" ");
      
      transcriptHeard.innerHTML = `<strong>AI Heard:</strong> "${result.transcript || 'No speech detected'}"`;
      wordDiffContainer.classList.remove("hidden");
    }

    // 3. Display Ask Coach Button if accuracy is less than 85%
    if (askCoachBtn) {
      if (accuracy < 85) {
        askCoachBtn.classList.remove("hidden");
        const newAskCoachBtn = askCoachBtn.cloneNode(true);
        askCoachBtn.parentNode.replaceChild(newAskCoachBtn, askCoachBtn);
        
        newAskCoachBtn.addEventListener("click", () => {
          if (window.askVocalCoachAbout) {
            window.askVocalCoachAbout(result.expected_text || originalExpectedText, accuracy);
          } else {
            alert("VocalCoach AI is not initialized on this page.");
          }
        });
      } else {
        askCoachBtn.classList.add("hidden");
      }
    }

    console.log("Transcript:", result.transcript);
    console.log("Expected:", result.expected_text || originalExpectedText);

    let difficultyChanged = false;

    // ===== ADAPTIVE DIFFICULTY ENGINE =====

    if (difficultyMode === "adaptive") {

      if (result.accuracy >= 85 && currentDifficulty === "easy") {
        currentDifficulty = "medium";
        difficultyChanged = true;
      } else if (result.accuracy >= 85 && currentDifficulty === "medium") {
        currentDifficulty = "hard";
        difficultyChanged = true;
      } else if (result.accuracy < 60 && currentDifficulty === "hard") {
        currentDifficulty = "medium";
        difficultyChanged = true;
      } else if (result.accuracy < 60 && currentDifficulty === "medium") {
        currentDifficulty = "easy";
        difficultyChanged = true;
      }
    }

    sessionResults.push({
      expected: result.expected_text,
      transcript: result.transcript,
      accuracy: result.accuracy,
      wpm: result.wpm,
      time: ((Date.now() - recordingStartTime) / 1000).toFixed(1),
    });

    try {
      localStorage.setItem("pronounce_right_practice_results", JSON.stringify(sessionResults));
    } catch (e) {
      console.error("Failed to save session results:", e);
    }

    updateSessionStats();

    // ===== AUTO ADVANCE ON SUCCESS (>= 65% ACCURACY) =====
    if (result.accuracy >= 65) {
      setTimeout(() => {
        const scoringDashboard = document.getElementById("scoringDashboard");
        if (scoringDashboard && !scoringDashboard.classList.contains("hidden")) {
          scoringDashboard.classList.add("hidden");
          loadContent();
        }
      }, 2000);
    }
  }

  function updateSessionStats() {
    const completedCountEl = document.getElementById("completedCount");
    const avgAccuracyEl = document.getElementById("avgAccuracy");
    const avgWpmEl = document.getElementById("avgWpm");
    const chartBars = document.getElementById("chartBars");

    if (completedCountEl) {
      completedCountEl.textContent = sessionResults.length;
    }

    if (sessionResults.length > 0) {
      const avgAcc = sessionResults.reduce((sum, r) => sum + r.accuracy, 0) / sessionResults.length;
      if (avgAccuracyEl) {
        avgAccuracyEl.textContent = `${Math.round(avgAcc)}%`;
      }

      const avgWpmVal = sessionResults.reduce((sum, r) => sum + r.wpm, 0) / sessionResults.length;
      if (avgWpmEl) {
        avgWpmEl.textContent = Math.round(avgWpmVal);
      }

      if (chartBars) {
        chartBars.innerHTML = sessionResults
          .slice(-5)
          .map((r, idx) => {
            const displayIdx = sessionResults.length - (sessionResults.slice(-5).length) + idx + 1;
            const barHeight = Math.max(4, Math.round(r.accuracy)); // scale to max 100px height
            const barBg = r.accuracy >= 80 ? 'var(--success)' : r.accuracy >= 50 ? '#fbbf24' : 'var(--error)';
            return `
              <div class="chart-bar-wrapper" title="${r.accuracy}% accuracy">
                <div class="chart-bar" style="height: ${barHeight}px; background: ${barBg};"></div>
                <span class="chart-label">#${displayIdx}</span>
              </div>
            `;
          })
          .join("");
      }
    } else {
      if (avgAccuracyEl) avgAccuracyEl.textContent = "0%";
      if (avgWpmEl) avgWpmEl.textContent = "0";
      if (chartBars) {
        chartBars.innerHTML = `
          <div class="chart-placeholder">
            Complete exercises to see progress
          </div>
        `;
      }
    }
  }

  // ===== TEXT-TO-SPEECH =====
  function speakText() {
    const displayText = document.getElementById("displayText");
    if (!displayText) return;

    const selectedLang = window.getSelectedLanguage
      ? window.getSelectedLanguage()
      : "english";

    if (window.speakTextWithGoogleTTS) {
      window.speakTextWithGoogleTTS(displayText.textContent, selectedLang);
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
        spanish: "es-ES",
        french: "fr-FR",
      };
      const utterance = new SpeechSynthesisUtterance(displayText.textContent);
      utterance.lang = ttsMap[selectedLang] || "en-US";
      const savedRate = localStorage.getItem("pronounce_right_speak_rate");
      utterance.rate = savedRate ? parseFloat(savedRate) : 0.9;
      utterance.pitch = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  // ===== SESSION SUMMARY =====
  function viewSessionSummary() {
    if (sessionResults.length === 0) {
      alert(
        "No practice sessions recorded yet. Try recording some pronunciations first!",
      );
      return;
    }

    const avgAccuracy =
      sessionResults.reduce((sum, r) => sum + r.accuracy, 0) /
      sessionResults.length;
    const totalTime = sessionResults.reduce(
      (sum, r) => sum + Number.parseFloat(r.time),
      0,
    );

    const summary = `
Session Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Attempts: ${sessionResults.length}
Average Accuracy: ${Math.round(avgAccuracy)}%
Total Time: ${totalTime.toFixed(1)}s
Session Duration: ${Math.round((Date.now() - sessionStartTime) / 1000 / 60)} minutes

Recent Results:
${sessionResults
  .slice(-5)
  .reverse()
  .map(
    (r, i) => `${i + 1}. "${r.expected}" - ${Math.round(r.accuracy)}% accuracy`,
  )
  .join("\n")}
    `;

    alert(summary);
  }

  // ===== MODE SWITCHER =====
  function switchMode(mode) {
    const modeButtons = document.querySelectorAll(".mode-tab");
    modeButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      }
    });

    currentMode = mode;
    console.log("[v0] Mode switched to:", mode);
    loadContent();
  }

  // ===== CATEGORY SWITCHER =====
  function switchCategory(category) {
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.category === category) {
        btn.classList.add("active");
      }
    });

    currentCategory = category;
    loadContent();
  }

  // ===== FUNCTION TO UPDATE CATEGORY DROPDOWN =====
  async function updateCategoryDropdown(shouldLoad = false) {
    const categorySelect = document.getElementById("categorySelect");
    if (!categorySelect) return;

    const selectedLang = window.getSelectedLanguage
      ? window.getSelectedLanguage()
      : "english";

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
    const BASE_URL = "http://127.0.0.1:8000";

    try {
      const response = await fetch(
        `${BASE_URL}/categories?language=${backendLang}`,
      );

      const data = await response.json();

      categorySelect.innerHTML = "";

      if (!data.categories || data.categories.length === 0) {
        const option = document.createElement("option");
        option.textContent = "No categories available";
        option.value = "";
        categorySelect.appendChild(option);
        return;
      }

      data.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent =
          category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
      });

      currentCategory = data.categories[0];
      categorySelect.value = currentCategory;

      if (shouldLoad) {
        loadContent();
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }
  // ===== EVENT LISTENERS =====
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("[v0] Practice page DOMContentLoaded");
   const difficultyButtons = document.querySelectorAll(".difficulty-tab");

difficultyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedValue = btn.dataset.difficulty;

    if (selectedValue === "adaptive") {
      difficultyMode = "adaptive";
      currentDifficulty = "easy";
    } else {
      difficultyMode = "manual";
      currentDifficulty = selectedValue;
    }

    loadContent();
  });
});

    // Load the saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage") || "hindi";
    console.log(
      "[v0] Practice page: Loaded language from localStorage:",
      savedLanguage,
    );

    if (window.setSelectedLanguage) {
      window.setSelectedLanguage(savedLanguage);
      console.log(
        "[v0] Practice page: Set selected language to:",
        savedLanguage,
      );
    }

    // Update categories for the selected language (do not load content automatically yet)
    await updateCategoryDropdown(false);

    // Initialize SPA category grid selectors
    initCategoryGrid();

    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    console.log("[v0] URL category parameter:", categoryParam);

    if (categoryParam) {
      showPracticeConsole(categoryParam);
      console.log("[v0] Bypassed categories grid, loading URL category:", categoryParam);
    } else {
      showCategorySelection();
      console.log("[v0] Loading initial categories selection grid");
    }

    const retryBtn = document.querySelector(".result-btn.secondary");
    const nextBtnResult = document.querySelector(".result-btn.primary");

    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        document.getElementById("scoringDashboard").classList.add("hidden");
        // Try Again: keep the same word (do not call loadContent)
      });
    }

    if (nextBtnResult) {
      nextBtnResult.addEventListener("click", () => {
        document.getElementById("scoringDashboard").classList.add("hidden");
        loadContent(); // Next: load a new word
      });
    }

    // Mode buttons
    const modeButtons = document.querySelectorAll(".mode-tab");
    console.log("[v0] Found mode buttons:", modeButtons.length);
    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => switchMode(btn.dataset.mode));
    });

    // Category buttons
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => switchCategory(btn.dataset.category));
    });

    // Navigation buttons
    const prevBtn = document.getElementById("prevContentBtn");
    const skipBtn = document.getElementById("skipBtn");
    if (skipBtn) skipBtn.addEventListener("click", loadContent);

    if (prevBtn) prevBtn.style.display = "none"; // optional

    // Record button
    const recordBtn = document.getElementById("recordBtn");
    if (recordBtn) {
      recordBtn.addEventListener("click", () => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      });
    }

    // Listen button
    const listenBtn = document.getElementById("listenBtn");
    if (listenBtn) {
      listenBtn.addEventListener("click", speakText);
    }

    // Session summary button
    const summaryBtn = document.getElementById("sessionSummaryBtn");
    if (summaryBtn) {
      summaryBtn.addEventListener("click", viewSessionSummary);
    }

    // Start session timer tick
    setInterval(() => {
      const elapsedMs = Date.now() - sessionStartTime;
      const minutes = Math.floor(elapsedMs / 1000 / 60);
      const seconds = Math.floor((elapsedMs / 1000) % 60);
      const timerEl = document.getElementById("sessionTime");
      if (timerEl) {
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);

    // Update initial session stats on load
    updateSessionStats();

    // Reset stats button
    const resetStatsBtn = document.getElementById("resetStatsBtn");
    if (resetStatsBtn) {
      resetStatsBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset your practice session stats?")) {
          sessionResults = [];
          localStorage.removeItem("pronounce_right_practice_results");
          sessionStartTime = Date.now();
          const timerEl = document.getElementById("sessionTime");
          if (timerEl) {
            timerEl.textContent = "0:00";
          }
          updateSessionStats();
        }
      });
    }

    // Mobile menu
    initMobileMenu();
  });

  // ===== MOBILE MENU =====
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  }

  // ===== VIEW CONTROLLERS (SPA VIEW TRANSITIONS) =====
  function showPracticeConsole(category) {
    const selectionView = document.getElementById("categorySelectionView");
    const consoleView = document.getElementById("practiceConsoleView");

    if (selectionView) selectionView.classList.add("hidden");
    if (consoleView) consoleView.classList.remove("hidden");

    // Normalize category keys to align with database categories
    const dbCategory = CATEGORY_MAP[category.toLowerCase()] || category;
    currentCategory = dbCategory;

    const categorySelect = document.getElementById("categorySelect");
    if (categorySelect) {
      categorySelect.value = dbCategory;
    }

    const currentCategoryLabel = document.getElementById("currentCategoryLabel");
    if (currentCategoryLabel) {
      currentCategoryLabel.textContent = CATEGORY_DISPLAY_NAMES[dbCategory] || (dbCategory.charAt(0).toUpperCase() + dbCategory.slice(1).replace("-", " "));
    }

    loadContent();
  }

  function showCategorySelection() {
    const selectionView = document.getElementById("categorySelectionView");
    const consoleView = document.getElementById("practiceConsoleView");

    if (selectionView) selectionView.classList.remove("hidden");
    if (consoleView) consoleView.classList.add("hidden");

    // Clear URL parameters
    const url = new URL(window.location);
    url.searchParams.delete("category");
    window.history.replaceState({}, "", url);
  }

  function initCategoryGrid() {
    // Card clicks
    document.querySelectorAll(".category-card-screenshot").forEach((card) => {
      card.addEventListener("click", () => {
        const cat = card.dataset.category;
        if (cat) {
          showPracticeConsole(cat);
        }
      });
    });

    // Back / Switch Category button inside practice view
    const switchCategoryBtn = document.getElementById("switchCategoryBtn");
    if (switchCategoryBtn) {
      switchCategoryBtn.addEventListener("click", showCategorySelection);
    }

    // Category filter dropdown
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        const val = e.target.value;
        document.querySelectorAll(".category-card-screenshot").forEach((card) => {
          if (val === "all" || card.dataset.filter === val) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  }

  // ===== EXPOSE LANGUAGE UPDATE FUNCTION =====
  window.onLanguageChangedPractice = function () {
    console.log("[Practice] Language changed!");
    updateCategoryDropdown(true); // Load content on language change
  };
})();
