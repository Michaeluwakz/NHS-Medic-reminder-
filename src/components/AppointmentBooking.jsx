import { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function AppointmentBooking() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an NHS appointment booking assistant. Help patients book appointments by asking relevant questions about their symptoms, urgency, and preferred times. Be professional and empathetic."
          },
          ...messages,
          userMessage
        ],
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please check your API key configuration or try again later.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact NHS directly.'
      }]);
    }

    setLoading(false);
  };

  return (
    <section className="appointment-section">
      <h2>Book an Appointment</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>Hello! I'm your NHS appointment booking assistant. How can I help you today?</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                {message.content}
              </div>
            ))
          )}
          {loading && <div className="message assistant">Thinking...</div>}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="nhs-input"
            disabled={loading}
          />
          <button type="submit" className="nhs-button" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </section>
  );
}

export default AppointmentBooking;