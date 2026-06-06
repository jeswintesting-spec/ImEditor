<div align="center">
  <br />
  <h1>📸 ImEditor</h1>
  <p><strong>Pro Document Preparation & Processing Engine</strong></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" /></a>
    <img src="https://img.shields.io/badge/Privacy-100%25_Local-brightgreen?style=for-the-badge" alt="Privacy First" />
  </p>

  <h3><a href="https://imeditor-5wp.pages.dev/">🌍 View Live Demo</a></h3>
</div>

---

**ImEditor** is an elite, fully client-side web application designed specifically to eliminate the friction of formatting official application documents, passport photos, and signatures.

Government portals, visa applications, and exam registrations often have incredibly strict and frustrating requirements (e.g., "Must be exactly 20KB to 50KB" or "Must be exactly 3.5cm x 4.5cm"). ImEditor solves this by offering surgical precision over image dimensions, binary-search file compression, and formatting—all **without ever uploading your sensitive data to a server**.

---

## ✨ Features

### 🔒 Privacy-First Architecture
All image processing is done locally in your browser using the HTML5 Canvas API. Your sensitive passports, IDs, and signatures **never leave your device**.

### 🎯 Target File Size Compression
ImEditor uses a custom binary-search compression algorithm to accurately compress your image to the *exact* KB target you specify, ensuring flawless uploads every time.

### 🌐 Multilingual & Offline Ready (PWA)
* **Installable Offline App**: Install ImEditor directly to your Desktop or Smartphone. It runs 100% offline via Service Workers.
* **i18n Support**: Instantly switch the UI between English, Español (Spanish), हिन्दी (Hindi), 日本語 (Japanese), Français (French), and മലയാളം (Malayalam).

### 🖨️ Print-Ready Sheet Generator
Stop wasting expensive photo paper. Process your single 3.5x4.5cm passport photo, and ImEditor will automatically tile it onto a perfectly gridded **4x6"**, **5x7"**, **A4**, or **US Letter** sheet for at-home printing.

### 🖋️ Signature Background Removal
Scanned a signature on white paper but need a transparent PNG? ImEditor uses a custom pixel-parsing engine to isolate your ink and completely erase the paper background.

### 🏷️ Auto Name & Date Stamping
Automatically generate the required white bar at the bottom of your passport photo and stamp your Applicant Name and Date of Photo in crisp, bold text.

### 📂 Advanced Batch Pipeline
Drag and drop 50 photos at once. Edit them using a slick carousel interface, apply settings universally, and download the entire batch as a single **ZIP archive**.

### 📏 1-Click Document Presets
* **Indian Passport** (3.5x4.5 cm)
* **US Visa** (2x2 inch)
* **Digital Signature** (256x64 px)
* **PAN Card** (213x213 px)

---

## 🚀 Quick Start

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jeswintesting-spec/ImEditor.git
   cd ImEditor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🛠️ Technology Stack
* **Framework:** React + Vite
* **Styling:** Custom Vanilla CSS (Responsive Glassmorphism UI)
* **Image Processing:** HTML5 `<canvas>`, `FileReader API`
* **Core Packages:**
  * `react-image-crop` (Interactive cropping)
  * `lucide-react` (SVG Icons)
  * `jszip` & `file-saver` (Batch processing & archiving)
  * `react-i18next` (Internationalization)
  * `vite-plugin-pwa` (Offline support)

---

## 📱 Mobile Friendly
ImEditor features a fluid, fully responsive layout. Input rows stack intelligently, the Batch Pipeline supports touch inputs, and action buttons are thumb-optimized for smartphone screens.

---

## 🤝 Contributing
Contributions, issues, and feature requests are highly encouraged! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is [MIT](LICENSE) licensed. Copyright (c) 2026 Jeswin Sunny.
