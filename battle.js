// ===== MULTIPLAYER SPEECH BATTLE ENGINE =====

(() => {
  // ===== STATE VARIABLES =====
  let socket = null;
  let localPlayerName = "";
  let opponentPlayerName = "";
  let currentRoomCode = "";
  let targetParagraphText = "";
  let targetWords = [];
  let currentWordIndex = 0;
  
  // Game Live Stats
  let localWpm = 0;
  let localAccuracy = 0;
  let localStreak = 0;
  let localMaxStreak = 0;
  let localCorrectCount = 0;
  let gameStartTime = null;
  let activeLobbyStatus = "waiting";
  let lobbyDuration = 60;
  let matchTimerInterval = null;

  // Speech Recognition
  let recognition = null;
  let isRecording = false;
  let currentSegmentIndex = -1;
  let matchedWordsCountInSegment = 0;

  // Pre-warm the backend server on page load (wakes up Render container from cold boot)
  function preWarmBackend() {
    const base_url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:8000"
      : "https://pronounceright-1.onrender.com";
      
    fetch(`${base_url}/`)
      .then(res => console.log("[Backend] Pre-warmed successfully"))
      .catch(err => console.warn("[Backend] Pre-warm failed", err));
  }

  async function wakeUpBackend() {
    const base_url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:8000"
      : "https://pronounceright-1.onrender.com";
    
    try {
      // Send a quick fetch to the root endpoint
      await fetch(`${base_url}/`, { mode: 'cors' });
      return true;
    } catch (e) {
      console.warn("Backend wake up fetch failed:", e);
      return false;
    }
  }
  // ===== DATABASE HISTORY LOADER =====
  async function loadBattleHistory(nickname) {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    try {
      historyList.innerHTML = `
        <div class="skeleton-card">
        <div class="skeleton skeleton-text" style="width: 70%; height: 1.25rem;"></div>
        <div class="skeleton skeleton-text short" style="height: 1rem; margin-bottom: 0;"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-text" style="width: 50%; height: 1.25rem;"></div>
        <div class="skeleton skeleton-text short" style="height: 1rem; margin-bottom: 0;"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton-text" style="width: 85%; height: 1.25rem;"></div>
        <div class="skeleton skeleton-text short" style="height: 1rem; margin-bottom: 0;"></div>
      </div>
    `;

      const base_url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "https://pronounceright-1.onrender.com";
      const response = await fetch(`${base_url}/battle_history?player_name=${encodeURIComponent(nickname)}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      
      historyList.innerHTML = "";

      if (!data.history || data.history.length === 0) {
        historyList.innerHTML = `<div class="history-placeholder">No battles played yet. Be the first to start a lobby!</div>`;
        return;
      }

      data.history.forEach((match) => {
        const dateStr = new Date(match.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        const card = document.createElement("div");
        card.className = "history-card";
        
        const resultClass = match.result.toLowerCase();
        
        card.innerHTML = `
          <div class="history-card-header">
            <span class="history-opponent">vs ${escapeHtml(match.opponent_name)}</span>
            <span class="history-badge-result ${resultClass}">${match.result}</span>
          </div>
          <div class="history-stats-row">
            <span>Your WPM: <strong>${match.player_wpm}</strong></span>
            <span>Opponent: <strong>${match.opponent_wpm}</strong></span>
          </div>
          <div class="history-stats-row">
            <span>Accuracy: <strong>${Math.round(match.player_accuracy)}%</strong></span>
            <span class="history-date">${dateStr}</span>
          </div>
        `;
        historyList.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to load history:", error);
      historyList.innerHTML = `<div class="history-placeholder" style="color: var(--color-loss);">Failed to load history from database. Make sure backend is running.</div>`;
    }
  }



  // ===== WEBSOCKETS CONTROLLER =====
  function connectLobby(lobbyId, nickname, duration = null) {
    const loc = window.location;
    const wsProtocol = loc.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "127.0.0.1:8000"
      : "pronounceright-1.onrender.com";
    let wsUrl = `${wsProtocol}//${wsHost}/ws/battle/${lobbyId}/${encodeURIComponent(nickname)}`;
    if (duration !== null) {
      wsUrl += `?duration=${duration}`;
    }
    
    currentRoomCode = lobbyId;
    localPlayerName = nickname;
    
    // Reset local stats
    currentWordIndex = 0;
    localWpm = 0;
    localAccuracy = 0;
    localStreak = 0;
    localMaxStreak = 0;
    localCorrectCount = 0;
    currentSegmentIndex = -1;
    matchedWordsCountInSegment = 0;
    activeLobbyStatus = "waiting";
    lobbyDuration = 60;
    if (matchTimerInterval) {
      clearInterval(matchTimerInterval);
      matchTimerInterval = null;
    }

    // Hide timer initially
    const timerContainer = document.getElementById("battleTimerContainer");
    if (timerContainer) timerContainer.classList.add("hidden");

    // Open connection
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[WS] Connected to Battle Room:", lobbyId);
      
      // Update Setup view to Arena
      document.getElementById("setupScreen").classList.add("hidden");
      document.getElementById("battleScreen").classList.remove("hidden");
      
      document.getElementById("lobbyCodeLabel").textContent = lobbyId;
      document.getElementById("localPlayerNameLabel").textContent = nickname;
      
      // Set initial hud
      document.getElementById("localWpmLabel").textContent = "0";
      document.getElementById("localAccuracyLabel").textContent = "0%";
      document.getElementById("localStreakLabel").textContent = "0";
      document.getElementById("localProgressFill").style.width = "0%";
      
      document.getElementById("opponentPlayerNameLabel").textContent = "Waiting for Opponent...";
      document.getElementById("opponentWpmLabel").textContent = "0";
      document.getElementById("opponentAccuracyLabel").textContent = "0%";
      document.getElementById("opponentStreakLabel").textContent = "0";
      document.getElementById("opponentProgressFill").style.width = "0%";

      document.getElementById("readyBtnLocal").classList.remove("ready-active");
      document.getElementById("readyBtnLocal").textContent = "Toggle Ready";
      document.getElementById("localReadyLabel").classList.add("hidden");
      document.getElementById("opponentReadyLabel").classList.add("hidden");

      document.getElementById("recordBtnMulti").disabled = true;
      document.getElementById("recordBtnMulti").classList.remove("recording");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("[WS] Received:", data);

      if (data.type === "error") {
        alert(data.message);
        socket.close();
        return;
      }

      // Read players dictionary
      const players = data.players || {};
      activeLobbyStatus = data.status || "waiting";
      
      // Find opponent key
      const opponentName = Object.keys(players).find(name => name !== localPlayerName);
      if (opponentName) {
        opponentPlayerName = opponentName;
        document.getElementById("opponentPlayerNameLabel").textContent = opponentName;
        
        const oppData = players[opponentName];
        if (oppData.ready) {
          document.getElementById("opponentReadyLabel").classList.remove("hidden");
        } else {
          document.getElementById("opponentReadyLabel").classList.add("hidden");
        }
      } else {
        opponentPlayerName = "";
        document.getElementById("opponentPlayerNameLabel").textContent = "Waiting for Opponent...";
        document.getElementById("opponentReadyLabel").classList.add("hidden");
      }

      // Check local ready state
      const localData = players[localPlayerName];
      if (localData && localData.ready) {
        document.getElementById("localReadyLabel").classList.remove("hidden");
      } else {
        document.getElementById("localReadyLabel").classList.add("hidden");
      }

      // Handle Event Types
      if (data.type === "join") {
        targetParagraphText = data.targetText;
        lobbyDuration = data.duration !== undefined ? data.duration : 60;
        setupParagraphDisplay(targetParagraphText);
        updateLobbyStatusLabel();
      }
      
      else if (data.type === "leave") {
        alert(`Player ${data.playerName} has left the room.`);
        opponentPlayerName = "";
        document.getElementById("opponentPlayerNameLabel").textContent = "Waiting for Opponent...";
        document.getElementById("opponentReadyLabel").classList.add("hidden");
        document.getElementById("opponentProgressFill").style.width = "0%";
        updateLobbyStatusLabel();
        
        // Return to waiting state
        if (isRecording) stopSpeechRecording();
        document.getElementById("recordBtnMulti").disabled = true;
        document.getElementById("readyBtnLocal").disabled = false;
      }

      else if (data.type === "status_update") {
        updateLobbyStatusLabel();
      }

      else if (data.type === "countdown_start") {
        triggerCountdown();
      }

      else if (data.type === "game_start") {
        startGameArena();
      }

      else if (data.type === "progress_update") {
        // Sync Opponent Progress live!
        if (opponentName) {
          const oppData = players[opponentName];
          document.getElementById("opponentWpmLabel").textContent = oppData.wpm;
          document.getElementById("opponentAccuracyLabel").textContent = `${Math.round(oppData.accuracy)}%`;
          document.getElementById("opponentStreakLabel").textContent = oppData.streak;
          
          const oppPercent = targetWords.length > 0 ? (oppData.progress / targetWords.length) * 100 : 0;
          document.getElementById("opponentProgressFill").style.width = `${oppPercent}%`;

          // Move the ghost cursor
          updateOpponentGhostCursor(oppData.progress);
        }
      }

      else if (data.type === "game_over") {
        if (matchTimerInterval) {
          clearInterval(matchTimerInterval);
          matchTimerInterval = null;
        }
        // Stop recording
        if (isRecording) stopSpeechRecording();
        document.getElementById("recordBtnMulti").disabled = true;
        
        // Show scoreboard comparisons
        showScoreboardStats(players, data.winner);
      }
    };

    socket.onclose = () => {
      console.log("[WS] Connection closed.");
      socket = null;
      if (matchTimerInterval) {
        clearInterval(matchTimerInterval);
        matchTimerInterval = null;
      }
      const timerContainer = document.getElementById("battleTimerContainer");
      if (timerContainer) timerContainer.classList.add("hidden");
      
      // Re-enable matchmaking forms
      document.getElementById("setupScreen").classList.remove("hidden");
      document.getElementById("battleScreen").classList.add("hidden");
      
      // Reload history table
      const nickname = document.getElementById("usernameInput").value.trim();
      if (nickname) {
        loadBattleHistory(nickname);
      }
    };

    socket.onerror = (error) => {
      console.error("[WS] Connection error:", error);
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        alert("Lobby connection failed. Please ensure your local FastAPI backend is running on port 8000.");
      } else {
        alert("Lobby connection failed. The AI backend server is currently starting up or offline. Please wait 20-30 seconds and try again!");
      }
    };
  }

  function updateLobbyStatusLabel() {
    const label = document.getElementById("gameStatusLabel");
    if (!label) return;

    if (opponentPlayerName) {
      label.textContent = "Ready to start (2/2) - Toggle ready status!";
    } else {
      label.textContent = "Waiting for players... (1/2)";
    }
  }

  // ===== COUNTDOWN INTERFACE =====
  function triggerCountdown() {
    const overlay = document.getElementById("countdownOverlay");
    const numEl = document.getElementById("countdownNumber");
    
    if (!overlay || !numEl) return;

    overlay.classList.remove("hidden");
    document.getElementById("readyBtnLocal").disabled = true;

    let count = 3;
    numEl.textContent = count;
    
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
      } else if (count === 0) {
        numEl.textContent = "GO!";
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  // ===== GAME PLAY START =====
  function startGameArena() {
    const overlay = document.getElementById("countdownOverlay");
    if (overlay) overlay.classList.add("hidden");

    document.getElementById("recordBtnMulti").disabled = false;
    document.getElementById("gameStatusLabel").textContent = "BATTLE IS ACTIVE! START SPEAKING!";
    
    currentWordIndex = 0;
    localWpm = 0;
    localAccuracy = 0;
    localStreak = 0;
    localMaxStreak = 0;
    localCorrectCount = 0;
    gameStartTime = Date.now();

    // Start countdown timer if lobbyDuration > 0
    const timerContainer = document.getElementById("battleTimerContainer");
    const timerLabel = document.getElementById("battleTimerLabel");
    
    if (matchTimerInterval) {
      clearInterval(matchTimerInterval);
      matchTimerInterval = null;
    }
    
    if (lobbyDuration > 0) {
      let timeLeft = lobbyDuration;
      if (timerContainer) timerContainer.classList.remove("hidden");
      if (timerLabel) timerLabel.textContent = `${timeLeft}s`;
      
      matchTimerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          timeLeft = 0;
          if (timerLabel) timerLabel.textContent = "0s";
          clearInterval(matchTimerInterval);
          matchTimerInterval = null;
          handleTimeUp();
        } else {
          if (timerLabel) timerLabel.textContent = `${timeLeft}s`;
        }
      }, 1000);
    } else {
      if (timerContainer) timerContainer.classList.add("hidden");
    }

    // Highlight the first word
    highlightLocalActiveWord();
  }

  function handleTimeUp() {
    console.log("[Lobby] Time limit expired!");
    if (isRecording) stopSpeechRecording();
    document.getElementById("recordBtnMulti").disabled = true;
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "finish",
        wpm: localWpm,
        accuracy: localAccuracy,
        progress: currentWordIndex
      }));
    }
  }

  // Setup spans for words
  function setupParagraphDisplay(text) {
    const container = document.getElementById("wordsDisplayArea");
    if (!container) return;

    container.innerHTML = "";
    
    // Clean and split words
    targetWords = text.trim().split(/\s+/);
    
    targetWords.forEach((word, idx) => {
      const span = document.createElement("span");
      span.className = "word-span";
      span.id = `battleWord-${idx}`;
      span.textContent = word;
      container.appendChild(span);
    });
  }

  function highlightLocalActiveWord() {
    // Clear previous active highlights
    document.querySelectorAll(".word-span").forEach(span => {
      span.classList.remove("active");
    });

    const activeSpan = document.getElementById(`battleWord-${currentWordIndex}`);
    if (activeSpan) {
      activeSpan.classList.add("active");
      
      // Auto-scroll paragraph display box to center active word
      const box = document.getElementById("wordsDisplayArea").parentElement;
      if (box) {
        const offsetTop = activeSpan.offsetTop;
        box.scrollTo({
          top: offsetTop - box.clientHeight / 2 + activeSpan.clientHeight / 2,
          behavior: "smooth"
        });
      }
    }
  }

  function updateOpponentGhostCursor(index) {
    document.querySelectorAll(".word-span").forEach(span => {
      span.classList.remove("opponent-active");
    });

    const oppSpan = document.getElementById(`battleWord-${index}`);
    if (oppSpan) {
      oppSpan.classList.add("opponent-active");
    }
  }

  // ===== SPEECH RECOGNITION MATCHING LOGIC =====
  function startSpeechRecording() {
    if (isRecording) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Please use Google Chrome.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // Target Indian English accent matching

    recognition.onstart = () => {
      isRecording = true;
      document.getElementById("recordBtnMulti").classList.add("recording");
      document.getElementById("recordBtnText").textContent = "Stop Speaking";
      document.getElementById("micStatus").innerHTML = `<span class="pulse-dot recording"></span> Recording Live`;
      document.getElementById("liveTranscriptBox").classList.remove("hidden");
    };

    recognition.onresult = (event) => {
      const resultIndex = event.resultIndex;
      const result = event.results[resultIndex];
      const transcript = result[0].transcript.trim();

      document.getElementById("liveTranscriptText").textContent = transcript || "...";

      if (resultIndex > currentSegmentIndex) {
        currentSegmentIndex = resultIndex;
        matchedWordsCountInSegment = 0;
      }

      const spokenWords = transcript.split(/\s+/).filter(w => w.length > 0);
      
      while (true) {
        const unmatchedSpokenWords = spokenWords.slice(matchedWordsCountInSegment);
        if (unmatchedSpokenWords.length === 0) break;

        if (currentWordIndex >= targetWords.length) break;

        const currentTargetWord = targetWords[currentWordIndex];
        
        let bestMatch = null;
        let bestMatchLength = 0;
        let bestMatchOffset = 0;
        let maxSeenAccuracy = 0;

        for (let offset = 0; offset <= 1; offset++) {
          if (offset >= unmatchedSpokenWords.length) break;

          const candidate = unmatchedSpokenWords[offset];
          const matchResult = evaluateMatch(currentTargetWord, candidate);

          if (matchResult.accuracy > maxSeenAccuracy) {
            maxSeenAccuracy = matchResult.accuracy;
          }

          if (matchResult.isCorrect) {
            if (!bestMatch || matchResult.accuracy > bestMatch.accuracy) {
              bestMatch = matchResult;
              bestMatchLength = 1;
              bestMatchOffset = offset;
            }
          }
        }

        if (bestMatch) {
          matchedWordsCountInSegment += (bestMatchOffset + bestMatchLength);
          
          const span = document.getElementById(`battleWord-${currentWordIndex}`);
          if (span) {
            span.classList.remove("active", "incorrect");
            span.classList.add("correct");
          }

          localCorrectCount++;
          localStreak++;
          if (localStreak > localMaxStreak) {
            localMaxStreak = localStreak;
          }

          advanceWordIndex(bestMatch.accuracy);
        } else {
          if (result.isFinal) {
            matchedWordsCountInSegment += 1;
            
            const span = document.getElementById(`battleWord-${currentWordIndex}`);
            if (span) {
              span.classList.remove("active");
              span.classList.add("incorrect");
            }
            localStreak = 0;
            
            // Check if it's a structural mispronunciation for accuracy averaging
            const accuracy = calculateAccuracy(currentTargetWord, unmatchedSpokenWords[0]);
            advanceWordIndex(accuracy);
          } else {
            break;
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      isRecording = false;
      document.getElementById("recordBtnMulti").classList.remove("recording");
      document.getElementById("recordBtnText").textContent = "Start Speaking";
      document.getElementById("micStatus").innerHTML = `<span class="pulse-dot"></span> Ready to Speak`;
      
      // Auto-restart if game is still active
      if (activeLobbyStatus === "active") {
        recognition.start();
      }
    };

    recognition.start();
  }

  function stopSpeechRecording() {
    if (!isRecording) return;
    activeLobbyStatus = "finished"; // locks restart loop
    if (recognition) {
      recognition.stop();
    }
  }

  // Vowel-Invariant Soundex Phonetic Matcher
  function phoneticNormalize(text) {
    if (!text) return "";
    let str = text.toLowerCase();
    
    // Switch acoustic blends that STT engines mismatch under Indian accents
    str = str.replace(/tr/g, "sr");
    
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
             .replace(/h/g, ""); // strip all 'h's for Indian name variations
             
    // Vowel invariance: strip all vowels to prevent accent mismatches
    str = str.replace(/[aeiouy]/g, "");
    
    // Clean non-alphanumeric
    str = str.replace(/[^a-z0-9]/g, "");
    
    return str.trim();
  }

  function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // replacement
            dp[i - 1][j] + 1,     // deletion
            dp[i][j - 1] + 1      // insertion
          );
        }
      }
    }
    return dp[m][n];
  }

  function calculateAccuracy(target, spoken) {
    if (!target || !spoken) return 0;
    const targetNorm = target.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();
    const spokenNorm = spoken.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

    if (targetNorm === spokenNorm) return 100;

    const targetPhoneticNorm = phoneticNormalize(target);
    const spokenPhoneticNorm = phoneticNormalize(spoken);
    if (targetPhoneticNorm === spokenPhoneticNorm) return 100;

    const distPhoneticNorm = levenshteinDistance(targetPhoneticNorm, spokenPhoneticNorm);
    const maxLenPhoneticNorm = Math.max(targetPhoneticNorm.length, spokenPhoneticNorm.length);
    const accuracyPhoneticNorm = maxLenPhoneticNorm > 0 ? Math.round(((maxLenPhoneticNorm - distPhoneticNorm) / maxLenPhoneticNorm) * 100) : 0;

    const distance = levenshteinDistance(targetNorm, spokenNorm);
    const maxLength = Math.max(targetNorm.length, spokenNorm.length);
    const accuracy = maxLength > 0 ? Math.round(((maxLength - distance) / maxLength) * 100) : 0;

    return Math.max(0, accuracy, accuracyPhoneticNorm);
  }

  const COMMON_SPEECH_ALIASES = {
    "cricket": ["cricket", "cricut", "cricot"],
    "software": ["software", "softwear"],
    "algorithm": ["algorithm", "algo", "algerithm"],
    "shreya ghoshal": ["treya gashel", "treya garcia", "treya gosal", "shreya gosal", "shreya ghosal", "treya ghoshal", "shraya gosal", "sreya gosal"],
    "joe root": ["joe roo", "joe route", "jo root", "jo roo"],
    "jasprit bumrah": ["jaspreet bumrah", "jasprit bumra", "justpreet bumrah", "just read boomra", "jaspreet bumra"],
    "virat kohli": ["virat koli", "we are at kohli", "virat colley", "virat koly"],
    "sundar pichai": ["sundar pichai", "sunder pichai", "sundar piche", "sunder piche"]
  };

  function evaluateMatch(targetPhrase, spokenPhrase) {
    if (!targetPhrase || !spokenPhrase) {
      return { isCorrect: false, accuracy: 0 };
    }

    const savedThreshold = localStorage.getItem("pronounce_right_accuracy_threshold");
    const accuracyThreshold = savedThreshold ? parseInt(savedThreshold, 10) : 70;

    const targetPhraseNorm = targetPhrase.toLowerCase().trim().replace(/\s+/g, " ");
    const spokenPhraseNorm = spokenPhrase.toLowerCase().trim().replace(/\s+/g, " ");

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



  function advanceWordIndex(lastWordAccuracy) {
    // Calculate live accuracy average
    localAccuracy = Math.round(((localAccuracy * currentWordIndex) + lastWordAccuracy) / (currentWordIndex + 1));
    
    // WPM calculation
    const elapsedMinutes = (Date.now() - gameStartTime) / 1000 / 60;
    localWpm = elapsedMinutes > 0 ? Math.round(localCorrectCount / elapsedMinutes) : 0;

    currentWordIndex++;

    // Update Local HUD UI
    document.getElementById("localWpmLabel").textContent = localWpm;
    document.getElementById("localAccuracyLabel").textContent = `${localAccuracy}%`;
    document.getElementById("localStreakLabel").textContent = localStreak;
    
    const progressPercent = targetWords.length > 0 ? (currentWordIndex / targetWords.length) * 100 : 0;
    document.getElementById("localProgressFill").style.width = `${progressPercent}%`;

    // Emit live stats update to WebSocket
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "progress",
        wordIndex: currentWordIndex,
        wpm: localWpm,
        accuracy: localAccuracy,
        streak: localStreak
      }));
    }

    if (currentWordIndex >= targetWords.length) {
      // Finish line reached!
      stopSpeechRecording();
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "finish",
          wpm: localWpm,
          accuracy: localAccuracy,
          progress: currentWordIndex
        }));
      }
    } else {
      highlightLocalActiveWord();
    }
  }

  // ===== SCOREBOARD RENDERER =====
  function showScoreboardStats(players, winnerName) {
    const modal = document.getElementById("scoreboardModal");
    if (!modal) return;

    modal.classList.remove("hidden");

    // Local player stats
    const localData = players[localPlayerName] || { wpm: 0, accuracy: 0, streak: 0 };
    document.getElementById("scoreboardLocalName").textContent = localPlayerName;
    document.getElementById("sbLocalWpm").textContent = localWpm;
    document.getElementById("sbLocalAccuracy").textContent = `${Math.round(localAccuracy)}%`;
    document.getElementById("sbLocalStreak").textContent = localMaxStreak;

    // Opponent player stats
    const opponentData = players[opponentPlayerName] || { wpm: 0, accuracy: 0, streak: 0 };
    document.getElementById("scoreboardOpponentName").textContent = opponentPlayerName || "Opponent";
    document.getElementById("sbOpponentWpm").textContent = opponentData.wpm;
    document.getElementById("sbOpponentAccuracy").textContent = `${Math.round(opponentData.accuracy)}%`;
    document.getElementById("sbOpponentStreak").textContent = opponentData.streak; // Server returns max streak or current

    // Determine titles & styling
    const titleEl = document.getElementById("matchResultTitle");
    const localCol = document.getElementById("scoreboardLocalCol");
    const opponentCol = document.getElementById("scoreboardOpponentCol");

    localCol.className = "scoreboard-player-column";
    opponentCol.className = "scoreboard-player-column";

    const localWinBadge = localCol.querySelector(".scoreboard-result-badge");
    const opponentWinBadge = opponentCol.querySelector(".scoreboard-result-badge");

    if (winnerName === localPlayerName) {
      titleEl.textContent = "Victory!";
      titleEl.style.color = "var(--color-win)";
      
      localCol.classList.add("local-winner");
      localWinBadge.className = "scoreboard-result-badge win";
      localWinBadge.textContent = "WINNER";

      opponentWinBadge.className = "scoreboard-result-badge loss";
      opponentWinBadge.textContent = "DEFEATED";
    } else if (winnerName === "Draw") {
      titleEl.textContent = "Draw Match!";
      titleEl.style.color = "var(--color-draw)";

      localWinBadge.className = "scoreboard-result-badge draw";
      localWinBadge.textContent = "DRAW";

      opponentWinBadge.className = "scoreboard-result-badge draw";
      opponentWinBadge.textContent = "DRAW";
    } else {
      titleEl.textContent = "Defeat!";
      titleEl.style.color = "var(--color-loss)";
      
      opponentCol.classList.add("local-winner");
      localWinBadge.className = "scoreboard-result-badge loss";
      localWinBadge.textContent = "DEFEATED";

      opponentWinBadge.className = "scoreboard-result-badge win";
      opponentWinBadge.textContent = "WINNER";
    }
  }

  // ===== UTILITY HELPERS =====
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ===== INITIALIZE =====
  function init() {
    // Pre-warm backend immediately on page load
    preWarmBackend();

    const usernameInput = document.getElementById("usernameInput");
    
    // Local Storage Nickname
    try {
      const savedNick = localStorage.getItem("pronounce_right_nickname");
      if (savedNick && usernameInput) {
        usernameInput.value = savedNick;
      }
    } catch (e) {
      console.error("Localstorage failed:", e);
    }

    if (usernameInput) {
      usernameInput.addEventListener("blur", () => {
        const nickname = usernameInput.value.trim();
        if (nickname) {
          localStorage.setItem("pronounce_right_nickname", nickname);
          loadBattleHistory(nickname);
        }
      });
      // Trigger initial load if nickname is present
      if (usernameInput.value.trim()) {
        loadBattleHistory(usernameInput.value.trim());
      }
    }

    // Create Private Room
    const createRoomBtn = document.getElementById("createRoomBtn");
    if (createRoomBtn) {
      createRoomBtn.addEventListener("click", async () => {
        const nickname = document.getElementById("usernameInput").value.trim();
        if (!nickname) {
          alert("Please enter a nickname first.");
          return;
        }

        const originalText = createRoomBtn.innerHTML;
        createRoomBtn.disabled = true;
        createRoomBtn.innerHTML = `
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          Connecting to Arena...
        `;

        // Get selected match duration
        const durationSelect = document.getElementById("matchDurationSelect");
        const duration = durationSelect ? parseInt(durationSelect.value, 10) : 60;

        // Generate a random room code: e.g. PR-8472
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = `PR-${randomNum}`;

        // Cold-boot wake up call
        await wakeUpBackend();

        createRoomBtn.disabled = false;
        createRoomBtn.innerHTML = originalText;

        connectLobby(code, nickname, duration);
      });
    }

    // Join Private Room
    const joinRoomBtn = document.getElementById("joinRoomBtn");
    if (joinRoomBtn) {
      joinRoomBtn.addEventListener("click", async () => {
        const nickname = document.getElementById("usernameInput").value.trim();
        let codeInput = document.getElementById("roomCodeInput").value.trim().toUpperCase();

        if (codeInput && /^\d+$/.test(codeInput)) {
          codeInput = `PR-${codeInput}`;
          document.getElementById("roomCodeInput").value = codeInput;
        }

        if (!nickname) {
          alert("Please enter a nickname first.");
          return;
        }
        if (!codeInput || !codeInput.startsWith("PR-")) {
          alert("Please enter a valid room code (e.g. PR-8472).");
          return;
        }

        const originalText = joinRoomBtn.innerHTML;
        joinRoomBtn.disabled = true;
        joinRoomBtn.innerHTML = `
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          Joining Room...
        `;

        // Cold-boot wake up call
        await wakeUpBackend();

        joinRoomBtn.disabled = false;
        joinRoomBtn.innerHTML = originalText;

        connectLobby(codeInput, nickname);
      });
    }

    // Ready Local Button
    const readyBtnLocal = document.getElementById("readyBtnLocal");
    if (readyBtnLocal) {
      readyBtnLocal.addEventListener("click", () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const isReady = !readyBtnLocal.classList.contains("ready-active");
        
        if (isReady) {
          readyBtnLocal.classList.add("ready-active");
          readyBtnLocal.textContent = "Ready!";
        } else {
          readyBtnLocal.classList.remove("ready-active");
          readyBtnLocal.textContent = "Toggle Ready";
        }

        socket.send(JSON.stringify({
          type: "ready",
          ready: isReady
        }));
      });
    }

    // Record Speech Button
    const recordBtnMulti = document.getElementById("recordBtnMulti");
    if (recordBtnMulti) {
      recordBtnMulti.addEventListener("click", () => {
        if (isRecording) {
          stopSpeechRecording();
        } else {
          startSpeechRecording();
        }
      });
    }

    // Exit Room Scoreboard
    const exitBattleBtn = document.getElementById("exitBattleBtn");
    if (exitBattleBtn) {
      exitBattleBtn.addEventListener("click", () => {
        if (socket) {
          socket.close();
        }
        document.getElementById("scoreboardModal").classList.add("hidden");
      });
    }
  }

  // ===== INITIALIZE BINDING =====
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
