# Edge Forensic Lab 
###  Labour Law (Royal Decree 53/2023) Digital Evidence & Case Management Portal

A specialized, bilingual/trilingual legal forensic case management and evidence analysis system built for the labour dispute of 

---

## 🏛️ Case Summary & Parties

---

## 🚀 Key Modules & Architecture

The application provides a dual-runtime architecture:
1. **Full-Stack Web App:** React 19 + TypeScript + Tailwind CSS + Express backend with Gemini API integration.
2. **Offline Standalone Single-File HTML:** Available in `/public/marufedge-forensic-lab.html` (or downloadable via the topbar "Offline HTML" button) with zero dependencies, vanilla JS, embedded CSS, and localStorage persistence.

### 12 Core Forensic Sections:
1. **لوحة التحكم (Dashboard):** Real-time case KPIs, urgent legal alerts (Articles 6, 55, 114, 120), and hearing status.
2. **التقرير الجنائي (Forensic Audit):** Documented 7-point illegal deduction table totaling **1,947.700 OMR** and the Jan/Feb 2026 salary reconstruction.
3. **المخالفات القانونية (Statutory Violations):** 5 legal breach cards covering Passport Retention (Arts 6 & 147), Demotion (Art 37), Excessive Deductions (Arts 55 & 58), Unpaid Annual Leave (Art 58), and Sick Leave Cut (Art 66).
4. **مخزن الأدلة الرقمية (Evidence Vault):** Filterable categorized exhibits (Bank Muscat WPS, MOL hearing notices, Ooredoo bills, deposit slips) with instant modal inspection.
5. **الدفتر المزدوج (Dual-Ledger Tracker):** Strict separation of `HABIBUR_PERSONAL` vs `OWNER_CORPORATE` entries with automated shortage calculation: `Sales - Deposit - Expenses`.
6. **تلوث السجل الفرعي (Sub-Ledger Tampering):** Forensic analysis proving third-party debts (Shajahan 300 OMR, Hafez 100 OMR) coerced onto worker's sub-ledger.
7. **مختبر الذكاء الاصطناعي (AI Lab):** Integrated with Google Gemini models (`gemini-3.8-flash`) and multi-provider fallback.
8. **مستشار قانون العمل الذكي (Oman Labour Law AI Advisor):** Real-time statutory interpretations and court guidance grounded in **Royal Decree 53/2023** and recent Ministerial Decisions (e.g. MD 729/2024 for WPS 3-day mandate) powered by **Google Search Grounding**.
9. **تفريغ الصوتيات والميكروفون (Audio Transcriber):** Verbatim microphone speech-to-text powered by the dedicated **`gemini-3.5-transcribe`** model.
10. **حاسبة المستحقات (Statutory Calculator):** Automated statutory claim calculator enforcing Royal Decree 53/2023 formulas (EOSB 2,125 OMR, Leave 1,100 OMR, COVID Arrears 3,000 OMR, Deductions 1,417 OMR = **7,642.000 OMR**).
11. **الخطابات الاستراتيجية (Strategic Letters):** Track 1 (Formal Settlement Appeal) and Track 2 (NOC & Sponsorship Transfer Request).
12. **مذكرة المحكمة (Court Petition A4 Print):** Judicial 6-part petition formatted strictly for **two A4 pages in Arabic & English only** (Bangla UI elements excluded from print).
13. **الإعدادات والنسخ الاحتياطي (Settings & Backup):** Google Sign-In with Firebase Auth, Firestore cloud persistence, and JSON export/import.

---

## 🎙️ Speech-to-Text Transcription (`gemini-3.5-transcribe`)

The application integrates audio recording and transcription:
- **Microphone Recording:** Browser `navigator.mediaDevices.getUserMedia` + `MediaRecorder` with live waveform visualizer and MM:SS timer.
- **Backend Model:** Proxied through `POST /api/ai/transcribe` utilizing model **`gemini-3.5-transcribe`**.
- **Voice Dictation in AI Lab:** Direct mic button in the prompt box to dictate questions and legal memos directly.
- **File Upload:** Supports `.wav`, `.mp3`, `.m4a`, and `.webm` up to 20 MB.

---

## 🛠️ Development & Running

```bash
# Install dependencies
npm install

# Run development server (starts on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Typecheck and lint
npm run lint
```

---

## 📄 License & Confidentiality

Internal judicial dossier and case study tool for Habibur Rahman Abdul Barak. All statutory citations grounded in Sultanate of Oman Royal Decree No. 53/2023.
