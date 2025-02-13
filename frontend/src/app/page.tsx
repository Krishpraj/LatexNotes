'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import PdfViewer from './pdf';

export default function LatexNotesApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/generate-latex-notes', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLatexCode(data.latex_code);
      setPdfUrl(`http://localhost:5000/pdf/${data.pdf_url}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="relative">
        <motion.div
          initial={{ width: sidebarOpen ? 250 : 0 }}
          animate={{ width: sidebarOpen ? 250 : 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-gray-800 h-full overflow-hidden ${sidebarOpen ? 'p-4' : ''}`}
        >
          {sidebarOpen && (
            <div>
              <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setSidebarOpen(false)}>
                Close Sidebar
              </button>
            </div>
          )}
        </motion.div>
        {!sidebarOpen && (
          <motion.button
            className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            Open Sidebar
          </motion.button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col text-center px-4">
        <h1 className="text-2xl font-bold mb-4">LaTeX Notes Generator</h1>
        <p className="mb-4">Upload an image to generate LaTeX notes.</p>

        <label htmlFor="file-upload" className="bg-gray-700 text-white px-4 py-2 rounded flex text-center items-center gap-2 cursor-pointer">
          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          <Upload size={16} /> Upload Image
        </label>

        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleSubmit}>
          Generate LaTeX Notes
        </button>

        {loading && <div className="mt-4 text-white">Generating LaTeX code, please wait...</div>}

        <div className="flex flex-row w-full mt-4 gap-4">
          {latexCode && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">Generated LaTeX Code</h2>
              <pre className="bg-gray-800 p-4 rounded w-full max-w-4xl overflow-auto text-left h-[600px]">
                {latexCode}
              </pre>
            </div>
          )}

          <PdfViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </div>
  );
}
