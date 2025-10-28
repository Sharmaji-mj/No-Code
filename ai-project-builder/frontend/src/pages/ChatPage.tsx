// // // // import React, { useState, useEffect, useMemo, useRef } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { useAuth } from '../contexts/AuthContext';
// // // // import './ChatPage.css';

// // // // export interface ProjectFile {
// // // //   name: string;
// // // //   path: string;
// // // //   content: string;
// // // //   language: string;
// // // // }

// // // // interface Message {
// // // //   id: string;
// // // //   role: 'user' | 'assistant';
// // // //   content: string;
// // // //   timestamp: string;
// // // //   files?: ProjectFile[];
// // // //   previewUrl?: string;
// // // // }

// // // // const ChatPage: React.FC = () => {
// // // //   const { chatId } = useParams<{ chatId: string }>();
// // // //   const navigate = useNavigate();
// // // //   const { user } = useAuth();
// // // //   const messagesEndRef = useRef<HTMLDivElement>(null);

// // // //   // State management
// // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // //   const [input, setInput] = useState('');
// // // //   const [isGenerating, setIsGenerating] = useState(false);
// // // //   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
// // // //   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
// // // //   const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
// // // //   const [previewUrl, setPreviewUrl] = useState<string>('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [fileTreeExpanded, setFileTreeExpanded] = useState<{ [key: string]: boolean }>({});
// // // //   const [projectName, setProjectName] = useState('Untitled Project');
// // // //   const [applicationType, setApplicationType] = useState<'web' | 'mobile' | 'desktop'>('web');

// // // //   // Load chat history on mount
// // // //   useEffect(() => {
// // // //     if (chatId) {
// // // //       loadChatHistory();
// // // //     }
// // // //   }, [chatId]);

// // // //   // Auto-scroll messages
// // // //   useEffect(() => {
// // // //     scrollToBottom();
// // // //   }, [messages]);

// // // //   const scrollToBottom = () => {
// // // //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // //   };

// // // //   const loadChatHistory = () => {
// // // //     try {
// // // //       const savedChat = localStorage.getItem(`chat_${user?.id}_${chatId}`);
// // // //       if (savedChat) {
// // // //         const parsed = JSON.parse(savedChat);
// // // //         setMessages(parsed.messages || []);
// // // //         setProjectFiles(parsed.files || []);
// // // //         setPreviewUrl(parsed.previewUrl || '');
// // // //         setProjectName(parsed.title || 'Untitled Project');
// // // //         setApplicationType(parsed.applicationType || 'web');

// // // //         if (parsed.files && parsed.files.length > 0) {
// // // //           setSelectedFile(parsed.files[0]);
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error loading chat history:', error);
// // // //     }
// // // //   };

// // // //   const saveChatHistory = (newMessages: Message[], files: ProjectFile[], preview: string) => {
// // // //     try {
// // // //       // Don't save if no messages
// // // //       if (newMessages.length === 0) return;

// // // //       const chatData = {
// // // //         id: chatId,
// // // //         title: projectName,
// // // //         timestamp: new Date().toISOString(),
// // // //         messages: newMessages,
// // // //         files: files,
// // // //         previewUrl: preview,
// // // //         applicationType: applicationType,
// // // //         userId: user?.id,
// // // //         isSaved: false
// // // //       };

// // // //       // Save individual chat
// // // //       localStorage.setItem(`chat_${user?.id}_${chatId}`, JSON.stringify(chatData));

// // // //       // Update global chat history
// // // //       const allChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
// // // //       const existingIndex = allChats.findIndex((c: any) => c.id === chatId);

// // // //       if (existingIndex >= 0) {
// // // //         allChats[existingIndex] = chatData;
// // // //       } else {
// // // //         allChats.unshift(chatData);
// // // //       }

// // // //       localStorage.setItem('chatHistory', JSON.stringify(allChats));
// // // //     } catch (error) {
// // // //       console.error('Error saving chat history:', error);
// // // //     }
// // // //   };

// // // // //   // ==================== PROJECT GENERATION ====================

// // // // //   const generateProject = async (userRequest: string): Promise<{ files: ProjectFile[], previewUrl: string }> => {
// // // // //     // Simulate AI processing
// // // // //     await new Promise(resolve => setTimeout(resolve, 2000));

// // // // //     // Detect project type
// // // // //     const isReactApp = /react|component|jsx|tsx|hooks/i.test(userRequest);
// // // // //     const isVanillaJS = /javascript|vanilla|dom|interactive/i.test(userRequest);
// // // // //     const isHTMLCSS = /html|css|webpage|landing|website/i.test(userRequest);
// // // // //     const isTodoApp = /todo|task|list/i.test(userRequest);
// // // // //     const isCalculator = /calculator|calc/i.test(userRequest);
// // // // //     const isGame = /game|tic-tac-toe|snake/i.test(userRequest);

// // // // //     let files: ProjectFile[] = [];
// // // // //     let appType: 'web' | 'mobile' | 'desktop' = 'web';

// // // // //     if (isTodoApp) {
// // // // //       files = isReactApp ? generateReactTodoApp() : generateVanillaTodoApp();
// // // // //     } else if (isCalculator) {
// // // // //       files = generateCalculatorApp();
// // // // //     } else if (isGame) {
// // // // //       files = generateGameApp();
// // // // //     } else if (isReactApp) {
// // // // //       files = generateReactProject(userRequest);
// // // // //     } else if (isVanillaJS) {
// // // // //       files = generateVanillaJSProject(userRequest);
// // // // //     } else if (isHTMLCSS) {
// // // // //       files = generateHTMLCSSProject(userRequest);
// // // // //     } else {
// // // // //       files = generateSimpleWebProject(userRequest);
// // // // //     }

// // // // //     setApplicationType(appType);

// // // // //     // Generate preview URL
// // // // //     const htmlFile = files.find(f => f.name.endsWith('.html'));
// // // // //     let preview = '';

// // // // //     if (htmlFile) {
// // // // //       preview = generatePreviewURL(files, htmlFile);
// // // // //     }

// // // // //     return { files, previewUrl: preview };
// // // // //   };

// // // // //   // ==================== PROJECT TEMPLATES ====================

// // // // //   const generateReactTodoApp = (): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'package.json',
// // // // //         path: 'package.json',
// // // // //         language: 'json',
// // // // //         content: JSON.stringify({
// // // // //           name: 'react-todo-app',
// // // // //           version: '1.0.0',
// // // // //           dependencies: {
// // // // //             react: '^18.2.0',
// // // // //             'react-dom': '^18.2.0'
// // // // //           }
// // // // //         }, null, 2)
// // // // //       },
// // // // //       {
// // // // //         name: 'App.jsx',
// // // // //         path: 'src/App.jsx',
// // // // //         language: 'jsx',
// // // // //         content: `import React, { useState } from 'react';
// // // // // import './App.css';

// // // // // function App() {
// // // // //   const [todos, setTodos] = useState([]);
// // // // //   const [input, setInput] = useState('');

// // // // //   const addTodo = () => {
// // // // //     if (input.trim()) {
// // // // //       setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
// // // // //       setInput('');
// // // // //     }
// // // // //   };

// // // // //   const toggleTodo = (id) => {
// // // // //     setTodos(todos.map(todo => 
// // // // //       todo.id === id ? { ...todo, completed: !todo.completed } : todo
// // // // //     ));
// // // // //   };

// // // // //   const deleteTodo = (id) => {
// // // // //     setTodos(todos.filter(todo => todo.id !== id));
// // // // //   };

// // // // //   return (
// // // // //     <div className="App">
// // // // //       <div className="container">
// // // // //         <h1>📝 My Todo List</h1>
// // // // //         <div className="input-container">
// // // // //           <input
// // // // //             type="text"
// // // // //             value={input}
// // // // //             onChange={(e) => setInput(e.target.value)}
// // // // //             onKeyPress={(e) => e.key === 'Enter' && addTodo()}
// // // // //             placeholder="Add a new task..."
// // // // //           />
// // // // //           <button onClick={addTodo}>Add</button>
// // // // //         </div>
// // // // //         <ul className="todo-list">
// // // // //           {todos.map(todo => (
// // // // //             <li key={todo.id} className={todo.completed ? 'completed' : ''}>
// // // // //               <input
// // // // //                 type="checkbox"
// // // // //                 checked={todo.completed}
// // // // //                 onChange={() => toggleTodo(todo.id)}
// // // // //               />
// // // // //               <span>{todo.text}</span>
// // // // //               <button className="delete" onClick={() => deleteTodo(todo.id)}>🗑️</button>
// // // // //             </li>
// // // // //           ))}
// // // // //         </ul>
// // // // //         {todos.length === 0 && (
// // // // //           <p className="empty">No tasks yet. Add one above!</p>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;`
// // // // //       },
// // // // //       {
// // // // //         name: 'App.css',
// // // // //         path: 'src/App.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // .App {
// // // // //   min-height: 100vh;
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   padding: 20px;
// // // // // }

// // // // // .container {
// // // // //   background: white;
// // // // //   border-radius: 20px;
// // // // //   padding: 40px;
// // // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
// // // // //   max-width: 500px;
// // // // //   width: 100%;
// // // // // }

// // // // // h1 {
// // // // //   text-align: center;
// // // // //   color: #333;
// // // // //   margin-bottom: 30px;
// // // // // }

// // // // // .input-container {
// // // // //   display: flex;
// // // // //   gap: 10px;
// // // // //   margin-bottom: 30px;
// // // // // }

// // // // // input[type="text"] {
// // // // //   flex: 1;
// // // // //   padding: 12px;
// // // // //   border: 2px solid #e0e0e0;
// // // // //   border-radius: 8px;
// // // // //   font-size: 14px;
// // // // //   outline: none;
// // // // //   transition: border 0.3s;
// // // // // }

// // // // // input[type="text"]:focus {
// // // // //   border-color: #667eea;
// // // // // }

// // // // // button {
// // // // //   padding: 12px 24px;
// // // // //   background: #667eea;
// // // // //   color: white;
// // // // //   border: none;
// // // // //   border-radius: 8px;
// // // // //   cursor: pointer;
// // // // //   font-size: 14px;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // button:hover {
// // // // //   background: #764ba2;
// // // // //   transform: translateY(-2px);
// // // // // }

// // // // // .todo-list {
// // // // //   list-style: none;
// // // // // }

// // // // // .todo-list li {
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   gap: 12px;
// // // // //   padding: 15px;
// // // // //   background: #f8f9fa;
// // // // //   border-radius: 8px;
// // // // //   margin-bottom: 10px;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // .todo-list li:hover {
// // // // //   transform: translateX(5px);
// // // // //   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// // // // // }

// // // // // .todo-list li.completed span {
// // // // //   text-decoration: line-through;
// // // // //   color: #999;
// // // // // }

// // // // // .todo-list li input[type="checkbox"] {
// // // // //   width: 20px;
// // // // //   height: 20px;
// // // // //   cursor: pointer;
// // // // // }

// // // // // .todo-list li span {
// // // // //   flex: 1;
// // // // //   color: #333;
// // // // // }

// // // // // .todo-list li button.delete {
// // // // //   background: #ff6b6b;
// // // // //   padding: 6px 12px;
// // // // //   font-size: 16px;
// // // // // }

// // // // // .todo-list li button.delete:hover {
// // // // //   background: #ff5252;
// // // // // }

// // // // // .empty {
// // // // //   text-align: center;
// // // // //   color: #999;
// // // // //   padding: 40px 0;
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'public/index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>React Todo App - CodeAlchemy</title>
// // // // // </head>
// // // // // <body>
// // // // //   <div id="root"></div>
// // // // // </body>
// // // // // </html>`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateVanillaTodoApp = (): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>Todo App - CodeAlchemy</title>
// // // // //   <link rel="stylesheet" href="style.css">
// // // // // </head>
// // // // // <body>
// // // // //   <div class="container">
// // // // //     <h1>📝 My Todo List</h1>
// // // // //     <div class="input-container">
// // // // //       <input type="text" id="todoInput" placeholder="Add a new task...">
// // // // //       <button id="addBtn">Add</button>
// // // // //     </div>
// // // // //     <ul id="todoList" class="todo-list"></ul>
// // // // //     <p id="emptyMessage" class="empty">No tasks yet. Add one above!</p>
// // // // //   </div>
// // // // //   <script src="script.js"></script>
// // // // // </body>
// // // // // </html>`
// // // // //       },
// // // // //       {
// // // // //         name: 'style.css',
// // // // //         path: 'style.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // body {
// // // // //   min-height: 100vh;
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   padding: 20px;
// // // // // }

// // // // // .container {
// // // // //   background: white;
// // // // //   border-radius: 20px;
// // // // //   padding: 40px;
// // // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
// // // // //   max-width: 500px;
// // // // //   width: 100%;
// // // // // }

// // // // // h1 {
// // // // //   text-align: center;
// // // // //   color: #333;
// // // // //   margin-bottom: 30px;
// // // // // }

// // // // // .input-container {
// // // // //   display: flex;
// // // // //   gap: 10px;
// // // // //   margin-bottom: 30px;
// // // // // }

// // // // // input[type="text"] {
// // // // //   flex: 1;
// // // // //   padding: 12px;
// // // // //   border: 2px solid #e0e0e0;
// // // // //   border-radius: 8px;
// // // // //   font-size: 14px;
// // // // //   outline: none;
// // // // //   transition: border 0.3s;
// // // // // }

// // // // // input[type="text"]:focus {
// // // // //   border-color: #667eea;
// // // // // }

// // // // // button {
// // // // //   padding: 12px 24px;
// // // // //   background: #667eea;
// // // // //   color: white;
// // // // //   border: none;
// // // // //   border-radius: 8px;
// // // // //   cursor: pointer;
// // // // //   font-size: 14px;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // button:hover {
// // // // //   background: #764ba2;
// // // // //   transform: translateY(-2px);
// // // // // }

// // // // // .todo-list {
// // // // //   list-style: none;
// // // // // }

// // // // // .todo-item {
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   gap: 12px;
// // // // //   padding: 15px;
// // // // //   background: #f8f9fa;
// // // // //   border-radius: 8px;
// // // // //   margin-bottom: 10px;
// // // // //   transition: all 0.3s;
// // // // //   animation: slideIn 0.3s;
// // // // // }

// // // // // @keyframes slideIn {
// // // // //   from {
// // // // //     opacity: 0;
// // // // //     transform: translateY(-10px);
// // // // //   }
// // // // //   to {
// // // // //     opacity: 1;
// // // // //     transform: translateY(0);
// // // // //   }
// // // // // }

// // // // // .todo-item:hover {
// // // // //   transform: translateX(5px);
// // // // //   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// // // // // }

// // // // // .todo-item.completed span {
// // // // //   text-decoration: line-through;
// // // // //   color: #999;
// // // // // }

// // // // // .todo-item input[type="checkbox"] {
// // // // //   width: 20px;
// // // // //   height: 20px;
// // // // //   cursor: pointer;
// // // // // }

// // // // // .todo-item span {
// // // // //   flex: 1;
// // // // //   color: #333;
// // // // // }

// // // // // .todo-item button {
// // // // //   background: #ff6b6b;
// // // // //   padding: 6px 12px;
// // // // //   font-size: 16px;
// // // // // }

// // // // // .todo-item button:hover {
// // // // //   background: #ff5252;
// // // // // }

// // // // // .empty {
// // // // //   text-align: center;
// // // // //   color: #999;
// // // // //   padding: 40px 0;
// // // // //   display: none;
// // // // // }

// // // // // .empty.show {
// // // // //   display: block;
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'script.js',
// // // // //         path: 'script.js',
// // // // //         language: 'javascript',
// // // // //         content: `let todos = [];

// // // // // const todoInput = document.getElementById('todoInput');
// // // // // const addBtn = document.getElementById('addBtn');
// // // // // const todoList = document.getElementById('todoList');
// // // // // const emptyMessage = document.getElementById('emptyMessage');

// // // // // function render() {
// // // // //   todoList.innerHTML = '';
  
// // // // //   if (todos.length === 0) {
// // // // //     emptyMessage.classList.add('show');
// // // // //   } else {
// // // // //     emptyMessage.classList.remove('show');
    
// // // // //     todos.forEach(todo => {
// // // // //       const li = document.createElement('li');
// // // // //       li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      
// // // // //       const checkbox = document.createElement('input');
// // // // //       checkbox.type = 'checkbox';
// // // // //       checkbox.checked = todo.completed;
// // // // //       checkbox.addEventListener('change', () => toggleTodo(todo.id));
      
// // // // //       const span = document.createElement('span');
// // // // //       span.textContent = todo.text;
      
// // // // //       const deleteBtn = document.createElement('button');
// // // // //       deleteBtn.textContent = '🗑️';
// // // // //       deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
      
// // // // //       li.appendChild(checkbox);
// // // // //       li.appendChild(span);
// // // // //       li.appendChild(deleteBtn);
// // // // //       todoList.appendChild(li);
// // // // //     });
// // // // //   }
// // // // // }

// // // // // function addTodo() {
// // // // //   const text = todoInput.value.trim();
// // // // //   if (text) {
// // // // //     todos.push({
// // // // //       id: Date.now(),
// // // // //       text: text,
// // // // //       completed: false
// // // // //     });
// // // // //     todoInput.value = '';
// // // // //     render();
// // // // //   }
// // // // // }

// // // // // function toggleTodo(id) {
// // // // //   todos = todos.map(todo => 
// // // // //     todo.id === id ? { ...todo, completed: !todo.completed } : todo
// // // // //   );
// // // // //   render();
// // // // // }

// // // // // function deleteTodo(id) {
// // // // //   todos = todos.filter(todo => todo.id !== id);
// // // // //   render();
// // // // // }

// // // // // addBtn.addEventListener('click', addTodo);
// // // // // todoInput.addEventListener('keypress', (e) => {
// // // // //   if (e.key === 'Enter') addTodo();
// // // // // });

// // // // // render();`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateCalculatorApp = (): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>Calculator - CodeAlchemy</title>
// // // // //   <link rel="stylesheet" href="style.css">
// // // // // </head>
// // // // // <body>
// // // // //   <div class="calculator">
// // // // //     <div class="display" id="display">0</div>
// // // // //     <div class="buttons">
// // // // //       <button class="btn clear" onclick="clearDisplay()">C</button>
// // // // //       <button class="btn operator" onclick="appendOperator('/')">/</button>
// // // // //       <button class="btn operator" onclick="appendOperator('*')">*</button>
// // // // //       <button class="btn operator" onclick="deleteChar()">←</button>
      
// // // // //       <button class="btn" onclick="appendNumber('7')">7</button>
// // // // //       <button class="btn" onclick="appendNumber('8')">8</button>
// // // // //       <button class="btn" onclick="appendNumber('9')">9</button>
// // // // //       <button class="btn operator" onclick="appendOperator('-')">-</button>
      
// // // // //       <button class="btn" onclick="appendNumber('4')">4</button>
// // // // //       <button class="btn" onclick="appendNumber('5')">5</button>
// // // // //       <button class="btn" onclick="appendNumber('6')">6</button>
// // // // //       <button class="btn operator" onclick="appendOperator('+')">+</button>
      
// // // // //       <button class="btn" onclick="appendNumber('1')">1</button>
// // // // //       <button class="btn" onclick="appendNumber('2')">2</button>
// // // // //       <button class="btn" onclick="appendNumber('3')">3</button>
// // // // //       <button class="btn equals" onclick="calculate()" style="grid-row: span 2">=</button>
      
// // // // //       <button class="btn" onclick="appendNumber('0')" style="grid-column: span 2">0</button>
// // // // //       <button class="btn" onclick="appendNumber('.')">.</button>
// // // // //     </div>
// // // // //   </div>
// // // // //   <script src="script.js"></script>
// // // // // </body>
// // // // // </html>`
// // // // //       },
// // // // //       {
// // // // //         name: 'style.css',
// // // // //         path: 'style.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // body {
// // // // //   min-height: 100vh;
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   padding: 20px;
// // // // // }

// // // // // .calculator {
// // // // //   background: #2d2d2d;
// // // // //   border-radius: 20px;
// // // // //   padding: 20px;
// // // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
// // // // //   max-width: 350px;
// // // // //   width: 100%;
// // // // // }

// // // // // .display {
// // // // //   background: #1a1a1a;
// // // // //   color: white;
// // // // //   font-size: 48px;
// // // // //   padding: 30px 20px;
// // // // //   border-radius: 10px;
// // // // //   text-align: right;
// // // // //   margin-bottom: 20px;
// // // // //   overflow: hidden;
// // // // //   min-height: 100px;
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: flex-end;
// // // // // }

// // // // // .buttons {
// // // // //   display: grid;
// // // // //   grid-template-columns: repeat(4, 1fr);
// // // // //   gap: 10px;
// // // // // }

// // // // // .btn {
// // // // //   padding: 25px;
// // // // //   font-size: 24px;
// // // // //   border: none;
// // // // //   border-radius: 10px;
// // // // //   cursor: pointer;
// // // // //   transition: all 0.2s;
// // // // //   background: #404040;
// // // // //   color: white;
// // // // // }

// // // // // .btn:hover {
// // // // //   background: #505050;
// // // // //   transform: scale(1.05);
// // // // // }

// // // // // .btn:active {
// // // // //   transform: scale(0.95);
// // // // // }

// // // // // .btn.operator {
// // // // //   background: #ff9500;
// // // // // }

// // // // // .btn.operator:hover {
// // // // //   background: #ffaa33;
// // // // // }

// // // // // .btn.clear {
// // // // //   background: #d32f2f;
// // // // // }

// // // // // .btn.clear:hover {
// // // // //   background: #e53935;
// // // // // }

// // // // // .btn.equals {
// // // // //   background: #4caf50;
// // // // // }

// // // // // .btn.equals:hover {
// // // // //   background: #66bb6a;
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'script.js',
// // // // //         path: 'script.js',
// // // // //         language: 'javascript',
// // // // //         content: `let currentValue = '0';
// // // // // let previousValue = '';
// // // // // let operator = '';

// // // // // const display = document.getElementById('display');

// // // // // function updateDisplay() {
// // // // //   display.textContent = currentValue;
// // // // // }

// // // // // function appendNumber(num) {
// // // // //   if (currentValue === '0') {
// // // // //     currentValue = num;
// // // // //   } else {
// // // // //     currentValue += num;
// // // // //   }
// // // // //   updateDisplay();
// // // // // }

// // // // // function appendOperator(op) {
// // // // //   if (previousValue && currentValue && operator) {
// // // // //     calculate();
// // // // //   }
// // // // //   previousValue = currentValue;
// // // // //   operator = op;
// // // // //   currentValue = '0';
// // // // // }

// // // // // function calculate() {
// // // // //   if (!previousValue || !operator) return;
  
// // // // //   const prev = parseFloat(previousValue);
// // // // //   const current = parseFloat(currentValue);
// // // // //   let result = 0;
  
// // // // //   switch (operator) {
// // // // //     case '+':
// // // // //       result = prev + current;
// // // // //       break;
// // // // //     case '-':
// // // // //       result = prev - current;
// // // // //       break;
// // // // //     case '*':
// // // // //       result = prev * current;
// // // // //       break;
// // // // //     case '/':
// // // // //       result = prev / current;
// // // // //       break;
// // // // //   }
  
// // // // //   currentValue = result.toString();
// // // // //   operator = '';
// // // // //   previousValue = '';
// // // // //   updateDisplay();
// // // // // }

// // // // // function clearDisplay() {
// // // // //   currentValue = '0';
// // // // //   previousValue = '';
// // // // //   operator = '';
// // // // //   updateDisplay();
// // // // // }

// // // // // function deleteChar() {
// // // // //   if (currentValue.length > 1) {
// // // // //     currentValue = currentValue.slice(0, -1);
// // // // //   } else {
// // // // //     currentValue = '0';
// // // // //   }
// // // // //   updateDisplay();
// // // // // }

// // // // // updateDisplay();`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateGameApp = (): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>Tic Tac Toe - CodeAlchemy</title>
// // // // //   <link rel="stylesheet" href="style.css">
// // // // // </head>
// // // // // <body>
// // // // //   <div class="game-container">
// // // // //     <h1>🎮 Tic Tac Toe</h1>
// // // // //     <div class="status" id="status">Player X's Turn</div>
// // // // //     <div class="board" id="board">
// // // // //       <div class="cell" data-index="0"></div>
// // // // //       <div class="cell" data-index="1"></div>
// // // // //       <div class="cell" data-index="2"></div>
// // // // //       <div class="cell" data-index="3"></div>
// // // // //       <div class="cell" data-index="4"></div>
// // // // //       <div class="cell" data-index="5"></div>
// // // // //       <div class="cell" data-index="6"></div>
// // // // //       <div class="cell" data-index="7"></div>
// // // // //       <div class="cell" data-index="8"></div>
// // // // //     </div>
// // // // //     <button class="reset-btn" id="resetBtn">New Game</button>
// // // // //   </div>
// // // // //   <script src="script.js"></script>
// // // // // </body>
// // // // // </html>`
// // // // //       },
// // // // //       {
// // // // //         name: 'style.css',
// // // // //         path: 'style.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // body {
// // // // //   min-height: 100vh;
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   padding: 20px;
// // // // // }

// // // // // .game-container {
// // // // //   background: white;
// // // // //   border-radius: 20px;
// // // // //   padding: 40px;
// // // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
// // // // //   text-align: center;
// // // // // }

// // // // // h1 {
// // // // //   color: #333;
// // // // //   margin-bottom: 20px;
// // // // // }

// // // // // .status {
// // // // //   font-size: 24px;
// // // // //   font-weight: bold;
// // // // //   color: #667eea;
// // // // //   margin-bottom: 30px;
// // // // //   min-height: 32px;
// // // // // }

// // // // // .board {
// // // // //   display: grid;
// // // // //   grid-template-columns: repeat(3, 120px);
// // // // //   grid-template-rows: repeat(3, 120px);
// // // // //   gap: 10px;
// // // // //   margin: 0 auto 30px;
// // // // //   width: fit-content;
// // // // // }

// // // // // .cell {
// // // // //   background: #f8f9fa;
// // // // //   border-radius: 10px;
// // // // //   cursor: pointer;
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-size: 64px;
// // // // //   font-weight: bold;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // .cell:hover:not(.taken) {
// // // // //   background: #e9ecef;
// // // // //   transform: scale(1.05);
// // // // // }

// // // // // .cell.taken {
// // // // //   cursor: not-allowed;
// // // // // }

// // // // // .cell.x {
// // // // //   color: #667eea;
// // // // // }

// // // // // .cell.o {
// // // // //   color: #ff6b6b;
// // // // // }

// // // // // .cell.winner {
// // // // //   background: #ffd93d;
// // // // //   animation: pulse 0.5s infinite;
// // // // // }

// // // // // @keyframes pulse {
// // // // //   0%, 100% {
// // // // //     transform: scale(1);
// // // // //   }
// // // // //   50% {
// // // // //     transform: scale(1.1);
// // // // //   }
// // // // // }

// // // // // .reset-btn {
// // // // //   padding: 15px 40px;
// // // // //   font-size: 18px;
// // // // //   background: #667eea;
// // // // //   color: white;
// // // // //   border: none;
// // // // //   border-radius: 10px;
// // // // //   cursor: pointer;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // .reset-btn:hover {
// // // // //   background: #764ba2;
// // // // //   transform: translateY(-2px);
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'script.js',
// // // // //         path: 'script.js',
// // // // //         language: 'javascript',
// // // // //         content: `let currentPlayer = 'X';
// // // // // let board = ['', '', '', '', '', '', '', '', ''];
// // // // // let gameActive = true;

// // // // // const status = document.getElementById('status');
// // // // // const cells = document.querySelectorAll('.cell');
// // // // // const resetBtn = document.getElementById('resetBtn');

// // // // // const winningConditions = [
// // // // //   [0, 1, 2],
// // // // //   [3, 4, 5],
// // // // //   [6, 7, 8],
// // // // //   [0, 3, 6],
// // // // //   [1, 4, 7],
// // // // //   [2, 5, 8],
// // // // //   [0, 4, 8],
// // // // //   [2, 4, 6]
// // // // // ];

// // // // // function handleCellClick(e) {
// // // // //   const cell = e.target;
// // // // //   const index = cell.getAttribute('data-index');
  
// // // // //   if (board[index] !== '' || !gameActive) return;
  
// // // // //   board[index] = currentPlayer;
// // // // //   cell.textContent = currentPlayer;
// // // // //   cell.classList.add('taken', currentPlayer.toLowerCase());
  
// // // // //   checkResult();
// // // // // }

// // // // // function checkResult() {
// // // // //   let roundWon = false;
// // // // //   let winningCombination = [];
  
// // // // //   for (let i = 0; i < winningConditions.length; i++) {
// // // // //     const [a, b, c] = winningConditions[i];
// // // // //     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
// // // // //       roundWon = true;
// // // // //       winningCombination = [a, b, c];
// // // // //       break;
// // // // //     }
// // // // //   }
  
// // // // //   if (roundWon) {
// // // // //     status.textContent = \`Player \${currentPlayer} Wins! 🎉\`;
// // // // //     gameActive = false;
// // // // //     winningCombination.forEach(index => {
// // // // //       cells[index].classList.add('winner');
// // // // //     });
// // // // //     return;
// // // // //   }
  
// // // // //   if (!board.includes('')) {
// // // // //     status.textContent = "It's a Draw! 🤝";
// // // // //     gameActive = false;
// // // // //     return;
// // // // //   }
  
// // // // //   currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
// // // // //   status.textContent = \`Player \${currentPlayer}'s Turn\`;
// // // // // }

// // // // // function resetGame() {
// // // // //   currentPlayer = 'X';
// // // // //   board = ['', '', '', '', '', '', '', '', ''];
// // // // //   gameActive = true;
// // // // //   status.textContent = "Player X's Turn";
  
// // // // //   cells.forEach(cell => {
// // // // //     cell.textContent = '';
// // // // //     cell.classList.remove('taken', 'x', 'o', 'winner');
// // // // //   });
// // // // // }

// // // // // cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// // // // // resetBtn.addEventListener('click', resetGame);`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateReactProject = (request: string): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'package.json',
// // // // //         path: 'package.json',
// // // // //         language: 'json',
// // // // //         content: JSON.stringify({
// // // // //           name: 'my-react-app',
// // // // //           version: '1.0.0',
// // // // //           dependencies: {
// // // // //             react: '^18.2.0',
// // // // //             'react-dom': '^18.2.0'
// // // // //           },
// // // // //           scripts: {
// // // // //             start: 'react-scripts start',
// // // // //             build: 'react-scripts build'
// // // // //           }
// // // // //         }, null, 2)
// // // // //       },
// // // // //       {
// // // // //         name: 'App.jsx',
// // // // //         path: 'src/App.jsx',
// // // // //         language: 'jsx',
// // // // //         content: `import React, { useState } from 'react';
// // // // // import './App.css';

// // // // // function App() {
// // // // //   const [count, setCount] = useState(0);

// // // // //   return (
// // // // //     <div className="App">
// // // // //       <header className="App-header">
// // // // //         <h1>Welcome to Your React App</h1>
// // // // //         <p>Built with CodeAlchemy ⚗️</p>
// // // // //         <div className="counter">
// // // // //           <button onClick={() => setCount(count - 1)}>-</button>
// // // // //           <span>{count}</span>
// // // // //           <button onClick={() => setCount(count + 1)}>+</button>
// // // // //         </div>
// // // // //       </header>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;`
// // // // //       },
// // // // //       {
// // // // //         name: 'App.css',
// // // // //         path: 'src/App.css',
// // // // //         language: 'css',
// // // // //         content: `.App {
// // // // //   text-align: center;
// // // // // }

// // // // // .App-header {
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   min-height: 100vh;
// // // // //   display: flex;
// // // // //   flex-direction: column;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-size: calc(10px + 2vmin);
// // // // //   color: white;
// // // // // }

// // // // // .counter {
// // // // //   display: flex;
// // // // //   gap: 20px;
// // // // //   align-items: center;
// // // // //   margin-top: 30px;
// // // // // }

// // // // // .counter button {
// // // // //   padding: 10px 20px;
// // // // //   font-size: 24px;
// // // // //   border: none;
// // // // //   border-radius: 8px;
// // // // //   cursor: pointer;
// // // // //   background: rgba(255, 255, 255, 0.2);
// // // // //   color: white;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // .counter button:hover {
// // // // //   background: rgba(255, 255, 255, 0.3);
// // // // //   transform: scale(1.1);
// // // // // }

// // // // // .counter span {
// // // // //   font-size: 48px;
// // // // //   font-weight: bold;
// // // // //   min-width: 100px;
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'public/index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>React App - CodeAlchemy</title>
// // // // // </head>
// // // // // <body>
// // // // //   <div id="root"></div>
// // // // // </body>
// // // // // </html>`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateVanillaJSProject = (request: string): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>JavaScript App - CodeAlchemy</title>
// // // // //   <link rel="stylesheet" href="style.css">
// // // // // </head>
// // // // // <body>
// // // // //   <div class="container">
// // // // //     <h1>🎯 Interactive Counter</h1>
// // // // //     <div class="counter-display">
// // // // //       <span id="count">0</span>
// // // // //     </div>
// // // // //     <div class="controls">
// // // // //       <button id="decrease">-</button>
// // // // //       <button id="reset">Reset</button>
// // // // //       <button id="increase">+</button>
// // // // //     </div>
// // // // //   </div>
// // // // //   <script src="script.js"></script>
// // // // // </body>
// // // // // </html>`
// // // // //       },
// // // // //       {
// // // // //         name: 'style.css',
// // // // //         path: 'style.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // body {
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   min-height: 100vh;
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // // }

// // // // // .container {
// // // // //   background: white;
// // // // //   padding: 40px;
// // // // //   border-radius: 20px;
// // // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
// // // // //   text-align: center;
// // // // // }

// // // // // h1 {
// // // // //   color: #333;
// // // // //   margin-bottom: 30px;
// // // // // }

// // // // // .counter-display {
// // // // //   font-size: 72px;
// // // // //   font-weight: bold;
// // // // //   color: #667eea;
// // // // //   margin: 30px 0;
// // // // // }

// // // // // .controls {
// // // // //   display: flex;
// // // // //   gap: 15px;
// // // // //   justify-content: center;
// // // // // }

// // // // // button {
// // // // //   padding: 15px 30px;
// // // // //   font-size: 24px;
// // // // //   border: none;
// // // // //   border-radius: 10px;
// // // // //   cursor: pointer;
// // // // //   background: #667eea;
// // // // //   color: white;
// // // // //   transition: all 0.3s;
// // // // // }

// // // // // button:hover {
// // // // //   background: #764ba2;
// // // // //   transform: translateY(-2px);
// // // // // }

// // // // // button:active {
// // // // //   transform: translateY(0);
// // // // // }`
// // // // //       },
// // // // //       {
// // // // //         name: 'script.js',
// // // // //         path: 'script.js',
// // // // //         language: 'javascript',
// // // // //         content: `let count = 0;

// // // // // const countDisplay = document.getElementById('count');
// // // // // const decreaseBtn = document.getElementById('decrease');
// // // // // const resetBtn = document.getElementById('reset');
// // // // // const increaseBtn = document.getElementById('increase');

// // // // // function updateDisplay() {
// // // // //   countDisplay.textContent = count;
// // // // //   countDisplay.style.transform = 'scale(1.2)';
// // // // //   setTimeout(() => {
// // // // //     countDisplay.style.transform = 'scale(1)';
// // // // //   }, 200);
// // // // // }

// // // // // decreaseBtn.addEventListener('click', () => {
// // // // //   count--;
// // // // //   updateDisplay();
// // // // // });

// // // // // resetBtn.addEventListener('click', () => {
// // // // //   count = 0;
// // // // //   updateDisplay();
// // // // // });

// // // // // increaseBtn.addEventListener('click', () => {
// // // // //   count++;
// // // // //   updateDisplay();
// // // // // });

// // // // // updateDisplay();`
// // // // //       }
// // // // //     ];
// // // // //   };

// // // // //   const generateHTMLCSSProject = (request: string): ProjectFile[] => {
// // // // //     return [
// // // // //       {
// // // // //         name: 'index.html',
// // // // //         path: 'index.html',
// // // // //         language: 'html',
// // // // //         content: `<!DOCTYPE html>
// // // // // <html lang="en">
// // // // // <head>
// // // // //   <meta charset="UTF-8">
// // // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // // //   <title>Landing Page - CodeAlchemy</title>
// // // // //   <link rel="stylesheet" href="style.css">
// // // // // </head>
// // // // // <body>
// // // // //   <nav class="navbar">
// // // // //     <div class="nav-container">
// // // // //       <div class="logo">⚗️ CodeAlchemy</div>
// // // // //       <ul class="nav-menu">
// // // // //         <li><a href="#home">Home</a></li>
// // // // //         <li><a href="#features">Features</a></li>
// // // // //         <li><a href="#contact">Contact</a></li>
// // // // //       </ul>
// // // // //     </div>
// // // // //   </nav>

// // // // //   <section class="hero" id="home">
// // // // //     <div class="hero-content">
// // // // //       <h1 class="hero-title">Transform Ideas into Code Magic</h1>
// // // // //       <p class="hero-subtitle">Build, deploy, and scale your applications with AI-powered development</p>
// // // // //       <button class="cta-button">Get Started</button>
// // // // //     </div>
// // // // //   </section>

// // // // //   <section class="features" id="features">
// // // // //     <h2>Features</h2>
// // // // //     <div class="feature-grid">
// // // // //       <div class="feature-card">
// // // // //         <div class="feature-icon">🚀</div>
// // // // //         <h3>Instant Deployment</h3>
// // // // //         <p>Deploy your projects to the cloud with one click</p>
// // // // //       </div>
// // // // //       <div class="feature-card">
// // // // //         <div class="feature-icon">💬</div>
// // // // //         <h3>AI Chat Assistant</h3>
// // // // //         <p>Build applications through natural conversation</p>
// // // // //       </div>
// // // // //       <div class="feature-card">
// // // // //         <div class="feature-icon">🎨</div>
// // // // //         <h3>Beautiful UI</h3>
// // // // //         <p>Generate modern, responsive interfaces automatically</p>
// // // // //       </div>
// // // // //     </div>
// // // // //   </section>

// // // // //   <footer class="footer">
// // // // //     <p>&copy; 2025 CodeAlchemy. Built with ❤️</p>
// // // // //   </footer>
// // // // // </body>
// // // // // </html>`
// // // // //       },
// // // // //       {
// // // // //         name: 'style.css',
// // // // //         path: 'style.css',
// // // // //         language: 'css',
// // // // //         content: `* {
// // // // //   margin: 0;
// // // // //   padding: 0;
// // // // //   box-sizing: border-box;
// // // // // }

// // // // // body {
// // // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // // //   line-height: 1.6;
// // // // // }

// // // // // .navbar {
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   color: white;
// // // // //   padding: 1rem 0;
// // // // //   position: fixed;
// // // // //   width: 100%;
// // // // //   top: 0;
// // // // //   z-index: 1000;
// // // // // }

// // // // // .nav-container {
// // // // //   max-width: 1200px;
// // // // //   margin: 0 auto;
// // // // //   display: flex;
// // // // //   justify-content: space-between;
// // // // //   align-items: center;
// // // // //   padding: 0 2rem;
// // // // // }

// // // // // .logo {
// // // // //   font-size: 1.5rem;
// // // // //   font-weight: bold;
// // // // // }

// // // // // .nav-menu {
// // // // //   display: flex;
// // // // //   list-style: none;
// // // // //   gap: 2rem;
// // // // // }

// // // // // .nav-menu a {
// // // // //   color: white;
// // // // //   text-decoration: none;
// // // // //   transition: opacity 0.3s;
// // // // // }

// // // // // .nav-menu a:hover {
// // // // //   opacity: 0.8;
// // // // // }

// // // // // .hero {
// // // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // // //   color: white;
// // // // //   min-height: 100vh;
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   text-align: center;
// // // // //   padding: 2rem;
// // // // // }

// // // // // .hero-content {
// // // // //   max-width: 800px;
// // // // // }

// // // // // .hero-title {
// // // // //   font-size: 3rem;
// // // // //   margin-bottom: 1rem;
// // // // //   animation: fadeInUp 1s;
// // // // // }

// // // // // .hero-subtitle {
// // // // //   font-size: 1.25rem;
// // // // //   margin-bottom: 2rem;
// // // // //   opacity: 0.9;
// // // // //   animation: fadeInUp 1s 0.2s backwards;
// // // // // }

// // // // // .cta-button {
// // // // //   padding: 1rem 2rem;
// // // // //   font-size: 1.1rem;
// // // // //   border: 2px solid white;
// // // // //   background: transparent;
// // // // //   color: white;
// // // // //   border-radius: 50px;
// // // // //   cursor: pointer;
// // // // //   transition: all 0.3s;
// // // // //   animation: fadeInUp 1s 0.4s backwards;
// // // // // }

// // // // // .cta-button:hover {
// // // // //   background: white;
// // // // //   color: #667eea;
// // // // //   transform: translateY(-2px);
// // // // // }

// // // // // .features {
// // // // //   padding: 4rem 2rem;
// // // // //   max-width: 1200px;
// // // // //   margin: 0 auto;
// // // // // }

// // // // // .features h2 {
// // // // //   text-align: center;
// // // // //   font-size: 2.5rem;
// // // // //   margin-bottom: 3rem;
// // // // //   color: #333;
// // // // // }

// // // // // .feature-grid {
// // // // //   display: grid;
// // // // //   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
// // // // //   gap: 2rem;
// // // // // }

// // // // // .feature-card {
// // // // //   padding: 2rem;
// // // // //   background: white;
// // // // //   border-radius: 15px;
// // // // //   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
// // // // //   text-align: center;
// // // // //   transition: transform 0.3s;
// // // // // }

// // // // // .feature-card:hover {
// // // // //   transform: translateY(-10px);
// // // // // }

// // // // // .feature-icon {
// // // // //   font-size: 3rem;
// // // // //   margin-bottom: 1rem;
// // // // // }

// // // // // .feature-card h3 {
// // // // //   color: #667eea;
// // // // //   margin-bottom: 0.5rem;
// // // // // }

// // // // // .footer {
// // // // //   background: #333;
// // // // //   color: white;
// // // // //   text-align: center;
// // // // //   padding: 2rem;
// // // // // }

// // // // // @keyframes fadeInUp {
// // // // //   from {
// // // // //     opacity: 0;
// // // // //     transform: translateY(30px);
// // // // //   }
// // // // //   to {
// // // // //     opacity: 1;
// // // // //     transform: translateY(0);
// // // // //   }
// // // // // }`
// // // // //       }
// // // // //     ];
// // // // //   };
// // // // // Remove all generateXXXApp functions and replace with just ChatInterface

// // // // // Keep your imports, state, and other functions, just update the render:

// // // // return (
// // // //   <div className="chat-page-enhanced">
// // // //     {/* Header */}
// // // //     <header className="page-header">
// // // //       <div className="header-left">
// // // //         <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // // //           ← Back
// // // //         </button>
// // // //         <h1>⚗️ CodeAlchemy</h1>
// // // //       </div>
// // // //       <div className="header-right">
// // // //         {projectFiles.length > 0 && (
// // // //           <span className="file-badge">{projectFiles.length} files</span>
// // // //         )}
// // // //       </div>
// // // //     </header>

// // // //     <div className="page-body">
// // // //       {/* File Explorer Sidebar */}
// // // //       <aside className="file-sidebar">
// // // //         <div className="sidebar-header">
// // // //           <h3>📂 Files</h3>
// // // //         </div>
        
// // // //         {projectFiles.length > 0 && (
// // // //           <div className="search-box">
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search files..."
// // // //               value={searchQuery}
// // // //               onChange={(e) => setSearchQuery(e.target.value)}
// // // //             />
// // // //           </div>
// // // //         )}

// // // //         <div className="file-tree">
// // // //           {projectFiles.length === 0 ? (
// // // //             <div className="no-files">
// // // //               <p>No files yet</p>
// // // //               <p className="hint">Start chatting to generate code</p>
// // // //             </div>
// // // //           ) : (
// // // //             renderFileTree(fileTree)
// // // //           )}
// // // //         </div>
// // // //       </aside>

// // // //       {/* Code Editor / Preview */}
// // // //       <section className="editor-section">
// // // //         <div className="editor-tabs">
// // // //           <button
// // // //             className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // // //             onClick={() => setActiveTab('code')}
// // // //           >
// // // //             💻 Code
// // // //           </button>
// // // //           <button
// // // //             className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // // //             onClick={() => setActiveTab('preview')}
// // // //             disabled={!previewUrl}
// // // //           >
// // // //             👁️ Preview
// // // //           </button>
          
// // // //           {selectedFile && activeTab === 'code' && (
// // // //             <div className="file-info">
// // // //               <span className="file-path">{selectedFile.path}</span>
// // // //               <span className="file-lang">{getLanguageLabel(selectedFile.language)}</span>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="editor-content">
// // // //           {activeTab === 'code' ? (
// // // //             <div className="code-viewer">
// // // //               {selectedFile ? (
// // // //                 <>
// // // //                   <pre className="code-block">
// // // //                     <code>{selectedFile.content}</code>
// // // //                   </pre>
// // // //                   <div className="code-actions">
// // // //                     <button onClick={() => {
// // // //                       navigator.clipboard.writeText(selectedFile.content);
// // // //                       alert('Copied!');
// // // //                     }}>
// // // //                       📋 Copy
// // // //                     </button>
// // // //                   </div>
// // // //                 </>
// // // //               ) : (
// // // //                 <div className="no-selection">
// // // //                   <p>Select a file to view contents</p>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <div className="preview-container">
// // // //               {previewUrl ? (
// // // //                 <iframe
// // // //                   src={previewUrl}
// // // //                   className="preview-frame"
// // // //                   sandbox="allow-scripts allow-same-origin allow-forms"
// // // //                   title="Live Preview"
// // // //                 />
// // // //               ) : (
// // // //                 <div className="no-preview">
// // // //                   <p>Preview not available</p>
// // // //                   <p className="hint">Generate files first</p>
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </section>

// // // //       {/* Chat Interface - MUST BE VISIBLE */}
// // // //       <aside className="chat-section">
// // // //         {chatId ? (
// // // //           <ChatInterface
// // // //             chatId={chatId}
// // // //             onProjectUpdate={(files, url) => {
// // // //               setProjectFiles(files);
// // // //               setPreviewUrl(url);
// // // //               if (files.length > 0) {
// // // //                 setSelectedFile(files[0]);
// // // //                 setActiveTab('preview'); // Auto-switch to preview
// // // //               }
// // // //             }}
// // // //           />
// // // //         ) : (
// // // //           <div style={{ padding: '20px', color: '#718096' }}>
// // // //             No chat ID
// // // //           </div>
// // // //         )}
// // // //       </aside>
// // // //     </div>
// // // //   </div>
// // // // );

// // // //   const generateSimpleWebProject = (request: string): ProjectFile[] => {
// // // //     return generateHTMLCSSProject(request);
// // // //   };

// // // //   const generatePreviewURL = (files: ProjectFile[], htmlFile: ProjectFile): string => {
// // // //     const cssFile = files.find(f => f.name.endsWith('.css'));
// // // //     const jsFile = files.find(f => f.name.endsWith('.js'));

// // // //     let htmlContent = htmlFile.content;

// // // //     // Inject CSS inline
// // // //     if (cssFile) {
// // // //       htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style></head>`);
// // // //     }

// // // //     // Inject JS inline
// // // //     if (jsFile) {
// // // //       htmlContent = htmlContent.replace('</body>', `<script>${jsFile.content}</script></body>`);
// // // //     }

// // // //     const blob = new Blob([htmlContent], { type: 'text/html' });
// // // //     return URL.createObjectURL(blob);
// // // //   };

// // // //   // ==================== MESSAGE HANDLING ====================

// // // //   const handleSendMessage = async () => {
// // // //     if (!input.trim() || isGenerating) return;

// // // //     const userMessage: Message = {
// // // //       id: Date.now().toString(),
// // // //       role: 'user',
// // // //       content: input.trim(),
// // // //       timestamp: new Date().toISOString()
// // // //     };

// // // //     const newMessages = [...messages, userMessage];
// // // //     setMessages(newMessages);
// // // //     setInput('');
// // // //     setIsGenerating(true);

// // // //     try {
// // // //       const { files, previewUrl: preview } = await generateProject(userMessage.content);

// // // //       setProjectFiles(files);
// // // //       setPreviewUrl(preview);

// // // //       // Auto-select first file
// // // //       if (files.length > 0) {
// // // //         setSelectedFile(files[0]);
// // // //       }

// // // //       // Update project name from first message
// // // //       if (messages.length === 0) {
// // // //         const title = userMessage.content.slice(0, 60) + (userMessage.content.length > 60 ? '...' : '');
// // // //         setProjectName(title);
// // // //       }

// // // //       const assistantMessage: Message = {
// // // //         id: (Date.now() + 1).toString(),
// // // //         role: 'assistant',
// // // //         content: `I've generated your project with ${files.length} files! 🎉\n\n✅ View the code in the editor\n✅ See the live preview\n✅ Download as ZIP\n✅ Deploy to AWS\n\nFiles: ${files.map(f => f.name).join(', ')}`,
// // // //         timestamp: new Date().toISOString(),
// // // //         files: files,
// // // //         previewUrl: preview
// // // //       };

// // // //       const finalMessages = [...newMessages, assistantMessage];
// // // //       setMessages(finalMessages);

// // // //       // Save and update Dashboard
// // // //       saveChatHistory(finalMessages, files, preview);

// // // //       // Switch to preview tab
// // // //       setActiveTab('preview');

// // // //     } catch (error) {
// // // //       console.error('Error generating project:', error);
// // // //       const errorMessage: Message = {
// // // //         id: (Date.now() + 1).toString(),
// // // //         role: 'assistant',
// // // //         content: 'Sorry, I encountered an error. Please try again.',
// // // //         timestamp: new Date().toISOString()
// // // //       };
// // // //       const finalMessages = [...newMessages, errorMessage];
// // // //       setMessages(finalMessages);
// // // //     } finally {
// // // //       setIsGenerating(false);
// // // //     }
// // // //   };

// // // //   // ==================== FILE OPERATIONS ====================

// // // //   const handleDownloadZip = async () => {
// // // //     if (projectFiles.length === 0) {
// // // //       alert('No files to download');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const JSZip = (await import('jszip')).default;
// // // //       const zip = new JSZip();

// // // //       projectFiles.forEach(file => {
// // // //         zip.file(file.path, file.content);
// // // //       });

// // // //       const blob = await zip.generateAsync({ type: 'blob' });
// // // //       const url = URL.createObjectURL(blob);
// // // //       const a = document.createElement('a');
// // // //       a.href = url;
// // // //       a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}.zip`;
// // // //       document.body.appendChild(a);
// // // //       a.click();
// // // //       document.body.removeChild(a);
// // // //       URL.revokeObjectURL(url);

// // // //     } catch (error) {
// // // //       console.error('Error creating zip:', error);
// // // //       alert('Error downloading project. Please try again.');
// // // //     }
// // // //   };

// // // //   const handleDeploy = () => {
// // // //     if (projectFiles.length === 0) {
// // // //       alert('Generate a project first before deploying');
// // // //       return;
// // // //     }

// // // //     navigate('/deploy', {
// // // //       state: {
// // // //         projectFiles,
// // // //         projectName,
// // // //         applicationType
// // // //       }
// // // //     });
// // // //   };

// // // //   // ==================== FILE TREE ====================

// // // //   const filteredFiles = useMemo(() => {
// // // //     if (!searchQuery.trim()) return projectFiles;
// // // //     const query = searchQuery.toLowerCase();
// // // //     return projectFiles.filter(
// // // //       (f) =>
// // // //         f.name.toLowerCase().includes(query) ||
// // // //         f.path.toLowerCase().includes(query)
// // // //     );
// // // //   }, [projectFiles, searchQuery]);

// // // //   const fileTree = useMemo(() => {
// // // //     const tree: any = {};

// // // //     filteredFiles.forEach(file => {
// // // //       const parts = file.path.split('/');
// // // //       let current = tree;

// // // //       parts.forEach((part, index) => {
// // // //         if (index === parts.length - 1) {
// // // //           if (!current._files) current._files = [];
// // // //           current._files.push(file);
// // // //         } else {
// // // //           if (!current[part]) {
// // // //             current[part] = {};
// // // //           }
// // // //           current = current[part];
// // // //         }
// // // //       });
// // // //     });

// // // //     return tree;
// // // //   }, [filteredFiles]);

// // // //   const toggleFolder = (path: string) => {
// // // //     setFileTreeExpanded(prev => ({
// // // //       ...prev,
// // // //       [path]: !prev[path]
// // // //     }));
// // // //   };

// // // //   const renderFileTree = (node: any, path: string = '', level: number = 0) => {
// // // //     const folders = Object.keys(node).filter(key => key !== '_files');
// // // //     const files = node._files || [];

// // // //     return (
// // // //       <>
// // // //         {folders.map(folderName => {
// // // //           const folderPath = path ? `${path}/${folderName}` : folderName;
// // // //           const isExpanded = fileTreeExpanded[folderPath] !== false;

// // // //           return (
// // // //             <div key={folderPath}>
// // // //               <div
// // // //                 className="file-tree-folder"
// // // //                 style={{ paddingLeft: `${level * 16}px` }}
// // // //                 onClick={() => toggleFolder(folderPath)}
// // // //               >
// // // //                 <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
// // // //                 <span className="folder-name">{folderName}</span>
// // // //               </div>
// // // //               {isExpanded && renderFileTree(node[folderName], folderPath, level + 1)}
// // // //             </div>
// // // //           );
// // // //         })}

// // // //         {files.map((file: ProjectFile) => (
// // // //           <div
// // // //             key={file.path}
// // // //             className={`file-tree-file ${selectedFile?.path === file.path ? 'active' : ''}`}
// // // //             style={{ paddingLeft: `${(level + 1) * 16}px` }}
// // // //             onClick={() => setSelectedFile(file)}
// // // //           >
// // // //             <span className="file-icon">{getFileIcon(file.name)}</span>
// // // //             <span className="file-name">{file.name}</span>
// // // //           </div>
// // // //         ))}
// // // //       </>
// // // //     );
// // // //   };

// // // //   const getFileIcon = (filename: string) => {
// // // //     const ext = filename.split('.').pop()?.toLowerCase();
// // // //     const icons: { [key: string]: string } = {
// // // //       'js': '📜',
// // // //       'jsx': '⚛️',
// // // //       'ts': '📘',
// // // //       'tsx': '⚛️',
// // // //       'json': '📋',
// // // //       'html': '🌐',
// // // //       'css': '🎨',
// // // //       'md': '📝',
// // // //       'env': '🔐',
// // // //       'gitignore': '🚫'
// // // //     };
// // // //     return icons[ext || ''] || '📄';
// // // //   };

// // // //   const getLanguageLabel = (lang: string) => {
// // // //     const labels: { [key: string]: string } = {
// // // //       'javascript': 'JavaScript',
// // // //       'jsx': 'React JSX',
// // // //       'typescript': 'TypeScript',
// // // //       'tsx': 'React TSX',
// // // //       'json': 'JSON',
// // // //       'html': 'HTML',
// // // //       'css': 'CSS',
// // // //       'markdown': 'Markdown'
// // // //     };
// // // //     return labels[lang] || lang.toUpperCase();
// // // //   };

// // // //   // ==================== RENDER ====================

// // // //   return (
// // // //     <div className="chat-page-enhanced">
// // // //       {/* Header */}
// // // //       <header className="page-header">
// // // //         <div className="header-left">
// // // //           <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // // //             ← Back
// // // //           </button>
// // // //           <h1>⚗️ CodeAlchemy</h1>
// // // //         </div>
// // // //         <div className="header-right">
// // // //           {projectFiles.length > 0 && (
// // // //             <>
// // // //               <span className="file-badge">{projectFiles.length} files</span>
// // // //               <button className="action-btn download" onClick={handleDownloadZip}>
// // // //                 📦 Download ZIP
// // // //               </button>
// // // //               <button className="action-btn deploy" onClick={handleDeploy}>
// // // //                 🚀 Deploy
// // // //               </button>
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       </header>

// // // //       <div className="page-body">
// // // //         {/* File Explorer Sidebar */}
// // // //         <aside className="file-sidebar">
// // // //           <div className="sidebar-header">
// // // //             <h3>📂 Files</h3>
// // // //           </div>

// // // //           {projectFiles.length > 0 && (
// // // //             <div className="search-box">
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Search files..."
// // // //                 value={searchQuery}
// // // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // // //               />
// // // //             </div>
// // // //           )}

// // // //           <div className="file-tree">
// // // //             {projectFiles.length === 0 ? (
// // // //               <div className="no-files">
// // // //                 <p>No files yet</p>
// // // //                 <p className="hint">Start chatting to generate code</p>
// // // //               </div>
// // // //             ) : (
// // // //               renderFileTree(fileTree)
// // // //             )}
// // // //           </div>
// // // //         </aside>

// // // //         {/* Code Editor / Preview */}
// // // //         <section className="editor-section">
// // // //           <div className="editor-tabs">
// // // //             <button
// // // //               className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('code')}
// // // //             >
// // // //               💻 Code
// // // //             </button>
// // // //             <button
// // // //               className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('preview')}
// // // //               disabled={!previewUrl}
// // // //               title={!previewUrl ? 'Generate files first' : 'Open preview'}
// // // //             >
// // // //               👁️ Preview
// // // //             </button>

// // // //             {selectedFile && activeTab === 'code' && (
// // // //               <div className="file-info">
// // // //                 <span className="file-path">{selectedFile.path}</span>
// // // //                 <span className="file-lang">{getLanguageLabel(selectedFile.language)}</span>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <div className="editor-content">
// // // //             {activeTab === 'code' ? (
// // // //               <div className="code-viewer">
// // // //                 {selectedFile ? (
// // // //                   <>
// // // //                     <pre className="code-block">
// // // //                       <code>{selectedFile.content}</code>
// // // //                     </pre>
// // // //                     <div className="code-actions">
// // // //                       <button
// // // //                         onClick={() => {
// // // //                           navigator.clipboard.writeText(selectedFile.content);
// // // //                           alert('Copied to clipboard!');
// // // //                         }}
// // // //                       >
// // // //                         📋 Copy Code
// // // //                       </button>
// // // //                     </div>
// // // //                   </>
// // // //                 ) : (
// // // //                   <div className="no-selection">
// // // //                     <p>Select a file to view its contents</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="preview-container">
// // // //                 {previewUrl ? (
// // // //                   <iframe
// // // //                     src={previewUrl}
// // // //                     className="preview-frame"
// // // //                     sandbox="allow-scripts allow-same-origin allow-forms"
// // // //                     title="Live Preview"
// // // //                   />
// // // //                 ) : (
// // // //                   <div className="no-preview">
// // // //                     <p>Preview not available</p>
// // // //                     <p className="hint">Generate files to see live preview</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         {/* Chat Interface */}
// // // //         <aside className="chat-section">
// // // //           <div className="chat-interface">
// // // //             <div className="chat-header">
// // // //               <h2>💬 Chat</h2>
// // // //             </div>

// // // //             <div className="messages-container">
// // // //               {messages.length === 0 && (
// // // //                 <div className="welcome-message">
// // // //                   <h3>👋 Welcome to CodeAlchemy!</h3>
// // // //                   <p>Describe your project and I'll help you build it.</p>
// // // //                   <div className="example-prompts">
// // // //                     <button onClick={() => setInput('Create a React todo app')}>
// // // //                       📝 React Todo App
// // // //                     </button>
// // // //                     <button onClick={() => setInput('Build a calculator')}>
// // // //                       🧮 Calculator
// // // //                     </button>
// // // //                     <button onClick={() => setInput('Make a tic-tac-toe game')}>
// // // //                       🎮 Tic Tac Toe Game
// // // //                     </button>
// // // //                     <button onClick={() => setInput('Create a landing page')}>
// // // //                       🌐 Landing Page
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               {messages.map(msg => (
// // // //                 <div key={msg.id} className={`message ${msg.role}`}>
// // // //                   <div className="message-avatar">
// // // //                     {msg.role === 'user' ? '👤' : '⚗️'}
// // // //                   </div>
// // // //                   <div className="message-content">
// // // //                     <div className="message-text">{msg.content}</div>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}

// // // //               {isGenerating && (
// // // //                 <div className="message assistant">
// // // //                   <div className="message-avatar">⚗️</div>
// // // //                   <div className="message-content">
// // // //                     <div className="typing-indicator">
// // // //                       <span></span>
// // // //                       <span></span>
// // // //                       <span></span>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               )}

// // // //               <div ref={messagesEndRef} />
// // // //             </div>

// // // //             <div className="chat-input-container">
// // // //               <input
// // // //                 type="text"
// // // //                 value={input}
// // // //                 onChange={(e) => setInput(e.target.value)}
// // // //                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // // //                 placeholder="Describe your project..."
// // // //                 disabled={isGenerating}
// // // //               />
// // // //               <button
// // // //                 onClick={handleSendMessage}
// // // //                 disabled={!input.trim() || isGenerating}
// // // //                 className="send-btn"
// // // //               >
// // // //                 {isGenerating ? '⏳' : '🚀'}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </aside>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ChatPage;




// // // // import React, { useState, useEffect, useMemo, useRef } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { useAuth } from '../contexts/AuthContext';
// // // // import './ChatPage.css';

// // // // export interface ProjectFile {
// // // //   name: string;
// // // //   path: string;
// // // //   content: string;
// // // //   language: string;
// // // // }

// // // // interface Message {
// // // //   id: string;
// // // //   role: 'user' | 'assistant';
// // // //   content: string;
// // // //   timestamp: string;
// // // //   files?: ProjectFile[];
// // // //   previewUrl?: string;
// // // // }

// // // // const ChatPage: React.FC = () => {
// // // //   const { chatId } = useParams<{ chatId: string }>();
// // // //   const navigate = useNavigate();
// // // //   const { user } = useAuth();
// // // //   const messagesEndRef = useRef<HTMLDivElement>(null);

// // // //   // State management
// // // //   const [messages, setMessages] = useState<Message[]>([]);
// // // //   const [input, setInput] = useState('');
// // // //   const [isGenerating, setIsGenerating] = useState(false);
// // // //   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
// // // //   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
// // // //   const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
// // // //   const [previewUrl, setPreviewUrl] = useState<string>('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [fileTreeExpanded, setFileTreeExpanded] = useState<{ [key: string]: boolean }>({});
// // // //   const [projectName, setProjectName] = useState('Untitled Project');
// // // //   const [applicationType, setApplicationType] = useState<'web' | 'mobile' | 'desktop'>('web');

// // // //   // Load chat history on mount
// // // //   useEffect(() => {
// // // //     if (chatId) {
// // // //       loadChatHistory();
// // // //     }
// // // //   }, [chatId]);

// // // //   // Auto-scroll messages
// // // //   useEffect(() => {
// // // //     scrollToBottom();
// // // //   }, [messages]);

// // // //   const scrollToBottom = () => {
// // // //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // // //   };

// // // //   const loadChatHistory = () => {
// // // //     try {
// // // //       const savedChat = localStorage.getItem(`chat_${user?.id}_${chatId}`);
// // // //       if (savedChat) {
// // // //         const parsed = JSON.parse(savedChat);
// // // //         setMessages(parsed.messages || []);
// // // //         setProjectFiles(parsed.files || []);
// // // //         setPreviewUrl(parsed.previewUrl || '');
// // // //         setProjectName(parsed.title || 'Untitled Project');
// // // //         setApplicationType(parsed.applicationType || 'web');

// // // //         if (parsed.files && parsed.files.length > 0) {
// // // //           setSelectedFile(parsed.files[0]);
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error loading chat history:', error);
// // // //     }
// // // //   };

// // // //   const saveChatHistory = (newMessages: Message[], files: ProjectFile[], preview: string) => {
// // // //     try {
// // // //       if (newMessages.length === 0) return;

// // // //       const chatData = {
// // // //         id: chatId,
// // // //         title: projectName,
// // // //         timestamp: new Date().toISOString(),
// // // //         messages: newMessages,
// // // //         files: files,
// // // //         previewUrl: preview,
// // // //         applicationType: applicationType,
// // // //         userId: user?.id,
// // // //         isSaved: false
// // // //       };

// // // //       localStorage.setItem(`chat_${user?.id}_${chatId}`, JSON.stringify(chatData));

// // // //       const allChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
// // // //       const existingIndex = allChats.findIndex((c: any) => c.id === chatId);

// // // //       if (existingIndex >= 0) {
// // // //         allChats[existingIndex] = chatData;
// // // //       } else {
// // // //         allChats.unshift(chatData);
// // // //       }

// // // //       localStorage.setItem('chatHistory', JSON.stringify(allChats));
// // // //     } catch (error) {
// // // //       console.error('Error saving chat history:', error);
// // // //     }
// // // //   };

// // // //   // ==================== PROJECT GENERATION ====================

// // // //   const generateProject = async (userRequest: string): Promise<{ files: ProjectFile[], previewUrl: string }> => {
// // // //     await new Promise(resolve => setTimeout(resolve, 2000));

// // // //     const isTodoApp = /todo|task|list/i.test(userRequest);
// // // //     const isCalculator = /calculator|calc/i.test(userRequest);
// // // //     const isGame = /game|tic-tac-toe|snake/i.test(userRequest);
// // // //     const isReactApp = /react|component|jsx|tsx|hooks/i.test(userRequest);

// // // //     let files: ProjectFile[] = [];

// // // //     if (isTodoApp) {
// // // //       files = isReactApp ? generateReactTodoApp() : generateVanillaTodoApp();
// // // //     } else if (isCalculator) {
// // // //       files = generateCalculatorApp();
// // // //     } else if (isGame) {
// // // //       files = generateGameApp();
// // // //     } else if (isReactApp) {
// // // //       files = generateReactProject(userRequest);
// // // //     } else {
// // // //       files = generateHTMLCSSProject(userRequest);
// // // //     }

// // // //     const htmlFile = files.find(f => f.name.endsWith('.html'));
// // // //     let preview = '';

// // // //     if (htmlFile) {
// // // //       preview = generatePreviewURL(files, htmlFile);
// // // //     }

// // // //     return { files, previewUrl: preview };
// // // //   };

// // // //   const generateReactTodoApp = (): ProjectFile[] => {
// // // //     return [
// // // //       {
// // // //         name: 'package.json',
// // // //         path: 'package.json',
// // // //         language: 'json',
// // // //         content: JSON.stringify({
// // // //           name: 'react-todo-app',
// // // //           version: '1.0.0',
// // // //           dependencies: {
// // // //             react: '^18.2.0',
// // // //             'react-dom': '^18.2.0'
// // // //           }
// // // //         }, null, 2)
// // // //       },
// // // //       {
// // // //         name: 'App.jsx',
// // // //         path: 'src/App.jsx',
// // // //         language: 'jsx',
// // // //         content: `import React, { useState } from 'react';
// // // // import './App.css';

// // // // function App() {
// // // //   const [todos, setTodos] = useState([]);
// // // //   const [input, setInput] = useState('');

// // // //   const addTodo = () => {
// // // //     if (input.trim()) {
// // // //       setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
// // // //       setInput('');
// // // //     }
// // // //   };

// // // //   const toggleTodo = (id) => {
// // // //     setTodos(todos.map(todo => 
// // // //       todo.id === id ? { ...todo, completed: !todo.completed } : todo
// // // //     ));
// // // //   };

// // // //   const deleteTodo = (id) => {
// // // //     setTodos(todos.filter(todo => todo.id !== id));
// // // //   };

// // // //   return (
// // // //     <div className="App">
// // // //       <div className="container">
// // // //         <h1>📝 My Todo List</h1>
// // // //         <div className="input-container">
// // // //           <input
// // // //             type="text"
// // // //             value={input}
// // // //             onChange={(e) => setInput(e.target.value)}
// // // //             onKeyPress={(e) => e.key === 'Enter' && addTodo()}
// // // //             placeholder="Add a new task..."
// // // //           />
// // // //           <button onClick={addTodo}>Add</button>
// // // //         </div>
// // // //         <ul className="todo-list">
// // // //           {todos.map(todo => (
// // // //             <li key={todo.id} className={todo.completed ? 'completed' : ''}>
// // // //               <input
// // // //                 type="checkbox"
// // // //                 checked={todo.completed}
// // // //                 onChange={() => toggleTodo(todo.id)}
// // // //               />
// // // //               <span>{todo.text}</span>
// // // //               <button className="delete" onClick={() => deleteTodo(todo.id)}>🗑️</button>
// // // //             </li>
// // // //           ))}
// // // //         </ul>
// // // //         {todos.length === 0 && (
// // // //           <p className="empty">No tasks yet. Add one above!</p>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;`
// // // //       },
// // // //       {
// // // //         name: 'index.html',
// // // //         path: 'public/index.html',
// // // //         language: 'html',
// // // //         content: `<!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //   <meta charset="UTF-8">
// // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // //   <title>React Todo App</title>
// // // // </head>
// // // // <body>
// // // //   <div id="root"></div>
// // // // </body>
// // // // </html>`
// // // //       }
// // // //     ];
// // // //   };

// // // //   const generateVanillaTodoApp = (): ProjectFile[] => {
// // // //     return [
// // // //       {
// // // //         name: 'index.html',
// // // //         path: 'index.html',
// // // //         language: 'html',
// // // //         content: `<!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //   <meta charset="UTF-8">
// // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // //   <title>Todo App</title>
// // // //   <link rel="stylesheet" href="style.css">
// // // // </head>
// // // // <body>
// // // //   <div class="container">
// // // //     <h1>📝 My Todo List</h1>
// // // //     <div class="input-container">
// // // //       <input type="text" id="todoInput" placeholder="Add a new task...">
// // // //       <button id="addBtn">Add</button>
// // // //     </div>
// // // //     <ul id="todoList" class="todo-list"></ul>
// // // //     <p id="emptyMessage" class="empty">No tasks yet. Add one above!</p>
// // // //   </div>
// // // //   <script src="script.js"></script>
// // // // </body>
// // // // </html>`
// // // //       },
// // // //       {
// // // //         name: 'style.css',
// // // //         path: 'style.css',
// // // //         language: 'css',
// // // //         content: `* {
// // // //   margin: 0;
// // // //   padding: 0;
// // // //   box-sizing: border-box;
// // // // }

// // // // body {
// // // //   min-height: 100vh;
// // // //   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// // // //   display: flex;
// // // //   align-items: center;
// // // //   justify-content: center;
// // // //   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // // //   padding: 20px;
// // // // }

// // // // .container {
// // // //   background: white;
// // // //   border-radius: 20px;
// // // //   padding: 40px;
// // // //   box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
// // // //   max-width: 500px;
// // // //   width: 100%;
// // // // }`
// // // //       },
// // // //       {
// // // //         name: 'script.js',
// // // //         path: 'script.js',
// // // //         language: 'javascript',
// // // //         content: `let todos = [];

// // // // const todoInput = document.getElementById('todoInput');
// // // // const addBtn = document.getElementById('addBtn');
// // // // const todoList = document.getElementById('todoList');
// // // // const emptyMessage = document.getElementById('emptyMessage');

// // // // function addTodo() {
// // // //   const text = todoInput.value.trim();
// // // //   if (text) {
// // // //     todos.push({
// // // //       id: Date.now(),
// // // //       text: text,
// // // //       completed: false
// // // //     });
// // // //     todoInput.value = '';
// // // //     render();
// // // //   }
// // // // }

// // // // function render() {
// // // //   // Render logic here
// // // // }

// // // // addBtn.addEventListener('click', addTodo);`
// // // //       }
// // // //     ];
// // // //   };

// // // //   const generateCalculatorApp = (): ProjectFile[] => {
// // // //     return [
// // // //       {
// // // //         name: 'index.html',
// // // //         path: 'index.html',
// // // //         language: 'html',
// // // //         content: `<!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //   <meta charset="UTF-8">
// // // //   <title>Calculator</title>
// // // //   <link rel="stylesheet" href="style.css">
// // // // </head>
// // // // <body>
// // // //   <div class="calculator">
// // // //     <div class="display" id="display">0</div>
// // // //     <div class="buttons">
// // // //       <!-- Calculator buttons -->
// // // //     </div>
// // // //   </div>
// // // //   <script src="script.js"></script>
// // // // </body>
// // // // </html>`
// // // //       }
// // // //     ];
// // // //   };

// // // //   const generateGameApp = (): ProjectFile[] => {
// // // //     return [
// // // //       {
// // // //         name: 'index.html',
// // // //         path: 'index.html',
// // // //         language: 'html',
// // // //         content: `<!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //   <meta charset="UTF-8">
// // // //   <title>Tic Tac Toe</title>
// // // //   <link rel="stylesheet" href="style.css">
// // // // </head>
// // // // <body>
// // // //   <div class="game-container">
// // // //     <h1>🎮 Tic Tac Toe</h1>
// // // //     <div class="board" id="board"></div>
// // // //   </div>
// // // //   <script src="script.js"></script>
// // // // </body>
// // // // </html>`
// // // //       }
// // // //     ];
// // // //   };

// // // //   const generateReactProject = (request: string): ProjectFile[] => {
// // // //     return generateReactTodoApp();
// // // //   };

// // // //   const generateHTMLCSSProject = (request: string): ProjectFile[] => {
// // // //     return [
// // // //       {
// // // //         name: 'index.html',
// // // //         path: 'index.html',
// // // //         language: 'html',
// // // //         content: `<!DOCTYPE html>
// // // // <html lang="en">
// // // // <head>
// // // //   <meta charset="UTF-8">
// // // //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // // //   <title>Landing Page</title>
// // // //   <link rel="stylesheet" href="style.css">
// // // // </head>
// // // // <body>
// // // //   <header>
// // // //     <h1>Welcome</h1>
// // // //   </header>
// // // // </body>
// // // // </html>`
// // // //       }
// // // //     ];
// // // //   };

// // // //   const generatePreviewURL = (files: ProjectFile[], htmlFile: ProjectFile): string => {
// // // //     const cssFile = files.find(f => f.name.endsWith('.css'));
// // // //     const jsFile = files.find(f => f.name.endsWith('.js'));

// // // //     let htmlContent = htmlFile.content;

// // // //     if (cssFile) {
// // // //       htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style></head>`);
// // // //     }

// // // //     if (jsFile) {
// // // //       htmlContent = htmlContent.replace('</body>', `<script>${jsFile.content}</script></body>`);
// // // //     }

// // // //     const blob = new Blob([htmlContent], { type: 'text/html' });
// // // //     return URL.createObjectURL(blob);
// // // //   };

// // // //   // ==================== MESSAGE HANDLING ====================

// // // //   const handleSendMessage = async () => {
// // // //     if (!input.trim() || isGenerating) return;

// // // //     const userMessage: Message = {
// // // //       id: Date.now().toString(),
// // // //       role: 'user',
// // // //       content: input.trim(),
// // // //       timestamp: new Date().toISOString()
// // // //     };

// // // //     const newMessages = [...messages, userMessage];
// // // //     setMessages(newMessages);
// // // //     setInput('');
// // // //     setIsGenerating(true);

// // // //     try {
// // // //       const { files, previewUrl: preview } = await generateProject(userMessage.content);

// // // //       setProjectFiles(files);
// // // //       setPreviewUrl(preview);

// // // //       if (files.length > 0) {
// // // //         setSelectedFile(files[0]);
// // // //       }

// // // //       if (messages.length === 0) {
// // // //         const title = userMessage.content.slice(0, 60);
// // // //         setProjectName(title);
// // // //       }

// // // //       const assistantMessage: Message = {
// // // //         id: (Date.now() + 1).toString(),
// // // //         role: 'assistant',
// // // //         content: `I've generated your project with ${files.length} files! 🎉`,
// // // //         timestamp: new Date().toISOString(),
// // // //         files: files,
// // // //         previewUrl: preview
// // // //       };

// // // //       const finalMessages = [...newMessages, assistantMessage];
// // // //       setMessages(finalMessages);
// // // //       saveChatHistory(finalMessages, files, preview);
// // // //       setActiveTab('preview');

// // // //     } catch (error) {
// // // //       console.error('Error:', error);
// // // //     } finally {
// // // //       setIsGenerating(false);
// // // //     }
// // // //   };

// // // //   // ==================== FILE OPERATIONS ====================

// // // //   const handleDownloadZip = async () => {
// // // //     if (projectFiles.length === 0) {
// // // //       alert('No files to download');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const JSZip = (await import('jszip')).default;
// // // //       const zip = new JSZip();

// // // //       projectFiles.forEach(file => {
// // // //         zip.file(file.path, file.content);
// // // //       });

// // // //       const blob = await zip.generateAsync({ type: 'blob' });
// // // //       const url = URL.createObjectURL(blob);
// // // //       const a = document.createElement('a');
// // // //       a.href = url;
// // // //       a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}.zip`;
// // // //       document.body.appendChild(a);
// // // //       a.click();
// // // //       document.body.removeChild(a);
// // // //       URL.revokeObjectURL(url);
// // // //     } catch (error) {
// // // //       console.error('Error creating zip:', error);
// // // //     }
// // // //   };

// // // //   const handleDeploy = () => {
// // // //     navigate('/deploy', {
// // // //       state: { projectFiles, projectName, applicationType }
// // // //     });
// // // //   };

// // // //   // ==================== FILE TREE ====================

// // // //   const filteredFiles = useMemo(() => {
// // // //     if (!searchQuery.trim()) return projectFiles;
// // // //     const query = searchQuery.toLowerCase();
// // // //     return projectFiles.filter(f =>
// // // //       f.name.toLowerCase().includes(query) || f.path.toLowerCase().includes(query)
// // // //     );
// // // //   }, [projectFiles, searchQuery]);

// // // //   const fileTree = useMemo(() => {
// // // //     const tree: any = {};
// // // //     filteredFiles.forEach(file => {
// // // //       const parts = file.path.split('/');
// // // //       let current = tree;
// // // //       parts.forEach((part, index) => {
// // // //         if (index === parts.length - 1) {
// // // //           if (!current._files) current._files = [];
// // // //           current._files.push(file);
// // // //         } else {
// // // //           if (!current[part]) current[part] = {};
// // // //           current = current[part];
// // // //         }
// // // //       });
// // // //     });
// // // //     return tree;
// // // //   }, [filteredFiles]);

// // // //   const toggleFolder = (path: string) => {
// // // //     setFileTreeExpanded(prev => ({ ...prev, [path]: !prev[path] }));
// // // //   };

// // // //   const renderFileTree = (node: any, path: string = '', level: number = 0) => {
// // // //     const folders = Object.keys(node).filter(key => key !== '_files');
// // // //     const files = node._files || [];

// // // //     return (
// // // //       <>
// // // //         {folders.map(folderName => {
// // // //           const folderPath = path ? `${path}/${folderName}` : folderName;
// // // //           const isExpanded = fileTreeExpanded[folderPath] !== false;

// // // //           return (
// // // //             <div key={folderPath}>
// // // //               <div
// // // //                 className="file-tree-folder"
// // // //                 style={{ paddingLeft: `${level * 16}px` }}
// // // //                 onClick={() => toggleFolder(folderPath)}
// // // //               >
// // // //                 <span>{isExpanded ? '📂' : '📁'}</span>
// // // //                 <span>{folderName}</span>
// // // //               </div>
// // // //               {isExpanded && renderFileTree(node[folderName], folderPath, level + 1)}
// // // //             </div>
// // // //           );
// // // //         })}
// // // //         {files.map((file: ProjectFile) => (
// // // //           <div
// // // //             key={file.path}
// // // //             className={`file-tree-file ${selectedFile?.path === file.path ? 'active' : ''}`}
// // // //             style={{ paddingLeft: `${(level + 1) * 16}px` }}
// // // //             onClick={() => setSelectedFile(file)}
// // // //           >
// // // //             <span>{getFileIcon(file.name)}</span>
// // // //             <span>{file.name}</span>
// // // //           </div>
// // // //         ))}
// // // //       </>
// // // //     );
// // // //   };

// // // //   const getFileIcon = (filename: string) => {
// // // //     const ext = filename.split('.').pop()?.toLowerCase();
// // // //     const icons: { [key: string]: string } = {
// // // //       'js': '📜', 'jsx': '⚛️', 'html': '🌐', 'css': '🎨', 'json': '📋'
// // // //     };
// // // //     return icons[ext || ''] || '📄';
// // // //   };

// // // //   const getLanguageLabel = (lang: string) => {
// // // //     const labels: { [key: string]: string } = {
// // // //       'javascript': 'JavaScript', 'jsx': 'React JSX', 'html': 'HTML', 'css': 'CSS'
// // // //     };
// // // //     return labels[lang] || lang.toUpperCase();
// // // //   };

// // // //   // ==================== RENDER ====================

// // // //   return (
// // // //     <div className="chat-page-enhanced">
// // // //       <header className="page-header">
// // // //         <div className="header-left">
// // // //           <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // // //             ← Back
// // // //           </button>
// // // //           <h1>⚗️ CodeAlchemy</h1>
// // // //         </div>
// // // //         <div className="header-right">
// // // //           {projectFiles.length > 0 && (
// // // //             <>
// // // //               <span className="file-badge">{projectFiles.length} files</span>
// // // //               <button className="action-btn" onClick={handleDownloadZip}>📦 Download</button>
// // // //               <button className="action-btn" onClick={handleDeploy}>🚀 Deploy</button>
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       </header>

// // // //       <div className="page-body">
// // // //         <aside className="file-sidebar">
// // // //           <div className="sidebar-header"><h3>📂 Files</h3></div>
// // // //           {projectFiles.length > 0 && (
// // // //             <div className="search-box">
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Search files..."
// // // //                 value={searchQuery}
// // // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // // //               />
// // // //             </div>
// // // //           )}
// // // //           <div className="file-tree">
// // // //             {projectFiles.length === 0 ? (
// // // //               <div className="no-files"><p>No files yet</p></div>
// // // //             ) : (
// // // //               renderFileTree(fileTree)
// // // //             )}
// // // //           </div>
// // // //         </aside>

// // // //         <section className="editor-section">
// // // //           <div className="editor-tabs">
// // // //             <button
// // // //               className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('code')}
// // // //             >
// // // //               💻 Code
// // // //             </button>
// // // //             <button
// // // //               className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('preview')}
// // // //               disabled={!previewUrl}
// // // //             >
// // // //               👁️ Preview
// // // //             </button>
// // // //           </div>

// // // //           <div className="editor-content">
// // // //             {activeTab === 'code' ? (
// // // //               <div className="code-viewer">
// // // //                 {selectedFile ? (
// // // //                   <>
// // // //                     <pre className="code-block"><code>{selectedFile.content}</code></pre>
// // // //                     <button onClick={() => navigator.clipboard.writeText(selectedFile.content)}>
// // // //                       📋 Copy
// // // //                     </button>
// // // //                   </>
// // // //                 ) : (
// // // //                   <div className="no-selection"><p>Select a file</p></div>
// // // //                 )}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="preview-container">
// // // //                 {previewUrl ? (
// // // //                   <iframe src={previewUrl} className="preview-frame" title="Preview" />
// // // //                 ) : (
// // // //                   <div className="no-preview"><p>No preview</p></div>
// // // //                 )}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         <aside className="chat-section">
// // // //           <div className="chat-interface">
// // // //             <div className="chat-header"><h2>💬 Chat</h2></div>
// // // //             <div className="messages-container">
// // // //               {messages.map(msg => (
// // // //                 <div key={msg.id} className={`message ${msg.role}`}>
// // // //                   <div className="message-avatar">{msg.role === 'user' ? '👤' : '⚗️'}</div>
// // // //                   <div className="message-content">{msg.content}</div>
// // // //                 </div>
// // // //               ))}
// // // //               {isGenerating && <div className="typing-indicator">Generating...</div>}
// // // //               <div ref={messagesEndRef} />
// // // //             </div>
// // // //             <div className="chat-input-container">
// // // //               <input
// // // //                 type="text"
// // // //                 value={input}
// // // //                 onChange={(e) => setInput(e.target.value)}
// // // //                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
// // // //                 placeholder="Describe your project..."
// // // //                 disabled={isGenerating}
// // // //               />
// // // //               <button onClick={handleSendMessage} disabled={!input.trim() || isGenerating}>
// // // //                 {isGenerating ? '⏳' : '🚀'}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </aside>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ChatPage;


// // // // import React, { useState, useEffect, useMemo } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { useAuth } from '../contexts/AuthContext';
// // // // import ChatInterface, { ProjectFile } from '../components/ChatInterface/ChatInterface';
// // // // import './ChatPage.css';

// // // // const ChatPage: React.FC = () => {
// // // //   const { chatId } = useParams<{ chatId: string }>();
// // // //   const navigate = useNavigate();
// // // //   const { user } = useAuth();

// // // //   // State management
// // // //   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
// // // //   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
// // // //   const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
// // // //   const [previewUrl, setPreviewUrl] = useState<string>('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [fileTreeExpanded, setFileTreeExpanded] = useState<{ [key: string]: boolean }>({});

// // // //   // Debug: Log when component mounts
// // // //   useEffect(() => {
// // // //     console.log('🎯 ChatPage mounted with chatId:', chatId);
// // // //   }, []);

// // // //   // Load project files from chat history on mount
// // // //   useEffect(() => {
// // // //     if (chatId) {
// // // //       console.log('📂 Loading project files for chat:', chatId);
// // // //       loadProjectFiles();
// // // //     }
// // // //   }, [chatId]);

// // // //   const loadProjectFiles = () => {
// // // //     try {
// // // //       const saved = localStorage.getItem(`chat_${chatId}`);
// // // //       if (saved) {
// // // //         const parsed = JSON.parse(saved);
// // // //         console.log('✅ Loaded chat data:', parsed);
        
// // // //         if (parsed.files && parsed.files.length > 0) {
// // // //           setProjectFiles(parsed.files);
// // // //           setSelectedFile(parsed.files[0]);
// // // //           setPreviewUrl(parsed.previewUrl || '');
// // // //         }
// // // //       } else {
// // // //         console.log('ℹ️ No saved data for this chat');
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Error loading project files:', error);
// // // //     }
// // // //   };

// // // //   // Handle project update from ChatInterface
// // // //   const handleProjectUpdate = (files: ProjectFile[], url: string) => {
// // // //     console.log('📦 Project updated with', files.length, 'files');
    
// // // //     setProjectFiles(files);
// // // //     setPreviewUrl(url);
    
// // // //     if (files.length > 0 && !selectedFile) {
// // // //       setSelectedFile(files[0]);
// // // //     }
    
// // // //     // Auto-switch to preview when files are generated
// // // //     setActiveTab('preview');
// // // //   };

// // // //   // File tree logic
// // // //   const filteredFiles = useMemo(() => {
// // // //     if (!searchQuery.trim()) return projectFiles;
// // // //     const query = searchQuery.toLowerCase();
// // // //     return projectFiles.filter(
// // // //       (f) =>
// // // //         f.name.toLowerCase().includes(query) ||
// // // //         f.path.toLowerCase().includes(query)
// // // //     );
// // // //   }, [projectFiles, searchQuery]);

// // // //   // Build file tree structure
// // // //   const fileTree = useMemo(() => {
// // // //     const tree: any = {};
    
// // // //     filteredFiles.forEach(file => {
// // // //       const parts = file.path.split('/');
// // // //       let current = tree;
      
// // // //       parts.forEach((part, index) => {
// // // //         if (index === parts.length - 1) {
// // // //           // It's a file
// // // //           if (!current._files) current._files = [];
// // // //           current._files.push(file);
// // // //         } else {
// // // //           // It's a folder
// // // //           if (!current[part]) {
// // // //             current[part] = {};
// // // //           }
// // // //           current = current[part];
// // // //         }
// // // //       });
// // // //     });
    
// // // //     return tree;
// // // //   }, [filteredFiles]);

// // // //   const toggleFolder = (path: string) => {
// // // //     setFileTreeExpanded(prev => ({
// // // //       ...prev,
// // // //       [path]: !prev[path]
// // // //     }));
// // // //   };

// // // //   const renderFileTree = (node: any, path: string = '', level: number = 0) => {
// // // //     const folders = Object.keys(node).filter(key => key !== '_files');
// // // //     const files = node._files || [];
    
// // // //     return (
// // // //       <>
// // // //         {folders.map(folderName => {
// // // //           const folderPath = path ? `${path}/${folderName}` : folderName;
// // // //           const isExpanded = fileTreeExpanded[folderPath] !== false;
          
// // // //           return (
// // // //             <div key={folderPath}>
// // // //               <div
// // // //                 className="file-tree-folder"
// // // //                 style={{ paddingLeft: `${level * 16}px` }}
// // // //                 onClick={() => toggleFolder(folderPath)}
// // // //               >
// // // //                 <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
// // // //                 <span className="folder-name">{folderName}</span>
// // // //               </div>
// // // //               {isExpanded && renderFileTree(node[folderName], folderPath, level + 1)}
// // // //             </div>
// // // //           );
// // // //         })}
        
// // // //         {files.map((file: ProjectFile) => (
// // // //           <div
// // // //             key={file.path}
// // // //             className={`file-tree-file ${selectedFile?.path === file.path ? 'active' : ''}`}
// // // //             style={{ paddingLeft: `${(level + 1) * 16}px` }}
// // // //             onClick={() => setSelectedFile(file)}
// // // //           >
// // // //             <span className="file-icon">{getFileIcon(file.name)}</span>
// // // //             <span className="file-name">{file.name}</span>
// // // //           </div>
// // // //         ))}
// // // //       </>
// // // //     );
// // // //   };

// // // //   const getFileIcon = (filename: string) => {
// // // //     const ext = filename.split('.').pop()?.toLowerCase();
// // // //     const icons: { [key: string]: string } = {
// // // //       'js': '📜',
// // // //       'jsx': '⚛️',
// // // //       'ts': '📘',
// // // //       'tsx': '⚛️',
// // // //       'json': '📋',
// // // //       'html': '🌐',
// // // //       'css': '🎨',
// // // //       'md': '📝',
// // // //       'env': '🔐',
// // // //       'gitignore': '🚫'
// // // //     };
// // // //     return icons[ext || ''] || '📄';
// // // //   };

// // // //   const getLanguageLabel = (lang: string) => {
// // // //     const labels: { [key: string]: string } = {
// // // //       'javascript': 'JavaScript',
// // // //       'jsx': 'React JSX',
// // // //       'typescript': 'TypeScript',
// // // //       'tsx': 'React TSX',
// // // //       'json': 'JSON',
// // // //       'html': 'HTML',
// // // //       'css': 'CSS',
// // // //       'markdown': 'Markdown'
// // // //     };
// // // //     return labels[lang] || lang.toUpperCase();
// // // //   };

// // // //   // Debug: Log render
// // // //   console.log('🔄 Rendering ChatPage, chatId:', chatId);

// // // //   return (
// // // //     <div className="chat-page-enhanced">
// // // //       {/* Header */}
// // // //       <header className="page-header">
// // // //         <div className="header-left">
// // // //           <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // // //             ← Back
// // // //           </button>
// // // //           <h1>⚗️ CodeAlchemy</h1>
// // // //         </div>
// // // //         <div className="header-right">
// // // //           {projectFiles.length > 0 && (
// // // //             <span className="file-badge">{projectFiles.length} files</span>
// // // //           )}
// // // //         </div>
// // // //       </header>

// // // //       <div className="page-body">
// // // //         {/* File Explorer Sidebar */}
// // // //         <aside className="file-sidebar">
// // // //           <div className="sidebar-header">
// // // //             <h3>📂 Files</h3>
// // // //           </div>
          
// // // //           {projectFiles.length > 0 && (
// // // //             <div className="search-box">
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Search files..."
// // // //                 value={searchQuery}
// // // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // // //               />
// // // //             </div>
// // // //           )}

// // // //           <div className="file-tree">
// // // //             {projectFiles.length === 0 ? (
// // // //               <div className="no-files">
// // // //                 <p>No files yet</p>
// // // //                 <p className="hint">Start chatting to generate code</p>
// // // //               </div>
// // // //             ) : (
// // // //               renderFileTree(fileTree)
// // // //             )}
// // // //           </div>
// // // //         </aside>

// // // //         {/* Code Editor / Preview */}
// // // //         <section className="editor-section">
// // // //           <div className="editor-tabs">
// // // //             <button
// // // //               className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('code')}
// // // //             >
// // // //               💻 Code
// // // //             </button>
// // // //             <button
// // // //               className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('preview')}
// // // //               disabled={!previewUrl}
// // // //               title={!previewUrl ? 'Generate files first' : 'Open preview'}
// // // //             >
// // // //               👁️ Preview
// // // //             </button>
            
// // // //             {selectedFile && activeTab === 'code' && (
// // // //               <div className="file-info">
// // // //                 <span className="file-path">{selectedFile.path}</span>
// // // //                 <span className="file-lang">{getLanguageLabel(selectedFile.language)}</span>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <div className="editor-content">
// // // //             {activeTab === 'code' ? (
// // // //               <div className="code-viewer">
// // // //                 {selectedFile ? (
// // // //                   <>
// // // //                     <pre className="code-block">
// // // //                       <code>{selectedFile.content}</code>
// // // //                     </pre>
// // // //                     <div className="code-actions">
// // // //                       <button
// // // //                         onClick={() => {
// // // //                           navigator.clipboard.writeText(selectedFile.content);
// // // //                           alert('✅ Copied to clipboard!');
// // // //                         }}
// // // //                       >
// // // //                         📋 Copy Code
// // // //                       </button>
// // // //                     </div>
// // // //                   </>
// // // //                 ) : (
// // // //                   <div className="no-selection">
// // // //                     <p>Select a file to view its contents</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="preview-container">
// // // //                 {previewUrl ? (
// // // //                   <iframe
// // // //                     src={previewUrl}
// // // //                     className="preview-frame"
// // // //                     sandbox="allow-scripts allow-same-origin allow-forms"
// // // //                     title="Live Preview"
// // // //                   />
// // // //                 ) : (
// // // //                   <div className="no-preview">
// // // //                     <p>Preview not available</p>
// // // //                     <p className="hint">Generate files to see live preview</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         {/* Chat Interface - CRITICAL: This must be visible */}
// // // //         <aside className="chat-section">
// // // //           {chatId ? (
// // // //             <ChatInterface
// // // //               chatId={chatId}
// // // //               onProjectUpdate={handleProjectUpdate}
// // // //             />
// // // //           ) : (
// // // //             <div style={{ 
// // // //               padding: '20px', 
// // // //               textAlign: 'center',
// // // //               color: '#718096'
// // // //             }}>
// // // //               <p>No chat ID provided</p>
// // // //               <button 
// // // //                 onClick={() => navigate('/dashboard')}
// // // //                 style={{
// // // //                   marginTop: '20px',
// // // //                   padding: '10px 20px',
// // // //                   background: '#1e3c61',
// // // //                   color: 'white',
// // // //                   border: 'none',
// // // //                   borderRadius: '8px',
// // // //                   cursor: 'pointer'
// // // //                 }}
// // // //               >
// // // //                 Go to Dashboard
// // // //               </button>
// // // //             </div>
// // // //           )}
// // // //         </aside>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ChatPage;
// // // // import React, { useState, useEffect, useMemo } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import { useAuth } from '../contexts/AuthContext';
// // // // import ChatInterface, { ProjectFile } from '../components/ChatInterface/ChatInterface';
// // // // import { replitApi } from '../services/api';
// // // // import './ChatPage.css';

// // // // interface ExecutionResult {
// // // //   output: string;
// // // //   error?: string;
// // // //   exitCode: number;
// // // //   executionTime: number;
// // // // }

// // // // interface DevServerStatus {
// // // //   running: boolean;
// // // //   port?: number;
// // // //   url?: string;
// // // //   logs?: string[];
// // // // }

// // // // const ChatPage: React.FC = () => {
// // // //   const { chatId } = useParams<{ chatId: string }>();
// // // //   const navigate = useNavigate();
// // // //   const { user } = useAuth();

// // // //   // State management
// // // //   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
// // // //   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
// // // //   const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'terminal'>('code');
// // // //   const [previewUrl, setPreviewUrl] = useState<string>('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [fileTreeExpanded, setFileTreeExpanded] = useState<{ [key: string]: boolean }>({});
  
// // // //   // Replit features
// // // //   const [devServerStatus, setDevServerStatus] = useState<DevServerStatus>({ running: false });
// // // //   const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
// // // //   const [terminalCommand, setTerminalCommand] = useState('');
// // // //   const [isExecuting, setIsExecuting] = useState(false);

// // // //   useEffect(() => {
// // // //     console.log('🎯 ChatPage mounted with chatId:', chatId);
// // // //     if (chatId) {
// // // //       loadProjectFiles();
// // // //     }
// // // //   }, [chatId]);

// // // //   const loadProjectFiles = () => {
// // // //     try {
// // // //       const saved = sessionStorage.getItem(`chat_${chatId}`);
// // // //       if (saved) {
// // // //         const parsed = JSON.parse(saved);
// // // //         console.log('✅ Loaded chat data:', parsed);
        
// // // //         if (parsed.files && parsed.files.length > 0) {
// // // //           setProjectFiles(parsed.files);
// // // //           setSelectedFile(parsed.files[0]);
// // // //           setPreviewUrl(parsed.previewUrl || '');
// // // //         }
        
// // // //         if (parsed.devServerStatus) {
// // // //           setDevServerStatus(parsed.devServerStatus);
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Error loading project files:', error);
// // // //     }
// // // //   };

// // // //   const handleProjectUpdate = (files: ProjectFile[], url: string) => {
// // // //     console.log('📦 Project updated with', files.length, 'files');
    
// // // //     setProjectFiles(files);
// // // //     setPreviewUrl(url);
    
// // // //     if (files.length > 0 && !selectedFile) {
// // // //       setSelectedFile(files[0]);
// // // //     }
    
// // // //     setActiveTab('preview');
// // // //   };

// // // //   const handleExecutionResult = (result: ExecutionResult) => {
// // // //     const output = `\n$ Execution completed in ${result.executionTime}ms\n${result.output}${result.error ? `\nError: ${result.error}` : ''}`;
// // // //     setTerminalOutput(prev => [...prev, output]);
// // // //     setActiveTab('terminal');
// // // //   };

// // // //   const handleDevServerStatus = (status: DevServerStatus) => {
// // // //     setDevServerStatus(status);
// // // //     if (status.running && status.url) {
// // // //       setTerminalOutput(prev => [...prev, `\n🚀 Dev server started at ${status.url}`]);
// // // //     }
// // // //   };

// // // //   const handleTerminalCommand = async () => {
// // // //     if (!terminalCommand.trim() || isExecuting) return;

// // // //     const command = terminalCommand.trim();
// // // //     setTerminalOutput(prev => [...prev, `\n$ ${command}`]);
// // // //     setTerminalCommand('');
// // // //     setIsExecuting(true);

// // // //     try {
// // // //       const result = await replitApi.runCommand({
// // // //         projectId: chatId!,
// // // //         command: command
// // // //       });

// // // //       setTerminalOutput(prev => [...prev, result.output || 'Command completed']);
      
// // // //       if (result.error) {
// // // //         setTerminalOutput(prev => [...prev, `Error: ${result.error}`]);
// // // //       }
// // // //     } catch (error: any) {
// // // //       setTerminalOutput(prev => [...prev, `❌ Error: ${error.message}`]);
// // // //     } finally {
// // // //       setIsExecuting(false);
// // // //     }
// // // //   };

// // // //   const handleFileEdit = async (newContent: string) => {
// // // //     if (!selectedFile || !chatId) return;

// // // //     try {
// // // //       await replitApi.updateFile({
// // // //         projectId: chatId,
// // // //         path: selectedFile.path,
// // // //         content: newContent,
// // // //         language: selectedFile.language
// // // //       });

// // // //       // Update local state
// // // //       const updatedFiles = projectFiles.map(f => 
// // // //         f.path === selectedFile.path ? { ...f, content: newContent } : f
// // // //       );
// // // //       setProjectFiles(updatedFiles);
// // // //       setSelectedFile({ ...selectedFile, content: newContent });

// // // //       // Trigger hot reload
// // // //       await replitApi.hotReload({
// // // //         projectId: chatId,
// // // //         files: [{ path: selectedFile.path, content: newContent }]
// // // //       });

// // // //       console.log('🔥 File updated and hot reloaded');
// // // //     } catch (error) {
// // // //       console.error('❌ File update error:', error);
// // // //     }
// // // //   };

// // // //   const startDevServer = async () => {
// // // //     if (!chatId || !projectFiles.length) return;

// // // //     try {
// // // //       const framework = detectFramework(projectFiles);
// // // //       const result = await replitApi.startDevServer({
// // // //         projectId: chatId,
// // // //         files: projectFiles,
// // // //         framework
// // // //       });

// // // //       setDevServerStatus({
// // // //         running: true,
// // // //         port: result.port,
// // // //         url: result.url,
// // // //         logs: result.logs || []
// // // //       });

// // // //       setTerminalOutput(prev => [...prev, `\n✅ Dev server started!\n🌐 ${result.url}`]);
// // // //     } catch (error: any) {
// // // //       setTerminalOutput(prev => [...prev, `\n❌ Failed to start server: ${error.message}`]);
// // // //     }
// // // //   };

// // // //   const stopDevServer = async () => {
// // // //     if (!chatId) return;

// // // //     try {
// // // //       await replitApi.stopDevServer(chatId);
// // // //       setDevServerStatus({ running: false });
// // // //       setTerminalOutput(prev => [...prev, '\n🛑 Dev server stopped']);
// // // //     } catch (error: any) {
// // // //       setTerminalOutput(prev => [...prev, `\n❌ Failed to stop server: ${error.message}`]);
// // // //     }
// // // //   };

// // // //   const detectFramework = (files: ProjectFile[]): 'react' | 'vue' | 'express' | 'static' => {
// // // //     const hasReact = files.some(f => f.content.includes('import React'));
// // // //     const hasVue = files.some(f => f.name.endsWith('.vue'));
// // // //     const hasExpress = files.some(f => f.content.includes('express()'));
    
// // // //     if (hasReact) return 'react';
// // // //     if (hasVue) return 'vue';
// // // //     if (hasExpress) return 'express';
// // // //     return 'static';
// // // //   };

// // // //   const filteredFiles = useMemo(() => {
// // // //     if (!searchQuery.trim()) return projectFiles;
// // // //     const query = searchQuery.toLowerCase();
// // // //     return projectFiles.filter(
// // // //       (f) =>
// // // //         f.name.toLowerCase().includes(query) ||
// // // //         f.path.toLowerCase().includes(query)
// // // //     );
// // // //   }, [projectFiles, searchQuery]);

// // // //   const fileTree = useMemo(() => {
// // // //     const tree: any = {};
    
// // // //     filteredFiles.forEach(file => {
// // // //       const parts = file.path.split('/');
// // // //       let current = tree;
      
// // // //       parts.forEach((part, index) => {
// // // //         if (index === parts.length - 1) {
// // // //           if (!current._files) current._files = [];
// // // //           current._files.push(file);
// // // //         } else {
// // // //           if (!current[part]) {
// // // //             current[part] = {};
// // // //           }
// // // //           current = current[part];
// // // //         }
// // // //       });
// // // //     });
    
// // // //     return tree;
// // // //   }, [filteredFiles]);

// // // //   const toggleFolder = (path: string) => {
// // // //     setFileTreeExpanded(prev => ({
// // // //       ...prev,
// // // //       [path]: !prev[path]
// // // //     }));
// // // //   };

// // // //   const renderFileTree = (node: any, path: string = '', level: number = 0) => {
// // // //     const folders = Object.keys(node).filter(key => key !== '_files');
// // // //     const files = node._files || [];
    
// // // //     return (
// // // //       <>
// // // //         {folders.map(folderName => {
// // // //           const folderPath = path ? `${path}/${folderName}` : folderName;
// // // //           const isExpanded = fileTreeExpanded[folderPath] !== false;
          
// // // //           return (
// // // //             <div key={folderPath}>
// // // //               <div
// // // //                 className="file-tree-folder"
// // // //                 style={{ paddingLeft: `${level * 16}px` }}
// // // //                 onClick={() => toggleFolder(folderPath)}
// // // //               >
// // // //                 <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
// // // //                 <span className="folder-name">{folderName}</span>
// // // //               </div>
// // // //               {isExpanded && renderFileTree(node[folderName], folderPath, level + 1)}
// // // //             </div>
// // // //           );
// // // //         })}
        
// // // //         {files.map((file: ProjectFile) => (
// // // //           <div
// // // //             key={file.path}
// // // //             className={`file-tree-file ${selectedFile?.path === file.path ? 'active' : ''}`}
// // // //             style={{ paddingLeft: `${(level + 1) * 16}px` }}
// // // //             onClick={() => setSelectedFile(file)}
// // // //           >
// // // //             <span className="file-icon">{getFileIcon(file.name)}</span>
// // // //             <span className="file-name">{file.name}</span>
// // // //           </div>
// // // //         ))}
// // // //       </>
// // // //     );
// // // //   };

// // // //   const getFileIcon = (filename: string) => {
// // // //     const ext = filename.split('.').pop()?.toLowerCase();
// // // //     const icons: { [key: string]: string } = {
// // // //       'js': '📜', 'jsx': '⚛️', 'ts': '📘', 'tsx': '⚛️',
// // // //       'json': '📋', 'html': '🌐', 'css': '🎨', 'md': '📝'
// // // //     };
// // // //     return icons[ext || ''] || '📄';
// // // //   };

// // // //   const getLanguageLabel = (lang: string) => {
// // // //     const labels: { [key: string]: string } = {
// // // //       'javascript': 'JavaScript', 'jsx': 'React JSX',
// // // //       'typescript': 'TypeScript', 'tsx': 'React TSX',
// // // //       'json': 'JSON', 'html': 'HTML', 'css': 'CSS'
// // // //     };
// // // //     return labels[lang] || lang.toUpperCase();
// // // //   };

// // // //   return (
// // // //     <div className="chat-page-enhanced">
// // // //       <header className="page-header">
// // // //         <div className="header-left">
// // // //           <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // // //             ← Back
// // // //           </button>
// // // //           <h1>⚗️ CodeAlchemy</h1>
// // // //         </div>
// // // //         <div className="header-right">
// // // //           {devServerStatus.running && (
// // // //             <a 
// // // //               href={devServerStatus.url} 
// // // //               target="_blank" 
// // // //               rel="noopener noreferrer"
// // // //               className="server-link"
// // // //             >
// // // //               🟢 Live at port {devServerStatus.port}
// // // //             </a>
// // // //           )}
// // // //           {projectFiles.length > 0 && (
// // // //             <span className="file-badge">{projectFiles.length} files</span>
// // // //           )}
// // // //         </div>
// // // //       </header>

// // // //       <div className="page-body">
// // // //         <aside className="file-sidebar">
// // // //           <div className="sidebar-header">
// // // //             <h3>📂 Files</h3>
// // // //           </div>
          
// // // //           {projectFiles.length > 0 && (
// // // //             <>
// // // //               <div className="search-box">
// // // //                 <input
// // // //                   type="text"
// // // //                   placeholder="Search files..."
// // // //                   value={searchQuery}
// // // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // // //                 />
// // // //               </div>
              
// // // //               <div className="server-controls">
// // // //                 {!devServerStatus.running ? (
// // // //                   <button onClick={startDevServer} className="btn-start-server">
// // // //                     🚀 Start Server
// // // //                   </button>
// // // //                 ) : (
// // // //                   <button onClick={stopDevServer} className="btn-stop-server">
// // // //                     🛑 Stop Server
// // // //                   </button>
// // // //                 )}
// // // //               </div>
// // // //             </>
// // // //           )}

// // // //           <div className="file-tree">
// // // //             {projectFiles.length === 0 ? (
// // // //               <div className="no-files">
// // // //                 <p>No files yet</p>
// // // //                 <p className="hint">Start chatting to generate code</p>
// // // //               </div>
// // // //             ) : (
// // // //               renderFileTree(fileTree)
// // // //             )}
// // // //           </div>
// // // //         </aside>

// // // //         <section className="editor-section">
// // // //           <div className="editor-tabs">
// // // //             <button
// // // //               className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('code')}
// // // //             >
// // // //               💻 Code
// // // //             </button>
// // // //             <button
// // // //               className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('preview')}
// // // //               disabled={!previewUrl}
// // // //             >
// // // //               👁️ Preview
// // // //             </button>
// // // //             <button
// // // //               className={`tab ${activeTab === 'terminal' ? 'active' : ''}`}
// // // //               onClick={() => setActiveTab('terminal')}
// // // //             >
// // // //               💻 Terminal
// // // //             </button>
            
// // // //             {selectedFile && activeTab === 'code' && (
// // // //               <div className="file-info">
// // // //                 <span className="file-path">{selectedFile.path}</span>
// // // //                 <span className="file-lang">{getLanguageLabel(selectedFile.language)}</span>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <div className="editor-content">
// // // //             {activeTab === 'code' ? (
// // // //               <div className="code-viewer">
// // // //                 {selectedFile ? (
// // // //                   <>
// // // //                     <textarea
// // // //                       className="code-editor"
// // // //                       value={selectedFile.content}
// // // //                       onChange={(e) => handleFileEdit(e.target.value)}
// // // //                       spellCheck={false}
// // // //                     />
// // // //                     <div className="code-actions">
// // // //                       <button
// // // //                         onClick={() => {
// // // //                           navigator.clipboard.writeText(selectedFile.content);
// // // //                           alert('✅ Copied to clipboard!');
// // // //                         }}
// // // //                       >
// // // //                         📋 Copy Code
// // // //                       </button>
// // // //                     </div>
// // // //                   </>
// // // //                 ) : (
// // // //                   <div className="no-selection">
// // // //                     <p>Select a file to view its contents</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ) : activeTab === 'preview' ? (
// // // //               <div className="preview-container">
// // // //                 {previewUrl ? (
// // // //                   <iframe
// // // //                     src={previewUrl}
// // // //                     className="preview-frame"
// // // //                     sandbox="allow-scripts allow-same-origin allow-forms"
// // // //                     title="Live Preview"
// // // //                   />
// // // //                 ) : (
// // // //                   <div className="no-preview">
// // // //                     <p>Preview not available</p>
// // // //                     <p className="hint">Generate files to see live preview</p>
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             ) : (
// // // //               <div className="terminal-container">
// // // //                 <div className="terminal-output">
// // // //                   {terminalOutput.length === 0 ? (
// // // //                     <div className="terminal-welcome">
// // // //                       <p>💻 CodeAlchemy Terminal</p>
// // // //                       <p className="hint">Run commands like: npm install, node app.js, npm run dev</p>
// // // //                     </div>
// // // //                   ) : (
// // // //                     <pre>{terminalOutput.join('\n')}</pre>
// // // //                   )}
// // // //                 </div>
// // // //                 <div className="terminal-input">
// // // //                   <span className="terminal-prompt">$</span>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={terminalCommand}
// // // //                     onChange={(e) => setTerminalCommand(e.target.value)}
// // // //                     onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
// // // //                     placeholder="Enter command..."
// // // //                     disabled={isExecuting}
// // // //                   />
// // // //                   <button 
// // // //                     onClick={handleTerminalCommand}
// // // //                     disabled={isExecuting || !terminalCommand.trim()}
// // // //                   >
// // // //                     {isExecuting ? '⏳' : '▶️'}
// // // //                   </button>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </section>

// // // //         <aside className="chat-section">
// // // //           {chatId ? (
// // // //             <ChatInterface
// // // //               chatId={chatId}
// // // //               onProjectUpdate={handleProjectUpdate}
// // // //               onExecutionResult={handleExecutionResult}
// // // //               onDevServerStatus={handleDevServerStatus}
// // // //             />
// // // //           ) : (
// // // //             <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
// // // //               <p>No chat ID provided</p>
// // // //               <button 
// // // //                 onClick={() => navigate('/dashboard')}
// // // //                 style={{
// // // //                   marginTop: '20px',
// // // //                   padding: '10px 20px',
// // // //                   background: '#1e3c61',
// // // //                   color: 'white',
// // // //                   border: 'none',
// // // //                   borderRadius: '8px',
// // // //                   cursor: 'pointer'
// // // //                 }}
// // // //               >
// // // //                 Go to Dashboard
// // // //               </button>
// // // //             </div>
// // // //           )}
// // // //         </aside>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ChatPage;


// // // // frontend/pages/ChatPage.tsx
// // // // frontend/pages/ChatPage.tsx
// // // import React, { useState, useEffect, useMemo } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import { useAuth } from '../contexts/AuthContext';
// // // import { useProject } from '../contexts/ProjectContext';
// // // import ChatInterface, { ProjectFile } from '../components/ChatInterface/ChatInterface';
// // // import { apiClient } from '../services/api';
// // // import './ChatPage.css';
// // // interface Message {
// // //   role: 'user' | 'assistant';
// // //   content: string;
// // //   timestamp: string;
// // //   files?: ProjectFile[];
// // //   execution?: {
// // //     output: string;
// // //     error?: string;
// // //     exitCode: number;
// // //     executionTime: number;
// // //   };
// // // }

// // // interface ExecutionResult {
// // //   output: string;
// // //   error?: string;
// // //   exitCode: number;
// // //   executionTime: number;
// // // }

// // // interface DevServerStatus {
// // //   running: boolean;
// // //   port?: number;
// // //   url?: string;
// // //   logs?: string[];
// // // }

// // // const ChatPage: React.FC = () => {
// // //   const { chatId } = useParams<{ chatId: string }>();
// // //   const navigate = useNavigate();
// // //   const { user } = useAuth();
// // //   const { 
// // //     currentProject, 
// // //     updateProject, 
// // //     projects,
// // //     loading: projectLoading
// // //   } = useProject();

// // //   // State management
// // //   const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
// // //   const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
// // //   const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'terminal'>('code');
// // //   const [previewUrl, setPreviewUrl] = useState<string>('');
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [fileTreeExpanded, setFileTreeExpanded] = useState<{ [key: string]: boolean }>({});
  
// // //   // Replit features
// // //   const [devServerStatus, setDevServerStatus] = useState<DevServerStatus>({ running: false });
// // //   const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
// // //   const [terminalCommand, setTerminalCommand] = useState('');
// // //   const [isExecuting, setIsExecuting] = useState(false);

// // //   // Chat state - Fixed to include timestamp property
// // //   const [chatMessages, setChatMessages] = useState<Message[]>([]);
// // //   const [isChatLoading, setIsChatLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     console.log('🎯 ChatPage mounted with chatId:', chatId);
// // //     if (chatId) {
// // //       loadProjectFiles();
// // //       loadChatHistory();
// // //     }
// // //   }, [chatId]);

// // //   const loadProjectFiles = () => {
// // //     try {
// // //       const saved = sessionStorage.getItem(`chat_${chatId}`);
// // //       if (saved) {
// // //         const parsed = JSON.parse(saved);
// // //         console.log('✅ Loaded chat data:', parsed);
        
// // //         if (parsed.files && parsed.files.length > 0) {
// // //           setProjectFiles(parsed.files);
// // //           setSelectedFile(parsed.files[0]);
// // //           setPreviewUrl(parsed.previewUrl || '');
// // //         }
        
// // //         if (parsed.devServerStatus) {
// // //           setDevServerStatus(parsed.devServerStatus);
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Error loading project files:', error);
// // //     }
// // //   };

// // //   const loadChatHistory = async () => {
// // //     try {
// // //       const response = await apiClient.get(`/api/chats/${chatId}/history`);
// // //       const messages = response.data.messages || [];
      
// // //       // Ensure all messages have timestamps
// // //       const messagesWithTimestamp: Message[] = messages.map((msg: any) => ({
// // //         role: msg.role,
// // //         content: msg.content,
// // //         timestamp: msg.timestamp || new Date().toISOString()
// // //       }));
      
// // //       setChatMessages(messagesWithTimestamp);
// // //     } catch (error) {
// // //       console.error('Failed to load chat history:', error);
// // //     }
// // //   };

// // //   const handleProjectUpdate = async (files: ProjectFile[], url: string) => {
// // //     try {
// // //       console.log('📦 Project updated with', files.length, 'files');
      
// // //       setProjectFiles(files);
// // //       setPreviewUrl(url);
      
// // //       if (files.length > 0 && !selectedFile) {
// // //         setSelectedFile(files[0]);
// // //       }
      
// // //       setActiveTab('preview');
      
// // //       if (chatId && currentProject) {
// // //         try {
// // //           await updateProject(chatId, { files });
// // //         } catch (error) {
// // //           console.error('Error updating project files:', error);
// // //           // Don't throw here, just log the error
// // //         }
// // //       }
      
// // //       sessionStorage.setItem(`chat_${chatId}`, JSON.stringify({
// // //         files,
// // //         previewUrl: url,
// // //         devServerStatus
// // //       }));
// // //     } catch (error) {
// // //       console.error('Error in handleProjectUpdate:', error);
// // //       setError('Failed to update project');
// // //     }
// // //   };

// // //   const handleExecutionResult = (result: ExecutionResult) => {
// // //     const output = `\n$ Execution completed in ${result.executionTime}ms\n${result.output}${result.error ? `\nError: ${result.error}` : ''}`;
// // //     setTerminalOutput(prev => [...prev, output]);
// // //     setActiveTab('terminal');
// // //   };

// // //   const handleDevServerStatus = (status: DevServerStatus) => {
// // //     setDevServerStatus(status);
// // //     if (status.running && status.url) {
// // //       setTerminalOutput(prev => [...prev, `\n🚀 Dev server started at ${status.url}`]);
// // //     }
// // //   };

// // //   const handleSendMessage = async (message: string) => {
// // //     if (!message.trim() || !chatId) return;

// // //     const userMessage: Message = {
// // //       role: 'user',
// // //       content: message,
// // //       timestamp: new Date().toISOString()
// // //     };
    
// // //     setChatMessages(prev => [...prev, userMessage]);
// // //     setIsChatLoading(true);
// // //     setError(null);

// // //     try {
// // //       const response = await apiClient.post('/api/mejuvante/chat', {
// // //         message,
// // //         projectId: chatId,
// // //         conversationHistory: chatMessages
// // //       });

// // //       const assistantMessage: Message = { 
// // //         role: 'assistant', 
// // //         content: response.data.reply || response.data.message || 'Response received',
// // //         timestamp: new Date().toISOString()
// // //       };
      
// // //       setChatMessages(prev => [...prev, assistantMessage]);

// // //       if (response.data.files && response.data.files.length > 0) {
// // //         handleProjectUpdate(response.data.files, previewUrl);
// // //       }

// // //       if (response.data.executionResult) {
// // //         handleExecutionResult(response.data.executionResult);
// // //       }

// // //     } catch (error: any) {
// // //       console.error('Chat error:', error);
// // //       const errorMessage = error.response?.data?.message || error.message || 'Failed to get response';
// // //       setError(errorMessage);
      
// // //       const errorResponse: Message = { 
// // //         role: 'assistant', 
// // //         content: `Error: ${errorMessage}`,
// // //         timestamp: new Date().toISOString()
// // //       };
// // //       setChatMessages(prev => [...prev, errorResponse]);
// // //     } finally {
// // //       setIsChatLoading(false);
// // //     }
// // //   };

// // //   const handleTerminalCommand = async () => {
// // //     if (!terminalCommand.trim() || isExecuting) return;

// // //     const command = terminalCommand.trim();
// // //     setTerminalOutput(prev => [...prev, `\n$ ${command}`]);
// // //     setTerminalCommand('');
// // //     setIsExecuting(true);

// // //     try {
// // //       const response = await apiClient.post('/api/terminal/execute', {
// // //         projectId: chatId!,
// // //         command: command
// // //       });

// // //       const result = response.data;
// // //       setTerminalOutput(prev => [...prev, result.output || 'Command completed']);
      
// // //       if (result.error) {
// // //         setTerminalOutput(prev => [...prev, `Error: ${result.error}`]);
// // //       }
// // //     } catch (error: any) {
// // //       setTerminalOutput(prev => [...prev, `❌ Error: ${error.message}`]);
// // //     } finally {
// // //       setIsExecuting(false);
// // //     }
// // //   };

// // //   const handleFileEdit = async (newContent: string) => {
// // //     if (!selectedFile || !chatId) return;

// // //     try {
// // //       await apiClient.post('/api/files/update', {
// // //         projectId: chatId,
// // //         path: selectedFile.path,
// // //         content: newContent,
// // //         language: selectedFile.language
// // //       });

// // //       // Update local state
// // //       const updatedFiles = projectFiles.map(f => 
// // //         f.path === selectedFile.path ? { ...f, content: newContent } : f
// // //       );
// // //       setProjectFiles(updatedFiles);
// // //       setSelectedFile({ ...selectedFile, content: newContent });

// // //       // Trigger hot reload
// // //       await apiClient.post('/api/files/hot-reload', {
// // //         projectId: chatId,
// // //         files: [{ path: selectedFile.path, content: newContent }]
// // //       });

// // //       console.log('🔥 File updated and hot reloaded');
// // //     } catch (error) {
// // //       console.error('❌ File update error:', error);
// // //     }
// // //   };

// // //   const startDevServer = async () => {
// // //     if (!chatId || !projectFiles.length) return;

// // //     try {
// // //       const framework = detectFramework(projectFiles);
      
// // //       const response = await apiClient.post('/api/dev-server/start', {
// // //         projectId: chatId,
// // //         files: projectFiles,
// // //         framework
// // //       });

// // //       const result = response.data;
// // //       setDevServerStatus({
// // //         running: true,
// // //         port: result.port,
// // //         url: result.url,
// // //         logs: result.logs || []
// // //       });

// // //       setTerminalOutput(prev => [...prev, `\n✅ Dev server started!\n🌐 ${result.url}`]);
// // //     } catch (error: any) {
// // //       setTerminalOutput(prev => [...prev, `\n❌ Failed to start server: ${error.message}`]);
// // //     }
// // //   };

// // //   const stopDevServer = async () => {
// // //     if (!chatId) return;

// // //     try {
// // //       await apiClient.post('/api/dev-server/stop', {
// // //         projectId: chatId
// // //       });
      
// // //       setDevServerStatus({ running: false });
// // //       setTerminalOutput(prev => [...prev, '\n🛑 Dev server stopped']);
// // //     } catch (error: any) {
// // //       setTerminalOutput(prev => [...prev, `\n❌ Failed to stop server: ${error.message}`]);
// // //     }
// // //   };

// // //   const handleDeploy = () => {
// // //     if (!projectFiles.length) {
// // //       alert('No files to deploy!');
// // //       return;
// // //     }

// // //     // Navigate to deploy page with project data
// // //     navigate('/deploy', {
// // //       state: {
// // //         projectFiles,
// // //         projectName: currentProject?.name || 'Untitled Project',
// // //         applicationType: detectApplicationType(projectFiles),
// // //         projectId: chatId
// // //       }
// // //     });
// // //   };

// // //   const detectFramework = (files: ProjectFile[]): 'react' | 'vue' | 'express' | 'static' => {
// // //     const hasReact = files.some(f => f.content.includes('import React'));
// // //     const hasVue = files.some(f => f.name.endsWith('.vue'));
// // //     const hasExpress = files.some(f => f.content.includes('express()'));
    
// // //     if (hasReact) return 'react';
// // //     if (hasVue) return 'vue';
// // //     if (hasExpress) return 'express';
// // //     return 'static';
// // //   };

// // //   const detectApplicationType = (files: ProjectFile[]): string => {
// // //     const hasReact = files.some(f => f.content.includes('import React'));
// // //     const hasVue = files.some(f => f.name.endsWith('.vue'));
// // //     const hasExpress = files.some(f => f.content.includes('express()'));
// // //     const hasNext = files.some(f => f.name === 'next.config.js');
    
// // //     if (hasNext) return 'next';
// // //     if (hasReact) return 'react';
// // //     if (hasVue) return 'vue';
// // //     if (hasExpress) return 'express';
// // //     return 'static';
// // //   };

// // //   const filteredFiles = useMemo(() => {
// // //     if (!searchQuery.trim()) return projectFiles;
// // //     const query = searchQuery.toLowerCase();
// // //     return projectFiles.filter(
// // //       (f) =>
// // //         f.name.toLowerCase().includes(query) ||
// // //         f.path.toLowerCase().includes(query)
// // //     );
// // //   }, [projectFiles, searchQuery]);

// // //   const fileTree = useMemo(() => {
// // //     const tree: any = {};
    
// // //     filteredFiles.forEach(file => {
// // //       const parts = file.path.split('/');
// // //       let current = tree;
      
// // //       parts.forEach((part, index) => {
// // //         if (index === parts.length - 1) {
// // //           if (!current._files) current._files = [];
// // //           current._files.push(file);
// // //         } else {
// // //           if (!current[part]) {
// // //             current[part] = {};
// // //           }
// // //           current = current[part];
// // //         }
// // //       });
// // //     });
    
// // //     return tree;
// // //   }, [filteredFiles]);

// // //   const toggleFolder = (path: string) => {
// // //     setFileTreeExpanded(prev => ({
// // //       ...prev,
// // //       [path]: !prev[path]
// // //     }));
// // //   };

// // //   const renderFileTree = (node: any, path: string = '', level: number = 0) => {
// // //     const folders = Object.keys(node).filter(key => key !== '_files');
// // //     const files = node._files || [];
    
// // //     return (
// // //       <>
// // //         {folders.map(folderName => {
// // //           const folderPath = path ? `${path}/${folderName}` : folderName;
// // //           const isExpanded = fileTreeExpanded[folderPath] !== false;
          
// // //           return (
// // //             <div key={folderPath}>
// // //               <div
// // //                 className="file-tree-folder"
// // //                 style={{ paddingLeft: `${level * 16}px` }}
// // //                 onClick={() => toggleFolder(folderPath)}
// // //               >
// // //                 <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
// // //                 <span className="folder-name">{folderName}</span>
// // //               </div>
// // //               {isExpanded && renderFileTree(node[folderName], folderPath, level + 1)}
// // //             </div>
// // //           );
// // //         })}
        
// // //         {files.map((file: ProjectFile) => (
// // //           <div
// // //             key={file.path}
// // //             className={`file-tree-file ${selectedFile?.path === file.path ? 'active' : ''}`}
// // //             style={{ paddingLeft: `${(level + 1) * 16}px` }}
// // //             onClick={() => setSelectedFile(file)}
// // //           >
// // //             <span className="file-icon">{getFileIcon(file.name)}</span>
// // //             <span className="file-name">{file.name}</span>
// // //           </div>
// // //         ))}
// // //       </>
// // //     );
// // //   };

// // //   const getFileIcon = (filename: string) => {
// // //     const ext = filename.split('.').pop()?.toLowerCase();
// // //     const icons: { [key: string]: string } = {
// // //       'js': '📜', 'jsx': '⚛️', 'ts': '📘', 'tsx': '⚛️',
// // //       'json': '📋', 'html': '🌐', 'css': '🎨', 'md': '📝'
// // //     };
// // //     return icons[ext || ''] || '📄';
// // //   };

// // //   const getLanguageLabel = (lang: string) => {
// // //     const labels: { [key: string]: string } = {
// // //       'javascript': 'JavaScript', 'jsx': 'React JSX',
// // //       'typescript': 'TypeScript', 'tsx': 'React TSX',
// // //       'json': 'JSON', 'html': 'HTML', 'css': 'CSS'
// // //     };
// // //     return labels[lang] || lang.toUpperCase();
// // //   };

// // //   return (
// // //     <div className="chat-page-enhanced">
// // //       <header className="page-header">
// // //         <div className="header-left">
// // //           <button className="back-btn" onClick={() => navigate('/dashboard')}>
// // //             ← Back
// // //           </button>
// // //           <h1>⚗️ CodeAlchemy</h1>
// // //         </div>
// // //         <div className="header-right">
// // //           {error && (
// // //             <div className="error-banner">
// // //               <span>⚠️ {error}</span>
// // //               <button onClick={() => setError(null)}>✕</button>
// // //             </div>
// // //           )}
// // //           {devServerStatus.running && (
// // //             <a 
// // //               href={devServerStatus.url} 
// // //               target="_blank" 
// // //               rel="noopener noreferrer"
// // //               className="server-link"
// // //             >
// // //               🟢 Live at port {devServerStatus.port}
// // //             </a>
// // //           )}
// // //           {projectFiles.length > 0 && (
// // //             <>
// // //               <button 
// // //                 onClick={handleDeploy}
// // //                 className="btn-deploy"
// // //                 title="Deploy Project"
// // //               >
// // //                 🚀 Deploy
// // //               </button>
// // //               <span className="file-badge">{projectFiles.length} files</span>
// // //             </>
// // //           )}
// // //         </div>
// // //       </header>

// // //       <div className="page-body">
// // //         <aside className="file-sidebar">
// // //           <div className="sidebar-header">
// // //             <h3>📂 Files</h3>
// // //           </div>
          
// // //           {projectFiles.length > 0 && (
// // //             <>
// // //               <div className="search-box">
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Search files..."
// // //                   value={searchQuery}
// // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // //                 />
// // //               </div>
              
// // //               <div className="server-controls">
// // //                 {!devServerStatus.running ? (
// // //                   <button onClick={startDevServer} className="btn-start-server">
// // //                     🚀 Start Server
// // //                   </button>
// // //                 ) : (
// // //                   <button onClick={stopDevServer} className="btn-stop-server">
// // //                     🛑 Stop Server
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             </>
// // //           )}

// // //           <div className="file-tree">
// // //             {projectFiles.length === 0 ? (
// // //               <div className="no-files">
// // //                 <p>No files yet</p>
// // //                 <p className="hint">Start chatting to generate code</p>
// // //               </div>
// // //             ) : (
// // //               renderFileTree(fileTree)
// // //             )}
// // //           </div>
// // //         </aside>

// // //         <section className="editor-section">
// // //           <div className="editor-tabs">
// // //             <button
// // //               className={`tab ${activeTab === 'code' ? 'active' : ''}`}
// // //               onClick={() => setActiveTab('code')}
// // //             >
// // //               💻 Code
// // //             </button>
// // //             <button
// // //               className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
// // //               onClick={() => setActiveTab('preview')}
// // //               disabled={!previewUrl}
// // //             >
// // //               👁️ Preview
// // //             </button>
// // //             <button
// // //               className={`tab ${activeTab === 'terminal' ? 'active' : ''}`}
// // //               onClick={() => setActiveTab('terminal')}
// // //             >
// // //               💻 Terminal
// // //             </button>
            
// // //             {selectedFile && activeTab === 'code' && (
// // //               <div className="file-info">
// // //                 <span className="file-path">{selectedFile.path}</span>
// // //                 <span className="file-lang">{getLanguageLabel(selectedFile.language)}</span>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="editor-content">
// // //             {activeTab === 'code' ? (
// // //               <div className="code-viewer">
// // //                 {selectedFile ? (
// // //                   <>
// // //                     <textarea
// // //                       className="code-editor"
// // //                       value={selectedFile.content}
// // //                       onChange={(e) => handleFileEdit(e.target.value)}
// // //                       spellCheck={false}
// // //                     />
// // //                     <div className="code-actions">
// // //                       <button
// // //                         onClick={() => {
// // //                           navigator.clipboard.writeText(selectedFile.content);
// // //                           alert('✅ Copied to clipboard!');
// // //                         }}
// // //                       >
// // //                         📋 Copy Code
// // //                       </button>
// // //                     </div>
// // //                   </>
// // //                 ) : (
// // //                   <div className="no-selection">
// // //                     <p>Select a file to view its contents</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : activeTab === 'preview' ? (
// // //               <div className="preview-container">
// // //                 {previewUrl ? (
// // //                   <iframe
// // //                     src={previewUrl}
// // //                     className="preview-frame"
// // //                     sandbox="allow-scripts allow-same-origin allow-forms"
// // //                     title="Live Preview"
// // //                   />
// // //                 ) : (
// // //                   <div className="no-preview">
// // //                     <p>Preview not available</p>
// // //                     <p className="hint">Generate files to see live preview</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ) : (
// // //               <div className="terminal-container">
// // //                 <div className="terminal-output">
// // //                   {terminalOutput.length === 0 ? (
// // //                     <div className="terminal-welcome">
// // //                       <p>💻 CodeAlchemy Terminal</p>
// // //                       <p className="hint">Run commands like: npm install, node app.js, npm run dev</p>
// // //                     </div>
// // //                   ) : (
// // //                     <pre>{terminalOutput.join('\n')}</pre>
// // //                   )}
// // //                 </div>
// // //                 <div className="terminal-input">
// // //                   <span className="terminal-prompt">$</span>
// // //                   <input
// // //                     type="text"
// // //                     value={terminalCommand}
// // //                     onChange={(e) => setTerminalCommand(e.target.value)}
// // //                     onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
// // //                     placeholder="Enter command..."
// // //                     disabled={isExecuting}
// // //                   />
// // //                   <button 
// // //                     onClick={handleTerminalCommand}
// // //                     disabled={isExecuting || !terminalCommand.trim()}
// // //                   >
// // //                     {isExecuting ? '⏳' : '▶️'}
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </section>

// // //         <aside className="chat-section">
// // //           {chatId ? (
// // //             <ChatInterface
// // //               chatId={chatId}
// // //               messages={chatMessages}
// // //               onSendMessage={handleSendMessage}
// // //               isLoading={isChatLoading}
// // //               onProjectUpdate={handleProjectUpdate}
// // //               onExecutionResult={handleExecutionResult}
// // //               onDevServerStatus={handleDevServerStatus}
// // //             />
// // //           ) : (
// // //             <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
// // //               <p>No chat ID provided</p>
// // //               <button 
// // //                 onClick={() => navigate('/dashboard')}
// // //                 style={{
// // //                   marginTop: '20px',
// // //                   padding: '10px 20px',
// // //                   background: '#1e3c61',
// // //                   color: 'white',
// // //                   border: 'none',
// // //                   borderRadius: '8px',
// // //                   cursor: 'pointer'
// // //                 }}
// // //               >
// // //                 Go to Dashboard
// // //               </button>
// // //             </div>
// // //           )}
// // //         </aside>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ChatPage;


// // // frontend/src/pages/ChatPage.tsx
// // import React, { useState, useRef, useEffect } from 'react';
// // import { 
// //   Send, 
// //   Download, 
// //   Play, 
// //   Code, 
// //   Loader2, 
// //   MessageSquare, 
// //   FileCode, 
// //   X,
// //   Copy,
// //   Check,
// //   Terminal as TerminalIcon,
// //   Maximize2,
// //   Minimize2,
// //   ChevronDown,
// //   ChevronUp,
// //   Zap
// // } from 'lucide-react';
// // import axios from 'axios';

// // // Types
// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// //   timestamp: Date;
// //   files?: FileData[];
// //   metadata?: any;
// // }

// // interface FileData {
// //   name: string;
// //   path: string;
// //   content: string;
// //   language: string;
// // }

// // interface ProjectData {
// //   id: string;
// //   name: string;
// //   files: FileData[];
// //   description?: string;
// //   stackRecommendation?: any;
// //   setupInstructions?: string[];
// //   dependencies?: any;
// // }

// // const ChatPage: React.FC = () => {
// //   const [messages, setMessages] = useState<Message[]>([
// //     {
// //       role: 'assistant',
// //       content: 'Hi! I\'m Mejuvante AI. I can help you build complete web applications, from simple landing pages to complex full-stack projects. Just describe what you want to create!\n\nTry saying: "Create a todo app with React" or "Build a landing page for a coffee shop"',
// //       timestamp: new Date()
// //     }
// //   ]);
// //   const [input, setInput] = useState('');
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
// //   const [showPreview, setShowPreview] = useState(false);
// //   const [showTerminal, setShowTerminal] = useState(false);
// //   const [previewKey, setPreviewKey] = useState(0);
// //   const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
// //   const [copiedFile, setCopiedFile] = useState<string | null>(null);
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
// //   const [terminalInput, setTerminalInput] = useState('');
// //   const [isExecuting, setIsExecuting] = useState(false);
  
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);
// //   const iframeRef = useRef<HTMLIFrameElement | null>(null);
// //   const terminalEndRef = useRef<HTMLDivElement | null>(null);

// //   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// //   const token = localStorage.getItem('token');

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   useEffect(() => {
// //     if (showPreview && currentProject) {
// //       updatePreview();
// //     }
// //   }, [showPreview, currentProject]);

// //   useEffect(() => {
// //     terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [terminalOutput]);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   const updatePreview = () => {
// //     if (iframeRef.current && currentProject) {
// //       const entryFile = currentProject.files.find(
// //         f => f.name === 'index.html' || f.path === 'index.html'
// //       );
      
// //       if (entryFile) {
// //         const iframe = iframeRef.current;
// //         const doc = iframe.contentDocument || iframe.contentWindow?.document;
// //         if (doc) {
// //           doc.open();
// //           doc.write(entryFile.content);
// //           doc.close();
// //         }
// //       }
// //     }
// //   };

// //   const sendMessage = async () => {
// //     if (!input.trim() || isGenerating) return;

// //     const userMessage: Message = {
// //       role: 'user',
// //       content: input,
// //       timestamp: new Date()
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInput('');
// //     setIsGenerating(true);

// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/mejuvante/chat`,
// //         {
// //           message: input,
// //           projectId: currentProject?.id,
// //           conversationHistory: messages.slice(-10).map(m => ({
// //             role: m.role,
// //             content: m.content
// //           }))
// //         },
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       const data = response.data;

// //       const assistantMessage: Message = {
// //         role: 'assistant',
// //         content: data.reply || data.message,
// //         timestamp: new Date(),
// //         files: data.files || [],
// //         metadata: data.metadata
// //       };

// //       setMessages(prev => [...prev, assistantMessage]);

// //       if (data.files && data.files.length > 0) {
// //         const project: ProjectData = {
// //           id: data.projectId || `project_${Date.now()}`,
// //           name: input.substring(0, 50),
// //           files: data.files,
// //           description: data.message,
// //           stackRecommendation: data.stackRecommendation,
// //           setupInstructions: data.setupInstructions,
// //           dependencies: data.dependencies
// //         };
        
// //         setCurrentProject(project);
// //         setShowPreview(true);
// //         setPreviewKey(prev => prev + 1);
        
// //         if (data.files.length > 0) {
// //           setSelectedFile(data.files[0]);
// //         }
// //       }
// //     } catch (error: any) {
// //       console.error('Chat error:', error);
// //       const errorMessage: Message = {
// //         role: 'assistant',
// //         content: `Sorry, I encountered an error: ${error.response?.data?.message || error.message}. Please try again.`,
// //         timestamp: new Date()
// //       };
// //       setMessages(prev => [...prev, errorMessage]);
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const downloadProject = async () => {
// //     if (!currentProject) return;

// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/mejuvante/export-zip`,
// //         {
// //           files: currentProject.files,
// //           projectName: currentProject.name
// //         },
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           },
// //           responseType: 'blob'
// //         }
// //       );

// //       const url = window.URL.createObjectURL(new Blob([response.data]));
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       window.URL.revokeObjectURL(url);
// //     } catch (error) {
// //       console.error('Download error:', error);
// //       alert('Failed to download project');
// //     }
// //   };

// //   const copyToClipboard = async (content: string, fileName: string) => {
// //     try {
// //       await navigator.clipboard.writeText(content);
// //       setCopiedFile(fileName);
// //       setTimeout(() => setCopiedFile(null), 2000);
// //     } catch (error) {
// //       console.error('Copy error:', error);
// //     }
// //   };

// //   const executeTerminalCommand = async () => {
// //     if (!terminalInput.trim() || isExecuting) return;

// //     const command = terminalInput;
// //     setTerminalOutput(prev => [...prev, `$ ${command}`]);
// //     setTerminalInput('');
// //     setIsExecuting(true);

// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/mejuvante/terminal/execute`,
// //         {
// //           projectId: currentProject?.id,
// //           command: command
// //         },
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`
// //           }
// //         }
// //       );

// //       setTerminalOutput(prev => [...prev, response.data.output]);
// //     } catch (error: any) {
// //       setTerminalOutput(prev => [
// //         ...prev, 
// //         `Error: ${error.response?.data?.message || error.message}`
// //       ]);
// //     } finally {
// //       setIsExecuting(false);
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-900">
// //       {/* Chat Panel */}
// //       <div className={`${showPreview ? 'w-1/3' : 'w-full'} flex flex-col transition-all duration-300 border-r border-gray-700`}>
// //         {/* Header */}
// //         <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
// //               <MessageSquare className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-xl font-bold text-white">Mejuvante AI</h1>
// //               <p className="text-sm text-gray-400">AI-powered project generator</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
// //           {messages.map((msg, idx) => (
// //             <div
// //               key={idx}
// //               className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
// //             >
// //               <div
// //                 className={`max-w-[85%] rounded-2xl px-4 py-3 ${
// //                   msg.role === 'user'
// //                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
// //                     : 'bg-gray-800 text-gray-100'
// //                 }`}
// //               >
// //                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
// //                 {msg.files && msg.files.length > 0 && (
// //                   <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
// //                     <button
// //                       onClick={() => setShowPreview(!showPreview)}
// //                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
// //                     >
// //                       <Play className="w-3 h-3" />
// //                       {showPreview ? 'Hide' : 'Show'} Preview
// //                     </button>
// //                     <button
// //                       onClick={downloadProject}
// //                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
// //                     >
// //                       <Download className="w-3 h-3" />
// //                       Download ZIP
// //                     </button>
// //                     <button
// //                       onClick={() => setShowTerminal(!showTerminal)}
// //                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
// //                     >
// //                       <TerminalIcon className="w-3 h-3" />
// //                       Terminal
// //                     </button>
// //                   </div>
// //                 )}
                
// //                 <p className="text-xs opacity-60 mt-2">
// //                   {msg.timestamp.toLocaleTimeString()}
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
          
// //           {isGenerating && (
// //             <div className="flex justify-start">
// //               <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
// //                 <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
// //                 <p className="text-sm text-gray-300">Generating your project...</p>
// //               </div>
// //             </div>
// //           )}
// //           <div ref={messagesEndRef} />
// //         </div>

// //         {/* Input */}
// //         <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
// //           <div className="flex gap-3">
// //             <input
// //               type="text"
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
// //               placeholder="Describe the project you want to build..."
// //               disabled={isGenerating}
// //               className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors"
// //             />
// //             <button
// //               onClick={sendMessage}
// //               disabled={isGenerating || !input.trim()}
// //               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
// //             >
// //               {isGenerating ? (
// //                 <Loader2 className="w-5 h-5 animate-spin" />
// //               ) : (
// //                 <Send className="w-5 h-5" />
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Preview/Code Panel */}
// //       {showPreview && currentProject && (
// //         <div className="flex-1 flex flex-col bg-gray-900">
// //           {/* Tabs */}
// //           <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
// //             <div className="flex gap-2 overflow-x-auto">
// //               {currentProject.files.map((file, idx) => (
// //                 <button
// //                   key={idx}
// //                   onClick={() => setSelectedFile(file)}
// //                   className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
// //                     selectedFile?.name === file.name
// //                       ? 'text-purple-400 border-b-2 border-purple-500'
// //                       : 'text-gray-400 hover:text-gray-200'
// //                   }`}
// //                 >
// //                   <FileCode className="w-4 h-4 inline mr-2" />
// //                   {file.name}
// //                 </button>
// //               ))}
// //             </div>
            
// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => setIsFullscreen(!isFullscreen)}
// //                 className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
// //               >
// //                 {isFullscreen ? (
// //                   <Minimize2 className="w-4 h-4 text-gray-400" />
// //                 ) : (
// //                   <Maximize2 className="w-4 h-4 text-gray-400" />
// //                 )}
// //               </button>
// //               <button
// //                 onClick={() => setShowPreview(false)}
// //                 className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
// //               >
// //                 <X className="w-4 h-4 text-gray-400" />
// //               </button>
// //             </div>
// //           </div>

// //           {/* Content */}
// //           <div className="flex-1 flex overflow-hidden">
// //             {/* Code Editor */}
// //             {selectedFile && (
// //               <div className="w-1/2 flex flex-col border-r border-gray-700">
// //                 <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
// //                   <span className="text-sm text-gray-300 font-medium">{selectedFile.name}</span>
// //                   <button
// //                     onClick={() => copyToClipboard(selectedFile.content, selectedFile.name)}
// //                     className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition-colors"
// //                   >
// //                     {copiedFile === selectedFile.name ? (
// //                       <>
// //                         <Check className="w-3 h-3" />
// //                         Copied!
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Copy className="w-3 h-3" />
// //                         Copy
// //                       </>
// //                     )}
// //                   </button>
// //                 </div>
// //                 <pre className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto">
// //                   <code>{selectedFile.content}</code>
// //                 </pre>
// //               </div>
// //             )}

// //             {/* Live Preview */}
// //             <div className="flex-1 flex flex-col bg-white">
// //               <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
// //                 <div className="flex items-center gap-2">
// //                   <Zap className="w-4 h-4 text-green-500" />
// //                   <span className="text-sm text-gray-300 font-medium">Live Preview</span>
// //                 </div>
// //                 <button
// //                   onClick={() => {
// //                     setPreviewKey(prev => prev + 1);
// //                     setTimeout(updatePreview, 100);
// //                   }}
// //                   className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
// //                 >
// //                   Refresh
// //                 </button>
// //               </div>
// //               <div className="flex-1 relative">
// //                 <iframe
// //                   key={previewKey}
// //                   ref={iframeRef}
// //                   className="w-full h-full border-0"
// //                   title="preview"
// //                   sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Terminal */}
// //           {showTerminal && (
// //             <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
// //               <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
// //                 <div className="flex items-center gap-2">
// //                   <TerminalIcon className="w-4 h-4 text-green-500" />
// //                   <span className="text-sm text-gray-300 font-medium">Terminal</span>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowTerminal(false)}
// //                   className="text-gray-400 hover:text-white"
// //                 >
// //                   <ChevronDown className="w-4 h-4" />
// //                 </button>
// //               </div>
// //               <div className="flex-1 p-4 overflow-auto font-mono text-sm text-green-400">
// //                 {terminalOutput.map((line, idx) => (
// //                   <div key={idx} className="whitespace-pre-wrap">{line}</div>
// //                 ))}
// //                 <div ref={terminalEndRef} />
// //               </div>
// //               <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-t border-gray-700">
// //                 <span className="text-green-500">$</span>
// //                 <input
// //                   type="text"
// //                   value={terminalInput}
// //                   onChange={(e) => setTerminalInput(e.target.value)}
// //                   onKeyPress={(e) => e.key === 'Enter' && executeTerminalCommand()}
// //                   disabled={isExecuting}
// //                   placeholder="Enter command..."
// //                   className="flex-1 bg-transparent text-green-400 outline-none font-mono text-sm disabled:opacity-50"
// //                 />
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatPage;


// // frontend/src/pages/ChatPage.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Send, Download, Play, Code, Loader2, MessageSquare, FileCode, X,
//   Copy, Check, Terminal as TerminalIcon, Maximize2, Minimize2, ChevronDown, Zap, ShieldCheck
// } from 'lucide-react';
// import { mejuvanteApi } from '../services/api';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   files?: FileData[];
//   metadata?: any;
// }

// interface FileData {
//   name: string;
//   path?: string;
//   content: string;
//   language?: string;
// }

// interface ProjectData {
//   id: string;
//   name: string;
//   files: FileData[];
//   description?: string;
//   setupInstructions?: string[];
//   dependencies?: any;
// }

// const ChatPage: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: 'assistant',
//       content:
//         "Hi! I'm CodeAlchemy. Tell me what to build — e.g. “Create a React todo app” or “Build a coffee shop landing page”. I'll generate the files with live preview & ZIP download.",
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showTerminal, setShowTerminal] = useState(false);
//   const [previewKey, setPreviewKey] = useState(0);
//   const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
//   const [copiedFile, setCopiedFile] = useState<string | null>(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
//   const [terminalInput, setTerminalInput] = useState('');
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [validation, setValidation] = useState<any | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const terminalEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
//   useEffect(() => { if (showPreview && currentProject) updatePreview(); }, [showPreview, currentProject]);
//   useEffect(() => terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [terminalOutput]);

//   const updatePreview = () => {
//     if (iframeRef.current && currentProject) {
//       const entry = currentProject.files.find((f) => (f.name || f.path) === 'index.html');
//       if (entry) {
//         const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
//         if (doc) {
//           doc.open(); doc.write(entry.content); doc.close();
//         }
//       }
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim() || isGenerating) return;

//     const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsGenerating(true);

//     try {
//       const resp = await mejuvanteApi.chat({
//         message: input,
//         projectId: currentProject?.id,
//         conversationHistory: messages.slice(-10).map((m) => ({ role: m.role, content: m.content }))
//       });

//       const assistantMessage: Message = {
//         role: 'assistant',
//         content: resp.reply || resp.message || 'Generated!',
//         timestamp: new Date(),
//         files: resp.files || [],
//         metadata: resp.metadata
//       };
//       setMessages((prev) => [...prev, assistantMessage]);

//       if (resp.files && resp.files.length > 0) {
//         const proj: ProjectData = {
//           id: resp.projectId || `project_${Date.now()}`,
//           name: input.substring(0, 50) || 'Generated Project',
//           files: resp.files,
//           description: resp.message,
//           setupInstructions: resp.setupInstructions,
//           dependencies: resp.dependencies
//         };
//         setCurrentProject(proj);
//         setShowPreview(true);
//         setPreviewKey((v) => v + 1);
//         setSelectedFile(resp.files[0]);
//         setValidation(null);
//       }
//     } catch (error: any) {
//       const msg: Message = {
//         role: 'assistant',
//         content: `Sorry, I hit an error: ${error?.response?.data?.message || error.message}`,
//         timestamp: new Date()
//       };
//       setMessages((prev) => [...prev, msg]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadProject = async () => {
//     if (!currentProject) return;
//     try {
//       const blob = await mejuvanteApi.exportZip({
//         files: currentProject.files,
//         projectName: currentProject.name
//       });
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
//       document.body.appendChild(a); a.click(); document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       alert('Failed to download ZIP');
//     }
//   };

//   const validateProject = async () => {
//     if (!currentProject) return;
//     try {
//       const result = await mejuvanteApi.validate(currentProject.files);
//       setValidation(result);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content:
//             `Validation summary: ${result.summary || 'See issues below.'}\n` +
//             (Array.isArray(result.issues) && result.issues.length
//               ? `\nIssues:\n${result.issues
//                   .slice(0, 10)
//                   .map((i: any) => `- [${i.severity}] ${i.file || ''}: ${i.message}${i.suggestion ? ` (fix: ${i.suggestion})` : ''}`)
//                   .join('\n')}`
//               : '\nNo issues detected. ✅'),
//           timestamp: new Date()
//         }
//       ]);
//     } catch (e: any) {
//       alert(`Validation failed: ${e?.response?.data?.message || e.message}`);
//     }
//   };

//   const copyToClipboard = async (content: string, fileName: string) => {
//     try {
//       await navigator.clipboard.writeText(content);
//       setCopiedFile(fileName);
//       setTimeout(() => setCopiedFile(null), 1500);
//     } catch {}
//   };

//   const executeTerminalCommand = async () => {
//     if (!terminalInput.trim() || isExecuting) return;
//     const command = terminalInput;
//     setTerminalOutput((prev) => [...prev, `$ ${command}`]);
//     setTerminalInput('');
//     setIsExecuting(true);
//     try {
//       const result = await mejuvanteApi.executeCommand({ projectId: currentProject?.id, command });
//       setTerminalOutput((prev) => [...prev, result.output]);
//     } catch (e: any) {
//       setTerminalOutput((prev) => [...prev, `Error: ${e?.response?.data?.message || e.message}`]);
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-900">
//       {/* Chat */}
//       <div className={`${showPreview ? 'w-1/3' : 'w-full'} flex flex-col transition-all duration-300 border-r border-gray-700`}>
//         <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">CodeAlchemy</h1>
//               <p className="text-sm text-gray-400">AI-powered project generator</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//           {messages.map((m, i) => (
//             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div
//                 className={`max-w-[85%] rounded-2xl px-4 py-3 ${
//                   m.role === 'user'
//                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
//                     : 'bg-gray-800 text-gray-100'
//                 }`}
//               >
//                 <p className="text-sm whitespace-pre-wrap">{m.content}</p>
//                 {m.files && m.files.length > 0 && (
//                   <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
//                     <button
//                       onClick={() => setShowPreview((v) => !v)}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <Play className="w-3 h-3" />
//                       {showPreview ? 'Hide' : 'Show'} Preview
//                     </button>
//                     <button
//                       onClick={downloadProject}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <Download className="w-3 h-3" />
//                       Download ZIP
//                     </button>
//                     <button
//                       onClick={validateProject}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <ShieldCheck className="w-3 h-3" />
//                       Validate
//                     </button>
//                     <button
//                       onClick={() => setShowTerminal((v) => !v)}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <TerminalIcon className="w-3 h-3" />
//                       Terminal
//                     </button>
//                   </div>
//                 )}
//                 <p className="text-xs opacity-60 mt-2">{m.timestamp.toLocaleTimeString()}</p>
//               </div>
//             </div>
//           ))}
//           {isGenerating && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
//                 <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
//                 <p className="text-sm text-gray-300">Generating your project...</p>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//               placeholder="Describe the project you want to build..."
//               disabled={isGenerating}
//               className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors"
//             />
//             <button
//               onClick={sendMessage}
//               disabled={isGenerating || !input.trim()}
//               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
//             >
//               {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Preview/Code */}
//       {showPreview && currentProject && (
//         <div className="flex-1 flex flex-col bg-gray-900">
//           <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
//             <div className="flex gap-2 overflow-x-auto">
//               {currentProject.files.map((file, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedFile(file)}
//                   className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                     selectedFile?.name === file.name ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'
//                   }`}
//                 >
//                   <FileCode className="w-4 h-4 inline mr-2" />
//                   {file.name}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setIsFullscreen((v) => !v)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//                 {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
//               </button>
//               <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//                 <X className="w-4 h-4 text-gray-400" />
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 flex overflow-hidden">
//             {selectedFile && (
//               <div className="w-1/2 flex flex-col border-r border-gray-700">
//                 <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//                   <span className="text-sm text-gray-300 font-medium">{selectedFile.name}</span>
//                   <button
//                     onClick={() => copyToClipboard(selectedFile.content, selectedFile.name)}
//                     className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition-colors"
//                   >
//                     {copiedFile === selectedFile.name ? (
//                       <>
//                         <Check className="w-3 h-3" />
//                         Copied!
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="w-3 h-3" />
//                         Copy
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <pre className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto">
//                   <code>{selectedFile.content}</code>
//                 </pre>
//               </div>
//             )}
//             <div className="flex-1 flex flex-col bg-white">
//               <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Zap className="w-4 h-4 text-green-500" />
//                   <span className="text-sm text-gray-300 font-medium">Live Preview</span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setPreviewKey((v) => v + 1);
//                     setTimeout(updatePreview, 50);
//                   }}
//                   className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
//                 >
//                   Refresh
//                 </button>
//               </div>
//               <div className="flex-1 relative">
//                 <iframe key={previewKey} ref={iframeRef} className="w-full h-full border-0" title="preview" sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin" />
//               </div>
//             </div>
//           </div>

//           {showTerminal && (
//             <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
//               <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//                 <div className="flex items-center gap-2">
//                   <TerminalIcon className="w-4 h-4 text-green-500" />
//                   <span className="text-sm text-gray-300 font-medium">Terminal</span>
//                 </div>
//                 <button onClick={() => setShowTerminal(false)} className="text-gray-400 hover:text-white">
//                   <ChevronDown className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="flex-1 p-4 overflow-auto font-mono text-sm text-green-400">
//                 {terminalOutput.map((line, idx) => (
//                   <div key={idx} className="whitespace-pre-wrap">
//                     {line}
//                   </div>
//                 ))}
//                 <div ref={terminalEndRef} />
//               </div>
//               <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-t border-gray-700">
//                 <span className="text-green-500">$</span>
//                 <input
//                   type="text"
//                   value={terminalInput}
//                   onChange={(e) => setTerminalInput(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
//                   disabled={isExecuting}
//                   placeholder="Enter command..."
//                   className="flex-1 bg-transparent text-green-400 outline-none font-mono text-sm disabled:opacity-50"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;



// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Send, Download, Play, Code, Loader2, MessageSquare, FileCode, X,
//   Copy, Check, Terminal as TerminalIcon, Maximize2, Minimize2, ChevronDown, Zap, ShieldCheck
// } from 'lucide-react';
// import { mejuvanteApi } from '../services/api';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   files?: FileData[];
//   metadata?: any;
// }

// interface FileData {
//   name: string;
//   path?: string;
//   content: string;
//   language?: string;
// }

// interface ProjectData {
//   id: string;
//   name: string;
//   files: FileData[];
//   description?: string;
//   setupInstructions?: string[];
//   dependencies?: any;
// }

// // ---- helper: normalize API files so UI types are always satisfied
// const normalizeApiFiles = (apiFiles: any[]): FileData[] => {
//   return (apiFiles || []).map((f: any, i: number) => {
//     const path = (f.path ?? f.name ?? `file_${i}.txt`) as string;
//     const name = (f.name ?? (path.split('/').pop() || `file_${i}.txt`)) as string;
//     const content = (f.content ?? f.code ?? '') as string;
//     const ext = (path.split('.').pop() || '').toLowerCase();
//     const langMap: Record<string, string> = {
//       js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
//       html: 'html', css: 'css', json: 'json', md: 'markdown',
//       py: 'python', java: 'java', go: 'go',
//     };
//     const language = (f.language ?? langMap[ext] ?? 'plaintext') as string;
//     return { name, path, content, language };
//   });
// };

// const ChatPage: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: 'assistant',
//       content:
//         "Hi! I'm CodeAlchemy. Tell me what to build — e.g. “Create a React todo app” or “Build a coffee shop landing page”. I'll generate the files with live preview & ZIP download.",
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showTerminal, setShowTerminal] = useState(false);
//   const [previewKey, setPreviewKey] = useState(0);
//   const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
//   const [copiedFile, setCopiedFile] = useState<string | null>(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
//   const [terminalInput, setTerminalInput] = useState('');
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [validation, setValidation] = useState<any | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const iframeRef = useRef<HTMLIFrameElement | null>(null);
//   const terminalEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
//   useEffect(() => { if (showPreview && currentProject) updatePreview(); }, [showPreview, currentProject]);
//   useEffect(() => terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [terminalOutput]);

//   const updatePreview = () => {
//     if (iframeRef.current && currentProject) {
//       const entry =
//         currentProject.files.find((f) => f.name === 'index.html') ||
//         currentProject.files.find((f) => (f.path || '').endsWith('index.html'));
//       if (entry) {
//         const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
//         if (doc) {
//           doc.open(); doc.write(entry.content); doc.close();
//         }
//       }
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim() || isGenerating) return;

//     const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsGenerating(true);

//     try {
//       const resp = await mejuvanteApi.chat({
//         message: input,
//         projectId: currentProject?.id,
//         conversationHistory: messages.slice(-10).map((m) => ({ role: m.role, content: m.content }))
//       });

//       const files = normalizeApiFiles(resp.files ?? []);

//       const assistantMessage: Message = {
//         role: 'assistant',
//         content: resp.reply || resp.message || 'Generated!',
//         timestamp: new Date(),
//         files,                       // normalized
//         metadata: resp.metadata
//       };
//       setMessages((prev) => [...prev, assistantMessage]);

//       if (files.length > 0) {
//         const proj: ProjectData = {
//           id: resp.projectId || `project_${Date.now()}`,
//           name: input.substring(0, 50) || 'Generated Project',
//           files,
//           description: resp.message,
//           setupInstructions: resp.setupInstructions,
//           dependencies: resp.dependencies
//         };
//         setCurrentProject(proj);
//         setShowPreview(true);
//         setPreviewKey((v) => v + 1);
//         setSelectedFile(files[0]);
//         setValidation(null);
//       }
//     } catch (error: any) {
//       const msg: Message = {
//         role: 'assistant',
//         content: `Sorry, I hit an error: ${error?.response?.data?.message || error.message}`,
//         timestamp: new Date()
//       };
//       setMessages((prev) => [...prev, msg]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadProject = async () => {
//     if (!currentProject) return;
//     try {
//       const blob = await mejuvanteApi.exportZip({
//         files: currentProject.files,
//         projectName: currentProject.name
//       });
//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
//       document.body.appendChild(a); a.click(); document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (e) {
//       alert('Failed to download ZIP');
//     }
//   };

//   const validateProject = async () => {
//     if (!currentProject) return;
//     try {
//       const result = await mejuvanteApi.validate(currentProject.files);
//       setValidation(result);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: 'assistant',
//           content:
//             `Validation summary: ${result.summary || 'See issues below.'}\n` +
//             (Array.isArray(result.issues) && result.issues.length
//               ? `\nIssues:\n${result.issues
//                   .slice(0, 10)
//                   .map((i: any) => `- [${i.severity}] ${i.file || ''}: ${i.message}${i.suggestion ? ` (fix: ${i.suggestion})` : ''}`)
//                   .join('\n')}`
//               : '\nNo issues detected. ✅'),
//           timestamp: new Date()
//         }
//       ]);
//     } catch (e: any) {
//       alert(`Validation failed: ${e?.response?.data?.message || e.message}`);
//     }
//   };

//   const copyToClipboard = async (content: string, fileName: string) => {
//     try {
//       await navigator.clipboard.writeText(content);
//       setCopiedFile(fileName);
//       setTimeout(() => setCopiedFile(null), 1500);
//     } catch {}
//   };

//   const executeTerminalCommand = async () => {
//     if (!terminalInput.trim() || isExecuting) return;
//     const command = terminalInput;
//     setTerminalOutput((prev) => [...prev, `$ ${command}`]);
//     setTerminalInput('');
//     setIsExecuting(true);
//     try {
//       const result = await mejuvanteApi.executeCommand({ projectId: currentProject?.id, command });
//       setTerminalOutput((prev) => [...prev, result.output]);
//     } catch (e: any) {
//       setTerminalOutput((prev) => [...prev, `Error: ${e?.response?.data?.message || e.message}`]);
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-900">
//       {/* Chat */}
//       <div className={`${showPreview ? 'w-1/3' : 'w-full'} flex flex-col transition-all duration-300 border-r border-gray-700`}>
//         <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">CodeAlchemy</h1>
//               <p className="text-sm text-gray-400">AI-powered project generator</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//           {messages.map((m, i) => (
//             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div
//                 className={`max-w-[85%] rounded-2xl px-4 py-3 ${
//                   m.role === 'user'
//                     ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
//                     : 'bg-gray-800 text-gray-100'
//                 }`}
//               >
//                 <p className="text-sm whitespace-pre-wrap">{m.content}</p>
//                 {m.files && m.files.length > 0 && (
//                   <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
//                     <button
//                       onClick={() => setShowPreview((v) => !v)}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <Play className="w-3 h-3" />
//                       {showPreview ? 'Hide' : 'Show'} Preview
//                     </button>
//                     <button
//                       onClick={downloadProject}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <Download className="w-3 h-3" />
//                       Download ZIP
//                     </button>
//                     <button
//                       onClick={validateProject}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <ShieldCheck className="w-3 h-3" />
//                       Validate
//                     </button>
//                     <button
//                       onClick={() => setShowTerminal((v) => !v)}
//                       className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs flex items-center gap-1 transition-colors"
//                     >
//                       <TerminalIcon className="w-3 h-3" />
//                       Terminal
//                     </button>
//                   </div>
//                 )}
//                 <p className="text-xs opacity-60 mt-2">{m.timestamp.toLocaleTimeString()}</p>
//               </div>
//             </div>
//           ))}
//           {isGenerating && (
//             <div className="flex justify-start">
//               <div className="bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
//                 <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
//                 <p className="text-sm text-gray-300">Generating your project...</p>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//               placeholder="Describe the project you want to build..."
//               disabled={isGenerating}
//               className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors"
//             />
//             <button
//               onClick={sendMessage}
//               disabled={isGenerating || !input.trim()}
//               className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
//             >
//               {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Preview/Code */}
//       {showPreview && currentProject && (
//         <div className="flex-1 flex flex-col bg-gray-900">
//           <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
//             <div className="flex gap-2 overflow-x-auto">
//               {currentProject.files.map((file, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedFile(file)}
//                   className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
//                     selectedFile?.name === file.name ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-200'
//                   }`}
//                 >
//                   <FileCode className="w-4 h-4 inline mr-2" />
//                   {file.name}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => setIsFullscreen((v) => !v)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//                 {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
//               </button>
//               <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//                 <X className="w-4 h-4 text-gray-400" />
//               </button>
//             </div>
//           </div>

//           <div className="flex-1 flex overflow-hidden">
//             {selectedFile && (
//               <div className="w-1/2 flex flex-col border-r border-gray-700">
//                 <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//                   <span className="text-sm text-gray-300 font-medium">{selectedFile.name}</span>
//                   <button
//                     onClick={() => copyToClipboard(selectedFile.content, selectedFile.name)}
//                     className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition-colors"
//                   >
//                     {copiedFile === selectedFile.name ? (
//                       <>
//                         <Check className="w-3 h-3" />
//                         Copied!
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="w-3 h-3" />
//                         Copy
//                       </>
//                     )}
//                   </button>
//                 </div>
//                 <pre className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm overflow-auto">
//                   <code>{selectedFile.content}</code>
//                 </pre>
//               </div>
//             )}
//             <div className="flex-1 flex flex-col bg-white">
//               <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Zap className="w-4 h-4 text-green-500" />
//                   <span className="text-sm text-gray-300 font-medium">Live Preview</span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setPreviewKey((v) => v + 1);
//                     setTimeout(updatePreview, 50);
//                   }}
//                   className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
//                 >
//                   Refresh
//                 </button>
//               </div>
//               <div className="flex-1 relative">
//                 <iframe
//                   key={previewKey}
//                   ref={iframeRef}
//                   className="w-full h-full border-0"
//                   title="preview"
//                   sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
//                 />
//               </div>
//             </div>
//           </div>

//           {showTerminal && (
//             <div className="h-64 bg-black border-t border-gray-700 flex flex-col">
//               <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
//                 <div className="flex items-center gap-2">
//                   <TerminalIcon className="w-4 h-4 text-green-500" />
//                   <span className="text-sm text-gray-300 font-medium">Terminal</span>
//                 </div>
//                 <button onClick={() => setShowTerminal(false)} className="text-gray-400 hover:text-white">
//                   <ChevronDown className="w-4 h-4" />
//                 </button>
//               </div>
//               <div className="flex-1 p-4 overflow-auto font-mono text-sm text-green-400">
//                 {terminalOutput.map((line, idx) => (
//                   <div key={idx} className="whitespace-pre-wrap">
//                     {line}
//                   </div>
//                 ))}
//                 <div ref={terminalEndRef} />
//               </div>
//               <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-t border-gray-700">
//                 <span className="text-green-500">$</span>
//                 <input
//                   type="text"
//                   value={terminalInput}
//                   onChange={(e) => setTerminalInput(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
//                   disabled={isExecuting}
//                   placeholder="Enter command..."
//                   className="flex-1 bg-transparent text-green-400 outline-none font-mono text-sm disabled:opacity-50"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;


// // ChatPage.tsx (or your chat component)
// import React, { useState } from 'react';
// import { mejuvanteApi, downloadZip } from '../services/api'; // adjust path
// import  DeployModal  from '../pages/DeployModal';

// type GenResult = {
//   projectId: string;
//   projectName?: string;
//   files: Array<{ name?: string; path?: string; content: string; language?: string }>;
// };

// const ChatPage: React.FC = () => {
//   const [lastGen, setLastGen] = useState<GenResult | null>(null);
//   const [showDeploy, setShowDeploy] = useState(false);

//   async function onProjectGenerated(resp: any) {
//     if (resp?.success && Array.isArray(resp.files) && resp.files.length > 0) {
//       setLastGen({
//         projectId: resp.projectId,
//         projectName: resp.projectName || 'Generated Project',
//         files: resp.files,
//       });
//     }
//   }

//   // wherever you send a message that might create a project:
//   async function handleSend(message: string) {
//     const resp = await mejuvanteApi.generateProject(message);
//     await onProjectGenerated(resp);
//     // ...existing chat UI updates
//   }

//   return (
//     <>
//       {/* ... your chat UI ... */}

//       {lastGen && (
//         <div className="post" style={{ borderLeft: '6px solid #2c99b7' }}>
//           <h3 style={{ marginTop: 0 }}>{lastGen.projectName || 'Generated Project'}</h3>
//           <p>{lastGen.files.length} files generated</p>

//           <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//             <a
//               className="btn btn-secondary"
//               href={`/api/mejuvante/preview/${lastGen.projectId}`}
//               target="_blank" rel="noreferrer"
//             >
//               Preview
//             </a>

//             <button
//               className="btn"
//               onClick={() => downloadZip(lastGen.projectName || 'project', lastGen.files)}
//             >
//               Download ZIP
//             </button>

//             <button
//               className="btn btn-primary"
//               onClick={() => setShowDeploy(true)}
//             >
//               Deploy
//             </button>
//           </div>
//         </div>
//       )}

//       {showDeploy && lastGen && (
//         <DeployModal
//           onClose={() => setShowDeploy(false)}
//           onConfirm={async (cfg) => {
//             const r = await mejuvanteApi.deployToBackend({
//               projectId: lastGen.projectId,
//               // You can omit files if backend reads from projectStorage
//               files: lastGen.files,
//               config: cfg,
//             });
//             if (r?.success && r?.url) window.open(r.url, '_blank');
//             setShowDeploy(false);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default ChatPage;



// // src/pages/ChatPage.tsx
// import React, { useState } from 'react';
// import { mejuvanteApi, downloadZip } from '../services/api';
// import DeployModal from '../pages/DeployModal';

// type GenFile = { name?: string; path?: string; content: string; language?: string };
// type GenResult = { projectId: string; projectName?: string; files: GenFile[] };

// const ChatPage: React.FC = () => {
//   const [lastGen, setLastGen] = useState<GenResult | null>(null);
//   const [showDeploy, setShowDeploy] = useState(false);

//   // NEW: simple input so the page is never blank
//   const [input, setInput] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [status, setStatus] = useState<string>(''); // show quick status/error

//   async function onProjectGenerated(resp: any) {
//     if (resp?.success && Array.isArray(resp.files) && resp.files.length > 0) {
//       setLastGen({
//         projectId: resp.projectId,
//         projectName: resp.projectName || 'Generated Project',
//         files: resp.files,
//       });
//       setStatus(`Generated ${resp.files.length} files.`);
//     } else {
//       setStatus(resp?.message || 'No files returned. Try a more specific prompt.');
//     }
//   }

//   // Trigger generation
//   async function handleSend(message: string) {
//     if (!message.trim() || busy) return;
//     setBusy(true);
//     setStatus('Generating…');
//     try {
//       const resp = await mejuvanteApi.generateProject(message);
//       await onProjectGenerated(resp);
//     } catch (e: any) {
//       setStatus(`Error: ${e?.response?.data?.message || e.message || 'failed'}`);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="container" style={{ padding: 16 }}>
//       {/* Header / beacon so you always see something */}
//       <header style={{
//         background: 'linear-gradient(135deg, #1e3c61, #2c99b7)',
//         color: '#fff',
//         borderRadius: 8,
//         padding: '14px 16px',
//         marginBottom: 12
//       }}>
//         <h2 style={{ margin: 0 }}>CodeAlchemy — Chat</h2>
//         <small style={{ opacity: 0.9 }}>
//           Describe what to build (e.g. “Create a React todo app with Tailwind and localStorage”).
//         </small>
//       </header>

//       {/* Composer */}
//       <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
//           placeholder="Type your prompt and press Enter…"
//           disabled={busy}
//           style={{
//             flex: 1, padding: '12px 14px', borderRadius: 8,
//             border: '1px solid #e0e0e0', outline: 'none'
//           }}
//         />
//         <button
//           onClick={() => handleSend(input)}
//           disabled={busy || !input.trim()}
//           className="btn btn-primary"
//           style={{
//             background: '#1e3c61', color: '#fff', border: 'none',
//             padding: '10px 16px', borderRadius: 8, cursor: 'pointer', opacity: (busy || !input.trim()) ? .6 : 1
//           }}
//         >
//           {busy ? 'Generating…' : 'Generate'}
//         </button>
//       </div>

//       {/* Small status line */}
//       {status && (
//         <div className="post" style={{
//           background: '#fff', padding: 12, borderRadius: 8,
//           borderLeft: '6px solid #61c4ca', marginBottom: 12
//         }}>
//           <span style={{ fontSize: 13 }}>{status}</span>
//         </div>
//       )}

//       {/* Placeholder card so it’s not blank the first time */}
//       {!lastGen && (
//         <div className="post" style={{
//           background: '#fff', padding: 16, borderRadius: 8,
//           borderLeft: '6px solid #2c99b7'
//         }}>
//           <h3 style={{ marginTop: 0 }}>Start a new project</h3>
//           <p style={{ marginBottom: 0 }}>
//             Type a prompt above and press <b>Generate</b>. You’ll get a preview, ZIP download, and deploy options.
//           </p>
//         </div>
//       )}

//       {/* Generated project card with actions */}
//       {lastGen && (
//         <div className="post" style={{ borderLeft: '6px solid #2c99b7', background: '#fff', padding: 16, borderRadius: 8 }}>
//           <h3 style={{ marginTop: 0 }}>{lastGen.projectName || 'Generated Project'}</h3>
//           <p style={{ marginTop: 4 }}>{lastGen.files.length} files generated</p>

//           <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
//             <a
//               className="btn btn-secondary"
//               href={`/api/mejuvante/preview/${lastGen.projectId}`}
//               target="_blank" rel="noreferrer"
//               style={{ background: '#61c4ca', padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: '#08333a' }}
//             >
//               Preview
//             </a>

//             <button
//               className="btn"
//               onClick={() => downloadZip(lastGen.projectName || 'project', lastGen.files)}
//               style={{ background: '#2c99b7', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}
//             >
//               Download ZIP
//             </button>

//             <button
//               className="btn btn-primary"
//               onClick={() => setShowDeploy(true)}
//               style={{ background: '#1e3c61', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer' }}
//             >
//               Deploy
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Deploy Modal */}
//       {showDeploy && lastGen && (
//         <DeployModal
//           onClose={() => setShowDeploy(false)}
//           onConfirm={async (cfg: any) => {
//             const r = await mejuvanteApi.deployToBackend({
//               projectId: lastGen.projectId,
//               files: lastGen.files,   // you can omit if backend reads from projectStorage
//               config: cfg,
//             });
//             if (r?.success && r?.url) window.open(r.url, '_blank');
//             else alert(r?.message || 'Deploy failed');
//             setShowDeploy(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ChatPage;



// src/pages/ChatPage.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import { mejuvanteApi, downloadZip } from '../services/api';
// import DeployModal from '../pages/DeployModal';

// type GenFile = { name?: string; path?: string; content: string; language?: string };
// type GenResult = { projectId: string; projectName?: string; files: GenFile[] };

// type Msg = { role: 'user' | 'assistant' | 'status'; content: string; id: string };

// const palette = {
//   dark: '#1e3c61',
//   mid: '#2c99b7',
//   light: '#61c4ca',
//   ink: '#0b2230',
//   bg: '#f6f8fb',
//   white: '#fff',
// };

// const bubble = {
//   user: { background: `linear-gradient(135deg, ${palette.dark}, ${palette.mid})`, color: '#fff' },
//   ai: { background: '#fff', color: palette.ink, border: `1px solid rgba(0,0,0,0.06)` },
// };

// const ChatPage: React.FC = () => {
//   const [input, setInput] = useState('');
//   const [busy, setBusy] = useState(false);
//   const [messages, setMessages] = useState<Msg[]>([
//     {
//       id: 'hello',
//       role: 'assistant',
//       content:
//         "Hey! I'm CodeAlchemy. Tell me what to build — e.g. “Create a React todo app with Tailwind and localStorage.” I’ll generate files, a live preview, and a ZIP. 🚀",
//     },
//   ]);
//   const [lastGen, setLastGen] = useState<GenResult | null>(null);
//   const [showDeploy, setShowDeploy] = useState(false);
//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

//   function pushMessage(role: Msg['role'], content: string) {
//     setMessages((m) => [...m, { role, content, id: `${Date.now()}_${Math.random()}` }]);
//   }

//   async function handleSend(message?: string) {
//     const text = (message ?? input).trim();
//     if (!text || busy) return;

//     setBusy(true);
//     pushMessage('user', text);
//     setInput('');

//     // “typing…” indicator
//     const typingId = `${Date.now()}_typing`;
//     setMessages((m) => [...m, { id: typingId, role: 'status', content: 'Mejuvante is thinking…' }]);

//     try {
//       const resp = await mejuvanteApi.generateProject(text);

//       // remove typing
//       setMessages((m) => m.filter((x) => x.id !== typingId));

//       if (resp?.success && Array.isArray(resp.files) && resp.files.length > 0) {
//         pushMessage('assistant', resp.message || `Generated ${resp.files.length} files for your project.`);

//         setLastGen({
//           projectId: resp.projectId,
//           projectName: resp.projectName || 'Generated Project',
//           files: resp.files,
//         });
//       } else {
//         pushMessage('assistant', resp?.message || 'No files returned. Try a more specific prompt.');
//       }
//     } catch (e: any) {
//       // remove typing
//       setMessages((m) => m.filter((x) => x.id !== typingId));
//       const msg = e?.response?.data?.message || e.message || 'Something went wrong.';
//       pushMessage('assistant', `❌ ${msg}`);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: palette.bg }}>
//       {/* Header */}
//       <header
//         style={{
//           background: `linear-gradient(135deg, ${palette.dark}, ${palette.mid})`,
//           color: '#fff',
//           padding: '18px 16px',
//           position: 'sticky',
//           top: 0,
//           zIndex: 10,
//           boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
//         }}
//       >
//         <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//           <h1 style={{ margin: 0, fontSize: 22 }}>CodeAlchemy</h1>
//           <div style={{ opacity: 0.9, fontSize: 13 }}>where ideas turn into code ✨</div>
//         </div>
//       </header>

//       {/* Body */}
//       <div style={{ maxWidth: 1100, margin: '16px auto', padding: '0 12px' }}>
//         {/* Composer */}
//         <div
//           style={{
//             background: palette.white,
//             border: '1px solid rgba(0,0,0,0.06)',
//             borderRadius: 12,
//             padding: 12,
//             boxShadow: '0 8px 24px rgba(30,60,97,0.06)',
//             marginBottom: 12,
//           }}
//         >
//           <div style={{ display: 'flex', gap: 10 }}>
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Describe the app you want to build…"
//               disabled={busy}
//               style={{
//                 flex: 1,
//                 padding: '12px 14px',
//                 borderRadius: 10,
//                 border: '1px solid rgba(0,0,0,0.08)',
//                 outline: 'none',
//                 fontSize: 15,
//               }}
//             />
//             <button
//               onClick={() => handleSend()}
//               disabled={busy || !input.trim()}
//               style={{
//                 background: busy ? palette.mid : palette.dark,
//                 color: '#fff',
//                 border: 'none',
//                 padding: '12px 18px',
//                 borderRadius: 10,
//                 cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
//                 opacity: busy || !input.trim() ? 0.6 : 1,
//                 transition: 'transform .06s ease',
//               }}
//               onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
//               onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//             >
//               {busy ? 'Generating…' : 'Generate'}
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
//           {messages.map((m) => {
//             if (m.role === 'status') {
//               return (
//                 <div key={m.id} style={{ display: 'flex', justifyContent: 'center' }}>
//                   <div
//                     style={{
//                       background: '#ffffff',
//                       color: palette.ink,
//                       border: '1px dashed rgba(0,0,0,0.12)',
//                       padding: '8px 12px',
//                       fontSize: 13,
//                       borderRadius: 10,
//                     }}
//                   >
//                     {m.content}
//                   </div>
//                 </div>
//               );
//             }

//             const isUser = m.role === 'user';
//             return (
//               <div
//                 key={m.id}
//                 style={{
//                   display: 'flex',
//                   justifyContent: isUser ? 'flex-end' : 'flex-start',
//                   animation: 'fadeInUp .25s ease',
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: '80%',
//                     padding: '12px 14px',
//                     borderRadius: 12,
//                     ...(isUser ? bubble.user : bubble.ai),
//                     boxShadow: isUser
//                       ? '0 6px 18px rgba(30,60,97,0.25)'
//                       : '0 6px 18px rgba(0,0,0,0.06)',
//                     border: isUser ? 'none' : bubble.ai.border,
//                     whiteSpace: 'pre-wrap',
//                     lineHeight: 1.45,
//                     fontSize: 15,
//                   }}
//                 >
//                   {m.content}
//                 </div>
//               </div>
//             );
//           })}
//           <div ref={endRef} />
//         </div>

//         {/* Generated project card + actions */}
//         {lastGen && (
//           <div
//             style={{
//               background: palette.white,
//               border: '1px solid rgba(0,0,0,0.06)',
//               borderLeft: `6px solid ${palette.mid}`,
//               borderRadius: 10,
//               padding: 16,
//               boxShadow: '0 10px 28px rgba(12,30,50,0.08)',
//             }}
//           >
//             <h3 style={{ margin: '0 0 6px 0', color: palette.dark }}>
//               {lastGen.projectName || 'Generated Project'}
//             </h3>
//             <div style={{ color: '#375a6b', fontSize: 14, marginBottom: 10 }}>
//               {lastGen.files.length} files generated
//             </div>
//             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//               <a
//                 href={`/api/mejuvante/preview/${lastGen.projectId}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{
//                   background: palette.light,
//                   color: '#06333a',
//                   textDecoration: 'none',
//                   padding: '10px 14px',
//                   borderRadius: 10,
//                   fontWeight: 600,
//                 }}
//               >
//                 Live Preview
//               </a>

//               <button
//                 onClick={() => downloadZip(lastGen.projectName || 'project', lastGen.files)}
//                 style={{
//                   background: palette.mid,
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 14px',
//                   borderRadius: 10,
//                   cursor: 'pointer',
//                   fontWeight: 600,
//                 }}
//               >
//                 Download ZIP
//               </button>

//               <button
//                 onClick={() => setShowDeploy(true)}
//                 style={{
//                   background: palette.dark,
//                   color: '#fff',
//                   border: 'none',
//                   padding: '10px 14px',
//                   borderRadius: 10,
//                   cursor: 'pointer',
//                   fontWeight: 600,
//                 }}
//               >
//                 Deploy
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Deploy Modal */}
//       {showDeploy && lastGen && (
//         <DeployModal
//           onClose={() => setShowDeploy(false)}
//           onConfirm={async (cfg: any) => {
//             const r = await mejuvanteApi.deployToBackend({
//               projectId: lastGen.projectId,
//               files: lastGen.files, // optional if backend reads from projectStorage
//               config: cfg,
//             });
//             if (r?.success && r?.url) window.open(r.url, '_blank');
//             else alert(r?.message || 'Deploy failed');
//             setShowDeploy(false);
//           }}
//         />
//       )}

//       {/* tiny keyframes for bubble entrance */}
//       <style>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(4px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatPage;



import React from 'react';
import ChatInterface from '../components/ChatInterface/ChatInterface';

const ChatPage: React.FC = () => {
  return <ChatInterface />;
};

export default ChatPage;



