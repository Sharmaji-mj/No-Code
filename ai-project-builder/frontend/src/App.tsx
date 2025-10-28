

// // // frontend/src/App.tsx
// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import { AuthProvider } from './contexts/AuthContext';
// // import { ProjectProvider } from './contexts/ProjectContext';
// // import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// // import Header from './components/Header/Header';
// // import ProtectedRoute from './components/ProtectedRoute';
// // import Login from './pages/Login/Login';
// // import Register from './pages/Register/Register';
// // import Dashboard from './pages/Dashboard';
// // import Editor from './pages/Editor';
// // import ProjectWorkspace from './pages/ProjectWorkspace';
// // import './App.css';
// // import { useEffect } from 'react';

// // // Component that uses the theme
// // const AppContent = () => {
// //   const { theme } = useTheme();

// //   // Apply the theme class to the body element
// //   useEffect(() => {
// //     document.body.className = theme;
// //   }, [theme]);

// //   return (
// //     <div className="App">
// //       <Header />
// //       <main className="main-content">
// //         <Routes>
// //           {/* Public Routes */}
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />

// //           {/* Protected Routes */}
// //           <Route path="/" element={
// //             <ProtectedRoute>
// //               <Dashboard />
// //             </ProtectedRoute>
// //           } />
// //           <Route path="/editor/:projectId" element={
// //             <ProtectedRoute>
// //               <Editor />
// //             </ProtectedRoute>
// //           } />
// //           <Route path="/project/:id" element={
// //             <ProtectedRoute>
// //               <ProjectWorkspace />
// //             </ProtectedRoute>
// //           } />
// //         </Routes>
// //       </main>
// //     </div>
// //   );
// // };

// // function App() {
// //   return (
// //     <ThemeProvider>
// //       <AuthProvider>
// //         <ProjectProvider>
// //           <Router>
// //             <AppContent />
// //           </Router>
// //         </ProjectProvider>
// //       </AuthProvider>
// //     </ThemeProvider>
// //   );
// // }

// // export default App;


// // frontend/src/App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { ProjectProvider } from './contexts/ProjectContext';
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// import Header from './components/Header/Header';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import Dashboard from './pages/Dashboard';
// import Editor from './pages/Editor';
// import ProjectWorkspace from './pages/ProjectWorkspace';
// import ChatPage from './pages/ChatPage'; // Import the new ChatPage component
// import './App.css';
// import { useEffect } from 'react';

// // Component that uses the theme
// const AppContent = () => {
//   const { theme } = useTheme();

//   // Apply the theme class to the body element
//   useEffect(() => {
//     document.body.className = theme;
//   }, [theme]);

//   return (
//     <div className="App">
//       <Header />
//       <main className="main-content">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected Routes */}
//           <Route path="/" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/editor/:projectId" element={
//             <ProtectedRoute>
//               <Editor />
//             </ProtectedRoute>
//           } />
//           <Route path="/project/:id" element={
//             <ProtectedRoute>
//               <ProjectWorkspace />
//             </ProtectedRoute>
//           } />
//           {/* New Chat Page Route */}
//           <Route path="/chat/:projectId" element={
//             <ProtectedRoute>
//               <ChatPage />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <ProjectProvider>
//           <Router>
//             <AppContent />
//           </Router>
//         </ProjectProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import ProjectWorkspace from './pages/ProjectWorkspace';
import ChatPage from './pages/ChatPage';
import DeployPage from './pages/DeployPage'; // Add this import
import './App.css';
import { useEffect } from 'react';

// Component that uses the theme
const AppContent = () => {
  const { theme } = useTheme();
  
  // Apply the theme class to the body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/editor/:projectId" element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          } />
          <Route path="/project/:id" element={
            <ProtectedRoute>
              <ProjectWorkspace />
            </ProtectedRoute>
          } />
          
          {/* Chat Page Routes - Support both with and without projectId */}
          <Route path="/chat/:projectId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          
          {/* Deploy Page Route - THIS WAS MISSING! */}
          {/* <Route path="/deploy" element={
            <ProtectedRoute>
              <DeployPage />
            </ProtectedRoute>
          } />
        </Routes> */}
        <Route path="/deploy/:projectId" element={<DeployPage />} /></Routes>

      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <Router>
            <AppContent />
          </Router>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;