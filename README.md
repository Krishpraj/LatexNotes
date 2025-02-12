# 📚 Math Notes to LaTeX Converter

Transform your handwritten math notes into beautiful LaTeX code with AI-powered conversion.

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features
- Image to LaTeX conversion
- Real-time LaTeX preview
- User-friendly interface
- RESTful API backend
- Google Gemini AI integration

## 🛠️ Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Google Gemini API key

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/math-notes-latex-converter.git
cd math-notes-latex-converter
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## ⚙️ Configuration

1. Set up environment variables:
```bash
cp .env.example .env
```

2. Open `.env` and add your Google Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

## 🚀 Running the Application

### Development Mode
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run server    # Terminal 1 - Backend
npm run client   # Terminal 2 - Frontend
```

### Access Points
- Frontend UI: http://localhost:3000
- Backend API: http://localhost:3001

## 📖 Usage Guide

1. Launch the application and navigate to http://localhost:3000
2. Click the "Choose File" button to upload your math notes image
3. Wait for the AI to process your image
4. Review the generated LaTeX code
5. Check the rendered preview for accuracy

## 🔄 API Documentation

### Endpoints
- `POST /api/convert` - Convert image to LaTeX
- `GET /api/status` - Check API status

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

