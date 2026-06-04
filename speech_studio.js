// ===== SPEECH PRACTICE STUDIO - GLOBAL LOGIC =====
(() => {
  const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://pronounceright-1.onrender.com";

  // ===== STATE VARIABLES =====
  let chunks = [];
  let currentChunkIndex = 0;
  let sessionResults = [];
  let isRecording = false;
  let isPaused = false;
  
  let mediaRecorder = null;
  let audioChunks = [];
  let audioStream = null;
  let audioContext = null;
  let analyserNode = null;
  let visualizerAnimId = null;

  let practiceStartTime = null;
  let activeTimeElapsed = 0; // seconds
  let activeTimerInterval = null;
  let chunkStartTime = null;
  let typewriterSessionId = 0;

  // ===== HTML DOM ELEMENTS =====
  const setupView = document.getElementById("setupView");
  const practiceView = document.getElementById("practiceView");
  const resultsView = document.getElementById("resultsView");

  const speechTextarea = document.getElementById("speechTextarea");
  const wordCountSpan = document.getElementById("wordCount");
  const charCountSpan = document.getElementById("charCount");
  const speakingTimeSpan = document.getElementById("speakingTime");

  const startPracticeBtn = document.getElementById("startPracticeBtn");
  const listenVoiceBtn = document.getElementById("listenVoiceBtn");
  const clearTextBtn = document.getElementById("clearTextBtn");

  const progressText = document.getElementById("progressText");
  const progressBarFill = document.getElementById("progressBarFill");
  const teleprompterText = document.getElementById("teleprompterText");
  const textSizeSlider = document.getElementById("textSizeSlider");
  const autoScrollToggle = document.getElementById("autoScrollToggle");
  const scrollSpeedSlider = document.getElementById("scrollSpeedSlider");

  const recordStatusText = document.getElementById("recordStatusText");
  const studioRecordBtn = document.getElementById("studioRecordBtn");
  const pauseRecordBtn = document.getElementById("pauseRecordBtn");
  const prevChunkBtn = document.getElementById("prevChunkBtn");
  const retryChunkBtn = document.getElementById("retryChunkBtn");
  const nextChunkBtn = document.getElementById("nextChunkBtn");

  const coachingPanel = document.getElementById("coachingPanel");
  const coachingFeedback = document.getElementById("coachingFeedback");

  const chunkAccuracy = document.getElementById("chunkAccuracy");
  const chunkWpm = document.getElementById("chunkWpm");
  const chunkDuration = document.getElementById("chunkDuration");

  const sessionAccuracy = document.getElementById("sessionAccuracy");
  const sessionWpm = document.getElementById("sessionWpm");
  const sessionTime = document.getElementById("sessionTime");

  const waveformCanvas = document.getElementById("waveformCanvas");

  // Results elements
  const resultsRingProgress = document.getElementById("resultsRingProgress");
  const resultsAccuracyVal = document.getElementById("resultsAccuracyVal");
  const resultsWpmVal = document.getElementById("resultsWpmVal");
  const resultsFluencyVal = document.getElementById("resultsFluencyVal");
  const resultsTimeVal = document.getElementById("resultsTimeVal");
  const hardWordsContainer = document.getElementById("hardWordsContainer");
  const transcriptsContainer = document.getElementById("transcriptsContainer");
  const restartPracticeBtn = document.getElementById("restartPracticeBtn");
  const exitStudioBtn = document.getElementById("exitStudioBtn");
  const endPracticeBtn = document.getElementById("endPracticeBtn");

  // Initialize flat waveform line
  initWaveformCanvas();

  // ===== TEXT AREA HANDLER =====
  if (speechTextarea) {
    speechTextarea.addEventListener("input", () => {
      const text = speechTextarea.value.trim();
      const chars = text.length;
      
      // Split on spaces, filter empty slots
      const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      
      wordCountSpan.textContent = words;
      charCountSpan.textContent = chars;

      // Speak duration based on ~130 WPM
      const totalSeconds = Math.round((words / 130) * 60);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      speakingTimeSpan.textContent = `${minutes}m ${seconds}s`;

      const hasText = words > 0;
      startPracticeBtn.disabled = !hasText;
      listenVoiceBtn.disabled = !hasText;
    });
  }

  // Clear text action
  if (clearTextBtn) {
    clearTextBtn.addEventListener("click", () => {
      speechTextarea.value = "";
      wordCountSpan.textContent = "0";
      charCountSpan.textContent = "0";
      speakingTimeSpan.textContent = "0m 0s";
      startPracticeBtn.disabled = true;
      listenVoiceBtn.disabled = true;
      speechTextarea.focus();
    });
  }

  // Read aloud action
  if (listenVoiceBtn) {
    listenVoiceBtn.addEventListener("click", () => {
      const text = speechTextarea.value.trim();
      if (!text) return;
      
      const selectedLang = window.getSelectedLanguage
        ? window.getSelectedLanguage()
        : "english";

      if (window.speakTextWithGoogleTTS) {
        window.speakTextWithGoogleTTS(text, selectedLang);
      } else {
        if (!("speechSynthesis" in window)) {
          alert("Text-to-speech is not supported in this browser.");
          return;
        }
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
          punjabi: "pa-IN"
        };
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = ttsMap[selectedLang] || "en-US";
        const savedRate = localStorage.getItem("pronounce_right_speak_rate");
        utterance.rate = savedRate ? parseFloat(savedRate) : 0.95;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    });
  }

  // ===== LAUNCH PRACTICE SESSION =====
  if (startPracticeBtn) {
    startPracticeBtn.addEventListener("click", () => {
      const text = speechTextarea.value.trim();
      if (!text) return;

      // Keep the entire text as a single chunk to practice all at once (prevent sentence-by-sentence splitting)
      chunks = [text];

      if (chunks.length === 0) {
        alert("Please enter a longer speech to practice.");
        return;
      }

      currentChunkIndex = 0;
      sessionResults = new Array(chunks.length).fill(null);
      activeTimeElapsed = 0;
      practiceStartTime = Date.now();

      // Show console, hide input Setup
      setupView.classList.add("hidden");
      practiceView.classList.remove("hidden");
      resultsView.classList.add("hidden");

      // Load first sentence
      loadChunk(0);

      // Start session stopwatch timer
      if (activeTimerInterval) clearInterval(activeTimerInterval);
      activeTimerInterval = setInterval(() => {
        activeTimeElapsed++;
        updateActiveTimerUI();
      }, 1000);
    });
  }

  // ===== LOAD SENETENCE CHUNK =====
  function loadChunk(index) {
    currentChunkIndex = index;
    stopAudioRecordingTrack();
    typewriterSessionId++; // Cancel active typewriter animations


    // Progress percentage
    progressText.textContent = "Full Speech Practice";
    progressBarFill.style.width = "100%";

    // Load chunk text
    const text = chunks[index];
    teleprompterText.textContent = text;
    teleprompterText.style.fontSize = `${textSizeSlider.value}rem`;
    teleprompterText.scrollTop = 0;

    // Reset UI states
    coachingPanel.classList.add("hidden");
    coachingFeedback.innerHTML = "Speak the sentence to trigger AI pronunciation analysis and tips...";
    coachingFeedback.className = "coaching-content";
    recordStatusText.textContent = "Ready to record";
    recordStatusText.style.color = "var(--text-secondary)";
    studioRecordBtn.classList.remove("recording");
    pauseRecordBtn.disabled = true;
    pauseRecordBtn.textContent = "Pause";
    isRecording = false;
    isPaused = false;

    // Reset current chunk numbers
    chunkAccuracy.textContent = "0%";
    chunkWpm.textContent = "0";
    chunkDuration.textContent = "0.0s";

    // Nav buttons
    prevChunkBtn.disabled = index === 0;
    if (index === chunks.length - 1) {
      nextChunkBtn.innerHTML = `<span>Finish</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    } else {
      nextChunkBtn.innerHTML = `<span>Next</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>`;
    }

    // Cancel speech
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  // ===== TELEPROMPTER OPTIONS =====
  if (textSizeSlider) {
    textSizeSlider.addEventListener("input", () => {
      teleprompterText.style.fontSize = `${textSizeSlider.value}rem`;
    });
  }

  // ===== MICROPHONE RECORDING LOGIC =====
  if (studioRecordBtn) {
    studioRecordBtn.addEventListener("click", () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    });
  }

  if (pauseRecordBtn) {
    pauseRecordBtn.addEventListener("click", () => {
      if (!isRecording || !mediaRecorder) return;

      if (isPaused) {
        mediaRecorder.resume();
        isPaused = false;
        pauseRecordBtn.textContent = "Pause";
        recordStatusText.textContent = "Listening...";
        recordStatusText.style.color = "var(--success)";
      } else {
        mediaRecorder.pause();
        isPaused = true;
        pauseRecordBtn.textContent = "Resume";
        recordStatusText.textContent = "Recording paused";
        recordStatusText.style.color = "#fbbf24";
      }
    });
  }

  async function startRecording() {
    if (isRecording) return;
    audioChunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream = stream;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await analyzeSpeech(audioBlob);
      };

      // Set Web Audio API visualizer
      setupAudioVisualizer(stream);

      mediaRecorder.start();
      chunkStartTime = Date.now();
      isRecording = true;
      isPaused = false;

      studioRecordBtn.classList.add("recording");
      pauseRecordBtn.disabled = false;
      pauseRecordBtn.textContent = "Pause";
      recordStatusText.textContent = "Listening...";
      recordStatusText.style.color = "var(--success)";

      // Handle teleprompter auto scroll
      if (autoScrollToggle.checked) {
        startTeleprompterAutoScroll();
      }

    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone permission denied or source unavailable. Please check settings.");
      recordStatusText.textContent = "Mic error";
      recordStatusText.style.color = "var(--error)";
    }
  }

  function stopRecording() {
    if (!isRecording) return;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    stopAudioRecordingTrack();

    studioRecordBtn.classList.remove("recording");
    pauseRecordBtn.disabled = true;
    recordStatusText.textContent = "Processing speech...";
    recordStatusText.style.color = "var(--text-secondary)";
    isRecording = false;
  }

  function stopAudioRecordingTrack() {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    if (visualizerAnimId) {
      cancelAnimationFrame(visualizerAnimId);
      visualizerAnimId = null;
    }
    // Redraw flat line
    drawFlatWaveform();
  }

  // ===== BACKEND ANALYSIS INTERACTION =====
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

  // ===== BACKEND ANALYSIS INTERACTION =====
  async function analyzeSpeech(audioBlob) {
    const expected = chunks[currentChunkIndex];
    if (!expected) return;

    const durationSec = ((Date.now() - chunkStartTime) / 1000).toFixed(1);
    chunkDuration.textContent = `${durationSec}s`;

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
      punjabi: "pa"
    };
    const backendLang = languageMap[selectedLang] || "en";

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      recordStatusText.textContent = "Analyzing speech with AI Coach...";
      recordStatusText.style.color = "#a78bfa";

      const startTime = performance.now();
      const response = await fetch(
        `${BASE_URL}/custom_speech_analyze?expected_text=${encodeURIComponent(expected)}&language=${backendLang}`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Backend response error");
      }

      const result = await response.json();
      const endTime = performance.now();
      const latencySec = ((endTime - startTime) / 1000).toFixed(2);

      // Display metrics
      chunkAccuracy.textContent = `${Math.round(result.accuracy)}%`;
      chunkWpm.textContent = result.wpm;

      // 1. Display Latency Badge
      const latencyBadge = document.getElementById("studioLatencyBadge");
      const latencyText = document.getElementById("studioLatencyText");
      if (latencyBadge && latencyText) {
        latencyText.textContent = `Latency: ${latencySec}s | Model: Local (Whisper)`;
        latencyBadge.classList.remove("hidden");
      }

      // 2. Display Word Diff
      const wordDiffContainer = document.getElementById("studioWordDiff");
      const wordDiffText = document.getElementById("studioWordDiffText");
      const transcriptHeard = document.getElementById("studioTranscriptHeard");
      if (wordDiffContainer && wordDiffText && transcriptHeard) {
        const diffResults = computeWordDiff(expected, result.transcript);
        wordDiffText.innerHTML = diffResults.map(item => {
          if (item.isPunctuation) return item.original;
          const cls = item.match ? "correct" : "incorrect";
          return `<span class="diff-word ${cls}">${item.original}</span>`;
        }).join(" ");
        
        transcriptHeard.innerHTML = `<strong>AI Heard:</strong> "${result.transcript || 'No speech detected'}"`;
        wordDiffContainer.classList.remove("hidden");
      }

      // 3. Display Ask Coach Button if accuracy is less than 85%
      const askCoachBtn = document.getElementById("studioAskCoachBtn");
      if (askCoachBtn) {
        if (result.accuracy < 85) {
          askCoachBtn.classList.remove("hidden");
          const newAskCoachBtn = askCoachBtn.cloneNode(true);
          askCoachBtn.parentNode.replaceChild(newAskCoachBtn, askCoachBtn);
          
          newAskCoachBtn.addEventListener("click", () => {
            if (window.askVocalCoachAbout) {
              window.askVocalCoachAbout(expected, result.accuracy);
            } else {
              alert("VocalCoach AI is not initialized on this page.");
            }
          });
        } else {
          askCoachBtn.classList.add("hidden");
        }
      }

      // Display feedback with typewriter effect
      coachingPanel.classList.remove("hidden");
      coachingFeedback.innerHTML = "";
      coachingFeedback.classList.add("caret-blink");
      
      const formattedFeedback = formatBotResponse(result.feedback);
      typewriterHTML(coachingFeedback, formattedFeedback, 20);

      // Save statistics
      sessionResults[currentChunkIndex] = {
        expected: expected,
        transcript: result.transcript,
        accuracy: result.accuracy,
        wpm: result.wpm,
        fluency: result.fluency,
        duration: durationSec,
        feedback: result.feedback
      };

      updateSessionStats();
      recordStatusText.textContent = "Analysis complete!";
      recordStatusText.style.color = "var(--success)";

    } catch (err) {
      console.error("Analysis failed:", err);
      recordStatusText.textContent = "Analysis failed";
      recordStatusText.style.color = "var(--error)";
      coachingPanel.classList.remove("hidden");
      coachingFeedback.innerHTML = "<span style='color: var(--error);'>Could not reach pronunciation server. Please ensure python backend is running.</span>";
    }
  }

  // Formatting helpers matching script.js chatbot
  function formatBotResponse(text) {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    const lines = html.split('\n');
    let inList = false;
    let formattedHtml = '';
    
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          formattedHtml += '<ul>';
          inList = true;
        }
        formattedHtml += `<li>${trimmed.substring(2)}</li>`;
      } else {
        if (inList) {
          formattedHtml += '</ul>';
          inList = false;
        }
        if (trimmed !== '') {
          formattedHtml += `<p>${line}</p>`;
        }
      }
    }
    if (inList) {
      formattedHtml += '</ul>';
    }
    return formattedHtml;
  }

  // HTML character typewriter animation
  function typewriterHTML(element, htmlContent, speedMs = 15) {
    const currentSessionId = ++typewriterSessionId;
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlContent;
    
    // Create flat tree array of nodes/text characters
    const nodes = Array.from(tempContainer.childNodes);
    let index = 0;

    function typeNextNode() {
      if (currentSessionId !== typewriterSessionId) return;
      if (index >= nodes.length) {
        element.classList.remove("caret-blink");
        return;
      }
      
      const node = nodes[index];
      
      if (node.nodeType === Node.TEXT_NODE) {
        // Type standard text
        let charIndex = 0;
        const text = node.textContent;
        const textNode = document.createTextNode("");
        element.appendChild(textNode);
        
        function typeChar() {
          if (currentSessionId !== typewriterSessionId) return;
          if (charIndex >= text.length) {
            index++;
            typeNextNode();
            return;
          }
          textNode.textContent += text[charIndex];
          charIndex++;
          setTimeout(typeChar, speedMs);
        }
        typeChar();
      } else {
        // Tag nodes (like <strong> or <ul>): append element, then type its contents if it has any
        const clonedNode = node.cloneNode(false);
        clonedNode.innerHTML = "";
        element.appendChild(clonedNode);
        
        if (node.childNodes.length > 0) {
          typewriterSubtree(clonedNode, Array.from(node.childNodes), () => {
            if (currentSessionId !== typewriterSessionId) return;
            index++;
            typeNextNode();
          });
        } else {
          index++;
          typeNextNode();
        }
      }
    }

    function typewriterSubtree(parentElement, subnodes, callback) {
      let subIdx = 0;
      function typeNextSubnode() {
        if (currentSessionId !== typewriterSessionId) return;
        if (subIdx >= subnodes.length) {
          callback();
          return;
        }
        const subnode = subnodes[subIdx];
        if (subnode.nodeType === Node.TEXT_NODE) {
          let charIndex = 0;
          const text = subnode.textContent;
          const textNode = document.createTextNode("");
          parentElement.appendChild(textNode);
          
          function typeChar() {
            if (currentSessionId !== typewriterSessionId) return;
            if (charIndex >= text.length) {
              subIdx++;
              typeNextSubnode();
              return;
            }
            textNode.textContent += text[charIndex];
            charIndex++;
            setTimeout(typeChar, speedMs);
          }
          typeChar();
        } else {
          const clonedSub = subnode.cloneNode(false);
          clonedSub.innerHTML = "";
          parentElement.appendChild(clonedSub);
          
          if (subnode.childNodes.length > 0) {
            typewriterSubtree(clonedSub, Array.from(subnode.childNodes), () => {
              if (currentSessionId !== typewriterSessionId) return;
              subIdx++;
              typeNextSubnode();
            });
          } else {
            subIdx++;
            typeNextSubnode();
          }
        }
      }
      typeNextSubnode();
    }

    typeNextNode();
  }

  // ===== STATS CALCULATION PANEL =====
  function updateSessionStats() {
    const validResults = sessionResults.filter(r => r !== null);
    if (validResults.length === 0) return;

    const avgAcc = validResults.reduce((sum, r) => sum + r.accuracy, 0) / validResults.length;
    const avgWpmVal = validResults.reduce((sum, r) => sum + r.wpm, 0) / validResults.length;

    sessionAccuracy.textContent = `${Math.round(avgAcc)}%`;
    sessionWpm.textContent = Math.round(avgWpmVal);
  }

  function updateActiveTimerUI() {
    const minutes = Math.floor(activeTimeElapsed / 60);
    const seconds = activeTimeElapsed % 60;
    const timerStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    sessionTime.textContent = timerStr;
  }

  // ===== NAVIGATION =====
  if (nextChunkBtn) {
    nextChunkBtn.addEventListener("click", () => {
      if (isRecording) stopRecording();

      if (currentChunkIndex < chunks.length - 1) {
        loadChunk(currentChunkIndex + 1);
      } else {
        // Final Chunk completed - trigger results dashboard
        showResultsDashboard();
      }
    });
  }

  if (prevChunkBtn) {
    prevChunkBtn.addEventListener("click", () => {
      if (isRecording) stopRecording();
      if (currentChunkIndex > 0) {
        loadChunk(currentChunkIndex - 1);
      }
    });
  }

  if (retryChunkBtn) {
    retryChunkBtn.addEventListener("click", () => {
      if (isRecording) stopRecording();
      loadChunk(currentChunkIndex);
    });
  }

  if (endPracticeBtn) {
    endPracticeBtn.addEventListener("click", () => {
      if (isRecording) stopRecording();
      showResultsDashboard();
    });
  }

  // ===== AUDIO WAVEFORM VISUALIZER =====
  function initWaveformCanvas() {
    if (!waveformCanvas) return;
    waveformCanvas.width = waveformCanvas.parentElement.clientWidth || 500;
    waveformCanvas.height = 60;
    drawFlatWaveform();
  }

  function drawFlatWaveform() {
    if (!waveformCanvas) return;
    const ctx = waveformCanvas.getContext("2d");
    const w = waveformCanvas.width;
    const h = waveformCanvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function setupAudioVisualizer(stream) {
    if (!waveformCanvas) return;
    
    // Create Audio context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    analyserNode = audioContext.createAnalyser();
    
    const sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyserNode);
    
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const ctx = waveformCanvas.getContext("2d");
    const w = waveformCanvas.width;
    const h = waveformCanvas.height;

    function renderFrame() {
      if (!isRecording) return;
      visualizerAnimId = requestAnimationFrame(renderFrame);

      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, w, h);
      
      // Draw dynamic center-mirror bar audio wave
      const barWidth = (w / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Scale bar size
        barHeight = (dataArray[i] / 255) * h * 0.8;

        // Gradient color based on frequency
        ctx.fillStyle = `rgba(167, 139, 250, ${0.4 + (barHeight / h)})`; // soft purple glow

        // Mirror bars top and bottom from centerline
        ctx.fillRect(x, (h / 2) - (barHeight / 2), barWidth - 2, barHeight);
        
        x += barWidth;
      }
    }
    renderFrame();
  }

  // ===== TELEPROMPTER AUTO SCROLL =====
  let scrollInterval = null;
  function startTeleprompterAutoScroll() {
    if (scrollInterval) clearInterval(scrollInterval);
    
    const baseSpeed = Number(scrollSpeedSlider.value); // 1 to 5
    teleprompterText.scrollTop = 0;

    scrollInterval = setInterval(() => {
      if (!isRecording || isPaused) {
        clearInterval(scrollInterval);
        return;
      }
      teleprompterText.scrollTop += baseSpeed * 0.5;
    }, 50);
  }

  // ===== RESULTS DASHBOARD RENDERING =====
  function showResultsDashboard() {
    if (activeTimerInterval) {
      clearInterval(activeTimerInterval);
      activeTimerInterval = null;
    }
    stopAudioRecordingTrack();

    const validResults = sessionResults.filter(r => r !== null);
    
    // Switch views
    practiceView.classList.add("hidden");
    setupView.classList.add("hidden");
    resultsView.classList.remove("hidden");

    // If zero sentences practiced, show empty state
    if (validResults.length === 0) {
      resultsAccuracyVal.textContent = "0%";
      resultsWpmVal.textContent = "0";
      resultsFluencyVal.textContent = "0%";
      resultsTimeVal.textContent = "0:00";
      hardWordsContainer.innerHTML = "<span style='color: var(--text-muted); font-style: italic;'>No words practiced in this session.</span>";
      transcriptsContainer.innerHTML = "<span style='color: var(--text-muted); font-style: italic;'>No transcripts available.</span>";
      animateResultsAccuracyRing(0);
      return;
    }

    // Calculations
    const overallAcc = Math.round(validResults.reduce((sum, r) => sum + r.accuracy, 0) / validResults.length);
    const avgWpm = Math.round(validResults.reduce((sum, r) => sum + r.wpm, 0) / validResults.length);
    const avgFluency = Math.round(validResults.reduce((sum, r) => sum + r.fluency, 0) / validResults.length);
    
    const minutes = Math.floor(activeTimeElapsed / 60);
    const seconds = activeTimeElapsed % 60;
    const activeDurationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Render summary metrics
    resultsAccuracyVal.textContent = `${overallAcc}%`;
    resultsWpmVal.textContent = avgWpm;
    resultsFluencyVal.textContent = `${avgFluency}%`;
    resultsTimeVal.textContent = activeDurationStr;

    // Animate Ring progress
    animateResultsAccuracyRing(overallAcc);

    // Scan hard words (sentences where accuracy < 75%)
    const hardWords = new Set();
    validResults.forEach(res => {
      if (res.accuracy < 75) {
        // Find expected words not present in transcription
        const expectedWords = res.expected.toLowerCase().replace(/[^\w\s\u0900-\u097f]/g, '').split(/\s+/);
        const transcriptWords = new Set(res.transcript.toLowerCase().replace(/[^\w\s\u0900-\u097f]/g, '').split(/\s+/));
        
        expectedWords.forEach(w => {
          if (w.length > 3 && !transcriptWords.has(w)) {
            hardWords.add(w);
          }
        });
      }
    });

    // Populate hard words pills
    hardWordsContainer.innerHTML = "";
    if (hardWords.size > 0) {
      Array.from(hardWords).slice(0, 12).forEach(word => {
        const pill = document.createElement("span");
        pill.className = "hard-word-badge";
        pill.textContent = word;
        hardWordsContainer.appendChild(pill);
      });
    } else {
      hardWordsContainer.innerHTML = "<span style='color: var(--success); font-weight: 500;'>None detected! Excellent pronunciation throughout the session.</span>";
    }

    // Populate comparisons detail list
    transcriptsContainer.innerHTML = "";
    validResults.forEach((res, i) => {
      const card = document.createElement("div");
      card.className = "comparison-item";

      const indexCol = document.createElement("div");
      indexCol.className = "comparison-index";
      indexCol.textContent = i + 1;

      const textCol = document.createElement("div");
      textCol.className = "comparison-texts";

      const expectedRow = document.createElement("div");
      expectedRow.className = "comparison-text-row expected";
      expectedRow.innerHTML = `<strong>Expected:</strong> "${res.expected}"`;

      // Word differences highlight markup
      const actualRow = document.createElement("div");
      actualRow.className = "comparison-text-row actual";
      actualRow.innerHTML = `<strong>You Said:</strong> "${highlightDiffs(res.expected, res.transcript)}"`;

      textCol.appendChild(expectedRow);
      textCol.appendChild(actualRow);

      const scoreCol = document.createElement("div");
      scoreCol.className = "comparison-score-block";

      const scoreVal = document.createElement("div");
      const acc = Math.round(res.accuracy);
      scoreVal.className = `comparison-score-val ${acc >= 85 ? 'high' : acc >= 60 ? 'medium' : 'low'}`;
      scoreVal.textContent = `${acc}%`;

      const scoreLbl = document.createElement("div");
      scoreLbl.className = "comparison-score-lbl";
      scoreLbl.textContent = "Accuracy";

      scoreCol.appendChild(scoreVal);
      scoreCol.appendChild(scoreLbl);

      card.appendChild(indexCol);
      card.appendChild(textCol);
      card.appendChild(scoreCol);

      transcriptsContainer.appendChild(card);
    });
  }

  // Word-based side-by-side mismatch highlighter
  function highlightDiffs(expected, actual) {
    if (!actual) return `<span class="mismatch">[No speech detected]</span>`;
    
    const expNorm = expected.toLowerCase().replace(/[^\w\s\u0900-\u097f]/g, '').split(/\s+/).filter(w => w.length > 0);
    const actWords = actual.split(/\s+/);

    const expSet = new Set(expNorm);

    return actWords.map(word => {
      const normWord = word.toLowerCase().replace(/[^\w\u0900-\u097f]/g, '');
      if (expSet.has(normWord)) {
        return `<span class="match">${word}</span>`;
      } else {
        return `<span class="mismatch">${word}</span>`;
      }
    }).join(" ");
  }

  function animateResultsAccuracyRing(accuracy) {
    if (!resultsRingProgress) return;
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (accuracy / 100) * circumference;
    
    resultsRingProgress.style.strokeDasharray = circumference;
    resultsRingProgress.style.strokeDashoffset = offset;
  }

  // ===== RESTART / EXIT ACTIONS =====
  if (restartPracticeBtn) {
    restartPracticeBtn.addEventListener("click", () => {
      setupView.classList.remove("hidden");
      practiceView.classList.add("hidden");
      resultsView.classList.add("hidden");
      speechTextarea.focus();
    });
  }

  if (exitStudioBtn) {
    exitStudioBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  console.log("[Speech Studio] speech_studio.js loaded successfully.");
})();
