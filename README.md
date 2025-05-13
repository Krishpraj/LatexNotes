
https://github.com/user-attachments/assets/59d20ff8-47e1-4aa5-be7e-72c09baa97a6

# 📝 LatexNotes

LatexNotes is a powerful SaaS platform designed to convert handwritten math notes into professional-quality LaTeX code using **Gemini AI**, with real-time previews powered by **Tectonic**. Users can organize notes into projects, add image-based pages, and export entire projects as polished PDFs with customizable title pages.

---

## 🚀 Features

- **Intelligent Image to LaTeX Conversion**  
  Leverage AI to accurately convert images of handwritten notes into LaTeX code.
  
- **Real-Time LaTeX Preview**  
  Instantly visualize rendered LaTeX output for quick verification and edits.
  
- **Intuitive User Interface**  
  Clean, responsive, and user-friendly design using React + TailwindCSS.
  
- **RESTful API Backend**  
  Seamless interaction between frontend and backend using Axios.
  
- **Comprehensive LaTeX Support**  
  Full LaTeX preamble for compatibility across environments.
  
- **Project Management System**  
  Organize notes into multiple projects and pages with custom descriptions.
  
- **Customizable Output**  
  Modify LaTeX code to suit specific formatting needs.
  
- **PDF Export**  
  Generate professional PDFs directly from your projects.

---

## 🛠️ Technologies Used

- React  
- TypeScript  
- TailwindCSS  
- Gemini API  
- Tectonic  
- Axios

---

## 📦 Prerequisites

- Node.js (v18 or higher)  
- npm (v9 or higher)

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thorem.git
cd thorem

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
````

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then configure the necessary variables:

```env
# Backend Configuration
PORT=3001
# Optional: DATABASE_URL=your_database_connection_string

# Frontend Configuration
CLIENT_PORT=3000
```

---

## 🚀 Running the Application

### Development Mode

Start the backend server:

```bash
npm run server
```

Start the frontend development server:

```bash
npm run client
```

Access the application at: [http://localhost:3000](http://localhost:3000)

### Production Mode

Build the frontend:

```bash
cd client
npm run build
cd ..
```

Start the backend:

```bash
npm start
```

---

## 📖 Usage Guide

1. **Create a New Project**
   Use the sidebar to create a new notes project.

2. **Add Pages**
   Add pages to the project for different sections or topics.

3. **Upload Notes**
   Upload images of handwritten notes to each page. AI handles the LaTeX conversion.

4. **Edit LaTeX**
   Refine or update the auto-generated LaTeX in the editor.

5. **Preview**
   See a live preview of the LaTeX document.

6. **Export as .tex**
   Download the LaTeX source file.

7. **Export as PDF**
   Generate a full PDF document with title pages and formatting.

---

## 🗂️ Project Structure

```
thorem/
├── client/              # Frontend React application
│   ├── public/          # Static assets
│   └── src/             # React source code
├── server/              # Backend Node.js server
│   ├── api/             # API routes and controllers
│   ├── models/          # Data models
│   └── services/        # Business logic
├── docs/                # Documentation
├── tests/               # Test files
└── scripts/             # Utility scripts
```

---

## 🤝 Contributing

Contributions are welcome! Here’s how:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📫 Contact

For questions or feedback, feel free to [open an issue](https://github.com/yourusername/thorem/issues)
or reach out via [krishprajapati.me](https://krishprajapati.me).





