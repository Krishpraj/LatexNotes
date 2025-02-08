import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Math Notes to LaTeX</h1>
          <p className="text-muted-foreground">Convert handwritten math to LaTeX</p>
        </header>

        <Card className="p-6">
          <div className="space-y-4">
            <label className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-primary">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Upload image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span>{selectedFile.name}</span>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? "Converting..." : "Convert to LaTeX"}
            </Button>
          </div>
        </Card>

        {latex && (
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">Generated LaTeX</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{latex}</code>
            </pre>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([latex], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'math_notes.tex';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download LaTeX
              </Button>
              <form
                action="https://www.overleaf.com/docs"
                method="post"
                target="_blank"
              >
                <input
                  type="hidden"
                  name="snip"
                  value={`\\documentclass{article}
                      \\usepackage{amsmath}
                      \\usepackage{amssymb}
                      \\usepackage{amsfonts}

                      \\begin{document}
                      ${latex}
                      \\end{document}`}
                />
                <Button type="submit">Open in Overleaf</Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;
