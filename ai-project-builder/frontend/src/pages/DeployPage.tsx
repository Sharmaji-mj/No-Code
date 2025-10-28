


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { CloudUpload, Server, CheckCircle, Loader2 } from "lucide-react";
// import axios from "axios";

// interface DeployOption {
//   id: string;
//   name: string;
//   description: string;
//   estimatedCost: {
//     compute: number;
//     storage: number;
//     bandwidth: number;
//     total: number;
//   };
//   instanceTypes: {
//     id: string;
//     name: string;
//     hourlyRate: number;
//     memory: string;
//     cpu: string;
//     storage: string;
//   }[];
// }

// interface DeployResult {
//   success: boolean;
//   message: string;
//   url: string;
//   instanceId: string;
//   region: string;
//   estimatedCost: number;
// }

// // Environment variables (React CRA syntax)
// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// const AWS_REGION = process.env.REACT_APP_AWS_REGION || "us-east-1";

// const DeployPage: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>();
//   const navigate = useNavigate();
//   const [options, setOptions] = useState<DeployOption[]>([]);
//   const [selectedOption, setSelectedOption] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [deploying, setDeploying] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [result, setResult] = useState<DeployResult | null>(null);

//   // Load deployment options
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE}/deploy/options`);
//         setOptions(res.data);
//         setError("");
//       } catch (err) {
//         setError("Failed to load deployment options. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOptions();
//   }, []);

//   const handleDeploy = async () => {
//     if (!selectedOption) {
//       setError("Please select a deployment option first.");
//       return;
//     }

//     setDeploying(true);
//     setError("");
//     setResult(null);

//     try {
//       const token = localStorage.getItem("token"); // for auth middleware
//       const res = await axios.post(
//         `${API_BASE}/deploy/aws`,
//         {
//           projectName: projectId,
//           deploymentType: selectedOption,
//           region: AWS_REGION,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setResult(res.data);
//     } catch (err: any) {
//       console.error("Deployment failed:", err);
//       setError("Deployment failed. Please check logs or try again later.");
//     } finally {
//       setDeploying(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border">
//         <div className="flex items-center gap-3 mb-6">
//           <CloudUpload className="text-blue-600 w-7 h-7" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Deploy Your Project
//           </h1>
//         </div>

//         {loading && (
//           <div className="text-gray-600 flex items-center gap-2">
//             <Loader2 className="animate-spin" /> Loading deployment options...
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         {!loading && options.length > 0 && (
//           <div className="space-y-4">
//             {options.map((opt) => (
//               <div
//                 key={opt.id}
//                 className={`border rounded-xl p-4 cursor-pointer transition ${
//                   selectedOption === opt.id
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-200 hover:border-blue-300"
//                 }`}
//                 onClick={() => setSelectedOption(opt.id)}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
//                       <Server className="text-blue-500" /> {opt.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {opt.description}
//                     </p>
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium">
//                     ~${opt.estimatedCost.total.toFixed(2)}/mo
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Deploy Button */}
//         <div className="mt-6 flex justify-center">
//           <button
//             onClick={handleDeploy}
//             disabled={deploying}
//             className={`px-8 py-3 rounded-xl text-white font-semibold shadow-md transition ${
//               deploying
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {deploying ? "Deploying..." : "Deploy Now"}
//           </button>
//         </div>

//         {/* Deployment Result */}
//         {result && (
//           <div className="mt-8 bg-green-50 border border-green-400 rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
//               <CheckCircle className="text-green-600" /> Deployment Successful!
//             </div>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Instance ID:</strong> {result.instanceId}
//             </p>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Region:</strong> {result.region}
//             </p>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Estimated Monthly Cost:</strong> ${result.estimatedCost}
//             </p>
//             <a
//               href={result.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 font-medium underline"
//             >
//               Visit Live App ↗
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DeployPage;



// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { CloudUpload, Server, CheckCircle, Loader2 } from "lucide-react";
// import axios from "axios";

// interface DeployOption {
//   id: string;
//   name: string;
//   description: string;
//   estimatedCost: { total: number };
//   instanceTypes: { id: string; name: string; cpu?: string; memory?: string; storage?: string; hourlyRate?: number }[];
// }

// interface DeployResult {
//   success: boolean;
//   message: string;
//   url: string;
//   instanceId: string;
//   region: string;
//   estimatedCost: number;
// }

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
// const AWS_REGION = process.env.REACT_APP_AWS_REGION || "us-east-1";

// const DeployPage: React.FC = () => {
//   const { projectId } = useParams<{ projectId: string }>();
//   const navigate = useNavigate();
//   const [options, setOptions] = useState<DeployOption[]>([]);
//   const [selectedOption, setSelectedOption] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [deploying, setDeploying] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState<DeployResult | null>(null);

//   // Fetch deployment options
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE}/deploy/options`);
//         setOptions(res.data.options || []);
//         setError("");
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load deployment options.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOptions();
//   }, []);

//   const handleDeploy = async () => {
//     if (!selectedOption) {
//       setError("Please select a deployment option first.");
//       return;
//     }

//     setDeploying(true);
//     setError("");
//     setResult(null);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         `${API_BASE}/deploy/aws`,
//         { projectName: projectId, instanceType: selectedOption, region: AWS_REGION },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setResult(res.data);
//     } catch (err: any) {
//       console.error("Deployment failed:", err);
//       setError(err.response?.data?.error || "Deployment failed. Please try again.");
//     } finally {
//       setDeploying(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border">
//         <div className="flex items-center gap-3 mb-6">
//           <CloudUpload className="text-blue-600 w-7 h-7" />
//           <h1 className="text-2xl font-bold text-gray-800">Deploy Your Project</h1>
//         </div>

//         {loading && (
//           <div className="text-gray-600 flex items-center gap-2">
//             <Loader2 className="animate-spin" /> Loading deployment options...
//           </div>
//         )}

//         {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//         {!loading && options.length > 0 && (
//           <div className="space-y-4">
//             {options.map((opt) => (
//               <div
//                 key={opt.id}
//                 className={`border rounded-xl p-4 cursor-pointer transition ${
//                   selectedOption === opt.instanceTypes[0].id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
//                 }`}
//                 onClick={() => setSelectedOption(opt.instanceTypes[0].id)}
//               >
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
//                       <Server className="text-blue-500" /> {opt.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">{opt.description}</p>
//                   </div>
//                   <span className="text-gray-700 text-sm font-medium">
//                     ~${opt.estimatedCost.total.toFixed(2)}/mo
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="mt-6 flex justify-center">
//           <button
//             onClick={handleDeploy}
//             disabled={deploying}
//             className={`px-8 py-3 rounded-xl text-white font-semibold shadow-md transition ${
//               deploying ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {deploying ? "Deploying..." : "Deploy Now"}
//           </button>
//         </div>

//         {result && (
//           <div className="mt-8 bg-green-50 border border-green-400 rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
//               <CheckCircle className="text-green-600" /> Deployment Successful!
//             </div>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Instance ID:</strong> {result.instanceId}
//             </p>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Region:</strong> {result.region}
//             </p>
//             <p className="text-sm text-gray-700 mb-2">
//               <strong>Estimated Monthly Cost:</strong> ${result.estimatedCost}
//             </p>
//             <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium underline">
//               Visit Live App ↗
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DeployPage;


// frontend/src/pages/DeployPage.tsx
import React, { useState } from "react";
import axios from "axios";
import "./DeployPage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const DeployPage: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [os, setOs] = useState("");
  const [region, setRegion] = useState("");
  const [ram, setRam] = useState("");
  const [loading, setLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

  const purposes = [
    { id: "static", label: "Static Hosting (S3)" },
    { id: "backend", label: "Backend API Service (EC2)" },
    { id: "database", label: "Database Server" },
    { id: "custom", label: "Custom VM" },
  ];

  const operatingSystems = ["Ubuntu 22.04", "Debian 12", "CentOS 9", "Alpine 3.19"];
  const regions = ["ap-south-1", "us-east-1"];
  const ramOptions = ["1 GB", "2 GB", "4 GB", "8 GB", "16 GB"];

  const handleDeploy = async () => {
    if (!projectName || !purpose || !os || !region || !ram) {
      alert("Please fill all fields before deployment.");
      return;
    }

    setLoading(true);
    setDeploymentStatus("Starting deployment...");

    try {
      const res = await axios.post(`${API_BASE}/deploy`, {
        projectName,
        purpose,
        os,
        region,
        ram,
      });

      if (res.data.success) {
        setDeploymentStatus(
          `✅ Deployment started! Instance ID: ${res.data.instanceId}, IP: ${res.data.ipAddress}`
        );
      } else {
        setDeploymentStatus("⚠️ Deployment failed to start.");
      }
    } catch (err: any) {
      console.error("Deployment failed:", err);
      setDeploymentStatus(
        `❌ Deployment failed. ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deploy-page">
      <h1 className="deploy-title">AWS Deployment Panel</h1>
      <div className="deploy-form">
        <label>Project Name</label>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <label>Purpose</label>
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="">Select Purpose</option>
          {purposes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <label>Operating System</label>
        <select value={os} onChange={(e) => setOs(e.target.value)}>
          <option value="">Select OS</option>
          {operatingSystems.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <label>Region</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Select Region</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label>RAM</label>
        <select value={ram} onChange={(e) => setRam(e.target.value)}>
          <option value="">Select RAM</option>
          {ramOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button className="deploy-btn" onClick={handleDeploy} disabled={loading}>
          {loading ? "Deploying..." : "Deploy"}
        </button>
      </div>

      {deploymentStatus && <div className="deploy-status">{deploymentStatus}</div>}
    </div>
  );
};

export default DeployPage;
