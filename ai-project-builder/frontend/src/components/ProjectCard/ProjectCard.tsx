// // frontend/src/components/ProjectCard/ProjectCard.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ProjectCard.css';
// // import { Project } from '../../contexts/ProjectContext';
// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   type: 'mejuvante' | 'git' | 'upload';
//   status: 'active' | 'completed' | 'archived';
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ProjectCardProps {
//   project: Project;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     navigate(`/editor/${project.id}`);
//   };

//   const getStatusColor = () => {
//     switch (project.status) {
//       case 'active':
//         return '#61c4ca';
//       case 'completed':
//         return '#2c99b7';
//       case 'archived':
//         return '#999';
//       default:
//         return '#666';
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="project-card" onClick={handleCardClick}>
//       <div className="project-card-header">
//         <h3 className="project-title">{project.name}</h3>
//         <span 
//           className="project-status" 
//           style={{ backgroundColor: getStatusColor() }}
//         >
//           {project.status}
//         </span>
//       </div>
      
//       <p className="project-description">
//         {project.description || 'No description available'}
//       </p>
      
//       <div className="project-card-footer">
//         <div className="project-type">
//           <span className="type-icon">
//             {project.type === 'mejuvante' && '⚡'}
//             {project.type === 'git' && '📁'}
//             {project.type === 'upload' && '📤'}
//           </span>
//           <span className="type-label">
//             {project.type === 'mejuvante' && 'Mejuvante.One'}
//             {project.type === 'git' && 'Git Repository'}
//             {project.type === 'upload' && 'File Upload'}
//           </span>
//         </div>
//         <div className="project-date">
//           Updated {formatDate(project.updatedAt)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;







// // frontend/src/components/ProjectCard/ProjectCard.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ProjectCard.css';

// // Define a more flexible Project interface that can handle all project types
// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   type: 'mejuvante' | 'git' | 'upload' | 'chat';
//   status: 'active' | 'completed' | 'archived';
//   createdAt: Date | string;
//   updatedAt: Date | string;
//   [key: string]: any; // Allow additional properties
// }

// interface ProjectCardProps {
//   project: Project;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     // Navigate based on project type
//     if (project.type === 'chat') {
//       navigate(`/chat/${project.id}`);
//     } else {
//       navigate(`/editor/${project.id}`);
//     }
//   };

//   const getStatusColor = () => {
//     switch (project.status) {
//       case 'active':
//         return '#61c4ca';
//       case 'completed':
//         return '#2c99b7';
//       case 'archived':
//         return '#999';
//       default:
//         return '#666';
//     }
//   };

//   const formatDate = (date: Date | string) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="project-card" onClick={handleCardClick}>
//       <div className="project-card-header">
//         <h3 className="project-title">{project.name}</h3>
//         <span 
//           className="project-status" 
//           style={{ backgroundColor: getStatusColor() }}
//         >
//           {project.status}
//         </span>
//       </div>
      
//       <p className="project-description">
//         {project.description || 'No description available'}
//       </p>
      
//       <div className="project-card-footer">
//         <div className="project-type">
//           <span className="type-icon">
//             {project.type === 'mejuvante' && '⚡'}
//             {project.type === 'git' && '📁'}
//             {project.type === 'upload' && '📤'}
//             {project.type === 'chat' && '💬'}
//           </span>
//           <span className="type-label">
//             {project.type === 'mejuvante' && 'Mejuvante.One'}
//             {project.type === 'git' && 'Git Repository'}
//             {project.type === 'upload' && 'File Upload'}
//             {project.type === 'chat' && 'Chat Project'}
//           </span>
//         </div>
//         <div className="project-date">
//           Updated {formatDate(project.updatedAt)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;










// frontend/src/components/ProjectCard/ProjectCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'mejuvante' | 'git' | 'upload' | 'chat';
  status: 'active' | 'completed' | 'archived';
  createdAt: Date | string;
  updatedAt: Date | string;
  chatHistory?: Array<{role: string; content: string; timestamp?: Date | string}>;
  [key: string]: any;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate based on project type
    if (project.type === 'chat') {
      navigate(`/chat/${project.id}`);
    } else {
      navigate(`/editor/${project.id}`);
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'active':
        return '#61c4ca';
      case 'completed':
        return '#2c99b7';
      case 'archived':
        return '#999';
      default:
        return '#666';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <div className="project-card-header">
        <h3 className="project-title">{project.name}</h3>
        <span 
          className="project-status" 
          style={{ backgroundColor: getStatusColor() }}
        >
          {project.status}
        </span>
      </div>
      
      <p className="project-description">
        {project.description || 'No description available'}
      </p>
      
      <div className="project-card-footer">
        <div className="project-type">
          <span className="type-icon">
            {project.type === 'mejuvante' && '⚡'}
            {project.type === 'git' && '📁'}
            {project.type === 'upload' && '📤'}
            {project.type === 'chat' && '💬'}
          </span>
          <span className="type-label">
            {project.type === 'mejuvante' && 'Mejuvante.One'}
            {project.type === 'git' && 'Git Repository'}
            {project.type === 'upload' && 'File Upload'}
            {project.type === 'chat' && 'Chat Project'}
          </span>
        </div>
        <div className="project-date">
          Updated {formatDate(project.updatedAt)}
        </div>
      </div>
      
      {project.type === 'chat' && project.chatHistory && (
        <div className="chat-history-preview">
          <span className="chat-count">
            {project.chatHistory.length} messages
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;