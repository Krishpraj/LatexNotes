import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import bodyParser from 'body-parser';
import { compileLatex } from './latex-compiler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

console.log('Environment check:');
console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
console.log('Current directory:', __dirname);
console.log('Env file path:', resolve(__dirname, '../.env'));

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function validateApiKey() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    await model.generateContent("test");
    console.log('✅ API key validated successfully');
  } catch (error) {
    console.error('❌ API key validation failed:', error);
    process.exit(1);
  }
}

const TEMP_DIR = path.join(__dirname, '../public');
await fs.mkdir(TEMP_DIR, { recursive: true });
app.use('/files', express.static(TEMP_DIR));

function debugLog(message: string, data: any) {
  console.log(`[DEBUG] ${message}:`, data);
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const imageData = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };
    const parts = [
      {
        text: `Convert this mathematical expression into LaTeX code. Generate a complete article document with the following specifications:
        - Use article class with 12pt font
        - Include packages: amsmath, amssymb, amsthm, tcolorbox, geometry
        - Create theorem environments in different colored boxes (blue for theorems, green for lemmas, red for corollaries)
        - Title should be appropriated to the image topic
        - Include only if relevant otherwise keep it simple and easy to read:
          - Formal theorem statement of the process
          - Lemma about orthogonality
          - Proof using induction
          - Corollary about orthonormal basis
          - Example in R^2
        Only provide the code in text format without any explanation.`
      },
      imageData
    ];
    const result = await model.generateContent(parts);
    const latex = result.response.text();
    res.json({ latex });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.post('/api/compile-latex', compileLatex);

const PORT = process.env.PORT || 3001;
validateApiKey().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
