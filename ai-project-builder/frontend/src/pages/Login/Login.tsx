// // frontend/src/pages/Login/Login.tsx
// import React, { useState } from 'react';
// import { Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import './Login.css';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { user, login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const result = await login(email, password);
    
//     if (!result.success) {
//       // Handle specific error types with user-friendly messages
//       if (result.error?.includes('Network error')) {
//         setError('Cannot connect to server. Please check if the backend is running.');
//       } else if (result.error?.includes('Invalid credentials')) {
//         setError('Invalid email or password. Please try again.');
//       } else if (result.error?.includes('required')) {
//         setError('Please enter both email and password.');
//       } else {
//         setError(result.error || 'Login failed. Please try again.');
//       }
//     }
    
//     setLoading(false);
//   };

//   // Handle Enter key in input fields
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSubmit(e);
//     }
//   };

//   if (user) {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <h1>Mejuvante.One</h1>
//           <p>Sign in to your account</p>
//         </div>
        
//         {error && (
//           <div className="error-message" role="alert">
//             <span className="error-icon">⚠️</span>
//             {error}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit} className="login-form" noValidate>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onKeyPress={handleKeyPress}
//               required
//               disabled={loading}
//               placeholder="Enter your email"
//               autoComplete="email"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyPress={handleKeyPress}
//               required
//               disabled={loading}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             className="login-button"
//             disabled={loading || !email || !password}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner"></span>
//                 Signing in...
//               </>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>
        
//         <div className="login-footer">
//           <p>
//             Don't have an account? <Link to="/register">Sign up</Link>
//           </p>
//           <p className="forgot-password">
//             <Link to="/forgot-password">Forgot password?</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// frontend/src/pages/Login/Login.tsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import loginImage from '../../assets/login.png';
import './Login.css';



const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { user, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      // Handle specific error types with user-friendly messages
      if (result.error?.includes('Network error')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else if (result.error?.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (result.error?.includes('required')) {
        setError('Please enter both email and password.');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      {/* Left side with image */}
      <div className="login-image-side" style={{ backgroundImage: `url(${loginImage})` }} >
        <div className="image-content" >
        
          <h1 className="image-title">CodeAlchemy</h1>
          <p className="image-subtitle">Transform your ideas into digital reality</p>
          {/* <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <span>Lightning fast development</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <span>Enterprise-grade security</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Powerful collaboration tools</span>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="login-form-side">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to continue to CodeAlchemy</p>
          </div>
          
          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              {/* <Link to="/forgot-password" className="forgot-link">Forgot password?</Link> */}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;