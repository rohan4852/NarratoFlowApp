
# NarratoFlow – AI Story Dashboard

NarratoFlow turns dull CSV business reports into an engaging AI‑generated story experience.

## ✨ Features
- CSV Upload & Theme Select
- AI Insight Cards (mocked)
- Drill‑down Analysis View
- Export Summary Screen
- Tailwind‑styled responsive UI

## 🛠 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, TailwindCSS |
| Mock AI | Gemini‑style insight generator (static data) |
| Build Tool | CRA (react‑scripts) |

## � Security Best Practices

### API Key Security
1. Never commit your API keys to Git
2. Never share your API keys in public repositories
3. Rotate your API keys if they are exposed
4. Use environment variables for sensitive data

### Environment Setup
1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create a `.env` file from `.env.example`
3. Add your API key to the `.env` file
4. Never commit the `.env` file to Git

## �🚀 Quick Start

### Prerequisites
- Node.js & npm installed on your system
- Download from: https://nodejs.org/
- OpenAI API key (get it from https://platform.openai.com/api-keys)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/rohan4852/NarratoFlowApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open http://localhost:3000 in your browse

## 📸 Screenshots
![Upload](./snapshots/01_UploadScreen.png)
![Insight](./snapshots/02_InsightView.png)
![DrillDown](./snapshots/03_DrillDown.png)
![Export](./snapshots/04_ExportScreen.png)

## 🗺 Roadmap
- Integrate real Gemini API
- Add data visualizations
- Firebase auth & storage
