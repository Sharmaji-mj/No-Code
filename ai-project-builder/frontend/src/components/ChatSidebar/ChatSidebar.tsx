// src/components/ChatSidebar/ChatSidebar.tsx
import React, { useState } from 'react';
import './ChatSidebar.css';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectDescription: string;
  chatHistory: Chat[]; // You would fetch this
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  projectName,
  projectDescription,
  chatHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="chat-sidebar-overlay" onClick={onClose}>
      <div className="chat-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2>{projectName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <p className="project-description">{projectDescription}</p>
        
        <div className="chat-history">
          <h3>Chat History</h3>
          <ul>
            {chatHistory.map((chat) => (
              <li key={chat.id} className="chat-history-item">
                <div className="chat-title">{chat.title}</div>
                <div className="chat-last-message">{chat.lastMessage}</div>
                <div className="chat-timestamp">{chat.timestamp}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};