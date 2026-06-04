// ===== LANGUAGES DATA =====
// This file must be loaded BEFORE script.js

const LANGUAGES = {
  english: {
    key: "english",
    name: "English",
    nativeName: "English",
    code: "en-US",
    font: "'Inter', sans-serif",
  },
  hindi: {
    key: "hindi",
    name: "Hindi",
    nativeName: "हिन्दी",
    code: "hi-IN",
    font: "'Noto Sans Devanagari', sans-serif",
  },
  marathi: {
    key: "marathi",
    name: "Marathi",
    nativeName: "मराठी",
    code: "mr-IN",
    font: "'Noto Sans Devanagari', sans-serif",
  },
  tamil: {
    key: "tamil",
    name: "Tamil",
    nativeName: "தமிழ்",
    code: "ta-IN",
    font: "'Noto Sans Tamil', sans-serif",
  },
  telugu: {
    key: "telugu",
    name: "Telugu",
    nativeName: "తెలుగు",
    code: "te-IN",
    font: "'Noto Sans Telugu', sans-serif",
  },
  kannada: {
    key: "kannada",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    code: "kn-IN",
    font: "'Noto Sans Kannada', sans-serif",
  },
  malayalam: {
    key: "malayalam",
    name: "Malayalam",
    nativeName: "മലയാളം",
    code: "ml-IN",
    font: "'Noto Sans Malayalam', sans-serif",
  },
  gujarati: {
    key: "gujarati",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    code: "gu-IN",
    font: "'Noto Sans Gujarati', sans-serif",
  },
  bengali: {
    key: "bengali",
    name: "Bengali",
    nativeName: "বাংলা",
    code: "bn-IN",
    font: "'Noto Sans Bengali', sans-serif",
  },
  punjabi: {
    key: "punjabi",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    code: "pa-IN",
    font: "'Noto Sans Gurmukhi', sans-serif",
  },
}

// Language categories data
const LANGUAGE_CATEGORIES = {
  english: {
    greetings: {
      name: "Greetings",
      nameNative: "Greetings",
      icon: "👋",
      words: [
        { word: "Hello", transliteration: "Hello", ipa: "/həˈloʊ/", meaning: "A greeting" },
        { word: "Thank you", transliteration: "Thank you", ipa: "/θæŋk juː/", meaning: "Expression of gratitude" },
        { word: "Good morning", transliteration: "Good morning", ipa: "/ɡʊd ˈmɔːrnɪŋ/", meaning: "Morning greeting" },
        { word: "Good night", transliteration: "Good night", ipa: "/ɡʊd naɪt/", meaning: "Evening farewell" },
        { word: "Goodbye", transliteration: "Goodbye", ipa: "/ɡʊdˈbaɪ/", meaning: "Farewell" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "Numbers",
      icon: "🔢",
      words: [
        { word: "One", transliteration: "One", ipa: "/wʌn/", meaning: "Number 1" },
        { word: "Two", transliteration: "Two", ipa: "/tuː/", meaning: "Number 2" },
        { word: "Three", transliteration: "Three", ipa: "/θriː/", meaning: "Number 3" },
        { word: "Four", transliteration: "Four", ipa: "/fɔːr/", meaning: "Number 4" },
        { word: "Five", transliteration: "Five", ipa: "/faɪv/", meaning: "Number 5" },
      ],
    },
  },
  hindi: {
    greetings: {
      name: "Greetings",
      nameNative: "अभिवादन",
      icon: "🙏",
      words: [
        { word: "नमस्ते", transliteration: "Namaste", ipa: "/nə.məs.teː/", meaning: "Hello / Greetings" },
        { word: "धन्यवाद", transliteration: "Dhanyavaad", ipa: "/d̪ʰən.jə.ʋɑːd̪/", meaning: "Thank you" },
        { word: "शुभ प्रभात", transliteration: "Shubh Prabhat", ipa: "/ʃʊbʰ prə.bʰɑːt̪/", meaning: "Good morning" },
        { word: "शुभ रात्रि", transliteration: "Shubh Ratri", ipa: "/ʃʊbʰ rɑːt̪.ri/", meaning: "Good night" },
        { word: "अलविदा", transliteration: "Alvida", ipa: "/əl.ʋi.d̪ɑː/", meaning: "Goodbye" },
        { word: "कृपया", transliteration: "Kripya", ipa: "/krɪp.jɑː/", meaning: "Please" },
        { word: "माफ कीजिए", transliteration: "Maaf Kijiye", ipa: "/mɑːf kiː.dʒi.eː/", meaning: "Excuse me / Sorry" },
        { word: "स्वागत है", transliteration: "Swaagat Hai", ipa: "/sʋɑː.gət̪ hɛː/", meaning: "Welcome" },
        { word: "कैसे हो", transliteration: "Kaise Ho", ipa: "/kɛː.seː hoː/", meaning: "How are you" },
        {
          word: "मिलकर खुशी हुई",
          transliteration: "Milkar Khushi Hui",
          ipa: "/mɪl.kər kʰʊ.ʃiː hʊ.iː/",
          meaning: "Nice to meet you",
        },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "संख्याएं",
      icon: "🔢",
      words: [
        { word: "एक", transliteration: "Ek", ipa: "/eːk/", meaning: "One" },
        { word: "दो", transliteration: "Do", ipa: "/d̪oː/", meaning: "Two" },
        { word: "तीन", transliteration: "Teen", ipa: "/t̪iːn/", meaning: "Three" },
        { word: "चार", transliteration: "Chaar", ipa: "/tʃɑːr/", meaning: "Four" },
        { word: "पांच", transliteration: "Paanch", ipa: "/pɑːntʃ/", meaning: "Five" },
        { word: "छह", transliteration: "Chhah", ipa: "/tʃʰəh/", meaning: "Six" },
        { word: "सात", transliteration: "Saat", ipa: "/sɑːt̪/", meaning: "Seven" },
        { word: "आठ", transliteration: "Aath", ipa: "/ɑːʈʰ/", meaning: "Eight" },
        { word: "नौ", transliteration: "Nau", ipa: "/nɔː/", meaning: "Nine" },
        { word: "दस", transliteration: "Das", ipa: "/d̪əs/", meaning: "Ten" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "परिवार",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "माँ", transliteration: "Maa", ipa: "/mɑː/", meaning: "Mother" },
        { word: "पिता", transliteration: "Pita", ipa: "/pɪ.t̪ɑː/", meaning: "Father" },
        { word: "भाई", transliteration: "Bhai", ipa: "/bʰɑːiː/", meaning: "Brother" },
        { word: "बहन", transliteration: "Behen", ipa: "/bə.hən/", meaning: "Sister" },
        { word: "दादा", transliteration: "Dada", ipa: "/d̪ɑː.d̪ɑː/", meaning: "Grandfather (paternal)" },
        { word: "दादी", transliteration: "Dadi", ipa: "/d̪ɑː.d̪iː/", meaning: "Grandmother (paternal)" },
        { word: "चाचा", transliteration: "Chacha", ipa: "/tʃɑː.tʃɑː/", meaning: "Uncle (father's brother)" },
        { word: "चाची", transliteration: "Chachi", ipa: "/tʃɑː.tʃiː/", meaning: "Aunt (uncle's wife)" },
        { word: "बेटा", transliteration: "Beta", ipa: "/beː.ʈɑː/", meaning: "Son" },
        { word: "बेटी", transliteration: "Beti", ipa: "/beː.ʈiː/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "खाना",
      icon: "🍛",
      words: [
        { word: "रोटी", transliteration: "Roti", ipa: "/roː.ʈiː/", meaning: "Flatbread" },
        { word: "चावल", transliteration: "Chawal", ipa: "/tʃɑː.ʋəl/", meaning: "Rice" },
        { word: "दाल", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "सब्जी", transliteration: "Sabzi", ipa: "/səb.ziː/", meaning: "Vegetable" },
        { word: "पानी", transliteration: "Paani", ipa: "/pɑː.niː/", meaning: "Water" },
        { word: "दूध", transliteration: "Doodh", ipa: "/d̪uːd̪ʰ/", meaning: "Milk" },
        { word: "चाय", transliteration: "Chai", ipa: "/tʃɑːj/", meaning: "Tea" },
        { word: "मिठाई", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.iː/", meaning: "Sweet" },
        { word: "फल", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "आलू", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "सामान्य शब्द",
      icon: "📖",
      words: [
        { word: "हाँ", transliteration: "Haan", ipa: "/hɑ̃ː/", meaning: "Yes" },
        { word: "नहीं", transliteration: "Nahin", ipa: "/nə.hĩː/", meaning: "No" },
        { word: "अच्छा", transliteration: "Achha", ipa: "/ət͡ʃ.tʃʰɑː/", meaning: "Good / Okay" },
        { word: "बुरा", transliteration: "Bura", ipa: "/bʊ.rɑː/", meaning: "Bad" },
        { word: "बड़ा", transliteration: "Bada", ipa: "/bə.ɽɑː/", meaning: "Big" },
        { word: "छोटा", transliteration: "Chhota", ipa: "/tʃʰoː.ʈɑː/", meaning: "Small" },
        { word: "यहाँ", transliteration: "Yahaan", ipa: "/jə.hɑ̃ː/", meaning: "Here" },
        { word: "वहाँ", transliteration: "Wahaan", ipa: "/ʋə.hɑ̃ː/", meaning: "There" },
        { word: "आज", transliteration: "Aaj", ipa: "/ɑːdʒ/", meaning: "Today" },
        { word: "कल", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  marathi: {
    greetings: {
      name: "Greetings",
      nameNative: "अभिवादन",
      icon: "🙏",
      words: [
        { word: "नमस्कार", transliteration: "Namaskar", ipa: "/nə.məs.kɑːr/", meaning: "Hello / Greetings" },
        { word: "धन्यवाद", transliteration: "Dhanyavaad", ipa: "/d̪ʰən.jə.ʋɑːd̪/", meaning: "Thank you" },
        { word: "शुभ सकाळ", transliteration: "Shubh Sakal", ipa: "/ʃʊbʰ sə.kɑːɭ/", meaning: "Good morning" },
        { word: "शुभ रात्री", transliteration: "Shubh Ratri", ipa: "/ʃʊbʰ rɑːt̪.riː/", meaning: "Good night" },
        { word: "निरोप", transliteration: "Nirop", ipa: "/ni.roːp/", meaning: "Goodbye" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "संख्यांशी",
      icon: "🔢",
      words: [
        { word: "एक", transliteration: "Ek", ipa: "/eːk/", meaning: "One" },
        { word: "दोन", transliteration: "Don", ipa: "/d̪oː.n/", meaning: "Two" },
        { word: "तीन", transliteration: "Teen", ipa: "/t̪iːn/", meaning: "Three" },
        { word: "चार", transliteration: "Chaar", ipa: "/tʃɑːr/", meaning: "Four" },
        { word: "पांच", transliteration: "Paanch", ipa: "/pɑːntʃ/", meaning: "Five" },
        { word: "छह", transliteration: "Chhah", ipa: "/tʃʰəh/", meaning: "Six" },
        { word: "सात", transliteration: "Saat", ipa: "/sɑːt̪/", meaning: "Seven" },
        { word: "आठ", transliteration: "Aath", ipa: "/ɑːʈʰ/", meaning: "Eight" },
        { word: "नौ", transliteration: "Nau", ipa: "/nɔː/", meaning: "Nine" },
        { word: "दहा", transliteration: "Daha", ipa: "/d̪ɑː.hɑː/", meaning: "Ten" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "परिवार",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "आई", transliteration: "Ai", ipa: "/ɑː.iː/", meaning: "Mother" },
        { word: "पिता", transliteration: "Pita", ipa: "/pɪ.t̪ɑː/", meaning: "Father" },
        { word: "भाई", transliteration: "Bhai", ipa: "/bʰɑːiː/", meaning: "Brother" },
        { word: "बहन", transliteration: "Behan", ipa: "/bə.hən/", meaning: "Sister" },
        { word: "दादा", transliteration: "Dada", ipa: "/d̪ɑː.d̪ɑː/", meaning: "Grandfather (paternal)" },
        { word: "दादी", transliteration: "Dadi", ipa: "/d̪ɑː.d̪iː/", meaning: "Grandmother (paternal)" },
        { word: "चाचा", transliteration: "Chacha", ipa: "/tʃɑː.tʃɑː/", meaning: "Uncle (father's brother)" },
        { word: "चाची", transliteration: "Chachi", ipa: "/tʃɑː.tʃiː/", meaning: "Aunt (uncle's wife)" },
        { word: "बेटा", transliteration: "Beta", ipa: "/beː.ʈɑː/", meaning: "Son" },
        { word: "बेटी", transliteration: "Beti", ipa: "/beː.ʈiː/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "खाना",
      icon: "🍛",
      words: [
        { word: "रोटी", transliteration: "Roti", ipa: "/roː.ʈiː/", meaning: "Flatbread" },
        { word: "चावल", transliteration: "Chawal", ipa: "/tʃɑː.ʋəl/", meaning: "Rice" },
        { word: "दाल", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "सब्जी", transliteration: "Sabzi", ipa: "/səb.ziː/", meaning: "Vegetable" },
        { word: "पानी", transliteration: "Paani", ipa: "/pɑː.niː/", meaning: "Water" },
        { word: "दूध", transliteration: "Doodh", ipa: "/d̪uːd̪ʰ/", meaning: "Milk" },
        { word: "चाय", transliteration: "Chai", ipa: "/tʃɑːj/", meaning: "Tea" },
        { word: "मिठाई", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.iː/", meaning: "Sweet" },
        { word: "फल", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "आलू", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "सामान्य शब्द",
      icon: "📖",
      words: [
        { word: "हाँ", transliteration: "Haan", ipa: "/hɑ̃ː/", meaning: "Yes" },
        { word: "नहीं", transliteration: "Nahin", ipa: "/nə.hĩː/", meaning: "No" },
        { word: "अच्छा", transliteration: "Achha", ipa: "/ət͡ʃ.tʃʰɑː/", meaning: "Good / Okay" },
        { word: "बुरा", transliteration: "Bura", ipa: "/bʊ.rɑː/", meaning: "Bad" },
        { word: "बड़ा", transliteration: "Bada", ipa: "/bə.ɽɑː/", meaning: "Big" },
        { word: "छोटा", transliteration: "Chhota", ipa: "/tʃʰoː.ʈɑː/", meaning: "Small" },
        { word: "यहाँ", transliteration: "Yahaan", ipa: "/jə.hɑ̃ː/", meaning: "Here" },
        { word: "वहाँ", transliteration: "Wahaan", ipa: "/ʋə.hɑ̃ː/", meaning: "There" },
        { word: "आज", transliteration: "Aaj", ipa: "/ɑːdʒ/", meaning: "Today" },
        { word: "कल", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  tamil: {
    greetings: {
      name: "Greetings",
      nameNative: "வணக்கங்கள்",
      icon: "🙏",
      words: [
        { word: "வணக்கம்", transliteration: "Vanakkam", ipa: "/ʋə.ɳək.kəm/", meaning: "Hello / Greetings" },
        { word: "நன்றி", transliteration: "Nandri", ipa: "/nən.d̪ri/", meaning: "Thank you" },
        { word: "காலை வணக்கம்", transliteration: "Kaalai Vanakkam", ipa: "/kɑː.lɛː ʋə.ɳək.kəm/", meaning: "Good morning" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "எண்கள்",
      icon: "🔢",
      words: [
        { word: "ஒன்று", transliteration: "Onru", ipa: "/oːn.ɾu/", meaning: "One" },
        { word: "இரண்டு", transliteration: "Iranda", ipa: "/iːɾɑːnd̪u/", meaning: "Two" },
        { word: "மூன்று", transliteration: "Moondru", ipa: "/m̪uːn.ɾu/", meaning: "Three" },
        { word: "நான்கு", transliteration: "Naanku", ipa: "/nɑːn.ku/", meaning: "Four" },
        { word: "ஐம்பது", transliteration: "Aimpadu", ipa: "/ɑːi.m̪pət̪u/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "குடும்பம்",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "அம்மா", transliteration: "Amma", ipa: "/ɑːm.ma/", meaning: "Mother" },
        { word: "பேப்பா", transliteration: "Pappa", ipa: "/pɛp.pɑː/", meaning: "Father" },
        { word: "அண்ணன்", transliteration: "Anna", ipa: "/ɑːn.nə/", meaning: "Brother" },
        { word: "அண்ணி", transliteration: "Anni", ipa: "/ɑːn.ni/", meaning: "Sister" },
        {
          word: "பெற்றாக்காரி",
          transliteration: "Perthaakkaari",
          ipa: "/pɛɾ.t̪ɑː.kaːɾi/",
          meaning: "Grandfather (paternal)",
        },
        { word: "பெற்றாக்கீ", transliteration: "Perthaakki", ipa: "/pɛɾ.t̪ɑː.ki/", meaning: "Grandmother (paternal)" },
        { word: "வாடகாரி", transliteration: "Vaadakkaari", ipa: "/ʋɑː.d̪ɑː.kaːɾi/", meaning: "Uncle (father's brother)" },
        { word: "வாடகீ", transliteration: "Vaadakki", ipa: "/ʋɑː.d̪ɑː.ki/", meaning: "Aunt (uncle's wife)" },
        { word: "ஒன்று", transliteration: "Onru", ipa: "/oːn.ɾu/", meaning: "Son" },
        { word: "பொன்று", transliteration: "Ponru", ipa: "/pə.nɾu/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "நாவல்",
      icon: "🍛",
      words: [
        { word: "பருப்பு", transliteration: "Paruppu", ipa: "/paɾ.uːp̪pu/", meaning: "Flatbread" },
        { word: "அரிசி", transliteration: "Arisi", ipa: "/ɑːɾi.ʃi/", meaning: "Rice" },
        { word: "வெட்டை", transliteration: "Vettai", ipa: "/ʋɛt̪.t̪ɑː.i/", meaning: "Lentils" },
        { word: "வெற்றி", transliteration: "Vettai", ipa: "/ʋɛt̪.t̪ɑː.i/", meaning: "Vegetable" },
        { word: "நீர்", transliteration: "Neer", ipa: "/nɪːr/", meaning: "Water" },
        { word: "வேத்தி", transliteration: "Vetti", ipa: "/vɛt̪.t̪i/", meaning: "Milk" },
        { word: "தேங்காய்", transliteration: "Thengai", ipa: "/tɛŋ.kɑːy/", meaning: "Tea" },
        { word: "வணிக்காய்", transliteration: "Vannikkai", ipa: "/vɑː.ni.kkɑːy/", meaning: "Sweet" },
        { word: "பழையம்", transliteration: "Pazhayam", ipa: "/pɑːz.hɑːjəm/", meaning: "Fruit" },
        { word: "உருளை", transliteration: "Uralai", ipa: "/uːɾuː.lɑː.i/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "பொது சொற்றுக்கள்",
      icon: "📖",
      words: [
        { word: "ஆம்", transliteration: "Aam", ipa: "/ɑːm/", meaning: "Yes" },
        { word: "இல்லை", transliteration: "Illai", ipa: "/iːl.lɑːi/", meaning: "No" },
        { word: "வரும்", transliteration: "Varam", ipa: "/ʋɑːɾ.um/", meaning: "Good / Okay" },
        { word: "கூடும்", transliteration: "Koodum", ipa: "/kʊːd̪um/", meaning: "Bad" },
        { word: "பெரும்", transliteration: "Perum", ipa: "/pɛɾ.um/", meaning: "Big" },
        { word: "சிறும்", transliteration: "Sirum", ipa: "/ʃɪɾ.um/", meaning: "Small" },
        { word: "இங்கு", transliteration: "Ingku", ipa: "/iːŋ.ku/", meaning: "Here" },
        { word: "அங்கு", transliteration: "Angku", ipa: "/ɑːŋ.ku/", meaning: "There" },
        { word: "இன்று", transliteration: "Intru", ipa: "/iːn.tru/", meaning: "Today" },
        { word: "நாளை", transliteration: "Naalai", ipa: "/nɑː.lɛː/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  telugu: {
    greetings: {
      name: "Greetings",
      nameNative: "అభివందనాలు",
      icon: "🙏",
      words: [
        { word: "నమస్కారం", transliteration: "Namaskaram", ipa: "/nə.məs.kɑː.rəm/", meaning: "Hello / Greetings" },
        { word: "ధన్యవాదాలు", transliteration: "Dhanyavaadaalu", ipa: "/d̪ʰən.jə.ʋɑː.d̪ɑː.lu/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "సంఖ్యలు",
      icon: "🔢",
      words: [
        { word: "ఒకటి", transliteration: "Okati", ipa: "/oːkaːti/", meaning: "One" },
        { word: "రెండు", transliteration: "Rendu", ipa: "/ɾɛːnd̪u/", meaning: "Two" },
        { word: "మూడు", transliteration: "Moodu", ipa: "/m̪uːd̪u/", meaning: "Three" },
        { word: "నాలు", transliteration: "Naalu", ipa: "/nɑːlu/", meaning: "Four" },
        { word: "పాంకు", transliteration: "Paanku", ipa: "/pɑːŋ.ku/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "పేర్ముగి",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "మామా", transliteration: "Maama", ipa: "/mɑː.maː/", meaning: "Mother" },
        { word: "పేపా", transliteration: "Peepa", ipa: "/pɛː.pɑː/", meaning: "Father" },
        { word: "బుడ్డి", transliteration: "Buddi", ipa: "/b̪uːd̪.di/", meaning: "Brother" },
        { word: "బ్యాడీ", transliteration: "Byadi", ipa: "/b̪jɑː.di/", meaning: "Sister" },
        { word: "పెరుగురి", transliteration: "Peruguri", ipa: "/pɛɾ.uːɡʊɾi/", meaning: "Grandfather (paternal)" },
        { word: "పెరుగీ", transliteration: "Perugii", ipa: "/pɛɾ.uːɡiː/", meaning: "Grandmother (paternal)" },
        { word: "వాడకారి", transliteration: "Vaadakaari", ipa: "/ʋɑː.d̪ɑː.kɑːɾi/", meaning: "Uncle (father's brother)" },
        { word: "వాడకి", transliteration: "Vaadaki", ipa: "/ʋɑː.d̪ɑː.ki/", meaning: "Aunt (uncle's wife)" },
        { word: "బాలు", transliteration: "Baalu", ipa: "/bɑː.lu/", meaning: "Son" },
        { word: "బాలి", transliteration: "Baali", ipa: "/bɑː.li/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "భాషా",
      icon: "🍛",
      words: [
        { word: "బాయిత్తి", transliteration: "Baayittu", ipa: "/bɑː.ji.t̪ti/", meaning: "Flatbread" },
        { word: "ప్రశాంతు", transliteration: "Prasantu", ipa: "/praː.saːnt̪u/", meaning: "Rice" },
        { word: "పొండి", transliteration: "Pondi", ipa: "/pɔːnd̪i/", meaning: "Lentils" },
        { word: "వెడ్డి", transliteration: "Veddi", ipa: "/ʋɛd̪.di/", meaning: "Vegetable" },
        { word: "నీరు", transliteration: "Neeru", ipa: "/nɪːr.u/", meaning: "Water" },
        { word: "ప్రధాని", transliteration: "Pradhaani", ipa: "/praː.d̪ɑː.ni/", meaning: "Milk" },
        { word: "చేయ", transliteration: "Chey", ipa: "/tʃɛj/", meaning: "Tea" },
        { word: "మీది", transliteration: "Meedi", ipa: "/mɪː.di/", meaning: "Sweet" },
        { word: "ప్రముఖం", transliteration: "Pramukham", ipa: "/praː.mʊkʰəm/", meaning: "Fruit" },
        { word: "అలుంటు", transliteration: "Aluntu", ipa: "/ɑː.luː.n̪tu/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "ప్రముఖ చేత్తులు",
      icon: "📖",
      words: [
        { word: "అవును", transliteration: "Avunu", ipa: "/ɑː.vuː.n̪u/", meaning: "Yes" },
        { word: "కాదు", transliteration: "Kaadu", ipa: "/kɑː.d̪u/", meaning: "No" },
        { word: "చూటు", transliteration: "Chootu", ipa: "/tʃʊː.t̪u/", meaning: "Good / Okay" },
        { word: "బాధ్యం", transliteration: "Baadhyaam", ipa: "/b̪ɑː.d̪ʰ.jɑːm/", meaning: "Bad" },
        { word: "పెద్దం", transliteration: "Peddam", ipa: "/pɛd̪.d̪ɑːm/", meaning: "Big" },
        { word: "చిన్నం", transliteration: "Chinnaam", ipa: "/tʃɪn.nɑːm/", meaning: "Small" },
        { word: "కేసు", transliteration: "Kesu", ipa: "/kɛː.su/", meaning: "Here" },
        { word: "కూడి", transliteration: "Koodi", ipa: "/kʊː.di/", meaning: "There" },
        { word: "నేడు", transliteration: "Needu", ipa: "/nɛː.d̪u/", meaning: "Today" },
        { word: "రోజు", transliteration: "Rozu", ipa: "/ɾoː.zu/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  kannada: {
    greetings: {
      name: "Greetings",
      nameNative: "ಅಭಿನಂದನೆಗಳು",
      icon: "🙏",
      words: [
        { word: "ನಮಸ್ಕಾರ", transliteration: "Namaskara", ipa: "/nə.məs.kɑː.rə/", meaning: "Hello / Greetings" },
        { word: "ಧನ್ಯವಾದಗಳು", transliteration: "Dhanyavaadagalu", ipa: "/d̪ʰən.jə.ʋɑː.d̪ə.gə.lu/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "ಅಂಕೆಗಳು",
      icon: "🔢",
      words: [
        { word: "ಒಂದು", transliteration: "Ondu", ipa: "/oːnd̪u/", meaning: "One" },
        { word: "ಎರಡು", transliteration: "Eradu", ipa: "/eːɾɑː.d̪u/", meaning: "Two" },
        { word: "ಮೂರು", transliteration: "Mooru", ipa: "/m̪uːɾu/", meaning: "Three" },
        { word: "ನಾಲು", transliteration: "Naalu", ipa: "/nɑːlu/", meaning: "Four" },
        { word: "ಐದು", transliteration: "Aidu", ipa: "/ɑː.iː.d̪u/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "ಕುಟ್ಟಿ ಸ್ಥಳ",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "amma", transliteration: "Amma", ipa: "/ɑːm.ma/", meaning: "Mother" },
        { word: "bapa", transliteration: "Bapa", ipa: "/bɑː.pa/", meaning: "Father" },
        { word: "bandhu", transliteration: "Bandhu", ipa: "/bɑːnd̪hu/", meaning: "Brother" },
        { word: "sister", transliteration: "Sister", ipa: "/siː.ɾɪs.t̪ər/", meaning: "Sister" },
        { word: "mama", transliteration: "Mama", ipa: "/mɑː.ma/", meaning: "Grandfather (paternal)" },
        { word: "amma", transliteration: "Amma", ipa: "/ɑːm.ma/", meaning: "Grandmother (paternal)" },
        { word: "chacha", transliteration: "Chacha", ipa: "/tʃɑː.ça/", meaning: "Uncle (father's brother)" },
        { word: "chachi", transliteration: "Chachi", ipa: "/tʃɑː.çi/", meaning: "Aunt (uncle's wife)" },
        { word: "betta", transliteration: "Betta", ipa: "/beː.t̪ɑː/", meaning: "Son" },
        { word: "betty", transliteration: "Betty", ipa: "/beː.t̪i/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "ಭಾಷಾ",
      icon: "🍛",
      words: [
        { word: "roti", transliteration: "Roti", ipa: "/roː.ʈi/", meaning: "Flatbread" },
        { word: "chawal", transliteration: "Chawal", ipa: "/tʃɑː.wəl/", meaning: "Rice" },
        { word: "daal", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "sabzi", transliteration: "Sabzi", ipa: "/səb.zi/", meaning: "Vegetable" },
        { word: "paani", transliteration: "Paani", ipa: "/pɑː.ni/", meaning: "Water" },
        { word: "doodh", transliteration: "Doodh", ipa: "/d̪uːd̪/", meaning: "Milk" },
        { word: "chai", transliteration: "Chai", ipa: "/tʃɑː.i/", meaning: "Tea" },
        { word: "mithai", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.i/", meaning: "Sweet" },
        { word: "phal", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "aloo", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "ಸಾಮಾನ್ಯ ಶಬ್ದಗಳು",
      icon: "📖",
      words: [
        { word: "haan", transliteration: "Haan", ipa: "/hɑː.n/", meaning: "Yes" },
        { word: "nahin", transliteration: "Nahin", ipa: "/nə.hɪn/", meaning: "No" },
        { word: "achha", transliteration: "Achha", ipa: "/ət͡ʃ.tʃʰɑː/", meaning: "Good / Okay" },
        { word: "bura", transliteration: "Bura", ipa: "/bʊ.rɑː/", meaning: "Bad" },
        { word: "bada", transliteration: "Bada", ipa: "/bə.ɾɑː/", meaning: "Big" },
        { word: "chhota", transliteration: "Chhota", ipa: "/tʃʰoː.ɾɑː/", meaning: "Small" },
        { word: "yahaan", transliteration: "Yahaan", ipa: "/jə.hɑː.n/", meaning: "Here" },
        { word: "wahaan", transliteration: "Wahaan", ipa: "/ʋə.hɑː.n/", meaning: "There" },
        { word: "aaj", transliteration: "Aaj", ipa: "/ɑː.dʒ/", meaning: "Today" },
        { word: "kal", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  malayalam: {
    greetings: {
      name: "Greetings",
      nameNative: "അഭിവാദനങ്ങൾ",
      icon: "🙏",
      words: [
        { word: "നമസ്കാരം", transliteration: "Namaskaram", ipa: "/nə.məs.kɑː.rəm/", meaning: "Hello / Greetings" },
        { word: "നന്ദി", transliteration: "Nandi", ipa: "/nən.d̪i/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "അക്കങ്ങൾ",
      icon: "🔢",
      words: [
        { word: "ഒന്ന്", transliteration: "Onnu", ipa: "/oːn.n/", meaning: "One" },
        { word: "രണ്ട്", transliteration: "Rendu", ipa: "/ɾɛːnd̪u/", meaning: "Two" },
        { word: "മൂന്ന്", transliteration: "Moonnu", ipa: "/m̪uːn.n/", meaning: "Three" },
        { word: "നാല്", transliteration: "Naalu", ipa: "/nɑː.l/", meaning: "Four" },
        { word: "അഞ്ച്", transliteration: "Anchu", ipa: "/ɑːŋ.tʃ/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "കുട്ടികളുടെ സ്ഥലം",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "amma", transliteration: "Amma", ipa: "/ɑːm.ma/", meaning: "Mother" },
        { word: "bapa", transliteration: "Bapa", ipa: "/bɑː.pa/", meaning: "Father" },
        { word: "bandhu", transliteration: "Bandhu", ipa: "/bɑːnd̪hu/", meaning: "Brother" },
        { word: "sister", transliteration: "Sister", ipa: "/siː.ɾɪs.t̪ər/", meaning: "Sister" },
        { word: "mama", transliteration: "Mama", ipa: "/mɑː.ma/", meaning: "Grandfather (paternal)" },
        { word: "amma", transliteration: "Amma", ipa: "/ɑːm.ma/", meaning: "Grandmother (paternal)" },
        { word: "chacha", transliteration: "Chacha", ipa: "/tʃɑː.ça/", meaning: "Uncle (father's brother)" },
        { word: "chachi", transliteration: "Chachi", ipa: "/tʃɑː.çi/", meaning: "Aunt (uncle's wife)" },
        { word: "betta", transliteration: "Betta", ipa: "/beː.t̪ɑː/", meaning: "Son" },
        { word: "betty", transliteration: "Betty", ipa: "/beː.t̪i/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "ഭാഷാ",
      icon: "🍛",
      words: [
        { word: "roti", transliteration: "Roti", ipa: "/roː.ʈi/", meaning: "Flatbread" },
        { word: "chawal", transliteration: "Chawal", ipa: "/tʃɑː.wəl/", meaning: "Rice" },
        { word: "daal", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "sabzi", transliteration: "Sabzi", ipa: "/səb.zi/", meaning: "Vegetable" },
        { word: "paani", transliteration: "Paani", ipa: "/pɑː.ni/", meaning: "Water" },
        { word: "doodh", transliteration: "Doodh", ipa: "/d̪uːd̪/", meaning: "Milk" },
        { word: "chai", transliteration: "Chai", ipa: "/tʃɑː.i/", meaning: "Tea" },
        { word: "mithai", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.i/", meaning: "Sweet" },
        { word: "phal", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "aloo", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "സാമാന്യ ശൊക്കൾ",
      icon: "📖",
      words: [
        { word: "haan", transliteration: "Haan", ipa: "/hɑː.n/", meaning: "Yes" },
        { word: "nahin", transliteration: "Nahin", ipa: "/nə.hɪn/", meaning: "No" },
        { word: "achha", transliteration: "Achha", ipa: "/ət͡ʃ.tʃʰɑː/", meaning: "Good / Okay" },
        { word: "bura", transliteration: "Bura", ipa: "/bʊ.rɑː/", meaning: "Bad" },
        { word: "bada", transliteration: "Bada", ipa: "/bə.ɾɑː/", meaning: "Big" },
        { word: "chhota", transliteration: "Chhota", ipa: "/tʃʰoː.ɾɑː/", meaning: "Small" },
        { word: "yahaan", transliteration: "Yahaan", ipa: "/jə.hɑː.n/", meaning: "Here" },
        { word: "wahaan", transliteration: "Wahaan", ipa: "/ʋə.hɑː.n/", meaning: "There" },
        { word: "aaj", transliteration: "Aaj", ipa: "/ɑː.dʒ/", meaning: "Today" },
        { word: "kal", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  gujarati: {
    greetings: {
      name: "Greetings",
      nameNative: "અભિવાદન",
      icon: "🙏",
      words: [
        { word: "નમસ્તે", transliteration: "Namaste", ipa: "/nə.məs.t̪eː/", meaning: "Hello / Greetings" },
        { word: "આભાર", transliteration: "Aabhar", ipa: "/ɑː.bʰɑːr/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "સંખ્યાઓ",
      icon: "🔢",
      words: [
        { word: "એક", transliteration: "Ek", ipa: "/eːk/", meaning: "One" },
        { word: "દુની", transliteration: "Duni", ipa: "/d̪uː.ni/", meaning: "Two" },
        { word: "ત્રણ", transliteration: "Tran", ipa: "/t̪rɑː.n/", meaning: "Three" },
        { word: "ચાર", transliteration: "Chaar", ipa: "/tʃɑːr/", meaning: "Four" },
        { word: "પાંચ", transliteration: "Paanch", ipa: "/pɑːntʃ/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "કાર્યકલાક",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "માં", transliteration: "Maa", ipa: "/mɑː/", meaning: "Mother" },
        { word: "પિતા", transliteration: "Pita", ipa: "/pɪ.t̪ɑː/", meaning: "Father" },
        { word: "ભાઈ", transliteration: "Bhai", ipa: "/bʰɑːiː/", meaning: "Brother" },
        { word: "બહેન", transliteration: "Behen", ipa: "/bə.hɛːn/", meaning: "Sister" },
        { word: "દાદા", transliteration: "Dada", ipa: "/d̪ɑː.d̪ɑː/", meaning: "Grandfather (paternal)" },
        { word: "દાદી", transliteration: "Dadi", ipa: "/d̪ɑː.d̪iː/", meaning: "Grandmother (paternal)" },
        { word: "ચાચા", transliteration: "Chacha", ipa: "/tʃɑː.ça/", meaning: "Uncle (father's brother)" },
        { word: "ચાચી", transliteration: "Chachi", ipa: "/tʃɑː.çi/", meaning: "Aunt (uncle's wife)" },
        { word: "બેટા", transliteration: "Beta", ipa: "/beː.ʈɑː/", meaning: "Son" },
        { word: "બેટી", transliteration: "Beti", ipa: "/beː.ʈiː/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "ભાષા",
      icon: "🍛",
      words: [
        { word: "રોટી", transliteration: "Roti", ipa: "/roː.ʈi/", meaning: "Flatbread" },
        { word: "ચાવલ", transliteration: "Chawal", ipa: "/tʃɑː.wəl/", meaning: "Rice" },
        { word: "દાલ", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "સબ્જી", transliteration: "Sabzi", ipa: "/səb.zi/", meaning: "Vegetable" },
        { word: "પાની", transliteration: "Paani", ipa: "/pɑː.ni/", meaning: "Water" },
        { word: "દૂધ", transliteration: "Doodh", ipa: "/d̪uːd̪/", meaning: "Milk" },
        { word: "ચાય", transliteration: "Chai", ipa: "/tʃɑː.i/", meaning: "Tea" },
        { word: "મિઠાઈ", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.i/", meaning: "Sweet" },
        { word: "ફળ", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "અલૂ", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "સામાન્ય શબ્દો",
      icon: "📖",
      words: [
        { word: "હાં", transliteration: "Haan", ipa: "/hɑː.n/", meaning: "Yes" },
        { word: "નાનો", transliteration: "Nanu", ipa: "/nɑː.nu/", meaning: "No" },
        { word: "અચ્છો", transliteration: "Achho", ipa: "/ət͡ʃ.tʃʰo/", meaning: "Good / Okay" },
        { word: "બદો", transliteration: "Bado", ipa: "/bʊ.d̪o/", meaning: "Bad" },
        { word: "બદા", transliteration: "Bada", ipa: "/bə.d̪ɑː/", meaning: "Big" },
        { word: "ચાલો", transliteration: "Chalo", ipa: "/tʃʰɑː.lo/", meaning: "Small" },
        { word: "યાં", transliteration: "Yaam", ipa: "/jə.ɑːm/", meaning: "Here" },
        { word: "વાં", transliteration: "Vaam", ipa: "/ʋə.ɑːm/", meaning: "There" },
        { word: "આજ", transliteration: "Aaj", ipa: "/ɑː.dʒ/", meaning: "Today" },
        { word: "કાલ", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  bengali: {
    greetings: {
      name: "Greetings",
      nameNative: "অভিবাদন",
      icon: "🙏",
      words: [
        { word: "নমস্কার", transliteration: "Nomoshkar", ipa: "/no.moʃ.kɑr/", meaning: "Hello / Greetings" },
        { word: "ধন্যবাদ", transliteration: "Dhonnobad", ipa: "/d̪ʰon.no.bɑd̪/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "সংখ্যা",
      icon: "🔢",
      words: [
        { word: "এক", transliteration: "Ek", ipa: "/eːk/", meaning: "One" },
        { word: "দুই", transliteration: "Dui", ipa: "/d̪uːi/", meaning: "Two" },
        { word: "তিন", transliteration: "Tin", ipa: "/t̪iːn/", meaning: "Three" },
        { word: "চার", transliteration: "Chaar", ipa: "/tʃɑːr/", meaning: "Four" },
        { word: "পাঁচ", transliteration: "Paanch", ipa: "/pɑːntʃ/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "পরিবার",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "মা", transliteration: "Ma", ipa: "/mɑː/", meaning: "Mother" },
        { word: "বাবা", transliteration: "Baba", ipa: "/bɑː.ba/", meaning: "Father" },
        { word: "ভাই", transliteration: "Bhai", ipa: "/bʰɑːi/", meaning: "Brother" },
        { word: "বীবা", transliteration: "Beeba", ipa: "/bɪː.bɑː/", meaning: "Sister" },
        { word: "দাদা", transliteration: "Dada", ipa: "/d̪ɑː.d̪ɑː/", meaning: "Grandfather (paternal)" },
        { word: "দাদী", transliteration: "Dadi", ipa: "/d̪ɑː.d̪i/", meaning: "Grandmother (paternal)" },
        { word: "চাচা", transliteration: "Chacha", ipa: "/tʃɑː.ça/", meaning: "Uncle (father's brother)" },
        { word: "চাচী", transliteration: "Chachi", ipa: "/tʃɑː.çi/", meaning: "Aunt (uncle's wife)" },
        { word: "সন", transliteration: "Son", ipa: "/sɑːn/", meaning: "Son" },
        { word: "সন্তী", transliteration: "Sonti", ipa: "/sɑːn.t̪i/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "খানা",
      icon: "🍛",
      words: [
        { word: "রোটি", transliteration: "Roti", ipa: "/roː.ʈi/", meaning: "Flatbread" },
        { word: "চাওল", transliteration: "Chawal", ipa: "/tʃɑː.wəl/", meaning: "Rice" },
        { word: "ডাল", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "সবজি", transliteration: "Sabzi", ipa: "/səb.zi/", meaning: "Vegetable" },
        { word: "পানি", transliteration: "Paani", ipa: "/pɑː.ni/", meaning: "Water" },
        { word: "দুধ", transliteration: "Doodh", ipa: "/d̪uːd̪/", meaning: "Milk" },
        { word: "চায়", transliteration: "Chai", ipa: "/tʃɑː.i/", meaning: "Tea" },
        { word: "মিঠাই", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.i/", meaning: "Sweet" },
        { word: "ফল", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "আলু", transliteration: "Aloo", ipa: "/ɑː.lu/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "সামান্য শব্দ",
      icon: "📖",
      words: [
        { word: "হ্যাঁ", transliteration: "Haan", ipa: "/hɑː.n/", meaning: "Yes" },
        { word: "না", transliteration: "Na", ipa: "/nɑː/", meaning: "No" },
        { word: "ভালো", transliteration: "Bhalo", ipa: "/bʱɑː.lo/", meaning: "Good / Okay" },
        { word: "বাই", transliteration: "Bai", ipa: "/bɑː.i/", meaning: "Bad" },
        { word: "বড়", transliteration: "Bor", ipa: "/bɔːr/", meaning: "Big" },
        { word: "ছোট", transliteration: "Chhot", ipa: "/tʃʰoːt/", meaning: "Small" },
        { word: "এখানে", transliteration: "Ekhane", ipa: "/ɛkʰɑː.nɛ/", meaning: "Here" },
        { word: "তাঁছে", transliteration: "Taanchhe", ipa: "/t̪ɑː.n̪ʃe/", meaning: "There" },
        { word: "আজ", transliteration: "Aaj", ipa: "/ɑːdʒ/", meaning: "Today" },
        { word: "কল", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
  punjabi: {
    greetings: {
      name: "Greetings",
      nameNative: "ਸ਼ੁਭਕਾਮਨਾਵਾਂ",
      icon: "🙏",
      words: [
        {
          word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
          transliteration: "Sat Sri Akal",
          ipa: "/sət̪ ʃriː ə.kɑːl/",
          meaning: "Hello / Greetings (Sikh)",
        },
        { word: "ਧੰਨਵਾਦ", transliteration: "Dhannvaad", ipa: "/d̪ʰən.ʋɑːd̪/", meaning: "Thank you" },
      ],
    },
    numbers: {
      name: "Numbers",
      nameNative: "ਨੂੰ",
      icon: "🔢",
      words: [
        { word: "ਇੱਕ", transliteration: "Ik", ipa: "/iːk/", meaning: "One" },
        { word: "ਦੋਨ", transliteration: "Don", ipa: "/d̪oː.n/", meaning: "Two" },
        { word: "ਤੀਨ", transliteration: "Teen", ipa: "/t̪iːn/", meaning: "Three" },
        { word: "ਚਾਰ", transliteration: "Chaar", ipa: "/tʃɑːr/", meaning: "Four" },
        { word: "ਪੰਚ", transliteration: "Panch", ipa: "/pɑːntʃ/", meaning: "Five" },
      ],
    },
    family: {
      name: "Family",
      nameNative: "ਪਰਿਵਾਰ",
      icon: "👨‍👩‍👧‍👦",
      words: [
        { word: "ਮਾਮਾ", transliteration: "Maama", ipa: "/mɑː.maː/", meaning: "Mother" },
        { word: "ਪਿਆਰਾ", transliteration: "Piaara", ipa: "/pɪ.ɑː.ɾɑː/", meaning: "Father" },
        { word: "ਭਾਈ", transliteration: "Bhai", ipa: "/bʰɑːiː/", meaning: "Brother" },
        { word: "ਬੱਹਣ", transliteration: "Behan", ipa: "/bə.hən/", meaning: "Sister" },
        { word: "ਦਾਦਾ", transliteration: "Dada", ipa: "/d̪ɑː.d̪ɑː/", meaning: "Grandfather (paternal)" },
        { word: "ਦਾਦੀ", transliteration: "Dadi", ipa: "/d̪ɑː.d̪iː/", meaning: "Grandmother (paternal)" },
        { word: "ਚਾਚਾ", transliteration: "Chacha", ipa: "/tʃɑː.ça/", meaning: "Uncle (father's brother)" },
        { word: "ਚਾਚੀ", transliteration: "Chachi", ipa: "/tʃɑː.çi/", meaning: "Aunt (uncle's wife)" },
        { word: "ਬੱਟਾ", transliteration: "Betta", ipa: "/beː.t̪ɑː/", meaning: "Son" },
        { word: "ਬੱਟੀ", transliteration: "Betti", ipa: "/beː.t̪i/", meaning: "Daughter" },
      ],
    },
    food: {
      name: "Food",
      nameNative: "ਖਾਨਾ",
      icon: "🍛",
      words: [
        { word: "ਰੋਟੀ", transliteration: "Roti", ipa: "/roː.ʈi/", meaning: "Flatbread" },
        { word: "ਚਾਵਲ", transliteration: "Chawal", ipa: "/tʃɑː.wəl/", meaning: "Rice" },
        { word: "ਦਾਲ", transliteration: "Daal", ipa: "/d̪ɑːl/", meaning: "Lentils" },
        { word: "ਸਬਜੀ", transliteration: "Sabzi", ipa: "/səb.zi/", meaning: "Vegetable" },
        { word: "ਪਾਨੀ", transliteration: "Paani", ipa: "/pɑː.ni/", meaning: "Water" },
        { word: "ਦੂਧ", transliteration: "Doodh", ipa: "/d̪uːd̪/", meaning: "Milk" },
        { word: "ਚਾਈ", transliteration: "Chai", ipa: "/tʃɑː.i/", meaning: "Tea" },
        { word: "ਮਿਠਾਈ", transliteration: "Mithai", ipa: "/mɪ.ʈʰɑː.i/", meaning: "Sweet" },
        { word: "ਫਲ", transliteration: "Phal", ipa: "/pʰəl/", meaning: "Fruit" },
        { word: "ਆਲੂ", transliteration: "Aloo", ipa: "/ɑː.luː/", meaning: "Potato" },
      ],
    },
    common: {
      name: "Common Words",
      nameNative: "ਸਾਮਾਨ੍ਯ ਸ਼ਬਦ",
      icon: "📖",
      words: [
        { word: "ਹੈਂ", transliteration: "Haan", ipa: "/hɑː.n/", meaning: "Yes" },
        { word: "ਨਹੀਂ", transliteration: "Nahin", ipa: "/nə.hɪn/", meaning: "No" },
        { word: "ਅਚਾਣਾ", transliteration: "Achhaana", ipa: "/ət͡ʃ.tʃʰɑː.n̪ɑː/", meaning: "Good / Okay" },
        { word: "ਬੱਦੋ", transliteration: "Badoo", ipa: "/bə.d̪o/", meaning: "Bad" },
        { word: "ਬਾਡੋ", transliteration: "Baadoo", ipa: "/bɑː.d̪o/", meaning: "Big" },
        { word: "ਚੱਲੋ", transliteration: "Challo", ipa: "/tʃʰɑː.lo/", meaning: "Small" },
        { word: "ਇੱਕਾਂਦੇ", transliteration: "Ekhane", ipa: "/ɛkʰɑː.nɛ/", meaning: "Here" },
        { word: "ਵਾਂਦੇ", transliteration: "Vaande", ipa: "/ʋə.n̪de/", meaning: "There" },
        { word: "ਇੱਕਾਂ", transliteration: "Aaj", ipa: "/ɑːdʒ/", meaning: "Today" },
        { word: "ਕਾਲ", transliteration: "Kal", ipa: "/kəl/", meaning: "Tomorrow / Yesterday" },
      ],
    },
  },
}

// Challenge words by difficulty
const CHALLENGE_WORDS = {
  english: {
    easy: [
      { word: "Hello", phonetic: "/həˈloʊ/", meaning: "A greeting" },
      { word: "Thank you", phonetic: "/θæŋk juː/", meaning: "Expression of gratitude" },
      { word: "Yes", phonetic: "/jɛs/", meaning: "Affirmative" },
      { word: "No", phonetic: "/noʊ/", meaning: "Negative" },
      { word: "Good", phonetic: "/ɡʊd/", meaning: "Positive quality" },
    ],
    medium: [
      { word: "Welcome", phonetic: "/ˈwɛlkəm/", meaning: "Greeting for arrival" },
      { word: "Nice to meet you", phonetic: "/naɪs tuː miːt juː/", meaning: "Polite greeting" },
      { word: "Excuse me", phonetic: "/ɪkˈskjuːz miː/", meaning: "Polite interruption" },
    ],
    hard: [
      { word: "Congratulations", phonetic: "/k��nˌɡrætʃəˈleɪʃənz/", meaning: "Expression of praise" },
      { word: "Thank you very much", phonetic: "/θæŋk juː ˈvɛri mʌtʃ/", meaning: "Strong gratitude" },
    ],
  },
  hindi: {
    easy: [
      { word: "नमस्ते", phonetic: "/nə.məs.teː/", meaning: "Hello" },
      { word: "धन्यवाद", phonetic: "/d̪ʰən.jə.ʋɑːd̪/", meaning: "Thank you" },
      { word: "हाँ", phonetic: "/hɑ̃ː/", meaning: "Yes" },
      { word: "नहीं", phonetic: "/nə.hĩː/", meaning: "No" },
      { word: "अच्छा", phonetic: "/ət͡ʃ.tʃʰɑː/", meaning: "Good" },
    ],
    medium: [
      { word: "स्वागत है", phonetic: "/sʋɑː.gət̪ hɛː/", meaning: "Welcome" },
      { word: "मिलकर खुशी हुई", phonetic: "/mɪl.kər kʰʊ.ʃiː hʊ.iː/", meaning: "Nice to meet you" },
      { word: "माफ कीजिए", phonetic: "/mɑːf kiː.dʒi.eː/", meaning: "Sorry" },
    ],
    hard: [
      { word: "शुभकामनाएं", phonetic: "/ʃʊbʰ.kɑː.mə.nɑː.ẽː/", meaning: "Best wishes" },
      { word: "धन्यवाद बहुत बहुत", phonetic: "/d̪ʰən.jə.ʋɑːd̪ bə.hʊt̪ bə.hʊt̪/", meaning: "Thank you very much" },
    ],
  },
  marathi: {
    easy: [
      { word: "नमस्कार", phonetic: "/nə.məs.kɑːr/", meaning: "Hello" },
      { word: "धन्यवाद", phonetic: "/d̪ʰən.jə.ʋɑːd̪/", meaning: "Thank you" },
      { word: "हाँ", phonetic: "/hɑ̃ː/", meaning: "Yes" },
      { word: "नहीं", phonetic: "/nə.hĩː/", meaning: "No" },
      { word: "अच्छा", phonetic: "/ət͡ʃ.tʃʰɑː/", meaning: "Good" },
    ],
    medium: [
      { word: "स्वागत है", phonetic: "/sʋɑː.gət̪ hɛː/", meaning: "Welcome" },
      { word: "मिलकर खुशी हुई", phonetic: "/mɪl.kər kʰʊ.ʃiː hʊ.iː/", meaning: "Nice to meet you" },
      { word: "माफ कीजिए", phonetic: "/mɑːf kiː.dʒi.eː/", meaning: "Sorry" },
    ],
    hard: [
      { word: "शुभकामनाएं", phonetic: "/ʃʊbʰ.kɑː.mə.nɑː.ẽː/", meaning: "Best wishes" },
      { word: "धन्यवाद बहुत बहुत", phonetic: "/d̪ʰən.jə.ʋɑːd̪ bə.hʊt̪ bə.hʊt̪/", meaning: "Thank you very much" },
    ],
  },
  tamil: {
    easy: [
      { word: "வணக்கம்", phonetic: "/ʋə.ɳək.kəm/", meaning: "Hello" },
      { word: "நன்றி", phonetic: "/nən.d̪ri/", meaning: "Thank you" },
      { word: "ஆம்", phonetic: "/ɑːm/", meaning: "Yes" },
      { word: "இல்லை", phonetic: "/iːl.lɑːi/", meaning: "No" },
      { word: "வரும்", phonetic: "/ʋɑːɾ.um/", meaning: "Good" },
    ],
    medium: [
      { word: "வரும்", phonetic: "/ʋɑːɾ.um/", meaning: "Welcome" },
      { word: "வணக்கம்", phonetic: "/ʋə.ɳək.kəm/", meaning: "Nice to meet you" },
      { word: "வணக்கம்", phonetic: "/ʋə.ɳək.kəm/", meaning: "Sorry" },
    ],
    hard: [
      { word: "வரும்", phonetic: "/ʋɑːɾ.um/", meaning: "Best wishes" },
      { word: "வரும்", phonetic: "/ʋɑːɾ.um/", meaning: "Thank you very much" },
    ],
  },
  telugu: {
    easy: [
      { word: "నమస్కారం", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Hello" },
      { word: "ధన్యవాదాలు", phonetic: "/d̪ʰən.jə.ʋɑː.d̪ɑː.lu/", meaning: "Thank you" },
      { word: "అవును", phonetic: "/ɑː.vuː.n̪u/", meaning: "Yes" },
      { word: "కాదు", phonetic: "/kɑː.d̪u/", meaning: "No" },
      { word: "చూటు", phonetic: "/tʃʊː.t̪u/", meaning: "Good" },
    ],
    medium: [
      { word: "నమస్కారం", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Welcome" },
      { word: "మిలకర్ ఖుషి హుంది", phonetic: "/mɪl.kər kʰʊ.ʃi hʊndi/", meaning: "Nice to meet you" },
      { word: "మాఫ్ కీజించండి", phonetic: "/mɑːf kiː.dʒiː.n̪d̪i/", meaning: "Sorry" },
    ],
    hard: [
      { word: "శుభకామనాలు", phonetic: "/ʃʊbʰ.kɑː.mə.nɑː.lu/", meaning: "Best wishes" },
      { word: "ధన్యవాదాలు అత్యంత అత్యంత", phonetic: "/d̪ʰən.jə.ʋɑː.d̪ɑː.lu ət̪jɑːnt̪ ət̪jɑːnt̪/", meaning: "Thank you very much" },
    ],
  },
  kannada: {
    easy: [
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Hello" },
      { word: "ಧನ್ಯವಾದಗಳು", phonetic: "/d̪ʰən.jə.ʋɑː.d̪ə.gə.lu/", meaning: "Thank you" },
      { word: "ಹಾಂ", phonetic: "/hɑː.n/", meaning: "Yes" },
      { word: "ಎಲ್ಲೋ", phonetic: "/eːl.lo/", meaning: "No" },
      { word: "ಅಚ್ಚೋ", phonetic: "/ət͡ʃ.tʃʰo/", meaning: "Good" },
    ],
    medium: [
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Welcome" },
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Nice to meet you" },
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Sorry" },
    ],
    hard: [
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Best wishes" },
      { word: "ನಮಸ್ಕಾರ", phonetic: "/nə.məs.kɑː.rə/", meaning: "Thank you very much" },
    ],
  },
  malayalam: {
    easy: [
      { word: "നമസ്കാരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Hello" },
      { word: "നന്ദി", phonetic: "/nən.d̪i/", meaning: "Thank you" },
      { word: "ಹಾಂ", phonetic: "/hɑː.n/", meaning: "Yes" },
      { word: "ಎಲ್ಲೋ", phonetic: "/eːl.lo/", meaning: "No" },
      { word: "ಅಚ್ಚೋ", phonetic: "/ət͡ʃ.tʃʰo/", meaning: "Good" },
    ],
    medium: [
      { word: "ನമസ്കാരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Welcome" },
      { word: "ನമസ್ಕಾരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Nice to meet you" },
      { word: "ನമಸ್ಕಾരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Sorry" },
    ],
    hard: [
      { word: "ನമസ್ಕಾരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Best wishes" },
      { word: "ನമസ್ಕಾരം", phonetic: "/nə.məs.kɑː.rəm/", meaning: "Thank you very much" },
    ],
  },
  gujarati: {
    easy: [
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Hello" },
      { word: "આભાર", phonetic: "/ɑː.bʰɑːr/", meaning: "Thank you" },
      { word: "હાં", phonetic: "/hɑː.n/", meaning: "Yes" },
      { word: "ના", phonetic: "/nɑː/", meaning: "No" },
      { word: "ભાલો", phonetic: "/bʱɑː.lo/", meaning: "Good" },
    ],
    medium: [
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Welcome" },
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Nice to meet you" },
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Sorry" },
    ],
    hard: [
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Best wishes" },
      { word: "નમસ્તે", phonetic: "/nə.məs.t̪eː/", meaning: "Thank you very much" },
    ],
  },
  bengali: {
    easy: [
      { word: "নমস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Hello" },
      { word: "ধন্যবাদ", phonetic: "/d̪ʰon.no.bɑd̪/", meaning: "Thank you" },
      { word: "হ্যাঁ", phonetic: "/hɑː.n/", meaning: "Yes" },
      { word: "না", phonetic: "/nɑː/", meaning: "No" },
      { word: "ভালো", phonetic: "/bʱɑː.lo/", meaning: "Good" },
    ],
    medium: [
      { word: "নমস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Welcome" },
      { word: "নমস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Nice to meet you" },
      { word: "নমস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Sorry" },
    ],
    hard: [
      { word: "নমস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Best wishes" },
      { word: "নમস্কার", phonetic: "/no.moʃ.kɑr/", meaning: "Thank you very much" },
    ],
  },
  punjabi: {
    easy: [
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Hello" },
      { word: "ਧੰਨਵਾਦ", phonetic: "/d̪ʰən.ʋɑːd̪/", meaning: "Thank you" },
      { word: "ਹੈਂ", phonetic: "/hɑː.n/", meaning: "Yes" },
      { word: "ਨਹੀਂ", phonetic: "/nə.hɪn/", meaning: "No" },
      { word: "ਅਚਾਣਾ", phonetic: "/ət͡ʃ.tʃʰɑː.n̪ɑː/", meaning: "Good" },
    ],
    medium: [
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Welcome" },
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Nice to meet you" },
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Sorry" },
    ],
    hard: [
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Best wishes" },
      { word: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ", phonetic: "/sət̪ ʃriː ə.kɑːl/", meaning: "Thank you very much" },
    ],
  },
}

// Default to hindi for other languages
Object.keys(LANGUAGES).forEach((lang) => {
  if (!CHALLENGE_WORDS[lang]) {
    CHALLENGE_WORDS[lang] = CHALLENGE_WORDS.hindi
  }
  if (!LANGUAGE_CATEGORIES[lang] || Object.keys(LANGUAGE_CATEGORIES[lang]).length < 2) {
    // Use Hindi categories as fallback if language has incomplete data
    const hindiCategories = LANGUAGE_CATEGORIES.hindi
    if (!LANGUAGE_CATEGORIES[lang]) {
      LANGUAGE_CATEGORIES[lang] = {}
    }
    Object.keys(hindiCategories).forEach((cat) => {
      if (!LANGUAGE_CATEGORIES[lang][cat]) {
        LANGUAGE_CATEGORIES[lang][cat] = hindiCategories[cat]
      }
    })
  }
})

// ===== EXPORTED FUNCTIONS =====

// Get currently selected language from localStorage
function getSelectedLanguage() {
  return localStorage.getItem("selectedLanguage") || "hindi"
}

// Set selected language in localStorage
function setSelectedLanguage(langKey) {
  if (LANGUAGES[langKey]) {
    localStorage.setItem("selectedLanguage", langKey)
  }
}

// Get language object by key
function getLanguage(langKey) {
  return LANGUAGES[langKey] || LANGUAGES.hindi
}

// Get all languages as array
function getAllLanguages() {
  return Object.values(LANGUAGES)
}

// Get categories for a language
function getCategoriesForLanguage(langKey) {
  return LANGUAGE_CATEGORIES[langKey] || LANGUAGE_CATEGORIES.hindi
}

// Get challenge words for a language and difficulty
function getChallengeWords(langKey, difficulty) {
  const langWords = CHALLENGE_WORDS[langKey] || CHALLENGE_WORDS.hindi
  return langWords[difficulty] || langWords.easy
}

// Unified Speech Synthesis Engine prioritizing clear Google/Premium voices
function speakTextWithGoogleTTS(text, langKey) {
  if (!text || !("speechSynthesis" in window)) return;

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const langMap = {
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

  const targetLang = langMap[langKey.toLowerCase()] || "en-US";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  
  // Set speed slightly slower (0.82) for absolute clarity
  utterance.rate = 0.82;
  utterance.pitch = 1.0;

  const setBestVoiceAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    
    // 1. Try exact Google voice for this language/locale (e.g. "Google US English", "Google हिन्दी")
    let voice = voices.find(v => v.lang === targetLang && v.name.toLowerCase().includes("google"));
    
    // 2. Try any Google voice matching language prefix
    if (!voice) {
      const prefix = targetLang.split("-")[0];
      voice = voices.find(v => v.lang.startsWith(prefix) && v.name.toLowerCase().includes("google"));
    }
    
    // 3. Try to find a premium / natural / Siri voice
    if (!voice) {
      voice = voices.find(v => v.lang === targetLang && (
        v.name.toLowerCase().includes("premium") || 
        v.name.toLowerCase().includes("siri") || 
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("aria")
      ));
    }
    
    // 4. Try exact language match
    if (!voice) {
      voice = voices.find(v => v.lang === targetLang);
    }
    
    // 5. Try language prefix match
    if (!voice) {
      const prefix = targetLang.split("-")[0];
      voice = voices.find(v => v.lang.startsWith(prefix));
    }

    if (voice) {
      utterance.voice = voice;
      console.log(`[TTS] Selected voice: ${voice.name} (${voice.lang})`);
    }

    speechSynthesis.speak(utterance);
  };

  // Chrome loads voices asynchronously; check if they are ready
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      setBestVoiceAndSpeak();
      speechSynthesis.onvoiceschanged = null; // Clean up listener
    };
  } else {
    setBestVoiceAndSpeak();
  }
}

// Make functions available globally
window.getSelectedLanguage = getSelectedLanguage
window.setSelectedLanguage = setSelectedLanguage
window.getLanguage = getLanguage
window.getAllLanguages = getAllLanguages
window.getCategoriesForLanguage = getCategoriesForLanguage
window.getChallengeWords = getChallengeWords
window.speakTextWithGoogleTTS = speakTextWithGoogleTTS

console.log("[v0] languages.js loaded - Language utilities and Google TTS ready")
