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
  <img src="https://img.shields.io/badge/Version-1.2.0-blue?style=for-the-badge" alt="Version 1.2.0" />
  <img src="https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension Manifest V3" />
  <img src="https://img.shields.io/badge/Telegram_Web-Ready-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Web Ready" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Storage-IndexedDB-5B5B5B?style=for-the-badge&logo=sqlite&logoColor=white" alt="IndexedDB Storage" />
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
</p>

---

## 🚀 Overview

**ChatMind** is an enterprise customer support intelligence platform engineered for live chat management backends, multi-brand customer service portals, and **Telegram Web**. It dramatically accelerates support response velocity by:

1. **Auto-identifying customer problems** in real time from incoming chat streams.
2. **Offering 1-click verified responses** directly from the official operator knowledge base.
3. **Detecting payment slips and screenshots** with instant verification action buttons (`RCV`, `NO RCV`, `D CLAIM`, `NOT OUR BANK`).
4. **Archiving chat histories locally** to train future automation models and extract daily problem insights.

---

## 🌐 Supported Platforms

| Platform | Badge | Status | Supported Features |
| :--- | :---: | :---: | :--- |
| **Google Chrome / Chromium** | ![Google Chrome](https://img.shields.io/badge/Google_Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white) | **Full Support** | Native Manifest V3 extension with 1-click typing and auto-mounting. |
| **Telegram Web (Web A & K)** | ![Telegram](https://img.shields.io/badge/Telegram_Web-26A5E4?style=flat-square&logo=telegram&logoColor=white) | **Full Support** | Smart reply floating panel above composer, contenteditable insertion. |
| **Enterprise Live Chat Portals** | ![Live Chat](https://img.shields.io/badge/Live_Chat-10B981?style=flat-square&logo=livechat&logoColor=white) | **Full Support** | Real-time chat threads, receipt detection, queue toolbar, searchable drawer. |
| **Microsoft Edge & Brave** | ![Edge & Brave](https://img.shields.io/badge/Edge_%26_Brave-0078D7?style=flat-square&logo=microsoftedge&logoColor=white) | **Full Support** | Unpacked extension loadable on all Chromium engines. |

---

## ✨ Core Features in v1.2.0

- **⚡ 1-Click Smart Reply**: Reads client messages in real-time, matches intent against standard response rules (deposits, withdrawals, streaks, PayID, KYC, bonuses), and types the full message into the input box with a single click.
- **🖱️ Draggable Floating Sidebar**: The bright blue `⚡ ChatMind` button on the right edge of the screen can be dragged vertically to any convenient position, with position remembered automatically across browser sessions.
- **📑 Instant Category Filter Pills**: Easily switch between template categories (`📸 Slips`, `💳 PayID`, `⏳ Withdraw`, `🎁 3+1 Bonus`, `🛡️ VPN / Tech`, `🎮 Game Links`) with single-click filter pills in the sidebar.
- **📷 Instant Receipt & Slip Detection**: When a client sends a screenshot or payment receipt, ChatMind alerts the agent with an orange badge and provides instant 1-click verification choices (`RCV`, `NO RCV`, `D CLAIM`, `NOT OUR BANK`).
- **📋 Queue Quick-Replies Toolbar**: Permanent on-screen quick action bar positioned directly above chat queues with a one-click minimize/expand toggle.
- **🔄 Continuous Self-Healing Mount**: Automatically keeps UI elements injected and synchronized even during client-side SPA routing and DOM re-renders.
- **💾 Auto Chat-History Backup**: Automatically stores conversation records, questions, and replies into local client storage (IndexedDB), with 1-click JSON export for offline data analysis and AI model training.

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
│   ├── popup.html              # Extension popup manager with brand logo & stats
│   ├── popup.js                # Local DB stats & JSON backup exporter
│   └── icons/                  # High-res logo & extension icons (16, 32, 48, 128)
│       ├── logo.png            # Official ChatMind Logo
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── assets/
│   └── logos/                  # Offline vector badges & assets
├── .gitignore                  # Security & credentials exclusion
└── README.md                   # Project documentation
```

---

## 📦 How to Install / Update the Extension

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** (top right) to **ON**.
3. If installing for the first time:
   - Click **Load unpacked** (top left) and select the `extension/` folder inside this repository:
     ```text
     d:\chatmind\extension
     ```
4. If updating an existing install:
   - Click the circular **Reload icon (🔄)** on the ChatMind card.
5. Return to your live chat portal or **[Telegram Web](https://web.telegram.org)** and press **F5 (Refresh)**.
6. The **ChatMind Active** status widget will appear at the bottom right, and the **⚡ ChatMind** floating button will appear on the right screen edge.

---

## 🛡️ Security & Privacy

- Authentication tokens, passwords, and 2FA credentials are strictly excluded from git tracking.
- Client personal details and banking data are isolated locally.
- Extension operates entirely offline and locally within the browser session without any external analytics servers.

---

## 📄 License
MIT License. Created by [d-navanith](https://github.com/d-navanith).
