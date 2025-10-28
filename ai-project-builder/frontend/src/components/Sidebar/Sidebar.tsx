// import React from 'react';
// import { File } from '../../contexts/ProjectContext';
// import './Sidebar.css';

// interface SidebarProps {
//   files: File[];
//   activeFile: number;
//   onFileSelect: (index: number) => void;
//   onNewFile: () => void;
//   projectId: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   files,
//   activeFile,
//   onFileSelect,
//   onNewFile,
//   projectId
// }) => {
//   const getFileIcon = (filename: string) => {
//     const ext = filename.split('.').pop()?.toLowerCase();
//     switch (ext) {
//       case 'js':
//       case 'jsx':
//         return '🟨';
//       case 'ts':
//       case 'tsx':
//         return '🔷';
//       case 'css':
//         return '🎨';
//       case 'html':
//         return '🌐';
//       case 'json':
//         return '📋';
//       default:
//         return '📄';
//     }
//   };

//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h3>📁 Project Files</h3>
//         <button onClick={onNewFile} className="new-file-btn">
//           ➕
//         </button>
//       </div>
//       <div className="file-list">
//         {files.map((file, index) => (
//           <button
//             key={index}
//             className={`file-item ${activeFile === index ? 'active' : ''}`}
//             onClick={() => onFileSelect(index)}
//           >
//             <span className="file-icon">{getFileIcon(file.name)}</span>
//             <span className="file-name">{file.name}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// frontend/src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { File } from '../../contexts/ProjectContext'; // Now this will work
import './Sidebar.css';

interface SidebarProps {
  files: { [key: string]: string };
  activeFile: string;
  onFileSelect: (fileName: string) => void;
  onFileAdd: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  activeFile, 
  onFileSelect, 
  onFileAdd 
}) => {
  const fileNames = Object.keys(files);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Files</h3>
        <button className="add-file-btn" onClick={onFileAdd}>
          +
        </button>
      </div>
      
      <div className="file-list">
        {fileNames.map(fileName => (
          <div 
            key={fileName}
            className={`file-item ${activeFile === fileName ? 'active' : ''}`}
            onClick={() => onFileSelect(fileName)}
          >
            <span className="file-icon">
              {fileName.endsWith('.html') && '📄'}
              {fileName.endsWith('.css') && '🎨'}
              {fileName.endsWith('.js') && '⚡'}
              {!fileName.endsWith('.html') && !fileName.endsWith('.css') && !fileName.endsWith('.js') && '📝'}
            </span>
            <span className="file-name">{fileName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;