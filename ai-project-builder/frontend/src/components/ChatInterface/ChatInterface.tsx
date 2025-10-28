// // import React, { useEffect, useRef, useState } from 'react';
// // import { Send, Loader2, Play, Download, X, Code, ShieldCheck, Rocket } from 'lucide-react';
// // import { mejuvanteApi, projectAPI } from '../../services/api';
// // import { useNavigate } from 'react-router-dom';
// // import JSZip from 'jszip';
// // import './ChatInterface.css';

// // interface ChatInterfaceProps {
// //   projectId?: string;
// // }

// // interface ProjectFile {
// //   name: string;
// //   path?: string;
// //   content: string;
// //   language?: string;
// // }

// // interface Project {
// //   name: string;
// //   files: ProjectFile[];
// // }

// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// //   timestamp: Date;
// //   project?: Project;
// // }

// // const BRAND = {
// //   dark:  '#1e3c61',
// //   mid:   '#2c99b7',
// //   light: '#61c4ca',
// // };

// // // Normalize files from API
// // const normalizeApiFiles = (apiFiles: any[]): ProjectFile[] => {
// //   return (apiFiles || []).map((f, i) => {
// //     const path = f.path ?? f.name ?? `file_${i}.txt`;
// //     const name = f.name ?? path.split('/').pop() ?? `file_${i}.txt`;
// //     const content = f.content ?? f.code ?? '';
// //     const ext = path.split('.').pop()?.toLowerCase() || '';
// //     const langMap: Record<string,string> = {
// //       js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
// //       html: 'html', css: 'css', json: 'json', md: 'markdown',
// //       py: 'python', java: 'java', go: 'go',
// //     };
// //     const language = f.language ?? langMap[ext] ?? 'plaintext';
// //     return { name, path, content, language };
// //   });
// // };

// // // Infer application type
// // const inferApplicationType = (files: ProjectFile[]): 'web' | 'server' => {
// //   const pkg = files.find(f => (f.path || f.name).toLowerCase() === 'package.json');
// //   if (pkg && /express|fastify|koa/i.test(pkg.content)) return 'server';
// //   if (files.some(f => /express\(|createServer\(/i.test(f.content))) return 'server';
// //   return 'web';
// // };

// // // Generate sandboxed live preview URL
// // const buildSandboxPreview = (files: ProjectFile[]): string => {
// //   const htmlFile = files.find(f => f.path?.endsWith('.html')) || { content: '<div>Preview not available</div>' };
// //   const cssFiles = files.filter(f => f.path?.endsWith('.css')).map(f => `<style>${f.content}</style>`).join('\n');
// //   const jsFiles = files.filter(f => f.path?.endsWith('.js')).map(f => `<script>${f.content}</script>`).join('\n');

// //   const defaultColors = `
// //     <style>
// //       :root {
// //         --brand-dark: ${BRAND.dark};
// //         --brand-mid: ${BRAND.mid};
// //         --brand-light: ${BRAND.light};
// //       }
// //     </style>
// //   `;

// //   const previewHtml = `
// //     <html>
// //       <head>
// //         ${defaultColors}
// //         ${cssFiles}
// //       </head>
// //       <body>
// //         ${htmlFile.content}
// //         ${jsFiles}
// //         <script>
// //           // Mock backend API
// //           window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ message: 'Mock data' }) });
// //         </script>
// //       </body>
// //     </html>
// //   `;

// //   return 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
// // };

// // const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectId }) => {
// //   const navigate = useNavigate();
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   const [messages, setMessages] = useState<Message[]>([{
// //     role: 'assistant',
// //     content: "👋 Hi! I'm CodeAlchemy. Describe your app and I’ll generate a runnable project with live preview.",
// //     timestamp: new Date(),
// //   }]);
// //   const [input, setInput] = useState('');
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// //   const [serverProjectId, setServerProjectId] = useState<string | null>(projectId ?? null);
// //   const [showPreview, setShowPreview] = useState(false);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const persistChatHistory = async (proj: Project, incomingServerId?: string | null) => {
// //     const chatHistory = messages.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp.toISOString() }));
// //     try {
// //       let id = incomingServerId || serverProjectId;
// //       if (!id) {
// //         const created = await projectAPI.create({
// //           name: proj.name || 'Generated Project',
// //           description: 'Created via ChatInterface',
// //           type: inferApplicationType(proj.files),
// //           files: proj.files,
// //           chatHistory: JSON.stringify(chatHistory),
// //           status: 'draft',
// //         });
// //         id = created?.id || created?.project?.id || created?._id;
// //         setServerProjectId(id || null);
// //       } else {
// //         await projectAPI.update(id, { files: proj.files, chatHistory: JSON.stringify(chatHistory) });
// //       }
// //     } catch (e) {
// //       console.warn('Project persistence failed:', e);
// //     }
// //   };

// //   const sendMessage = async () => {
// //     if (!input.trim() || isGenerating) return;

// //     const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
// //     setMessages(prev => [...prev, userMsg]);
// //     setInput('');
// //     setIsGenerating(true);

// //     try {
// //       const resp = await mejuvanteApi.chat({
// //         message: userMsg.content,
// //         projectId: serverProjectId || projectId,
// //         conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
// //       });

// //       const assistant: Message = {
// //         role: 'assistant',
// //         content: resp.reply || resp.message || 'Generated!',
// //         timestamp: new Date(),
// //       };
// //       setMessages(p => [...p, assistant]);

// //       if (Array.isArray(resp.files) && resp.files.length) {
// //         const normalized = normalizeApiFiles(resp.files).map(f => {
// //         //   if ((f.language === 'css' || f.path.endsWith('.css')) &&
// //         //       !/--brand-dark|--brand-mid|--brand-light/i.test(f.content)) {
// //         //     f.content = `:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }\n` + f.content;
// //         //   }
// //         //   return f;
// //         // });
// // if (
// //   f.language === 'css' ||
// //   (f.path && f.path.endsWith('.css'))
// // ) {
// //   if (!/--brand-dark|--brand-mid|--brand-light/i.test(f.content)) {
// //     f.content = `:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }\n` + f.content;
// //   }
// // }
// // return f;
// //         });

// //         const projId = resp.projectId || `project_${Date.now()}`;
// //         const proj: Project = { name: resp.projectId || 'Generated Project', files: normalized };
// //         setCurrentProject(proj);
// //         setServerProjectId(projId);

// //         await persistChatHistory(proj, resp.projectId);
// //         setPreviewUrl(buildSandboxPreview(normalized));
// //         setShowPreview(true);
// //       } else {
// //         await persistChatHistory({ name: 'Conversation', files: [] }, resp.projectId);
// //       }
// //     } catch (e: any) {
// //       setMessages(p => [...p, { role: 'assistant', content: `❌ Error: ${e?.response?.data?.message || e.message}`, timestamp: new Date() }]);
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const downloadProject = async () => {
// //     if (!currentProject) return;
// //     const zip = new JSZip();
// //     currentProject.files.forEach(f => zip.file(f.path || f.name, f.content));
// //     const blob = await zip.generateAsync({ type: 'blob' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${currentProject.name.replace(/\s+/g,'-')}.zip`;
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };

// //   const validateProject = async () => {
// //     if (!currentProject) return;
// //     const result = await mejuvanteApi.validate(currentProject.files); // Can use OpenAI key here
// //     setMessages(p => [...p, { role:'assistant', content:`🧪 Validation: ${result.summary || 'See console for details.'}`, timestamp: new Date() }]);
// //     console.log('CodeAlchemy validation result:', result);
// //   };

// //   const goToDeploy = () => {
// //     if (!currentProject) return;
// //     const id = serverProjectId || `project_${Date.now()}`;
// //     const applicationType = inferApplicationType(currentProject.files);

// //     navigate(`/deploy/${id}`, {
// //       state: { projectId: id, projectName: currentProject.name, projectFiles: currentProject.files, applicationType },
// //     });
// //   };

// //   return (
// //     <div className="flex h-screen bg-gray-900 text-white">
// //       {/* Left: Chat + Files */}
// //       <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300`}>
// //         {/* Chat header */}
// //         <div className="ca-header border-b border-gray-700 px-6 py-4 flex items-center gap-3">
// //           <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><Code className="w-6 h-6 text-white" /></div>
// //           <div>
// //             <h1 className="text-xl font-bold">CodeAlchemy</h1>
// //             <p className="text-white/80 text-sm">where ideas turn into code ✨</p>
// //           </div>
// //           <div className="ml-auto ca-chip">live</div>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto p-6 space-y-4">
// //           {messages.map((m,i) => (
// //             <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
// //               <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${m.role==='user'?'text-white':'bg-gray-800 text-gray-200'}`}
// //                    style={m.role==='user'?{ background:`linear-gradient(90deg,${BRAND.dark},${BRAND.mid})` }:undefined}>
// //                 <p className="text-sm whitespace-pre-wrap">{m.content}</p>
// //                 {currentProject && m.role==='assistant' && (
// //                   <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2">
// //                     <button onClick={() => setShowPreview(v=>!v)} className="ca-ghost px-3 py-1 rounded text-xs flex items-center gap-1"><Play className="w-3 h-3"/>{showPreview?'Hide':'Show'} Preview</button>
// //                     <button onClick={downloadProject} className="ca-ghost px-3 py-1 rounded text-xs flex items-center gap-1"><Download className="w-3 h-3"/>Download ZIP</button>
// //                     <button onClick={validateProject} className="ca-ghost px-3 py-1 rounded text-xs flex items-center gap-1"><ShieldCheck className="w-3 h-3"/>Validate</button>
// //                     <button onClick={goToDeploy} className="ca-deploy px-3 py-1 rounded text-xs flex items-center gap-1"><Rocket className="w-3 h-3"/>Deploy</button>
// //                   </div>
// //                 )}
// //                 <p className="text-xs opacity-50 mt-2">{m.timestamp.toLocaleTimeString()}</p>
// //               </div>
// //             </div>
// //           ))}
// //           {isGenerating && (
// //             <div className="flex justify-start">
// //               <div className="bg-gray-800 px-4 py-3 rounded-2xl flex items-center gap-2">
// //                 <Loader2 className="w-4 h-4 animate-spin" style={{color:BRAND.light}}/>
// //                 <p className="text-sm">Generating your project...</p>
// //               </div>
// //             </div>
// //           )}
// //           <div ref={messagesEndRef}/>
// //         </div>

// //         {/* Input */}
// //         <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex gap-3">
// //           <input value={input} onChange={e=>setInput(e.target.value)}
// //                  onKeyDown={e=>e.key==='Enter' && sendMessage()}
// //                  placeholder="Describe the app you want to build..."
// //                  disabled={isGenerating}
// //                  className="flex-1 px-4 py-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 border border-gray-600 text-white disabled:opacity-50"/>
// //           <button onClick={sendMessage} disabled={!input.trim()||isGenerating} className="px-6 py-3 rounded-xl flex items-center gap-2 font-medium disabled:opacity-50 ca-primary">
// //             {isGenerating?<Loader2 className="w-5 h-5 animate-spin"/>:<Send className="w-5 h-5"/>} <span>Send</span>
// //           </button>
// //         </div>

// //         {/* File list */}
// //         {currentProject && (
// //           <div className="p-4 bg-gray-800 border-t border-gray-700 overflow-y-auto max-h-60">
// //             <h3 className="text-white font-bold mb-2">Generated Files</h3>
// //             {currentProject.files.map((f,i)=>(
// //               <div key={i} className="mb-1">
// //                 <p className="text-xs text-gray-300">{f.path || f.name}</p>
// //                 <pre className="text-xs bg-gray-900 p-2 rounded max-h-32 overflow-y-auto">{f.content}</pre>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Right: Preview */}
// //       {showPreview && currentProject && (
// //         <div className="w-1/2 border-l border-gray-700 bg-white flex flex-col">
// //           <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
// //             <div className="flex items-center gap-2"><Code className="w-5 h-5" style={{color:BRAND.light}}/><span className="text-white font-medium">Live Preview</span></div>
// //             <div className="flex items-center gap-2">
// //               <button onClick={goToDeploy} className="ca-deploy px-3 py-1 rounded text-xs flex items-center gap-1" title="Deploy"><Rocket className="w-3 h-3"/>Deploy</button>
// //               <button onClick={()=>setShowPreview(false)} className="p-2 hover:bg-gray-700 rounded-lg"><X className="w-5 h-5 text-gray-400"/></button>
// //             </div>
// //           </div>
// //           {previewUrl ? (
// //             <iframe src={previewUrl} className="flex-1 w-full border-0" title="preview" sandbox="allow-scripts allow-modals"/>
// //           ) : (
// //             <div className="flex-1 flex items-center justify-center text-gray-600">No preview yet.</div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatInterface;



// // import React, { useEffect, useRef, useState } from 'react';
// // import { Send, Loader2, Play, Download, X, Code, ShieldCheck, Rocket } from 'lucide-react';
// // import { mejuvanteApi, projectAPI } from '../../services/api';
// // import { useNavigate } from 'react-router-dom';
// // import JSZip from 'jszip';
// // import './ChatInterface.css';

// // interface ChatInterfaceProps {
// //   projectId?: string;
// // }

// // interface ProjectFile {
// //   name: string;
// //   path?: string;
// //   content: string;
// //   language?: string;
// // }

// // interface Project {
// //   name: string;
// //   files: ProjectFile[];
// // }

// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// //   timestamp: Date;
// //   project?: Project;
// // }

// // const BRAND = { dark: '#1e3c61', mid: '#2c99b7', light: '#61c4ca' };

// // // Normalize API files
// // const normalizeApiFiles = (apiFiles: any[]): ProjectFile[] =>
// //   (apiFiles || []).map((f, i) => {
// //     const path = f.path ?? f.name ?? `file_${i}.txt`;
// //     const name = f.name ?? path.split('/').pop() ?? `file_${i}.txt`;
// //     const content = f.content ?? f.code ?? '';
// //     const ext = path.split('.').pop()?.toLowerCase() || '';
// //     const langMap: Record<string, string> = {
// //       js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
// //       html: 'html', css: 'css', json: 'json', md: 'markdown',
// //       py: 'python', java: 'java', go: 'go',
// //     };
// //     const language = f.language ?? langMap[ext] ?? 'plaintext';
// //     if (language === 'css' && !/--brand-dark|--brand-mid|--brand-light/i.test(content)) {
// //       return { name, path, content: `:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }\n${content}`, language };
// //     }
// //     return { name, path, content, language };
// //   });

// // // Infer app type
// // const inferApplicationType = (files: ProjectFile[]): 'web' | 'server' => {
// //   if (files.find(f => (f.path || f.name).toLowerCase() === 'package.json' && /express|fastify|koa/i.test(f.content))) return 'server';
// //   if (files.some(f => /express\(|createServer\(/i.test(f.content))) return 'server';
// //   return 'web';
// // };

// // // Build sandbox preview (multi-page support)
// // const buildSandboxPreview = (files: ProjectFile[]): string => {
// //   const htmlFiles = files.filter(f => f.path?.endsWith('.html'));
// //   const cssFiles = files.filter(f => f.path?.endsWith('.css')).map(f => `<style>${f.content}</style>`).join('\n');
// //   const jsFiles = files.filter(f => f.path?.endsWith('.js')).map(f => `<script>${f.content}</script>`).join('\n');
// //   const defaultColors = `<style>:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }</style>`;

// //   let navLinks = '';
// //   if (htmlFiles.length > 1) {
// //     navLinks = '<nav style="position:fixed;top:0;left:0;width:100%;background:#f3f3f3;padding:5px;display:flex;gap:10px;">' +
// //       htmlFiles.map(f => `<a href="#${f.name}">${f.name}</a>`).join('') +
// //       '</nav>';
// //   }

// //   const htmlContent = htmlFiles.map(f => `<section id="${f.name}">${f.content}</section>`).join('\n');

// //   const previewHtml = `
// //     <html>
// //       <head>
// //         ${defaultColors}
// //         ${cssFiles}
// //       </head>
// //       <body>
// //         ${navLinks}
// //         ${htmlContent}
// //         ${jsFiles}
// //         <script>
// //           window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ message: 'Mock data' }) });
// //         </script>
// //       </body>
// //     </html>
// //   `;
// //   return 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
// // };

// // const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectId }) => {
// //   const navigate = useNavigate();
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   const [messages, setMessages] = useState<Message[]>([{
// //     role: 'assistant',
// //     content: "👋 Hi! I'm CodeAlchemy. Describe your app and I’ll generate a runnable project with live preview.",
// //     timestamp: new Date(),
// //   }]);
// //   const [input, setInput] = useState('');
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// //   const [serverProjectId, setServerProjectId] = useState<string | null>(projectId ?? null);
// //   const [showPreview, setShowPreview] = useState(false);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const persistChatHistory = async (proj: Project, incomingServerId?: string | null) => {
// //     const chatHistory = messages.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp.toISOString() }));
// //     try {
// //       let id = incomingServerId || serverProjectId;
// //       if (!id) {
// //         const created = await projectAPI.create({
// //           name: proj.name || 'Generated Project',
// //           description: 'Created via ChatInterface',
// //           type: inferApplicationType(proj.files),
// //           files: proj.files,
// //           chatHistory: JSON.stringify(chatHistory),
// //           status: 'draft',
// //         });
// //         id = created?.id || created?.project?.id || created?._id;
// //         setServerProjectId(id || null);
// //       } else {
// //         await projectAPI.update(id, { files: proj.files, chatHistory: JSON.stringify(chatHistory) });
// //       }
// //     } catch (e) {
// //       console.warn('Project persistence failed:', e);
// //     }
// //   };

// //   const sendMessage = async () => {
// //     if (!input.trim() || isGenerating) return;
// //     const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
// //     setMessages(prev => [...prev, userMsg]);
// //     setInput('');
// //     setIsGenerating(true);

// //     try {
// //       const resp = await mejuvanteApi.chat({
// //         message: userMsg.content,
// //         projectId: serverProjectId || projectId,
// //         conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
// //       });

// //       const assistant: Message = {
// //         role: 'assistant',
// //         content: resp.reply || resp.message || 'Generated!',
// //         timestamp: new Date(),
// //       };
// //       setMessages(p => [...p, assistant]);

// //       if (Array.isArray(resp.files) && resp.files.length) {
// //         const normalized = normalizeApiFiles(resp.files);
// //         const projId = resp.projectId || `project_${Date.now()}`;
// //         const proj: Project = { name: resp.projectId || 'Generated Project', files: normalized };
// //         setCurrentProject(proj);
// //         setServerProjectId(projId);
// //         setPreviewUrl(buildSandboxPreview(normalized));
// //         setShowPreview(true);
// //         setActiveFile(null);

// //         await persistChatHistory(proj, resp.projectId);
// //       } else {
// //         await persistChatHistory({ name: 'Conversation', files: [] }, resp.projectId);
// //       }
// //     } catch (e: any) {
// //       setMessages(p => [...p, { role: 'assistant', content: `❌ Error: ${e?.response?.data?.message || e.message}`, timestamp: new Date() }]);
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const downloadProject = async () => {
// //     if (!currentProject) return;
// //     const zip = new JSZip();
// //     currentProject.files.forEach(f => zip.file(f.path || f.name, f.content));
// //     const blob = await zip.generateAsync({ type: 'blob' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };

// //   const validateProject = async () => {
// //     if (!currentProject) return;
// //    const validationErrors = (result as any).errors;

// // setMessages(p => [
// //   ...p,
// //   {
// //     role: "assistant",
// //     content: `🛡 Validation result: ${
// //       validationErrors && validationErrors.length > 0
// //         ? validationErrors.join(", ")
// //         : "All good!"
// //     }`,
// //     timestamp: new Date(),
// //   },
// // ]);

// //     // setMessages(p => [...p, { role:'assistant', content: `🛡 Validation result: ${result.message || 'All good!'}`, timestamp: new Date() }]);
// //   };

// //   return (
// //     <div className="flex flex-col h-full w-full bg-gray-900 text-white">
// //       {/* Chat */}
// //       <div className="flex-1 p-4 overflow-y-auto">
// //         {messages.map((m, i) => (
// //           <div key={i} className={`my-2 ${m.role==='user' ? 'text-right' : 'text-left'}`}>
// //             <div className={`inline-block px-3 py-2 rounded ${m.role==='user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
// //               {m.content}
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="flex p-2 border-t border-gray-700">
// //         <input
// //           className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
// //           value={input} onChange={e => setInput(e.target.value)}
// //           placeholder="Describe your app..."
// //           onKeyDown={e => e.key==='Enter' && sendMessage()}
// //         />
// //         <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
// //           {isGenerating ? <Loader2 className="animate-spin"/> : <Send />}
// //         </button>
// //       </div>

// //       {/* Generated Project */}
// //       {currentProject && (
// //         <div className="border-t border-gray-700 p-4 overflow-y-auto max-h-96 bg-gray-800">
// //           <div className="flex justify-between mb-2">
// //             <h3 className="font-bold">Generated Files ({currentProject.files.length})</h3>
// //             <div className="flex gap-2">
// //               <button onClick={downloadProject} className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded hover:bg-green-500"><Download size={16}/>Download</button>
// //               <button onClick={validateProject} className="flex items-center gap-1 px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"><ShieldCheck size={16}/>Validate</button>
// //               {previewUrl && <button onClick={()=>setShowPreview(!showPreview)} className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"><Play size={16}/>Preview</button>}
// //             </div>
// //           </div>
// //           {/* File list */}
// //           <div className="overflow-y-auto max-h-64">
// //             {currentProject.files.map((f,i) => (
// //               <div key={i} className="mb-1 border-b border-gray-700">
// //                 <div
// //                   className="cursor-pointer flex justify-between hover:text-blue-400"
// //                   onClick={() => setActiveFile(activeFile === f ? null : f)}
// //                 >
// //                   <span>{f.path || f.name}</span>
// //                   <span>{activeFile === f ? '▼' : '▶'}</span>
// //                 </div>
// //                 {activeFile === f && (
// //                   <pre className="bg-gray-900 p-2 rounded max-h-40 overflow-y-auto text-xs">{f.content}</pre>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Live preview */}
// //           {showPreview && previewUrl && (
// //             <iframe src={previewUrl} title="Live Preview" className="w-full h-64 mt-2 border border-gray-700 rounded"></iframe>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatInterface;



// // import React, { useEffect, useRef, useState } from 'react';
// // import { Send, Loader2, Play, Download, ShieldCheck } from 'lucide-react';
// // import { mejuvanteApi, projectAPI } from '../../services/api';
// // import { useNavigate } from 'react-router-dom';
// // import JSZip from 'jszip';
// // import './ChatInterface.css';

// // interface ChatInterfaceProps {
// //   projectId?: string;
// // }

// // interface ProjectFile {
// //   name: string;
// //   path?: string;
// //   content: string;
// //   language?: string;
// // }

// // interface Project {
// //   name: string;
// //   files: ProjectFile[];
// // }

// // interface Message {
// //   role: 'user' | 'assistant';
// //   content: string;
// //   timestamp: Date;
// //   project?: Project;
// // }

// // interface ValidationResponse {
// //   success?: boolean;
// //   message?: string;
// //   errors?: string[];
// //   [key: string]: any;
// // }

// // const BRAND = { dark: '#1e3c61', mid: '#2c99b7', light: '#61c4ca' };

// // const normalizeApiFiles = (apiFiles: any[]): ProjectFile[] =>
// //   (apiFiles || []).map((f, i) => {
// //     const path = f.path ?? f.name ?? `file_${i}.txt`;
// //     const name = f.name ?? path.split('/').pop() ?? `file_${i}.txt`;
// //     const content = f.content ?? f.code ?? '';
// //     const ext = path.split('.').pop()?.toLowerCase() || '';
// //     const langMap: Record<string, string> = {
// //       js: 'javascript',
// //       jsx: 'jsx',
// //       ts: 'typescript',
// //       tsx: 'tsx',
// //       html: 'html',
// //       css: 'css',
// //       json: 'json',
// //       md: 'markdown',
// //       py: 'python',
// //       java: 'java',
// //       go: 'go',
// //     };
// //     const language = f.language ?? langMap[ext] ?? 'plaintext';
// //     if (language === 'css' && !/--brand-dark|--brand-mid|--brand-light/i.test(content)) {
// //       return {
// //         name,
// //         path,
// //         content: `:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }\n${content}`,
// //         language,
// //       };
// //     }
// //     return { name, path, content, language };
// //   });

// // const inferApplicationType = (files: ProjectFile[]): 'web' | 'server' => {
// //   if (files.find(f => (f.path || f.name).toLowerCase() === 'package.json' && /express|fastify|koa/i.test(f.content)))
// //     return 'server';
// //   if (files.some(f => /express\(|createServer\(/i.test(f.content))) return 'server';
// //   return 'web';
// // };

// // const buildSandboxPreview = (files: ProjectFile[]): string => {
// //   const htmlFiles = files.filter(f => f.path?.endsWith('.html'));
// //   const cssFiles = files.filter(f => f.path?.endsWith('.css')).map(f => `<style>${f.content}</style>`).join('\n');
// //   const jsFiles = files.filter(f => f.path?.endsWith('.js')).map(f => `<script>${f.content}</script>`).join('\n');
// //   const defaultColors = `<style>:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }</style>`;

// //   let navLinks = '';
// //   if (htmlFiles.length > 1) {
// //     navLinks =
// //       '<nav style="position:fixed;top:0;left:0;width:100%;background:#f3f3f3;padding:5px;display:flex;gap:10px;">' +
// //       htmlFiles.map(f => `<a href="#${f.name}">${f.name}</a>`).join('') +
// //       '</nav>';
// //   }

// //   const htmlContent = htmlFiles.map(f => `<section id="${f.name}">${f.content}</section>`).join('\n');

// //   const previewHtml = `
// //     <html>
// //       <head>
// //         ${defaultColors}
// //         ${cssFiles}
// //       </head>
// //       <body>
// //         ${navLinks}
// //         ${htmlContent}
// //         ${jsFiles}
// //         <script>
// //           window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ message: 'Mock data' }) });
// //         </script>
// //       </body>
// //     </html>
// //   `;
// //   return 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
// // };

// // const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectId }) => {
// //   const navigate = useNavigate();
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   const [messages, setMessages] = useState<Message[]>([
// //     {
// //       role: 'assistant',
// //       content:
// //         "👋 Hi! I'm CodeAlchemy. Describe your app and I’ll generate a runnable project with live preview.",
// //       timestamp: new Date(),
// //     },
// //   ]);
// //   const [input, setInput] = useState('');
// //   const [isGenerating, setIsGenerating] = useState(false);
// //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// //   const [serverProjectId, setServerProjectId] = useState<string | null>(projectId ?? null);
// //   const [showPreview, setShowPreview] = useState(false);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const persistChatHistory = async (proj: Project, incomingServerId?: string | null) => {
// //     const chatHistory = messages.map(m => ({
// //       role: m.role,
// //       content: m.content,
// //       timestamp: m.timestamp.toISOString(),
// //     }));
// //     try {
// //       let id = incomingServerId || serverProjectId;
// //       if (!id) {
// //         const created = await projectAPI.create({
// //           name: proj.name || 'Generated Project',
// //           description: 'Created via ChatInterface',
// //           type: inferApplicationType(proj.files),
// //           files: proj.files,
// //           chatHistory: JSON.stringify(chatHistory),
// //           status: 'draft',
// //         });
// //         id = created?.id || created?.project?.id || created?._id;
// //         setServerProjectId(id || null);
// //       } else {
// //         await projectAPI.update(id, { files: proj.files, chatHistory: JSON.stringify(chatHistory) });
// //       }
// //     } catch (e) {
// //       console.warn('Project persistence failed:', e);
// //     }
// //   };

// //   const sendMessage = async () => {
// //     if (!input.trim() || isGenerating) return;
// //     const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
// //     setMessages(prev => [...prev, userMsg]);
// //     setInput('');
// //     setIsGenerating(true);

// //     try {
// //       const resp = await mejuvanteApi.chat({
// //         message: userMsg.content,
// //         projectId: serverProjectId || projectId,
// //         conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
// //       });

// //       const assistant: Message = {
// //         role: 'assistant',
// //         content: resp.reply || resp.message || 'Generated!',
// //         timestamp: new Date(),
// //       };
// //       setMessages(p => [...p, assistant]);

// //       if (Array.isArray(resp.files) && resp.files.length) {
// //         const normalized = normalizeApiFiles(resp.files);
// //         const projId = resp.projectId || `project_${Date.now()}`;
// //         const proj: Project = { name: resp.projectId || 'Generated Project', files: normalized };
// //         setCurrentProject(proj);
// //         setServerProjectId(projId);
// //         setPreviewUrl(buildSandboxPreview(normalized));
// //         setShowPreview(true);
// //         setActiveFile(null);

// //         await persistChatHistory(proj, resp.projectId);
// //       } else {
// //         await persistChatHistory({ name: 'Conversation', files: [] }, resp.projectId);
// //       }
// //     } catch (e: any) {
// //       setMessages(p => [
// //         ...p,
// //         {
// //           role: 'assistant',
// //           content: `❌ Error: ${e?.response?.data?.message || e.message}`,
// //           timestamp: new Date(),
// //         },
// //       ]);
// //     } finally {
// //       setIsGenerating(false);
// //     }
// //   };

// //   const downloadProject = async () => {
// //     if (!currentProject) return;
// //     const zip = new JSZip();
// //     currentProject.files.forEach(f => zip.file(f.path || f.name, f.content));
// //     const blob = await zip.generateAsync({ type: 'blob' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };

// //   const validateProject = async () => {
// //     if (!currentProject) return;
// //     const result: ValidationResponse = await mejuvanteApi.validate(currentProject.files);

// //     const validationErrors = result.errors || [];
// //     setMessages(p => [
// //       ...p,
// //       {
// //         role: 'assistant',
// //         content: `🛡 Validation result: ${
// //           validationErrors.length > 0 ? validationErrors.join(', ') : 'All good!'
// //         }`,
// //         timestamp: new Date(),
// //       },
// //     ]);
// //   };

// //   return (
// //     <div className="flex flex-col h-full w-full bg-gray-900 text-white">
// //       {/* Chat */}
// //       <div className="flex-1 p-4 overflow-y-auto">
// //         {messages.map((m, i) => (
// //           <div key={i} className={`my-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
// //             <div
// //               className={`inline-block px-3 py-2 rounded ${
// //                 m.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
// //               }`}
// //             >
// //               {m.content}
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="flex p-2 border-t border-gray-700">
// //         <input
// //           className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
// //           value={input}
// //           onChange={e => setInput(e.target.value)}
// //           placeholder="Describe your app..."
// //           onKeyDown={e => e.key === 'Enter' && sendMessage()}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
// //         >
// //           {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
// //         </button>
// //       </div>

// //       {/* Generated Project */}
// //       {currentProject && (
// //         <div className="border-t border-gray-700 p-4 overflow-y-auto max-h-96 bg-gray-800">
// //           <div className="flex justify-between mb-2">
// //             <h3 className="font-bold">Generated Files ({currentProject.files.length})</h3>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={downloadProject}
// //                 className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded hover:bg-green-500"
// //               >
// //                 <Download size={16} />
// //                 Download
// //               </button>
// //               <button
// //                 onClick={validateProject}
// //                 className="flex items-center gap-1 px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
// //               >
// //                 <ShieldCheck size={16} />
// //                 Validate
// //               </button>
// //               {previewUrl && (
// //                 <button
// //                   onClick={() => setShowPreview(!showPreview)}
// //                   className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
// //                 >
// //                   <Play size={16} />
// //                   Preview
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* File list */}
// //           <div className="overflow-y-auto max-h-64">
// //             {currentProject.files.map((f, i) => (
// //               <div key={i} className="mb-1 border-b border-gray-700">
// //                 <div
// //                   className="cursor-pointer flex justify-between hover:text-blue-400"
// //                   onClick={() => setActiveFile(activeFile === f ? null : f)}
// //                 >
// //                   <span>{f.path || f.name}</span>
// //                   <span>{activeFile === f ? '▼' : '▶'}</span>
// //                 </div>
// //                 {activeFile === f && (
// //                   <pre className="bg-gray-900 p-2 rounded max-h-40 overflow-y-auto text-xs">
// //                     {f.content}
// //                   </pre>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Live preview */}
// //           {showPreview && previewUrl && (
// //             <iframe
// //               src={previewUrl}
// //               title="Live Preview"
// //               className="w-full h-64 mt-2 border border-gray-700 rounded"
// //             ></iframe>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatInterface;


// import React, { useEffect, useRef, useState } from 'react';
// import { Send, Loader2, Play, Download, ShieldCheck, Rocket } from 'lucide-react';
// import { mejuvanteApi, projectAPI } from '../../services/api';
// import { useNavigate } from 'react-router-dom';
// import JSZip from 'jszip';
// import './ChatInterface.css';

// interface ChatInterfaceProps {
//   projectId?: string;
// }

// interface ProjectFile {
//   name: string;
//   path?: string;
//   content: string;
//   language?: string;
// }

// interface Project {
//   name: string;
//   files: ProjectFile[];
// }

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   project?: Project;
// }

// interface ValidationResponse {
//   success?: boolean;
//   message?: string;
//   issues?: { file: string; line?: number; severity?: string; message: string }[];
//   [key: string]: any;
// }

// const BRAND = { dark: '#1e3c61', mid: '#2c99b7', light: '#61c4ca' };

// const normalizeApiFiles = (apiFiles: any[]): ProjectFile[] =>
//   (apiFiles || []).map((f, i) => {
//     const path = f.path ?? f.name ?? `file_${i}.txt`;
//     const name = f.name ?? path.split('/').pop() ?? `file_${i}.txt`;
//     const content = f.content ?? f.code ?? '';
//     const ext = path.split('.').pop()?.toLowerCase() || '';
//     const langMap: Record<string, string> = {
//       js: 'javascript',
//       jsx: 'jsx',
//       ts: 'typescript',
//       tsx: 'tsx',
//       html: 'html',
//       css: 'css',
//       json: 'json',
//       md: 'markdown',
//       py: 'python',
//       java: 'java',
//       go: 'go',
//     };
//     const language = f.language ?? langMap[ext] ?? 'plaintext';
//     if (language === 'css' && !/--brand-dark|--brand-mid|--brand-light/i.test(content)) {
//       return {
//         name,
//         path,
//         content: `:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }\n${content}`,
//         language,
//       };
//     }
//     return { name, path, content, language };
//   });

// const buildSandboxPreview = (files: ProjectFile[]): string => {
//   const htmlFiles = files.filter(f => f.path?.endsWith('.html'));
//   const cssFiles = files.filter(f => f.path?.endsWith('.css')).map(f => `<style>${f.content}</style>`).join('\n');
//   const jsFiles = files.filter(f => f.path?.endsWith('.js')).map(f => `<script>${f.content}</script>`).join('\n');
//   const defaultColors = `<style>:root { --brand-dark:${BRAND.dark}; --brand-mid:${BRAND.mid}; --brand-light:${BRAND.light}; }</style>`;

//   const htmlContent = htmlFiles.map(f => `<section id="${f.name}">${f.content}</section>`).join('\n');
//   return 'data:text/html;charset=utf-8,' + encodeURIComponent(`<html><head>${defaultColors}${cssFiles}</head><body>${htmlContent}${jsFiles}</body></html>`);
// };

// const ChatInterface: React.FC<ChatInterfaceProps> = ({ projectId }) => {
//   const navigate = useNavigate();
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentProject, setCurrentProject] = useState<Project | null>(null);
//   const [serverProjectId, setServerProjectId] = useState<string | null>(projectId ?? null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
//   const [deploying, setDeploying] = useState(false);
//   const [deployUrl, setDeployUrl] = useState<string | null>(null);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Load chat history if projectId exists
//   useEffect(() => {
//     const loadHistory = async () => {
//       if (!projectId) return;
//       try {
//         const projectData = await projectAPI.getById(projectId);
//         const chatHistory = JSON.parse(projectData.chatHistory || '[]');
//         const historyMessages = chatHistory.map((m: any) => ({
//           role: m.role,
//           content: m.content,
//           timestamp: new Date(m.timestamp),
//         }));
//         setMessages(historyMessages);
//         setCurrentProject({ name: projectData.name, files: projectData.files || [] });
//       } catch (e) {
//         console.warn('Failed to load chat history:', e);
//       }
//     };
//     loadHistory();
//   }, [projectId]);

//   const persistChatHistory = async (proj: Project, incomingServerId?: string | null) => {
//     const chatHistory = messages.map(m => ({
//       role: m.role,
//       content: m.content,
//       timestamp: m.timestamp.toISOString(),
//     }));
//     try {
//       let id = incomingServerId || serverProjectId;
//       if (!id) {
//         const created = await projectAPI.create({
//           name: proj.name || 'Generated Project',
//           description: 'Created via ChatInterface',
//           type: 'web',
//           files: proj.files,
//           chatHistory: JSON.stringify(chatHistory),
//           status: 'draft',
//         });
//         id = created?.id || created?.project?.id || created?._id;
//         setServerProjectId(id || null);
//       } else {
//         await projectAPI.update(id, { files: proj.files, chatHistory: JSON.stringify(chatHistory) });
//       }
//     } catch (e) {
//       console.warn('Project persistence failed:', e);
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim() || isGenerating) return;
//     const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setIsGenerating(true);

//     try {
//       const resp = await mejuvanteApi.chat({
//         message: userMsg.content,
//         projectId: serverProjectId || projectId,
//         conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
//       });

//       const assistant: Message = {
//         role: 'assistant',
//         content: resp.reply || resp.message || 'Generated!',
//         timestamp: new Date(),
//       };
//       setMessages(p => [...p, assistant]);

//       if (Array.isArray(resp.files) && resp.files.length) {
//         const normalized = normalizeApiFiles(resp.files);
//         const projId = resp.projectId || `project_${Date.now()}`;
//         const proj: Project = { name: resp.projectId || 'Generated Project', files: normalized };
//         setCurrentProject(proj);
//         setServerProjectId(projId);
//         setPreviewUrl(buildSandboxPreview(normalized));
//         setShowPreview(true);
//         setActiveFile(null);

//         await persistChatHistory(proj, resp.projectId);
//       } else {
//         await persistChatHistory({ name: 'Conversation', files: [] }, resp.projectId);
//       }
//     } catch (e: any) {
//       setMessages(p => [
//         ...p,
//         {
//           role: 'assistant',
//           content: `❌ Error: ${e?.response?.data?.message || e.message}`,
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadProject = async () => {
//     if (!currentProject) return;
//     const zip = new JSZip();
//     currentProject.files.forEach(f => zip.file(f.path || f.name, f.content));
//     const blob = await zip.generateAsync({ type: 'blob' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${currentProject.name.replace(/\s+/g, '-')}.zip`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const validateProject = async () => {
//     if (!currentProject) return;
//     setIsGenerating(true);
//     try {
//       const result: ValidationResponse = await mejuvanteApi.validate(currentProject.files);
//       const validationErrors = result.issues?.map(i => `${i.file}: ${i.message}`) || [];
//       setMessages(p => [
//         ...p,
//         {
//           role: 'assistant',
//           content: `🛡 Validation result: ${
//             validationErrors.length > 0 ? validationErrors.join(', ') : 'All good! ✅'
//           }`,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (e: any) {
//       setMessages(p => [
//         ...p,
//         { role: 'assistant', content: `❌ Validation Error: ${e?.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const deployProject = async () => {
//     if (!currentProject || !serverProjectId) return;
//     setDeploying(true);
//     try {
//       const response = await mejuvanteApi.deployToBackend({ projectId: serverProjectId, files: currentProject.files });
//       setDeployUrl(response.url || '');
//       setMessages(p => [
//         ...p,
//         {
//           role: 'assistant',
//           content: response.url
//             ? `🚀 Project deployed: ${response.url}`
//             : `⚠️ Deployment started successfully`,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (e: any) {
//       setMessages(p => [
//         ...p,
//         { role: 'assistant', content: `❌ Deploy failed: ${e?.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setDeploying(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-gray-900 text-white">
//       {/* Chat */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages.map((m, i) => (
//           <div key={i} className={`my-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
//             <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
//               {m.content}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex p-2 border-t border-gray-700">
//         <input
//           className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Describe your app..."
//           onKeyDown={e => e.key === 'Enter' && sendMessage()}
//         />
//         <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
//           {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//         </button>
//       </div>

//       {/* Project Section */}
//       {currentProject && (
//         <div className="border-t border-gray-700 p-4 overflow-y-auto max-h-96 bg-gray-800">
//           <div className="flex justify-between mb-2">
//             <h3 className="font-bold">Generated Files ({currentProject.files.length})</h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={downloadProject}
//                 className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded hover:bg-green-500"
//               >
//                 <Download size={16} /> Download
//               </button>
//               <button
//                 onClick={validateProject}
//                 className="flex items-center gap-1 px-2 py-1 bg-gray-600 rounded hover:bg-gray-500"
//               >
//                 <ShieldCheck size={16} /> Validate
//               </button>
//               {previewUrl && (
//                 <button
//                   onClick={() => setShowPreview(!showPreview)}
//                   className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
//                 >
//                   <Play size={16} /> Preview
//                 </button>
//               )}
//               <button
//                 onClick={deployProject}
//                 className="flex items-center gap-1 px-2 py-1 bg-purple-600 rounded hover:bg-purple-500"
//               >
//                 <Rocket size={16} /> Deploy
//               </button>
//             </div>
//           </div>

//           {/* Files List */}
//           <div className="flex flex-col gap-1">
//             {currentProject.files.map((f, idx) => (
//               <button
//                 key={idx}
//                 className={`text-left px-2 py-1 rounded w-full ${
//                   activeFile === f ? 'bg-gray-600 font-bold' : 'hover:bg-gray-700'
//                 }`}
//                 onClick={() => setActiveFile(f)}
//               >
//                 {f.name}
//               </button>
//             ))}
//           </div>

//           {/* File Preview */}
//           {activeFile && (
//             <pre className="bg-gray-900 p-2 mt-2 overflow-auto max-h-64 rounded text-sm">
//               {activeFile.content}
//             </pre>
//           )}
//         </div>
//       )}

//       {/* Live Preview iframe */}
//       {showPreview && previewUrl && (
//         <iframe
//           src={previewUrl}
//           className="w-full h-64 border-t border-gray-700 mt-2 rounded"
//           title="Live Preview"
//         />
//       )}
//     </div>
//   );
// };

// export default ChatInterface;



// // frontend/src/components/ChatInterface/ChatInterface.tsx

// // import React, { useState, useEffect, useRef } from "react";
// // import { Send, Loader2, Eye, EyeOff, Code2, Rocket, Download, ShieldCheck } from "lucide-react";
// // import JSZip from "jszip";
// // import { mejuvanteApi, projectAPI } from "../../services/api";
// // import { useNavigate } from "react-router-dom";
// // import "./ChatInterface.css";

// // interface Message {
// //   role: "user" | "assistant";
// //   content: string;
// //   timestamp: Date;
// // }

// // interface ProjectFile {
// //   name: string;
// //   path?: string;
// //   content: string;
// //   language?: string;
// // }

// // interface Project {
// //   name: string;
// //   files: ProjectFile[];
// // }

// // const ChatInterface: React.FC = () => {
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [input, setInput] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isValidating, setIsValidating] = useState(false);
// //   const [deploying, setDeploying] = useState(false);
// //   const [showPreview, setShowPreview] = useState(true);
// //   const [showCode, setShowCode] = useState(true);
// //   const [currentProject, setCurrentProject] = useState<Project | null>(null);
// //   const [deployUrl, setDeployUrl] = useState<string | null>(null);

// //   const navigate = useNavigate();
// //   const chatEndRef = useRef<HTMLDivElement | null>(null);

// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // Auto-save chat to DB (not localStorage)
// //   const persistHistory = async (proj?: Project) => {
// //     try {
// //       await mejuvanteApi.saveChat({
// //         messages,
// //         project: proj || currentProject,
// //       });
// //     } catch (e) {
// //       console.error("Auto-save failed", e);
// //     }
// //   };

// //   const handleSend = async () => {
// //     if (!input.trim()) return;

// //     const userMsg: Message = { role: "user", content: input, timestamp: new Date() };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");
// //     setIsLoading(true);

// //     try {
// //       const res = await mejuvanteApi.chat({
// //         message: userMsg.content,
// //         projectId: currentProject?.name ?? undefined,
// //       });

// //       const reply = res.reply || "✅ Done!";
// //       const assistantMsg: Message = { role: "assistant", content: reply, timestamp: new Date() };
// //       setMessages((prev) => [...prev, assistantMsg]);

// //       if (res.files?.length) {
// //         const safeFiles: ProjectFile[] = res.files.map((f: any) => ({
// //           name: f.name || "untitled.txt",
// //           path: f.path,
// //           content: f.content || "",
// //           language: f.language,
// //         }));
// //         const proj: Project = { name: res.projectId || "Generated Project", files: safeFiles };
// //         setCurrentProject(proj);
// //         await persistHistory(proj);
// //       } else {
// //         await persistHistory();
// //       }
// //     } catch (e: any) {
// //       console.error(e);
// //       setMessages((prev) => [
// //         ...prev,
// //         { role: "assistant", content: `❌ Error: ${e?.message}`, timestamp: new Date() },
// //       ]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const validateProject = async () => {
// //     if (!currentProject) return;
// //     setIsValidating(true);
// //     try {
// //       const res = await mejuvanteApi.validate(currentProject.files);
// //       const errors = (res as any)?.errors || [];

// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           role: "assistant",
// //           content: errors.length > 0
// //             ? `⚠️ Validation issues: ${errors.join(", ")}`
// //             : "✅ All files validated successfully!",
// //           timestamp: new Date(),
// //         },
// //       ]);
// //     } catch (e: any) {
// //       setMessages((prev) => [
// //         ...prev,
// //         { role: "assistant", content: `❌ Validation failed: ${e?.message}`, timestamp: new Date() },
// //       ]);
// //     } finally {
// //       setIsValidating(false);
// //     }
// //   };

// //   const deployProject = async () => {
// //     if (!currentProject) return;
// //     setDeploying(true);
// //     try {
// //       const res = await mejuvanteApi.deployToBackend({
// //         projectId: currentProject.name,
// //         files: currentProject.files,
// //       });
// //       setDeployUrl(res.url ?? null);
// //       setMessages((prev) => [
// //         ...prev,
// //         { role: "assistant", content: `🚀 Project deployed successfully: ${res.url}`, timestamp: new Date() },
// //       ]);
// //     } catch (e: any) {
// //       setMessages((prev) => [
// //         ...prev,
// //         { role: "assistant", content: `❌ Deploy failed: ${e?.message}`, timestamp: new Date() },
// //       ]);
// //     } finally {
// //       setDeploying(false);
// //     }
// //   };

// //   const downloadProject = async () => {
// //     if (!currentProject) return;
// //     const zip = new JSZip();
// //     currentProject.files.forEach((file) => {
// //       zip.file(file.path || file.name, file.content);
// //     });
// //     const blob = await zip.generateAsync({ type: "blob" });
// //     const link = document.createElement("a");
// //     link.href = URL.createObjectURL(blob);
// //     link.download = `${currentProject.name}.zip`;
// //     link.click();
// //   };

// //   return (
// //     <div className="chat-container">
// //       {/* === Left: Chat Section === */}
// //       <div className="chat-section">
// //         <div className="chat-header">
// //           <h2>💬 Mejuvante AI Builder</h2>
// //           <div className="chat-actions">
// //             <button onClick={validateProject} disabled={isValidating}>
// //               <ShieldCheck size={18} /> {isValidating ? "Validating..." : "Validate"}
// //             </button>
// //             <button onClick={deployProject} disabled={deploying}>
// //               <Rocket size={18} /> {deploying ? "Deploying..." : "Deploy"}
// //             </button>
// //             <button onClick={downloadProject}>
// //               <Download size={18} /> Download
// //             </button>
// //           </div>
// //         </div>

// //         <div className="chat-body">
// //           {messages.map((msg, i) => (
// //             <div key={i} className={`msg ${msg.role}`}>
// //               <p>{msg.content}</p>
// //               <span>{msg.timestamp.toLocaleTimeString()}</span>
// //             </div>
// //           ))}
// //           <div ref={chatEndRef} />
// //         </div>

// //         <div className="chat-input">
// //           <input
// //             type="text"
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             placeholder="Type your request..."
// //           />
// //           <button onClick={handleSend} disabled={isLoading}>
// //             {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
// //           </button>
// //         </div>
// //       </div>

// //       {/* === Middle: Live Preview Section === */}
// //       {showPreview && (
// //         <div className="preview-section">
// //           <div className="preview-header">
// //             <h3>Live Preview</h3>
// //             <button onClick={() => setShowPreview(false)}>
// //               <EyeOff size={18} /> Hide
// //             </button>
// //           </div>
// //           <iframe
// //             title="Preview"
// //             srcDoc={
// //               currentProject?.files.find((f) => f.name.includes("index.html"))?.content || ""
// //             }
// //           />
// //         </div>
// //       )}

// //       {/* === Right: Code Section === */}
// //       {showCode && (
// //         <div className="code-section">
// //           <div className="code-header">
// //             <h3>Generated Code</h3>
// //             <button onClick={() => setShowCode(false)}>
// //               <Code2 size={18} /> Hide
// //             </button>
// //           </div>
// //           <pre className="code-view">
// //             {currentProject?.files.map((f, i) => (
// //               <div key={i}>
// //                 <h4>{f.name}</h4>
// //                 <code>{f.content}</code>
// //               </div>
// //             ))}
// //           </pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatInterface;



// // frontend/src/components/ChatInterface/ChatInterface.tsx

// import React, { useState, useRef, useEffect } from "react";
// import { Send, Loader2, Play, Download, ShieldCheck, Rocket, FileCode } from "lucide-react";
// import JSZip from "jszip";
// import { mejuvanteApi, projectAPI } from "../../services/api";
// import "./ChatInterface.css";
// import { useAuth } from '../../contexts/AuthContext'; // + add
// const ChatInterface: React.FC = () => {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [project, setProject] = useState<any | null>(null);
//   const [activeFile, setActiveFile] = useState<any | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [showCode, setShowCode] = useState(true);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const { user } = useAuth(); // + add

// // in persistChatHistory(...)
// const created = await projectAPI.create({
//   name: project.name || 'Generated Project',
//   description: 'Created via ChatInterface',
//   type: 'chat',               // mark as chat
//   files: project.files,
//   chatHistory: JSON.stringify(chatHistory),
//   status: 'active',
//   user_id: user?.id,          // associate to logged-in user
// });

// await projectAPI.update(id, {
//   files: project.files,
//   chatHistory: JSON.stringify(chatHistory),
//   user_id: user?.id,
// });
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg = { role: "user", content: input, timestamp: new Date() };
//     setMessages((m) => [...m, userMsg]);
//     setInput("");
//     setIsGenerating(true);

//     try {
//       const res = await mejuvanteApi.chat({ message: input });
//       const reply = res.reply || "✅ Done!";
//       const assistantMsg = { role: "assistant", content: reply, timestamp: new Date() };
//       setMessages((m) => [...m, assistantMsg]);

//       if (res.files?.length) {
//         setProject({ name: res.projectId || "Generated Project", files: res.files });
//         const htmlFile = res.files.find((f: any) => f.name.includes("index.html"));
//         if (htmlFile) {
//           const blob = new Blob([htmlFile.content], { type: "text/html" });
//           setPreviewUrl(URL.createObjectURL(blob));
//         }
//       }
//     } catch (e: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Error: ${e.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadProject = async () => {
//     if (!project) return;
//     const zip = new JSZip();
//     project.files.forEach((f: any) => zip.file(f.path || f.name, f.content));
//     const blob = await zip.generateAsync({ type: "blob" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${project.name}.zip`;
//     a.click();
//   };

//   const validateProject = async () => {
//     if (!project) return;
//     const res = await mejuvanteApi.validate(project.files);
//     setMessages((m) => [
//       ...m,
//       {
//         role: "assistant",
//         content: res.success
//           ? "🛡 All files validated successfully!"
//           : `⚠️ Validation issues: ${res.issues?.map((i: any) => i.message).join(", ")}`,
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   const deployProject = async () => {
//     if (!project) return;
//     const res = await mejuvanteApi.deployToBackend({
//       projectId: project.name,
//       files: project.files,
//     });
//     setMessages((m) => [
//       ...m,
//       {
//         role: "assistant",
//         content: res.url
//           ? `🚀 Project deployed at: ${res.url}`
//           : "⚙️ Deployment started...",
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   return (
//     <div className="h-screen w-full flex text-white bg-gray-900">
//       {/* Left Panel: Chat */}
//       <div className="w-1/3 flex flex-col border-r border-gray-700">
//         <div className="flex-1 p-3 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
//               <div
//                 className={`inline-block px-3 py-2 rounded ${
//                   m.role === "user" ? "bg-blue-600" : "bg-gray-700"
//                 }`}
//               >
//                 {m.content}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="p-2 flex border-t border-gray-700">
//           <input
//             className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Describe your app..."
//           />
//           <button
//             onClick={sendMessage}
//             className="ml-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
//           >
//             {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//           </button>
//         </div>
//       </div>

//       {/* Middle Panel: Live Preview */}
//       <div className="w-1/3 border-r border-gray-700 flex flex-col">
//         <div className="p-2 flex justify-between bg-gray-800 border-b border-gray-700">
//           <h3 className="font-semibold">Live Preview</h3>
//           <button
//             onClick={deployProject}
//             className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded hover:bg-purple-500"
//           >
//             <Rocket size={16} /> Deploy
//           </button>
//         </div>
//         {previewUrl ? (
//           <iframe src={previewUrl} className="flex-1 w-full" title="Live Preview" />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             No preview yet
//           </div>
//         )}
//       </div>

//       {/* Right Panel: Files & Code */}
//       <div className="w-1/3 flex flex-col">
//         <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between">
//           <h3 className="font-semibold">Files</h3>
//           <div className="flex gap-2">
//             <button
//               onClick={downloadProject}
//               className="bg-green-600 px-2 py-1 rounded hover:bg-green-500 flex items-center gap-1"
//             >
//               <Download size={16} /> Download
//             </button>
//             <button
//               onClick={validateProject}
//               className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-500 flex items-center gap-1"
//             >
//               <ShieldCheck size={16} /> Validate
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 flex">
//           <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
//             {project?.files?.map((f: any, i: number) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveFile(f)}
//                 className={`block w-full text-left px-2 py-1 truncate ${
//                   activeFile === f ? "bg-gray-700 font-bold" : "hover:bg-gray-800"
//                 }`}
//               >
//                 <FileCode size={14} className="inline mr-1" /> {f.name}
//               </button>
//             ))}
//           </div>
//           <div className="w-2/3 p-2 overflow-auto bg-gray-900">
//             {activeFile ? (
//               <pre className="text-xs whitespace-pre-wrap">{activeFile.content}</pre>
//             ) : (
//               <div className="text-gray-500 text-center mt-10">Select a file to view code</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;



// // frontend/src/components/ChatInterface/ChatInterface.tsx
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Send,
//   Loader2,
//   Play,
//   Download,
//   ShieldCheck,
//   Rocket,
//   FileCode,
//   Zap,
// } from "lucide-react";
// import JSZip from "jszip";
// import { mejuvanteApi, projectAPI } from "../../services/api";
// import "./ChatInterface.css";
// import { useAuth } from "../../contexts/AuthContext";

// type Message = { role: "user" | "assistant"; content: string; timestamp: Date };
// type ProjectFile = { name: string; path?: string; content: string; language?: string };

// const THEME = {
//   dark: "#1e3c61",
//   mid: "#2c99b7",
//   light: "#61c4ca",
// };

// const ChatInterface: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const [project, setProject] = useState<{ name: string; files: ProjectFile[] } | null>(null);
//   const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   // UI stages: "chat" (only chat), "generated" (expanded UI)
//   const [stage, setStage] = useState<"chat" | "generated">("chat");

//   // Validation state
//   const [validating, setValidating] = useState(false);
//   const [validationResult, setValidationResult] = useState<any | null>(null);

//   // Deploy state
//   const [deploying, setDeploying] = useState(false);
//   const [deployResult, setDeployResult] = useState<any | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // helper to persist project (create/update)
//   const persistProject = async (proj: { name: string; files: ProjectFile[] }, chatHistory: Message[]) => {
//     try {
//       // create minimal payload
//       const payload: any = {
//         name: proj.name || "Generated Project",
//         description: "Generated via ChatInterface",
//         type: "chat",
//         files: proj.files,
//         chatHistory: JSON.stringify(chatHistory),
//         status: "active",
//         user_id: user?.id,
//       };

//       // create in backend
//       const created = await projectAPI.create(payload);
//       // if backend returns an id, attach it to project
//       if (created?.id) {
//         // update local project name to id so future operations use it
//         setProject((p) => (p ? { ...p, name: created.id } : p));
//       }
//     } catch (err) {
//       console.warn("Failed to persist project:", err);
//     }
//   };

//   const handleAssistantReply = async (res: any, userMsg: Message) => {
//     const reply = res.reply || "✅ Done!";
//     const assistantMsg: Message = { role: "assistant", content: reply, timestamp: new Date() };
//     setMessages((m) => [...m, assistantMsg]);

//     // if AI returned files, show expanded UI
//     if (Array.isArray(res.files) && res.files.length > 0) {
//       const files: ProjectFile[] = res.files.map((f: any) => ({
//         name: f.name || f.path || "file",
//         path: f.path || f.name,
//         content: f.content || f.code || "",
//         language: f.language || undefined,
//       }));

//       const proj = { name: res.projectId || `project_${Date.now()}`, files };
//       setProject(proj);
//       setActiveFile(files[0] || null);
//       setStage("generated");

//       // create a preview blob if index.html present
//       const htmlFile = files.find((f) => (f.name || "").toLowerCase().includes("index.html"));
//       if (htmlFile) {
//         const blob = new Blob([htmlFile.content], { type: "text/html" });
//         setPreviewUrl(URL.createObjectURL(blob));
//       } else {
//         setPreviewUrl(null);
//       }

//       // persist to backend (associate to user)
//       const chatHistory = [...messages, userMsg, assistantMsg];
//       persistProject(proj, chatHistory);
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
//     setMessages((m) => [...m, userMsg]);
//     setInput("");
//     setIsGenerating(true);

//     try {
//       // send to backend chat endpoint; backend must call OpenAI using .env key
//       const res = await mejuvanteApi.chat({ message: userMsg.content });
//       await handleAssistantReply(res, userMsg);
//     } catch (e: any) {
//       const errMsg: Message = {
//         role: "assistant",
//         content: `❌ Error: ${e?.message || "Request failed"}`,
//         timestamp: new Date(),
//       };
//       setMessages((m) => [...m, errMsg]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadProject = async () => {
//     if (!project) return;
//     const zip = new JSZip();
//     project.files.forEach((f) => zip.file(f.path || f.name, f.content));
//     const blob = await zip.generateAsync({ type: "blob" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${(project.name || "project").replace(/\s+/g, "_")}.zip`;
//     a.click();
//   };

//   const validateProject = async () => {
//     if (!project) return;
//     setValidating(true);
//     setValidationResult(null);
//     try {
//       // backend runs OpenAI validation and returns structured result
//       const res = await mejuvanteApi.validate(project.files);
//       setValidationResult(res);
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           content: res.success
//             ? "🛡 All files validated successfully!"
//             : `⚠️ Validation issues: ${Array.isArray(res.issues) ? res.issues.map((i: any) => i.message).join("; ") : "Check details"}`,
//           timestamp: new Date(),
//         } as Message,
//       ]);
//     } catch (err: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Validation failed: ${err?.message || err}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setValidating(false);
//     }
//   };

//   const deployProject = async () => {
//     if (!project) return;
//     setDeploying(true);
//     setDeployResult(null);
//     try {
//       // backend will use AWS credentials from .env (server-side)
//       const res = await mejuvanteApi.deployToBackend({
//         projectId: project.name,
//         files: project.files,
//         config: { provider: "s3-static", region: process.env.REACT_APP_AWS_REGION }, // optional
//       });
//       setDeployResult(res);
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           content: res?.url ? `🚀 Deployed at: ${res.url}` : "⚙️ Deployment started (check server logs).",
//           timestamp: new Date(),
//         } as Message,
//       ]);
//     } catch (err: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Deploy failed: ${err?.message || err}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setDeploying(false);
//     }
//   };

//   // small helper to render pretty preview container
//   const PreviewShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
//     <div
//       style={{
//         borderLeft: `1px solid rgba(255,255,255,0.04)`,
//         borderRight: `1px solid rgba(255,255,255,0.04)`,
//         display: "flex",
//         flexDirection: "column",
//       }}
//       className="flex-1"
//     >
//       <div
//         style={{
//           background: `linear-gradient(90deg, ${THEME.dark}, ${THEME.mid})`,
//           color: "#fff",
//           padding: "10px 12px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <div style={{ width: 10, height: 10, borderRadius: 3, background: THEME.light }} />
//           <strong>Live Preview</strong>
//         </div>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button
//             onClick={() => {
//               // refresh iframe blob URL by re-creating from index.html if present
//               if (!project) return;
//               const htmlFile = project.files.find((f) => (f.name || "").toLowerCase().includes("index.html"));
//               if (htmlFile) {
//                 const blob = new Blob([htmlFile.content], { type: "text/html" });
//                 setPreviewUrl(URL.createObjectURL(blob));
//               }
//             }}
//             className="px-2 py-1 rounded"
//             style={{ background: THEME.light, color: "#063241", fontWeight: 600 }}
//           >
//             <Play size={14} /> Refresh
//           </button>
//           <button
//             onClick={() => previewUrl && window.open(previewUrl, "_blank")}
//             className="px-2 py-1 rounded"
//             style={{ background: THEME.mid, color: "#fff", fontWeight: 600 }}
//           >
//             Open
//           </button>
//         </div>
//       </div>
//       <div style={{ padding: 10, flex: 1, minHeight: 0 }}>{children}</div>
//     </div>
//   );

//   return (
//     <div className="h-screen w-full flex" style={{ background: "#061325", color: "white" }}>
//       {/* If still in chat-only mode, show a simple centered chat panel */}
//       {stage === "chat" ? (
//         <div className="w-full flex flex-col items-stretch max-w-3xl mx-auto my-6 border rounded" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
//           <div style={{ background: THEME.dark, padding: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>
//             <h2 className="text-white text-lg">Mejuvante • Chat</h2>
//             <p className="text-sm" style={{ color: THEME.light }}>
//               Ask the assistant to create or modify a project. Example: "Create a React + Express to-do app".
//             </p>
//           </div>

//           <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight: 300 }}>
//             {messages.length === 0 ? (
//               <div className="text-gray-400">Start by typing your idea in the box below...</div>
//             ) : (
//               messages.map((m, i) => (
//                 <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
//                   <div
//                     className={`inline-block px-3 py-2 rounded`}
//                     style={{
//                       background: m.role === "user" ? THEME.mid : "#0b2130",
//                       color: "#fff",
//                     }}
//                   >
//                     {m.content}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
//             <input
//               className="flex-1 p-2 rounded bg-transparent border"
//               style={{ borderColor: "rgba(255,255,255,0.06)" }}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Describe your app... (e.g. 'generate a React blog with auth')"
//             />
//             <button
//               onClick={sendMessage}
//               className="px-4 py-2 rounded"
//               style={{ background: THEME.mid, color: "#063241", fontWeight: 700 }}
//             >
//               {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//             </button>
//           </div>
//         </div>
//       ) : (
//         // Expanded layout with 3 columns: Chat | Live Preview | Files & Actions
//         <>
//           {/* Chat Column */}
//           <div className="w-1/3 flex flex-col border-r" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
//             <div style={{ background: THEME.dark, padding: 12 }}>
//               <h3 className="font-semibold">Chat</h3>
//               <p className="text-sm" style={{ color: THEME.light }}>
//                 Continue chatting with the assistant. It can modify the generated project.
//               </p>
//             </div>

//             <div className="flex-1 p-3 overflow-y-auto">
//               {messages.map((m, i) => (
//                 <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
//                   <div
//                     className={`inline-block px-3 py-2 rounded`}
//                     style={{
//                       background: m.role === "user" ? THEME.mid : "#0b2130",
//                       color: "#fff",
//                     }}
//                   >
//                     {m.content}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="p-2 flex border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
//               <input
//                 className="flex-1 p-2 rounded bg-transparent border"
//                 style={{ borderColor: "rgba(255,255,255,0.06)" }}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                 placeholder="Ask to change or improve the project..."
//               />
//               <button
//                 onClick={sendMessage}
//                 className="ml-2 px-4 py-2 rounded"
//                 style={{ background: THEME.mid, color: "#063241", fontWeight: 700 }}
//               >
//                 {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//               </button>
//             </div>
//           </div>

//           {/* Live Preview Column */}
//           <div className="w-1/3 flex flex-col">
//             <PreviewShell>
//               {previewUrl ? (
//                 <iframe
//                   src={previewUrl}
//                   title="Live Preview"
//                   style={{ width: "100%", height: "100%", border: "none", borderRadius: 6 }}
//                 />
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-300">
//                   <Zap size={32} />
//                   <p className="mt-2">No index.html found — preview unavailable.</p>
//                   <p className="text-sm text-gray-400 mt-2">You can still view files on the right.</p>
//                 </div>
//               )}
//             </PreviewShell>

//             <div style={{ padding: 10, display: "flex", gap: 8, justifyContent: "flex-end" }}>
//               <button
//                 onClick={downloadProject}
//                 className="px-3 py-1 rounded flex items-center gap-2"
//                 style={{ background: THEME.light, color: "#063241", fontWeight: 700 }}
//               >
//                 <Download size={14} /> Download ZIP
//               </button>

//               <button
//                 onClick={validateProject}
//                 disabled={validating}
//                 className="px-3 py-1 rounded flex items-center gap-2"
//                 style={{
//                   background: validating ? "#234e5a" : "#0f1720",
//                   color: THEME.light,
//                   border: `1px solid ${THEME.mid}`,
//                 }}
//               >
//                 {validating ? <Loader2 className="animate-spin" /> : <ShieldCheck size={14} />} Validate
//               </button>

//               <button
//                 onClick={deployProject}
//                 disabled={deploying}
//                 className="px-3 py-1 rounded flex items-center gap-2"
//                 style={{ background: THEME.mid, color: "#063241", fontWeight: 700 }}
//               >
//                 {deploying ? <Loader2 className="animate-spin" /> : <Rocket size={14} />} Deploy
//               </button>
//             </div>

//             {/* Validation / Deploy details */}
//             <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.03)", minHeight: 80 }}>
//               {validating && <div>Validating code with AI &mdash; please wait...</div>}
//               {validationResult && (
//                 <div>
//                   <strong>Validation:</strong>
//                   <div className="text-sm mt-1">
//                     {validationResult.success ? (
//                       <span style={{ color: "#9fe6b8" }}>No major issues found.</span>
//                     ) : (
//                       <div>
//                         <div style={{ color: "#ffd27a" }}>Issues:</div>
//                         <ul className="ml-4">
//                           {Array.isArray(validationResult.issues) &&
//                             validationResult.issues.map((it: any, i: number) => (
//                               <li key={i} className="text-xs">
//                                 {it.file ? `${it.file}: ` : ""}{it.message}
//                               </li>
//                             ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {deployResult && (
//                 <div className="mt-2">
//                   <strong>Deployment:</strong>
//                   <div className="text-sm mt-1">{deployResult.url ? <a style={{ color: THEME.light }} href={deployResult.url} target="_blank" rel="noreferrer">{deployResult.url}</a> : JSON.stringify(deployResult)}</div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Files & Code Column */}
//           <div className="w-1/3 flex flex-col border-l" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
//             <div style={{ background: THEME.dark, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <h3 className="font-semibold">Generated Files</h3>
//                 <p className="text-sm" style={{ color: THEME.light }}>Browse files, view code, or download.</p>
//               </div>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <button onClick={() => project && setActiveFile(project.files[0] || null)} className="px-2 py-1 rounded" style={{ background: THEME.light, color: "#063241" }}>Top</button>
//               </div>
//             </div>

//             <div className="flex-1 flex min-h-0">
//               <div className="w-1/3 overflow-auto" style={{ borderRight: "1px solid rgba(255,255,255,0.03)" }}>
//                 {project?.files?.map((f, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveFile(f)}
//                     className={`block w-full text-left px-3 py-2 truncate ${activeFile === f ? "bg-gray-700 font-bold" : "hover:bg-gray-800"}`}
//                     style={{ borderBottom: "1px solid rgba(255,255,255,0.01)" }}
//                   >
//                     <FileCode size={14} className="inline mr-2" /> {f.name}
//                   </button>
//                 ))}
//               </div>

//               <div className="w-2/3 p-3 overflow-auto bg-[#051119]">
//                 {activeFile ? (
//                   <>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <div>
//                         <strong>{activeFile.name}</strong>
//                         <div className="text-xs text-gray-400">{activeFile.language || "text"}</div>
//                       </div>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <button
//                           onClick={() => {
//                             // download single file
//                             const blob = new Blob([activeFile.content], { type: "text/plain" });
//                             const a = document.createElement("a");
//                             a.href = URL.createObjectURL(blob);
//                             a.download = activeFile.name;
//                             a.click();
//                           }}
//                           className="px-2 py-1 rounded"
//                           style={{ background: THEME.mid, color: "#063241", fontWeight: 700 }}
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </div>

//                     <pre className="text-xs whitespace-pre-wrap mt-3" style={{ background: "#02131a", padding: 10, borderRadius: 6 }}>
//                       {activeFile.content}
//                     </pre>
//                   </>
//                 ) : (
//                   <div className="text-gray-400 text-center">Select a file to view code</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;



// import React, { useState, useRef, useEffect } from "react";
// import { Send, Loader2, Download, ShieldCheck, Rocket, FileCode } from "lucide-react";
// import JSZip from "jszip";
// import { mejuvanteApi, projectAPI } from "../../services/api";
// import { useAuth } from "../../contexts/AuthContext";
// import "./ChatInterface.css";

// const ChatInterface: React.FC = () => {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const [project, setProject] = useState<any | null>(null);
//   const [activeFile, setActiveFile] = useState<any | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send message to AI
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg = { role: "user", content: input, timestamp: new Date() };
//     setMessages((m) => [...m, userMsg]);
//     setInput("");
//     setIsGenerating(true);

//     try {
//       const res = await mejuvanteApi.chat({ message: input });
//       const reply = res.reply || "✅ Code generated successfully!";
//       const assistantMsg = { role: "assistant", content: reply, timestamp: new Date() };
//       setMessages((m) => [...m, assistantMsg]);

//       if (res.files?.length) {
//         const newProject = {
//           name: res.projectId || `Project-${Date.now()}`,
//           files: res.files,
//           createdAt: new Date().toISOString(),
//         };
//         setProject(newProject);

//         const htmlFile = res.files.find((f: any) => f.name.includes("index.html"));
//         if (htmlFile) {
//           const blob = new Blob([htmlFile.content], { type: "text/html" });
//           setPreviewUrl(URL.createObjectURL(blob));
//         }

//         // Save chat to backend + localStorage
//         if (user) {
//           const created = await projectAPI.create({
//             name: newProject.name,
//             description: "Generated via ChatInterface",
//             type: "chat",
//             files: newProject.files,
//             chatHistory: JSON.stringify([...messages, assistantMsg]),
//             status: "active",
//             user_id: user.id,
//           });
//           console.log("💾 Chat saved:", created);
//         }
//       }
//     } catch (e: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Error: ${e.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Validate project code
//   const validateProject = async () => {
//     if (!project) return;
//     setIsValidating(true);
//     setMessages((m) => [
//       ...m,
//       { role: "assistant", content: "🧠 Validating code...", timestamp: new Date() },
//     ]);

//     try {
//       const res = await mejuvanteApi.validate(project.files);
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           content: res.success
//             ? "🛡 All files validated successfully!"
//             : `⚠️ Issues found: ${res.issues.map((i: any) => i.message).join(", ")}`,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (e: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Validation failed: ${e.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   // Download ZIP
//   const downloadProject = async () => {
//     if (!project) return;
//     const zip = new JSZip();
//     project.files.forEach((f: any) => zip.file(f.path || f.name, f.content));
//     const blob = await zip.generateAsync({ type: "blob" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${project.name}.zip`;
//     a.click();
//   };

//   // Deploy
//   const deployProject = async () => {
//     if (!project) return;
//     const res = await mejuvanteApi.deployToBackend({
//       projectId: project.name,
//       files: project.files,
//     });
//     setMessages((m) => [
//       ...m,
//       {
//         role: "assistant",
//         content: res.url
//           ? `🚀 Deployed successfully at: ${res.url}`
//           : "⚙️ Deployment initiated...",
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   return (
//     <div className="flex h-screen w-full bg-[#1e3c61] text-white">
//       {/* Chat Section */}
//       <div className={`flex flex-col ${project ? "w-1/3" : "w-full"} border-r border-[#2c99b7]`}>
//         <div className="flex-1 p-3 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
//               <div
//                 className={`inline-block px-3 py-2 rounded ${
//                   m.role === "user" ? "bg-[#2c99b7]" : "bg-[#61c4ca]"
//                 }`}
//               >
//                 {m.content}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="p-2 flex border-t border-[#2c99b7] bg-[#1e3c61]">
//           <input
//             className="flex-1 p-2 rounded bg-[#1e3c61] border border-[#61c4ca] focus:outline-none"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Describe your app..."
//           />
//           <button
//             onClick={sendMessage}
//             className="ml-2 px-4 py-2 bg-[#2c99b7] rounded hover:bg-[#61c4ca]"
//           >
//             {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//           </button>
//         </div>
//       </div>

//       {/* Right side (visible after generation) */}
//       {project && (
//         <div className="flex flex-1">
//           {/* Live Preview */}
//           <div className="w-1/2 flex flex-col border-r border-[#2c99b7]">
//             <div className="p-2 flex justify-between bg-[#2c99b7]">
//               <h3 className="font-semibold">Live Preview</h3>
//               <button
//                 onClick={deployProject}
//                 className="flex items-center gap-1 bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca]"
//               >
//                 <Rocket size={16} /> Deploy
//               </button>
//             </div>
//             {previewUrl ? (
//               <iframe src={previewUrl} className="flex-1 w-full" title="Live Preview" />
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-400">
//                 No preview yet
//               </div>
//             )}
//           </div>

//           {/* Files */}
//           <div className="w-1/2 flex flex-col">
//             <div className="p-2 flex justify-between bg-[#2c99b7]">
//               <h3 className="font-semibold">Files</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={downloadProject}
//                   className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
//                 >
//                   <Download size={16} /> Download
//                 </button>
//                 <button
//                   onClick={validateProject}
//                   disabled={isValidating}
//                   className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
//                 >
//                   {isValidating ? (
//                     <>
//                       <Loader2 className="animate-spin" size={16} /> Validating
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck size={16} /> Validate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="flex-1 flex">
//               <div className="w-1/3 border-r border-[#2c99b7] overflow-y-auto">
//                 {project?.files?.map((f: any, i: number) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveFile(f)}
//                     className={`block w-full text-left px-2 py-1 truncate ${
//                       activeFile === f ? "bg-[#1e3c61]" : "hover:bg-[#61c4ca]"
//                     }`}
//                   >
//                     <FileCode size={14} className="inline mr-1" /> {f.name}
//                   </button>
//                 ))}
//               </div>
//               <div className="w-2/3 p-2 overflow-auto bg-[#1e3c61]">
//                 {activeFile ? (
//                   <pre className="text-xs whitespace-pre-wrap">{activeFile.content}</pre>
//                 ) : (
//                   <div className="text-gray-400 text-center mt-10">
//                     Select a file to view code
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;


// import React, { useState, useRef, useEffect } from "react";
// import { Send, Loader2, Download, ShieldCheck, Rocket, FileCode } from "lucide-react";
// import JSZip from "jszip";
// import { mejuvanteApi, projectAPI } from "../../services/api";
// import { useAuth } from "../../contexts/AuthContext";
// import "./ChatInterface.css";

// const ChatInterface: React.FC = () => {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const [project, setProject] = useState<any | null>(null);
//   const [activeFile, setActiveFile] = useState<any | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 🧩 Load chat history for logged-in user
//   // useEffect(() => {
//   //   const fetchHistory = async () => {
//   //     if (!user) return;
//   //     try {
//   //       const res = await mejuvanteApi.getChatHistory(user.token);
//   //       if (res && Array.isArray(res.data)) {
//   //         const formatted = res.data.flatMap((c: any) => [
//   //           { role: "user", content: c.userMessage },
//   //           { role: "assistant", content: c.assistantMessage },
//   //         ]);
//   //         setMessages(formatted);
//   //       }
//   //     } catch (err) {
//   //       console.error("❌ Failed to fetch chat history:", err);
//   //     }
//   //   };
//   //   fetchHistory();
//   // }, [user]);

//   // 🚀 Send message to AI + Save to backend
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg = { role: "user", content: input, timestamp: new Date() };
//     setMessages((m) => [...m, userMsg]);
//     setInput("");
//     setIsGenerating(true);

//     try {
//       const res = await mejuvanteApi.chat({ message: input });
//       const reply = res.reply || "✅ Code generated successfully!";
//       const assistantMsg = { role: "assistant", content: reply, timestamp: new Date() };
//       setMessages((m) => [...m, assistantMsg]);

//       // 💾 Save chat to backend history
//       if (user) {
//         await mejuvanteApi.saveChat({
//           projectId: project?.name || "general",
//           userMessage: input,
//           assistantMessage: reply,
//         });
//       }

//       // 🧱 If code files are generated, handle preview/project
//       if (res.files?.length) {
//         const newProject = {
//           name: res.projectId || `Project-${Date.now()}`,
//           files: res.files,
//           createdAt: new Date().toISOString(),
//         };
//         setProject(newProject);

//         const htmlFile = res.files.find((f: any) => f.name.includes("index.html"));
//         if (htmlFile) {
//           const blob = new Blob([htmlFile.content], { type: "text/html" });
//           setPreviewUrl(URL.createObjectURL(blob));
//         }

//         // Save project to backend
//         if (user) {
//           const created = await projectAPI.create({
//             name: newProject.name,
//             description: "Generated via ChatInterface",
//             type: "chat",
//             files: newProject.files,
//             chatHistory: JSON.stringify([...messages, assistantMsg]),
//             status: "active",
//             user_id: user.id,
//           });
//           console.log("💾 Project saved:", created);
//         }
//       }
//     } catch (e: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Error: ${e.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // 🧠 Validate project code
//   const validateProject = async () => {
//     if (!project) return;
//     setIsValidating(true);
//     setMessages((m) => [
//       ...m,
//       { role: "assistant", content: "🧠 Validating code...", timestamp: new Date() },
//     ]);

//     try {
//       const res = await mejuvanteApi.validate(project.files);
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           content: res.success
//             ? "🛡 All files validated successfully!"
//             : `⚠️ Issues found: ${res.issues.map((i: any) => i.message).join(", ")}`,
//           timestamp: new Date(),
//         },
//       ]);
//     } catch (e: any) {
//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: `❌ Validation failed: ${e.message}`, timestamp: new Date() },
//       ]);
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   // 📦 Download ZIP
//   const downloadProject = async () => {
//     if (!project) return;
//     const zip = new JSZip();
//     project.files.forEach((f: any) => zip.file(f.path || f.name, f.content));
//     const blob = await zip.generateAsync({ type: "blob" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `${project.name}.zip`;
//     a.click();
//   };

//   // 🌍 Deploy project
//   const deployProject = async () => {
//     if (!project) return;
//     const res = await mejuvanteApi.deployToBackend({
//       projectId: project.name,
//       files: project.files,
//     });
//     setMessages((m) => [
//       ...m,
//       {
//         role: "assistant",
//         content: res.url
//           ? `🚀 Deployed successfully at: ${res.url}`
//           : "⚙️ Deployment initiated...",
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   return (
//     <div className="flex h-screen w-full bg-[#1e3c61] text-white">
//       {/* Chat Section */}
//       <div className={`flex flex-col ${project ? "w-1/3" : "w-full"} border-r border-[#2c99b7]`}>
//         <div className="flex-1 p-3 overflow-y-auto">
//           {messages.map((m, i) => (
//             <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
//               <div
//                 className={`inline-block px-3 py-2 rounded ${
//                   m.role === "user" ? "bg-[#2c99b7]" : "bg-[#61c4ca]"
//                 }`}
//               >
//                 {m.content}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="p-2 flex border-t border-[#2c99b7] bg-[#1e3c61]">
//           <input
//             className="flex-1 p-2 rounded bg-[#1e3c61] border border-[#61c4ca] focus:outline-none"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             placeholder="Describe your app..."
//           />
//           <button
//             onClick={sendMessage}
//             className="ml-2 px-4 py-2 bg-[#2c99b7] rounded hover:bg-[#61c4ca]"
//           >
//             {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
//           </button>
//         </div>
//       </div>

//       {/* Right side (visible after generation) */}
//       {project && (
//         <div className="flex flex-1">
//           {/* Live Preview */}
//           <div className="w-1/2 flex flex-col border-r border-[#2c99b7]">
//             <div className="p-2 flex justify-between bg-[#2c99b7]">
//               <h3 className="font-semibold">Live Preview</h3>
//               <button
//                 onClick={deployProject}
//                 className="flex items-center gap-1 bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca]"
//               >
//                 <Rocket size={16} /> Deploy
//               </button>
//             </div>
//             {previewUrl ? (
//               <iframe src={previewUrl} className="flex-1 w-full" title="Live Preview" />
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-400">
//                 No preview yet
//               </div>
//             )}
//           </div>

//           {/* Files */}
//           <div className="w-1/2 flex flex-col">
//             <div className="p-2 flex justify-between bg-[#2c99b7]">
//               <h3 className="font-semibold">Files</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={downloadProject}
//                   className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
//                 >
//                   <Download size={16} /> Download
//                 </button>
//                 <button
//                   onClick={validateProject}
//                   disabled={isValidating}
//                   className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
//                 >
//                   {isValidating ? (
//                     <>
//                       <Loader2 className="animate-spin" size={16} /> Validating
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck size={16} /> Validate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//             <div className="flex-1 flex">
//               <div className="w-1/3 border-r border-[#2c99b7] overflow-y-auto">
//                 {project?.files?.map((f: any, i: number) => (
//                   <button
//                     key={i}
//                     onClick={() => setActiveFile(f)}
//                     className={`block w-full text-left px-2 py-1 truncate ${
//                       activeFile === f ? "bg-[#1e3c61]" : "hover:bg-[#61c4ca]"
//                     }`}
//                   >
//                     <FileCode size={14} className="inline mr-1" /> {f.name}
//                   </button>
//                 ))}
//               </div>
//               <div className="w-2/3 p-2 overflow-auto bg-[#1e3c61]">
//                 {activeFile ? (
//                   <pre className="text-xs whitespace-pre-wrap">{activeFile.content}</pre>
//                 ) : (
//                   <div className="text-gray-400 text-center mt-10">
//                     Select a file to view code
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;


import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Download, ShieldCheck, Rocket, FileCode } from "lucide-react";
import JSZip from "jszip";
import { mejuvanteApi, projectAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "./ChatInterface.css";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [project, setProject] = useState<any | null>(null);
  const [activeFile, setActiveFile] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  /* 🔹 Scroll to bottom whenever new messages appear */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔹 Load chat from localStorage per user */
  useEffect(() => {
    if (!user) return;
    const savedChats = localStorage.getItem(`chatHistory_${user.id}`);
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    }
  }, [user]);

  /* 🔹 Save chat to localStorage whenever messages update */
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  /* 🚀 Send message to AI + Save to backend + localStorage */
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      const res = await mejuvanteApi.chat({ message: input });
      const reply = res.reply || "✅ Code generated successfully!";
      const assistantMsg = { role: "assistant", content: reply, timestamp: new Date() };
      setMessages((m) => [...m, assistantMsg]);

      // 💾 Save chat to backend history
      // if (user) {
      //   await mejuvanteApi.saveChat({
      //     projectId: project?.name || "general",
      //     userMessage: input,
      //     assistantMessage: reply,
      //   });
      // }

      // 🧱 Handle project preview and saving
      if (res.files?.length) {
        const newProject = {
          name: res.projectId || `Project-${Date.now()}`,
          files: res.files,
          createdAt: new Date().toISOString(),
        };
        setProject(newProject);

        const htmlFile = res.files.find((f: any) => f.name.includes("index.html"));
        if (htmlFile) {
          const blob = new Blob([htmlFile.content], { type: "text/html" });
          setPreviewUrl(URL.createObjectURL(blob));
        }

        if (user) {
          await projectAPI.create({
            name: newProject.name,
            description: "Generated via ChatInterface",
            type: "chat",
            files: newProject.files,
            chatHistory: JSON.stringify([...messages, assistantMsg]),
            status: "active",
            user_id: user.id,
          });
        }
      }
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `❌ Error: ${e.message}`, timestamp: new Date() },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  /* 🧠 Validate project */
  const validateProject = async () => {
    if (!project) return;
    setIsValidating(true);
    setMessages((m) => [
      ...m,
      { role: "assistant", content: "🧠 Validating code...", timestamp: new Date() },
    ]);

    try {
      const res = await mejuvanteApi.validate(project.files);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.success
            ? "🛡 All files validated successfully!"
            : `⚠️ Issues found: ${res.issues.map((i: any) => i.message).join(", ")}`,
          timestamp: new Date(),
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `❌ Validation failed: ${e.message}`, timestamp: new Date() },
      ]);
    } finally {
      setIsValidating(false);
    }
  };

  /* 📦 Download ZIP */
  const downloadProject = async () => {
    if (!project) return;
    const zip = new JSZip();
    project.files.forEach((f: any) => zip.file(f.path || f.name, f.content));
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${project.name}.zip`;
    a.click();
  };

  /* 🌍 Deploy project */
  const deployProject = async () => {
    if (!project) return;
    try {
      const res = await mejuvanteApi.deployToBackend({
        projectId: project.name,
        files: project.files,
      });

      const deployMsg =
        res?.url
          ? `🚀 Deployed successfully at: ${res.url}`
          : "⚙️ Deployment started (check status in dashboard).";

      setMessages((m) => [
        ...m,
        { role: "assistant", content: deployMsg, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `❌ Deployment failed: ${err.message}`, timestamp: new Date() },
      ]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1e3c61] text-white">
      {/* Chat Section */}
      <div className={`flex flex-col ${project ? "w-1/3" : "w-full"} border-r border-[#2c99b7]`}>
        <div className="flex-1 p-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`my-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block px-3 py-2 rounded ${
                  m.role === "user" ? "bg-[#2c99b7]" : "bg-[#61c4ca]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 flex border-t border-[#2c99b7] bg-[#1e3c61]">
          <input
            className="flex-1 p-2 rounded bg-[#1e3c61] border border-[#61c4ca] focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Describe your app..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-[#2c99b7] rounded hover:bg-[#61c4ca]"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
      </div>

      {/* Right side (visible after generation) */}
      {project && (
        <div className="flex flex-1">
          {/* Live Preview */}
          <div className="w-1/2 flex flex-col border-r border-[#2c99b7] bg-[#0d253f]">
            <div className="p-2 flex justify-between bg-[#2c99b7]">
              <h3 className="font-semibold">Live Preview</h3>
              <button
                onClick={deployProject}
                className="flex items-center gap-1 bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca]"
              >
                <Rocket size={16} /> Deploy
              </button>
            </div>
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="flex-1 w-full bg-white text-black"
                title="Live Preview"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                No preview yet
              </div>
            )}
          </div>

          {/* Files */}
          <div className="w-1/2 flex flex-col">
            <div className="p-2 flex justify-between bg-[#2c99b7]">
              <h3 className="font-semibold">Files</h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadProject}
                  className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
                >
                  <Download size={16} /> Download
                </button>
                <button
                  onClick={validateProject}
                  disabled={isValidating}
                  className="bg-[#1e3c61] px-2 py-1 rounded hover:bg-[#61c4ca] flex items-center gap-1"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Validating
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} /> Validate
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 flex">
              <div className="w-1/3 border-r border-[#2c99b7] overflow-y-auto">
                {project?.files?.map((f: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveFile(f)}
                    className={`block w-full text-left px-2 py-1 truncate ${
                      activeFile === f ? "bg-[#1e3c61]" : "hover:bg-[#61c4ca]"
                    }`}
                  >
                    <FileCode size={14} className="inline mr-1" /> {f.name}
                  </button>
                ))}
              </div>
              <div className="w-2/3 p-2 overflow-auto bg-[#0d253f] text-gray-100">
                {activeFile ? (
                  <pre className="text-xs whitespace-pre-wrap">{activeFile.content}</pre>
                ) : (
                  <div className="text-gray-400 text-center mt-10">
                    Select a file to view code
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

