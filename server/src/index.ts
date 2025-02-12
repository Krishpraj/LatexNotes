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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server root directory
dotenv.config({ path: resolve(__dirname, '../.env') });

// Add verbose logging for debugging
console.log('Environment check:');
console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
console.log('Current directory:', __dirname);
console.log('Env file path:', resolve(__dirname, '../.env'));

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

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

// Ensure temp directory exists
await fs.mkdir(TEMP_DIR, { recursive: true });

// Add static file serving
app.use('/files', express.static(TEMP_DIR));

// Add debug logging function
function debugLog(message: string, data: any) {
  console.log(`[DEBUG] ${message}:`, data);
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Initialize the model - using gemini-pro-vision as it's for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the image data
    const imageData = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    // Create the prompt parts
    const parts = [
      {
      text: `Convert this mathematical expression into LaTeX code. Generate a complete article document with the following specifications:
      - Use article class with 12pt font
      - Include packages: amsmath, amssymb, amsthm, tcolorbox, geometry
      - Create theorem environments in different colored boxes (blue for theorems, green for lemmas, red for corollaries)
      - Title should be appropriat to the image topic
      - Include only if relevant other wise keep it simple and ez to read:
        - Formal theorem statement of the process
        - Lemma about orthogonality
        - Proof using induction
        - Corollary about orthonormal basis
        - Example in R^2
      Only provide the code in text format without any explanation.`
      },
      imageData
    ];

    // Generate content
    const result = await model.generateContent(parts);
    const latex = result.response.text();
    
    res.json({ latex });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const PORT = process.env.PORT || 3001;

validateApiKey().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
