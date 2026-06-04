from faster_whisper import WhisperModel
from scoring import pronunciation_score

model = WhisperModel("base")

expected_text = "Cristiano Ronaldo"

segments, info = model.transcribe("test.wav")

predicted_text = ""

for segment in segments:
    predicted_text += segment.text + " "

predicted_text = predicted_text.strip()

print("Expected:", expected_text)
print("Predicted:", predicted_text)

score = pronunciation_score(expected_text, predicted_text, "en")

print("Pronunciation Score:", score, "%")
