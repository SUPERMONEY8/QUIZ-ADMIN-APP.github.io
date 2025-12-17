import { useEffect, useState, useMemo } from "react";
import { Database, Trash2, RefreshCw, Download, Upload, FileText, User, Mail } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function LocalDatabase() {
  const { user } = useAuth();
  const [localData, setLocalData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("participants"); // "participants" or "quizzes"

  useEffect(() => {
    loadLocalData();
    loadParticipants();
  }, []);

  const loadLocalData = () => {
    try {
      const stored = localStorage.getItem(`quizApp_${user?.uid || 'default'}`);
      if (stored) {
        const data = JSON.parse(stored);
        setLocalData(Array.isArray(data) ? data : []);
      } else {
        setLocalData([]);
      }
    } catch (e) {
      console.error("Failed to load local data:", e);
      setLocalData([]);
    }
  };

  const loadParticipants = () => {
    try {
      // Load from both admin-specific and global storage
      const adminKey = `quizApp_participants_${user?.uid || 'default'}`;
      const globalKey = `quizApp_participants_default`;
      
      const adminStored = localStorage.getItem(adminKey);
      const globalStored = localStorage.getItem(globalKey);
      
      let allParticipants = [];
      if (adminStored) {
        try {
          allParticipants = [...allParticipants, ...JSON.parse(adminStored)];
        } catch {}
      }
      if (globalStored) {
        try {
          allParticipants = [...allParticipants, ...JSON.parse(globalStored)];
        } catch {}
      }
      
      // Remove duplicates by email
      const uniqueParticipants = Array.from(
        new Map(allParticipants.map(p => [p.email || p.id, p])).values()
      );
      
      // Sort by lastLogin descending (most recent first)
      const sorted = uniqueParticipants.sort((a, b) => {
        const timeA = new Date(a.lastLogin || 0).getTime();
        const timeB = new Date(b.lastLogin || 0).getTime();
        return timeB - timeA;
      });
      setParticipants(sorted);
    } catch (e) {
      console.error("Failed to load participants:", e);
      setParticipants([]);
    }
  };

  const saveParticipantLogin = (participantName, email) => {
    try {
      const key = `quizApp_participants_${user?.uid || 'default'}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      
      // Check if participant already exists
      const existingIndex = existing.findIndex(
        (p) => p.email === email || (p.name === participantName && p.email === email)
      );
      
      const participantData = {
        name: participantName || "Unknown",
        email: email || "",
        lastLogin: new Date().toISOString(),
        loginCount: existingIndex >= 0 ? (existing[existingIndex].loginCount || 0) + 1 : 1,
      };
      
      let updated;
      if (existingIndex >= 0) {
        // Update existing participant
        updated = [...existing];
        updated[existingIndex] = { ...updated[existingIndex], ...participantData };
      } else {
        // Add new participant
        updated = [...existing, { ...participantData, id: Date.now().toString() }];
      }
      
      localStorage.setItem(key, JSON.stringify(updated));
      loadParticipants();
    } catch (e) {
      console.error("Failed to save participant login:", e);
    }
  };

  const saveToLocal = (quizData) => {
    try {
      const key = `quizApp_${user?.uid || 'default'}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = [...existing, {
        id: quizData.id || Date.now().toString(),
        name: quizData.name || "Untitled Quiz",
        description: quizData.description || "",
        createdAt: new Date().toISOString(),
        data: quizData,
      }];
      localStorage.setItem(key, JSON.stringify(updated));
      loadLocalData();
    } catch (e) {
      console.error("Failed to save to local:", e);
    }
  };

  const deleteFromLocal = (id) => {
    try {
      const key = `quizApp_${user?.uid || 'default'}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const updated = existing.filter((item) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      loadLocalData();
    } catch (e) {
      console.error("Failed to delete from local:", e);
    }
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone.")) {
      try {
        const key = `quizApp_${user?.uid || 'default'}`;
        localStorage.removeItem(key);
        loadLocalData();
      } catch (e) {
        console.error("Failed to clear local data:", e);
      }
    }
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(localData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-local-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export data:", e);
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          const key = `quizApp_${user?.uid || 'default'}`;
          localStorage.setItem(key, JSON.stringify(data));
          loadLocalData();
        }
      } catch (err) {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const totalSize = useMemo(() => {
    const dataStr = JSON.stringify(localData);
    const sizeInBytes = new Blob([dataStr]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [localData]);

  const participantsSize = useMemo(() => {
    const dataStr = JSON.stringify(participants);
    const sizeInBytes = new Blob([dataStr]).size;
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }, [participants]);

  const clearParticipants = () => {
    if (confirm("Are you sure you want to clear all participant data? This cannot be undone.")) {
      try {
        const key = `quizApp_participants_${user?.uid || 'default'}`;
        localStorage.removeItem(key);
        loadParticipants();
      } catch (e) {
        console.error("Failed to clear participants:", e);
      }
    }
  };

  const exportParticipants = () => {
    try {
      const dataStr = JSON.stringify(participants, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-participants-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export participants:", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-medical-600 dark:text-medical-400" />
          Local Database
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadLocalData();
              loadParticipants();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("participants")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "participants"
              ? "text-medical-600 dark:text-medical-400 border-b-2 border-medical-600 dark:border-medical-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Recent Participants
        </button>
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "quizzes"
              ? "text-medical-600 dark:text-medical-400 border-b-2 border-medical-600 dark:border-medical-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Quiz Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="medical-card p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {activeTab === "participants" ? "Participants" : "Items"}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {activeTab === "participants" ? participants.length : localData.length}
          </div>
        </div>
        <div className="medical-card p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {activeTab === "participants" ? participantsSize : totalSize}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activeTab === "participants" ? (
          <>
            <button
              onClick={exportParticipants}
              className="medical-button-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1"
              disabled={participants.length === 0}
            >
              <Download className="h-3 w-3" />
              Export
            </button>
            <button
              onClick={clearParticipants}
              className="medical-button-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              disabled={participants.length === 0}
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          </>
        ) : (
          <>
            <label className="medical-button-secondary text-xs px-3 py-1.5 cursor-pointer inline-flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <button
              onClick={exportData}
              className="medical-button-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1"
              disabled={localData.length === 0}
            >
              <Download className="h-3 w-3" />
              Export
            </button>
            <button
              onClick={clearAll}
              className="medical-button-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              disabled={localData.length === 0}
            >
              <Trash2 className="h-3 w-3" />
              Clear All
            </button>
          </>
        )}
      </div>

      {/* Data List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {activeTab === "participants" ? (
          participants.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No participants logged in yet</p>
            </div>
          ) : (
            participants.map((participant) => (
              <div
                key={participant.id || participant.email || participant.name}
                className="medical-card p-3 group hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-medical-600 dark:text-medical-400 flex-shrink-0" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.name || "Unknown"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{participant.email || "No email"}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last login: {participant.lastLogin
                        ? new Date(participant.lastLogin).toLocaleString()
                        : "Unknown"}
                      {participant.loginCount > 1 && (
                        <span className="ml-2">• {participant.loginCount} logins</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          localData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No local data stored</p>
            </div>
          ) : (
            localData.map((item) => (
              <div
                key={item.id}
                className="medical-card p-3 group hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFromLocal(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

