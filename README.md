# Thorem 🚀
### Transform Math Notes into LaTeX with AI

<p align="center">
  <img src="./client/public/graphic.svg" alt="Thorem Logo" width="200" height="200">
</p>

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-9+-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Stars](https://img.shields.io/github/stars/KushalPraja/thorem?style=for-the-badge&logo=github&color=yellow)](https://github.com/KushalPraja/thorem/stargazers)
[![Views](https://img.shields.io/badge/Views-1.2k-4c71f2?style=for-the-badge&logo=github)](https://github.com/KushalPraja/thorem)
[![Support](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/KushalPraja)

**Unleash the power of AI to transform your handwritten math notes into beautifully typeset LaTeX documents.**

## 🎬 Demo Video

Watch a quick demo of Thorem in action:

[![Watch the video](https://raw.githubusercontent.com/kushalpraja/Thorem/main/Screenshot%202025-02-13%20020340.png)](https://raw.githubusercontent.com/kushalpraja/Thorem/main/DEMOVID.mp4)

## 🚀 Elevate Your Math Workflow

Thorem is a cutting-edge SaaS platform designed to streamline the process of converting handwritten math notes into professional-quality LaTeX code. Whether you're a student, educator, or researcher, Thorem empowers you to digitize your notes with unparalleled accuracy and efficiency.

## ✨ Key Features

* **Intelligent Image to LaTeX Conversion:** Leverage the latest AI technology to accurately convert images of your handwritten notes into LaTeX code.
* **Real-Time LaTeX Preview:** Instantly visualize the rendered LaTeX output, ensuring accuracy and allowing for quick adjustments.
* **Intuitive User Interface:** Enjoy a clean, user-friendly interface that simplifies the conversion process.
* **RESTful API Backend:** Seamlessly integrate Thorem's powerful conversion capabilities into your existing workflows.
* **Comprehensive LaTeX Support:** Export your projects with a complete LaTeX preamble, ensuring compatibility with a wide range of compilers and environments.
* **Project Management:** Organize your notes into projects, with support for multiple pages, descriptions, and notes.
* **Customizable Output:** Fine-tune the generated LaTeX code to match your specific formatting preferences.
* **PDF Export:** Generate professional-quality PDF documents directly from your Thorem projects.

## 🛠️ Prerequisites

* Node.js (v18 or higher)
* npm (v9 or higher)

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thorem.git
cd thorem
```

2. Install dependencies:
```bash
npm install # Install server dependencies
cd client
npm install # Install client dependencies
cd ..
```

## ⚙️ Configuration

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Edit the `.env` file to configure the application:
```
# Backend Configuration
PORT=3001
# Add database connection string here if you are using a database
# DATABASE_URL=your_database_connection_string

# Frontend Configuration
CLIENT_PORT=3000
```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run server
```

2. Start the frontend development server:
```bash
npm run client
```

3. Access the application in your browser at `http://localhost:3000`.

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
cd ..
```

2. Start the backend server:
```bash
npm start
```

## 📖 Usage Guide

1. **Create a New Project:** Click the "New Project" button in the sidebar to create a new project for your notes.
2. **Add Pages:** Add new pages to your project by clicking the "+" icon next to the project name.
3. **Upload Notes:** Upload images of your handwritten notes to each page. Thorem will automatically convert the images to LaTeX code.
4. **Edit LaTeX:** Review and edit the generated LaTeX code in the editor.
5. **Preview:** View the rendered LaTeX output in real-time to ensure accuracy.
6. **Export:** Export your project as a `.tex` file for use with any LaTeX compiler.
7. **Export as PDF:** Generate a professional-quality PDF document directly from your Thorem project.

## 🗂️ Project Structure
```
thorem/
├── client/              # Frontend React application
│   ├── public/         # Static assets
│   └── src/            # React source code
├── server/             # Backend Node.js server
│   ├── api/           # API routes and controllers
│   ├── models/        # Data models
│   └── services/      # Business logic
├── docs/              # Documentation
├── tests/             # Test files
└── scripts/           # Utility scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please:
- Open an issue on GitHub
- Email me at kushalpraja6@gmail.com

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Thorem
- Special thanks to the open-source community
- Built with [React](https://reactjs.org/) and [Node.js](https://nodejs.org/)
