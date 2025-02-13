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
      - Use article class with 12pt font and these packages are already included and set up:
        
              \\documentclass[12pt]{article}

              % Essential packages for math and formatting
              \\usepackage{amsmath, amssymb, amsfonts, amsthm}
              \\usepackage{geometry, tcolorbox, xcolor, hyperref, fancyhdr, graphicx}
              \\usepackage{enumitem, physics, pgfplots, setspace, titlesec}
              \\usepackage{tikz, tikz-cd, xparse, xstring}

              % Page geometry
              \\geometry{a4paper, margin=1in}

              % Font setup
              \\renewcommand{\\familydefault}{\\sfdefault}

              % Define colors: Professional and subdued
                \\definecolor{theoremcolor}{RGB}{50,100,150} % Dark blue
                \\definecolor{lemmacolor}{RGB}{80,120,80}    % Dark green
                \\definecolor{corollarycolor}{RGB}{150,50,50}% Dark red
                \\definecolor{proofcolor}{RGB}{100,100,100}  % Gray
                

              % Theorem-like environments with tcolorbox
              \\newtcolorbox{theorem}[1][]{colback=theoremcolor!20,colframe=theoremcolor,title=Theorem #1}
              \\newtcolorbox{lemma}[1][]{colback=lemmacolor!20,colframe=lemmacolor,title=Lemma #1}
              \\newtcolorbox{corollary}[1][]{colback=corollarycolor!20,colframe=corollarycolor,title=Corollary #1}
              \\newtcolorbox{proofbox}[1][]{colback=proofcolor!20,colframe=black,title=Proof}

              % Title setup
            
              \\date{\\today}

              \\begin{document}

            -  ONLY use the given environments for theorems, lemmas, corollaries, and proofs
            - Do not create or edit any new environments at any cost 
            - Title should be appropriated to the image topic

            - If there are any scatter any of these around:
              - Formal theorem statement of the process
              - Lemma 
              - Proof
              - Corollary 

            - Include the following examples:
              - Example in R^2
              - Example in R^3
            
             ensure everything is compact and easy to read (page should  be able to fit multiple examples and theorems)
             ensure everything is from the image and that u include examples
             include plots and diagrams at least 1-2 in the document
             keep it neat and organized
             ensure evertyhing stated is correct and accurate
              Make font standard nothing too fancy keep it sans serif 
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
