import React from 'react';

interface PdfProps {
  pdfUrl: string | null;
}

const PdfViewer: React.FC<PdfProps> = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="flex-1 flex flex-col items-right ml-auto">
      <h2 className="text-xl font-bold mb-4">LaTeX PDF</h2>
      <iframe
        src={`${pdfUrl}#toolbar=0`}
        width="100%"
        height="600px"
        style={{ border: 'none' }}
        title="PDF Viewer"
      />
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
      >
        Download PDF
      </a>
    </div>
  );
};

export default PdfViewer;