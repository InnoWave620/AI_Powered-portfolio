// Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  }
  
  export {};