# Claro

**Your personal AI-powered guide to planning, learning, and getting things done.**

Claro is a web application designed to help students and individuals organise their tasks, build roadmaps, and get personalised guidance through an integrated AI chat assistant.

The goal is to make planning and personal development feel more manageable by helping users turn their goals into actionable steps.

## ✨ Features

- **AI-powered chat:** Get guidance and answers through an AI assistant powered by OpenRouter.
- **Task management interface:** Organise tasks and make your plans easier to follow.
- **Onboarding experience:** Introduces users to Claro and its workflow.
- **Responsive web interface:** Built with HTML, CSS, and JavaScript.
- **AI integration through a backend:** Uses an Express server to communicate with OpenRouter without exposing the API key in frontend code.

> Claro is an evolving project. Features and functionality may change as development continues.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js and Express
- **AI integration:** OpenRouter API
- **Styling:** Custom CSS and Bootstrap
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- An [OpenRouter](https://openrouter.ai/) API key

### 1. Clone the repository

```bash
git clone https://github.com/elusanmidavies8-ops/Claro.git
cd Claro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project's root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Replace `your_openrouter_api_key` with your actual API key.

**Security:** Never commit your `.env` file or expose your API key in frontend JavaScript.

### 4. Start the development server

```bash
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser, assuming the server is configured to use port 3000.

## 📁 Project Structure

```text
Claro/
├── assets/
├── Css/
├── js/
├── public/
│   ├── assets/
│   ├── Css/
│   ├── js/
│   ├── index.html
│   ├── onboarding.html
│   ├── chat.html
│   └── task.html
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

The root-level files support local development, while `public/` contains the frontend assets served by the deployed application.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | Secret key used by the backend to authenticate requests to OpenRouter |

For production deployments, configure environment variables through your hosting provider's settings.

## 🌐 Deployment

Claro is deployed using Vercel.

To deploy your own instance:

1. Fork or clone this repository.
2. Import the repository into Vercel.
3. Configure `OPENROUTER_API_KEY` in the project's environment variables.
4. Deploy the application.
5. Test the homepage and AI chat after deployment.

## 🎯 Project Goals

Claro aims to make personal planning and learning easier by combining task organisation with accessible AI guidance.

Future development may include improved personalisation, smarter roadmaps, and a more integrated planning experience.

## 🤝 Contributing

Suggestions, bug reports, and contributions are welcome. If you'd like to contribute, open an issue or submit a pull request.

## 📄 License

No license has been specified yet. Until a license is added, don't assume that the code is available for unrestricted reuse.
