// frontend/src/components/MejuvanteOne/MejuvanteOne.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import './MejuvanteOne.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mejuvante';
  timestamp: Date;
}

interface MejuvanteOneProps {
  onClose: () => void;
  currentCode: string;
  language: string;
  onCodeGenerated: (code: string, language: string) => void;
  projectId: string;
  initialPrompt?: string;
}

const MejuvanteOne: React.FC<MejuvanteOneProps> = ({
  onClose,
  currentCode,
  language,
  onCodeGenerated,
  projectId,
  initialPrompt = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [showRepoInput, setShowRepoInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { updateProject, cloneRepository } = useProject();

  // Auto-generate on mount with initial prompt
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt, true);
    }
  }, [initialPrompt]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text?: string, isInitial = false) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the API to generate code or get a response
      const response = await fetch('/api/mejuvante/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          projectId,
          currentCode
        })
      });

      const data = await response.json();

      if (data.response) {
        const mejuvanteMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'mejuvante',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, mejuvanteMessage]);

        if (data.code) {
          setGeneratedCode(data.code);
          // Don't automatically show the code, wait for user to click
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'mejuvante',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real implementation, you would upload the file to the server
      // and then process it
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `Uploaded file: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
      
      // Simulate processing the file
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I've received your file "${file.name}". What would you like me to do with it?`,
          sender: 'mejuvante',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const handleRepoClone = async () => {
    if (!repoUrl.trim()) return;
    
    setIsLoading(true);
    try {
      await cloneRepository(projectId, repoUrl);
      const successMessage: Message = {
        id: Date.now().toString(),
        text: `Successfully cloned repository from ${repoUrl}`,
        sender: 'mejuvante',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      setRepoUrl('');
      setShowRepoInput(false);
    } catch (error) {
      console.error('Error cloning repository:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `Failed to clone repository. Please check the URL and try again.`,
        sender: 'mejuvante',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCode = () => {
    setShowCode(true);
    if (generatedCode) {
      onCodeGenerated(generatedCode, language);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="mejuvante-one-container">
      <div className="mejuvante-one-header">
        <h2>Mejuvante.One</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="mejuvante-one-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'mejuvante-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message mejuvante-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {generatedCode && !showCode && (
        <div className="code-notification">
          <p>Code has been generated based on your requirements.</p>
          <button onClick={handleShowCode}>View Code</button>
          <button onClick={handlePreview}>Preview</button>
        </div>
      )}
      
      <div className="mejuvante-one-input">
        {showRepoInput ? (
          <div className="repo-input-container">
            <input
              type="text"
              placeholder="Enter repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <button onClick={handleRepoClone}>Clone</button>
            <button onClick={() => setShowRepoInput(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="input-actions">
              <label className="upload-btn">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                📎
              </label>
              <button 
                className="clone-btn"
                onClick={() => setShowRepoInput(true)}
              >
                📁 Clone Repo
              </button>
            </div>
            <input
              type="text"
              placeholder="Ask Mejuvante.One to help with your project..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={() => handleSendMessage()}>Send</button>
          </>
        )}
      </div>
      
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h3>Preview</h3>
              <button onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="preview-body">
              <iframe 
                srcDoc={generatedCode}
                title="Preview"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MejuvanteOne;