import { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface ApiResponse {
  latex?: string;
  fileUrl?: string;
  overleafUrl?: string;
  error?: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [latex, setLatex] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [overleafUrl, setOverleafUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
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
      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLatex(data.latex || '');
      setFileUrl(data.fileUrl || null);
      setOverleafUrl(data.overleafUrl || null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Math Notes to LaTeX
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" component="label">
          Choose File
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        <Button 
          variant="contained" 
          onClick={handleUpload} 
          disabled={!selectedFile || loading}
          sx={{ ml: 2 }}
        >
          Convert
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading && <Typography>Processing image...</Typography>}

      {latex && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            LaTeX Code:
          </Typography>
          <TextField
            multiline
            fullWidth
            value={latex}
            rows={4}
            variant="outlined"
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Preview:
          </Typography>
          <Box sx={{ p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
            <InlineMath math={latex} />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (fileUrl) {
                  window.open(fileUrl, '_blank');
                }
              }}
            >
              Download LaTeX
            </Button>
            {overleafUrl && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => window.open(overleafUrl, '_blank')}
              >
                Open in Overleaf
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default App;
