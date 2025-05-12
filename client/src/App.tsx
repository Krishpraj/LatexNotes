import { useState, useEffect } from 'react';
import { Upload, FileText, ChevronRight, Copy, Download, Menu, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';
import type { Project, Page } from '@/types';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Logo } from './components/ui/logo';
import { ProjectView } from './components/project-view';
import { ThemeToggle, useTheme } from './components/ui/theme-provider';

function App() {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [latex, setLatex] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

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

  useEffect(() => {
    setCompiledPdfUrl(null);
    setShowPreview(false);
  }, [currentPage]);

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

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    // Create a copy of the projects array with the updated project
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    );
    
    // Update the projects state
    setProjects(updatedProjects);
    
    // If the current project is being updated, also update the currentProject state
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject({ ...currentProject, ...updates });
    }
    
    // Provide feedback for significant updates
    if (updates.description !== undefined || updates.notes !== undefined) {
      toast({
        title: "Project updated",
        description: "Your changes have been saved",
      });
    }
  };

  const handleExportProject = (project: Project) => {
    // Remove LaTeX code block markers (```) from the pages
    const combinedLatex = `${project.pages.map(page => {
      const cleanLatex = page.latex.replace(/```latex\n?|\n?```/g, '');
      // Remove \begin{document}, \end{document} and preamble from individual pages
      const strippedLatex = cleanLatex
        .replace(/\\documentclass.*?\\begin{document}/s, '')
        .replace(/\\end{document}/, '')
        .trim();
      return `
      \\section{${page.title}}
      ${strippedLatex}
      
      \\newpage
      `;
    }).join('\n')}`;

    // Add single preamble and document environment
    const finalLatex = `\\documentclass[12pt]{article}
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

                        \\title{${project.name}}
                        \\author{Generated by LaTexNotes}
                        \\date{\\today}

                        \\begin{document}
                             ${combinedLatex}
                        \\end{document}`;

    const blob = new Blob([finalLatex], { type: 'text/plain' });
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

  const handleDeleteProject = (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setCurrentPage(null);
    }
    toast({
      title: "Project deleted",
      description: "Project has been permanently removed",
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

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: newName } : p
    ));
    toast({
      title: "Project renamed",
      description: `Project has been renamed to ${newName}`,
    });
  };

  const handleRenamePage = (projectId: string, pageId: string, newName: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          pages: project.pages.map(page =>
            page.id === pageId ? { ...page, title: newName } : page
          )
        };
      }
      return project;
    }));
    toast({
      title: "Page renamed",
      description: `Page has been renamed to ${newName}`,
    });
  };

  const handleExportAsPdf = async (project: Project) => {
    // Generate the full LaTeX document
    const combinedLatex = `${project.pages.map(page => {
      const cleanLatex = page.latex.replace(/```latex\n?|\n?```/g, '');
      const strippedLatex = cleanLatex
        .replace(/\\documentclass.*?\\begin{document}/s, '')
        .replace(/\\end{document}/, '')
        .trim();
      return `
      % ${page.title}
      ${strippedLatex}
      
      \\newpage
      `;
    }).join('\n')}`;

    // Add preamble and document environment
    const finalLatex = `\\documentclass[12pt]{article}
                        \\usepackage{amsmath, amssymb, amsfonts, amsthm}
                        \\usepackage{geometry, tcolorbox, xcolor, hyperref, fancyhdr, graphicx}
                        \\usepackage{enumitem, physics, pgfplots, setspace, titlesec}
                        \\usepackage{tikz, tikz-cd, xparse, xstring}
                        \\geometry{a4paper, margin=1in}
                        \\renewcommand{\\familydefault}{\\sfdefault}
                        \\definecolor{theoremcolor}{RGB}{50,100,150}
                        \\definecolor{lemmacolor}{RGB}{80,120,80}
                        \\definecolor{corollarycolor}{RGB}{150,50,50}
                        \\definecolor{proofcolor}{RGB}{100,100,100}
                        \\newtcolorbox{theorem}[1][]{colback=theoremcolor!20,colframe=theoremcolor,title=Theorem #1}
                        \\newtcolorbox{lemma}[1][]{colback=lemmacolor!20,colframe=lemmacolor,title=Lemma #1}
                        \\newtcolorbox{corollary}[1][]{colback=corollarycolor!20,colframe=corollarycolor,title=Corollary #1}
                        \\newtcolorbox{proofbox}[1][]{colback=proofcolor!20,colframe=black,title=Proof}
                        

                         % Title setup
                        \\title{${project.name}}
                        \\author{Generated by LaTexNotes}
                        \\date{\\today}

                        \\begin{document}
                        
                        \\maketitle
                        \\tableofcontents
                        \\newpage
                        
                             ${combinedLatex}
                        \\end{document}`;

    try {
      const response = await fetch('http://localhost:3001/api/compile-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex: finalLatex }),
      });
      
      if (!response.ok) throw new Error('Failed to compile PDF');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "PDF exported",
        description: `${project.name} has been exported as PDF`,
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: error instanceof Error ? error.message : "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Sidebar with transition */}
      <div className={`
        transform transition-all duration-300 ease-in-out
        ${sidebarVisible ? 'w-72' : 'w-0'}
        ${sidebarVisible ? 'opacity-100' : 'opacity-0'}
        fixed md:relative z-50 h-full overflow-hidden
        ${theme === 'dark' ? 'bg-black' : 'bg-white border-r border-[#e0e0e0]'}
        shadow-lg
      `}>
        <ProjectSidebar
          projects={projects}
          currentProject={currentProject || undefined}
          currentPage={currentPage || undefined}
          onSelectProject={handleSelectProject}
          onSelectPage={handleSelectPage}
          onCreateProject={handleCreateProject}
          onExportProject={handleExportProject}
          onCreatePage={handleCreateEmptyPage}
          onDeleteProject={handleDeleteProject}
          onDeletePage={handleDeletePage}
          onRenameProject={handleRenameProject}
          onRenamePage={handleRenamePage}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className={`h-16 border-b backdrop-blur-xl ${theme === 'dark' ? 'border-white/10 bg-black/90' : 'border-black/5 bg-white/90'}`}>
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className={theme === 'dark' ? "hover:bg-white/5" : "hover:bg-black/5"}
              >
                {sidebarVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <Logo />
                {currentProject && (
                  <div className={`flex items-center ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                    <span className="mx-2">/</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{currentProject.name}</span>
                    {currentPage && (
                      <>
                        <span className="mx-2">/</span>
                        <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{currentPage.title}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {currentProject && (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportAsPdf(currentProject)}
                    className="rounded-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(currentProject.id)}
                    className={`rounded-full ${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' : 'text-red-500 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className={`
          flex-1 overflow-auto
          ${theme === 'dark' ? 'bg-black' : 'bg-white'}
          transition-all duration-300
          ${sidebarVisible ? 'md:ml-0' : 'ml-0'}
        `}>
          {!currentProject ? (
            <div className="text-center p-8">
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>No Project Selected</h2>
              <p className={theme === 'dark' ? 'text-white/60' : 'text-black/60'}>Create a new project to get started</p>
            </div>
          ) : !currentPage ? (
            <div className="p-8">
              <ProjectView 
                project={currentProject} 
                onUpdateProject={handleUpdateProject}
              />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                <div>
                  <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{currentPage.title}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                    Created {new Date(currentPage.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {currentPage.latex && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => copyToClipboard(currentPage.latex)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy LaTeX
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleExportProject(currentProject)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                {currentPage.latex ? (
                  <div className="h-full">
                    <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LaTeX Code</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full" onClick={() => copyToClipboard(currentPage.latex)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
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
                      <div className="flex h-[calc(100vh-12rem)] divide-x divide-gray-200">
                        <pre className={`w-1/2 overflow-auto p-6 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/5'} rounded-lg m-2`}>
                          <code className={`text-sm ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>{currentPage.latex}</code>
                        </pre>
                        <iframe
                          src={`${compiledPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-1/2 bg-white rounded-lg m-2 shadow-sm"
                          title="LaTeX Preview"
                        />
                      </div>
                    ) : (
                      <pre className={`h-[calc(100vh-12rem)] overflow-auto p-6 ${theme === 'dark' ? 'bg-black/80' : 'bg-black/5'} rounded-lg m-4`}>
                        <code className={`text-sm ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>{currentPage.latex}</code>
                      </pre>
                    )}
                  </div>
                ) : (
                  <div className="p-8">
                    <Card className={`${theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-black/10'} rounded-xl shadow-sm`}>
                      <div className="p-8 space-y-6">
                        <label className={`group relative block border-2 border-dashed ${theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-black/20 hover:border-black/40'} rounded-xl p-12 transition-all cursor-pointer`}>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                          <div className="flex flex-col items-center">
                            <div className={`p-4 ${theme === 'dark' ? 'bg-white/10 group-hover:bg-white/15' : 'bg-black/5 group-hover:bg-black/10'} rounded-full mb-4 transition-colors`}>
                              <Upload className={`h-8 w-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                            </div>
                            <p className={`${theme === 'dark' ? 'text-white/80' : 'text-black/80'} mb-2 font-medium`}>Drop your image here or click to upload</p>
                            <p className={theme === 'dark' ? 'text-white/50' : 'text-black/50'}>Supports PNG, JPG, or WebP</p>
                          </div>
                        </label>
                        
                        {selectedFile && !currentPage.latex && (
                          <div className="mt-4">
                            <div className={`flex items-center gap-3 p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-lg border`}>
                              <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                              <span className={theme === 'dark' ? 'text-white/90' : 'text-black/90'}>{selectedFile.name}</span>
                            </div>
                            <Button
                              className={`w-full mt-4 ${theme === 'dark' ? 'bg-white hover:bg-white/90 text-black' : 'bg-black hover:bg-black/90 text-white'} py-6 text-lg rounded-xl`}
                              onClick={handleUpload}
                              disabled={loading}
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <div className={`animate-spin rounded-full h-5 w-5 border-2 ${theme === 'dark' ? 'border-black/30 border-t-black' : 'border-white/30 border-t-white'}`} />
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
