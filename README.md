# YouTube Economics Channel Statistical Analysis

This project extracts and analyzes statistical data from the latest 100 videos of selected English-speaking economics YouTube channels using the YouTube Data API v3.

## 📊 Objective

The goal of this project is to perform a statistical analysis of content production and engagement metrics in economics-focused YouTube channels.

## 🔍 Data Collected

For each video:

- Title
- Publication date
- View count
- Like count
- Comment count
- Duration

## ⚙️ Technologies Used

- Node.js
- YouTube Data API v3
- Google APIs (googleapis npm package)

## 🔑 How to Configure the API Key and Channel ID

### 1️⃣ Get a YouTube Data API v3 Key

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → Library**.
4. Search for **YouTube Data API v3** and click **Enable**.
5. Go to **APIs & Services → Credentials**.
6. Click **Create Credentials → API Key**.
7. Copy the generated API key.

### 2️⃣ Get the Channel ID

You need the **Channel ID** (not the channel name or @username).

The easiest way:

👉 Use this tool:  
https://www.tunepocket.com/youtube-channel-id-finder/

## ⚙️ Configuration Variables

Inside `index.js` you will find two important variables that allow you to control the scope of the analysis:

```javascript
// Number of videos to analyze
const videosToAnalyze = 100;

// Minimum duration in seconds (e.g., 180 = 3 minutes)
const minDuration = 60;

## 🚀 How to Run

1. Install dependencies: npm install
2. Add your YouTube Data API key in `index.js`
3. Run the script: node index.js
4. Open the generated file:
After execution, the file `statistics.json` will be created in the project root directory.  
Open it with any code editor (e.g., VS Code) or a JSON viewer to inspect the collected data.

---

This repository was created for academic purposes as part of a statistics project.

