# ⚡ ChatMind | Live Chat 1-Click Smart Assist & History Backup

<p align="center">
  <strong>Intelligent Agent-Assist Extension & Chat-History Collector for High-Velocity Live Chat Operations.</strong>
</p>

---

## 🚀 Overview

**ChatMind** is an enterprise customer support tool designed for live chat management platforms (such as `skgaming21.as6868.com` and related multi-brand backends). It streamlines support operations by auto-detecting client inquiries, providing instant 1-click suggested responses, detecting payment slips, and backing up full conversation histories for analytics and training.

---

## ✨ Key Features

- **⚡ 1-Click Smart Reply**: Reads client messages in real-time, matches intent against the standard response rules (deposits, withdrawals, streaks, PayID, KYC, bonuses), and types the full message into the input box in 1 click.
- **📷 Instant Receipt & Slip Detection**: When a client sends a screenshot or payment receipt, ChatMind alerts the agent and displays quick verification responses (`RCV`, `NO RCV`, `Already Claimed`, `Not Our Bank`).
- **🔍 Quick Knowledge Drawer**: Fast searchable drawer containing categorized response templates and live maintenance download links (Mega888, 918Kiss, Pussy888, Mario Club).
- **💾 Auto Chat-History Backup**: Automatically stores conversation records, questions, and replies into local client storage (IndexedDB), with 1-click JSON export for offline data analysis and AI model training.
- **🌐 Multi-Site Architecture**: Built to operate across all brand sites sharing the same admin architecture without per-site code modifications.

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
│   ├── popup.html              # Extension popup manager
│   ├── popup.js                # Stats & JSON backup exporter
│   └── icons/                  # Extension icons
├── .gitignore                  # Security & credentials exclusion
└── README.md                   # Project documentation
```

---

## 📦 How to Install the Chrome Extension

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** (top right) to **ON**.
3. Click **Load unpacked** (top left).
4. Select the `extension/` folder inside this repository:
   ```text
   d:\chatmind\extension
   ```
5. Navigate to your live chat portal (e.g., `https://skgaming21.as6868.com/#chatlist`) and refresh the page.
6. The **ChatMind Active** status widget will appear at the bottom right. When viewing any chatroom, the 1-click reply bar will appear directly above the typing box.

---

## 🛡️ Security & Privacy

- Authentication tokens, passwords, and 2FA credentials are strictly excluded from git tracking.
- Client personal details and banking data are isolated locally.

---

## 📄 License
MIT License. Created by [d-navanith](https://github.com/d-navanith).
