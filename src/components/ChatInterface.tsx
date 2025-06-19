import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import { Send } from "lucide-react";

interface ChatMessage {
  prompt: string;
  response: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  groq: Groq;
  aboutMe: Record<string, any>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ groq, aboutMe }) => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, displayedResponse]);

  useEffect(() => {
    const greetingMessage: ChatMessage = {
      prompt: "",
      response:
        "Hi, I'm Senzo Calvin Shinga. How can I assist you today? Would you like to talk about my projects or discuss any of the technologies I'm skilled in, such as JavaScript, React, or Python?",
      isUser: false,
    };
    setChatMessages([greetingMessage]);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: ChatMessage = {
      prompt: inputValue,
      response: "",
      isUser: true,
    };
    setChatMessages((prevState) => [...prevState, userMessage]);
    setIsTyping(true);

    try {
      // const chatCompletion = await groq.chat.completions.create({
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are Senzo Calvin Shinga. Here is some information about you: ${JSON.stringify(
                aboutMe
              )}. Respond ONLY if the user's question is directly related to Senzo Calvin Shinga. If not, politely decline to answer. Format the text by replacing asterisks with bold text, split long texts into smaller paragraphs using double line breaks, and ensure only project and social media links are clickable.`,
            },
            { role: "user", content: inputValue },
          ],
          // model: "llama-3.3-70b-versatile", // Model is set on the backend
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the backend streams the response directly as text
      // and ChatInterface is set up to handle streamed text or a complete text response.
      // For simplicity, this example will read the entire response as text.
      // If your backend streams, you'll need to adjust how you read the response body.
      const responseText = await response.text(); 
      // Simulate the structure of the Groq API response if needed by your existing logic
      const chatCompletion = {
        choices: [
          {
            message: {
              content: responseText,
            },
          },
        ],
      };
        messages: [
          {
            role: "system",
            content: `You are Senzo Calvin Shinga. Here is some information about you: ${JSON.stringify(
              aboutMe
            )}. Respond ONLY if the user's question is directly related to Senzo Calvin Shinga. If not, politely decline to answer. Format the text by replacing asterisks with bold text, split long texts into smaller paragraphs using double line breaks, and ensure only project and social media links are clickable.`,
          },
          { role: "user", content: inputValue },
        ],
        // model: "llama-3.3-70b-versatile", // Model is set on the backend
      });
      // The following lines are now part of the fetch call block above
      // const responseContent =
      //   chatCompletion.choices[0]?.message?.content ||
      //   "I can only answer questions related to Senzo Calvin Shinga.";

      // const formattedResponse = formatResponseText(responseContent);
      // simulateTypingEffect(formattedResponse);
      // setInputValue("");

      const responseContent =
        chatCompletion.choices[0]?.message?.content ||
        "I can only answer questions related to Senzo Calvin Shinga.";

      const formattedResponse = formatResponseText(responseContent);
      simulateTypingEffect(formattedResponse);
      setInputValue("");
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      const aiError: ChatMessage = {
        prompt: "",
        response: "Error fetching chat response",
        isUser: false,
      };
      setChatMessages((prevState) => [...prevState, aiError]);
      setIsTyping(false);
    }
  };

  const simulateTypingEffect = (fullText: string) => {
    setDisplayedResponse("");
    let index = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedResponse((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
        setChatMessages((prevState) => [
          ...prevState,
          { prompt: "", response: fullText, isUser: false },
        ]);
        setIsTyping(false);
      }
    }, 20); // Adjust speed (lower value = faster typing)
  };

  const formatResponseText = (text: string) => {
    if (typeof text !== "string") {
      console.warn("Expected string but received:", text);
      return text;
    }

    let formattedText = text.replace(/\bI\b/g, "I").replace(/\bYou\b/g, "You");

    // Convert **bold** into <strong>
    formattedText = formattedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Add line breaks after each sentence
    formattedText = formattedText.replace(/\.\s/g, ".<br><br>");

    // Convert project and social media links to clickable links
    formattedText = formattedText.replace(
      /(https?:\/\/(senzo-calvin-shinga-portfolio\.com|ai-chat-interface\.com|ats-friendly-cv-builder-production\.up\.railway\.app|linkedin\.com\/in\/senzo-shinga-a970802a9|github\.com\/InnoWave620)[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>'
    );

    return formattedText;
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold text-xl shadow-md">
        {/* Default React robot icon */}
        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          🤖
        </span>
        I'm a robot Portfolio, get to know Me!
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-auto p-4 space-y-4"
      >
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isUser && (
              <span className="w-8 h-8 mr-2 rounded-full flex items-center justify-center">
                🤖
              </span>
            )}
            <div
              className={`p-3 max-w-xs rounded-lg shadow-md ${
                message.isUser
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900"
              }`}
              dangerouslySetInnerHTML={{
                __html: message.isUser ? message.prompt : message.response,
              }}
            />
          </div>
        ))}

        {/* Display AI typing effect */}
        {isTyping && (
          <div className="flex justify-start">
            <span className="w-8 h-8 mr-2 rounded-full flex items-center justify-center">
              🤖
            </span>
            <div
              className="p-3 max-w-xs rounded-lg shadow-md bg-white text-gray-900"
              dangerouslySetInnerHTML={{ __html: displayedResponse }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center p-4 bg-white border-t border-gray-300">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleSend}
          className="ml-3 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          title="Send Message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
