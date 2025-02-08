# Math Notes to LaTeX Converter

## Setup

1. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

2. Configure environment:
- Copy `.env.example` to `.env`
- Add your Google Gemini API key in `.env`

3. Run the application:
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage
1. Open http://localhost:3000 in your browser
2. Click "Choose File" to upload a math notes image
3. Wait for the LaTeX code to be generated
4. View both the LaTeX code and rendered preview
