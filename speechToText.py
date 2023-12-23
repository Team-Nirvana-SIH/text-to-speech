import speech_recognition as sr
import time

def voice_to_text():
    # Initialize the recognizer
    r = sr.Recognizer()
    full_text = ""

    with sr.Microphone() as source:
        # Start the timer
        start_time = time.time()

        while True:
            # Check if 5 seconds have passed
            if time.time() - start_time > 5:
                break

            print("Listening...")
            try:
                # Adjust for ambient noise and listen
                r.adjust_for_ambient_noise(source)
                audio = r.listen(source, timeout=1, phrase_time_limit=3)
                text = r.recognize_google(audio)

                # Append the recognized text to the full text variable
                full_text += text + " "
                print("Recognized: " + text)
            except sr.UnknownValueError:
                print("Could not understand audio")
            except sr.RequestError as e:
                print("Could not request results; {0}".format(e))
            except Exception as e:
                print(f"An error occurred: {e}")

    # If you want to use the full_text outside the loop or function, return it
    return full_text

if __name__ == "__main__":
    accumulated_text = voice_to_text()
    print("Full Transcribed Text: ", accumulated_text)
