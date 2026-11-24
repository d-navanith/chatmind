<p align="center">
  <a href="https://github.com/d-navanith/chatmind">
    <img src="extension/icons/logo.png" alt="ChatMind Logo" width="220" />
  </a>
</p>

<h1 align="center">⚡ ChatMind</h1>

<p align="center">
  <strong>Intelligent Agent-Assist Extension & Chat-History Collector for High-Velocity Live Chat Operations.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension Manifest V3" />
  <img src="https://img.shields.io/badge/Telegram_Web-Ready-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Web Ready" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Storage-IndexedDB-5B5B5B?style=for-the-badge&logo=sqlite&logoColor=white" alt="IndexedDB Storage" />
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Playwright-Session_Capture-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</p>

---

## 🚀 Overview

**ChatMind** is an enterprise customer support intelligence platform engineered for live chat management systems (such as `skgaming21.as6868.com`, multi-brand casino backends) and **Telegram Web**. It dramatically accelerates support response velocity by:

1. **Auto-identifying customer problems** in real time.
2. **Offering 1-click verified responses** directly from the official knowledge base.
3. **Detecting payment slips and screenshots** with instant verification action buttons.
4. **Archiving chat histories locally** to train future automation models and extract daily problem insights.

---

## 🌐 Supported Platforms

| Platform | Logo | Status | Supported Features |
| :--- | :---: | :---: | :--- |
| **Google Chrome / Chromium** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Chrome.svg" width="32" height="32" /> | **Full Support** | Native Manifest V3 extension with 1-click typing. |
| **Telegram Web (Web A & K)** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Telegram.svg" width="32" height="32" /> | **Full Support** | Smart reply floating panel above composer, contenteditable insertion. |
| **Live Chat Backends (`as6868.com`)** | <img src="https://img.icons8.com/color/48/chat--v1.png" width="32" height="32" /> | **Full Support** | `#chatlist`, `#chatroom`, receipt detection, template drawer. |
| **Microsoft Edge & Brave** | <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Brave.svg" width="32" height="32" /> | **Full Support** | Unpacked extension loadable on all Chromium engines. |

---

## ✨ Core Features

- **⚡ 1-Click Smart Reply**: Reads client messages in real-time, matches intent against standard response rules (deposits, withdrawals, streaks, PayID, KYC, bonuses), and types the full message into the input box with a single click.
- **📷 Instant Receipt & Slip Detection**: When a client sends a screenshot or payment receipt, ChatMind alerts the agent with an orange badge and provides instant 1-click verification choices (`RCV`, `NO RCV`, `Already Claimed`, `Not Our Bank`).
- **🔍 Quick Knowledge Drawer**: Fast searchable drawer containing categorized response templates and live maintenance download links (Mega888, 918Kiss, Pussy888, Mario Club).
- **💾 Auto Chat-History Backup**: Automatically stores conversation records, questions, and replies into local client storage (IndexedDB), with 1-click JSON export for offline data analysis and AI model training.
- **🌐 Universal Architecture**: Operates across all brand portals sharing the same admin architecture without per-site code modifications.

---

## 🛠️ Project Structure

```
d:\chatmind\
├── collector\
│   ├── capture_snippet.js      # Console diagnostic capture tool
│   └── login_capture.py        # Playwright session collector
├── extension\                  # Chrome Extension (Manifest V3)
│   ├── manifest.json           # Extension manifest configuration
│   ├── content.js              # In-page DOM observer & smart reply engine
│   ├── content.css             # Floating assistant UI styling
│   ├── knowledge_base.js       # Standardized response rules & templates
│   ├── popup.html              # Extension popup manager with brand logo
│   ├── popup.js                # Stats & JSON backup exporter
│   └── icons/                  # High-res logo & extension icons (16, 32, 48, 128)
│       ├── logo.png            # Official ChatMind Logo
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── .gitignore                  # Security & credentials exclusion
└── README.md                   # Project documentation
```

---

## 📦 How to Install the Chrome Extension

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** (top right) to **ON**.
3. Click **Load unpacked** (top left) or click the **Update / Reload** icon if already loaded.
4. Select the `extension/` folder inside this repository:
   ```text
   d:\chatmind\extension
   ```
5. Navigate to your live chat portal (e.g., `https://skgaming21.as6868.com/#chatlist`) or **[Telegram Web](https://web.telegram.org)** and refresh the page.
6. The **ChatMind Active** status widget will appear at the bottom right. When viewing any chatroom, the 1-click reply bar will appear directly above the typing box.

---

## 🛡️ Security & Privacy

- Authentication tokens, passwords, and 2FA credentials are strictly excluded from git tracking.
- Client personal details and banking data are isolated locally.

---

## 📄 License
MIT License. Created by [d-navanith](https://github.com/d-navanith).
