


// frontend/src/components/CodePreview/CodePreview.tsx
import React, { useState } from 'react';
import './CodePreview.css';

interface CodePreviewProps {
  language: string;
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ language, code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const getPreviewContent = () => {
    if (language === 'html') {
      return (
        <iframe
          srcDoc={code}
          title="Preview"
          className="code-preview-iframe"
          sandbox="allow-scripts"
        />
      );
    } else if (language === 'jsx' || language === 'tsx') {
      return (
        <div className="preview-placeholder">
          <p>React component preview</p>
          <p>Preview would be rendered here in a production environment</p>
        </div>
      );
    } else {
      return (
        <div className="preview-placeholder">
          <p>Preview not available for {language}</p>
        </div>
      );
    }
  };

  return (
    <div className="code-preview-container">
      <div className="code-preview-toolbar">
        <div className="code-info">
          <span className="code-language">{language}</span>
          <span className="code-length">{code.length} characters</span>
        </div>
        <div className="code-actions">
          <button onClick={togglePreview} className="preview-toggle-btn">
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={toggleExpanded} className="expand-toggle-btn">
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div className={`code-preview-content ${isExpanded ? 'expanded' : ''}`}>
        <pre className="code-block">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
      
      {showPreview && (
        <div className="code-preview-output">
          <div className="preview-header">
            <h4>Preview</h4>
          </div>
          <div className="preview-content">
            {getPreviewContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePreview;