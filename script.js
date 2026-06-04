import { supabase } from "./supabase.js"

console.log("Supabase connected:", supabase)

import { signUp, login, logout } from "./auth.js"

// ===== SESSION SYSTEM =====

async function checkUserSession() {
  const { data: { session } } = await supabase.auth.getSession();

  updateNavbarUI(session?.user || null);

  // Listen for auth changes (login/logout auto update)
  supabase.auth.onAuthStateChange((_event, session) => {
    updateNavbarUI(session?.user || null);
  });
}

async function protectPage() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Not logged in → redirect to home
    window.location.href = "index.html";
  }
}

function updateNavbarUI(user) {
  const loginBtn = document.getElementById("navLoginBtn");
  const getStartedBtn = document.getElementById("navGetStartedBtn");
  const avatar = document.getElementById("avatarCircle");
  const menu = document.getElementById("profileMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (!loginBtn || !avatar || !getStartedBtn) return;

  if (user) {
    // Hide Login and Get Started
    loginBtn.style.display = "none";
    getStartedBtn.style.display = "none";

    // Show Avatar
    avatar.style.display = "flex";

    let username = user.email.split("@")[0];
    avatar.textContent = username.charAt(0).toUpperCase();
    profileName.textContent = username;
    profileEmail.textContent = user.email;

    // Fetch actual username from profiles table in Supabase asynchronously
    supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (data && data.username) {
          username = data.username;
          avatar.textContent = username.charAt(0).toUpperCase();
          profileName.textContent = username;
          
          // Sync with lobby input if present on battle.html
          const lobbyInput = document.getElementById("usernameInput");
          if (lobbyInput) {
            lobbyInput.value = username;
            lobbyInput.dispatchEvent(new Event("change"));
            lobbyInput.dispatchEvent(new Event("blur"));
          }
        }
      })
      .catch(err => console.error("Failed to fetch username profile", err));

    // Auto-populate lobby username input on battle.html initially
    const lobbyInput = document.getElementById("usernameInput");
    if (lobbyInput && !lobbyInput.value.trim()) {
      lobbyInput.value = username;
      lobbyInput.dispatchEvent(new Event("change"));
      lobbyInput.dispatchEvent(new Event("blur"));
    }

    // Toggle dropdown
    avatar.onclick = (e) => {
      e.stopPropagation();
      menu.style.display =
        menu.style.display === "block" ? "none" : "block";
    };

    // Logout
    logoutBtn.onclick = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };

    // Settings
    settingsBtn.onclick = () => {
      if (window.openSettingsModal) {
        window.openSettingsModal(user);
      }
    };

    // Close dropdown on outside click
    document.addEventListener("click", () => {
      menu.style.display = "none";
    });

  } else {
    // Show Login & Get Started
    loginBtn.style.display = "inline-block";
    getStartedBtn.style.display = "inline-block";

    // Hide Avatar
    avatar.style.display = "none";
    menu.style.display = "none";

    loginBtn.onclick = () => {
      document.getElementById("authModal").classList.add("active");
    };
  }
}

// ===== MAIN SCRIPT FOR PRONOUNCERIGHT =====
// This script uses functions from languages.js which MUST be loaded BEFORE this script
// Required functions from languages.js:
// - getSelectedLanguage()
// - setSelectedLanguage(langKey)
// - getLanguage(langKey)
// - getAllLanguages()
// - getCategoriesForLanguage(langKey)

// Initialize the app
async function initApp() {
  checkUserSession();

  initLanguageSelector();
  initNavDropdown();
  initMobileMenu();
  setupAuthModal();
  setupSettingsModal();
  initFloatingChatbot();

  if (document.querySelector(".hero")) {
    initHomePage();
  }

  if (document.querySelector(".categories-section") && !document.querySelector(".learn-section")) {
    await protectPage();     // 🔥 Protection here
    initCategoriesPage();
  }

  if (document.querySelector(".learn-section")) {
    initLearnPage();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// ===== LANGUAGE SELECTOR =====
function initLanguageSelector() {
  const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"
  updateUIForLanguage(selectedLang)
}

function initNavDropdown() {
  const navLangBtn = document.getElementById("navLangBtn")
  const navLangDropdown = document.getElementById("navLangDropdown")

  if (!navLangBtn || !navLangDropdown) return

  // Populate dropdown using getAllLanguages from languages.js
  const languages = window.getAllLanguages ? window.getAllLanguages() : []
  navLangDropdown.innerHTML = languages
    .map(
      (lang) => `
        <button class="lang-option" data-lang="${lang.key}">
            <span class="lang-native">${lang.nativeName}</span>
            <span class="lang-english">${lang.name}</span>
        </button>
    `,
    )
    .join("")

  // Toggle dropdown
  navLangBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    navLangDropdown.classList.toggle("active")
  })

  // Select language
  navLangDropdown.addEventListener("click", (e) => {
    const option = e.target.closest(".lang-option")
    if (option) {
      const langKey = option.dataset.lang
      selectLanguage(langKey)
      navLangDropdown.classList.remove("active")
    }
  })

  // Close on outside click
  document.addEventListener("click", () => {
    navLangDropdown.classList.remove("active")
  })
}

function selectLanguage(langKey) {
  if (window.setSelectedLanguage) {
    window.setSelectedLanguage(langKey)
  }
  updateUIForLanguage(langKey)

  // Reload page content for language-specific pages
  if (document.querySelector(".categories-section") && !document.querySelector(".learn-section")) {
    renderCategories(langKey)
  }
  if (document.querySelector(".learn-section")) {
    initLearnPage()
  }
  if (document.querySelector(".hero")) {
    updateDemoCard(langKey)
  }
}

function updateUIForLanguage(langKey) {
  const lang = window.getLanguage ? window.getLanguage(langKey) : { name: "Hindi" }

  // Update nav language button
  const navLangName = document.getElementById("navLangName")
  if (navLangName) {
    navLangName.textContent = lang.name
  }

  // Update hero language name
  const heroLangName = document.getElementById("heroLangName")
  if (heroLangName) {
    heroLangName.textContent = lang.name
  }

  // Update page language name
  const pageLangName = document.getElementById("pageLangName")
  if (pageLangName) {
    pageLangName.textContent = lang.name
  }

  // Update hero title with native language name as well
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const titleSpan = heroTitle.querySelector(".highlight-purple")
    if (titleSpan) {
      titleSpan.textContent = lang.name
      titleSpan.style.fontFamily = getFontFamily(langKey)
    }
  }

  // Update language cards selection
  const langCards = document.querySelectorAll(".language-card")
  langCards.forEach((card) => {
    card.classList.toggle("selected", card.dataset.lang === langKey)
  })

  // Notify other pages about language change
  if (window.onLanguageChangedPractice) {
    window.onLanguageChangedPractice()
  }
  if (window.onLanguageChangedChallenge) {
    window.onLanguageChangedChallenge()
  }
}

// ===== HOME PAGE =====
function initHomePage() {
  renderLanguageCards()
  renderLanguagesShowcase()
  initDemoCard()
}

function renderLanguageCards() {
  const container = document.getElementById("languageCards")
  if (!container) return

  const languages = window.getAllLanguages ? window.getAllLanguages() : []
  const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"

  container.innerHTML = languages
    .map(
      (lang) => `
        <button class="language-card ${lang.key === selectedLang ? "selected" : ""}" data-lang="${lang.key}">
            <span class="card-native">${lang.nativeName}</span>
            <span class="card-english">${lang.name}</span>
        </button>
    `,
    )
    .join("")

  // Add click handlers
  container.querySelectorAll(".language-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectLanguage(card.dataset.lang)
    })
  })
}

function renderLanguagesShowcase() {
  const container = document.getElementById("languagesShowcase")
  if (!container) return

  const languages = window.getAllLanguages ? window.getAllLanguages() : []

  container.innerHTML = languages
    .map(
      (lang) => `
        <div class="showcase-card" onclick="selectLanguage('${lang.key}')">
            <div class="showcase-native">${lang.nativeName}</div>
            <div class="showcase-name">${lang.name}</div>
            <div class="showcase-code">${lang.code}</div>
        </div>
    `,
    )
    .join("")
}

// ===== DEMO CARD =====
function initDemoCard() {
  const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"
  updateDemoCard(selectedLang)

  // Listen button
  const listenBtn = document.getElementById("demoListenBtn")
  if (listenBtn) {
    listenBtn.addEventListener("click", () => {
      const word = document.getElementById("demoWord").textContent
      const langKey = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"
      speakWord(word, langKey)
    })
  }

  // Speak button
  const speakBtn = document.getElementById("demoSpeakBtn")
  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      const word = document.getElementById("demoWord").textContent
      const langKey = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"
      startDemoRecognition(word, langKey)
    })
  }
}

function updateDemoCard(langKey) {
  const lang = window.getLanguage ? window.getLanguage(langKey) : { name: "Hindi" }
  const categories = window.getCategoriesForLanguage ? window.getCategoriesForLanguage(langKey) : {}

  // Get first word from greetings category
  const greetings = categories.greetings
  if (!greetings || !greetings.words || !greetings.words.length) return

  const firstWord = greetings.words[0]

  const demoLangBadge = document.getElementById("demoLangBadge")
  const demoWord = document.getElementById("demoWord")
  const demoTranslit = document.getElementById("demoTranslit")
  const demoMeaning = document.getElementById("demoMeaning")

  if (demoLangBadge) demoLangBadge.textContent = lang.name
  if (demoWord) {
    demoWord.textContent = firstWord.word
    demoWord.style.fontFamily = getFontFamily(langKey)
  }
  if (demoTranslit) demoTranslit.textContent = firstWord.transliteration
  if (demoMeaning) demoMeaning.textContent = firstWord.meaning

  // Clear feedback
  const feedback = document.getElementById("demoFeedback")
  if (feedback) feedback.innerHTML = ""
}

// Get appropriate font family for language
function getFontFamily(langKey) {
  const fontMap = {
    hindi: "var(--font-devanagari)",
    marathi: "var(--font-devanagari)",
    tamil: "var(--font-tamil)",
    telugu: "var(--font-telugu)",
    kannada: "var(--font-kannada)",
    malayalam: "var(--font-malayalam)",
    gujarati: "var(--font-gujarati)",
    bengali: "var(--font-bengali)",
    punjabi: "var(--font-gurmukhi)",
  }
  return fontMap[langKey] || "var(--font-sans)"
}

// ===== CATEGORIES PAGE =====
function initCategoriesPage() {
  const selectedLang = window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi"
  renderCategories(selectedLang)
}

function renderCategories(langKey) {
  const container = document.getElementById("categoriesGrid")
  if (!container) return

  const categories = window.getCategoriesForLanguage ? window.getCategoriesForLanguage(langKey) : {}
  const lang = window.getLanguage ? window.getLanguage(langKey) : { name: "Hindi" }

  // Update page title
  const pageLangName = document.getElementById("pageLangName")
  if (pageLangName) pageLangName.textContent = lang.name

  container.innerHTML = Object.entries(categories)
    .map(
      ([key, category]) => `
        <a href="learn.html?lang=${langKey}&category=${key}" class="category-card">
            <div class="category-icon">${category.icon}</div>
            <div class="category-content">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-native" style="font-family: ${getFontFamily(langKey)}">${category.nameNative}</p>
                <span class="category-count">${category.words.length} words</span>
            </div>
            <div class="category-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </a>
    `,
    )
    .join("")
}

// ===== LEARN PAGE =====
let currentWordIndex = 0
let currentWords = []
let currentCategory = null
let currentLangKey = null

function initLearnPage() {
  const urlParams = new URLSearchParams(window.location.search)
  currentLangKey = urlParams.get("lang") || (window.getSelectedLanguage ? window.getSelectedLanguage() : "hindi")
  const categoryKey = urlParams.get("category") || "greetings"

  const categories = window.getCategoriesForLanguage ? window.getCategoriesForLanguage(currentLangKey) : {}
  currentCategory = categories[categoryKey]

  if (!currentCategory) {
    currentCategory = categories.greetings
  }

  currentWords = currentCategory ? currentCategory.words : []

  // Update language in localStorage and UI
  if (window.setSelectedLanguage) {
    window.setSelectedLanguage(currentLangKey)
  }
  updateUIForLanguage(currentLangKey)

  // Update sidebar
  updateLearnSidebar()

  // Update current word display
  currentWordIndex = 0
  updateWordDisplay()

  // Setup buttons
  setupLearnButtons()
}

function updateLearnSidebar() {
  const lang = window.getLanguage ? window.getLanguage(currentLangKey) : { name: "Hindi" }

  // Update category info
  const categoryIcon = document.getElementById("categoryIcon")
  const categoryName = document.getElementById("categoryName")
  const categoryNameNative = document.getElementById("categoryNameNative")

  if (currentCategory) {
    if (categoryIcon) categoryIcon.textContent = currentCategory.icon
    if (categoryName) categoryName.textContent = currentCategory.name
    if (categoryNameNative) {
      categoryNameNative.textContent = currentCategory.nameNative
      categoryNameNative.style.fontFamily = getFontFamily(currentLangKey)
    }
  }

  // Update language badge
  const learnLangBadge = document.getElementById("learnLangBadge")
  if (learnLangBadge) learnLangBadge.textContent = lang.name

  // Render word list
  const wordList = document.getElementById("wordList")
  if (wordList && currentWords) {
    wordList.innerHTML = currentWords
      .map(
        (word, index) => `
          <button class="word-item ${index === currentWordIndex ? "active" : ""}" data-index="${index}">
              <span class="word-text" style="font-family: ${getFontFamily(currentLangKey)}">${word.word}</span>
              <span class="word-translit">${word.transliteration}</span>
          </button>
      `,
      )
      .join("")

    // Add click handlers
    wordList.querySelectorAll(".word-item").forEach((item) => {
      item.addEventListener("click", () => {
        currentWordIndex = Number.parseInt(item.dataset.index)
        updateWordDisplay()
      })
    })
  }
}

function updateWordDisplay() {
  if (!currentWords || currentWords.length === 0) return

  const word = currentWords[currentWordIndex]
  const lang = window.getLanguage ? window.getLanguage(currentLangKey) : { name: "Hindi" }

  const mainWord = document.getElementById("mainWord")
  const wordTranslit = document.getElementById("wordTranslit")
  const wordIPA = document.getElementById("wordIPA")
  const wordMeaning = document.getElementById("wordMeaning")
  const wordNumber = document.getElementById("wordNumber")

  if (mainWord) {
    mainWord.textContent = word.word
    mainWord.style.fontFamily = getFontFamily(currentLangKey)
  }
  if (wordTranslit) wordTranslit.textContent = word.transliteration
  if (wordIPA) wordIPA.textContent = word.ipa || ""
  if (wordMeaning) wordMeaning.textContent = word.meaning
  if (wordNumber) wordNumber.textContent = `${currentWordIndex + 1}/${currentWords.length}`

  // Update progress
  const progress = ((currentWordIndex + 1) / currentWords.length) * 100
  const progressFill = document.getElementById("progressFill")
  const progressText = document.getElementById("progressText")

  if (progressFill) progressFill.style.width = `${progress}%`
  if (progressText) progressText.textContent = `${currentWordIndex + 1}/${currentWords.length} words`

  // Update word list active state
  document.querySelectorAll(".word-item").forEach((item, index) => {
    item.classList.toggle("active", index === currentWordIndex)
  })

  // Update nav buttons
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")

  if (prevBtn) prevBtn.disabled = currentWordIndex === 0
  if (nextBtn) nextBtn.disabled = currentWordIndex === currentWords.length - 1

  // Hide feedback
  const feedbackSection = document.getElementById("feedbackSection")
  if (feedbackSection) feedbackSection.classList.remove("show")

  // Hide recording indicator
  const recordingIndicator = document.getElementById("recordingIndicator")
  if (recordingIndicator) recordingIndicator.classList.remove("active")
}

function setupLearnButtons() {
  // Listen button
  const listenBtn = document.getElementById("listenBtn")
  if (listenBtn) {
    listenBtn.addEventListener("click", () => {
      if (currentWords && currentWords[currentWordIndex]) {
        const word = currentWords[currentWordIndex].word
        speakWord(word, currentLangKey)
      }
    })
  }

  // Speak button
  const speakBtn = document.getElementById("speakBtn")
  if (speakBtn) {
    speakBtn.addEventListener("click", () => {
      if (currentWords && currentWords[currentWordIndex]) {
        const word = currentWords[currentWordIndex].word
        startRecognition(word, currentLangKey, "learn")
      }
    })
  }

  // Navigation buttons
  const prevBtn = document.getElementById("prevBtn")
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentWordIndex > 0) {
        currentWordIndex--
        updateWordDisplay()
      }
    })
  }

  const nextBtn = document.getElementById("nextBtn")
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentWords && currentWordIndex < currentWords.length - 1) {
        currentWordIndex++
        updateWordDisplay()
      }
    })
  }
}

// ===== SPEECH SYNTHESIS =====
function speakWord(text, langKey) {
  const waveform = document.getElementById("demoWaveform");
  if (window.speakTextWithGoogleTTS) {
    if (waveform) waveform.classList.add("active");
    window.speakTextWithGoogleTTS(text, langKey);
    // Since Google TTS is an audio stream without events, auto-remove after 1.2s
    setTimeout(() => {
      if (waveform) waveform.classList.remove("active");
    }, 1200);
  } else {
    const lang = window.getLanguage ? window.getLanguage(langKey) : { code: "hi-IN" }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang.code
    
    // Read speed setting from settings
    const savedRate = localStorage.getItem("pronounce_right_speak_rate");
    utterance.rate = savedRate ? parseFloat(savedRate) : 0.8;

    // Find appropriate voice
    const voices = speechSynthesis.getVoices()
    const langCode = lang.code.split("-")[0]
    const langVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang === lang.code)
    if (langVoice) {
      utterance.voice = langVoice
    }

    utterance.onstart = () => {
      if (waveform) waveform.classList.add("active");
    };
    utterance.onend = () => {
      if (waveform) waveform.classList.remove("active");
    };
    utterance.onerror = () => {
      if (waveform) waveform.classList.remove("active");
    };

    speechSynthesis.speak(utterance)
  }
}

// ===== SPEECH RECOGNITION =====
let recognition = null

function startRecognition(targetWord, langKey, mode) {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    alert("Speech recognition is not supported in this browser. Please use Chrome.")
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()

  const lang = window.getLanguage ? window.getLanguage(langKey) : { code: "hi-IN" }
  recognition.lang = lang.code
  recognition.continuous = false
  recognition.interimResults = false

  // Show recording indicator
  const indicator = document.getElementById("recordingIndicator")
  if (indicator) indicator.classList.add("active")

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    handleRecognitionResult(transcript, targetWord, mode)
  }

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error)
    if (indicator) indicator.classList.remove("active")
    showFeedback("Could not recognize speech. Please try again.", 0, "", mode)
  }

  recognition.onend = () => {
    if (indicator) indicator.classList.remove("active")
  }

  recognition.start()
}

function startDemoRecognition(targetWord, langKey) {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    alert("Speech recognition is not supported in this browser. Please use Chrome.")
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()

  const lang = window.getLanguage ? window.getLanguage(langKey) : { code: "hi-IN" }
  recognition.lang = lang.code
  recognition.continuous = false
  recognition.interimResults = false

  const speakBtn = document.getElementById("demoSpeakBtn")
  const waveform = document.getElementById("demoWaveform")
  if (speakBtn) speakBtn.classList.add("recording")
  if (waveform) waveform.classList.add("active")

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    const accuracy = calculateAccuracy(targetWord, transcript)
    showDemoFeedback(transcript, accuracy)
  }

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error)
    if (speakBtn) speakBtn.classList.remove("recording")
    if (waveform) waveform.classList.remove("active")
    showDemoFeedback("Could not recognize speech", 0)
  }

  recognition.onend = () => {
    if (speakBtn) speakBtn.classList.remove("recording")
    if (waveform) waveform.classList.remove("active")
  }

  recognition.start()
}

function handleRecognitionResult(transcript, targetWord, mode) {
  const accuracy = calculateAccuracy(targetWord, transcript)
  showFeedback(transcript, accuracy, targetWord, mode)
}

function showFeedback(transcript, accuracy, targetWord, mode) {
  const feedbackSection = document.getElementById("feedbackSection")
  const feedbackIcon = document.getElementById("feedbackIcon")
  const feedbackTitle = document.getElementById("feedbackTitle")
  const userSaid = document.getElementById("userSaid")
  const accuracyScore = document.querySelector(".accuracy-score .score-number")

  if (feedbackSection) feedbackSection.classList.add("show")

  if (accuracy >= 80) {
    if (feedbackIcon) feedbackIcon.innerHTML = "✅"
    if (feedbackTitle) feedbackTitle.textContent = "Excellent!"
  } else if (accuracy >= 50) {
    if (feedbackIcon) feedbackIcon.innerHTML = "👍"
    if (feedbackTitle) feedbackTitle.textContent = "Good try!"
  } else {
    if (feedbackIcon) feedbackIcon.innerHTML = "🔄"
    if (feedbackTitle) feedbackTitle.textContent = "Keep practicing!"
  }

  if (userSaid) userSaid.textContent = transcript
  if (accuracyScore) accuracyScore.textContent = `${accuracy}%`
}

function showDemoFeedback(transcript, accuracy) {
  const feedback = document.getElementById("demoFeedback")
  if (!feedback) return

  let icon, message
  if (accuracy >= 80) {
    icon = "✅"
    message = "Excellent pronunciation!"
  } else if (accuracy >= 50) {
    icon = "👍"
    message = "Good try!"
  } else {
    icon = "🔄"
    message = "Keep practicing!"
  }

  feedback.innerHTML = `
    <div class="demo-feedback-content ${accuracy >= 80 ? "success" : accuracy >= 50 ? "good" : "retry"}">
      <span class="feedback-icon">${icon}</span>
      <div class="feedback-details">
        <p class="feedback-message">${message}</p>
        <p class="feedback-transcript">You said: "${transcript}"</p>
        <p class="feedback-accuracy">${accuracy}% accuracy</p>
      </div>
    </div>
  `
}

// ===== UTILITY FUNCTIONS =====
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

function calculateAccuracy(target, spoken) {
  if (!target || !spoken) return 0;
  const targetNorm = normalizeText(target);
  const spokenNorm = normalizeText(spoken);

  if (targetNorm === spokenNorm) return 100;

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

  return Math.max(0, accuracy, accuracyPhonetic);
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
  const m = str1.length
  const n = str2.length
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1)
      }
    }
  }

  return dp[m][n]
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })
  }
}

// Load voices when available
if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices()
  }
}

// Make selectLanguage available globally for footer links
window.selectLanguage = selectLanguage

console.log("[v0] Main script.js loaded - using functions from languages.js")

// ===== AUTH MODAL LOGIC =====
// ===== AUTH MODAL LOGIC =====

let isLoginMode = true;

function setupAuthModal() {
  const loginBtn = document.getElementById("navLoginBtn");
  const registerBtn = document.getElementById("navGetStartedBtn");

  if (!loginBtn && !registerBtn) return;

  const modal = document.getElementById("authModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeAuthModal");
  const toggleBtn = document.getElementById("authToggleBtn");
  const toggleText = document.getElementById("authToggleText");
  const submitBtn = document.getElementById("authSubmitBtn");
  const title = document.getElementById("authTitle");
  const usernameInput = document.getElementById("authUsername");
  const emailInput = document.getElementById("authEmail");
  const passwordInput = document.getElementById("authPassword");

  // ===== BACKDROP CLICK CLOSING =====
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ===== LOGIN BUTTON =====
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      isLoginMode = true;
      title.textContent = "Login";
      submitBtn.textContent = "Login";
      if (toggleText) toggleText.textContent = "Don't have an account?";
      if (toggleBtn) toggleBtn.textContent = "Sign up";
      if (usernameInput) usernameInput.style.display = "none";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // ===== GET STARTED BUTTON =====
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      isLoginMode = false;
      title.textContent = "Sign Up";
      submitBtn.textContent = "Sign Up";
      if (toggleText) toggleText.textContent = "Already have an account?";
      if (toggleBtn) toggleBtn.textContent = "Login";
      if (usernameInput) usernameInput.style.display = "block";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  // ===== CLOSE BUTTON =====
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // ===== TOGGLE LOGIN ↔ SIGNUP =====
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isLoginMode = !isLoginMode;

      title.textContent = isLoginMode ? "Login" : "Sign Up";
      submitBtn.textContent = isLoginMode ? "Login" : "Sign Up";
      if (toggleText) {
        toggleText.textContent = isLoginMode ? "Don't have an account?" : "Already have an account?";
      }
      toggleBtn.textContent = isLoginMode ? "Sign up" : "Login";
      if (usernameInput) usernameInput.style.display = isLoginMode ? "none" : "block";
    });
  }

  // ===== SUBMIT BUTTON =====
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const username = usernameInput ? usernameInput.value.trim() : "";

      if (!email || !password) {
        alert("Please fill all required fields");
        return;
      }

      try {
        if (isLoginMode) {
          await login(email, password);
        } else {
          if (!username) {
            alert("Username is required for signup");
            return;
          }
          await signUp(email, password, username);
        }

        modal.classList.remove("active");
        document.body.style.overflow = "";

      } catch (err) {
        console.error("Auth error:", err);
        alert("Authentication failed. Check console.");
      }
    });
  }

  // Default state
  if (usernameInput) usernameInput.style.display = "none";
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
});

// ===== VOCALCOACH AI CHATBOT =====

function injectChatbotStyles() {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    /* Floating Toggle Button */
    #vocalcoach-toggle-btn {
      position: fixed !important;
      right: 24px !important;
      bottom: 24px !important;
      left: auto !important;
      width: 56px !important;
      height: 56px !important;
      border-radius: 50% !important;
      background: rgba(26, 26, 36, 0.85) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 255, 255, 0.03) !important;
      backdrop-filter: blur(16px) !important;
      -webkit-backdrop-filter: blur(16px) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999 !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      color: #ffffff !important;
    }
    #vocalcoach-toggle-btn:hover {
      transform: scale(1.08) !important;
      background: rgba(35, 35, 50, 0.95) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.08) !important;
    }
    #vocalcoach-toggle-btn svg {
      width: 24px !important;
      height: 24px !important;
      transition: transform 0.3s ease !important;
    }
    #vocalcoach-toggle-btn.active svg {
      transform: rotate(90deg) !important;
    }

    /* Chat Window Container */
    #vocalcoach-chat-window {
      position: fixed !important;
      right: 24px !important;
      bottom: 96px !important;
      left: auto !important;
      width: 360px !important;
      height: 500px !important;
      max-height: calc(100vh - 140px) !important;
      max-width: calc(100vw - 48px) !important;
      border-radius: 16px !important;
      background: rgba(18, 18, 26, 0.85) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 16px 64px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.02) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      z-index: 999998 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      opacity: 0 !important;
      transform: translateY(20px) scale(0.95) !important;
      pointer-events: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    #vocalcoach-chat-window.active {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: auto !important;
    }

    /* Chat Header */
    .vocalcoach-header {
      padding: 16px;
      background: rgba(26, 26, 36, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .vocalcoach-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .vocalcoach-header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ffffff;
      font-size: 14px;
    }
    .vocalcoach-header-title {
      font-family: var(--font-sans), sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .vocalcoach-header-status {
      font-size: 11px;
      color: #4ade80;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
      font-weight: 400;
    }
    .vocalcoach-header-status::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #4ade80;
      border-radius: 50%;
    }
    .vocalcoach-close-btn {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      padding: 4px;
      font-size: 18px;
      line-height: 1;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .vocalcoach-close-btn:hover {
      color: #ffffff;
    }

    /* Chat Messages */
    .vocalcoach-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .vocalcoach-messages::-webkit-scrollbar {
      width: 6px;
    }
    .vocalcoach-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .vocalcoach-messages::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .vocalcoach-messages::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .vocalcoach-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.5;
      word-wrap: break-word;
      font-family: var(--font-sans), sans-serif;
    }
    .vocalcoach-msg.user {
      align-self: flex-end;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border-bottom-right-radius: 2px;
    }
    .vocalcoach-msg.bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom-left-radius: 2px;
    }
    .vocalcoach-msg p {
      margin-bottom: 6px;
    }
    .vocalcoach-msg p:last-child {
      margin-bottom: 0;
    }
    .vocalcoach-msg ul, .vocalcoach-msg ol {
      margin-left: 18px;
      margin-bottom: 6px;
    }
    .vocalcoach-msg li {
      margin-bottom: 4px;
    }
    .vocalcoach-msg code {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }

    /* Typing indicator */
    .vocalcoach-typing {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border-bottom-left-radius: 2px;
      padding: 12px 16px;
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .vocalcoach-typing span {
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: vocalcoach-bounce 1.4s infinite ease-in-out both;
    }
    .vocalcoach-typing span:nth-child(1) { animation-delay: -0.32s; }
    .vocalcoach-typing span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes vocalcoach-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }

    /* Chat Input Form */
    .vocalcoach-input-area {
      padding: 12px 16px;
      background: rgba(26, 26, 36, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .vocalcoach-input {
      flex: 1;
      background: rgba(10, 10, 15, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      color: #ffffff;
      font-family: var(--font-sans), sans-serif;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s;
    }
    .vocalcoach-input:focus {
      border-color: rgba(255, 255, 255, 0.3);
    }
    .vocalcoach-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .vocalcoach-send-btn {
      background: #ffffff;
      color: #0a0a0f;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s, transform 0.1s;
    }
    .vocalcoach-send-btn:hover {
      background: #e0e0e8;
    }
    .vocalcoach-send-btn:active {
      transform: scale(0.95);
    }
    .vocalcoach-send-btn svg {
      width: 16px;
      height: 16px;
    }
    .vocalcoach-send-btn:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.3);
      cursor: not-allowed;
    }

    /* Mobile Responsiveness styling */
    @media (max-width: 480px) {
      #vocalcoach-toggle-btn {
        right: 16px !important;
        bottom: 16px !important;
        left: auto !important;
        width: 48px !important;
        height: 48px !important;
      }
      #vocalcoach-chat-window {
        right: 16px !important;
        bottom: 80px !important;
        left: auto !important;
        width: calc(100vw - 32px) !important;
        height: 400px !important;
      }
    }

    /* Pulsing Outer Ring for Chatbot Toggle Button */
    #vocalcoach-toggle-btn::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 70%);
      z-index: -1;
      animation: vocalcoach-pulse-ring 2s infinite;
      pointer-events: none;
    }

    @keyframes vocalcoach-pulse-ring {
      0% {
        transform: scale(0.95);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.15);
        opacity: 0.3;
      }
      100% {
        transform: scale(0.95);
        opacity: 0.8;
      }
    }

    /* Floating Greeting Tooltip Bubble */
    #vocalcoach-greeting-bubble {
      position: fixed !important;
      right: 92px !important;
      bottom: 32px !important;
      left: auto !important;
      background: rgba(26, 26, 36, 0.9) !important;
      border: 1px solid rgba(139, 92, 246, 0.3) !important;
      padding: 0.75rem 1.25rem !important;
      border-radius: 12px 12px 0 12px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.1) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      color: #ffffff !important;
      font-size: 0.85rem !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
      z-index: 999999 !important;
      opacity: 0 !important;
      transform: translateY(10px) scale(0.95) !important;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
      pointer-events: none !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    #vocalcoach-greeting-bubble.show {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: auto !important;
      animation: vocalcoach-float 3s infinite ease-in-out !important;
    }

    #vocalcoach-greeting-bubble .close-greeting {
      background: transparent !important;
      border: none !important;
      color: rgba(255, 255, 255, 0.5) !important;
      cursor: pointer !important;
      font-size: 0.75rem !important;
      padding: 0.1rem !important;
      margin-left: 0.25rem !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: color 0.2s ease !important;
    }

    #vocalcoach-greeting-bubble .close-greeting:hover {
      color: #ffffff !important;
    }

    @keyframes vocalcoach-float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px);
      }
    }

    @media (max-width: 480px) {
      #vocalcoach-greeting-bubble {
        right: 76px !important;
        bottom: 24px !important;
        font-size: 0.75rem !important;
        padding: 0.5rem 1rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

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

async function getGeminiResponse(userPrompt) {
  const base_url = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://pronounceright-1.onrender.com";
  const url = `${base_url}/vocalcoach_chat`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: userPrompt })
  });

  if (!response.ok) {
    throw new Error(`Backend chat endpoint returned status ${response.status}`);
  }

  const data = await response.json();
  const reply = data.reply;
  if (!reply) {
    throw new Error("Invalid reply format from backend chat endpoint");
  }
  return reply;
}

function initFloatingChatbot() {
  if (document.getElementById("vocalcoach-toggle-btn")) return;

  injectChatbotStyles();

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "vocalcoach-toggle-btn";
  toggleBtn.setAttribute("aria-label", "Toggle VocalCoach AI Assistant");
  toggleBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zm3.002 0h.008v.008h-.008v-.008zm3.002 0h.008v.008h-.008v-.008zM21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `;

  const chatWindow = document.createElement("div");
  chatWindow.id = "vocalcoach-chat-window";
  chatWindow.innerHTML = `
    <div class="vocalcoach-header">
      <div class="vocalcoach-header-info">
        <div class="vocalcoach-header-avatar">💬</div>
        <div class="vocalcoach-header-title">
          <span>VocalCoach AI</span>
          <span class="vocalcoach-header-status">Online Assistant</span>
        </div>
      </div>
      <button class="vocalcoach-close-btn" aria-label="Close chat">✕</button>
    </div>
    <div class="vocalcoach-messages" id="vocalcoach-messages">
      <div class="vocalcoach-msg bot">
        <p>Hello! I am <strong>VocalCoach AI</strong>. I can help you practice Indian language pronunciations, explain word meanings, or give transliteration tips. How can I help you today?</p>
      </div>
    </div>
    <div class="vocalcoach-input-area">
      <input type="text" class="vocalcoach-input" id="vocalcoach-input" placeholder="Ask about pronunciation, meaning..." autocomplete="off">
      <button class="vocalcoach-send-btn" id="vocalcoach-send-btn" disabled aria-label="Send message">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(chatWindow);

  const greetingBubble = document.createElement("div");
  greetingBubble.id = "vocalcoach-greeting-bubble";
  greetingBubble.innerHTML = `
    <span>Need help? Ask VocalCoach AI! 💬</span>
    <button class="close-greeting" aria-label="Dismiss greeting">✕</button>
  `;
  document.body.appendChild(greetingBubble);

  setTimeout(() => {
    if (!chatWindow.classList.contains("active")) {
      greetingBubble.classList.add("show");
    }
  }, 2500);

  const closeGreetingBtn = greetingBubble.querySelector(".close-greeting");
  if (closeGreetingBtn) {
    closeGreetingBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      greetingBubble.classList.remove("show");
    });
  }

  const inputEl = chatWindow.querySelector("#vocalcoach-input");
  const sendBtn = chatWindow.querySelector("#vocalcoach-send-btn");
  const messagesEl = chatWindow.querySelector("#vocalcoach-messages");
  const closeBtn = chatWindow.querySelector(".vocalcoach-close-btn");

  const toggleChat = () => {
    const isActive = chatWindow.classList.toggle("active");
    toggleBtn.classList.toggle("active");
    if (isActive) {
      greetingBubble.classList.remove("show");
      inputEl.focus();
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  };

  toggleBtn.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  inputEl.addEventListener("input", () => {
    sendBtn.disabled = !inputEl.value.trim();
  });

  const handleSend = async () => {
    const userText = inputEl.value.trim();
    if (!userText) return;

    inputEl.value = "";
    sendBtn.disabled = true;

    appendMessage(userText, "user");
    messagesEl.scrollTop = messagesEl.scrollHeight;

    const typingIndicator = showTypingIndicator();

    try {
      const responseText = await getGeminiResponse(userText);
      typingIndicator.remove();
      appendMessage(responseText, "bot");
    } catch (error) {
      console.error("Chatbot error:", error);
      typingIndicator.remove();
      appendMessage("Sorry, I'm having trouble connecting right now. Please try again.", "bot");
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
    inputEl.focus();
  };

  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });

  window.askVocalCoachAbout = (targetText, accuracy) => {
    if (!chatWindow.classList.contains("active")) {
      toggleChat();
    }
    greetingBubble.classList.remove("show");
    
    const promptText = `I just tried to pronounce "${targetText}" and scored ${Math.round(accuracy)}% accuracy. Can you tell me what common mistakes people make with this, how to pronounce it correctly, and any phonetic tips?`;
    inputEl.value = promptText;
    sendBtn.disabled = false;
    handleSend();
  };

  function appendMessage(text, sender) {
    const msgEl = document.createElement("div");
    msgEl.className = `vocalcoach-msg ${sender}`;
    if (sender === "bot") {
      msgEl.innerHTML = formatBotResponse(text);
    } else {
      msgEl.textContent = text;
    }
    messagesEl.appendChild(msgEl);
  }

  function showTypingIndicator() {
    const typingEl = document.createElement("div");
    typingEl.className = "vocalcoach-typing";
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typingEl;
  }
}

// ===== SETTINGS MODAL INJECTION & LOGIC =====
function setupSettingsModal() {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeSettingsModal");
  const cancelBtn = document.getElementById("cancelSettingsBtn");
  const saveBtn = document.getElementById("saveSettingsBtn");
  const speakRateInput = document.getElementById("settingsSpeakRate");
  const speakRateVal = document.getElementById("speakRateVal");
  const autoPlayInput = document.getElementById("settingsAutoPlay");
  const thresholdSelect = document.getElementById("settingsAccuracyThreshold");
  const resetPasswordBtn = document.getElementById("settingsResetPasswordBtn");

  // Update value display on input
  if (speakRateInput && speakRateVal) {
    speakRateInput.addEventListener("input", (e) => {
      speakRateVal.textContent = e.target.value + "x";
    });
  }

  // Close functionality
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Close when clicking overlay backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Save settings
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (speakRateInput) localStorage.setItem("pronounce_right_speak_rate", speakRateInput.value);
      if (autoPlayInput) localStorage.setItem("pronounce_right_autoplay", autoPlayInput.checked ? "true" : "false");
      if (thresholdSelect) localStorage.setItem("pronounce_right_accuracy_threshold", thresholdSelect.value);
      closeModal();
      // Dispatch a custom event to notify target pages
      window.dispatchEvent(new Event("pronounce_right_settings_changed"));
    });
  }

  // Password reset email sender
  if (resetPasswordBtn) {
    resetPasswordBtn.addEventListener("click", async () => {
      resetPasswordBtn.disabled = true;
      resetPasswordBtn.textContent = "Sending Email...";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
            redirectTo: window.location.origin + "/index.html"
          });
          if (error) {
            alert("Error sending email: " + error.message);
          } else {
            alert("Password reset email sent successfully! Please check your email inbox.");
          }
        } else {
          alert("You must be logged in to reset your password.");
        }
      } catch (e) {
        console.error("Password reset error:", e);
        alert("Reset failed: check browser console");
      } finally {
        resetPasswordBtn.disabled = false;
        resetPasswordBtn.textContent = "Send Password Reset Email";
      }
    });
  }

  // Open modal binder exposed globally
  window.openSettingsModal = async (user) => {
    // Load current values
    const speakRate = localStorage.getItem("pronounce_right_speak_rate") || "0.8";
    const autoplay = localStorage.getItem("pronounce_right_autoplay") === "true";
    const threshold = localStorage.getItem("pronounce_right_accuracy_threshold") || "70";

    if (speakRateInput) speakRateInput.value = speakRate;
    if (speakRateVal) speakRateVal.textContent = speakRate + "x";
    if (autoPlayInput) autoPlayInput.checked = autoplay;
    if (thresholdSelect) thresholdSelect.value = threshold;

    const accountSection = document.getElementById("settingsAccountSection");
    if (user) {
      if (accountSection) accountSection.style.display = "block";
      const uInput = document.getElementById("settingsUsername");
      const eInput = document.getElementById("settingsEmail");
      if (uInput) uInput.value = user.email.split("@")[0];
      if (eInput) eInput.value = user.email;
    } else {
      if (accountSection) accountSection.style.display = "none";
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };
}
