const DB_NAME = "ChatMindDB";
const DB_VERSION = 1;
const STORE_NAME = "chat_history";

function getChatHistory() {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) return resolve([]);
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    };
    request.onerror = () => resolve([]);
  });
}

function clearChatHistory() {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) return resolve();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    };
    request.onerror = () => resolve();
  });
}

async function updateStats() {
  const history = await getChatHistory();
  document.getElementById("chat-count").innerText = `${history.length} Conversations`;
}

document.getElementById("export-btn").addEventListener("click", async () => {
  const history = await getChatHistory();
  if (history.length === 0) {
    alert("No chats recorded yet.");
    return;
  }
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chatmind_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

document.getElementById("clear-btn").addEventListener("click", async () => {
  if (confirm("Are you sure you want to clear your local chat history log?")) {
    await clearChatHistory();
    updateStats();
  }
});

updateStats();
