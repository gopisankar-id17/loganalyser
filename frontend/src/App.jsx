import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats')
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Log Analysis Discussion', timestamp: new Date(2025, 10, 19).toISOString() },
      { id: 2, title: 'Error Pattern Recognition', timestamp: new Date(2025, 10, 18).toISOString() },
      { id: 3, title: 'System Performance Review', timestamp: new Date(2025, 10, 17).toISOString() },
    ]
  })
  const [currentChatId, setCurrentChatId] = useState(() => {
    const saved = localStorage.getItem('currentChatId')
    return saved ? parseInt(saved) : 1
  })
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`messages_${currentChatId}`)
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'user', content: 'Hello! Can you analyze this log file?', timestamp: new Date().toISOString() },
      { id: 2, type: 'assistant', content: 'Of course! I\'d be happy to help you analyze your log file. Please upload the file using the attachment button below.', timestamp: new Date().toISOString() },
    ]
  })
  const [inputMessage, setInputMessage] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem('currentChatId', currentChatId.toString())
  }, [currentChatId])

  useEffect(() => {
    localStorage.setItem(`messages_${currentChatId}`, JSON.stringify(messages))
  }, [messages, currentChatId])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date().toISOString()
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'assistant',
          content: 'I received your message. How can I help you further?',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: `Uploaded file: ${file.name}`,
        fileName: file.name,
        timestamp: new Date().toISOString()
      }
      setMessages([...messages, newMessage])
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'assistant',
          content: `I've received your file "${file.name}". I'm analyzing it now...`,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date().toISOString()
    }
    setChats([newChat, ...chats])
    setCurrentChatId(newChat.id)
    setMessages([])
  }

  const handleChatSelect = (chatId) => {
    setCurrentChatId(chatId)
    const saved = localStorage.getItem(`messages_${chatId}`)
    setMessages(saved ? JSON.parse(saved) : [])
  }

  const formatDate = (date) => {
    const now = new Date()
    const dateObj = new Date(date)
    const diff = now - dateObj
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return dateObj.toLocaleDateString()
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New chat
          </button>
        </div>
        
        <div className="chat-history">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2"/>
              </svg>
              <div className="chat-item-content">
                <div className="chat-item-title">{chat.title}</div>
                <div className="chat-item-date">{formatDate(chat.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="chat-header">
          <button className="toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2>Log Analyzer Chat</h2>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h1>What can I help with?</h1>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'assistant' && (
                  <div className="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                    </svg>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  {message.fileName && (
                    <div className="message-file">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeWidth="2"/>
                        <polyline points="13 2 13 9 20 9" strokeWidth="2"/>
                      </svg>
                      {message.fileName}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="message-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <label htmlFor="file-upload" className="file-upload-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <input 
              type="text" 
              placeholder="Message Log Analyzer..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-btn" 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
