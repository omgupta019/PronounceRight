from difflib import SequenceMatcher
from phoneme_converter import text_to_phonemes

def pronunciation_score(expected, predicted, language):

    expected_phonemes = text_to_phonemes(expected, language)
    predicted_phonemes = text_to_phonemes(predicted, language)

    similarity = SequenceMatcher(None, expected_phonemes, predicted_phonemes).ratio()

    return round(similarity * 100, 2)
