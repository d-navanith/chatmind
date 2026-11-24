// ChatMind Smart Reply & Auto-History Logger
// Injected into live chat backends (skgaming21, as6868.com, etc.)

(function () {
  console.log("[ChatMind] Live Chat Smart Assist initialized.");

  // --- 1. LOCAL DATABASE (IndexedDB) FOR CHAT HISTORY BACKUP ---
  const DB_NAME = "ChatMindDB";
  const DB_VERSION = 1;
  const STORE_NAME = "chat_history";
  let dbInstance = null;

  function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
          store.createIndex("userId", "userId", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
          store.createIndex("site", "site", { unique: false });
        }
      };
      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };
      request.onerror = (e) => reject(e);
    });
  }

  function saveChatLog(record) {
    if (!dbInstance) return;
    try {
      const tx = dbInstance.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      record.site = window.location.hostname;
      record.savedAt = new Date().toISOString();
      store.add(record);
      updateStatusBadge();
    } catch (e) {
      console.warn("[ChatMind] Error saving chat log:", e);
    }
  }

  function getChatHistory() {
    return new Promise((resolve) => {
      if (!dbInstance) return resolve([]);
      const tx = dbInstance.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  // --- 2. INTENT CLASSIFICATION & TEMPLATE MATCHING ---
  function analyzeInquiry(customerText, hasAttachment) {
    const textLower = (customerText || "").toLowerCase().trim();
    let matches = [];
    let detectedCategory = null;

    // A. If an image or slip attachment is detected
    if (hasAttachment) {
      detectedCategory = "Receipt / Attachment";
      const receiptCat = window.CHATMIND_KB.categories.find(c => c.id === "deposit_receipt");
      if (receiptCat) {
        matches = receiptCat.templates.slice(0, 5);
      }
      return { category: detectedCategory, hasAttachment: true, suggestions: matches };
    }

    // B. Keyword & Phrase matching against Knowledge Base
    if (textLower.length > 0) {
      for (const cat of window.CHATMIND_KB.categories) {
        let catScore = 0;
        for (const trig of cat.triggers) {
          if (textLower.includes(trig)) {
            catScore += 2;
          }
        }
        if (catScore > 0) {
          detectedCategory = cat.name;
          // Sort templates in category by tag relevance
          matches = cat.templates.slice(0, 4);
          break;
        }
      }
    }

    // C. Default fallback if no specific keywords triggered
    if (matches.length === 0) {
      detectedCategory = "General Support";
      const etiquetteCat = window.CHATMIND_KB.categories.find(c => c.id === "etiquette");
      const receiptCat = window.CHATMIND_KB.categories.find(c => c.id === "deposit_receipt");
      const withdrawCat = window.CHATMIND_KB.categories.find(c => c.id === "withdrawal");
      matches = [
        etiquetteCat.templates[0], // Hold Customer
        etiquetteCat.templates[1], // Clarify Issue
        receiptCat.templates[0],   // RCV
        withdrawCat.templates[0]   // 72h Withdraw Notice
      ];
    }

    return { category: detectedCategory, hasAttachment: false, suggestions: matches };
  }

  // --- 3. 1-CLICK TYPING INTO THE INPUT BOX ---
  function insertTemplateText(text) {
    const textarea = document.querySelector("#chatroom textarea") || document.querySelector("textarea");
    if (!textarea) {
      alert("Chat textarea not found!");
      return;
    }

    // Fill the text value
    textarea.value = text;

    // Trigger input and change events so Backbone / SPA registers the typing
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Shift" }));

    // Focus and scroll to end
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

    // Provide immediate visual feedback
    const container = document.getElementById("chatmind-container");
    if (container) {
      container.style.borderColor = "#10b981";
      setTimeout(() => { container.style.borderColor = "#374151"; }, 800);
    }
  }

  // --- 4. INJECT ASSISTANT UI INTO CHATROOM ---
  let lastProcessedMsgId = null;

  function renderAssistantUI() {
    const chatroom = document.getElementById("chatroom");
    if (!chatroom) return;

    // Check if we are already rendered inside this chatroom
    let container = document.getElementById("chatmind-container");
    const chatTools = chatroom.querySelector(".chat-tools") || chatroom.querySelector("textarea")?.parentElement;
    if (!chatTools) return;

    // Inspect the chat thread to find latest customer message
    const messages = chatroom.querySelectorAll(".message.customer");
    const lastMsgEl = messages.length > 0 ? messages[messages.length - 1] : null;

    let customerText = "";
    let hasAttachment = false;

    if (lastMsgEl) {
      const textEl = lastMsgEl.querySelector(".text");
      customerText = textEl ? textEl.innerText.trim() : "";
      hasAttachment = lastMsgEl.querySelector("img") !== null || customerText.includes(".jpg") || customerText.includes(".png");
    }

    // Unique fingerprint for this customer message
    const msgFingerprint = (lastMsgEl ? lastMsgEl.innerText : "") + (hasAttachment ? "_att" : "");
    if (container && lastProcessedMsgId === msgFingerprint) {
      return; // Already up to date
    }
    lastProcessedMsgId = msgFingerprint;

    // Analyze intent
    const analysis = analyzeInquiry(customerText, hasAttachment);

    // Build or update container
    if (!container) {
      container = document.createElement("div");
      container.id = "chatmind-container";
      chatTools.parentNode.insertBefore(container, chatTools);
    }

    // Generate HTML
    let html = `
      <div class="cm-header">
        <div class="cm-title">
          <span>⚡ Smart Reply</span>
          <span class="cm-pill ${analysis.hasAttachment ? 'cm-pill-attachment' : 'cm-pill-detected'}">
            ${analysis.hasAttachment ? '📷 SLIP / ATTACHMENT DETECTED' : analysis.category}
          </span>
        </div>
        <button type="button" class="cm-btn cm-btn-drawer" id="cm-open-drawer-btn">
          🔍 All Templates
        </button>
      </div>
      <div class="cm-actions-row">
    `;

    analysis.suggestions.forEach((tmpl, idx) => {
      const isSlip = analysis.hasAttachment && idx < 4;
      html += `
        <button type="button" class="cm-btn ${isSlip ? 'cm-btn-slip' : ''}" data-idx="${idx}" title="${tmpl.text.replace(/"/g, '&quot;')}">
          ${isSlip ? '📸 ' : ''}${tmpl.label}
        </button>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Attach event listeners to suggestion buttons
    container.querySelectorAll(".cm-actions-row .cm-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-idx"));
        const tmpl = analysis.suggestions[idx];
        if (tmpl) {
          insertTemplateText(tmpl.text);
        }
      });
    });

    // Attach drawer button
    const drawerBtn = container.querySelector("#cm-open-drawer-btn");
    if (drawerBtn) {
      drawerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openTemplateDrawer();
      });
    }

    // Log chat to local DB
    if (lastMsgEl && customerText) {
      const userName = chatroom.querySelector(".action.profile")?.innerText || "Customer";
      const userId = window.location.hash.split("/")[1] || "unknown";
      saveChatLog({
        userId: userId,
        userName: userName,
        customerText: customerText,
        hasAttachment: hasAttachment,
        detectedCategory: analysis.category,
        timestamp: new Date().toISOString()
      });
    }
  }

  // --- 5. TEMPLATES SEARCH MODAL DRAWER ---
  function createDrawerModal() {
    if (document.getElementById("cm-drawer-modal")) return;

    const modal = document.createElement("div");
    modal.id = "cm-drawer-modal";
    modal.innerHTML = `
      <div class="cm-drawer-box">
        <div class="cm-drawer-head">
          <div style="font-weight:700;font-size:14px;color:#60a5fa;display:flex;align-items:center;gap:6px;">
            <span>⚡ Knowledge Base & Reply Templates</span>
          </div>
          <button type="button" class="cm-btn" id="cm-close-drawer-btn" style="padding:4px 8px;">✕ Close</button>
        </div>
        <div class="cm-drawer-search">
          <input type="text" id="cm-drawer-input" placeholder="Type keyword to filter (e.g., withdraw, 3+1, payid, vpn, rcv, warning)...">
        </div>
        <div class="cm-drawer-body" id="cm-drawer-list"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#cm-close-drawer-btn").addEventListener("click", () => {
      modal.classList.remove("cm-open");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("cm-open");
    });

    const searchInput = modal.querySelector("#cm-drawer-input");
    searchInput.addEventListener("input", () => {
      renderDrawerList(searchInput.value);
    });
  }

  function renderDrawerList(filter = "") {
    const listEl = document.getElementById("cm-drawer-list");
    if (!listEl) return;

    const query = filter.toLowerCase().trim();
    let html = "";

    window.CHATMIND_KB.categories.forEach(cat => {
      const matched = cat.templates.filter(t => {
        if (!query) return true;
        return t.label.toLowerCase().includes(query) ||
               t.text.toLowerCase().includes(query) ||
               t.tags.some(tag => tag.toLowerCase().includes(query));
      });

      if (matched.length > 0) {
        html += `
          <div class="cm-cat-group">
            <div class="cm-cat-title">
              <span>●</span> ${cat.name} (${matched.length})
            </div>
        `;
        matched.forEach(tmpl => {
          html += `
            <div class="cm-template-item" data-text="${encodeURIComponent(tmpl.text)}">
              <div class="cm-template-label">${tmpl.label}</div>
              <div class="cm-template-preview">${tmpl.text}</div>
            </div>
          `;
        });
        html += `</div>`;
      }
    });

    if (!html) {
      html = `<div style="text-align:center;padding:30px;color:#9ca3af;">No matching templates found.</div>`;
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll(".cm-template-item").forEach(item => {
      item.addEventListener("click", () => {
        const text = decodeURIComponent(item.getAttribute("data-text"));
        insertTemplateText(text);
        document.getElementById("cm-drawer-modal").classList.remove("cm-open");
      });
    });
  }

  function openTemplateDrawer() {
    createDrawerModal();
    const modal = document.getElementById("cm-drawer-modal");
    modal.classList.add("cm-open");
    const input = document.getElementById("cm-drawer-input");
    input.value = "";
    renderDrawerList("");
    setTimeout(() => input.focus(), 100);
  }

  // --- 6. FLOATING STATUS & EXPORT BUTTON ---
  function createStatusBar() {
    if (document.getElementById("cm-status-bar")) return;

    const bar = document.createElement("div");
    bar.id = "cm-status-bar";
    bar.title = "Click to export backed-up chat history";
    bar.innerHTML = `
      <span class="cm-indicator-dot"></span>
      <span id="cm-status-text">ChatMind Active</span>
      <span style="background:#374151;color:#fff;border-radius:10px;padding:1px 6px;font-size:10px;" id="cm-log-count">0</span>
    `;
    document.body.appendChild(bar);

    bar.addEventListener("click", async () => {
      const history = await getChatHistory();
      if (history.length === 0) {
        alert("No chat logs recorded yet. Once clients send messages in chat, they will be auto-saved here!");
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `chat_backup_${window.location.hostname}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();
    });
  }

  async function updateStatusBadge() {
    const history = await getChatHistory();
    const countEl = document.getElementById("cm-log-count");
    if (countEl) countEl.innerText = history.length;
  }

  // --- 7. OBSERVER LOOP ---
  initDB().then(() => {
    createStatusBar();
    updateStatusBadge();

    // Check periodically for DOM changes in Backbone chatroom
    setInterval(() => {
      if (window.location.hash.startsWith("#chatroom")) {
        renderAssistantUI();
      }
    }, 400);
  });

})();
