// frontend/src/components/CodeEditor/CodeEditor.tsx
import React from 'react';
import './CodeEditor.css';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="code-editor">
      <div className="code-editor-header">
        <span className="language-tag">{language}</span>
      </div>
      <textarea
        className="code-textarea"
        value={code}
        onChange={handleChange}
        spellCheck={false}
        placeholder={`Start writing your ${language} code here...`}
      />
    </div>
  );
};

export default CodeEditor;