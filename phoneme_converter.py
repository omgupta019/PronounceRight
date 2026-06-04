import re
from phonemizer import phonemize

# Static list of supported espeak languages to prevent slow subprocess spawns during startup
SUPPORTED_ESPEAK_LANGS = {"en-us", "en", "hi", "kn", "ml", "pa", "ta"}

def text_to_phonemes(text, language):
    if not text:
        return ""
    
    # 1. Normalize the language code (e.g., "en-US" -> "en")
    lang_code = str(language).lower().strip().split("-")[0]
    
    if lang_code == "en":
        lang_code = "en-us"
        
    # 2. Check if espeak supports this language code
    if lang_code in SUPPORTED_ESPEAK_LANGS:
        try:
            phonemes = phonemize(
                text,
                language=lang_code,
                backend='espeak',
                strip=True,
                preserve_punctuation=False
            )
            return phonemes
        except Exception as e:
            print(f"Phonemizer failed for language {lang_code}: {e}")
            # Fall back to text normalization on error
            
    # 3. Fallback: return normalized, lowercased text with punctuation stripped
    # This acts as a highly effective similarity fallback for unsupported languages
    normalized = text.lower().strip()
    normalized = re.sub(r'[^\w\s]', '', normalized)  # remove punctuation
    return normalized

