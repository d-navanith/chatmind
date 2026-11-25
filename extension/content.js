// ChatMind Universal Live Chat & Agent-Assist Extension
// Works on:
// 1. Casino / Gaming backends (skgaming21, as6868.com, all brand portals)
//    - Works on #chatlist, #chatroom, and all sub-pages!
// 2. Telegram Web (web.telegram.org)

(function () {
  const isTelegram = window.location.hostname.includes("telegram.org");
  const isCasinoPortal = window.location.hostname.includes("as6868.com") || window.location.hash.includes("chat");
  console.log(`[ChatMind] Active on ${window.location.hostname} (Telegram: ${isTelegram}, Casino: ${isCasinoPortal})`);

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

    if (hasAttachment) {
      detectedCategory = "Receipt / Attachment";
      const receiptCat = window.CHATMIND_KB.categories.find(c => c.id === "deposit_receipt");
      if (receiptCat) {
        matches = receiptCat.templates.slice(0, 5);
      }
      return { category: detectedCategory, hasAttachment: true, suggestions: matches };
    }

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
          matches = cat.templates.slice(0, 4);
          break;
        }
      }
    }

    if (matches.length === 0) {
      detectedCategory = "General Support";
      const etiquetteCat = window.CHATMIND_KB.categories.find(c => c.id === "etiquette");
      const receiptCat = window.CHATMIND_KB.categories.find(c => c.id === "deposit_receipt");
      const withdrawCat = window.CHATMIND_KB.categories.find(c => c.id === "withdrawal");
      matches = [
        receiptCat.templates[0],   // RCV
        receiptCat.templates[1],   // NO RCV
        withdrawCat.templates[0],  // 72h Withdraw Notice
        etiquetteCat.templates[0]  // Hold Customer
      ];
    }

    return { category: detectedCategory, hasAttachment: false, suggestions: matches };
  }

  // --- 3. UNIVERSAL 1-CLICK TYPING & CLIPBOARD FALLBACK ---
  function insertTemplateText(text) {
    let inserted = false;

    // 1. Telegram Web input (contenteditable div)
    if (isTelegram) {
      const tgInput = document.querySelector(
        '#editable-message-text, .input-message-input, div.input-field-input[contenteditable="true"], div[contenteditable="true"]'
      );
      if (tgInput) {
        tgInput.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(tgInput);
        selection.removeAllRanges();
        selection.addRange(range);

        if (!document.execCommand("insertText", false, text)) {
          tgInput.innerText = text;
        }
        tgInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
        tgInput.dispatchEvent(new Event("change", { bubbles: true }));
        inserted = true;
      }
    }

    // 2. Casino / Standard Textarea (on #chatroom or #chatlist)
    if (!inserted) {
      const textarea = document.querySelector("#chatroom textarea, .chat-tools textarea, textarea");
      if (textarea && textarea.offsetParent !== null) { // visible
        textarea.value = text;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        textarea.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, key: "Shift" }));
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
        inserted = true;
      }
    }

    // 3. If inserted into a box, provide visual feedback
    if (inserted) {
      showToast("✅ Response inserted into chat box! Press Enter to send.");
      const container = document.getElementById("chatmind-container");
      if (container) {
        container.style.borderColor = "#10b981";
        setTimeout(() => { container.style.borderColor = "#374151"; }, 800);
      }
    } else {
      // 4. If no chat box is open (e.g. agent is on #chatlist), copy to clipboard!
      navigator.clipboard.writeText(text).then(() => {
        showToast("📋 Copied to clipboard! Click on a chat and press Ctrl+V to paste.");
      }).catch(() => {
        prompt("Copy this response:", text);
      });
    }
  }

  function showToast(msg) {
    let toast = document.getElementById("cm-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cm-toast";
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.className = "cm-toast-show";
    setTimeout(() => {
      toast.className = "";
    }, 2800);
  }

  // --- 4. IN-ROOM ASSISTANT BAR (Above Textarea in #chatroom or Telegram) ---
  let lastProcessedFingerprint = null;

  function renderInRoomAssistant() {
    // Find target input container
    let composerContainer = null;
    let customerText = "";
    let hasAttachment = false;

    if (isTelegram) {
      composerContainer = document.querySelector(
        '.middle-column-footer, .chat-input, .input-message-container, .composer-wrapper'
      );
      const incomingMessages = document.querySelectorAll(
        '.Message.incoming, .bubble.is-in, .message-list-item .incoming, .message.is-in'
      );
      const lastMsgEl = incomingMessages.length > 0 ? incomingMessages[incomingMessages.length - 1] : null;
      if (lastMsgEl) {
        const textEl = lastMsgEl.querySelector('.text-content, .message, .translatable-message');
        customerText = textEl ? textEl.innerText.trim() : lastMsgEl.innerText.trim();
        hasAttachment = lastMsgEl.querySelector('img, .media-photo, .media-container, .Album') !== null;
      }
    } else {
      // Casino Portal: check for #chatroom or any .chat-tools / textarea
      const chatroom = document.getElementById("chatroom") || document.querySelector(".chat-tools")?.closest("div");
      const textarea = document.querySelector("#chatroom textarea, .chat-tools textarea");
      if (textarea && textarea.offsetParent !== null) {
        composerContainer = textarea.closest(".chat-tools") || textarea.parentElement;
      }
      const messages = document.querySelectorAll("#chatroom .message.customer, .message.customer");
      const lastMsgEl = messages.length > 0 ? messages[messages.length - 1] : null;
      if (lastMsgEl) {
        const textEl = lastMsgEl.querySelector(".text");
        customerText = textEl ? textEl.innerText.trim() : "";
        hasAttachment = lastMsgEl.querySelector("img") !== null || customerText.includes(".jpg") || customerText.includes(".png");
      }
    }

    if (!composerContainer) return;

    const fingerprint = (customerText.slice(0, 100)) + (hasAttachment ? "_att" : "");
    let container = document.getElementById("chatmind-container");

    if (container && lastProcessedFingerprint === fingerprint) {
      return;
    }
    lastProcessedFingerprint = fingerprint;

    const analysis = analyzeInquiry(customerText, hasAttachment);

    if (!container) {
      container = document.createElement("div");
      container.id = "chatmind-container";
      composerContainer.parentNode.insertBefore(container, composerContainer);
    }

    let html = `
      <div class="cm-header">
        <div class="cm-title">
          <span>⚡ Smart Reply</span>
          <span class="cm-pill ${analysis.hasAttachment ? 'cm-pill-attachment' : 'cm-pill-detected'}">
            ${analysis.hasAttachment ? '📷 SLIP / ATTACHMENT' : analysis.category}
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

    container.querySelectorAll(".cm-actions-row .cm-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-idx"));
        const tmpl = analysis.suggestions[idx];
        if (tmpl) insertTemplateText(tmpl.text);
      });
    });

    container.querySelector("#cm-open-drawer-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      openTemplateDrawer();
    });

    // Save chat log
    if (customerText) {
      const userName = document.querySelector(".action.profile, .chat-info .title, .peer-title")?.innerText || "Customer";
      saveChatLog({
        userId: userName,
        userName: userName,
        customerText: customerText,
        hasAttachment: hasAttachment,
        detectedCategory: analysis.category,
        timestamp: new Date().toISOString()
      });
    }
  }

  // --- 5. PERMANENT FLOATING ASSISTANT SIDEBAR (Visible on #chatlist and everywhere!) ---
  function createFloatingSidebar() {
    if (document.getElementById("cm-sidebar-dock")) return;

    const dock = document.createElement("div");
    dock.id = "cm-sidebar-dock";
    dock.innerHTML = `
      <div id="cm-sidebar-toggle" title="Click to open ChatMind 1-Click Templates">
        <span style="font-size:16px;">⚡</span>
        <span class="cm-toggle-text">ChatMind</span>
      </div>
      <div id="cm-sidebar-panel">
        <div class="cm-sidebar-head">
          <div style="font-weight:700;color:#60a5fa;display:flex;align-items:center;gap:6px;">
            <span>⚡ ChatMind Quick Assist</span>
          </div>
          <button type="button" id="cm-sidebar-close" style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:14px;">✕</button>
        </div>
        <div class="cm-sidebar-search">
          <input type="text" id="cm-sidebar-input" placeholder="Search template (e.g. withdraw, streak, rcv)...">
        </div>
        <div class="cm-sidebar-content" id="cm-sidebar-list"></div>
      </div>
    `;
    document.body.appendChild(dock);

    const toggle = document.getElementById("cm-sidebar-toggle");
    const panel = document.getElementById("cm-sidebar-panel");
    const closeBtn = document.getElementById("cm-sidebar-close");
    const searchInput = document.getElementById("cm-sidebar-input");

    toggle.addEventListener("click", () => {
      panel.classList.toggle("cm-panel-open");
      if (panel.classList.contains("cm-panel-open")) {
        renderSidebarList("");
        setTimeout(() => searchInput.focus(), 150);
      }
    });

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("cm-panel-open");
    });

    searchInput.addEventListener("input", () => {
      renderSidebarList(searchInput.value);
    });
  }

  function renderSidebarList(filter = "") {
    const listEl = document.getElementById("cm-sidebar-list");
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
              <span>●</span> ${cat.name}
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
      html = `<div style="text-align:center;padding:20px;color:#9ca3af;font-size:12px;">No matching templates found.</div>`;
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll(".cm-template-item").forEach(item => {
      item.addEventListener("click", () => {
        const text = decodeURIComponent(item.getAttribute("data-text"));
        insertTemplateText(text);
      });
    });
  }

  // --- 6. TEMPLATES SEARCH MODAL DRAWER ---
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

  // --- 7. FLOATING STATUS & EXPORT BUTTON ---
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

  // --- 8. OBSERVER INITIALIZATION ---
  initDB().then(() => {
    createStatusBar();
    createFloatingSidebar();
    updateStatusBadge();

    // Continuously observe DOM for active chats & textareas
    setInterval(() => {
      renderInRoomAssistant();
    }, 400);
  });

})();
