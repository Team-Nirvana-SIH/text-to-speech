import speech_recognition as sr

def voice_to_text():
    # Initialize the recognizer
    r = sr.Recognizer()
    full_text = ""

    with sr.Microphone() as source:
        while True:
            print("Listening...")
            try:
                # Adjust for ambient noise and listen
                r.adjust_for_ambient_noise(source)
                audio = r.listen(source)
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
