import { useState } from 'react';
import { Upload, FileText, ChevronRight, Github, Copy, Download } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { toast } from "./hooks/use-toast";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [latex, setLatex] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to convert",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setLatex(data.latex);
      toast({
        title: "Conversion successful",
        description: "Your math notes have been converted to LaTeX",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "LaTeX code has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
              MathLaTeX
            </span>
          </div>
          <a href="https://github.com/yourusername/mathlatex" className="text-gray-400 hover:text-white transition-colors">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Math Notes to LaTeX
          </h1>
          <p className="text-gray-400 text-center max-w-2xl">
            Transform your handwritten mathematical equations into perfect LaTeX code using AI.
            Just upload an image and get ready-to-use LaTeX in seconds.
          </p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
          <div className="p-8 space-y-6">
            <label className="group relative block border-2 border-dashed border-gray-700 rounded-xl p-12 hover:border-blue-500 transition-all cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-gray-400 mb-2 font-medium">Drop your image here or click to upload</p>
                <p className="text-gray-500 text-sm">Supports PNG, JPG, or WebP</p>
              </div>
            </label>

            {selectedFile && (
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-gray-300">{selectedFile.name}</span>
              </div>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-lg"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  Converting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Convert to LaTeX
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </Card>

        {latex && (
          <Card className="mt-8 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Generated LaTeX</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(latex)}
                    className="hover:text-blue-500"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const blob = new Blob([latex], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'math_notes.tex';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="hover:text-blue-500"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <pre className="bg-gray-800/50 p-6 rounded-lg overflow-x-auto text-sm text-gray-300 border border-gray-700">
                <code>{latex}</code>
              </pre>
              <form
                action="https://www.overleaf.com/docs"
                method="post"
                target="_blank"
                className="flex justify-end"
              >
                <input type="hidden" name="snip" value={`\\documentclass{article}\n\\usepackage{amsmath}\n\\usepackage{amssymb}\n\\usepackage{amsfonts}\n\n\\begin{document}\n${latex}\n\\end{document}`} />
                <Button type="submit" className="bg-green-600 hover:bg-green-500 text-white">
                  Open in Overleaf
                </Button>
              </form>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;
