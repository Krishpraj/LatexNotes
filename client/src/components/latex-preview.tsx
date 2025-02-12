import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';
import { useEffect, useState } from 'react';

interface LatexPreviewProps {
  latex: string;
}

export function LatexPreview({ latex }: LatexPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    try {
      const rendered = renderToString(latex, {
        throwOnError: false,
        displayMode: true
      });
      setHtml(rendered);
    } catch (e) {
      console.error('Failed to render LaTeX:', e);
      setHtml('<span style="color: red">Error rendering LaTeX</span>');
    }
  }, [latex]);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-8 max-w-[800px] mx-auto">
        <div className="prose prose-sm max-w-none">
          <div 
            className="latex-preview"
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        </div>
      </div>
    </div>
  );
}
