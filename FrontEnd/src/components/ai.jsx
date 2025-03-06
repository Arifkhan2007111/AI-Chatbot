import React, { useState, useEffect, useRef } from 'react';
import { BsSendFill } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';

// Predefined AI response patterns
const AI_RESPONSES = {
  greetings: [
    "Hello! How can I assist you today?",
    "Welcome! I'm here to help with your queries.",
    "Hi there! What information do you need?"
  ],
  unknown: [
    "I'm not sure about that. Could you please rephrase?",
    "I didn't quite understand. Can you provide more details?",
    "That's a bit complex. Let me connect you with a human representative."
  ],
  categories: {
    'document request': "For document requests, please provide your student/employee ID and specify the document type.",
    'technical support': "Our technical support team is available 24/7. What specific issue are you experiencing?",
    'event schedule': "I can help you with event schedules. Which department or type of events are you interested in?",
    'academic info': "For academic information, please specify your query about courses, schedules, or requirements.",
    'hr inquiry': "HR-related queries can be directed to our support team. What specific information do you need?"
  }
};

// Simulated AI response generator
function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [category, response] of Object.entries(AI_RESPONSES.categories)) {
    if (lowerMessage.includes(category)) {
      return response;
    }
  }
  
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)];
  }
  
  return AI_RESPONSES.unknown[Math.floor(Math.random() * AI_RESPONSES.unknown.length)];
}

// Main Chatbot Component
export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { text: "Welcome to AI Helpdesk! How can I assist you today?", sender: 'ai' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);

    const aiResponse = generateAIResponse(inputMessage);
    
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: aiResponse, sender: 'ai' }]);
    }, 500);

    setInputMessage('');
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg w-100" style={{ maxWidth: "450px" }}>
        {/* Chatbot Header */}
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FaRobot className="me-2" size={24} />
          <h5 className="mb-0">AI Helpdesk Assistant</h5>
        </div>

        {/* Messages Container */}
        <div className="card-body overflow-auto" style={{ height: "400px" }}>
          {messages.map((msg, index) => (
            <div key={index} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-2 rounded-3 text-white mb-2 ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="card-footer bg-light p-2 d-flex">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="form-control me-2"
          />
          <button 
            onClick={handleSendMessage}
            className="btn btn-primary"
          >
            <BsSendFill size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
