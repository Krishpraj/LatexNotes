import { useState, useEffect } from 'react';
import { Upload, FileText, ChevronRight, Github, Copy, Download} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';
import type { Project, Page } from '@/types';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Logo } from './components/ui/logo';
import { ProjectView } from './components/project-view';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [latex, setLatex] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Failed to parse saved projects');
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: nanoid(),
      name,
      description: '',
      pages: [],
      createdAt: new Date().toISOString(),
      notes: ''
    };
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    toast({
      title: "Project created",
      description: `Created new project: ${name}`,
    });
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentPage(null); // Clear current page when switching projects
    setLatex('');
  };

  const handleSelectPage = (project: Project, page: Page) => {
    setCurrentProject(project);
    setCurrentPage(page);
    setLatex(page.latex);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentProject || !currentPage) {
      toast({
        title: "Error",
        description: !selectedFile ? "Please select an image" : "Please select a page",
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
      
      // Update existing page instead of creating a new one
      const updatedProject = {
        ...currentProject,
        pages: currentProject.pages.map(page => 
          page.id === currentPage.id 
            ? { ...page, latex: data.latex }
            : page
        )
      };

      setProjects(prev => prev.map(p => 
        p.id === currentProject.id ? updatedProject : p
      ));
      setCurrentProject(updatedProject);
      setCurrentPage({ ...currentPage, latex: data.latex });
      setLatex(data.latex);

      toast({
        title: "Success",
        description: "LaTeX generated successfully",
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

  const handleUpdatePage = async (projectId: string, pageId: string, file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      setProjects(prev => prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            pages: project.pages.map(page => 
              page.id === pageId ? { ...page, latex: data.latex } : page
            )
          };
        }
        return project;
      }));

      setCurrentPage(prev => prev && prev.id === pageId ? { ...prev, latex: data.latex } : prev);
      setLatex(data.latex);
      toast({
        title: "Success",
        description: "Page updated successfully",
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

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    ));
  };

  const handleExportProject = (project: Project) => {
    const combinedLatex = `\\documentclass{article}
                            \\usepackage{amsmath}
                            \\usepackage{amssymb}
                            \\usepackage{amsfonts}

                            \\begin{document}

                            ${project.pages.map(page => `
                            % ${page.title}
                            ${page.latex}

                            \\newpage
                            `).join('\n')}
                            \\end{document}`;

    const blob = new Blob([combinedLatex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.tex`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Project exported",
      description: `${project.name} has been exported as LaTeX`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "LaTeX code has been copied to your clipboard",
    });
  };

  const handleCreateEmptyPage = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newPage: Page = {
      id: nanoid(),
      title: `Page ${project.pages.length + 1}`,
      latex: '',
      createdAt: new Date().toISOString()
    };

    const updatedProject = {
      ...project,
      pages: [...project.pages, newPage]
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? updatedProject : p
    ));
    setCurrentProject(updatedProject);
    setCurrentPage(newPage); // Set the new page as current
    setLatex('');
  };

  const handleDeletePage = (projectId: string, pageId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      pages: project.pages.filter(p => p.id !== pageId)
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? updatedProject : p
    ));
    setCurrentProject(updatedProject);
    setCurrentPage(null);
    setLatex('');
    
    toast({
      title: "Page deleted",
      description: "Page has been removed from the project",
    });
  };

  // Updated function to post LaTeX code to the server and get compiled PDF
  const handlePreviewRequest = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/compile-latex', { // updated port here
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex }),
      });
      if (!response.ok) throw new Error('Failed to compile LaTeX');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCompiledPdfUrl(url);
    } catch (error) {
      toast({
        title: "Preview Error",
        description: error instanceof Error ? error.message : "Preview failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <ProjectSidebar
        projects={projects}
        currentProject={currentProject || undefined}
        currentPage={currentPage || undefined}
        onSelectProject={handleSelectProject}
        onSelectPage={handleSelectPage}
        onCreateProject={handleCreateProject}
        onUpdatePage={handleUpdatePage}
        onExportProject={handleExportProject}
        onCreatePage={handleCreateEmptyPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="h-16 border-b border-gray-800/40 bg-gray-950">
          <div className="h-full px-6 flex items-center justify-between">
            <Logo />
            <a
              href="https://github.com/Kushalpraja/Thorem"
              className="p-2 rounded-md text-gray-400 hover:text-gray-100 
                         hover:bg-gray-800/50 transition-all"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </nav>

        <main className="flex-1 overflow-auto bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="max-w-5xl mx-auto px-4 py-12">
            {!currentProject ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-400 mb-4">No Project Selected</h2>
                <p className="text-gray-500 mb-4">Create a new project to get started</p>
              </div>
            ) : !currentPage ? (
              <ProjectView 
                project={currentProject} 
                onUpdateProject={handleUpdateProject}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{currentPage.title}</h3>
                    <p className="text-sm text-gray-400">
                      Created {new Date(currentPage.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {currentPage.latex && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(currentPage.latex)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy LaTeX
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportProject(currentProject)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>

                {/* Upload Card */}
                <Card className="bg-gray-900/50 border-gray-800/50">
                  <div className="p-8 space-y-6">
                    {currentPage.latex ? (
                      <div className="space-y-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null);
                              setLatex(currentPage.latex);
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Re-upload
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeletePage(currentProject.id, currentPage.id)}
                          >
                            Delete Page
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">LaTeX Code</h2>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(currentPage.latex)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (!showPreview) {
                                    await handlePreviewRequest();
                                  }
                                  setShowPreview(prev => !prev);
                                }}
                              >
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                              </Button>
                            </div>
                          </div>
                          
                          {showPreview && compiledPdfUrl ? (
                            <div className="mt-6 flex gap-0 w-full h-[80vh]">
                              {/* LaTeX code container spans half the width and full height, with scrollbars hidden */}
                              <pre className="w-1/2 h-full bg-gray-800/50 p-6 rounded-lg border border-gray-700 overflow-hidden">
                                <code>{currentPage.latex}</code>
                              </pre>
                              {/* PDF preview container spans half the width and full height; scrollbars hidden */}
                              <iframe
                                src={`${compiledPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-1/2 h-full border border-gray-700 rounded-lg"
                                title="LaTeX Preview"
                                style={{ overflow: 'hidden' }}
                              ></iframe>
                            </div>
                          ) : (
                            // When preview is off, display only the LaTeX code (updated to be large as well)
                            <pre className="w-full h-[80vh] bg-gray-800/50 p-6 rounded-lg border border-gray-700 overflow-hidden">
                              <code>{currentPage.latex}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    ) : (
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
                    )}
                    
                    {selectedFile && !currentPage.latex && (
                      <div className="mt-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-300">{selectedFile.name}</span>
                        </div>
                        <Button
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-6 text-lg"
                          onClick={handleUpload}
                          disabled={loading}
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
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
