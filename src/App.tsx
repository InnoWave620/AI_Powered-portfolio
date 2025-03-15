import React from "react";
import Groq from "groq-sdk";
import ChatInterface from "./components/ChatInterface";
import aboutMe from "./data/aboutMe.json";
import "./index.css";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <div className="flex-1 overflow-auto p-4">
        {/* <h1 className="text-2xl font-bold mb-4">My AI Chat Interface</h1> */}
        <ChatInterface groq={groq} aboutMe={aboutMe} />
      </div>
    </div>
  );
};

export default App;
