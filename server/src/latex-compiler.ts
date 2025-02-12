import { execFile } from 'child_process';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Resolve tectonic command path relative to __dirname if necessary.
const rawPath = process.env.TECTONIC_PATH || 'tectonic';
const tectonicCommand = rawPath;

export async function compileLatex(req: Request, res: Response) {
  let texSource = req.body.latex;
  if (!texSource) {
    return res.status(400).json({ error: "Missing LaTeX source" });
  }
  // Remove Markdown code fences if present.
  if (texSource.startsWith('```')) {
    const lines = texSource.split('\n');
    // Remove the first line if it starts with ```
    if (lines[0].trim().startsWith('```')) {
      lines.shift();
    }
    // Remove the last line if it is exactly ```
    if (lines[lines.length - 1].trim() === '```') {
      lines.pop();
    }
    texSource = lines.join('\n');
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'latex-'));
  const tempTexFile = path.join(tempDir, 'source.tex');
  fs.writeFileSync(tempTexFile, texSource);

  console.log('Running tectonic with:', tempTexFile, '--outdir', tempDir);
  
  execFile(tectonicCommand, [tempTexFile, '--outdir', tempDir], (error, stdout, stderr) => {
    console.log('Tectonic stdout:', stdout);
    console.log('Tectonic stderr:', stderr);
    if (error) {
      console.error('Tectonic error:', error.message);
      return res.status(500).json({ error: error.message, stderr });
    }
    const pdfFile = path.join(tempDir, 'source.pdf');
    if (!fs.existsSync(pdfFile)) {
      return res.status(500).json({ error: 'PDF not generated' });
    }
    const pdfData = fs.readFileSync(pdfFile);
    res.type('application/pdf').send(pdfData);
    // (Optional cleanup) fs.rmSync(tempDir, { recursive: true, force: true });
  });
}
